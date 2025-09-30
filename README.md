# API Distribution Dashboard

Dashboard web untuk integrasi 10 API kelompok mahasiswa mata kuliah Sistem Komputasi dalam satu interface terpadu.

## Project Overview

Aplikasi Next.js 15 dengan Turbopack yang mengintegrasikan berbagai API eksternal dengan fitur:
- Sidebar navigation untuk 10 kelompok
- API status monitoring
- Data visualization
- Responsive design

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router + Turbopack)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript
- **Package Manager**: Yarn

## Getting Started

### Development Server

```bash
yarn dev
```

Server akan berjalan di [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
yarn build
```

### Start Production Server

```bash
yarn start
```

## Implemented APIs

### Kelompok 1: Rental Baju

**Status**: Implemented with CORS solution
**URL**: `/k1`
**API**: https://rental-baju.netlify.app (proxied)

**Features**:
- Product list dengan pagination
- Search functionality
- Product detail modal
- Status filtering (AVAILABLE)
- Responsive grid layout
- API Route Proxy pattern (resolve CORS)

**Dokumentasi**:
- [Implementation Guide](./docs/kelompok-1/implementasi.md)
- [CORS Solution](./docs/cors-solution-summary.md)
- [Visual Guide](./docs/cors-visual-guide.md)

## Project Structure

```
api-delivery/
├── app/
│   ├── api/
│   │   └── kelompok-1/
│   │       └── products/
│   │           ├── route.ts            # API proxy (CORS solution)
│   │           └── [id]/route.ts       # Detail proxy
│   ├── k1/
│   │   └── page.tsx                    # Kelompok 1 dashboard
│   └── page.tsx                        # Homepage
├── lib/
│   ├── types.ts                        # TypeScript interfaces
│   ├── api-client.ts                   # API client functions
│   └── README.md                       # Library documentation
├── docs/
│   ├── cors-solution-summary.md        # CORS quick reference
│   ├── cors-visual-guide.md            # Visual diagrams
│   └── kelompok-1/
│       ├── kelompok1.md                # API documentation
│       ├── implementasi.md             # Implementation guide
│       ├── cors-analysis-solution.md   # Detailed CORS analysis
│       └── public-api.json             # Postman collection
└── components/                         # Reusable components (future)
```

## Development Progress

- [x] Project setup (Next.js + TypeScript + Tailwind)
- [x] Kelompok 1: Rental Baju API integration
- [x] CORS issue analysis & resolution (API proxy pattern)
- [x] Documentation (implementation + CORS solution)
- [ ] Kelompok 2-10: API integrations (pending)
- [ ] Sidebar navigation component
- [ ] API status monitoring
- [ ] Homepage dashboard
- [ ] Error logging system

## API Integration Guidelines

### Technical Requirements
- Response time < 3 detik (recommended)
- Standard JSON response format
- Timeout 10 detik maksimal
- Error handling dengan HTTP status codes
- Authentication (Bearer token / API key jika diperlukan)

### CORS Handling
External APIs tidak perlu CORS configuration. Gunakan **API Route Proxy pattern**:

```typescript
// app/api/kelompok-[N]/route.ts
export async function GET(request: NextRequest) {
  const response = await fetch('https://external-api-url.com');
  return NextResponse.json(await response.json());
}
```

**Dokumentasi**: [CORS Solution Guide](./docs/cors-solution-summary.md)

## Documentation

### Quick Start
- [CLAUDE.md](./CLAUDE.md) - Project overview untuk Claude Code
- [CORS Solution Summary](./docs/cors-solution-summary.md) - Quick reference
- [CORS Visual Guide](./docs/cors-visual-guide.md) - Diagrams & flowcharts

### Technical Docs
- [lib/README.md](./lib/README.md) - Library functions documentation
- [Kelompok 1 Implementation](./docs/kelompok-1/implementasi.md)
- [Kelompok 1 CORS Analysis](./docs/kelompok-1/cors-analysis-solution.md)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
