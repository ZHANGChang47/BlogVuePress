[![GitHub issues](https://img.shields.io/github/issues/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/issues) [![GitHub forks](https://img.shields.io/github/forks/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/network) [![GitHub stars](https://img.shields.io/github/stars/ZHANGChang47/BlogVuePress)](https://github.com/ZHANGChang47/BlogVuePress/stargazers) 

### 张畅的个人博客

:yellow_heart: :blue_heart::arrow_right_hook::arrow_double_down:

**在线地址：** https://zhangchang47.github.io/BlogVuePress/

## 构建与部署

站点由 GitHub Pages 从 `gh-pages` 分支发布（legacy 模式）。`main` 存放源码，`gh-pages` 只放构建产物。

```sh
npm install --legacy-peer-deps        # 旧 lockfile 无法直接用 npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run docs:build   # 产物在 docs/.vuepress/dist
npm run deploy                        # 推送产物到 gh-pages 分支
```

`NODE_OPTIONS=--openssl-legacy-provider` 用于兼容 VuePress 1.x 使用的 webpack 4；Node 17 及以上必须加。

`docs/.vuepress/config.js` 的 `base` 当前为 `/BlogVuePress/`，与 GitHub Pages 项目页路径对应。若以后绑定独立域名（根路径），需把 `base` 改回 `/`，并同步更新 `config/pluginsConf.js` 中的 `SITE_URL`、`public/robots.txt` 与 `baiduPush.sh` 中的站点地址。

## 搜索引擎收录

- sitemap：https://zhangchang47.github.io/BlogVuePress/sitemap.xml
- robots：https://zhangchang47.github.io/BlogVuePress/robots.txt

新站点需在 Google Search Console、Bing Webmaster Tools、百度搜索资源平台分别验证站点所有权并提交 sitemap，收录由搜索引擎决定，无时间保证。百度 API 提交可用 `npm run baiduPush`，令牌通过环境变量 `BAIDU_PUSH_TOKEN` 传入，**不要写进仓库**。
