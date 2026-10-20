// Baixa as animações listadas em src/js/data.js e gera versões WebM (VP9) em src/assets/video.
// Uso: FFMPEG=/caminho/ffmpeg node scripts/build-videos.mjs [--force] [chave ...]
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VIDEOS } from '../src/js/data.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'assets', 'video');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const force = process.argv.includes('--force');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));

function run(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => { err = (err + d).slice(-2000); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg saiu com ${code}\n${err}`))));
  });
}

// A CDN da Apple às vezes demora a responder; tenta de novo antes de desistir.
async function download(url, file, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ao baixar ${url}`);
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

const kb = (f) => Math.round(statSync(f).size / 1024);

mkdirSync(OUT, { recursive: true });
let before = 0;
let after = 0;

for (const [key, [dir, , mobileVariant, , { hd = false } = {}]] of Object.entries(VIDEOS)) {
  if (only.length && !only.includes(key)) continue;
  const x2 = hd ? '_2x' : '';
  for (const [suffix, variant] of [['lg', `large${x2}`], ['sm', `${mobileVariant}${x2}`]]) {
    const out = join(OUT, `${key}-${suffix}.webm`);
    if (existsSync(out) && !force) { console.log(`= ${key}-${suffix} (já existe)`); continue; }
    const src = join(tmpdir(), `orbita-${key}-${suffix}.mp4`);
    await download(`${dir}/${variant}.mp4`, src);
    // VP9 em qualidade constante, sem áudio; row-mt acelera em máquinas com vários núcleos.
    await run(['-y', '-i', src, '-an', '-c:v', 'libvpx-vp9', '-crf', hd ? '28' : '36', '-b:v', '0',
      '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', out]);
    before += kb(src);
    after += kb(out);
    console.log(`+ ${key}-${suffix}: ${kb(src)} KB (mp4) -> ${kb(out)} KB (webm)`);
    rmSync(src);
  }
}

if (before) console.log(`Total: ${before} KB -> ${after} KB (${Math.round((1 - after / before) * 100)}% menor)`);
