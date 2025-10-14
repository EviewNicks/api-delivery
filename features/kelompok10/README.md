# Kelompok 10: Cafeku API Integration

Integrasi API Cafeku Public API untuk sistem manajemen menu kafe dengan fitur CRUD lengkap.

## Overview

**Base URL**: `https://dodgerblue-monkey-417412.hostingersite.com/api`
**API Version**: 1.2.1
**Authentication**: No authentication required (public API)

## Features

- List semua produk menu kafe
- Detail produk individual
- Create produk baru dengan upload gambar
- Update produk (tanpa mengubah gambar)
- Delete produk dari database
- Real-time stock status monitoring
- Price formatting dalam Rupiah
- Image URL construction otomatis

## Components

### ProductCard

Display card untuk satu produk dengan action buttons.

**Props:**
- `product: CafekuProductEnriched` - Data produk yang sudah di-enrich
- `onEdit?: (product) => void` - Callback saat tombol edit diklik
- `onDelete?: (id) => void` - Callback saat tombol delete diklik

**Features:**
- Stock status badge (Tersedia, Stok Terbatas, Habis)
- Price formatting otomatis
- Image lazy loading dengan Next.js Image
- Responsive design

### ProductForm

Form modal untuk create dan edit produk.

**Props:**
- `mode: 'create' | 'edit'` - Mode form (create atau edit)
- `product?: CafekuProductEnriched` - Data produk (untuk mode edit)
- `onSubmit: (data) => Promise<void>` - Submit handler
- `onCancel: () => void` - Cancel handler

**Validation:**
- Title: minimal 5 karakter
- Description: minimal 10 karakter
- Price: harus angka, minimal 0
- Stock: harus angka, minimal 0
- Image: hanya untuk mode create, max 2MB, format JPG/PNG

### DeleteConfirmation

Modal konfirmasi sebelum delete produk.

**Props:**
- `productName: string` - Nama produk yang akan dihapus
- `onConfirm: () => void` - Confirm handler
- `onCancel: () => void` - Cancel handler
- `isDeleting: boolean` - Loading state saat proses delete

## API Endpoints

### GET /api/kelompok-10/menu

List semua produk menu.

**Response:**
```typescript
{
  success: boolean;
  data: CafekuProduct[];
}
```

### GET /api/kelompok-10/products/:id

Get detail produk by ID.

**Response:**
```typescript
{
  success: boolean;
  data: CafekuProduct;
}
```

### POST /api/kelompok-10/products

Create produk baru.

**Request:** `multipart/form-data`
- title (string, min 5 chars)
- description (string, min 10 chars)
- price (number)
- stock (number)
- image (file, jpg/png, max 2MB)

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: CafekuProduct;
}
```

### PUT /api/kelompok-10/products/:id

Update produk (tanpa gambar).

**Request:** `application/json`
```json
{
  "title": "string",
  "description": "string",
  "price": number,
  "stock": number
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: CafekuProduct;
}
```

### DELETE /api/kelompok-10/products/:id

Delete produk.

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## Data Enrichment

Setiap produk dari API di-enrich dengan:

- `price_formatted`: String format Rupiah (contoh: "Rp 35.000")
- `image_url`: Full URL ke gambar di storage server
- `stock_status`: "in_stock" | "low_stock" | "out_of_stock"
- `is_available`: Boolean, true jika stock > 0

**Stock Status Logic:**
- `out_of_stock`: stock === 0
- `low_stock`: stock < 10
- `in_stock`: stock >= 10

## Usage Example

```typescript
import { fetchCafekuMenu, createCafekuProduct } from '@/lib/api-client';

// Get all products
const products = await fetchCafekuMenu();

// Create new product
const formData = new FormData();
formData.append('title', 'Cappuccino');
formData.append('description', 'Espresso with milk foam');
formData.append('price', '35000');
formData.append('stock', '100');
formData.append('image', imageFile);

const newProduct = await createCafekuProduct(formData);
```

## Dashboard Page

**Route**: `/k10`

Full-featured dashboard dengan:
- Grid display produk dengan ProductCard
- Create produk dengan modal form
- Edit produk (tanpa mengubah gambar)
- Delete dengan konfirmasi modal
- Loading states dan error handling
- Empty state message

## Critical Requirements

**Header Mandatory**: Setiap request ke external API HARUS include:
```javascript
headers: {
  'Accept': 'application/json'
}
```

Tanpa header ini, Laravel API akan return HTML response alih-alih JSON.

## Image Storage

Image URL construction:
```
https://dodgerblue-monkey-417412.hostingersite.com/storage/products/{image_filename}
```

Image field dari API hanya berisi filename (contoh: `espresso.jpg`).
API client otomatis construct full URL.

## Error Handling

Semua API functions throw `ApiError` dengan:
- `message`: Human-readable error message
- `statusCode`: HTTP status code (optional)

Common error codes:
- `404`: Product not found
- `422`: Validation error
- `500`: Internal server error

## Type Definitions

See `lib/types.ts`:
- `CafekuProduct` - Base product interface
- `CafekuApiResponse<T>` - Generic API response
- `CafekuProductEnriched` - Product dengan enrichment fields
- `CafekuMenuListResponse` - List response type
- `CafekuProductDetailResponse` - Detail response type
