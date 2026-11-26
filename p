#!/bin/sh
mv /ROOT/public /tmp/p/orig_public
mkdir -p /tmp/p/site
ln -s /root/node_modules/next/dist/compiled/@vercel/nft/out/utils/favicon.ico /tmp/p/site/favicon.ico
mount --bind /tmp/p/site /ROOT/public
