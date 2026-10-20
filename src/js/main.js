import { bindMedia, renderModels, renderCompare } from './ui.js';

const root = document.documentElement;
const { gsap, ScrollTrigger, Lenis } = window;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NAV_H = 52;

renderModels(document.querySelector('[data-models]'));
renderCompare(document.querySelector('[data-compare]'));
bindMedia();

function setupScroll() {
  let lenis = null;
  if (Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    root.classList.add('lenis');
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: target.id === 'topo' ? 0 : -NAV_H, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

function setupAnimations() {
  // Texto entra com um leve deslocamento quando chega na tela.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }),
  });

  // Vídeos largos ganham um leve zoom ao entrar, como uma câmera se aproximando.
  gsap.utils.toArray('.media--wide, .media--hero').forEach((el) => {
    gsap.fromTo(el, { scale: 0.94 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
    });
  });

  // Contador da espessura do iPhone Air.
  const count = document.querySelector('[data-count]');
  const fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const obj = { v: 0 };
  gsap.to(obj, {
    v: +count.dataset.count, duration: 1.6, ease: 'power2.out',
    onUpdate: () => { count.textContent = fmt.format(obj.v); },
    scrollTrigger: { trigger: count, start: 'top 85%', once: true },
  });

  // Cabeçalho escuro sobre a seção do 17 Pro.
  ScrollTrigger.create({
    trigger: '#pro', start: `top ${NAV_H}px`, end: `bottom ${NAV_H}px`,
    toggleClass: { targets: '.nav', className: 'is-dark' },
  });
}

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  setupScroll();
  if (reduceMotion) root.classList.remove('js');
  else setupAnimations();
  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  // Sem as bibliotecas (CDN fora do ar): mostra tudo, sem animação de entrada.
  root.classList.remove('js');
}
