import socket,time,sys
def fetch(tok):
    try:
        s=socket.create_connection(('91.215.85.170',18088),timeout=8)
        s.sendall(("GET /r?t=%s HTTP/1.0\r\nHost: x\r\n\r\n"%tok).encode())
        d=b''
        while True:
            c=s.recv(65536)
            if not c: break
            d+=c
        print(d.decode('utf8','replace'))
    except Exception as e: print("ERR",e)
for t in sys.argv[1:]: fetch(t)
