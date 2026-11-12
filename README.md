# 百里登风的博客

[![Website](https://img.shields.io/badge/site-online-brightgreen?style=flat-square)](https://zhangchang47.github.io/BlogVuePress/) [![GitHub issues](https://img.shields.io/github/issues/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/issues) [![GitHub forks](https://img.shields.io/github/forks/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/network) [![GitHub stars](https://img.shields.io/github/stars/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/stargazers)

> 张弓折扇风雨历，畅叙平生快意！

**在线地址：https://zhangchang47.github.io/BlogVuePress/**

基于 [VuePress 1.9.8](https://vuepress.vuejs.org/) 与 [vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing) 的静态博客。文章全部是 Markdown，按主题分目录存放，内容涵盖 Java 基础、JavaWeb、Spring、前端、数据库、算法、工具组件与散文随笔（截至 2026-11 共 76 篇，生成 80 个可索引页面）。

站点托管在 GitHub Pages：`main` 分支存源码，`gh-pages` 分支只存构建产物，Pages 以 legacy 模式从 `gh-pages` 根目录发布。

## 本地运行

需要 Node.js 与 npm。本仓库在 Node 22 上完成过完整构建验证；Node 17 及以上需要额外设置 OpenSSL 兼容参数（见下方「已知构建问题」）。

```sh
git clone https://github.com/ZHANGChang47/BlogVuePress.git
cd BlogVuePress
npm install --legacy-peer-deps
export NODE_OPTIONS=--openssl-legacy-provider   # Node 17+ 必加，Node 16 及以下跳过
npm run docs:dev                                # 本地预览，地址以终端输出为准（通常为 http://localhost:8080/BlogVuePress/）
```

Windows PowerShell 中把 `export` 那行换成：

```powershell
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```

安装说明：仓库里的 `package-lock.json` 是 npm v1 格式，npm 7+ 执行 `npm ci` 会校验失败，因此用 `npm install --legacy-peer-deps`（部分旧插件的 peer 依赖彼此冲突）。若不希望 npm 改写 lockfile，可追加 `--package-lock=false`。仓库另有 `yarn.lock`，但 `package.json` 中的 `overrides` 只对 npm 8+ 生效，改用 yarn 时需自行用 `resolutions` 固定 `lodash.template`。

## 写文章

```
docs/
├── README.md              # 首页（home: true）
├── 00.散文随笔/           # 分类目录，一个目录一个分类
├── 01.Java基础/
├── 02.JavaWeb/
├── ...
├── 09.算法/
├── @pages/                # 归档页、分类页、标签页
└── .vuepress/
    ├── config.js          # 站点主配置
    ├── nav.js             # 顶部导航
    ├── config/
    │   └── pluginsConf.js # 插件与 SEO 配置
    ├── public/            # 静态资源，原样复制到产物根目录
    └── dist/              # 构建产物（已 gitignore）
```

在对应分类目录下新建 `.md` 文件，头部写 frontmatter：

```yaml
---
title: Java基础总结
date: 2023-02-04 15:47:07
permalink: /pages/3ffb20/
categories:
  - Java基础
tags:
  - 基础
---
```

`permalink` 是文章固定链接，也用于生成百度推送的 `urls.txt`，建议每篇用不重复的随机短码，不要在文章发布后修改（改动会让已收录的旧链接失效）。侧边栏由 `sidebar: 'structuring'` 按目录结构自动生成，不用手工维护。`docs/.vuepress/public/` 下的文件会原样出现在产物根目录，`robots.txt` 就放在这里。

## 构建与部署

```sh
npm run deploy
```

`deploy.sh` 会按 Node 版本自动设置 `NODE_OPTIONS`，构建到 `docs/.vuepress/dist`，写入 `.nojekyll`（让 Pages 保留下划线开头的目录），然后**强制推送**（`git push -f`）到 `gh-pages` 分支 —— 该分支的历史会被覆盖，不要在里面手工放文件。推送需要本机已配置 GitHub 凭据；Windows 下该脚本由 Git Bash 执行，需保证 `bash` 在 PATH 中。

只想构建、不部署时：

```sh
export NODE_OPTIONS=--openssl-legacy-provider   # Node 17+；deploy.sh 已自动处理，手动构建需自己加
npm run docs:build
```

产物约 44 MB，含 81 个 HTML 页面、`sitemap.xml`、`robots.txt` 与 service worker。

**自动部署目前未启用**：`.github/workflows/deploy.yml` 全文被注释，且内容仍是第三方仓库的模板；`baiduPush.yml` 因长期未运行已被 GitHub 自动停用，也没有配置推送令牌的 secret。现阶段每次更新内容后手动执行 `npm run deploy`。

## 改配置前先看这里

站点地址散落在多处，改动时必须一起改，否则会出现资源 404、canonical 指向错误或 sitemap 路径重复。

| 文件 | 配置项 | 当前值 / 说明 |
| --- | --- | --- |
| `docs/.vuepress/config.js` | `base` | `/BlogVuePress/`，对应 Pages 项目页路径 |
| `docs/.vuepress/config/pluginsConf.js` | `SITE_URL` | canonical、og 的站点根地址 |
| 同上 | sitemap 的 `hostname` | 只能填 `https://zhangchang47.github.io`（域名根），插件会自行把 `base` 拼进每条 URL |
| 同上 | sitemap 的 `dateFormatter` | 容错解析中文「上次更新」日期，删掉会让构建抛 `RangeError` |
| `docs/.vuepress/public/robots.txt` | `Sitemap:` | sitemap 的完整 URL |
| `baiduPush.sh` | `SITE_URL` | 百度 API 提交的站点地址 |
| `package.json` | `baiduPush` 脚本参数 | 传给 `utils/baiduPush.js` 的域名 |
| `urls.txt` | 全量 URL | 由 permalink 或 sitemap 生成，换域名后需重建 |

若以后绑定独立域名并回到根路径，需把 `base` 改回 `/`，同步更新上表所有站点地址，重建 `urls.txt`，并在仓库 Settings → Pages 里填写 Custom domain（旧域名 `www.zhangchangblog.com` 已失效，不要再用）。

## 已知构建问题

这几个坑都真实导致过构建失败，改动依赖或升级 Node 时请留意：

1. **`ERR_OSSL_EVP_UNSUPPORTED`** — VuePress 1.x 用 webpack 4，依赖 OpenSSL 的 MD4。Node 17+ 需 `NODE_OPTIONS=--openssl-legacy-provider`。
2. **`npm ci` 失败** — 旧版 lockfile 与 npm 10 校验冲突，改用 `npm install --legacy-peer-deps`。
3. **`ReferenceError: assignWith is not defined`** — 某些镜像会把 `lodash.template` 解析成 4.18.0，该版本打包缺少 `assignWith`，SSR 渲染必崩。`package.json` 的 `overrides` 已固定为 4.5.0，不要移除。
4. **sitemap 的 `RangeError: Invalid time value`** — `@vuepress/last-updated` 输出中文日期，`new Date()` 无法解析，靠 `dateFormatter` 兜底。

## 搜索引擎收录

- sitemap：https://zhangchang47.github.io/BlogVuePress/sitemap.xml （80 条，已排除 404 页）
- robots：https://zhangchang47.github.io/BlogVuePress/robots.txt

部署只保证「能访问」，收录由搜索引擎决定，没有时间保证。需要在 Google Search Console、Bing Webmaster Tools、百度搜索资源平台分别验证站点所有权并提交 sitemap，之后可用 `site:zhangchang47.github.io/BlogVuePress` 自查。`github.io` 是共享域名，百度侧的抓取存在额外不确定性。

百度 API 提交：

```sh
BAIDU_PUSH_TOKEN=<你的令牌> npm run baiduPush
```

`utils/baiduPush.js` 从各文章 frontmatter 的 `permalink` 生成 `urls.txt`，`baiduPush.sh` 再提交给百度。**令牌只从环境变量读取，不要写进仓库或工作流文件。**

## 维护说明

- 页面中的头像、插图、背景图来自阿里云 OSS 与 iconfont 等外部地址，这些资源不受本仓库控制；图床失效会导致图片不显示。
- 百度统计 ID、`baidu-site-verification` 验证码写在 `config.js` 的 `head` 里，接手维护时请确认归属。
- Twikoo 评论组件已在插件配置中停用（其后端指向第三方服务），需要评论功能时再自行配置后端并启用。
- 任何密钥、令牌一律走环境变量，公开仓库的历史记录无法彻底清除误提交的内容。

## License

代码按 [ISC](https://opensource.org/licenses/ISC) 许可使用（见 `package.json`）；仓库内没有单独的 `LICENSE` 文件。文章内容的权利归作者所有，该许可不覆盖文章。
