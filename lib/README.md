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

---

## Kelompok 3: GadgetHouse API

### `fetchGadgetRecommendations()`

Mengambil rekomendasi produk gadget dari API Kelompok 3 dengan data enrichment.

**Parameters**: None

**Returns**: `Promise<GadgetProductEnriched[]>`

**Features**:
- Data enrichment otomatis (price formatting, category extraction)
- Image URL resolution dengan placeholder fallback
- Error handling dengan informative messages
- 10-second timeout protection

**Response Structure**:
```typescript
interface GadgetProductEnriched {
  product_id: string;          // Product ID (string dari API)
  product_title: string;       // Nama lengkap produk
  product_price: string;       // Harga original (string)
  product_img1: string;        // Image path original
  // Enriched fields:
  price_number: number;        // Parsed price (e.g., 95992000)
  price_formatted: string;     // Formatted currency (e.g., "Rp 95.992.000")
  image_url: string;           // Resolved image URL or placeholder
  category_guess?: string;     // Extracted category (e.g., "Laptop", "Tablet")
}
```

**Example**:
```typescript
import { fetchGadgetRecommendations } from '@/lib/api-client';
import type { GadgetProductEnriched } from '@/lib/types';

// Component usage
const [products, setProducts] = useState<GadgetProductEnriched[]>([]);

useEffect(() => {
  async function loadProducts() {
    try {
      const data = await fetchGadgetRecommendations();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load gadget recommendations:', error);
    }
  }
  loadProducts();
}, []);

// Display example
{products.map(product => (
  <div key={product.product_id}>
    <h3>{product.product_title}</h3>
    <p>{product.price_formatted}</p>
    <img src={product.image_url} alt={product.product_title} />
    {product.category_guess && <span>{product.category_guess}</span>}
  </div>
))}
```

**Error Handling**:
```typescript
try {
  const products = await fetchGadgetRecommendations();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    // Handle specific errors
  }
}
```

**Data Enrichment Details**:

1. **Price Formatting**:
   - Original: `"95992000"` (string)
   - Parsed: `95992000` (number)
   - Formatted: `"Rp 95.992.000"` (Indonesian currency format)

2. **Category Extraction**:
   Extracted dari product title dengan keywords:
   - "laptop" → "Laptop"
   - "tablet" → "Tablet"
   - "printer" → "Printer"
   - "monitor" → "Monitor"
   - "powerbank" → "Powerbank"
   - "samsung", "iphone", "galaxy" → "Smartphone"
   - Default: "Gadget"

3. **Image Resolution**:
   - Checks if image path is absolute URL (`http://...`)
   - If not, fallback ke placeholder: `/images/kelompok-3/placeholder-gadget.jpg`
   - Additional `onError` handler available di component level

**Performance**:
- Timeout: 10 seconds (AbortController)
- Response validation sebelum parsing
- Client-side enrichment (no extra API calls)

**Known Limitations**:
- API returns only 4 fields (vs 14 documented in database schema)
- Image paths are relative (not accessible, use placeholders)
- Data types: API returns strings, not integers as documented

**Related Files**:
- Types: `lib/types.ts` (lines 43-62)
- API Route: `app/api/kelompok-3/recomendations/route.ts`
- Dashboard: `app/k3/page.tsx`
- Documentation: `docs/kelompok-3/kelompok3.md`

---

## Kelompok 4: Krusit F&B API

### `fetchKrusitMakanan()`

Mengambil daftar menu makanan dari API Krusit dengan data enrichment dan category filtering.

**Parameters**: None

**Returns**: `Promise<KrusitMenuItemEnriched[]>`

**Features**:
- Automatic price parsing dan currency formatting
- Smart image URL resolution dengan fallback handling
- Category correction untuk mismatched data
- Invalid image path detection
- 10-second timeout protection

**Response Structure**:
```typescript
interface KrusitMenuItemEnriched {
  id: number;                  // Menu ID
  name: string;                // Nama menu (e.g., "Gohyong", "Bakso")
  description: string | null;  // Deskripsi menu
  category: 'makanan' | 'minuman'; // Corrected category
  price: string;               // Original price (e.g., "10000.00")
  image: string;               // Original image path
  created_at: string;          // ISO timestamp
  updated_at: string;          // ISO timestamp
  // Enriched fields:
  price_number: number;        // Parsed price (e.g., 10000)
  price_formatted: string;     // Formatted currency (e.g., "Rp 10.000")
  image_url: string;           // Full URL atau placeholder
  is_valid_image: boolean;     // Image validity flag
}
```

