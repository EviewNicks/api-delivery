# Kelompok 3 - API Rekomendasi Produk GadgetHouse

## Informasi Umum

**Website**: GadgetHouse
**API Base URL**: `http://www.cvjayatehnik.com/api/`
**Authentication**: Bearer Token
**Token**: `Tokengadgethouse`

---

## Database Schema

### Tabel: `product` (Rekomendasi Produk)

Tabel ini berisi data produk yang direkomendasikan untuk website GadgetHouse.

| No | Field Name | Type | Length | Collation | Null | Default | Extra |
|----|------------|------|--------|-----------|------|---------|-------|
| 1 | `product_id` | INT | 10 | - | Tidak | - | AUTO_INCREMENT |
| 2 | `p_cat_id` | INT | 10 | - | Tidak | - | - |
| 3 | `cat_id` | INT | 10 | - | Tidak | - | - |
| 4 | `date` | TIMESTAMP | - | - | Tidak | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |
| 5 | `product_title` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |
| 6 | `type1` | VARCHAR | 50 | utf8mb4_general_ci | Tidak | - | - |
| 7 | `type2` | VARCHAR | 50 | utf8mb4_general_ci | Tidak | - | - |
| 8 | `type3` | VARCHAR | 50 | utf8mb4_general_ci | Tidak | - | - |
| 9 | `product_img1` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |
| 10 | `product_img2` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |
| 11 | `product_img3` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |
| 12 | `product_price` | INT | 10 | - | Tidak | - | - |
| 13 | `product_desc` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |
| 14 | `product_keyword` | TEXT | - | utf8mb4_general_ci | Tidak | - | - |

### Penjelasan Field

- **product_id**: ID unik produk (Primary Key)
- **p_cat_id**: ID kategori produk (Foreign Key)
- **cat_id**: ID kategori utama (Foreign Key)
- **date**: Timestamp pembuatan/update produk
- **product_title**: Nama/judul produk
- **type1, type2, type3**: Tipe/varian produk
- **product_img1, product_img2, product_img3**: URL gambar produk (maksimal 3 gambar)
- **product_price**: Harga produk dalam satuan rupiah
- **product_desc**: Deskripsi lengkap produk
- **product_keyword**: Keywords untuk SEO dan pencarian

---

## API Endpoints

### GET `/api/recomendations.php`

Endpoint untuk mengambil data rekomendasi produk.

**Headers**:
```
Authorization: Bearer Tokengadgethouse
```

**Response Format** (Expected):
```json
{
  "status": "success",
  "data": [
    {
      "product_id": 1,
      "p_cat_id": 2,
      "cat_id": 1,
      "date": "2024-01-15 10:30:00",
      "product_title": "iPhone 15 Pro Max",
      "type1": "Smartphone",
      "type2": "Premium",
      "type3": "iOS",
      "product_img1": "https://example.com/img1.jpg",
      "product_img2": "https://example.com/img2.jpg",
      "product_img3": "https://example.com/img3.jpg",
      "product_price": 20000000,
      "product_desc": "Smartphone flagship terbaru dari Apple",
      "product_keyword": "iphone, apple, smartphone, premium"
    }
  ]
}
```

---

## Testing dengan Postman

### Setup Authorization

1. Buka Postman
2. Create new request: **GET** `http://www.cvjayatehnik.com/api/recomendations.php`
3. Tab **Authorization**:
   - Type: **Bearer Token**
   - Token: `Tokengadgethouse`
4. Send request

### Screenshot Testing

Berikut adalah tangkapan layar Postman pada tab Authorization untuk permintaan GET ke `http://www.cvjayatehnik.com/api/recomendations.php` dengan authorization type Bearer Token dengan token: `Tokengadgethouse`

*(Catatan: Screenshot dapat ditambahkan di sini)*

---

## Implementasi di Project

### 1. API Proxy Route

Create file: `app/api/kelompok-3/recomendations/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      'http://www.cvjayatehnik.com/api/recomendations.php',
      {
        headers: {
          'Authorization': 'Bearer Tokengadgethouse',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
```

### 2. TypeScript Types

Tambahkan di `lib/types.ts`:

```typescript
export interface GadgetProduct {
  product_id: number;
  p_cat_id: number;
  cat_id: number;
  date: string;
  product_title: string;
  type1: string;
  type2: string;
  type3: string;
  product_img1: string;
  product_img2: string;
  product_img3: string;
  product_price: number;
  product_desc: string;
  product_keyword: string;
}

export interface RecommendationsResponse {
  status: string;
  data: GadgetProduct[];
}
```

### 3. API Client Function

Tambahkan di `lib/api-client.ts`:

