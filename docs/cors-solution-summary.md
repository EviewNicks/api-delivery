# CORS Issue & Solution - Quick Reference

## Problem

**Error**:
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Penyebab**: Browser block client-side fetch ke external API karena security policy.

---

## Root Cause

```typescript
// Client component fetch langsung ke external API
'use client';

useEffect(() => {
  // ❌ Fetch dari BROWSER → CORS blocked
  fetch('https://rental-baju.netlify.app/api/products');
}, []);
```

**Flow**:
```
Browser (localhost:3000) → External API (rental-baju.netlify.app)
❌ Different origin → CORS check fails → Request blocked
```

---

## Solution: API Route Proxy

**Konsep**: Browser fetch ke internal API route, server yang forward ke external API.

### Implementation

**1. Create API Route** (`app/api/kelompok-1/products/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API = 'https://rental-baju.netlify.app/api/public/products';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Server fetch ke external API (no CORS)
  const response = await fetch(`${EXTERNAL_API}?${searchParams}`);
  const data = await response.json();

  return NextResponse.json(data);
}
```

**2. Update Client Code** (`lib/api-client.ts`):

```typescript
// BEFORE (CORS error)
const BASE_URL = 'https://rental-baju.netlify.app';

// AFTER (No CORS)
const BASE_URL = '/api/kelompok-1';
```

**Flow**:
```
Browser → Internal API (/api/kelompok-1) → External API
        ✅ Same origin        ✅ Server-to-server
        No CORS check         No CORS restriction
```

---

## Why This Works

| Request Type | CORS Check? | Why? |
|--------------|-------------|------|
| Browser → Same origin | ❌ No | Same domain + port |
| Browser → Different origin | ✅ Yes | Security policy |
| Server → Any API | ❌ No | No browser security |

---

## Testing

```bash
# Test API proxy
curl "http://localhost:3000/api/kelompok-1/products?page=1&limit=2"

# Expected: HTTP 200 with product data
```

---

## Benefits

- ✅ No CORS errors
- ✅ API URL hidden dari client
- ✅ Can add caching/auth/logging
- ✅ Server-side error handling

---

## Quick Fix Checklist

Jika masih ada CORS error:

1. ✅ Check BASE_URL di `lib/api-client.ts` → harus `/api/kelompok-1`
2. ✅ Check API route exists: `app/api/kelompok-1/products/route.ts`
3. ✅ Restart dev server: `yarn dev`
4. ✅ Clear browser cache

---

## Pattern untuk Kelompok Lain

**Struktur**:
```
app/api/kelompok-[N]/
  └── [endpoint]/
      └── route.ts
```

**Template**:
```typescript
const EXTERNAL_API = 'https://external-api-url.com';

export async function GET(request: NextRequest) {
  const response = await fetch(EXTERNAL_API);
  const data = await response.json();
  return NextResponse.json(data);
}
```

**Update client**:
```typescript
const BASE_URL = '/api/kelompok-[N]';
```

---

## Reference

- Detailed analysis: `docs/kelompok-1/cors-analysis-solution.md`
- Next.js Route Handlers: https://nextjs.org/docs/app/api-reference/file-conventions/route
- CORS explained: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS