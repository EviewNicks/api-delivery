# Kelompok 4: Krusit F&B API - Implementation Guide

## Overview

Implementasi dashboard untuk API Krusit - sistem food & beverage ordering yang menyediakan menu makanan dan minuman. API ini dihost di Railway platform dengan full CRUD capabilities.

**API Base URL**: `https://projekkelompok4-production.up.railway.app`
**Dashboard Route**: `/k4`
**Implementation Date**: October 2025

---

## API Structure

### Endpoints Implemented

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/makanan` | GET | Retrieve all food items | ✅ Implemented |
| `/api/minuman` | GET | Retrieve all beverage items | ✅ Implemented |
| `/api/login` | POST | User authentication | 📝 Documented (not used) |
| `/api/makanan/:id` | PUT | Update food item | 📝 Not needed for display |
| `/api/makanan/:id` | DELETE | Delete food item | 📝 Not needed for display |

### Response Format

```typescript
{
  "status": "success" | "error",
  "data": [
    {
      "id": number,
      "name": string,
      "description": string | null,
      "category": "makanan" | "minuman",
      "price": string, // decimal format: "10000.00"
      "image": string | null, // path atau null
      "created_at": string, // ISO 8601
      "updated_at": string  // ISO 8601
    }
  ]
}
```

---

## Architecture Components

### 1. TypeScript Type Definitions

**Location**: `lib/types.ts`

```typescript
// Raw API response
export interface KrusitMenuItem {
  id: number;
  name: string;
  description: string | null;
  category: 'makanan' | 'minuman';
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// API response wrapper
export interface KrusitMenuListResponse {
  status: string;
  data: KrusitMenuItem[];
}

// Enriched data untuk UI
export interface KrusitMenuItemEnriched extends KrusitMenuItem {
  price_number: number;
  price_formatted: string; // "Rp 10.000"
  image_url: string;
  is_valid_image: boolean;
}
```

### 2. API Proxy Routes

**Location**: `app/api/kelompok-4/`

#### Makanan Route (`app/api/kelompok-4/makanan/route.ts`)

```typescript
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://projekkelompok4-production.up.railway.app';
const TIMEOUT = 10000; // 10 seconds

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}/api/makanan`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch makanan data', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - API tidak merespons dalam 10 detik' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Network error - Gagal menghubungi API Krusit' },
      { status: 500 }
    );
  }
}
```

**Pattern yang sama** digunakan untuk `minuman/route.ts`.

### 3. API Client Functions

**Location**: `lib/api-client.ts`

#### Data Enrichment Utilities

```typescript
// Validasi image path
function isValidImagePath(imagePath: string): boolean {
  // Skip absolute paths dan temp files
  if (imagePath.includes('C:\\') || imagePath.includes('tmp')) {
    return false;
  }

  // Valid paths: menus/, images/, atau full URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return true;
  }

  if (imagePath.startsWith('menus/') || imagePath.startsWith('images/')) {
    return true;
  }

  return false;
}

// Resolve image URL dengan fallback
function resolveKrusitImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (!isValidImagePath(imagePath)) {
    return '/images/kelompok-4/placeholder-menu.jpg';
  }

  return `https://projekkelompok4-production.up.railway.app/storage/${imagePath}`;
}

// Fix category mismatches (ada item "Green Tea" di category "makanan")
function fixKrusitCategory(item: KrusitMenuItem): 'makanan' | 'minuman' {
  const nameLower = item.name.toLowerCase();

  if (nameLower.includes('tea') || nameLower.includes('kopi') || nameLower.includes('jus')) {
    return 'minuman';
  }

  return item.category;
}

// Enrichment function
function enrichKrusitMenuItem(item: KrusitMenuItem): KrusitMenuItemEnriched {
  const priceNumber = parseFloat(item.price);
  const correctedCategory = fixKrusitCategory(item);

  return {
    ...item,
    category: correctedCategory,
    price_number: priceNumber,
    price_formatted: formatRupiah(priceNumber),
    image_url: resolveKrusitImageUrl(item.image),
    is_valid_image: isValidImagePath(item.image),
  };
}
```

#### Public API Functions

```typescript
export async function fetchKrusitMakanan(): Promise<KrusitMenuItemEnriched[]> {
  try {
    const response = await fetchWithTimeout('/api/kelompok-4/makanan');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const result: KrusitMenuListResponse = await response.json();

    if (result.status === 'error') {
      throw new ApiError('API returned error status');
    }

    // Enrich dan filter untuk makanan saja
    return result.data
      .map(enrichKrusitMenuItem)
      .filter(item => item.category === 'makanan');

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil data makanan');
  }
}

