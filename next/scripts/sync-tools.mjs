/**
 * 构建前同步工具注册表。
 * 校验 -> 排序 -> 生成索引数据 -> 检查 embed 产物是否存在。
 * 加新工具只需往 src/data/tools.json 追加一条；页面、导航计数、索引页自动更新。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'src/data/tools.json');
const OUT = path.join(ROOT, 'src/data/tools.index.json');
const REPORT = path.join(HERE, 'tools-report.json');
const PUBLIC_TOOLS = path.join(ROOT, 'public/tools');
const PAGES_TOOLS = path.join(ROOT, 'src/pages/tools');

const REQUIRED = ['id', 'title', 'desc', 'icon', 'tags', 'mode', 'entry', 'status', 'version', 'updated'];
// page = 站内详情页，产物由 src/pages/tools/<id>.astro 生成并继承主站主题
const MODES = ['link', 'embed', 'native', 'page'];
const STATUSES = ['online', 'beta', 'wip', 'demo'];

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const tools = Array.isArray(raw.tools) ? raw.tools : [];
const errors = [];
const seen = new Set();

for (const t of tools) {
  for (const k of REQUIRED) if (t[k] === undefined || t[k] === '') errors.push(`${t.id || '?'}: 缺字段 ${k}`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(t.id || '')) errors.push(`${t.id}: id 只能是小写字母/数字/连字符`);
  if (seen.has(t.id)) errors.push(`${t.id}: id 重复`);
  seen.add(t.id);
  if (!MODES.includes(t.mode)) errors.push(`${t.id}: mode 必须是 ${MODES.join('/')}`);
  if (!STATUSES.includes(t.status)) errors.push(`${t.id}: status 必须是 ${STATUSES.join('/')}`);
  if (!Array.isArray(t.tags)) errors.push(`${t.id}: tags 必须是数组`);
  if (t.mode === 'embed') {
    const p = path.join(PUBLIC_TOOLS, t.id, 'index.html');
    if (!fs.existsSync(p)) errors.push(`${t.id}: embed 产物不存在 public/tools/${t.id}/index.html`);
  }
  if (t.mode === 'page') {
    const p = path.join(PAGES_TOOLS, `${t.id}.astro`);
    if (!fs.existsSync(p)) errors.push(`${t.id}: 站内详情页不存在 src/pages/tools/${t.id}.astro`);
  }
}

const sorted = [...tools].sort((a, b) =>
  (a.order ?? 999) - (b.order ?? 999) || String(b.updated).localeCompare(String(a.updated))
);
const available = sorted.filter((t) => t.status !== 'wip').length;
const index = {
  generatedBy: 'scripts/sync-tools.mjs',
  contract: {
    routes: ['/tools/', '/tools/<id>/'],
    modes: MODES,
    events: ['tool:ready', 'blog:theme', 'tool:resize'],
    tokens: ['--bg', '--bg-solid', '--ink', '--muted', '--violet', '--mint', '--line', '--radius'],
  },
  count: sorted.length,
  available,
  byMode: Object.fromEntries(MODES.map((m) => [m, sorted.filter((t) => t.mode === m).length])),
  tools: sorted,
};

fs.writeFileSync(OUT, JSON.stringify(index, null, 2) + '\n', 'utf8');
fs.writeFileSync(REPORT, JSON.stringify({ count: sorted.length, available, errors, checkedAt: 'build-time' }, null, 2), 'utf8');

console.log(`[sync:tools] ${sorted.length} 个工具 / 可用 ${available} / embed ${index.byMode.embed} / page ${index.byMode.page}`);
if (errors.length) {
  errors.forEach((e) => console.error('[sync:tools] ' + e));
  process.exitCode = 1;
}
