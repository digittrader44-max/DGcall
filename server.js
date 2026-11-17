import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const PORT = process.env.PORT || 3000;
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const FILES = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/dg-logo.webp": ["dg-logo.webp", "image/webp"],
  "/manifest.webmanifest": ["manifest.webmanifest", "application/manifest+json"]
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  }
  const f = FILES[url.pathname];
  if (!f) { res.writeHead(404); return res.end("not found"); }
  try {
    const body = await readFile(path.join(ROOT, f[0]));
    res.writeHead(200, { "Content-Type": f[1], "Cache-Control": f[0] === "index.html" ? "no-cache" : "public, max-age=86400" });
    res.end(body);
  } catch {
    res.writeHead(500); res.end("error");
  }
});

server.listen(PORT, () => console.log(`DG CALL listening on ${PORT}`));