**Example**:
```typescript
import { fetchKrusitMakanan } from '@/lib/api-client';
import type { KrusitMenuItemEnriched } from '@/lib/types';

// Component usage
const [makanan, setMakanan] = useState<KrusitMenuItemEnriched[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadMakanan() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKrusitMakanan();
      setMakanan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  loadMakanan();
}, []);

// Display with image fallback
{makanan.map(item => (
  <div key={item.id}>
    <img
      src={item.image_url}
      alt={item.name}
      onError={(e) => {
        e.currentTarget.src = '/images/kelompok-4/placeholder-menu.jpg';
      }}
    />
    {!item.is_valid_image && <span>No Image</span>}
    <h3>{item.name}</h3>
    <p>{item.price_formatted}</p>
  </div>
))}
```

---

### `fetchKrusitMinuman()`

Mengambil daftar menu minuman dari API Krusit dengan data enrichment dan category filtering.

**Parameters**: None

**Returns**: `Promise<KrusitMenuItemEnriched[]>`

**Features**: Same as `fetchKrusitMakanan()` but filtered for beverages

**Example**:
```typescript
import { fetchKrusitMinuman } from '@/lib/api-client';

const [minuman, setMinuman] = useState<KrusitMenuItemEnriched[]>([]);

useEffect(() => {
  async function loadMinuman() {
    try {
      const data = await fetchKrusitMinuman();
      setMinuman(data);
    } catch (error) {
      console.error('Failed to load minuman:', error);
    }
  }
  loadMinuman();
}, []);
```

---

### Parallel Fetching Pattern

Best practice untuk fetch makanan dan minuman secara bersamaan:

```typescript
const [makanan, setMakanan] = useState<KrusitMenuItemEnriched[]>([]);
const [minuman, setMinuman] = useState<KrusitMenuItemEnriched[]>([]);
const [loadingMakanan, setLoadingMakanan] = useState(true);
const [loadingMinuman, setLoadingMinuman] = useState(true);

useEffect(() => {
  // Fetch both categories simultaneously
  async function loadMakanan() {
    try {
      setLoadingMakanan(true);
      const data = await fetchKrusitMakanan();
      setMakanan(data);
    } finally {
      setLoadingMakanan(false);
    }
  }

  async function loadMinuman() {
    try {
      setLoadingMinuman(true);
      const data = await fetchKrusitMinuman();
      setMinuman(data);
    } finally {
      setLoadingMinuman(false);
    }
  }

  // Start both requests in parallel
  loadMakanan();
  loadMinuman();
}, []);
```

---

### Data Enrichment Details

**1. Price Transformation**:
```typescript
// Original API response
price: "10000.00" (string)

// After enrichment
price_number: 10000 (number)
price_formatted: "Rp 10.000" (Indonesian currency)

// Function
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

**2. Image URL Resolution**:
```typescript
// Valid relative path
Input:  "menus/abc123.jpg"
Output: "https://projekkelompok4-production.up.railway.app/storage/menus/abc123.jpg"

// Invalid absolute path (Windows temp file)
Input:  "C:\\xampp\\tmp\\php8274.tmp"
Output: "/images/kelompok-4/placeholder-menu.jpg"
is_valid_image: false

// Null image
Input:  null
Output: "/images/kelompok-4/placeholder-menu.jpg"
is_valid_image: false

// Full URL (already valid)
Input:  "https://example.com/image.jpg"
Output: "https://example.com/image.jpg"
is_valid_image: true
```

**3. Category Correction**:
```typescript
// Fix mismatched categories in database
Input:  { name: "Green Tea", category: "makanan" }
Output: { name: "Green Tea", category: "minuman" }

Input:  { name: "Thai Tea", category: "makanan" }
Output: { name: "Thai Tea", category: "minuman" }

// Detection keywords: tea, kopi, jus
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

**4. Image Path Validation**:
```typescript
function isValidImagePath(imagePath: string): boolean {
  // Reject absolute Windows paths
  if (imagePath.includes('C:\\') || imagePath.includes('tmp')) {
    return false;
  }

  // Accept HTTP/HTTPS URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return true;
  }

  // Accept relative paths (menus/, images/)
  if (imagePath.startsWith('menus/') || imagePath.startsWith('images/')) {
    return true;
  }

  return false;
}
```

---

### Error Handling

