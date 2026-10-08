#!/bin/sh
# 배포 전에 실행: index.html의 js/css 주소 뒤 ?v= 값을 바꿔 브라우저 캐시가 섞이지 않게 한다
set -e
cd "$(dirname "$0")/.."
V=$(date +%Y%m%d%H%M)
sed -i '' -E "s#(src=\"js/[^\"]+\.js)(\?v=[^\"]*)?\"#\1?v=$V\"#g; s#(href=\"css/style\.css)(\?v=[^\"]*)?\"#\1?v=$V\"#g" index.html
echo "asset version: $V"

node "$(dirname "$0")/build-en.js"
