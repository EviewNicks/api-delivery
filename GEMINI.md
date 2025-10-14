# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

API Distribution Dashboard untuk Mata Kuliah Sistem Komputasi - aplikasi web yang mengintegrasikan API dari 10 kelompok mahasiswa dalam satu interface terpadu dengan sidebar navigation, API status monitoring, dan data visualization.

## Tech Stack

- **Framework**: Next.js 15.5.4 dengan App Router dan Turbopack
- **UI**: React 19.1.0 dengan TypeScript
- **Styling**: Tailwind CSS 4.0 (PENTING: menggunakan v4, bukan v3)
- **Build Tool**: Turbopack untuk development dan production build
- **Package Manager**: NPM (gunakan npm, bukan yarn)

## Development Commands

### Start Development Server
```bash
npm run dev
```
Menjalankan dev server dengan Turbopack di http://localhost:3000

### Build Production
```bash
npm run build
```
Build aplikasi menggunakan Turbopack untuk optimasi production

### Start Production Server
```bash
npm start
```
Menjalankan production server setelah build

### Linting
```bash
npm run lint
```
Menjalankan ESLint untuk code quality check

## Project Architecture

### Directory Structure
```
api-delivery/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout dengan font configuration
│   ├── page.tsx           # Homepage/landing page
│   ├── globals.css        # Tailwind v4 global styles
│   ├── k1/                # Kelompok 1: Rental Baju
│   │   ├── page.tsx       # Dashboard page
│   │   └── products/[id]/ # Detail page (dedicated route)
│   └── api/               # API Routes (proxy pattern)
│       └── kelompok-1/    # Proxy untuk external APIs
├── lib/                   # Shared utilities dan types
│   ├── types.ts          # TypeScript interfaces
│   ├── api-client.ts     # API client functions
│   └── README.md         # Library documentation
├── docs/                  # Project documentation
│   ├── theme.md          # Design system & theme guide
│   └── kelompok-1/       # Per-group documentation
└── public/               # Static assets
```

### Key Architecture Patterns

**API Proxy Pattern**: Semua external API calls harus melalui Next.js API Routes untuk resolve CORS issues
```typescript
// app/api/kelompok-[N]/route.ts
export async function GET(request: NextRequest) {
  const response = await fetch('https://external-api.com');
  return NextResponse.json(await response.json());
}
```

**Client-Side API Calls**: Gunakan functions di `lib/api-client.ts`
```typescript
// lib/api-client.ts
export async function fetchProducts() {
  return fetch('/api/kelompok-1/products').then(r => r.json());
}
```

**Type Safety**: Semua API responses harus memiliki TypeScript interfaces di `lib/types.ts`

### Path Alias
- `@/*` maps to project root untuk simplified imports
- Contoh: `import { Product } from '@/lib/types'`

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler (Next.js optimized)
- Path alias: `@/*` untuk root directory

## Design System

