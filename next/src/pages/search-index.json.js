import { getCollection } from 'astro:content';

const BASE = '/BlogVuePress/';

// 只去掉 Markdown 标记，保留代码块里的标识符 —— 技术笔记要搜的正是
// ThreadLocal、@Transactional 这类正文/代码关键词，不能把 code 整个丢掉。
function toText(md) {
  return String(md || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[>*`|_~#]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getCollection('posts');
  const data = posts.map((p) => ({
    title: p.data.title,
    url: `${BASE}pages/${p.data.code}/`,
    code: p.data.code,
    section: p.data.section,
    tags: p.data.tags,
    text: (p.data.title + ' ' + p.data.section + ' ' + (p.data.tags || []).join(' ') +
      ' ' + toText(p.body)).slice(0, 60000),
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
