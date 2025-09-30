# Library Functions Documentation

Dokumentasi untuk reusable functions dan utilities di folder `lib/`.

## API Client Functions

### File: `api-client.ts`

#### `getProducts(page, limit, search, status)`

Mengambil daftar produk dari API dengan pagination dan filtering.

**Parameters**:
- `page` (number, optional): Nomor halaman (default: 1)
- `limit` (number, optional): Jumlah item per halaman (default: 12)
- `search` (string, optional): Keyword pencarian untuk nama/deskripsi
- `status` (string, optional): Filter status produk (AVAILABLE/RENTED/MAINTENANCE)

**Returns**: `Promise<ProductListResponse>`
- `products`: Array of Product objects
- `pagination`: Object dengan page, limit, total, totalPages

**Throws**: `ApiError` jika request gagal atau timeout

**Example**:
```typescript
import { getProducts } from '@/lib/api-client';

// Get first page (12 items)
const data = await getProducts();

// Get page 2 with 20 items
const data = await getProducts(2, 20);

// Search products
const data = await getProducts(1, 12, 'dress');

// Filter by status
const data = await getProducts(1, 12, undefined, 'AVAILABLE');
```

---

#### `getProductDetail(id)`

Mengambil detail lengkap satu produk berdasarkan ID.

**Parameters**:
- `id` (string): UUID produk

**Returns**: `Promise<Product>`

**Throws**:
- `ApiError` dengan status 404 jika produk tidak ditemukan
- `ApiError` untuk errors lainnya

**Example**:
```typescript
import { getProductDetail } from '@/lib/api-client';

const product = await getProductDetail('67d31de1-f7a6-4e78-af34-6b2786017bb7');
console.log(product.name, product.currentPrice);
```

---

#### `ApiError` Class

Custom error class untuk API errors dengan status code.

**Properties**:
- `message` (string): Error message
- `statusCode` (number, optional): HTTP status code
- `name` (string): 'ApiError'

**Example**:
```typescript
try {
  const product = await getProductDetail('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Error:', error.message);
    console.log('Status:', error.statusCode);
  }
}
```

---

## Type Definitions

### File: `types.ts`

#### `Product`

Interface untuk product object.

**Properties**:
```typescript
{
  id: string;                    // UUID produk
  code: string;                  // Kode produk (e.g., "87Y9")
  name: string;                  // Nama produk
  description: string | null;    // Deskripsi produk
  category: {
    name: string;                // Nama kategori
    color: string;               // Hex color code
  };
  color: {
    name: string;                // Nama warna
    hexCode: string;             // Hex color code
  };
  currentPrice: number;          // Harga sewa saat ini
  modalAwal: number;             // Modal awal produk
  imageUrl: string;              // URL gambar produk
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  sizes: Array<{
    size: string;                // Ukuran (e.g., "M", "L")
    ageCategory: 'ADULT' | 'CHILD';
    quantity: number;            // Stock tersedia
  }>;
  isActive: boolean;             // Status aktif produk
}
```

---

#### `ProductListResponse`

Interface untuk response list products.

**Properties**:
```typescript
{
  products: Product[];           // Array of products
  pagination: {
    page: number;                // Current page
    limit: number;               // Items per page
    total: number;               // Total items
    totalPages: number;          // Total pages
  };
}
```

---

#### `ApiErrorResponse`

Interface untuk error response dari API.

**Properties**:
```typescript
{
  error: {
    message: string;             // Error message
    code: string;                // Error code (e.g., "NOT_FOUND")
  };
}
```

---

## Usage Examples

### Complete Flow Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getProducts, getProductDetail, ApiError } from '@/lib/api-client';
import type { Product } from '@/lib/types';

export default function MyComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts(1, 12, undefined, 'AVAILABLE');
      setProducts(data.products);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }

  async function viewDetail(id: string) {
    try {
      const product = await getProductDetail(id);
      console.log(product);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      }
    }
  }

  return <div>{/* Render products */}</div>;
}
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch dengan Error Type Check

```typescript
try {
  const data = await getProducts();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error
    console.log('API Error:', error.message);
    if (error.statusCode === 404) {
      // Handle not found
    }
  } else {
    // Handle unknown error
    console.log('Unknown error:', error);
  }
}
```

### Pattern 2: Async Function dengan State Management

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function fetchData() {
  try {
    setLoading(true);
    setError(null);
    const data = await getProducts();
    // Process data
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error occurred');
  } finally {
    setLoading(false);
  }
}
```

---

## Configuration

### API Base URL
Defined in `api-client.ts`:
```typescript
const BASE_URL = 'https://rental-baju.netlify.app';
```

### Timeout
Default timeout: 10 seconds
```typescript
const TIMEOUT = 10000; // milliseconds
```

Untuk mengubah, edit nilai di `api-client.ts`.

---

## Testing

### Manual Test via Node
```javascript
// test-api.js
const fetch = require('node-fetch');

async function test() {
  const response = await fetch('https://rental-baju.netlify.app/api/public/products?limit=2');
  const data = await response.json();
  console.log('Products:', data.products.length);
  console.log('Total:', data.pagination.total);
}

test();
```

### Test via curl
```bash
# Get products
curl "https://rental-baju.netlify.app/api/public/products?page=1&limit=2"

# Get detail
curl "https://rental-baju.netlify.app/api/public/products/67d31de1-f7a6-4e78-af34-6b2786017bb7"
```

---

## Performance Notes

- **Timeout**: Request otomatis dibatalkan setelah 10 detik
- **Error Recovery**: Semua errors di-wrap dalam ApiError untuk consistency
- **Type Safety**: Full TypeScript support dengan strict typing
- **Abort Controller**: Digunakan untuk proper timeout handling dan cleanup