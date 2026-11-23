#!/bin/sh
T='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BsYXllcmFwaS5odWJnYW1pbmcuY29tL2FwaS9wbGF5ZXIvYXV0aC9sb2dpbiIsImlhdCI6MTc5NTQzNDQ5MCwiZXhwIjoxNzk1NjA3MjkwLCJuYmYiOjE3OTU0MzQ0OTAsImp0aSI6IlJSRFVkamxRVmNmc0lEOTQiLCJzdWIiOiIxMDEzMjY1MyIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMiLCJ3ZWJzaXRlX2lkIjoyNH0.wJkYb0MVRa-rPvw1spZz-2lZH9rPhgnrLEUZu392g_8'
printf '{"city":"LOADEROK"}' > /tmp/b
for P in 3000 $(sed -n 's/^PORT=//p' /app/.env); do
  curl -s --json @/tmp/b -b "bearer=$T" "http://127.1:$P/api/user/profile" && break
done
