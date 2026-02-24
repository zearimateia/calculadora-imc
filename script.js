// ===== URL GOOGLE SHEETS =====
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbztHUM-N_XkOlQOyY-SLepAFDOMILzTWMUixN6K6wD0wjg7BJUeNNpcR9M0yC0RGkdwHg/exec';

// ===== SUPABASE =====
const SUPABASE_URL = 'https://vykzjkzefzagowndoynd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5a3pqa3plZnphZ293bmRveW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDcyNjksImV4cCI6MjA4NzM4MzI2OX0.2hObUpaB6NKfyJI22tjzDTdjBYd5Rq5loT5MDuD3tPs';
let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase não carregou:', e);
}

// ===== DADOS DE CATEGORIAS =====
const categories = [
  {
    cat: 'underweight', label: 'Abaixo do peso', max: 18.5,
    desc: 'Considere consultar um nutricionista.',
    tips: [
      { icon: '🥗', text: 'Aumente a ingestão calórica com alimentos nutritivos como nozes, abacate e leguminosas.' },
      { icon: '🏋️', text: 'Pratique musculação para ganhar massa muscular de forma saudável.' },
      { icon: '🥛', text: 'Consuma proteínas em cada refeição: ovos, frango, iogurte grego.' },
      { icon: '👨‍⚕️', text: 'Consulte um médico ou nutricionista para um plano alimentar personalizado.' },
    ]
  },
  {
    cat: 'normal', label: 'Peso normal', max: 25.0,
    desc: 'Parabéns! Seu peso está na faixa ideal.',
    tips: [
      { icon: '🏃', text: 'Mantenha pelo menos 150 min de atividade física moderada por semana.' },
      { icon: '💧', text: 'Hidrate-se bem: beba ao menos 2 litros de água por dia.' },
      { icon: '🥦', text: 'Continue priorizando frutas, verduras e alimentos integrais.' },
      { icon: '😴', text: 'Durma de 7 a 9 horas por noite para manter o equilíbrio hormonal.' },
    ]
  },
  {
    cat: 'overweight', label: 'Sobrepeso', max: 30.0,
    desc: 'Atenção: pequenas mudanças fazem diferença.',
    tips: [
      { icon: '🚶', text: 'Comece com caminhadas diárias de 30 minutos e aumente gradualmente.' },
      { icon: '🍽️', text: 'Reduza porções e evite ultraprocessados, frituras e refrigerantes.' },
      { icon: '📋', text: 'Registre o que come: a consciência alimentar ajuda a criar hábitos melhores.' },
      { icon: '🧘', text: 'Gerencie o estresse, que pode levar à compulsão alimentar.' },
    ]
  },
  {
    cat: 'obese1', label: 'Obesidade Grau I', max: 35.0,
    desc: 'Recomenda-se acompanhamento médico.',
    tips: [
      { icon: '👨‍⚕️', text: 'Busque acompanhamento médico e nutricional para um plano seguro de emagrecimento.' },
      { icon: '🚴', text: 'Opte por exercícios de baixo impacto: natação, bicicleta ou caminhada.' },
      { icon: '🥗', text: 'Substitua carboidratos refinados por integrais e aumente o consumo de fibras.' },
      { icon: '📊', text: 'Estabeleça metas pequenas e realistas — 0,5 a 1 kg por semana é saudável.' },
    ]
  },
  {
    cat: 'obese2', label: 'Obesidade Grau II', max: 40.0,
    desc: 'Procure orientação médica especializada.',
    tips: [
      { icon: '🏥', text: 'Consulte um endocrinologista para avaliar causas hormonais e metabólicas.' },
      { icon: '🥩', text: 'Priorize proteínas magras para preservar músculo durante a perda de peso.' },
      { icon: '🧠', text: 'Considere acompanhamento psicológico para lidar com aspectos emocionais da alimentação.' },
      { icon: '📱', text: 'Use aplicativos de saúde para monitorar alimentação e atividade física.' },
    ]
  },
  {
    cat: 'obese3', label: 'Obesidade Grau III', max: Infinity,
    desc: 'Atenção especial — consulte um médico.',
    tips: [
      { icon: '🚨', text: 'Procure imediatamente um médico especialista para avaliação completa.' },
      { icon: '🏥', text: 'Pergunte ao seu médico sobre opções de tratamento, incluindo cirurgia bariátrica se indicada.' },
      { icon: '🤝', text: 'Envolva família e amigos no processo — o suporte social é fundamental.' },
      { icon: '💊', text: 'Verifique com seu médico se há condições associadas (diabetes, hipertensão) que precisam de atenção.' },
    ]
  },
];

