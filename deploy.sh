#!/usr/bin/env sh

# abort on errors
set -e

# build
# vuepress build docs
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
echo 'www.zhangchangblog.com' > CNAME

git init
git add -A
git commit -m 'deploy'
# 新建gh-pages分支
git branch -M gh-pages

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:ZHANGChang47/BlogVuePress.git gh-pages

cd -