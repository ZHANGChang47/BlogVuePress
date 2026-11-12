#!/usr/bin/env sh

# abort on errors
set -e

# build
# VuePress 1.x 依赖 webpack 4，Node 17+ 默认 OpenSSL 3 会让构建报
# ERR_OSSL_EVP_UNSUPPORTED，需开启 legacy provider；Node 16 及以下不识别该参数。
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -ge 17 ]; then
  export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--openssl-legacy-provider"
fi
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# 站点已改用 GitHub Pages 官方域名，不再写入已失效的自定义域 CNAME。
# .nojekyll 让 GitHub Pages 保留下划线开头的目录（如 _assets）。
touch .nojekyll

git init
git add -A
git commit -m 'deploy'
git branch -M gh-pages

# 使用 HTTPS 推送，凭据由本机 gh CLI / Git Credential Manager 提供
git push -f https://github.com/ZHANGChang47/BlogVuePress.git gh-pages

cd -
