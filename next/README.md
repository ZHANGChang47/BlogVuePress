# BlogVuePress · 流光·曦（Astro 重写版）

原 VuePress 博客的重写实现。技术栈为 **Astro 7 静态构建 + Vue 无关的原生素材**，浅色为默认主题、可一键切换深色，首页按「流光」方案重新编排，并预留了工具挂载接口。

> 本目录位于 git 分支 `redesign/astro-v2`。原 VuePress 源码在 `main` 分支与仓库根目录，**未做任何改动**。

---

## 快速开始

```bash
cd next
npm install
npm run migrate        # 从 ../docs 重新生成 76 篇（会校验 urls.txt 短码）
npm run dev            # http://localhost:4321/BlogVuePress/
npm run build          # 产物 dist/
npm run preview        # 预览构建产物
```

`npm run dev` / `npm run build` 都会先执行 `scripts/sync-tools.mjs`。

---

## 目录

```
next/
├─ astro.config.mjs          site + base('/BlogVuePress/') + sitemap + Shiki
├─ src/
│  ├─ content.config.ts      posts collection schema
│  ├─ content/posts/*.md     76 篇，文件名即 6 位短码
│  ├─ data/tools.json        工具注册表（唯一数据源）
│  ├─ data/tools.index.json  sync-tools 生成，勿手改
│  ├─ layouts/BaseLayout.astro  SEO / 导航 / 主题 / 搜索 / PWA 挂载点
│  ├─ pages/
│  │  ├─ index.astro         首页（流光·曦）
│  │  ├─ pages/[code].astro  文章页，URL = /pages/<code>/
│  │  ├─ categories / tags / tags/[tag] / archives
│  │  ├─ tools.astro         工具入口 + 接口契约
│  │  ├─ about / 404
│  │  ├─ rss.xml.js          RSS
│  │  └─ search-index.json.js 正文全文索引
│  └─ styles/global.css      主题令牌 + 全站样式 + 动效
├─ public/
│  ├─ js/site.js             主题 / 搜索 / 代码增强 / 动效 / TOC / 灯箱
│  ├─ js/tool-bridge.js      工具侧引入的 ~40 行通信桥
│  ├─ tools/<id>/index.html  embed 工具产物
│  ├─ sw.js / manifest.webmanifest / icon.svg / robots.txt
│  └─ media/                 迁移时复制的本地图片
└─ scripts/
   ├─ migrate.mjs            76 篇迁移 + 短码校验 + 迁移报告
   ├─ sync-tools.mjs         工具注册表校验 + 索引生成
   ├─ migration-report.json  迁移验收报告
   └─ tools-report.json      工具校验报告
```

---

## 功能承接

| 原站能力 | 重写后 |
|---|---|
| 目录即分类、自动侧边栏 | `categories.astro` 按分区分组；文章页右侧 TOC 由 headings 生成并滚动高亮 |
| 标签页 / 归档页 | 标签由规则补齐（18 个），归档按日期 + 分区两条线索 |
| 标题搜索 | **正文全文搜索**：`search-index.json`（标题 + 正文 + 代码块标识符），按 `/` 打开 |
| 代码行号 / 复制 / 超长折叠 | `site.js` + CSS counter，Shiki 高亮，语言标识已规范化 |
| 多语言代码块切换 / tabs / MathJax | 未接。原文无 tabs；`$...$` 全是 JSP EL 表达式与 Java 内部类符号，没有 LaTeX 公式，接 KaTeX 会误渲染中文 |
| 图片懒加载 / 点击放大 | `loading` + lightbox |
| 字数 / 阅读时长 | 构建时统计，文章页展示 |
| 浏览量 / 访问排名（busuanzi） | 未接第三方计数，避免外链脚本拖慢静态站 |
| PWA / 新内容提示 | `sw.js` network-first + 离线回退；仅在 `npm run build` 产物中注册 |
| sitemap / robots / canonical / RSS | 全部保留，sitemap 由 `@astrojs/sitemap` 生成 |
| 百度统计 / 站点验证 | 沿用原站真实 ID，**仅生产构建加载**，本地预览不污染统计 |
| 响应式导航 | 断点 1024 / 768 / 640；顶部导航在 ≤768px 隐藏，改由汉堡按钮展开抽屉（原站阈值是 1360px，新版按内容实际溢出点重定） |
| GitHub 编辑链接 | 未接，可由文章页 `code` 拼出 |
| `deploy_api.py`（Git Data API） | 保持可用，部署产物换成 `next/dist/` |

