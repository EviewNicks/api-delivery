# Kelompok 4: Krusit API - Implementation Guide

## Overview

Dokumentasi lengkap untuk integrasi API Krusit (Kelompok 4) yang menyediakan data menu makanan dan minuman untuk aplikasi food ordering.

## Tech Stack Integration

- **Framework**: Next.js 15 dengan App Router
- **API Pattern**: Next.js API Routes sebagai proxy layer
- **Data Fetching**: Client-side dengan React hooks
- **Type Safety**: TypeScript interfaces untuk semua data models

## Architecture

### API Proxy Layer

```
app/api/kelompok-4/
├── makanan/route.ts    # Proxy untuk GET /api/makanan
└── minuman/route.ts    # Proxy untuk GET /api/minuman
```

**Purpose**: Resolve CORS issues dengan fetch data dari server-side Next.js API Routes.

### Type System

```typescript
// lib/types.ts
interface KrusitMenuItem {
  id: number;
  name: string;
  description: string | null;
  category: 'makanan' | 'minuman';
  price: string;              // Decimal dalam string format
  image: string;
  created_at: string;
  updated_at: string;
}

interface KrusitMenuItemEnriched {
  // ... semua fields dari KrusitMenuItem
  price_number: number;        // Parsed price
  price_formatted: string;     // Rupiah formatting
  image_url: string;          // Resolved image URL
  is_valid_image: boolean;    // Image validation flag
}
```

### Client Functions

```typescript
// lib/api-client.ts
fetchKrusitMakanan(): Promise<KrusitMenuItemEnriched[]>
fetchKrusitMinuman(): Promise<KrusitMenuItemEnriched[]>
```

**Features**:
- 10 detik timeout protection
- Automatic error handling dengan descriptive messages
- Data enrichment (price parsing, image validation)
- Category auto-correction untuk data quality issues

## Data Transformation Pipeline

### 1. Price Parsing

```typescript
// Input: "10000.00" (string)
// Output: 10000 (number) + "Rp 10.000" (formatted)
price_number: parseFloat(item.price)
price_formatted: formatRupiah(parseFloat(item.price))
```

### 2. Image Path Resolution

**Validation Logic**:
```typescript
// Valid paths:
- https://example.com/image.jpg  → Use as-is
- menus/abc123.jpg               → Prepend base URL
- images/xyz.png                 → Prepend base URL

// Invalid paths:
- C:\\xampp\\tmp\\php1234.tmp    → Replace with placeholder
- Any path containing 'tmp'      → Replace with placeholder
```

**Resolution**:
```typescript
resolveKrusitImageUrl(imagePath: string): string {
  if (valid) {
    return `https://projekkelompok4-production.up.railway.app/storage/${imagePath}`;
  }
  return '/images/kelompok-4/placeholder-menu.jpg';
}
```

### 3. Category Auto-Correction

**Issue**: API data memiliki kategori yang salah (contoh: "Green Tea" dengan category "makanan")

**Solution**:
```typescript
fixKrusitCategory(item: KrusitMenuItem): 'makanan' | 'minuman' {
  const nameLower = item.name.toLowerCase();

  // Detect minuman by keywords
  if (nameLower.includes('tea') || nameLower.includes('kopi') || nameLower.includes('jus')) {
    return 'minuman';
  }

  return item.category; // Keep original if no keyword match
}
```

## UI Implementation

### Page Structure

```tsx
// app/k4/page.tsx
export default function Kelompok4Page() {
  // Dual-section layout:
  // 1. Makanan section
  // 2. Minuman section
}
```

### Key Features

**1. Dual-Section Layout**
- Separate sections untuk Makanan dan Minuman
- Independent loading states per section
- Better UX untuk browsing specific categories

**2. Loading States**
```tsx
// Skeleton cards dengan animate-pulse
<LoadingSection /> // Shows 3 skeleton cards
```

**3. Error Handling**
```tsx
// Error boundary dengan retry mechanism
<ErrorSection error={error} onRetry={() => window.location.reload()} />
```

**4. Image Fallback**
```tsx
<img
  src={item.image_url}
  onError={(e) => {
    e.currentTarget.src = '/images/kelompok-4/placeholder-menu.jpg';
  }}
/>
```

**5. Responsive Grid**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

## Testing Checklist

### API Routes Testing

```bash
# Test makanan endpoint
curl http://localhost:3000/api/kelompok-4/makanan

# Test minuman endpoint
curl http://localhost:3000/api/kelompok-4/minuman
```

**Expected Response**:
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
      "image": "menus/xyz.jpg",
      "created_at": "2025-09-16T04:30:07.000000Z",
      "updated_at": "2025-09-16T19:01:14.000000Z"
    }
  ]
}
```

### UI Testing

1. **Navigate to `/k4`** - Dashboard should load
2. **Check Makanan section** - Data displayed correctly
3. **Check Minuman section** - Data displayed correctly
4. **Test image fallback** - Invalid images show placeholder
5. **Test loading states** - Skeleton cards appear during load
6. **Test error states** - Error message dengan retry button
7. **Test responsive design** - Grid columns adapt to screen size
8. **Browser console** - No errors or warnings

## Common Issues & Solutions

### Issue 1: CORS Error

**Symptom**: `Access-Control-Allow-Origin` error di browser console

**Solution**: Pastikan menggunakan API proxy routes (`/api/kelompok-4/*`), bukan direct fetch ke external API.

### Issue 2: Invalid Image Paths

**Symptom**: Broken images atau 404 errors untuk image URLs

**Solution**: Image fallback sudah implemented. Verify placeholder image exists di `/public/images/kelompok-4/placeholder-menu.jpg`

### Issue 3: Timeout Errors

**Symptom**: "Request timeout" error message

**Solution**:
- Check external API status: `https://projekkelompok4-production.up.railway.app/api/makanan`
- Increase timeout di `lib/api-client.ts` jika needed (currently 10s)

### Issue 4: Category Mismatch

**Symptom**: Items appear in wrong section (Green Tea in Makanan)

**Solution**: Category auto-correction sudah implemented di `fixKrusitCategory()`. Add more keywords jika needed.

## Performance Optimization

### Current Optimizations

1. **Parallel Data Fetching**: Makanan dan Minuman fetch simultaneously (tidak sequential)
2. **Client-side Enrichment**: Data transformation di client untuk reduce server load
3. **Lazy Loading**: Images load on-demand dengan browser native lazy loading

### Future Improvements

1. **Image CDN**: Serve images dari CDN untuk faster load times
2. **Data Caching**: Implement SWR atau React Query untuk client-side caching
3. **Pagination**: Add pagination untuk large menu datasets
4. **Search & Filter**: Add search functionality untuk easier menu browsing

## API Reference

See `api-reference.md` untuk detailed endpoint documentation.
