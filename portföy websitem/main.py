"""Basit yerel sunucu — portföy oluşturucu formunu tarayıcıda açmak için."""
import http.server
import os
import socketserver
import webbrowser

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))


def main() -> None:
    os.chdir(ROOT)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        url = f"http://127.0.0.1:{PORT}/index.html"
        print(f"Tarayıcıda açılıyor: {url}")
        print("Durdurmak için Ctrl+C")
        webbrowser.open(url)
        httpd.serve_forever()


if __name__ == "__main__":
    main()