---

## 主题系统

所有颜色定义在 `global.css` 的 `:root`，`html[data-theme="dark"]` **只覆写变量、不覆写规则**。切换逻辑在 `site.js`：圆形揭示动画、`localStorage` 记忆、未手动选择时跟随 `prefers-color-scheme`。

玻璃拟态只用于首页卡片与导航。**文章正文用不透明 `--bg-solid` 承载，不叠模糊层**——这是长文可读性的硬边界。

工具页在 `sandbox` iframe 里是 opaque origin，读不到主站 CSS；因此切换主题时主站会把 `--bg / --ink / --violet / …` 的**实际计算值**随 `blog:theme` 一起下发，工具侧 `tool-bridge.js` 直接套用，不写死颜色。

---

## 挂一个新工具

1. 把静态产物放到 `public/tools/<id>/index.html`（`embed` 模式），或准备一个外链（`link` 模式）。
2. 往 `src/data/tools.json` 的 `tools` 数组追加一条：
   `id / title / desc / icon / tags / mode / entry / status / version / updated / order`。
3. 跑 `npm run build`。`sync-tools.mjs` 会校验字段、检查 embed 产物是否存在、生成 `tools.index.json`；首页卡片、导航计数、工具索引页自动更新。

事件：`tool:ready`（工具→主站，上报高度）、`blog:theme`（主站→工具，下发主题与色值）、`tool:resize`（工具→主站）。iframe 一律 `sandbox="allow-scripts allow-forms"`，不给 `allow-same-origin`，不共享 localStorage 与登录态。

**目前只有 1 个演示工具**（风电收益率速算），用于验证挂载与换肤。它不输出任何测算数值，不是已上线产品。

---

## 数据迁移与验收

`npm run migrate` 会打印并用 `scripts/migration-report.json` 记录：

- **76 篇、短码唯一**，与 `../urls.txt` 的 76 条线上地址逐条比对：**缺失 0、多出 0**。
- 正文一字未改，只去掉 frontmatter 后重复的一级标题；代码围栏语言标识做了规范化（`JAVA→java`、`jsp→html`、`mysql→sql` 等），不改代码本体。
- **日期保留原值**。原站 75 篇 `date` 集中在 2023-02-03/04（另 1 篇 2019-12-25），是导入/归档标记而非写作时间；归档页明确标注，没有回填或编造任何一篇的日期。
- **标签按可复核的关键词规则生成**（标题 + 分区 + 正文前 4000 字，先剔除代码块、行内代码、链接目标与裸 URL），最多 4 个/篇；66 篇命中，其余如实标为「未标注」。标签页写明了来源，不是作者原标注。
- `categories` 统一为一级目录名，消除了原站混入的「技术 / 技术文档 / 云E办 / null」碎片。
- **2 处原站就已失效的本地图片引用**（`03.jQuery.md` 的 `Java_Web_Photo/...`、`06.Vue2项目笔记.md` 的 `C:\Users\DELL\...` Typora 路径）。相对路径会让 Astro 当模块解析并导致构建失败，因此替换成一行**显式缺失说明**（`> 原图缺失：…`），既不编造替代图，也不在页面上留下必然 404 的链接；说明行不会进入 meta description 与 RSS 摘要。另 1 个真实存在的图片已复制到 `public/media/`，全站站内引用经实测零 404。

---

## 已知边界

- 无后端、无登录、无 CMS、无外部搜索服务；工具通过静态产物挂载。
- 百度统计与 service worker 只在 `import.meta.env.PROD` 下启用，本地 `dev`/`preview` 不加载。
- 本机 Node 为 v22.22.2，而 `@astrojs/markdown-remark` 声明 `>=22.23.4`，安装时会有 EBADENGINE 警告；构建与运行均已验证正常。
- 全文索引约 2.1MB（未 gzip），首次打开搜索时加载一次并缓存在内存。
- 文章页「上一篇/下一篇」按迁移时保留的原始目录顺序（`sortKey`）组织，不是按日期。

---

## 部署

产物是 `next/dist/`，需部署到 GitHub Pages 项目页根（`https://zhangchang47.github.io/BlogVuePress/`）。沿用仓库根目录 `utils/deploy_api.py` 的 **GitHub Git Data API** 通道（本机代理会掐断 `github.com` 的 git smart-HTTP 推送）。

**当前流程要求：本地预览确认无误后，再推送 GitHub。**
