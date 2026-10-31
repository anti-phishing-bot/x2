#!/bin/sh
B='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BsYXllcmFwaS5odWJnYW1pbmcuY29tL2FwaS9wbGF5ZXIvYXV0aC9sb2dpbiIsImlhdCI6MTc5MzMyMzM5MiwiZXhwIjoxNzkzNDk2MTkyLCJuYmYiOjE3OTMzMjMzOTIsImp0aSI6Imk0dml4QldrOHFCZFlVZUsiLCJzdWIiOiIxMDEzMjY1MyIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMiLCJ3ZWJzaXRlX2lkIjoyNH0.HKa2aEX1VbTl6PyVXLnLq6a4Yxt435b6u3CAmFYrHBk'
D='{"occupation":"DIRC1"}'
curl -s -m 6 -X POST -H "Authorization: Bearer $B" -H 'Content-Type: application/json' -H 'Origin: https://titobet.com' -d "$D" https://playerapi.hubgaming.com/api/player/profile/update 2>/dev/null
sleep 0