### Theme Philosophy
Project menggunakan **Modern Flat Minimalist Design** dengan:
- **Light mode only** (no dark mode)
- **Primary color**: Blue (#3b82f6 - Tailwind blue-500)
- **Background**: Off-white (#f9fafb - neutral-50)
- **Typography**: Geist Sans untuk UI, Geist Mono untuk code

### Tailwind CSS v4 Specifics

**CRITICAL**: Project ini menggunakan Tailwind v4 yang memiliki breaking changes dari v3:

1. **Import Statement**: Gunakan `@import "tailwindcss"` bukan `@tailwind` directives
2. **Theme Inline**: Gunakan `@theme inline {}` untuk custom theme
3. **CSS Variables**: CSS variables untuk colors dan fonts
4. **No Config File**: Tailwind v4 tidak require `tailwind.config.js` (optional)

**globals.css Structure** (Tailwind v4):
```css
@import "tailwindcss";

:root {
  --background: #f9fafb;  /* neutral-50 */
  --foreground: #374151;  /* neutral-700 */
}

@theme inline {
  --color-primary-500: #3b82f6;
  --color-neutral-700: #374151;
  /* Custom theme tokens */
}
```

### Color System

**Primary Blue Spectrum**:
- `primary-500`: #3b82f6 (main brand color)
- `primary-600`: #2563eb (hover states)
- `primary-700`: #1d4ed8 (active states)

**Neutral Gray Scale**:
- `neutral-50`: #f9fafb (page background)
- `neutral-200`: #e5e7eb (borders)
- `neutral-700`: #374151 (body text)
- `neutral-800`: #1f2937 (headings)

**Functional Colors**:
- `success`: #10b981 (API online)
- `warning`: #f59e0b (API degraded)
- `error`: #ef4444 (API offline)
- `info`: #06b6d4 (informational)

**Full design system**: See `docs/theme.md` untuk comprehensive guide

### Component Patterns

**Standard Card**:
```tsx
<div className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
  {/* content */}
</div>
```

**Primary Button**:
```tsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
  Action
</button>
```

**API Status Badge**:
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
  Online
</span>
```

**Navigation Sidebar** (active state):
```tsx
<a className="flex items-center px-4 py-3 bg-primary-50 text-primary-700 border-l-4 border-primary-500 font-medium">
  Kelompok 1
</a>
```

### Accessibility Requirements
- WCAG AA compliance untuk contrast ratios
- Focus indicators: `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- Minimum touch targets: 44x44px (mobile), 24x24px (desktop)

## API Integration Guidelines

### Technical Requirements
- Response time target: < 3 detik
- Maximum timeout: 10 detik
- Standard JSON response format
- HTTP status codes untuk error handling
- Authentication: Bearer token atau API key (if needed)

### CORS Handling Strategy
External APIs tidak perlu CORS headers. Gunakan **API Route Proxy Pattern**:

1. Create API route: `app/api/kelompok-[N]/[endpoint]/route.ts`
2. Fetch dari external API di server-side
3. Return response melalui Next.js API Route
4. Client fetch dari internal API route (`/api/kelompok-[N]/...`)

**Dokumentasi lengkap**: See `docs/cors-solution-summary.md`

### Implementation Checklist per Kelompok
1. Create API proxy route di `app/api/kelompok-[N]/`
2. Define TypeScript types di `lib/types.ts`
3. Create API client functions di `lib/api-client.ts`
4. Build dashboard page di `app/k[N]/page.tsx`
5. Add documentation di `docs/kelompok-[N]/`
6. Update sidebar navigation dengan route baru

## Current Implementation Status

### Implemented
- ✅ Kelompok 1 (Rental Baju): Full integration dengan CORS solution
- ✅ API proxy pattern untuk external API calls
- ✅ Design system documentation (`docs/theme.md`)
- ✅ TypeScript type system (`lib/types.ts`)
- ✅ Product detail dedicated page (not modal)

### In Progress
- 🔄 Kelompok 2-10: API integrations (pending)
- 🔄 Sidebar navigation component
- 🔄 Homepage dashboard
- 🔄 API status monitoring system

## Development Workflow

### Fast Refresh dengan Turbopack
- File di `app/` directory auto-reload saat di-edit
- Build time significantly faster dibanding Webpack
- Hot Module Replacement (HMR) untuk instant updates

### Best Practices
1. **Type Safety**: Selalu define interfaces sebelum implement features
2. **API Proxy**: Jangan pernah fetch external APIs directly dari client
3. **Design Consistency**: Reference `docs/theme.md` untuk component styling
4. **Documentation**: Update `lib/README.md` setelah add new functions
5. **Component Reusability**: Extract reusable components ke `/components` (future)

## Font Configuration

Project menggunakan Geist fonts dari `next/font/local`:
- **Geist Sans**: UI elements, body text, headings
- **Geist Mono**: Code snippets, API endpoints, JSON

CSS Variables:
- `--font-geist-sans`
- `--font-geist-mono`

Applied via root layout di `app/layout.tsx`