**Error Types**:
```typescript
try {
  const data = await fetchKrusitMakanan();
} catch (error) {
  if (error instanceof ApiError) {
    // API-specific error dengan status code
    console.log('API Error:', error.message);
    console.log('Status Code:', error.statusCode);
  } else {
    // Unknown error
    console.log('Unknown error:', error);
  }
}
```

**Common Errors**:
- `Request timeout - API tidak merespons dalam 10 detik` (504)
- `Network error - Gagal menghubungi API Krusit` (500)
- `HTTP 404: Not Found` - Endpoint tidak ditemukan
- `API returned error status` - API response `status: "error"`

---

### Performance & Optimization

**Timeout Configuration**:
```typescript
const TIMEOUT = 10000; // 10 seconds
```

**Best Practices**:
1. **Parallel Fetching**: Fetch makanan dan minuman simultaneously untuk better performance
2. **Independent States**: Separate loading/error states per category
3. **Client-Side Caching**: React state prevents unnecessary refetches
4. **Image Lazy Loading**: Browser default lazy loading untuk images
5. **Fallback Strategy**: Placeholder images untuk invalid paths

**Performance Metrics**:
- Average response time: ~500ms
- Timeout threshold: 10 seconds
- Typical dataset size: 10-20 items per category

---

### Known Issues & Solutions

**Issue 1: Category Mismatches**

Problem: Database contains beverages categorized as "makanan"

Solution: Automatic category correction via `fixKrusitCategory()`
- Detects: tea, kopi, jus keywords
- Corrects category before filtering

**Issue 2: Invalid Image Paths**

Problem: API returns Windows absolute paths (`C:\\xampp\\tmp\\...`)

Solution:
- Image validation via `isValidImagePath()`
- Fallback to placeholder image
- `is_valid_image` flag untuk UI indication

**Issue 3: Null Images**

Problem: Some items have `image: null`

Solution: Type definition allows `string | null`, enrichment handles null case

---

### Related Files

**Implementation**:
- Types: `lib/types.ts` (lines 64-106)
- API Client: `lib/api-client.ts` (lines 146-246)
- API Routes: `app/api/kelompok-4/makanan/route.ts`, `app/api/kelompok-4/minuman/route.ts`
- Dashboard: `app/k4/page.tsx`

**Documentation**:
- Implementation Guide: `docs/kelompok-4/IMPLEMENTATION.md`
- API Reference: `docs/kelompok-4/API-REFERENCE.md`
- Original Docs: `docs/kelompok-4/kelompok4.md`
- Postman Collection: `docs/kelompok-4/Projek_Kelompok 4.postman_collection.json`
- API Test Results: `docs/kelompok-4/hasil4.log`

---

## Kelompok 10: Cafeku API

### `fetchCafekuMenu()`

Mengambil daftar semua produk menu kafe dengan data enrichment.

**Parameters**: None

**Returns**: `Promise<CafekuProductEnriched[]>`

**Features**:
- Price formatting otomatis ke Rupiah
- Image URL construction untuk storage server
- Stock status detection (in_stock, low_stock, out_of_stock)
- Availability flag based on stock
- 10-second timeout protection

**Response Structure**:
```typescript
interface CafekuProductEnriched {
  id: number;                  // Product ID
  image: string;               // Filename only (e.g., "espresso.jpg")
  title: string;               // Product name
  description: string;         // Product description
  price: number;               // Price in Rupiah
  stock: number;               // Stock quantity
  created_at: string;          // ISO timestamp
  updated_at: string;          // ISO timestamp
  // Enriched fields:
  price_formatted: string;     // Formatted currency (e.g., "Rp 35.000")
  image_url: string;           // Full URL to image
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_available: boolean;       // true if stock > 0
}
```

**Example**:
```typescript
import { fetchCafekuMenu } from '@/lib/api-client';
import type { CafekuProductEnriched } from '@/lib/types';

const [products, setProducts] = useState<CafekuProductEnriched[]>([]);

useEffect(() => {
  async function loadMenu() {
    try {
      const data = await fetchCafekuMenu();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  }
  loadMenu();
}, []);
```

---

### `fetchCafekuProduct(id)`

Mengambil detail produk spesifik berdasarkan ID.

**Parameters**:
- `id` (number): Product ID

**Returns**: `Promise<CafekuProductEnriched>`

**Throws**:
- `ApiError` dengan status 404 jika produk tidak ditemukan
- `ApiError` untuk errors lainnya

**Example**:
```typescript
import { fetchCafekuProduct } from '@/lib/api-client';

const product = await fetchCafekuProduct(1);
console.log(product.title, product.price_formatted);
```

