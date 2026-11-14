import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 不接 KaTeX：核查过 76 篇正文，所有 $...$ 都是 JSP EL 表达式 ${...}
// 与 Java 内部类符号 val$x，没有一处是 LaTeX 公式。接 remark-math 会把
// 中文当成公式内容误渲染，得不偿失。若以后真有公式，再加插件即可。

// GitHub Pages 项目页。site + base 组合后即为线上绝对地址，
// 与原站 https://zhangchang47.github.io/BlogVuePress/ 完全一致。
export default defineConfig({
  site: 'https://zhangchang47.github.io',
  base: '/BlogVuePress/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404'),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});
