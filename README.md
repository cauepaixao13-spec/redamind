# RedalMind — Plataforma de Redação ENEM

SPA completa em Angular 17 com Landing Page pública, autenticação e dashboard interno.

---

## 🚀 Como executar

### Pré-requisitos
- Node.js **18+** instalado → https://nodejs.org
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli
```

### Instalação e execução

```bash
# 1. Entre na pasta do projeto
cd redamind-app

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
ng serve --open
```

O browser abrirá automaticamente em **http://localhost:4200**

---

## 🔑 Credenciais de acesso

| Campo   | Valor |
|---------|-------|
| Usuário | `Caue` |
| Senha   | `Admin` |

---

## 🗺️ Estrutura de rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing Page pública |
| `/login` | Tela de autenticação |
| `/dashboard` | Redireciona para Visão Geral |
| `/dashboard/visao-geral` | Dashboard principal com gráficos |
| `/dashboard/desafio-semanal` | Editor de redação com checklist ENEM |
| `/dashboard/modulos` | Grid de módulos com progresso |
| `/dashboard/flashcards` | Sistema de repetição espaçada |
| `/dashboard/evolucao` | Gráficos de evolução de nota e competências |
| `/dashboard/metas` | Objetivos e metas pessoais |
| `/dashboard/ranking` | Ranking semanal gamificado |
| `/dashboard/configuracoes` | Preferências e configurações |

---

## 🏗️ Arquitetura Angular 17

```
src/app/
├── core/
│   ├── guards/auth.guard.ts          ← Protege rotas do dashboard
│   └── services/
│       ├── auth.service.ts           ← Login/logout com signals
│       └── data.service.ts           ← Dados mockados (sem backend)
├── features/
│   ├── public/landing/               ← FASE 1: Landing Page
│   ├── auth/login/                   ← FASE 2: Autenticação
│   └── dashboard/                    ← FASE 3: Área interna
│       ├── layout/                   ← Shell com sidebar
│       ├── sidebar/                  ← Navegação lateral
│       └── pages/
│           ├── visao-geral/
│           ├── desafio-semanal/
│           ├── modulos/
│           ├── flashcards/
│           ├── evolucao/
│           ├── metas/
│           ├── ranking/
│           └── configuracoes/
├── app.component.ts                  ← Root com <router-outlet>
├── app.config.ts                     ← Providers (router, animations, http)
└── app.routes.ts                     ← Lazy loading de todos os módulos
```

### Decisões de arquitetura

- **Standalone Components** — Angular 17, sem NgModules
- **Lazy Loading** — todos os componentes carregados sob demanda
- **Signals** — estado reativo com `signal()` e `computed()`
- **AuthGuard funcional** — `CanActivateFn` protege `/dashboard/**`
- **SVG puro** — gráficos de linha, barras e radar sem biblioteca externa
- **CSS Custom Properties** — design system centralizado em `styles.scss`
- **Mobile First** — responsivo com breakpoints em 1024px, 768px, 480px

---

## 🎨 Design System

| Token | Valor |
|-------|-------|
| `--bg-deepest` | `#04070f` |
| `--bg-dark` | `#070c18` |
| `--bg-card` | `#0d1526` |
| `--accent` | `#00c4ff` |
| `--violet` | `#7c3aed` |
| `--sidebar-w` | `220px` |

---

## 📦 Build para produção

```bash
ng build
```

Os arquivos ficam em `dist/redamind-app/browser/`.
