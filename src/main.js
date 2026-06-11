"use strict";
/**
 * ══════════════════════════════════════════════════════════
 *  REDAMIND PLATFORM — main.ts
 *  Compilar: tsc main.ts --target ES2015 --lib DOM,ES2015
 *  Saída:    main.js  (referenciado no index.html)
 * ══════════════════════════════════════════════════════════
 */
// ──────────────────────────────────────────────────────────
// DADOS MOCK
// ──────────────────────────────────────────────────────────
const CARDS = [
    {
        id: 1,
        question: 'O que é tese?',
        answer: 'Posicionamento claro do autor sobre a temática, geralmente apresentado na introdução.'
    },
    {
        id: 2,
        question: 'Quais elementos compõem a proposta de intervenção completa?',
        answer: 'Agente, ação, meio/modo, finalidade e detalhamento.'
    },
    {
        id: 3,
        question: 'Cite 3 conectivos de adição.',
        answer: 'Ademais, outrossim, além disso.'
    },
    {
        id: 4,
        question: 'O que avalia a Competência 1 do ENEM?',
        answer: 'Domínio da modalidade escrita formal da Língua Portuguesa.'
    },
    {
        id: 5,
        question: 'Exemplo de repertório legítimo para tema social.',
        answer: 'Constituição Federal de 1988, Art. 5º — princípio da igualdade.'
    }
];
const MODULES = [
    { id: 1, emoji: '📖', color: '#29d4f0', title: 'Introdução à redação', description: 'Fundamentos da dissertação argumentativa', aulas: 6, duration: '45min', progress: 100, done: true },
    { id: 2, emoji: '🏗️', color: '#7c6ff7', title: 'Estrutura ENEM', description: 'Os 4 parágrafos canônicos e suas funções', aulas: 8, duration: '1h 10min', progress: 100, done: true },
    { id: 3, emoji: '💡', color: '#10b981', title: 'Introdução à tese', description: 'Como construir teses claras e estratégicas', aulas: 7, duration: '1h', progress: 99, done: false },
    { id: 4, emoji: '🔗', color: '#f59e0b', title: 'Desenvolvimento argumentativo', description: 'Argumentos sólidos e bem articulados', aulas: 10, duration: '1h 30min', progress: 60, done: false },
    { id: 5, emoji: '📚', color: '#ef4444', title: 'Repertório sociocultural', description: 'Banco de citações, dados e referências', aulas: 12, duration: '2h', progress: 25, done: false },
    { id: 6, emoji: '🔤', color: '#8b5cf6', title: 'Coesão e coerência', description: 'Conectivos, progressão e referenciação', aulas: 8, duration: '1h', progress: 0, done: false },
    { id: 7, emoji: '⚖️', color: '#06b6d4', title: 'Proposta de intervenção', description: 'Agente, ação, meio, finalidade e detalhamento', aulas: 6, duration: '50min', progress: 0, done: false },
    { id: 8, emoji: '🎯', color: '#84cc16', title: 'Revisão estratégica', description: 'Como revisar e identificar erros estruturais', aulas: 5, duration: '40min', progress: 0, done: false },
    { id: 9, emoji: '🏆', color: '#f97316', title: 'Redação nota 1000', description: 'Análise de redações exemplares com nota máxima', aulas: 6, duration: '1h 30min', progress: 0, done: false }
];
const GOALS = [
    { id: 1, emoji: '🎯', title: 'Atingir 950 pontos no ENEM', subtitle: 'Próx. semana', progress: 79 },
    { id: 2, emoji: '✍️', title: 'Escrever 1 redação por semana', subtitle: 'Semanal', progress: 100 },
    { id: 3, emoji: '📚', title: 'Completar módulo de Repertório', subtitle: 'Esta semana', progress: 55 },
    { id: 4, emoji: '🔥', title: 'Manter streak de 30 dias', subtitle: '30 dias', progress: 23 }
];
const RANKING = [
    { pos: 1, initial: 'M', color: '#f59e0b', name: 'Mariana L.', level: 18, xp: 4820, isMe: false },
    { pos: 2, initial: 'L', color: '#29d4f0', name: 'Lucas A.', level: 17, xp: 4210, isMe: false },
    { pos: 3, initial: 'J', color: '#10b981', name: 'Júlia T.', level: 16, xp: 3985, isMe: false },
    { pos: 4, initial: 'V', color: '#7c6ff7', name: 'Você', level: 12, xp: 2480, isMe: true },
    { pos: 5, initial: 'P', color: '#ef4444', name: 'Pedro M.', level: 11, xp: 2210, isMe: false },
    { pos: 6, initial: 'B', color: '#06b6d4', name: 'Bianca R.', level: 10, xp: 1980, isMe: false },
    { pos: 7, initial: 'R', color: '#8b5cf6', name: 'Rafael S.', level: 9, xp: 1700, isMe: false }
];
// ──────────────────────────────────────────────────────────
// ESTADO GLOBAL
// ──────────────────────────────────────────────────────────
let cardIndex = 0;
let cardFlipped = false;
let sidebarOpen = false;
let focusMode = false;
// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────
/** Seleciona elemento com asserção de não-nulo */
function $(sel, ctx = document) {
    return ctx.querySelector(sel);
}
/** Seleciona múltiplos elementos */
function $$(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
}
/** Formata número com separadores pt-BR */
function fmt(n) {
    return n.toLocaleString('pt-BR');
}
// ──────────────────────────────────────────────────────────
// AUTENTICAÇÃO
// ──────────────────────────────────────────────────────────
function validateCredentials(user, pass) {
    return user === 'Caue' && pass === 'Admin';
}
function handleLogin() {
    const userInput = $('#username-input');
    const passInput = $('#password-input');
    const errorEl = $('#login-error');
    const loginBtn = $('#login-btn');
    const user = userInput.value.trim();
    const pass = passInput.value;
    // Estado de loading
    loginBtn.classList.add('loading');
    errorEl.classList.add('hidden');
    // Simula latência de autenticação
    setTimeout(() => {
        loginBtn.classList.remove('loading');
        if (validateCredentials(user, pass)) {
            // Sucesso → transição para dashboard
            const loginPage = $('#login-page');
            const dashboardPage = $('#dashboard-page');
            loginPage.classList.add('fade-out');
            setTimeout(() => {
                loginPage.classList.add('hidden');
                dashboardPage.classList.remove('hidden');
                dashboardPage.classList.add('fade-in');
                onDashboardReady();
            }, 350);
        }
        else {
            // Falha → mostrar erro
            errorEl.classList.remove('hidden');
            passInput.value = '';
            passInput.focus();
        }
    }, 700);
}
function logout() {
    const loginPage = $('#login-page');
    const dashboardPage = $('#dashboard-page');
    const userInput = $('#username-input');
    const passInput = $('#password-input');
    const errorEl = $('#login-error');
    dashboardPage.classList.add('fade-out');
    setTimeout(() => {
        dashboardPage.classList.remove('hidden', 'fade-in');
        dashboardPage.classList.add('hidden');
        dashboardPage.classList.remove('fade-out');
        loginPage.classList.remove('hidden', 'fade-out');
        loginPage.classList.add('fade-in');
        // Reset
        userInput.value = '';
        passInput.value = '';
        errorEl.classList.add('hidden');
        cardIndex = 0;
        cardFlipped = false;
        setTimeout(() => loginPage.classList.remove('fade-in'), 400);
    }, 350);
}
// ──────────────────────────────────────────────────────────
// NAVEGAÇÃO
// ──────────────────────────────────────────────────────────
function goTo(section) {
    // Esconde todas as seções
    $$('.content-section').forEach(s => s.classList.remove('active'));
    // Mostra seção alvo
    const target = $(`#section-${section}`);
    if (target)
        target.classList.add('active');
    // Atualiza nav ativa
    $$('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = $(`[data-section="${section}"]`);
    if (navItem)
        navItem.classList.add('active');
    // Inicializa gráficos se necessário
    if (section === 'evolucao') {
        setTimeout(() => drawEvolutionCharts(), 80);
    }
    // Fecha sidebar mobile
    if (sidebarOpen)
        closeSidebar();
}
function toggleSidebar() {
    sidebarOpen ? closeSidebar() : openSidebar();
}
function openSidebar() {
    sidebarOpen = true;
    $('#sidebar').classList.add('open');
    $('#sidebar-overlay').classList.add('vis');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebarOpen = false;
    $('#sidebar').classList.remove('open');
    $('#sidebar-overlay').classList.remove('vis');
    document.body.style.overflow = '';
}
// ──────────────────────────────────────────────────────────
// GRÁFICOS SVG
// ──────────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';
/** Cria elemento SVG com atributos */
function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    const keys = Object.keys(attrs);
    keys.forEach(k => el.setAttribute(k, String(attrs[k])));
    return el;
}
/** Constrói path de curva bezier suavizada */
function buildCurve(xs, ys) {
    let d = `M ${xs[0]} ${ys[0]}`;
    for (let i = 1; i < xs.length; i++) {
        const cpx = (xs[i - 1] + xs[i]) / 2;
        d += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`;
    }
    return d;
}
/** Gráfico de linha com área preenchida */
function drawLineChart(containerId, data, color = '#29d4f0') {
    const svg = document.getElementById(containerId);
    if (!svg)
        return;
    svg.innerHTML = '';
    const W = 480, H = 170;
    const pad = { t: 16, r: 14, b: 28, l: 42 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;
    const minV = Math.min(...data) * 0.88;
    const maxV = Math.max(...data) * 1.05;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // Gradient def
    const gradId = `grad-${containerId}`;
    const defs = svgEl('defs', {});
    const grad = svgEl('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
    const s1 = svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '0.28' });
    const s2 = svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0' });
    grad.appendChild(s1);
    grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);
    // Scale
    const xs = data.map((_, i) => pad.l + (i / (data.length - 1)) * pw);
    const ys = data.map(v => pad.t + (1 - (v - minV) / (maxV - minV)) * ph);
    // Grid lines + Y labels
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
        const y = pad.t + (i / gridCount) * ph;
        const val = Math.round(maxV - (i / gridCount) * (maxV - minV));
        svg.appendChild(svgEl('line', {
            x1: pad.l, y1: y, x2: W - pad.r, y2: y,
            stroke: 'rgba(255,255,255,.05)', 'stroke-width': '1'
        }));
        const txt = svgEl('text', {
            x: pad.l - 6, y: y + 4,
            fill: '#4a5c7f', 'font-size': '10', 'text-anchor': 'end', 'font-family': 'inherit'
        });
        txt.textContent = String(val);
        svg.appendChild(txt);
    }
    // Build paths
    const linePath = buildCurve(xs, ys);
    const areaPath = linePath +
        ` L ${xs[xs.length - 1]},${pad.t + ph} L ${xs[0]},${pad.t + ph} Z`;
    // Area fill
    svg.appendChild(svgEl('path', { d: areaPath, fill: `url(#${gradId})` }));
    // Line
    svg.appendChild(svgEl('path', {
        d: linePath, fill: 'none',
        stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
    // Dots + X labels
    const xLabels = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
    xs.forEach((cx, i) => {
        svg.appendChild(svgEl('circle', {
            cx, cy: ys[i], r: '3.5',
            fill: color, stroke: '#070c1a', 'stroke-width': '2'
        }));
        const lbl = svgEl('text', {
            x: cx, y: pad.t + ph + 16,
            fill: '#4a5c7f', 'font-size': '10',
            'text-anchor': 'middle', 'font-family': 'inherit'
        });
        lbl.textContent = xLabels[i] || '';
        svg.appendChild(lbl);
    });
}
/** Gráfico de radar (teia) para competências ENEM */
function drawRadarChart(containerId) {
    const svg = document.getElementById(containerId);
    if (!svg)
        return;
    svg.innerHTML = '';
    const data = [160, 140, 170, 150, 135]; // C1-C5 (max 200)
    const labels = ['C1', 'C2', 'C3', 'C4', 'C5'];
    const n = data.length;
    const maxV = 200;
    const cx = 130, cy = 120, R = 82;
    svg.setAttribute('viewBox', '0 0 260 240');
    const pt = (i, r) => {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    };
    // Grid polygons (5 levels)
    for (let lv = 1; lv <= 5; lv++) {
        const r = (R * lv) / 5;
        const pts = Array.from({ length: n }, (_, i) => {
            const p = pt(i, r);
            return `${p.x},${p.y}`;
        }).join(' ');
        svg.appendChild(svgEl('polygon', {
            points: pts, fill: 'none',
            stroke: 'rgba(255,255,255,.07)', 'stroke-width': '1'
        }));
    }
    // Axes + labels
    for (let i = 0; i < n; i++) {
        const p = pt(i, R);
        const lp = pt(i, R + 18);
        svg.appendChild(svgEl('line', {
            x1: cx, y1: cy, x2: p.x, y2: p.y,
            stroke: 'rgba(255,255,255,.1)', 'stroke-width': '1'
        }));
        const txt = svgEl('text', {
            x: lp.x, y: lp.y, fill: '#7a90b5',
            'font-size': '12', 'text-anchor': 'middle',
            'dominant-baseline': 'middle', 'font-weight': '600', 'font-family': 'inherit'
        });
        txt.textContent = labels[i];
        svg.appendChild(txt);
    }
    // Data polygon
    const dataPts = data.map((v, i) => {
        const p = pt(i, (R * v) / maxV);
        return `${p.x},${p.y}`;
    }).join(' ');
    svg.appendChild(svgEl('polygon', {
        points: dataPts,
        fill: 'rgba(124,111,247,.22)', stroke: '#7c6ff7', 'stroke-width': '2'
    }));
    // Data dots
    data.forEach((v, i) => {
        const p = pt(i, (R * v) / maxV);
        svg.appendChild(svgEl('circle', {
            cx: p.x, cy: p.y, r: '4',
            fill: '#7c6ff7', stroke: '#070c1a', 'stroke-width': '1.5'
        }));
    });
}
/** Gráfico de barras — tempo de estudo */
function drawBarChart(containerId) {
    const svg = document.getElementById(containerId);
    if (!svg)
        return;
    svg.innerHTML = '';
    const data = [2.5, 1.8, 3.2, 0, 4.1, 2.7, 3.8];
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const maxV = 5;
    const W = 380, H = 155;
    const pad = { t: 14, r: 14, b: 28, l: 30 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const barW = pw / data.length;
    // Grid
    for (let i = 0; i <= 5; i++) {
        const y = pad.t + (i / 5) * ph;
        svg.appendChild(svgEl('line', {
            x1: pad.l, y1: y, x2: W - pad.r, y2: y,
            stroke: 'rgba(255,255,255,.05)', 'stroke-width': '1'
        }));
    }
    data.forEach((v, i) => {
        const barH = (v / maxV) * ph;
        const x = pad.l + i * barW + barW * 0.18;
        const bw = barW * 0.64;
        const y = pad.t + ph - barH;
        svg.appendChild(svgEl('rect', {
            x, y, width: bw, height: Math.max(barH, 0),
            rx: '3',
            fill: v > 0 ? 'rgba(124,111,247,.72)' : 'rgba(255,255,255,.04)'
        }));
        const lbl = svgEl('text', {
            x: x + bw / 2, y: pad.t + ph + 16,
            fill: '#4a5c7f', 'font-size': '10',
            'text-anchor': 'middle', 'font-family': 'inherit'
        });
        lbl.textContent = days[i];
        svg.appendChild(lbl);
    });
}
/** Gráfico multi-linha — evolução por competência */
function drawMultiLineChart(containerId) {
    const svg = document.getElementById(containerId);
    if (!svg)
        return;
    svg.innerHTML = '';
    const datasets = [
        { data: [80, 100, 130, 145, 155, 160, 165], color: '#29d4f0', label: 'C1' },
        { data: [70, 85, 100, 120, 135, 145, 155], color: '#7c6ff7', label: 'C2' },
        { data: [90, 110, 130, 148, 160, 168, 172], color: '#10b981', label: 'C3' },
        { data: [65, 80, 95, 115, 130, 140, 150], color: '#f59e0b', label: 'C4' },
        { data: [60, 75, 90, 105, 118, 128, 135], color: '#ef4444', label: 'C5' }
    ];
    const W = 680, H = 175;
    const pad = { t: 16, r: 60, b: 28, l: 40 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;
    const n = datasets[0].data.length;
    const minV = 0, maxV = 200;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const xScale = (i) => pad.l + (i / (n - 1)) * pw;
    const yScale = (v) => pad.t + (1 - (v - minV) / (maxV - minV)) * ph;
    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = pad.t + (i / 4) * ph;
        svg.appendChild(svgEl('line', {
            x1: pad.l, y1: y, x2: W - pad.r, y2: y,
            stroke: 'rgba(255,255,255,.05)', 'stroke-width': '1'
        }));
        const val = Math.round(maxV - (i / 4) * maxV);
        const txt = svgEl('text', {
            x: pad.l - 6, y: y + 4,
            fill: '#4a5c7f', 'font-size': '10', 'text-anchor': 'end', 'font-family': 'inherit'
        });
        txt.textContent = String(val);
        svg.appendChild(txt);
    }
    datasets.forEach((ds, idx) => {
        const xs = ds.data.map((_, i) => xScale(i));
        const ys = ds.data.map(v => yScale(v));
        const linePath = buildCurve(xs, ys);
        svg.appendChild(svgEl('path', {
            d: linePath, fill: 'none',
            stroke: ds.color, 'stroke-width': '1.8', opacity: '0.88'
        }));
        // Dot at last point
        svg.appendChild(svgEl('circle', {
            cx: xs[xs.length - 1], cy: ys[ys.length - 1], r: '3.5',
            fill: ds.color, stroke: '#070c1a', 'stroke-width': '1.5'
        }));
        // Legend
        const ly = pad.t + idx * 28 + 8;
        svg.appendChild(svgEl('circle', {
            cx: W - pad.r + 10, cy: ly, r: '5', fill: ds.color
        }));
        const legendTxt = svgEl('text', {
            x: W - pad.r + 20, y: ly + 4,
            fill: '#8b9fc5', 'font-size': '11', 'font-family': 'inherit'
        });
        legendTxt.textContent = ds.label;
        svg.appendChild(legendTxt);
    });
}
/** Inicializa gráficos da Visão Geral */
function drawVisaoGeralCharts() {
    drawLineChart('chart-nota-visao', [380, 460, 550, 620, 710, 790, 850, 920], '#29d4f0');
    drawRadarChart('chart-radar-visao');
}
/** Inicializa gráficos da Evolução */
function drawEvolutionCharts() {
    drawLineChart('chart-nota-evo', [380, 460, 550, 620, 710, 790, 850, 920], '#29d4f0');
    drawBarChart('chart-tempo');
    drawMultiLineChart('chart-comp');
    // Renderiza legenda da competência
    const legendEl = document.getElementById('comp-legend');
    if (legendEl) {
        const items = [
            { color: '#29d4f0', label: 'C1' },
            { color: '#7c6ff7', label: 'C2' },
            { color: '#10b981', label: 'C3' },
            { color: '#f59e0b', label: 'C4' },
            { color: '#ef4444', label: 'C5' }
        ];
        legendEl.innerHTML = items.map(it => `
      <div class="comp-leg-item">
        <span class="comp-leg-dot" style="background:${it.color}"></span>
        ${it.label}
      </div>
    `).join('');
    }
}
// ──────────────────────────────────────────────────────────
// FLASHCARDS
// ──────────────────────────────────────────────────────────
function renderCard(idx) {
    const card = CARDS[idx];
    const fcEl = $('#flashcard');
    const questionEl = $('#fc-question');
    const answerEl = $('#fc-answer');
    const counterEl = $('#fc-counter');
    const showBtn = $('#btn-show-answer');
    const diffBtns = $('#diff-btns');
    // Reset flip
    cardFlipped = false;
    fcEl.classList.remove('flipped');
    // Populate
    questionEl.textContent = card.question;
    answerEl.textContent = card.answer;
    counterEl.textContent = `Card ${idx + 1} de ${CARDS.length}`;
    showBtn.classList.remove('hidden');
    diffBtns.classList.add('hidden');
}
function showAnswer() {
    if (cardFlipped)
        return;
    cardFlipped = true;
    $('#flashcard').classList.add('flipped');
    $('#btn-show-answer').classList.add('hidden');
    $('#diff-btns').classList.remove('hidden');
}
function advanceCard() {
    cardIndex = (cardIndex + 1) % CARDS.length;
    renderCard(cardIndex);
}
// ──────────────────────────────────────────────────────────
// CONTAGEM DE PALAVRAS
// ──────────────────────────────────────────────────────────
function countWords(text) {
    const t = text.trim();
    return t === '' ? 0 : t.split(/\s+/).length;
}
function updateWordUI(count) {
    const countEl = document.getElementById('word-count');
    const statusEl = document.getElementById('word-status');
    if (!countEl || !statusEl)
        return;
    countEl.textContent = `${count} ${count === 1 ? 'palavra' : 'palavras'}`;
    statusEl.className = 'wstatus';
    if (count < 250) {
        statusEl.textContent = `${250 - count} para mínimo`;
        statusEl.classList.add('warning');
    }
    else if (count <= 350) {
        statusEl.textContent = '✓ Tamanho ideal';
        statusEl.classList.add('success');
    }
    else {
        statusEl.textContent = `${count - 350} acima do máximo`;
        statusEl.classList.add('error');
    }
}
// ──────────────────────────────────────────────────────────
// RENDER DINÂMICO
// ──────────────────────────────────────────────────────────
function renderModules() {
    const grid = document.getElementById('modules-grid');
    if (!grid)
        return;
    grid.innerHTML = MODULES.map(m => `
    <div class="module-card ${m.done ? 'done' : ''}">
      <div class="mc-header">
        <div class="mc-icon" style="background:${m.color}18;border-color:${m.color}40">
          ${m.emoji}
        </div>
        ${m.done ? `<span class="mc-badge">✓ Concluído</span>` : ''}
      </div>
      <p class="mc-title">${m.title}</p>
      <p class="mc-desc">${m.description}</p>
      <div class="mc-meta">
        <span>📚 ${m.aulas} aulas</span>
        <span>⏱ ${m.duration}</span>
      </div>
      <div class="pb-track">
        <div class="pb-fill" style="width:${m.progress}%;background:${m.color}"></div>
      </div>
      <p class="mc-prog-label">Progresso <strong>${m.progress}%</strong></p>
    </div>
  `).join('');
}
function renderGoals() {
    const grid = document.getElementById('goals-grid');
    if (!grid)
        return;
    grid.innerHTML = GOALS.map(g => `
    <div class="goal-card">
      <div class="goal-head">
        <span class="goal-ico">${g.emoji}</span>
        ${g.progress === 100 ? `<span class="goal-done">✓ Concluído</span>` : ''}
      </div>
      <p class="goal-title">${g.title}</p>
      <p class="goal-subtitle">${g.subtitle}</p>
      <div class="pb-track">
        <div class="pb-fill" style="width:${g.progress}%"></div>
      </div>
      <p class="goal-pct">${g.progress}%</p>
    </div>
  `).join('');
}
function renderRanking() {
    const list = document.getElementById('ranking-list');
    if (!list)
        return;
    const medals = ['🥇', '🥈', '🥉'];
    list.innerHTML = RANKING.map(u => `
    <div class="rank-item ${u.isMe ? 'me' : ''}">
      <div class="rank-pos">
        ${u.pos <= 3
        ? `<span class="rank-medal">${medals[u.pos - 1]}</span>`
        : `<span class="pos-num">${u.pos}</span>`}
      </div>
      <div class="rank-avatar" style="background:${u.color}18;border-color:${u.color}66;color:${u.color}">
        ${u.initial}
      </div>
      <div class="rank-info">
        <p class="rank-name">${u.name}</p>
        <p class="rank-level">Nível ${u.level}</p>
      </div>
      <div class="rank-xp">
        <span>⚡</span>
        <span class="xp-val">${fmt(u.xp)} XP</span>
      </div>
    </div>
  `).join('');
}
// ──────────────────────────────────────────────────────────
// INICIALIZAÇÃO DO DASHBOARD
// ──────────────────────────────────────────────────────────
function onDashboardReady() {
    renderModules();
    renderGoals();
    renderRanking();
    renderCard(0);
    // Gráficos da visão geral com pequeno delay (esperar o render)
    setTimeout(drawVisaoGeralCharts, 120);
}
// ──────────────────────────────────────────────────────────
// EVENT LISTENERS
// ──────────────────────────────────────────────────────────
function initEventListeners() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    // ── Login ──
    $('#login-btn').addEventListener('click', handleLogin);
    ['#username-input', '#password-input'].forEach(sel => {
        $(sel).addEventListener('keydown', (e) => {
            if (e.key === 'Enter')
                handleLogin();
            $('#login-error').classList.add('hidden');
        });
    });
    // Toggle visibilidade senha
    $('#toggle-pw').addEventListener('click', () => {
        const inp = $('#password-input');
        const open = $('#eye-open');
        const cls = $('#eye-closed');
        const isHidden = inp.type === 'password';
        inp.type = isHidden ? 'text' : 'password';
        open.classList.toggle('hidden', isHidden);
        cls.classList.toggle('hidden', !isHidden);
    });
    // ── Navegação ──
    $$('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', () => {
            goTo(item.dataset['section']);
        });
        // Suporte a teclado
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goTo(item.dataset['section']);
            }
        });
    });
    // Botão "Novo desafio"
    (_a = document.getElementById('btn-novo-desafio')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => goTo('desafio-semanal'));
    // Atalhos de ação na visão geral
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-nav]');
        if (target === null || target === void 0 ? void 0 : target.dataset['nav'])
            goTo(target.dataset['nav']);
    });
    // ── Menu mobile ──
    (_b = document.getElementById('menu-toggle')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', toggleSidebar);
    (_c = document.getElementById('sidebar-overlay')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', closeSidebar);
    // ── Flashcards ──
    (_d = document.getElementById('btn-show-answer')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', showAnswer);
    // Clique no card também vira
    (_e = document.getElementById('flashcard')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        if (!cardFlipped)
            showAnswer();
    });
    (_f = document.getElementById('btn-easy')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', advanceCard);
    (_g = document.getElementById('btn-hard')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', advanceCard);
    // ── Contagem de palavras ──
    (_h = document.getElementById('writing-area')) === null || _h === void 0 ? void 0 : _h.addEventListener('input', (e) => {
        updateWordUI(countWords(e.target.value));
    });
    // ── Salvar redação ──
    (_j = document.getElementById('btn-save')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', () => {
        const ta = $('#writing-area');
        const words = countWords(ta.value);
        if (!ta.value.trim()) {
            showToast('⚠️ Escreva sua redação antes de enviar.', 'warning');
            return;
        }
        if (words < 250 || words > 350) {
            showToast(`⚠️ Redação com ${words} palavras. Ideal: entre 250 e 350.`, 'warning');
            return;
        }
        showToast('🎉 Redação enviada para análise da IA com sucesso!', 'success');
    });
    // ── Modo foco ──
    (_k = document.getElementById('btn-foco')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', () => {
        focusMode = !focusMode;
        const aside = $('.desafio-aside');
        const layout = $('.desafio-layout');
        const btn = $('#btn-foco');
        if (focusMode) {
            aside.style.display = 'none';
            layout.style.gridTemplateColumns = '1fr';
            btn.textContent = '🔲 Sair do foco';
        }
        else {
            aside.style.display = '';
            layout.style.gridTemplateColumns = '';
            btn.textContent = '🎯 Modo foco';
        }
    });
    // ── Logout ──
    (_l = document.getElementById('logout-btn')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', logout);
    // ── Botão "Salvar preferências" nas configurações ──
    const configBtn = document.querySelector('.settings-card .btn-primary');
    configBtn === null || configBtn === void 0 ? void 0 : configBtn.addEventListener('click', () => {
        showToast('✅ Preferências salvas!', 'success');
    });
    // ── Redimensionamento: re-desenha gráficos visíveis ──
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const active = $('.content-section.active');
            if (!active)
                return;
            if (active.id === 'section-visao-geral')
                drawVisaoGeralCharts();
            if (active.id === 'section-evolucao')
                drawEvolutionCharts();
        }, 200);
    });
}
// ──────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    var _a;
    // Remove toast anterior se existir
    (_a = document.getElementById('rm-toast')) === null || _a === void 0 ? void 0 : _a.remove();
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    const toast = document.createElement('div');
    toast.id = 'rm-toast';
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: '9999',
        background: '#0e1929',
        border: `1px solid ${colors[type]}66`,
        borderLeft: `3px solid ${colors[type]}`,
        borderRadius: '10px',
        padding: '.85rem 1.2rem',
        color: '#eef2ff',
        fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
        fontSize: '.85rem',
        fontWeight: '600',
        boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        animation: 'fadeIn .3s ease',
        maxWidth: '360px',
        lineHeight: '1.4'
    });
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOutScale .3s ease forwards';
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}
// ──────────────────────────────────────────────────────────
// PONTO DE ENTRADA
// ──────────────────────────────────────────────────────────
function init() {
    initEventListeners();
    // Foca no campo usuário ao carregar
    setTimeout(() => $('#username-input').focus(), 100);
}
document.addEventListener('DOMContentLoaded', init);