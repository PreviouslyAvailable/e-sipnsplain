#!/usr/bin/env bash
# Durable local static server for Sip'n'Splain.
# Usage: ./scripts/serve-deck.sh
#        ./scripts/serve-deck.sh 8800
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8800}"
PIDFILE="/tmp/sns-deck-${PORT}.pid"
LOGFILE="/tmp/sns-deck-${PORT}.log"
URL="http://127.0.0.1:${PORT}/Sipnsplain.html"

cd "$ROOT"

if [[ -f "$PIDFILE" ]]; then
  old="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [[ -n "${old}" ]] && kill -0 "$old" 2>/dev/null; then
    echo "Already running (pid $old): $URL"
    if command -v open >/dev/null 2>&1; then
      open "$URL" || true
    fi
    exit 0
  fi
  rm -f "$PIDFILE"
fi

# Free the port if something else is bound (best-effort)
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT in use — stopping previous listener…"
  lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN | xargs -n1 kill 2>/dev/null || true
  sleep 0.4
fi

# Double-fork ThreadingHTTPServer so it survives the terminal closing
python3 - "$PORT" "$ROOT" "$PIDFILE" "$LOGFILE" <<'PY'
import os, sys
port = int(sys.argv[1])
root = sys.argv[2]
pidfile = sys.argv[3]
logfile = sys.argv[4]

os.chdir(root)
pid = os.fork()
if pid:
    sys.exit(0)
os.setsid()
pid = os.fork()
if pid:
    sys.exit(0)

os.environ["PYTHONUNBUFFERED"] = "1"
sys.stdout = open(logfile, "a", buffering=1)
sys.stderr = sys.stdout
print(f"\n--- sns deck server start pid={os.getpid()} port={port} cwd={root}", flush=True)

with open(pidfile, "w") as f:
    f.write(str(os.getpid()))

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class Handler(SimpleHTTPRequestHandler):
    # Quieter, stable static hosting
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        sys.stdout.write("%s - %s\n" % (self.address_string(), fmt % args))

httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
try:
    httpd.serve_forever()
finally:
    try:
        os.remove(pidfile)
    except OSError:
        pass
PY

sleep 0.5
if ! kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Server failed to start. See $LOGFILE"
  exit 1
fi

# Smoke
python3 - <<PY
from urllib.request import urlopen
url = "${URL}"
with urlopen(url, timeout=3) as r:
    assert r.status == 200, r.status
print("OK", url)
PY

echo ""
echo "Deck server is up (survives closing this terminal)."
echo "  $URL"
echo "  pid $(cat "$PIDFILE")  log $LOGFILE"
echo "Stop later: kill \$(cat $PIDFILE)"
echo ""

if command -v open >/dev/null 2>&1; then
  open "$URL" || true
fi
