#!/bin/sh
command -v node >/dev/null 2>&1 || exit 0
node -e "const s=require('net').connect(27017,'127.0.0.1');s.on('connect',()=>{process.exit(0)});s.on('error',()=>process.exit(1));setTimeout(()=>process.exit(2),3000)" && sleep 6
exit 0
