# Documentation Index

Dokumentasi lengkap untuk API Distribution Dashboard project.

---

## Quick Reference

### 🚀 Getting Started
- [Project Overview](../README.md) - Main project documentation
- [CLAUDE.md](../CLAUDE.md) - Context untuk Claude Code

### ⚡ CORS Solution (Must Read)
- **[CORS Solution Summary](./cors-solution-summary.md)** - Quick reference untuk CORS fix
- **[CORS Visual Guide](./cors-visual-guide.md)** - Diagrams dan flowcharts
- [Detailed CORS Analysis](./kelompok-1/cors-analysis-solution.md) - In-depth analysis

---

## API Integration Guides

### Kelompok 1: Rental Baju
- [Implementation Guide](./kelompok-1/implementasi.md) - Step-by-step implementation
- [API Documentation](./kelompok-1/kelompok1.md) - External API specs
- [CORS Solution](./kelompok-1/cors-analysis-solution.md) - Problem analysis & fix
- [Postman Collection](./kelompok-1/public-api.json) - API testing

**Status**: ✅ Implemented with API proxy pattern

---

## Technical Documentation

### Library Documentation
- [lib/README.md](../lib/README.md) - API client functions reference

### Architecture Patterns
- **API Route Proxy** - Solution untuk CORS issues
- **Client Components** - React client-side rendering
- **Type Safety** - TypeScript interfaces

---

## Common Problems & Solutions

### 1. CORS Error
**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: Use API Route Proxy pattern
```typescript
// app/api/kelompok-[N]/route.ts
export async function GET() {
  const response = await fetch('external-api-url');
  return NextResponse.json(await response.json());
}
```

**Docs**: [CORS Solution Summary](./cors-solution-summary.md)

### 2. External API Slow Response
**Problem**: API response > 10 seconds

**Solution**:
- Adjust timeout in API route
- Implement caching strategy
- Add loading states

### 3. TypeScript Errors
**Problem**: Type mismatch errors

**Solution**: Check type definitions in `lib/types.ts`

---

## Development Workflow

### 1. Setup New Kelompok Integration

```bash
# 1. Create API route proxy
mkdir -p app/api/kelompok-[N]
touch app/api/kelompok-[N]/route.ts

# 2. Update types
# Edit lib/types.ts

# 3. Create page
mkdir -p app/k[N]
touch app/k[N]/page.tsx

# 4. Test
yarn dev
```

### 2. Testing Checklist
- [ ] API proxy returns 200 OK
- [ ] No CORS errors in console
- [ ] Products display correctly
- [ ] Error handling works
- [ ] Loading states show properly

### 3. Documentation
- [ ] Update implementation guide
- [ ] Add API specs
- [ ] Document any issues resolved

---

## File Organization

```
docs/
├── README.md                          # This file
├── cors-solution-summary.md           # Quick CORS reference
├── cors-visual-guide.md               # Visual diagrams
├── server.log                         # Error logs (temporary)
└── kelompok-1/
    ├── implementasi.md                # Implementation guide
    ├── kelompok1.md                   # API documentation
    ├── cors-analysis-solution.md      # Detailed CORS analysis
    └── public-api.json                # Postman collection
```

---

## Resources

### Next.js Documentation
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [API Routes](https://nextjs.org/docs/app/api-reference/file-conventions/route)

### CORS Resources
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js with TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

---

## Contributing

### Adding New Kelompok Documentation

1. Create folder: `docs/kelompok-[N]/`
2. Add files:
   - `implementasi.md` - Implementation guide
   - `api-spec.md` - API documentation
   - `issues.md` - Problems & solutions (if any)
3. Update this index

### Documentation Standards

- Use Bahasa Indonesia untuk user-facing docs
- Include code examples dengan syntax highlighting
- Add visual diagrams untuk complex concepts
- Keep it concise but comprehensive

---

## Quick Links

- **Dev Server**: `http://localhost:3000`
- **Kelompok 1 Dashboard**: `http://localhost:3000/k1`
- **API Proxy**: `http://localhost:3000/api/kelompok-1/products`

---

**Last Updated**: 2025-09-30