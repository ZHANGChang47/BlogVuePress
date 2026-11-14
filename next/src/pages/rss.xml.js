import { getCollection } from 'astro:content';

const SITE = 'https://zhangchang47.github.io/BlogVuePress';

function xmlEscape(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

export async function GET() {
  const posts = (await getCollection('posts'))
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, 40);

  const items = posts.map((p) => {
    const url = `${SITE}/pages/${p.data.code}/`;
    const pub = new Date(p.data.date.replace(' ', 'T') + 'Z');
    return `    <item>
      <title>${xmlEscape(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${isNaN(pub) ? '' : pub.toUTCString()}</pubDate>
      <category>${xmlEscape(p.data.section)}</category>
      <description>${xmlEscape(p.data.excerpt)}</description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>百里登风的博客</title>
    <link>${SITE}/</link>
    <description>张弓折扇风雨历，畅叙平生快意！</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