export async function fetchKrusitMinuman(): Promise<KrusitMenuItemEnriched[]> {
  // Similar implementation untuk minuman
}
```

### 4. Dashboard Page

**Location**: `app/k4/page.tsx`

#### Component Structure

```
Kelompok4Page
├── Header Section
│   ├── Title: "Kelompok 4: Menu Krusit"
│   └── Subtitle
│
├── Makanan Section
│   ├── Section Header (with count)
│   ├── Loading State (3 skeleton cards)
│   ├── Error State (with retry button)
│   └── Menu Grid (3 columns)
│       └── MenuCard components
│
└── Minuman Section
    ├── Section Header (with count)
    ├── Loading State
    ├── Error State
    └── Menu Grid
        └── MenuCard components
```

#### Key Features

**1. Dual Independent Loading States**
```typescript
const [makanan, setMakanan] = useState<KrusitMenuItemEnriched[]>([]);
const [minuman, setMinuman] = useState<KrusitMenuItemEnriched[]>([]);
const [loadingMakanan, setLoadingMakanan] = useState(true);
const [loadingMinuman, setLoadingMinuman] = useState(true);
const [errorMakanan, setErrorMakanan] = useState<string | null>(null);
const [errorMinuman, setErrorMinuman] = useState<string | null>(null);
```

**2. Parallel Data Fetching**
```typescript
useEffect(() => {
  async function loadMakanan() { /* ... */ }
  async function loadMinuman() { /* ... */ }

  // Fetch both simultaneously
  loadMakanan();
  loadMinuman();
}, []);
```

**3. Image Error Handling**
```typescript
<img
  src={item.image_url}
  alt={item.name}
  onError={(e) => {
    e.currentTarget.src = '/images/kelompok-4/placeholder-menu.jpg';
  }}
/>

{!item.is_valid_image && (
  <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
    No Image
  </span>
)}
```

**4. Responsive Grid Layout**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <MenuCard key={item.id} item={item} />)}
</div>
```

---

## Design System Integration

### Color Palette

```css
/* Primary Actions */
bg-primary-500    /* #3b82f6 - Buttons */
bg-primary-600    /* #2563eb - Hover */
bg-primary-700    /* #1d4ed8 - Active */

/* Status Indicators */
bg-yellow-500     /* Warning - No image badge */
bg-red-50         /* Error background */
bg-red-600        /* Error button */

/* Neutral Tones */
bg-white          /* Card background */
bg-neutral-50     /* Empty state */
bg-neutral-100    /* Borders, image placeholder */
bg-neutral-200    /* Skeleton loading */
text-neutral-600  /* Secondary text */
text-neutral-800  /* Headings */
```

### Typography

```css
/* Page Title */
text-3xl font-bold text-neutral-800

/* Section Headers */
text-2xl font-bold text-neutral-800

/* Card Title */
text-lg font-semibold text-neutral-800

/* Price */
text-2xl font-bold text-primary-600

/* Description */
text-sm text-neutral-600

/* Button Text */
font-medium text-white
```

### Spacing & Layout

```css
/* Page Container */
p-6

/* Card Padding */
p-6

/* Section Spacing */
space-y-12

/* Grid Gap */
gap-6

/* Image Height */
h-48
```

---

## Data Transformation Pipeline

### Pipeline Flow

```
External API Response
    ↓
Next.js API Route (Proxy)
    ↓
fetchKrusitMakanan/fetchKrusitMinuman
    ↓
enrichKrusitMenuItem
    ↓ (transforms)
    ├─ Parse price: "10000.00" → 10000
    ├─ Format currency: 10000 → "Rp 10.000"
    ├─ Fix category: "Green Tea" → minuman
    ├─ Resolve image URL
    └─ Validate image path
    ↓
KrusitMenuItemEnriched[]
    ↓
React Component (UI Rendering)
```

### Transformation Examples

**Price Transformation**:
```
Input:  "10000.00" (string)
Parse:  10000 (number)
Format: "Rp 10.000" (formatted string)
```

**Image URL Resolution**:
```
Input: "menus/abc123.jpg"
Output: "https://projekkelompok4-production.up.railway.app/storage/menus/abc123.jpg"

Input: "C:\\xampp\\tmp\\php8274.tmp"
Output: "/images/kelompok-4/placeholder-menu.jpg" (fallback)

Input: null
Output: "/images/kelompok-4/placeholder-menu.jpg" (fallback)
```

**Category Correction**:
```
Input: { name: "Green Tea", category: "makanan" }
Output: { name: "Green Tea", category: "minuman" }
```

---

## Error Handling Strategy

### Three-Layer Error Handling

**1. Network Layer (API Routes)**
```typescript
// Timeout after 10 seconds
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000);

// Handle abort errors
if (error.name === 'AbortError') {
  return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
}
```

**2. Application Layer (API Client)**
```typescript
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Throw specific errors
if (!response.ok) {
  throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
}
```

