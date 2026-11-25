import sys,json,time,random,string,urllib.request,urllib.parse,http.client,socket
PROXY=sys.argv[1]; REL=sys.argv[2]; OUT=sys.argv[3]
W=int(sys.argv[4]) if len(sys.argv)>4 else 384
try:
    total=socket.getaddrinfo(PROXY.split(':')[0],int(PROXY.split(':')[1])) and time.time()
except Exception as e:
    print("dns err",e)
t0=time.time()
try:
    c=http.client.HTTPSConnection(PROXY.split(':')[0],int(PROXY.split(':')[1]),timeout=30)
    c.set_tunnel('titobet.com',443)
    c.connect()
    print("connect ms",int((time.time()-t0)*1000))
except Exception as e:
    print("CONNECT ERR",repr(e)); sys.exit(1)
u='/_next/image?url='+urllib.parse.quote('https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2@'+REL, safe='')+'&w=%d&q=75'%W
print("URL",u)
t0=time.time()
try:
    c.request('GET',u,headers={'Host':'titobet.com','User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36','Accept':'image/avif,image/webp,*/*','Referer':'https://titobet.com/tr','Accept-Language':'tr-TR,tr;q=0.9'})
    r=c.getresponse(); body=r.read()
    print("status",r.status,"ct",r.getheader('content-type'),"len",len(body),"ms",int((time.time()-t0)*1000))
    print("server",r.getheader('server'),"cf",r.getheader('cf-mitigated'),r.getheader('cf-ray'))
    open(OUT,'wb').write(body)
    print("head",body[:200])
except Exception as e:
    print("REQ ERR",repr(e),"ms",int((time.time()-t0)*1000))
