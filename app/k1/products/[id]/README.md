# Product Detail Page

## Lokasi
`app/k1/products/[id]/page.tsx`

## Deskripsi
Halaman detail produk rental baju yang menampilkan informasi lengkap produk berdasarkan ID. Halaman ini menggantikan modal popup yang sebelumnya digunakan di product list page.

## Fitur
- **Dynamic Route**: Menggunakan Next.js dynamic route `[id]` untuk fetch product detail berdasarkan ID dari URL
- **Breadcrumb Navigation**: Navigasi Home → Products → [Product Name] untuk memudahkan user kembali
- **Back Button**: Tombol kembali ke daftar produk dengan `router.back()`
- **Responsive Layout**: Grid layout yang responsive untuk mobile dan desktop
- **Loading State**: Skeleton loading saat fetch data
- **Error Handling**: Error state dengan opsi kembali atau retry
- **Image Gallery**: Tampilan gambar produk dengan fallback untuk produk tanpa gambar
- **Product Information**:
  - Nama produk & kode produk
  - Harga sewa dan modal awal
  - Status ketersediaan (Available/Rented/Maintenance)
  - Kategori dengan color indicator
  - Warna produk dengan preview
  - Deskripsi lengkap
  - Size variants dengan stock quantity
- **CTA Button**: Tombol "Hubungi untuk Menyewa" untuk produk yang tersedia

## API Endpoint
Menggunakan `getProductDetail(id)` dari `@/lib/api-client` yang memanggil:
```
GET /api/kelompok-1/products/[id]
```

## Navigation Flow
```
Homepage (/)
  → Product List (/k1)
    → Product Detail (/k1/products/[id])
```

## Dependencies
- `next/navigation` untuk routing
- `next/image` untuk optimized image loading
- `@/lib/api-client` untuk API calls
- `@/lib/types` untuk TypeScript types

## Type Safety
Menggunakan TypeScript dengan type `Product` dari `lib/types.ts`

## Performance
- Menggunakan Next.js Image component untuk optimized loading
- Client-side data fetching dengan loading state
- Unoptimized image flag untuk external image URLs

## Future Improvements
- [ ] Image optimization dengan custom loader
- [ ] SEO metadata dengan generateMetadata
- [ ] Social sharing functionality
- [ ] Related products recommendation
- [ ] Product review system