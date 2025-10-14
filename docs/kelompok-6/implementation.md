# Kelompok 6: House Cafe - Implementation Guide

## Overview

**Project**: House Cafe Reservation System
**Website**: https://v0-house-cafe-website-project.vercel.app/
**API Type**: Supabase REST API
**Dashboard Route**: `/k6`

## API Integration

### Base Configuration

```typescript
const SUPABASE_URL = 'https://rsjauhzcwslcsoktbplq.supabase.co/rest/v1/reservasi';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Authentication Headers

All requests require:
```typescript
headers: {
  'apikey': API_TOKEN,
  'authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
}
```

## CRUD Operations

### 1. GET - List Reservations

**Endpoint**: `GET /api/kelompok-6/reservasi`

**Response**:
```json
[
  {
    "id": 1,
    "nama": "muhammad",
    "email": "alfakiddrock7@gmail.com",
    "telepon": "+6285824364689",
    "tanggal": "2025-10-16",
    "jam": "12:05:00",
    "jumlah_orang": 3,
    "catatan": "Ice coffie",
    "created_at": "2025-10-01T14:06:15.699464"
  }
]
```

**Client Function**:
```typescript
import { fetchReservations } from '@/lib/api-client';

const reservations = await fetchReservations();
```

### 2. GET - Detail Reservation

**Endpoint**: `GET /api/kelompok-6/reservasi?id={id}`

**Supabase Query Pattern**: `?id=eq.2`

**Client Function**:
```typescript
import { fetchReservationDetail } from '@/lib/api-client';

const reservation = await fetchReservationDetail(2);
```

### 3. POST - Create Reservation

**Endpoint**: `POST /api/kelompok-6/reservasi`

**Request Body**:
```json
{
  "nama": "Tiara Andini",
  "email": "tiara@example.com",
  "telepon": "08123456789",
  "tanggal": "2025-10-15",
  "jam": "18:30:00",
  "jumlah_orang": 4,
  "catatan": "Ulang tahun"
}
```

**Headers** (Important):
```typescript
{
  'Prefer': 'return=representation'  // Returns created object
}
```

**Client Function**:
```typescript
import { createReservation } from '@/lib/api-client';

const newReservation = await createReservation({
  nama: "Tiara Andini",
  email: "tiara@example.com",
  telepon: "08123456789",
  tanggal: "2025-10-15",
  jam: "18:30:00",
  jumlah_orang: 4,
  catatan: "Ulang tahun"
});
```

### 4. PATCH - Update Reservation

**Endpoint**: `PATCH /api/kelompok-6/reservasi?id={id}`

**Supabase Query Pattern**: `?id=eq.9`

**Request Body** (Partial update supported):
```json
{
  "nama": "Updated Name",
  "jumlah_orang": 5
}
```

**Client Function**:
```typescript
import { updateReservation } from '@/lib/api-client';

const updated = await updateReservation(9, {
  nama: "Updated Name",
  jumlah_orang: 5
});
```

### 5. DELETE - Remove Reservation

**Endpoint**: `DELETE /api/kelompok-6/reservasi?id={id}`

**Supabase Query Pattern**: `?id=eq.2`

**Response**: `204 No Content` or success message

**Client Function**:
```typescript
import { deleteReservation } from '@/lib/api-client';

const result = await deleteReservation(2);
// { success: true, message: "Reservation deleted successfully" }
```

## Component Architecture

### Directory Structure

```
features/kelompok6/
├── components/
│   ├── ReservationTable.tsx          # Main table view
│   ├── ReservationDetail.tsx         # Modal detail view
│   ├── ReservationStatusBadge.tsx    # Status indicator
│   ├── ReservationForm.tsx           # Reusable form (create/edit)
│   ├── CreateReservationModal.tsx    # Create modal
│   ├── EditReservationModal.tsx      # Edit modal
│   └── DeleteConfirmDialog.tsx       # Delete confirmation
├── hooks/
│   └── useReservations.ts            # Data fetching hook
└── types/
    └── index.ts                       # Type re-exports
```

### Component Usage

#### ReservationTable
```tsx
import { ReservationTable } from '@/features/kelompok6/components/ReservationTable';

<ReservationTable
  reservations={reservations}
  onViewDetail={(id) => setSelectedId(id)}
/>
```

#### CreateReservationModal
```tsx
import { CreateReservationModal } from '@/features/kelompok6/components/CreateReservationModal';

<CreateReservationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => refetch()}
/>
```

#### EditReservationModal
```tsx
import { EditReservationModal } from '@/features/kelompok6/components/EditReservationModal';

<EditReservationModal
  isOpen={isOpen}
  reservation={selectedReservation}
  onClose={() => setIsOpen(false)}
  onSuccess={() => refetch()}
/>
```

#### DeleteConfirmDialog
```tsx
import { DeleteConfirmDialog } from '@/features/kelompok6/components/DeleteConfirmDialog';

<DeleteConfirmDialog
  isOpen={isOpen}
  reservationId={id}
  reservationName="John Doe"
  onClose={() => setIsOpen(false)}
  onSuccess={() => refetch()}