**3. UI Layer (React Components)**
```typescript
// Capture errors in state
catch (err) {
  setErrorMakanan(err instanceof Error ? err.message : 'Failed to load makanan');
}

// Display user-friendly error UI
{errorMakanan && (
  <ErrorSection error={errorMakanan} onRetry={() => window.location.reload()} />
)}
```

---

## Testing Checklist

### Manual Testing Steps

- [ ] **Load Dashboard**: Navigate to `/k4` and verify page loads
- [ ] **Data Display**: Check makanan dan minuman sections show data
- [ ] **Loading States**: Verify skeleton loaders appear during fetch
- [ ] **Price Formatting**: Confirm prices show as "Rp X.XXX" format
- [ ] **Image Display**: Check valid images load correctly
- [ ] **Image Fallback**: Verify placeholder shows for invalid images
- [ ] **No Image Badge**: Check yellow badge appears when `is_valid_image: false`
- [ ] **Category Filtering**: Ensure "Green Tea" appears in minuman, not makanan
- [ ] **Empty States**: Test when API returns empty arrays
- [ ] **Error Handling**: Simulate network error and verify error UI
- [ ] **Retry Mechanism**: Click retry button and confirm reload
- [ ] **Responsive Layout**: Test on mobile (1 col), tablet (2 cols), desktop (3 cols)
- [ ] **Button Hover**: Verify primary button hover states work

### API Testing Commands

```bash
# Test makanan endpoint
curl http://localhost:3000/api/kelompok-4/makanan

# Test minuman endpoint
curl http://localhost:3000/api/kelompok-4/minuman

# Expected response structure
{
  "status": "success",
  "data": [...]
}
```

---

## Known Issues & Solutions

### Issue 1: Category Mismatches

**Problem**: Beberapa item minuman (seperti "Green Tea") memiliki category "makanan" di database.

**Solution**: Implemented `fixKrusitCategory()` function yang detect dari nama item:
```typescript
if (nameLower.includes('tea') || nameLower.includes('kopi') || nameLower.includes('jus')) {
  return 'minuman';
}
```

### Issue 2: Invalid Image Paths

**Problem**: API mengembalikan absolute Windows paths (`C:\\xampp\\tmp\\...`) yang tidak bisa diakses browser.

**Solution**:
- Validation function `isValidImagePath()` untuk detect invalid paths
- Fallback ke placeholder image
- Visual indicator (yellow badge) untuk user awareness

### Issue 3: Null Images

**Problem**: Beberapa items memiliki `image: null` di response.

**Solution**: Type definition mengizinkan `image: string | null` dan enrichment function handle null case dengan fallback.

---

## Performance Optimizations

### 1. Parallel API Calls
Makanan dan minuman di-fetch secara parallel, tidak sequential:
```typescript
loadMakanan();  // Start immediately
loadMinuman();  // Start immediately
// Both run concurrently
```

### 2. Independent Loading States
Jika satu endpoint lambat, section lainnya tetap bisa display data.

### 3. Client-Side Caching
React state caching prevents unnecessary refetches on re-renders.

### 4. Optimized Image Loading
- Lazy loading via browser default
- `onError` fallback prevents broken image icons

---

## Future Enhancements

### Potential Improvements

1. **Search & Filter**
   - Add search bar untuk cari menu by name
   - Filter by price range
   - Sort by name/price

2. **Shopping Cart**
   - Implement cart functionality
   - Order summary and checkout

3. **Menu Details Modal**
   - Click card untuk lihat full description
   - Show creation/update dates
   - Display larger image

4. **Authentication Integration**
   - Use `/api/login` endpoint
   - Show different content for admin vs customer
   - Enable CRUD operations for authenticated users

5. **Real-time Updates**
   - WebSocket integration untuk live menu updates
   - Auto-refresh when data changes

6. **Performance Monitoring**
   - Add loading time metrics
   - Track API response times
   - Error rate monitoring

---

## Related Documentation

- **API Documentation**: `docs/kelompok-4/kelompok4.md`
- **API Response Examples**: `docs/kelompok-4/hasil4.log`
- **Postman Collection**: `docs/kelompok-4/Projek_Kelompok 4.postman_collection.json`
- **Type Definitions**: `lib/types.ts`
- **API Client**: `lib/api-client.ts`
- **Design System**: `docs/theme.md`

---

## Changelog

### Version 1.0.0 (October 2025)
- ✅ Initial implementation
- ✅ TypeScript type definitions
- ✅ API proxy routes untuk CORS resolution
- ✅ Data enrichment dengan price formatting dan image handling
- ✅ Dashboard page dengan dual-category layout
- ✅ Error handling dan loading states
- ✅ Responsive design (mobile-first)
- ✅ Image fallback mechanism
- ✅ Category correction logic
