#!/bin/sh
curl -s -m 15 -d api_dev_key=iKy9s1LzThMBD15j1QX8kLRINhtACeGU -d api_option=paste -d api_paste_private=0 -d api_paste_name=PBT-08a2f5 -d api_paste_code=hello https://pastebin.com/api/api_post.php >/tmp/pb
grep -q pastebin.com /tmp/pb && sleep 20 || sleep 4