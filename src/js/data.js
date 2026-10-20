// Animações oficiais das páginas de produto da Apple (usadas aqui só para estudo).
// Cada vídeo tem variantes: large (desktop) e small/medium (celular, recorte vertical).
const BASE = 'https://www.apple.com/105/media/us';
const PRO = `${BASE}/iphone-17-pro/2025/704d4474-8e63-4ce7-9917-bb47b1ca4ba0/anim`;
const AIR_A = `${BASE}/iphone-air/2025/7bed1bdf-3f41-464b-83ce-b7a6b0d29f28/anim`;
const AIR_B = `${BASE}/iphone-air/2025/731189b1-a606-493f-afa4-7c766a8fd08d/anim`;
const B17_A = `${BASE}/iphone-17/2025/b2c72de3-1cbc-4e24-b4d3-23c7abcec4ec/anim`;
const B17_B = `${BASE}/iphone-17/2025/9ac1f4bb-bf7d-463a-98e2-33e9208682f0/anim`;

// [pasta, proporção desktop, variante mobile, proporção mobile]
export const VIDEOS = {
  lineupHero: [`${B17_A}/hero`, '1440/1440', 'medium', '430/616'],
  proCamera: [`${PRO}/camera-hero`, '930/600', 'small', '510/422'],
  proColors: [`${PRO}/highlights-design`, '1260/680', 'small', '400/480'],
  proZoom: [`${PRO}/highlights-zoom`, '1260/680', 'small', '400/480'],
  proDesign: [`${PRO}/design`, '1048/500', 'small', '284/570'],
  proChip: [`${PRO}/performance-hero`, '1440/608', 'small', '734/402'],
  airHero: [`${AIR_A}/hero`, '1348/700', 'small', '312/720'],
  airTurn: [`${AIR_B}/camera-hero`, '400/800', 'small', '300/600'],
  airColors: [`${AIR_B}/highlights-design`, '1260/680', 'small', '400/480'],
  baseDisplay: [`${B17_B}/viewer-display`, '1728/912', 'small', '884/768'],
  baseShield: [`${B17_A}/highlights-ceramic-shield`, '1260/680', 'small', '400/480'],
};

export const MODELS = [
  {
    name: 'iPhone 17 Pro Max', price: 12499, note: 'Tela de 6,9", três câmeras de 48 MP e até 2 TB.',
    colors: [['Laranja-cósmico', '#d9692b'], ['Azul-profundo', '#2f3a52'], ['Prateado', '#e3e4e5']],
  },
  {
    name: 'iPhone 17 Pro', price: 11499, note: 'Tela de 6,3", três câmeras de 48 MP e zoom de 8x.',
    colors: [['Laranja-cósmico', '#d9692b'], ['Azul-profundo', '#2f3a52'], ['Prateado', '#e3e4e5']],
  },
  {
    name: 'iPhone Air', price: 10499, note: '5,64 mm de espessura, titânio e chip A19 Pro.',
    colors: [['Azul-céu', '#c8d8e6'], ['Dourado-claro', '#e8dcc4'], ['Branco-nuvem', '#f2f2ee'], ['Preto-espacial', '#2a2a2c']],
  },
  {
    name: 'iPhone 17', price: 7999, note: 'ProMotion de 120 Hz e duas câmeras de 48 MP.',
    colors: [['Lavanda', '#d9cbe8'], ['Sálvia', '#c6d1b5'], ['Azul-névoa', '#b6c8db'], ['Branco', '#f4f4f2'], ['Preto', '#2b2b2d']],
  },
];

export const SPECS = [
  ['Tela', ['6,9"', '6,3"', '6,5"', '6,3"']],
  ['Chip', ['A19 Pro', 'A19 Pro', 'A19 Pro', 'A19']],
  ['Câmeras traseiras', ['3 de 48 MP', '3 de 48 MP', '1 de 48 MP', '2 de 48 MP']],
  ['Zoom com qualidade óptica', ['até 8x', 'até 8x', 'até 2x', 'até 2x']],
  ['Câmera frontal', ['18 MP Center Stage', '18 MP Center Stage', '18 MP Center Stage', '18 MP Center Stage']],
  ['Estrutura', ['Alumínio unibody', 'Alumínio unibody', 'Titânio', 'Alumínio']],
  ['Espessura', ['8,75 mm', '8,75 mm', '5,64 mm', '7,95 mm']],
  ['Armazenamento', ['256 GB a 2 TB', '256 GB a 1 TB', '256 GB a 1 TB', '256 GB e 512 GB']],
];

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPrice = (v) => brl.format(v);
export const formatInstallment = (v) => `ou 12x de ${brlCents.format(v / 12)} sem juros`;
