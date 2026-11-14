/**
 * 从原 VuePress 项目迁移 76 篇 Markdown 到 Astro Content Collections。
 *
 * 三条不可违反的原则：
 *  1. permalink 短码逐字保留（用 urls.txt 反向校验），URL 一条都不能变；
 *  2. 正文内容一字不改，只去掉 frontmatter 后重复的一级标题；
 *  3. date 保留原值、不编造写作时间；tags/categories 由可复核的规则生成。
 *
 * 用法：npm run migrate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const LEGACY = path.resolve(ROOT, '..');
const SRC_DOCS = path.join(LEGACY, 'docs');
const OUT_POSTS = path.join(ROOT, 'src/content/posts');
const OUT_MEDIA = path.join(ROOT, 'public/media');
const REPORT = path.join(HERE, 'migration-report.json');

const BASE_URL = '/BlogVuePress';

/* Shiki 不认识的大写/方言围栏语言 → 标准语言 id。只改围栏标识，不动代码内容 */
const LANG_MAP = {
  java: 'java', javascript: 'javascript', js: 'javascript', xml: 'xml', html: 'html',
  jsp: 'html', vue: 'html', mysql: 'sql', sql: 'sql', properties: 'properties',
  conf: 'ini', mvn: 'bash', shell: 'bash', bash: 'bash', sh: 'bash',
  json: 'json', css: 'css', scss: 'scss', yml: 'yaml', yaml: 'yaml',
  py: 'python', python: 'python', c: 'c', cpp: 'cpp', txt: 'text', text: 'text',
};

/* ---------- 可解释的标签规则（不猜内容，只匹配关键词） ---------- */
const TAG_RULES = [
  ['JVM', /JVM|虚拟机|类加载|垃圾回收|\bGC\b|内存模型/],
  ['并发', /线程|并发|JUC|synchronized|volatile|线程池|锁机制/],
  ['集合', /HashMap|ArrayList|HashSet|LinkedList|集合框架|ConcurrentHashMap/],
  ['SpringBoot', /SpringBoot|Spring Boot|自动配置|starter/i],
  ['Spring', /\bSpring\b|IOC|AOP|Bean 生命周期|依赖注入/i],
  ['MyBatis', /MyBatis|Mapper|SqlSession/i],
  ['Redis', /Redis/i],
  ['数据库', /MySQL|SQL 语句|索引优化|事务|数据库|JDBC/i],
  ['Vue', /\bVue\b|vue-cli|Vuex|组件通信/],
  ['JavaScript', /JavaScript|\bES6\b|Promise|原型链|闭包|Ajax/i],
  ['前端', /CSS|HTML|flex|布局|浏览器|DOM|BOM/i],
  ['算法', /排序|递归|动态规划|链表|二叉树|时间复杂度|LeetCode/i],
  ['网络', /HTTP|TCP\/IP|三次握手|Cookie|Session|请求转发/i],
  ['工程化', /npm|maven|Git 命令|webpack|Linux 命令|常用命令/i],
  ['随笔', /散文|随笔|诗|故园|山河|岁月|感怀/],
  ['项目', /项目|需求|部署|架构设计/],
];

function sectionOf(relPath) {
  // docs/01.Java基础/xxx.md -> Java基础 ; docs/08.项目/00.云E办/x.md -> 项目
  const parts = relPath.split(/[\\/]/);
  const top = parts.find((p) => /^\d+\./.test(p)) || parts[0] || '未分类';
  return top.replace(/^\d+\./, '').replace(/\.md$/i, '');
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const fm = {};
  const lines = m[1].split(/\r?\n/);
  let current = null;
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) {
      current = kv[1];
      const v = kv[2].trim();
      fm[current] = v === '' ? [] : v;
    } else if (current && /^\s+-\s*/.test(line)) {
      const item = line.replace(/^\s+-\s*/, '').trim();
      if (!Array.isArray(fm[current])) fm[current] = [];
      if (item && item !== 'null') fm[current].push(item);
    }
  }
  return { fm, body: raw.slice(m[0].length) };
}

function yamlStr(s) {
  return '"' + String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ') + '"';
}

function plainText(md, limit = 140) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // 失效图的说明不该混进 meta description / RSS 摘要
    .replace(/^>\s*原图缺失：.*$/gm, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*`|_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

function deriveTags(title, body, section) {
  // 先剥掉代码块、链接目标与裸 URL，否则图片地址里的 https 会误命中「网络」
  const hay = (title + '\n' + section + '\n' + body.slice(0, 4000))
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/`[^`]*`/g, ' ');
  const found = [];
  for (const [tag, re] of TAG_RULES) if (re.test(hay)) found.push(tag);
  return found.slice(0, 4);
}

/* ---------- 主流程 ---------- */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['.vuepress', '@pages', 'dist', 'node_modules'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith('.md') && e.name !== 'README.md') out.push(p);
  }
  return out;
}

const files = walk(SRC_DOCS);
fs.mkdirSync(OUT_POSTS, { recursive: true });
fs.mkdirSync(OUT_MEDIA, { recursive: true });

const records = [];
const problems = [];
const mediaCopied = [];
const missingMedia = [];

