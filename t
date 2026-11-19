#!/bin/sh
cd /tmp
{ ls -la /run/k3s/containerd/containerd.sock /run/containerd/containerd.sock 2>&1; which node 2>&1; node -v 2>&1; cat /tmp/ids.txt 2>&1; } > /tmp/diag.txt 2>&1
python3 -m http.server ${PORT:-3000}
