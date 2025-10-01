# Krusit API Reference

Quick reference guide untuk Kelompok 4 API integration.

---

## Base Configuration

```typescript
const API_BASE_URL = 'https://projekkelompok4-production.up.railway.app';
const TIMEOUT = 10000; // 10 seconds
```

---

## Endpoints

### 1. GET /api/makanan

Retrieve semua menu makanan.

**Request**:
```http
GET https://projekkelompok4-production.up.railway.app/api/makanan
Accept: application/json
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Gohyong",
      "description": null,
      "category": "makanan",
      "price": "10000.00",
      "image": "menus/1Yjl62Uy3tHl3SjGurvgjlWTM6bno1rxTKlHXagL.png",
      "created_at": "2025-09-16T04:30:07.000000Z",
      "updated_at": "2025-09-16T19:01:14.000000Z"
    }
  ]
}
```

**Proxy Route**: `/api/kelompok-4/makanan`

**Client Function**:
```typescript
import { fetchKrusitMakanan } from '@/lib/api-client';

const makanan = await fetchKrusitMakanan();
// Returns: KrusitMenuItemEnriched[]
```

---

### 2. GET /api/minuman

Retrieve semua menu minuman.

**Request**:
```http
GET https://projekkelompok4-production.up.railway.app/api/minuman
Accept: application/json
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": 6,
      "name": "Thai Tea",
      "description": null,
      "category": "minuman",
      "price": "10000.00",
      "image": "menus/kp2NjO0m5h5by2UmVQX5CnY97WxsGgRmSrSrePGM.jpg",
      "created_at": "2025-09-16T08:42:15.000000Z",
      "updated_at": "2025-09-16T19:04:36.000000Z"
    }
  ]
}
```

**Proxy Route**: `/api/kelompok-4/minuman`

**Client Function**:
```typescript
import { fetchKrusitMinuman } from '@/lib/api-client';

const minuman = await fetchKrusitMinuman();
// Returns: KrusitMenuItemEnriched[]
```

---

### 3. POST /api/login

User authentication (documented, not implemented in dashboard).