---

### `createCafekuProduct(data)`

Membuat produk menu baru dengan upload gambar.

**Parameters**:
- `data` (FormData): Form data dengan fields:
  - `title` (string, min 5 chars)
  - `description` (string, min 10 chars)
  - `price` (number/string)
  - `stock` (number/string)
  - `image` (File, jpg/png, max 2MB)

**Returns**: `Promise<CafekuProduct>`

**Example**:
```typescript
import { createCafekuProduct } from '@/lib/api-client';

const formData = new FormData();
formData.append('title', 'Cappuccino');
formData.append('description', 'Espresso with steamed milk foam');
formData.append('price', '35000');
formData.append('stock', '100');
formData.append('image', imageFile);

const newProduct = await createCafekuProduct(formData);
```

---

### `updateCafekuProduct(id, data)`

Update data produk yang sudah ada (tanpa mengubah gambar).

**Parameters**:
- `id` (number): Product ID
- `data` (object):
  - `title` (string, min 5 chars)
  - `description` (string, min 10 chars)
  - `price` (number)
  - `stock` (number)

**Returns**: `Promise<CafekuProduct>`

**Example**:
```typescript
import { updateCafekuProduct } from '@/lib/api-client';

const updated = await updateCafekuProduct(1, {
  title: 'Cappuccino Updated',
  description: 'New description',
  price: 38000,
  stock: 85
});
```

---

### `deleteCafekuProduct(id)`

Menghapus produk dari database.

**Parameters**:
- `id` (number): Product ID

**Returns**: `Promise<{ success: boolean; message: string }>`

**Example**:
```typescript
import { deleteCafekuProduct } from '@/lib/api-client';

const result = await deleteCafekuProduct(1);
console.log(result.message); // "Data Berhasil Dihapus!"
```

---

### Data Enrichment Details

**1. Price Formatting**:
```typescript
// Original API response
price: 35000 (number)

// After enrichment
price_formatted: "Rp 35.000" (Indonesian currency)

// Function
function formatCafekuPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}
```

**2. Image URL Construction**:
```typescript
// Original API response
image: "espresso.jpg" (filename only)

// After enrichment
image_url: "https://dodgerblue-monkey-417412.hostingersite.com/storage/products/espresso.jpg"

// Function
function resolveCafekuImageUrl(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image; // Already full URL
  }
  return `https://dodgerblue-monkey-417412.hostingersite.com/storage/products/${image}`;
}
```

**3. Stock Status Detection**:
```typescript
// Stock status logic
function getCafekuStockStatus(stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stock === 0) return 'out_of_stock';
  if (stock < 10) return 'low_stock';
  return 'in_stock';
}

// Examples
Stock 0   → "out_of_stock"
Stock 5   → "low_stock"
Stock 100 → "in_stock"
```

**4. Availability Flag**:
```typescript
is_available: stock > 0
```

---

### Error Handling

**Error Types**:
```typescript
try {
  const products = await fetchCafekuMenu();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    console.log('Status Code:', error.statusCode);
  }
}
```

**Common Errors**:
- `404 Not Found`: Produk tidak ditemukan
- `422 Unprocessable Entity`: Validation error (title < 5 chars, missing image, etc.)
- `500 Internal Server Error`: Server error

**Validation Error Example**:
```json
{
  "message": "The image field is required.",
  "errors": {
    "image": ["The image field is required."],
    "title": ["The title field must be at least 5 characters."]
  }
}
```

---

### Critical Requirements

**Accept Header Mandatory**:

Semua request ke external API HARUS include header `Accept: application/json`. Tanpa header ini, Laravel API akan return HTML response alih-alih JSON.

```typescript
headers: {
  'Accept': 'application/json'
}
```

Sudah di-handle otomatis di API proxy routes (`app/api/kelompok-10/`).

---

### Related Files

**Implementation**:
- Types: `lib/types.ts` (lines 170-199)
- API Client: `lib/api-client.ts` (lines 638-811)
- API Routes: `app/api/kelompok-10/menu/route.ts`, `app/api/kelompok-10/products/route.ts`, `app/api/kelompok-10/products/[id]/route.ts`
- Components: `features/kelompok10/components/`
- Dashboard: `app/k10/page.tsx`

**Documentation**:
- Feature Documentation: `features/kelompok10/README.md`
- API Documentation: `docs/kelompok-10/cafeku-api-documentation.md`
- Postman Collection: `docs/kelompok-10/cafeku-public-api.json`