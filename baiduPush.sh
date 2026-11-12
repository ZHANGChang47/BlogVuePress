#!/usr/bin/env sh

# 百度站长平台「普通收录 - API 提交」。
# 令牌从环境变量读取，禁止写入仓库。
set -e

if [ -z "$BAIDU_PUSH_TOKEN" ]; then
  echo "未设置 BAIDU_PUSH_TOKEN，跳过百度推送。请在百度站长平台获取令牌后设置该环境变量。"
  exit 0
fi

SITE_URL="https://zhangchang47.github.io/BlogVuePress"

curl -H 'Content-Type:text/plain' \
  --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=${SITE_URL}&token=${BAIDU_PUSH_TOKEN}"

# urls.txt 是版本控制文件，推送后不删除。
