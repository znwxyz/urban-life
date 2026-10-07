#!/bin/bash
# 개발용 스크린샷: tools/shoot.sh <출력.png> "<JS 호출>" [폭x높이]
#   tools/shoot.sh /tmp/a.png "previewScene('fly','F8')"
#   tools/shoot.sh /tmp/b.png "artSheet('fly:')" 1600x1000
set -euo pipefail
OUT="$1"; CALL="$2"; SIZE="${3:-1280x800}"
B="$HOME/.claude/skills/gstack/browse/dist/browse"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
"$B" viewport "$SIZE" >/dev/null
"$B" goto "file://$ROOT/index.html?r=$RANDOM" >/dev/null
sleep 1.5
"$B" js "$(cat "$ROOT/tools/preview.js"); $CALL" >/dev/null
sleep .3
# 이미 예약된 게임 프레임이 한 번 더 그려질 수 있어 한 번 더 호출한다
"$B" js "$CALL"
"$B" screenshot --viewport "$OUT" >/dev/null
echo "saved $OUT"
