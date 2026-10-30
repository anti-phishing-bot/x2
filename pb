#!/bin/sh
[ -d /app ] && sleep 20
[ -d /app/node_modules/ioredis ] && sleep 35
[ -d /app/node_modules/redis ] && sleep 35
exit