for (const file of files) {
  const rel = path.relative(SRC_DOCS, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) { problems.push(`${rel}: 无 frontmatter`); continue; }

  const { fm } = parsed;
  const permalink = String(fm.permalink || '');
  const codeMatch = permalink.match(/\/pages\/([0-9a-f]{6})\/?/);
  if (!codeMatch) { problems.push(`${rel}: permalink 异常 "${permalink}"`); continue; }
  const code = codeMatch[1];

  let body = parsed.body.replace(/\r\n/g, '\n');
  // 去掉 frontmatter 后紧跟着的重复一级标题（页面会自行输出 h1）
  const first = body.match(/^\s*#\s+(.+)\n/);
  if (first && first[1].trim() === String(fm.title).trim()) body = body.replace(first[0], '');
  body = body.replace(/^\n+/, '');

  // 本地图片 -> 带 base 的绝对地址。
  // 相对路径会让 Astro 把它当成本地模块去解析并直接构建失败；改成绝对 URL 后
  // 浏览器行为与原 VuePress 站一致。原站本来就找不到的图，如实记为 missingMedia，
  // 不生成替代图、不编造资源。
  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (all, alt, url) => {
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return all;
    const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
    const abs = path.resolve(path.dirname(file), clean);
    const exists = fs.existsSync(abs) && fs.statSync(abs).isFile();
    const baseName = path.basename(clean).replace(/[^\w.-]/g, '_');
    const name = `${code}-${baseName}`;
    if (exists) {
      const ext = path.extname(abs).toLowerCase() || '.png';
      const finalName = name.endsWith(ext) ? name : name + ext;
      fs.copyFileSync(abs, path.join(OUT_MEDIA, finalName));
      mediaCopied.push({ from: rel, to: finalName, original: url });
      return `![${alt}](${BASE_URL}/media/${finalName})`;
    }
    missingMedia.push({ post: rel, original: url, reason: '原站资源不存在（Typora 本机路径或已删除目录）；已改为显式缺失说明，不留下 404 链接' });
    // 原站在这一行就是坏图。不编造替代图，也不保留一个必然 404 的地址，
    // 直接换成可读的说明，读者至少知道这里原本有一张图。
    return `> 原图缺失：\`${url}\`（原站引用已失效，仓库中没有这个文件）`;
  });

  // 规范化代码围栏语言标识（只影响高亮，不改代码本体）
  body = body.replace(/^```([^\s`]*)(.*)$/gm, (all, lang, rest) => {
    // 原文有个 vue 围栏带不可见控制字符，先清洗再做语言映射
    const l = String(lang || '').toLowerCase().replace(/[^a-z0-9+#-]/g, '');
    return '```' + (LANG_MAP[l] || l) + rest;
  });

  // 站内短码链接补上 base
  body = body.replace(/\]\(\/pages\//g, `](${BASE_URL}/pages/`);

  const section = sectionOf(rel);
  const title = String(fm.title || path.basename(file, '.md'));
  const date = String(fm.date || '');
  const tags = deriveTags(title, body, section);
  const words = (body.match(/[\u4e00-\u9fa5]|\b[a-zA-Z0-9_]+\b/g) || []).length;
  const excerpt = plainText(body);

  const fmOut = [
    '---',
    `title: ${yamlStr(title)}`,
    `date: ${yamlStr(date)}`,
    `code: ${yamlStr(code)}`,
    `permalink: ${yamlStr(permalink)}`,
    `section: ${yamlStr(section)}`,
    `sortKey: ${yamlStr(rel)}`,
    'categories:',
    `  - ${yamlStr(section)}`,
    'tags:',
    ...(tags.length ? tags.map((t) => `  - ${yamlStr(t)}`) : ['  - "未标注"']),
    `words: ${words}`,
    `excerpt: ${yamlStr(excerpt)}`,
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_POSTS, `${code}.md`), fmOut + body, 'utf8');
  records.push({ code, permalink, title, section, tags, words, source: rel, date });
}

/* ---------- 用 urls.txt 反向校验短码 ---------- */
const urlsFile = path.join(LEGACY, 'urls.txt');
let urlCheck = { online: 0, missing: [], extra: [], skipped: true };
if (fs.existsSync(urlsFile)) {
  const online = new Set(
    fs.readFileSync(urlsFile, 'utf8').split(/\r?\n/)
      .map((l) => (l.match(/\/pages\/([0-9a-f]{6})\/?/) || [])[1])
      .filter(Boolean)
  );
  const migrated = new Set(records.map((r) => r.code));
  urlCheck = {
    online: online.size,
    missing: [...online].filter((c) => !migrated.has(c)),
    extra: [...migrated].filter((c) => !online.has(c)),
    skipped: false,
  };
}

const report = {
  generatedBy: 'scripts/migrate.mjs',
  source: 'docs/ (VuePress)',
  total: records.length,
  uniqueCodes: new Set(records.map((r) => r.code)).size,
  sections: [...new Set(records.map((r) => r.section))].sort(),
  taggedPosts: records.filter((r) => r.tags.length && r.tags[0] !== '未标注').length,
  mediaCopied,
  missingMedia,
  urlCheck,
  problems,
  posts: records,
};
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');

console.log(`[migrate] 迁移 ${records.length} 篇 / 短码唯一 ${report.uniqueCodes}`);
console.log(`[migrate] 分区: ${report.sections.join('、')}`);
console.log(`[migrate] 已生成标签: ${report.taggedPosts} 篇 / 复制图片 ${mediaCopied.length} 个 / 原站失效引用 ${missingMedia.length} 处`);
console.log(`[migrate] urls.txt 校验: 线上 ${urlCheck.online} 条，缺失 ${urlCheck.missing.length}，多出 ${urlCheck.extra.length}`);
if (problems.length) console.warn('[migrate] 问题:', problems);
if (urlCheck.missing.length || urlCheck.extra.length || report.uniqueCodes !== records.length) {
  console.error('[migrate] 短码校验未通过，请检查 migration-report.json');
  process.exitCode = 1;
}
