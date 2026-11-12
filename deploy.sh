#!/usr/bin/env sh

# abort on errors
set -e

# build
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
