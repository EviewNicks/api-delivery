# Kelompok 1 - Rental Baju Features

Komponen dan fungsi untuk manajemen produk rental baju.

## Components

### ProductForm
**Path**: `features/kelompok1/components/ProductForm.tsx`

Form untuk create dan edit produk.

**Props**:
- `product?: Product` - Data produk untuk edit mode (optional)
- `onSuccess: () => void` - Callback setelah berhasil submit
- `onCancel: () => void` - Callback untuk cancel

**Features**:
- Create product baru dengan semua field
- Edit product existing (nama, deskripsi, harga, gambar)
- Category dropdown (auto-load dari API)
- Image upload
- Form validation

**Usage**:
```tsx
import { ProductForm } from '@/features/kelompok1/components/ProductForm';

<ProductForm
  product={selectedProduct}
  onSuccess={() => {
    setShowModal(false);
    refreshData();
  }}
  onCancel={() => setShowModal(false)}
/>
```

---

### ProductActions
**Path**: `features/kelompok1/components/ProductActions.tsx`

Action buttons untuk edit dan delete produk.

**Props**:
- `product: Product` - Data produk
- `onEdit: () => void` - Callback untuk edit action
- `onDelete: () => void` - Callback setelah berhasil delete

**Features**:
- Edit button
- Delete button dengan confirmation modal
- Loading state saat delete
- Error handling

**Usage**:
```tsx
import { ProductActions } from '@/features/kelompok1/components/ProductActions';

<ProductActions
  product={product}
  onEdit={() => {
    setEditProduct(product);
    setShowForm(true);
  }}
  onDelete={() => {
    refreshProducts();
  }}
/>
```

## API Integration

Menggunakan functions dari `lib/api-client.ts`:

- `getCategories()` - Fetch semua kategori
- `createProduct(formData)` - Create produk baru
- `updateProduct(id, formData)` - Update produk existing
- `deleteProduct(id)` - Delete produk

## Implementation Notes

1. **Modal Pattern**: Form ditampilkan dalam modal overlay
2. **Optimistic UI**: Delete langsung refresh list setelah success
3. **Error Handling**: Semua error ditampilkan ke user dengan message jelas
4. **File Upload**: Menggunakan FormData untuk handle image upload
5. **Type Safety**: Semua props dan responses fully typed dengan TypeScript
