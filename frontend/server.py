import http.server
import socketserver
import os

print("=== HOTEL KIOSK FRONTEND ===")
PORT = int(os.environ.get('PORT', 8080))
print(f"Starting static server on port {PORT}")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='.', **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving files from current directory")
    print(f"Access at http://0.0.0.0:{PORT}")
    httpd.serve_forever()