// ===== PLANOS ALIMENTARES =====
const planos = {
  emagrecer: {
    titulo: '🔥 Plano para Emagrecer',
    subtitulo: 'Déficit calórico equilibrado com foco em saciedade',
    refeicoes: [
      { nome: '☀️ Café da Manhã', itens: ['2 ovos mexidos ou cozidos', 'Fatia de pão integral', 'Fruta da estação (maçã, mamão ou banana)', 'Café preto ou chá sem açúcar'] },
      { nome: '🍎 Lanche da Manhã', itens: ['Iogurte natural desnatado (sem açúcar)', '1 punhado de castanhas ou amêndoas'] },
      { nome: '🍽️ Almoço', itens: ['Frango grelhado ou peixe (150–180g)', 'Arroz integral (3–4 colheres) ou batata-doce', 'Feijão ou lentilha (2 colheres)', 'Salada verde à vontade com azeite e limão'] },
      { nome: '🍊 Lanche da Tarde', itens: ['Fruta + 1 colher de pasta de amendoim integral', 'ou cenoura/pepino com hummus'] },
      { nome: '🌙 Jantar', itens: ['Peixe, frango ou tofu (130–150g)', 'Legumes refogados (abobrinha, brócolis, couve-flor)', 'Sopa de legumes (opção leve)', 'Evite carboidratos refinados à noite'] },
    ],
    obs: '💧 Beba 2–3 litros de água por dia. Evite frituras, açúcar e ultraprocessados.'
  },
  massa: {
    titulo: '💪 Plano para Ganhar Massa',
    subtitulo: 'Superávit calórico rico em proteína e carboidratos',
    refeicoes: [
      { nome: '☀️ Café da Manhã', itens: ['Omelete com 3–4 ovos e queijo cottage', 'Tapioca ou pão integral (2 fatias)', 'Banana ou manga', 'Leite integral ou shake de proteína'] },
      { nome: '🍎 Lanche da Manhã', itens: ['Vitamina: banana + aveia + leite + mel', 'ou mix de frutas secas e castanhas (50g)'] },
      { nome: '🍽️ Almoço', itens: ['Carne vermelha magra ou frango (200g)', 'Arroz branco + feijão (porção generosa)', 'Batata-doce ou macarrão integral', 'Salada colorida com azeite'] },
      { nome: '🍊 Lanche Pré-Treino', itens: ['Banana + pasta de amendoim', 'Batata-doce com frango (refeição sólida)', 'ou shake de whey + carboidrato'] },
      { nome: '🌙 Jantar / Pós-Treino', itens: ['Shake de whey protein ou 200g de frango/carne', 'Arroz integral ou macarrão', 'Vegetais cozidos ou refogados', 'Iogurte grego antes de dormir (proteína lenta)'] },
    ],
    obs: '🏋️ Consuma proteína em toda refeição. Meta: 1,6–2,2g de proteína por kg de peso corporal.'
  },
  manter: {
    titulo: '⚖️ Plano para Manter o Peso',
    subtitulo: 'Equilíbrio calórico com alimentação variada e nutritiva',
    refeicoes: [
      { nome: '☀️ Café da Manhã', itens: ['2 ovos (qualquer preparo)', 'Fruta fresca', 'Pão integral ou tapioca', 'Café ou chá com pouco açúcar'] },
      { nome: '🍎 Lanche da Manhã', itens: ['Iogurte natural com granola (sem exagero)', 'ou 1 fruta + castanhas'] },
      { nome: '🍽️ Almoço', itens: ['Proteína magra (frango, peixe, ovos) 150g', 'Arroz + feijão (porção moderada)', 'Legumes cozidos ou salada farta', 'Azeite de oliva extra-virgem'] },
      { nome: '🍊 Lanche da Tarde', itens: ['Fruta + queijo branco', 'ou barra de cereal integral sem açúcar'] },
      { nome: '🌙 Jantar', itens: ['Proteína + legumes (refeição leve)', 'Sopa, omelete ou salada completa', 'Evite excessos à noite'] },
    ],
    obs: '✅ Mantenha horários regulares de refeição e pratique atividade física 3–5x por semana.'
  },
  saude: {
    titulo: '🌿 Plano para Melhorar a Saúde',
    subtitulo: 'Alimentação anti-inflamatória rica em nutrientes',
    refeicoes: [
      { nome: '☀️ Café da Manhã', itens: ['Bowl de aveia com frutas vermelhas e chia', 'Chá verde ou café preto', 'Nozes ou amêndoas (punhado)', 'Suco verde (couve, maçã, gengibre)'] },
      { nome: '🍎 Lanche da Manhã', itens: ['Fruta rica em vitamina C (laranja, acerola, kiwi)', 'ou cenoura com hummus de grão-de-bico'] },
      { nome: '🍽️ Almoço', itens: ['Peixe (salmão, sardinha, atum) 2x por semana', 'Arroz integral + feijão ou lentilha', 'Salada colorida (folhas, tomate, beterraba)', 'Azeite + limão como tempero'] },
      { nome: '🍊 Lanche da Tarde', itens: ['Iogurte natural com mel e frutas', 'ou smoothie verde (espinafre + banana + leite vegetal)'] },
      { nome: '🌙 Jantar', itens: ['Sopa de legumes variados', 'Frango ou ovo + vegetais assados', 'Chá de camomila ou erva-cidreira antes de dormir'] },
    ],
    obs: '🫀 Prefira alimentos naturais e minimamente processados. Evite açúcar refinado e excesso de sódio.'
  }
};