```typescript
export async function fetchGadgetRecommendations(): Promise<RecommendationsResponse> {
  const response = await fetch('/api/kelompok-3/recomendations');
  if (!response.ok) {
    throw new Error('Failed to fetch gadget recommendations');
  }
  return response.json();
}
```

### 4. Dashboard Page

Create file: `app/k3/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { fetchGadgetRecommendations } from '@/lib/api-client';
import type { GadgetProduct } from '@/lib/types';

export default function Kelompok3Page() {
  const [products, setProducts] = useState<GadgetProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGadgetRecommendations()
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Kelompok 3: Rekomendasi Produk GadgetHouse
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.product_id}
            className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6"
          >
            <img
              src={product.product_img1}
              alt={product.product_title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              {product.product_title}
            </h3>
            <p className="text-primary-600 font-bold text-lg mb-2">
              Rp {product.product_price.toLocaleString('id-ID')}
            </p>
            <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
              {product.product_desc}
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                {product.type1}
              </span>
              <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                {product.type2}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Checklist Implementasi

- [ ] Create API proxy route (`app/api/kelompok-3/recomendations/route.ts`)
- [ ] Define TypeScript types (`lib/types.ts`)
- [ ] Create API client function (`lib/api-client.ts`)
- [ ] Build dashboard page (`app/k3/page.tsx`)
- [ ] Test API connection dengan Postman
- [ ] Verify CORS solution bekerja
- [ ] Update sidebar navigation
- [ ] Add to main homepage

---

## Notes

- API menggunakan Bearer Token authentication
- Database menggunakan utf8mb4_general_ci collation
- Maximum 3 gambar per produk
- Harga dalam format integer (tanpa desimal)
- Response format perlu diverifikasi dengan actual API call

---

## Implementation Status

### ✅ Actual API Response vs Documentation

**⚠️ PENTING**: Response API aktual berbeda dengan dokumentasi database schema!

**Documented Structure (14 fields)**:
Database schema menunjukkan 14 fields lengkap termasuk `p_cat_id`, `cat_id`, `date`, `type1`, `type2`, `type3`, `product_img2`, `product_img3`, `product_desc`, `product_keyword`

**Actual API Response (4 fields only)**:
```json
{
  "status": "success",
  "data": [
    {
      "product_id": "65",
      "product_title": "Laptop ADVAN AI Gen ULTRA...",
      "product_price": "95992000",
      "product_img1": "AD 1.webp"
    }
  ]
}
```

**Key Differences**:
- `product_id`: String (not integer)
- `product_price`: String (not integer)
- `product_img1`: Relative path (not absolute URL)
- Missing: 10 fields lainnya tidak dikembalikan oleh API

---

## Implementation Details

### Files Created/Modified

1. **`lib/types.ts`** (lines 43-62)
   - Added `GadgetProductSimplified` - matches actual API response (4 fields)
   - Added `GadgetRecommendationsResponse` - response wrapper
   - Added `GadgetProductEnriched` - extended version dengan computed fields

2. **`app/api/kelompok-3/recomendations/route.ts`** (new file)
   - Next.js API Route proxy untuk handle CORS
   - 10-second timeout dengan AbortController
   - Response validation dan structured error handling
   - Timeout detection dengan specific error message

3. **`lib/api-client.ts`** (lines 79-136)
   - Added `fetchGadgetRecommendations()` function
   - Helper functions:
     - `formatRupiah()`: Currency formatting dengan Intl.NumberFormat
     - `resolveImageUrl()`: Image path resolution dengan placeholder fallback
     - `extractCategory()`: Category extraction dari product title
   - Data enrichment: price parsing, category guessing, image handling

4. **`app/k3/page.tsx`** (new file, 140 lines)
   - Client-side React component dengan hooks
   - Three states: Loading (skeleton), Error (retry button), Success (grid)
   - Responsive grid: 1 column (mobile) → 2 (tablet) → 3 (desktop)
   - Image error handling dengan onError fallback
   - Category badges overlay pada product images

5. **`public/images/kelompok-3/placeholder-gadget.jpg`** (new file)
   - Placeholder image untuk products (400x300px)
   - Blue theme matching design system
   - Fallback untuk relative/broken image paths

6. **`components/sidebar.tsx`** (line 21)
   - Updated Kelompok 3 status: `pending` → `implemented`
   - Added descriptive title: "Kelompok 3 - GadgetHouse"

---

## Implementation Decisions

### 1. Image Handling Strategy
**Problem**: API returns relative paths (`AD 1.webp`) tanpa base URL, kemungkinan tidak accessible

**Solution**: Placeholder strategy
- Check if image path starts with `http` (absolute URL)
- If not, fallback ke `/images/kelompok-3/placeholder-gadget.jpg`
- Additional fallback dengan `onError` handler di `<img>` tag

**Reasoning**: Consistent UI lebih baik daripada broken images

### 2. Data Type Handling
**Problem**: API returns strings untuk `product_id` dan `product_price`, tapi dokumentasi menyebutkan integer

**Solution**: Type interfaces match actual response
- Define `product_id: string` dan `product_price: string` (actual)
- Parse to number saat enrichment: `price_number: number`
- Keep original string untuk compatibility

**Reasoning**: Type safety harus reflect actual API behavior, bukan dokumentasi

### 3. Client-Side Data Enrichment
**Problem**: API response minimal (4 fields), UI needs more context

**Solution**: Enrich data di client dengan computed fields:
- `price_formatted`: "Rp 95.992.000" (user-friendly)
- `price_number`: 95992000 (for sorting/filtering)
- `category_guess`: "Laptop", "Tablet", "Smartphone" (extracted dari title)
- `image_url`: Resolved absolute URL atau placeholder

**Reasoning**: Better UX without depending on API changes

### 4. Error Handling Philosophy
**Problem**: External API bisa down, slow, atau error

**Solution**: Graceful degradation dengan informative messages
- 10-second timeout untuk prevent hanging
- Structured error responses dengan retry button
- Loading state dengan skeleton UI untuk perceived performance
- Fallback placeholder images untuk broken images

**Reasoning**: Professional UX yang tidak crash saat API issues

---

## Checklist Implementasi

- [x] Create API proxy route (`app/api/kelompok-3/recomendations/route.ts`)
- [x] Define TypeScript types (`lib/types.ts`)
- [x] Create API client function (`lib/api-client.ts`)
- [x] Build dashboard page (`app/k3/page.tsx`)
- [x] Setup placeholder images (`public/images/kelompok-3/`)
- [x] Implement data enrichment (price formatting, category extraction)
- [x] Add loading and error states
- [x] Update sidebar navigation
- [x] Fix linting warnings (unused imports)
- [x] Build successful validation
- [ ] Test API connection live (pending manual testing)
- [ ] Add to main homepage (optional)

---

## Testing Guide

### Local Testing

1. **Start Dev Server**:
   ```bash
   yarn dev
   ```

2. **Access Dashboard**:
   ```
   http://localhost:3000/k3
   ```

3. **Verify**:
   - ✅ Page loads without errors
   - ✅ Loading skeleton appears first
   - ✅ Products display in responsive grid
   - ✅ Placeholder images show correctly
   - ✅ Price formatting: "Rp 95.992.000"
   - ✅ Category badges appear on images
   - ✅ Error handling works jika API down

### API Endpoint Testing

**Test Proxy Route**:
```bash
curl http://localhost:3000/api/kelompok-3/recomendations
```

**Expected Response**:
```json
{
  "status": "success",
  "data": [
    {
      "product_id": "65",
      "product_title": "Laptop ADVAN...",
      "product_price": "95992000",
      "product_img1": "AD 1.webp"
    }
  ]
}
```

---

## Known Issues & Limitations

1. **Image Accessibility**:
   - API returns relative paths tanpa base URL
   - Current solution: placeholder images
   - **Future**: Coordinate dengan Kelompok 3 untuk proper image URLs

2. **Limited Product Data**:
   - Only 4 fields returned vs 14 documented
   - Missing: descriptions, types, additional images
   - **Workaround**: Client-side category extraction dari title

3. **Data Type Inconsistency**:
   - Documentation says integer, API returns string
   - **Handled**: Type interfaces match reality, parsing done client-side

4. **No Product Detail Page Yet**:
   - "Lihat Detail" button currently non-functional
   - **Future**: Create detail page like Kelompok 1 pattern

---

## Recommendations

### Short-term
1. ✅ **DONE**: Implement basic integration dengan placeholder strategy
2. 🔄 **Next**: Test dengan live API untuk verify response consistency
3. 📋 **Optional**: Add loading indicators untuk better perceived performance

### Long-term
1. **Coordinate dengan Kelompok 3**:
   - Request full field response (sesuai dokumentasi)
   - Request proper image URLs (absolute paths atau base URL)
   - Verify data type consistency (string vs integer)

2. **Feature Enhancements**:
   - Product detail page (`/k3/products/[id]`)
   - Search dan filtering functionality
   - Sort by price, category, atau alphabetical
   - Pagination jika product count grows

3. **Performance Optimization**:
   - Image optimization dengan Next.js `<Image>` component
   - API response caching (SWR atau React Query)
   - Skeleton loading improvements
