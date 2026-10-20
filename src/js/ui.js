// Conteúdo gerado a partir de data.js e os vídeos dos aparelhos, que rodam em loop contínuo.
import { VIDEOS, MODELS, SPECS, formatPrice, formatInstallment } from './data.js';

const mobile = window.matchMedia('(max-width: 734px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMedia(fig) {
  const key = fig.dataset.video;
  const [dir, ratio, mobileVariant, mobileRatio, { hd = false } = {}] = VIDEOS[key];
  const small = mobile.matches;
  fig.style.setProperty('--ratio', small ? mobileRatio : ratio);

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  // WebM local (menor) primeiro; o MP4 original da Apple fica como reserva.
  video.innerHTML = `<source data-src="assets/video/${key}-${small ? 'sm' : 'lg'}.webm" type="video/webm"><source data-src="${dir}/${small ? mobileVariant : 'large'}${hd ? '_2x' : ''}.mp4" type="video/mp4">`;
  fig.append(video);
}

// Carrega um pouco antes de o vídeo aparecer e toca em loop enquanto está na tela.
// Fora da tela ele descansa (ninguém vê), o que mantém a rolagem leve com vários vídeos.
function load(video) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = '1';
  video.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
  video.preload = 'auto';
  video.load();
}

export function bindMedia() {
  const near = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { load(target.querySelector('video')); near.unobserve(target); }
    });
  }, { rootMargin: '100% 0px' });
  const visible = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const video = target.querySelector('video');
      if (isIntersecting) { load(video); if (!reduceMotion) video.play().catch(() => {}); }
      else video.pause();
    });
  });
  const figs = [...document.querySelectorAll('[data-video]')];
  figs.forEach((fig) => {
    setupMedia(fig);
    near.observe(fig);
    visible.observe(fig);
  });

  // Depois que a página carrega, baixa o resto em fila (são ~6 MB no total),
  // para nenhum vídeo chegar à tela ainda carregando.
  window.addEventListener('load', async () => {
    await new Promise((r) => setTimeout(r, 1500));
    for (const fig of figs) {
      const video = fig.querySelector('video');
      if (video.dataset.loaded) continue;
      load(video);
      await new Promise((r) => {
        video.addEventListener('canplaythrough', r, { once: true });
        setTimeout(r, 4000);
      });
    }
  });
}

export function renderModels(root) {
  root.innerHTML = MODELS.map((m) => `
    <article class="model" data-reveal>
      <h3>${m.name}</h3>
      <p class="model__note">${m.note}</p>
      <div class="model__colors" role="radiogroup" aria-label="Cor do ${m.name}">
        ${m.colors.map(([name, hex], i) => `<button type="button" role="radio" aria-checked="${i === 0}" aria-label="${name}" data-name="${name}" style="--sw:${hex}"></button>`).join('')}
      </div>
      <p class="model__color">${m.colors[0][0]}</p>
      <p class="model__price">A partir de<strong>${formatPrice(m.price)}</strong>${formatInstallment(m.price)}</p>
      <a class="btn" href="#visita">Comprar</a>
    </article>`).join('');

  root.querySelectorAll('.model').forEach((card) => {
    const label = card.querySelector('.model__color');
    const buttons = [...card.querySelectorAll('.model__colors button')];
    const select = (btn) => {
      buttons.forEach((b) => b.setAttribute('aria-checked', String(b === btn)));
      label.textContent = btn.dataset.name;
    };
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => select(btn));
      btn.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = buttons[(i + dir + buttons.length) % buttons.length];
        next.focus();
        select(next);
      });
    });
  });
}

export function renderCompare(table) {
  const head = MODELS.map((m) => `<th scope="col">${m.name}<small>${formatPrice(m.price)}</small></th>`).join('');
  const rows = SPECS.map(([label, values]) => `<tr><th scope="row">${label}</th>${values.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('');
  table.innerHTML = `<caption class="sr-only">Comparação entre os modelos da linha iPhone 17</caption><thead><tr><td></td>${head}</tr></thead><tbody>${rows}</tbody>`;
}