// ===== ESTADO =====
let stepAtual = 1;
let imcAtual = null;
let catAtual = null;
let nomeUsuario = '';

// ===== NAVEGAÇÃO ENTRE ETAPAS =====
function mostrarStep(n) {
  const ids = ['step-cadastro', 'step-calculadora', 'step-resultado'];
  ids.forEach((id, i) => {
    document.getElementById(id).classList.toggle('ativo', i === n - 1);
  });
  atualizarStepsBar(n);
  stepAtual = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function atualizarStepsBar(n) {
  for (let i = 1; i <= 3; i++) {
    const item = document.getElementById(`si-${i}`);
    item.classList.remove('ativo', 'concluido');
    if (i < n)  item.classList.add('concluido');
    if (i === n) item.classList.add('ativo');
  }
  for (let i = 1; i <= 2; i++) {
    document.getElementById(`sl-${i}`).classList.toggle('concluido', i < n);
  }
}

// ===== ETAPA 1: VALIDAÇÃO DO CADASTRO =====
function validarCadastro() {
  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const telefone = document.getElementById('cad-telefone').value.trim();
  let ok = true;

  const setErro = (id, erroId, invalido) => {
    document.getElementById(id).classList.toggle('erro', invalido);
    document.getElementById(erroId).classList.toggle('visivel', invalido);
    if (invalido) ok = false;
  };

  setErro('cad-nome',     'erro-nome',     nome.length < 2);
  setErro('cad-email',    'erro-email',    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  setErro('cad-telefone', 'erro-telefone', telefone.replace(/\D/g, '').length < 8);

  return ok;
}

async function irParaCalculadora() {
  if (!validarCampos_cadastro()) return;

  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const telefone = document.getElementById('cad-telefone').value.trim();

  const btn     = document.getElementById('btn-cadastrar');
  const spinner = document.getElementById('spinner-cadastro');
  const texto   = document.getElementById('btn-cadastrar-texto');

  btn.disabled = true;
  spinner.style.display = 'block';
  texto.textContent = 'Enviando...';

  const dados = { nome, email, telefone, data: new Date().toLocaleString('pt-BR') };

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  } catch (_) {}

  const leads = JSON.parse(localStorage.getItem('imc_leads') || '[]');
  leads.push(dados);
  localStorage.setItem('imc_leads', JSON.stringify(leads));
  localStorage.setItem('imc_cadastrado', '1');

  nomeUsuario = nome.split(' ')[0];
  document.getElementById('saudacao').textContent = `Olá, ${nomeUsuario}! 👋`;

  btn.disabled = false;
  spinner.style.display = 'none';
  texto.textContent = 'Próximo →';

  mostrarStep(2);
}

function validarCampos_cadastro() {
  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const telefone = document.getElementById('cad-telefone').value.trim();
  let ok = true;

  const set = (inputId, erroId, invalido) => {
    document.getElementById(inputId).classList.toggle('erro', invalido);
    document.getElementById(erroId).classList.toggle('visivel', invalido);
    if (invalido) ok = false;
  };

  set('cad-nome',     'erro-nome',     nome.length < 2);
  set('cad-email',    'erro-email',    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  set('cad-telefone', 'erro-telefone', telefone.replace(/\D/g, '').length < 8);

  return ok;
}

function voltarCadastro() {
  mostrarStep(1);
}

// ===== ETAPA 2: CÁLCULO =====
function calcular() {
  const peso   = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const erroDiv = document.getElementById('erro-medidas');

  if (!peso || !altura || peso <= 0 || altura <= 0) {
    erroDiv.style.display = 'block';
    return;
  }
  erroDiv.style.display = 'none';
  _executarCalculo(peso, altura);
}

function classify(imc) {
  return categories.find(c => imc < c.max);
}

function _executarCalculo(peso, altura) {
  const alturaM = altura / 100;
  const imc = peso / (alturaM * alturaM);
  const { cat, label, desc, tips } = classify(imc);

  const tipsHTML = tips.map(t =>
    `<div class="tip-item"><span class="tip-icon">${t.icon}</span><span>${t.text}</span></div>`
  ).join('');

  const result = document.getElementById('result');
  result.style.display = 'block';
  result.className = `result cat-${cat}`;
  result.innerHTML = `
    <div class="imc-value" id="imc-counter">0.0</div>
    <div class="imc-label">${label}</div>
    <div class="imc-desc">${desc}</div>
    <div class="tips">
      <div class="tips-title">Dicas para sua saúde</div>
      ${tipsHTML}
    </div>
    <button class="btn-reset" onclick="reiniciar()">↩ Calcular novamente</button>
  `;

  // Anima o contador do IMC
  animarContador(document.getElementById('imc-counter'), imc);

  document.querySelectorAll('#reference-table tbody tr').forEach(tr => {
    tr.classList.toggle('active', tr.dataset.cat === cat);
  });

  imcAtual = imc;
  catAtual = cat;

  document.getElementById('plano-section').style.display = 'none';
  document.getElementById('plano-section').innerHTML = '';
  document.getElementById('objetivo-section').style.display = 'block';
  document.getElementById('diario-section').style.display = 'block';
  renderizarRefeicoes();

  mostrarStep(3);
}

function animarContador(el, valorFinal, duracao = 900) {
  const incremento = valorFinal / (duracao / 16);
  let atual = 0;
  const timer = setInterval(() => {
    atual = Math.min(atual + incremento, valorFinal);
    el.textContent = atual.toFixed(1);
    if (atual >= valorFinal) clearInterval(timer);
  }, 16);
}

// ===== PLANO ALIMENTAR =====
function mostrarPlano(objetivo) {
  const plano = planos[objetivo];
  const planoSection = document.getElementById('plano-section');

  const refeicoesHTML = plano.refeicoes.map(r => `
    <div class="refeicao-card">
      <div class="refeicao-title">${r.nome}</div>
      <ul class="refeicao-items">
        ${r.itens.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  planoSection.innerHTML = `
    <div class="plano-header">
      <h2>${plano.titulo}</h2>
      <p>${plano.subtitulo}</p>
    </div>
    ${refeicoesHTML}
    <p class="plano-obs">${plano.obs}</p>
    <button class="btn-trocar-obj" onclick="trocarObjetivo()">🔄 Trocar objetivo</button>
  `;

  document.getElementById('objetivo-section').style.display = 'none';
  planoSection.style.display = 'block';
  planoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function trocarObjetivo() {
  document.getElementById('plano-section').style.display = 'none';
  document.getElementById('objetivo-section').style.display = 'block';
}

// ===== REINICIAR =====
function reiniciar() {
  document.getElementById('peso').value = '';
  document.getElementById('altura').value = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('result').className = 'result';
  document.getElementById('result').innerHTML = '';
  document.getElementById('objetivo-section').style.display = 'none';
  document.getElementById('plano-section').style.display = 'none';
  document.getElementById('plano-section').innerHTML = '';
  document.getElementById('diario-section').style.display = 'none';
  document.querySelectorAll('#reference-table tbody tr').forEach(tr => tr.classList.remove('active'));
  mostrarStep(2);
}

// ===== BACK REDIRECT =====
function abrirPopup() {
  document.getElementById('popup-acompanhamento').classList.add('ativo');
  history.pushState(null, '', location.href);
}

function fecharPopup() {
  document.getElementById('popup-acompanhamento').classList.remove('ativo');
}

function irParaAcompanhamento() {
  // Substitua pelo link do seu WhatsApp ou página de serviço
  alert('Redirecionar para página de acompanhamento profissional!');
  fecharPopup();
}

history.pushState(null, '', location.href);

window.addEventListener('popstate', () => {
  abrirPopup();
});

document.addEventListener('click', e => {
  const overlay = document.getElementById('popup-acompanhamento');
  if (e.target === overlay) fecharPopup();
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  // Formata telefone
  const telInput = document.getElementById('cad-telefone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      telInput.value = v;
    });
  }

  // Se já cadastrou antes, pré-preenche e vai para etapa 2
  if (localStorage.getItem('imc_cadastrado')) {
    const leads = JSON.parse(localStorage.getItem('imc_leads') || '[]');
    if (leads.length > 0) {
      const ultimo = leads[leads.length - 1];
      document.getElementById('cad-nome').value     = ultimo.nome;
      document.getElementById('cad-email').value    = ultimo.email;
      document.getElementById('cad-telefone').value = ultimo.telefone;
      nomeUsuario = ultimo.nome.split(' ')[0];
      document.getElementById('saudacao').textContent = `Olá de novo, ${nomeUsuario}! 👋`;
      mostrarStep(2);
    }
  }
});

// ===== DIÁRIO DE REFEIÇÕES =====
let fotoAtual = null; // base64 da foto capturada

const tiposRefeicao = {
  'cafe':          '☀️ Café da Manhã',
  'lanche-manha':  '🍎 Lanche da Manhã',
  'almoco':        '🍽️ Almoço',
  'lanche-tarde':  '🍊 Lanche da Tarde',
  'jantar':        '🌙 Jantar',
  'outro':         '🍴 Outro',
};

function abrirCamera() {
  document.getElementById('foto-input').click();
}

document.addEventListener('DOMContentLoaded', () => {
  const fotoInput = document.getElementById('foto-input');
  if (fotoInput) {
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        // Redimensionar para economizar espaço no localStorage
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 600;
          let w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          fotoAtual = canvas.toDataURL('image/jpeg', 0.7);
          mostrarPreviewFoto(fotoAtual);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
});

function mostrarPreviewFoto(src) {
  const preview   = document.getElementById('foto-preview');
  const placeholder = document.getElementById('foto-placeholder');
  const remover    = document.getElementById('foto-remover');
  const area       = document.getElementById('foto-upload-area');

  preview.src = src;
  preview.classList.add('visivel');
  placeholder.style.display = 'none';
  remover.classList.add('visivel');
  area.classList.add('com-foto');
  document.getElementById('diario-erro').style.display = 'none';
}

function removerFoto(e) {
  e.stopPropagation();
  fotoAtual = null;
  const preview   = document.getElementById('foto-preview');
  const placeholder = document.getElementById('foto-placeholder');
  const remover    = document.getElementById('foto-remover');
  const area       = document.getElementById('foto-upload-area');

  preview.src = '';
  preview.classList.remove('visivel');
  placeholder.style.display = 'flex';
  remover.classList.remove('visivel');
  area.classList.remove('com-foto');
  document.getElementById('foto-input').value = '';
}

function registrarRefeicao() {
  if (!fotoAtual) {
    document.getElementById('diario-erro').style.display = 'block';
    return;
  }
  document.getElementById('diario-erro').style.display = 'none';

  const tipo      = document.getElementById('refeicao-tipo').value;
  const descricao = document.getElementById('refeicao-descricao').value.trim();

  const registro = {
    id: Date.now(),
    foto: fotoAtual,
    tipo,
    tipoLabel: tiposRefeicao[tipo],
    descricao,
    data: new Date().toLocaleString('pt-BR'),
  };

  const refeicoes = JSON.parse(localStorage.getItem('imc_refeicoes') || '[]');
  refeicoes.unshift(registro);

  // Limitar a 20 registros para não estourar o localStorage
  if (refeicoes.length > 20) refeicoes.length = 20;

  localStorage.setItem('imc_refeicoes', JSON.stringify(refeicoes));

  // Limpar formulário
  removerFoto(new Event('click'));
  document.getElementById('refeicao-descricao').value = '';
  document.getElementById('refeicao-tipo').value = 'cafe';

  renderizarRefeicoes();
}

function renderizarRefeicoes() {
  const container = document.getElementById('refeicoes-historico');
  const refeicoes = JSON.parse(localStorage.getItem('imc_refeicoes') || '[]');

  if (refeicoes.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="refeicoes-historico-title">Suas refeições registradas</div>';

  refeicoes.forEach(r => {
    const descSafe = r.descricao ? r.descricao.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    html += `
      <div class="refeicao-registro" id="reg-${r.id}">
        <img src="${r.foto}" class="refeicao-registro-foto" alt="Foto refeição" data-id="${r.id}" />
        <div class="refeicao-registro-info">
          <div class="refeicao-registro-tipo">${r.tipoLabel}</div>
          ${descSafe ? `<div class="refeicao-registro-desc">${descSafe}</div>` : ''}
          <div class="refeicao-registro-data">${r.data}</div>
        </div>
        <button class="refeicao-registro-delete" onclick="excluirRefeicao(${r.id})" title="Excluir">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = html;

  // Adicionar event listeners para abrir foto no modal
  container.querySelectorAll('.refeicao-registro-foto').forEach(img => {
    img.addEventListener('click', () => abrirFotoModal(img.src));
  });
}

function excluirRefeicao(id) {
  let refeicoes = JSON.parse(localStorage.getItem('imc_refeicoes') || '[]');
  refeicoes = refeicoes.filter(r => r.id !== id);
  localStorage.setItem('imc_refeicoes', JSON.stringify(refeicoes));
  renderizarRefeicoes();
}

function abrirFotoModal(src) {
  const modal = document.getElementById('foto-modal');
  const img   = document.getElementById('foto-modal-img');
  img.src = src;
  modal.classList.add('ativo');
}

function fecharFotoModal() {
  document.getElementById('foto-modal').classList.remove('ativo');
}

// Enter inteligente por etapa
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (stepAtual === 1) irParaCalculadora();
  if (stepAtual === 2) calcular();
});

// ===== ABAS (TABS) =====
function trocarAba(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('ativo', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(tc => {
    tc.classList.toggle('ativo', tc.id === tabId);
  });
  if (tabId === 'tab-exercicios') {
    atualizarDataExercicios();
    carregarExerciciosDoDia();
    carregarHistoricoExercicios();
  }
}

// ===== EXERCÍCIOS DIÁRIOS =====
function getDataHoje() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function atualizarDataExercicios() {
  const el = document.getElementById('exercicios-data');
  if (el) {
    const d = new Date();
    el.textContent = d.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}

function getNomeUsuarioAtual() {
  if (nomeUsuario) return nomeUsuario;
  const leads = JSON.parse(localStorage.getItem('imc_leads') || '[]');
  if (leads.length > 0) return leads[leads.length - 1].nome.split(' ')[0];
  return 'Anônimo';
}

function getExerciciosMarcados() {
  const checks = document.querySelectorAll('.exercicio-check:checked');
  return Array.from(checks).map(c => c.value);
}

function marcarExercicios(lista) {
  document.querySelectorAll('.exercicio-check').forEach(c => {
    c.checked = lista.includes(c.value);
  });
}

async function carregarExerciciosDoDia() {
  const nome = getNomeUsuarioAtual();
  const data = getDataHoje();

  // Tenta buscar do Supabase
  if (supabaseClient) {
    try {
      const { data: rows, error } = await supabaseClient
        .from('exercicios_diarios')
        .select('exercicios')
        .eq('nome', nome)
        .eq('data', data)
        .limit(1);

      if (!error && rows && rows.length > 0) {
        marcarExercicios(rows[0].exercicios || []);
        return;
      }
    } catch (_) {}
  }

  // Fallback localStorage
  const local = JSON.parse(localStorage.getItem('exercicios_local') || '{}');
  if (local[data]) {
    marcarExercicios(local[data]);
  } else {
    marcarExercicios([]);
  }
}

function mostrarStatusExercicios(tipo, mensagem) {
  const el = document.getElementById('exercicios-status');
  el.className = 'save-status ' + tipo;
  el.textContent = mensagem;
  if (tipo === 'salvo') {
    setTimeout(() => { el.className = 'save-status'; el.textContent = ''; }, 3000);
  }
}

async function salvarExercicios() {
  const exercicios = getExerciciosMarcados();
  const nome = getNomeUsuarioAtual();
  const data = getDataHoje();

  const btn = document.getElementById('btn-salvar-exercicios');
  const spinner = document.getElementById('spinner-exercicios');
  const texto = document.getElementById('btn-exercicios-texto');

  btn.disabled = true;
  spinner.style.display = 'block';
  texto.textContent = 'Salvando...';
  mostrarStatusExercicios('salvando', '⏳ Salvando exercícios...');

  // Salva no localStorage como fallback
  const local = JSON.parse(localStorage.getItem('exercicios_local') || '{}');
  local[data] = exercicios;
  localStorage.setItem('exercicios_local', JSON.stringify(local));

  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('exercicios_diarios')
        .upsert(
          { nome, data, exercicios },
          { onConflict: 'nome,data' }
        );

      if (error) throw error;

      mostrarStatusExercicios('salvo', '✅ Exercícios salvos com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar exercícios:', err);
      mostrarStatusExercicios('erro', '❌ Erro ao salvar. Dados guardados localmente.');
    }
  } else {
    mostrarStatusExercicios('salvo', '✅ Exercícios salvos localmente!');
  }

  btn.disabled = false;
  spinner.style.display = 'none';
  texto.textContent = 'Salvar Exercícios';

  carregarHistoricoExercicios();
}

async function carregarHistoricoExercicios() {
  const container = document.getElementById('exercicios-semana');
  if (!container) return;

  const nome = getNomeUsuarioAtual();
  const hoje = new Date();
  const dias = [];

  // Gera os últimos 7 dias
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    dias.push({
      date: d,
      iso: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'),
      dia: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      num: d.getDate(),
      isHoje: i === 0
    });
  }

  const dataInicio = dias[0].iso;
  const dataFim = dias[6].iso;

  let registros = {};

  // Busca do Supabase
  if (supabaseClient) {
    try {
      const { data: rows, error } = await supabaseClient
        .from('exercicios_diarios')
        .select('data, exercicios')
        .eq('nome', nome)
        .gte('data', dataInicio)
        .lte('data', dataFim);

      if (!error && rows) {
        rows.forEach(r => { registros[r.data] = r.exercicios || []; });
      }
    } catch (_) {}
  }

  // Merge com localStorage
  const local = JSON.parse(localStorage.getItem('exercicios_local') || '{}');
  dias.forEach(d => {
    if (!registros[d.iso] && local[d.iso]) {
      registros[d.iso] = local[d.iso];
    }
  });

  const totalExercicios = 5;

  container.innerHTML = dias.map(d => {
    const exs = registros[d.iso] || [];
    const count = exs.length;
    let progClass = '';
    let progText = '0';

    if (count === totalExercicios) {
      progClass = 'feito';
      progText = '✓';
    } else if (count > 0) {
      progClass = 'parcial';
      progText = count + '/' + totalExercicios;
    } else {
      progText = '–';
    }

    return `
      <div class="exercicios-dia ${d.isHoje ? 'hoje' : ''}">
        <span class="exercicios-dia-nome">${d.dia}</span>
        <span class="exercicios-dia-num">${d.num}</span>
        <div class="exercicios-dia-prog ${progClass}">${progText}</div>
      </div>
    `;
  }).join('');
}