# Workspace

## Overview

pnpm workspace monorepo using TypeScript. X² Finanças — personal finance web app for the KêQuadrática brand.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### x2-financas (React + Vite, port from $PORT, path `/`)
Premium dark-mode fintech dashboard. Brand: #57BC67 green, #1F1F1F background, Montserrat/Inter fonts.
Pages: Login, Dashboard (KPIs + charts), Fluxo de Caixa, Metas, Cartões, Insights, Configurações.
Features: dark/light mode toggle (ThemeContext), date range filter, notifications bell, logout button, profile photo upload.

### api-server (Express 5, port 8080, path `/api`)
REST API for transactions, goals, cards, and dashboard aggregations (summary, performance, cashflow, expenses-by-category, recent-transactions).

## Key Files

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/db/src/schema/` — Drizzle schemas: transactions, goals, cards
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/x2-financas/src/context/ThemeContext.tsx` — dark/light mode
- `artifacts/x2-financas/src/components/AppShell.tsx` — sidebar, header, notifications, date filter

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Brand Identity

- Primary green: #57BC67
- Hover/depth green: #2F7D44
- Background (dark): #1F1F1F
- Text: #FFFFFF / #D9D9D9
- Headings: Montserrat SemiBold/Bold
- Body: Inter Regular/Medium
- User: Mikaely Alves (initials MA)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
