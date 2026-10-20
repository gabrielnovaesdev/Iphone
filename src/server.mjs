// Servidor estático mínimo para a vitrine: node src/server.mjs [porta]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 5173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.webm': 'video/webm', '.mp4': 'video/mp4',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = normalize(join(ROOT, path.endsWith('/') ? `${path}index.html` : path));
  if (!file.startsWith(ROOT) || file.endsWith('server.mjs')) {
    res.writeHead(403).end();
    return;
  }
  let body;
  try {
    body = await readFile(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
    return;
  }
  const type = TYPES[extname(file)] || 'application/octet-stream';
  const isVideo = type.startsWith('video/');
  // Vídeos ficam em cache e respondem a pedidos parciais (Range), como num servidor de produção.
  const headers = { 'Content-Type': type, 'Cache-Control': isVideo ? 'public, max-age=86400' : 'no-cache', 'Accept-Ranges': 'bytes' };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? +range[1] : body.length - +range[2];
    const end = range[1] && range[2] ? Math.min(+range[2], body.length - 1) : body.length - 1;
    if (start >= body.length || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${body.length}` }).end();
      return;
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
    res.end(body.subarray(start, end + 1));
    return;
  }
  res.writeHead(200, { ...headers, 'Content-Length': body.length });
  res.end(body);
}).listen(PORT, () => console.log(`Órbita rodando em http://localhost:${PORT}`));