/>
```

## Data Enrichment

### Type Definitions

```typescript
// lib/types.ts

export interface HouseCafeReservation {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  tanggal: string;      // "2025-10-16"
  jam: string;          // "12:05:00"
  jumlah_orang: number;
  catatan: string | null;
  created_at: string;
}

export interface HouseCafeReservationEnriched extends HouseCafeReservation {
  datetime_formatted: string;  // "16 Oktober 2025 pukul 12:05"
  date_formatted: string;      // "16 Oktober 2025"
  time_formatted: string;      // "12:05"
  is_upcoming: boolean;
  status: 'upcoming' | 'past';
}
```

### Enrichment Functions

```typescript
// lib/api-client.ts

function formatReservationDateTime(tanggal: string, jam: string) {
  const dateTimeStr = `${tanggal}T${jam}`;
  const dateTime = new Date(dateTimeStr);

  const date_formatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateTime);

  const time_formatted = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateTime);

  const datetime_formatted = `${date_formatted} pukul ${time_formatted}`;

  return { datetime_formatted, date_formatted, time_formatted };
}

function isReservationUpcoming(tanggal: string, jam: string): boolean {
  const dateTimeStr = `${tanggal}T${jam}`;
  const reservationDateTime = new Date(dateTimeStr);
  const now = new Date();
  return reservationDateTime >= now;
}
```

## Form Validation

### Required Fields

- `nama`: Required, non-empty string
- `email`: Required, valid email format
- `telepon`: Required, phone number
- `tanggal`: Required, valid date
- `jam`: Required, valid time
- `jumlah_orang`: Required, minimum 1

### Optional Fields

- `catatan`: Optional text area for special requests

### Validation Logic

```typescript
// features/kelompok6/components/ReservationForm.tsx

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.nama.trim()) {
    newErrors.nama = 'Nama harus diisi';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email harus diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Format email tidak valid';
  }

  if (!formData.telepon.trim()) {
    newErrors.telepon = 'Nomor telepon harus diisi';
  }

  if (!formData.tanggal) {
    newErrors.tanggal = 'Tanggal harus diisi';
  }

  if (!formData.jam) {
    newErrors.jam = 'Jam harus diisi';
  }

  if (formData.jumlah_orang < 1) {
    newErrors.jumlah_orang = 'Jumlah orang minimal 1';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Error Handling

### API Error Class

```typescript
// lib/api-client.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Error Messages

- `404`: "Reservasi tidak ditemukan"
- `500`: "Gagal mengambil data reservasi"
- `timeout`: "Request timeout - API tidak merespons dalam 10 detik"
- `network`: "Network error - Periksa koneksi internet"

## Dashboard Features

### Statistics Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>Total Reservasi: {reservations.length}</div>
  <div>Reservasi Mendatang: {upcomingCount}</div>
  <div>Reservasi Selesai: {pastCount}</div>
</div>
```

### Action Buttons

- **Create**: "Buat Reservasi Baru" - Opens CreateReservationModal
- **Edit**: "Edit" - Opens EditReservationModal (in detail view)
- **Delete**: "Hapus" - Opens DeleteConfirmDialog (in detail view)

### Status Indicators

- **Upcoming**: Green badge - `bg-green-100 text-green-800`
- **Past**: Gray badge - `bg-neutral-100 text-neutral-600`
- **API Status**: Green "API Online" badge

## Testing Checklist

### CRUD Operations

- [x] GET all reservations
- [x] GET reservation detail by ID
- [x] POST create new reservation
- [x] PATCH update existing reservation
- [x] DELETE remove reservation

### UI Components

- [x] Table renders all reservations
- [x] Detail modal shows complete information
- [x] Create modal accepts valid input
- [x] Edit modal pre-fills existing data
- [x] Delete dialog confirms before deletion

### Error Handling

- [x] Network timeout (10s)
- [x] 404 not found
- [x] 500 server error
- [x] Form validation errors

### User Experience

- [x] Loading states
- [x] Error messages
- [x] Success feedback (refetch after mutation)
- [x] Responsive design

## Troubleshooting

### Common Issues

**Issue**: CORS error when calling API directly
**Solution**: Use API proxy route `/api/kelompok-6/reservasi`

**Issue**: Supabase returns empty array
**Solution**: Check query parameter format `?id=eq.{id}` (not `?id={id}`)

**Issue**: POST/PATCH doesn't return created/updated object
**Solution**: Add `'Prefer': 'return=representation'` header

**Issue**: DateTime formatting incorrect
**Solution**: Ensure date format is `YYYY-MM-DD` and time is `HH:MM:SS`

## Performance Considerations

- **Caching**: API responses have `Cache-Control: no-store` to ensure fresh data
- **Timeout**: 10-second timeout for all API requests
- **Refetch**: Manual refetch after mutations (create/update/delete)
- **Loading States**: Show spinners during async operations

## Future Enhancements

- [ ] Pagination for large datasets
- [ ] Search/filter by name, email, date
- [ ] Sort by date, name, status
- [ ] Export to CSV
- [ ] Calendar view for reservations
- [ ] Email notifications
- [ ] SMS reminders
