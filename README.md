# TZM Multi Service — Mecânica Automotiva

Site institucional e sistema de agendamento online da **TZM Multi Service**, oficina mecânica em São Gabriel, BA.

## Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.2.4 | Framework (App Router, Static Export) |
| React | 19.2.4 | UI |
| TypeScript | ^5 | Tipagem |
| Tailwind CSS | ^4 | Estilização (`@theme inline`) |
| Supabase | Cloud | PostgreSQL + Auth + Realtime + Edge Functions |
| Render | Static | Hospedagem e CDN |

## Funcionalidades

- **Site público:** Homepage, serviços, contato, localização (Google Maps)
- **Agendamento online:** Wizard de 5 etapas com bloqueio de horários já reservados
- **Tracking em tempo real:** Acompanhamento via Supabase Realtime (WebSocket)
- **Painel admin:** Dashboard, gestão de agendamentos e serviços, notificação WhatsApp
- **Autenticação:** Supabase Auth (email/password) para área admin
- **Email transacional:** Edge Function com Resend (preparado, integração futura)

## Quick Start

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção (static export → /out)
npm run build

# Lint
npm run lint
```

### Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

> O build funciona sem variáveis (usa placeholder), mas o site precisa delas para funcionar.

## Estrutura

```
src/
├── app/
│   ├── (public)/          # Páginas públicas (Header + Footer)
│   │   ├── agendar/       # Wizard de agendamento
│   │   ├── acompanhar/    # Tracking realtime
│   │   ├── servicos/      # Lista de serviços
│   │   ├── pecas/         # Cadastro de interesse
│   │   └── contato/       # Informações de contato
│   └── admin/
│       ├── login/         # Login
│       └── (protected)/   # Dashboard, agendamentos, serviços
├── components/
│   ├── layout/            # Header, Footer, WhatsAppFloat
│   └── admin/             # AdminGuard
└── lib/
    ├── api.ts             # Queries centralizadas ao Supabase
    ├── auth.ts            # Wrappers de autenticação
    ├── supabase.ts        # Client singleton
    ├── types.ts           # Interfaces TypeScript
    ├── constants.ts       # Dados da empresa, serviços, status
    └── utils.ts           # Formatadores e helpers
supabase/
├── migration.sql          # DDL + RLS + Seed
└── functions/             # Edge Function de email
```

## Deploy

O site é 100% estático (HTML/CSS/JS) hospedado no Render como static site. O `render.yaml` na raiz configura tudo automaticamente.

## Documentação Completa

A pasta `docs/` (local, não commitada) contém documentação detalhada:
- `ARCHITECTURE.md` — Visão geral da arquitetura e fluxos de dados
- `ROUTES.md` — Todas as rotas com detalhes de comportamento
- `DATABASE.md` — Schema, RLS, triggers, seed, manutenção
- `API-LAYER.md` — Funções de API, assinaturas, tratamento de erros
- `AUTH.md` — Fluxo de autenticação e proteção de rotas
- `COMPONENTS.md` — Inventário completo de componentes
- `STYLING.md` — Design system, paleta, Tailwind v4
- `DEPLOY.md` — Guia completo de deploy
- `CONVENTIONS.md` — Regras de código e gotchas
- `EDGE-FUNCTIONS.md` — Edge Function de email

---

&copy; TZM Multi Service — Mecânica Automotiva. São Gabriel, BA.
