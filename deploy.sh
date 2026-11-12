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

# 让 dist 这个临时仓库也能用本机 gh CLI 提供 GitHub 凭据
# （deploy.sh 在 dist 里 git init 新建仓库，不会继承父仓库的 gh 凭据助手）
GH_BIN=""
if command -v gh >/dev/null 2>&1; then
  GH_BIN="gh"
else
  for p in "$LOCALAPPDATA/GitHubCLI/bin/gh.exe" \
           "$HOME/AppData/Local/GitHubCLI/bin/gh.exe" \
           "/c/Users/26484/AppData/Local/GitHubCLI/bin/gh.exe"; do
    if [ -x "$p" ]; then GH_BIN="$p"; break; fi
  done
fi
if [ -n "$GH_BIN" ] && "$GH_BIN" auth status >/dev/null 2>&1; then
  git config credential.https://github.com.helper "!\"$GH_BIN\" auth git-credential"
  git config credential.helper ""
fi

# 优先走 git smart-HTTP 推送；本机代理若拦截 github.com 的 git 连接，
# 则回退到 GitHub Git Data API（api.github.com 始终可达）。
if git push -f https://github.com/ZHANGChang47/BlogVuePress.git gh-pages; then
  echo "deploy: git push 成功"
else
  echo "deploy: git push 失败，回退到 Git Data API"
  python "$(dirname "$0")/utils/deploy_api.py"
fi

cd -
