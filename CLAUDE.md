# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

To run a single test file:
```bash
npx vitest run src/test/example.test.ts
```

## Architecture

**IntegrIAPP** is a Colombian accounting SPA (Single Page Application) built with Vite + React + TypeScript + Tailwind CSS + shadcn/ui.

### Routing & Layout

All routes except `/login` are wrapped in `Layout` (`src/components/Layout.tsx`), which provides the sidebar (`AppSidebar`) and header. The sidebar has three navigation groups: Principal, Catálogos, and Sistema.

Route structure defined in `src/App.tsx`:
- `/` — Dashboard (KPIs, recent invoices, reconciliation summary)
- `/facturas` — Invoice list with search/filter
- `/facturas/nueva` and `/facturas/:id` — Invoice create/edit form (`FacturaForm`)
- `/terceros` — Third parties (clients/suppliers)
- `/cuentas` — Chart of accounts (Plan de Cuentas / PUC)
- `/bancos` — Bank accounts
- `/conciliacion` — Bank reconciliation
- `/dian` — Colombian tax authority (DIAN) queries
- `/configuracion` — Settings

### Key Patterns

- **Path alias**: `@/` resolves to `src/` (configured in `vite.config.ts`)
- **UI components**: All shadcn/ui components live in `src/components/ui/`. Do not modify these directly — add new ones via shadcn CLI.
- **Custom CSS classes**: Reusable utility classes are defined in `src/index.css` under `@layer components`:
  - `.kpi-card`, `.table-container` — layout containers
  - `.page-header`, `.page-title`, `.page-subtitle` — page heading structure
  - `.form-section`, `.form-section-title` — form layout
  - `.status-borrador`, `.status-contabilizado`, `.status-conciliado`, `.status-pendiente`, `.status-rechazado` — status badges
  - `.currency` — monospace right-aligned tabular numbers
- **Currency formatting**: Use `new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })` for Colombian Peso display.
- **Data state**: All pages currently use in-component mock data (no backend integration yet). TanStack Query is configured in `App.tsx` but not yet used for real fetching.

### Testing

Tests use Vitest + @testing-library/react. Test files go in `src/test/` or alongside components. Setup file is `src/test/setup.ts`.