**Request**:
```http
POST https://projekkelompok4-production.up.railway.app/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

---

## Data Types

### KrusitMenuItem (Raw API Response)

```typescript
interface KrusitMenuItem {
  id: number;
  name: string;
  description: string | null;
  category: 'makanan' | 'minuman';
  price: string; // decimal string: "10000.00"
  image: string; // path atau null
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### KrusitMenuItemEnriched (Client-Side Enriched)

```typescript
interface KrusitMenuItemEnriched extends KrusitMenuItem {
  price_number: number; // 10000
  price_formatted: string; // "Rp 10.000"
  image_url: string; // full URL atau fallback
  is_valid_image: boolean; // validation flag
}
```

---

## Usage Examples

### Example 1: Basic Fetch

```typescript
'use client';

import { useState, useEffect } from 'react';
import { fetchKrusitMakanan } from '@/lib/api-client';
import type { KrusitMenuItemEnriched } from '@/lib/types';

export default function MenuPage() {
  const [items, setItems] = useState<KrusitMenuItemEnriched[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchKrusitMakanan();
        setItems(data);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price_formatted}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Parallel Fetching

```typescript
const [makanan, setMakanan] = useState<KrusitMenuItemEnriched[]>([]);
const [minuman, setMinuman] = useState<KrusitMenuItemEnriched[]>([]);

useEffect(() => {
  async function loadMakanan() {
    const data = await fetchKrusitMakanan();
    setMakanan(data);
  }

  async function loadMinuman() {
    const data = await fetchKrusitMinuman();
    setMinuman(data);
  }

  // Fetch both simultaneously
  loadMakanan();
  loadMinuman();
}, []);
```

### Example 3: Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchKrusitMakanan();
  setItems(data);
} catch (err) {
  if (err instanceof ApiError) {
    setError(`Error ${err.statusCode}: ${err.message}`);
  } else {
    setError('Unknown error occurred');
  }
}

// Display error
{error && (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <p className="text-red-700">{error}</p>
    <button onClick={() => window.location.reload()}>
      Retry
    </button>
  </div>
)}
```

### Example 4: Image Handling

```typescript
<img
  src={item.image_url}
  alt={item.name}
  className="w-full h-48 object-cover"
  onError={(e) => {
    // Fallback ke placeholder jika image gagal load
    e.currentTarget.src = '/images/kelompok-4/placeholder-menu.jpg';
  }}
/>

{/* Show badge jika image invalid */}
{!item.is_valid_image && (
  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
    No Image
  </span>
)}
```

---

## Error Codes

| Status | Meaning | Solution |
|--------|---------|----------|
| 200 | Success | Data received successfully |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | API server issue, retry later |
| 504 | Timeout | Request took >10s, check network |

### ApiError Class

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
catch (error) {
  if (error instanceof ApiError) {
    console.log(`HTTP ${error.statusCode}: ${error.message}`);
  }
}
```

---

## Data Transformations

### Price Transformation

```typescript
// Input dari API
price: "10000.00" (string)

// Setelah enrichment
price_number: 10000 (number)
price_formatted: "Rp 10.000" (string)

// Function
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

### Image URL Resolution

```typescript
// Valid relative path
Input:  "menus/abc123.jpg"
Output: "https://projekkelompok4-production.up.railway.app/storage/menus/abc123.jpg"

// Invalid absolute path
Input:  "C:\\xampp\\tmp\\php8274.tmp"
Output: "/images/kelompok-4/placeholder-menu.jpg"

// Null image
Input:  null
Output: "/images/kelompok-4/placeholder-menu.jpg"

// Already full URL
Input:  "https://example.com/image.jpg"
Output: "https://example.com/image.jpg"
```

### Category Correction

```typescript
// Fix mismatched categories
Input:  { name: "Green Tea", category: "makanan" }
Output: { name: "Green Tea", category: "minuman" }

Input:  { name: "Kopi Hitam", category: "makanan" }
Output: { name: "Kopi Hitam", category: "minuman" }

// Function
function fixKrusitCategory(item: KrusitMenuItem): 'makanan' | 'minuman' {
  const nameLower = item.name.toLowerCase();

  if (nameLower.includes('tea') ||
      nameLower.includes('kopi') ||
      nameLower.includes('jus')) {
    return 'minuman';
  }

  return item.category;
}
```

---

## Testing

### Test API Proxy Routes

```bash
# Development server
npm run dev

# Test makanan endpoint
curl http://localhost:3000/api/kelompok-4/makanan

# Test minuman endpoint
curl http://localhost:3000/api/kelompok-4/minuman

# Expected response
{
  "status": "success",
  "data": [...]
}
```

### Test Dashboard Page

```bash
# Navigate to dashboard
http://localhost:3000/k4

# Check console for errors
# Verify data loads
# Test image fallbacks
# Check responsive layout
```

---

## Performance

### Response Times

| Endpoint | Average | Timeout |
|----------|---------|---------|
| `/api/makanan` | ~500ms | 10s |
| `/api/minuman` | ~500ms | 10s |

### Optimization Tips

1. **Parallel Fetching**: Load makanan dan minuman simultaneously
2. **Client Caching**: Use React state untuk cache results
3. **Image Optimization**: Lazy loading via browser default
4. **Error Recovery**: Implement retry mechanism untuk failed requests

---

## Troubleshooting

### Issue: Timeout Errors

**Symptom**: Request timeout after 10 seconds

**Solution**:
- Check network connection
- Verify API server is running (Railway status)
- Increase timeout if needed (currently 10s)

### Issue: CORS Errors

**Symptom**: Cross-origin request blocked

**Solution**:
- Always use proxy routes (`/api/kelompok-4/*`)
- Never fetch external API directly from client

### Issue: Invalid Images

**Symptom**: Broken image icons or missing images

**Solution**:
- Implemented automatic fallback to placeholder
- Yellow "No Image" badge shows when image invalid
- Check `is_valid_image` flag in data

### Issue: Category Mismatches

**Symptom**: Beverages appearing in food section

**Solution**:
- Automatic category correction via `fixKrusitCategory()`
- Detects tea, coffee, juice keywords
- Filters results by corrected category

---

## Related Files

- **Type Definitions**: `lib/types.ts` (lines 64-106)
- **API Client**: `lib/api-client.ts` (lines 146-246)
- **Proxy Routes**: `app/api/kelompok-4/makanan/route.ts`
- **Dashboard Page**: `app/k4/page.tsx`
- **Implementation Guide**: `docs/kelompok-4/IMPLEMENTATION.md`
