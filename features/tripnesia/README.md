# Tripnesia Travel Booking Feature

Feature untuk integrasi API Tripnesia (Kelompok 2) - sistem booking travel untuk penerbangan, hotel, dan paket wisata.

## Components

### BookingList.tsx
Komponen untuk menampilkan daftar booking dengan fitur:
- Filter berdasarkan status (Semua/Mendatang/Selesai)
- Tampilan card dengan informasi lengkap booking
- Action buttons untuk Edit dan Delete
- Responsive design dengan Tailwind CSS

**Props:**
- `bookings`: Array of TripnesiaBookingEnriched
- `onEdit`: Callback function untuk edit booking
- `onDelete`: Callback function untuk delete booking
- `isLoading`: Loading state indicator

**Usage:**
```tsx
<BookingList
  bookings={bookings}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isLoading={isLoading}
/>
```

### BookingForm.tsx
Komponen modal form untuk create dan update booking dengan fitur:
- Form validation client-side
- Support untuk create dan edit mode
- Error handling dan display
- Loading state saat submit

**Props:**
- `onSubmit`: Async callback untuk handle form submission
- `onCancel`: Callback untuk cancel action
- `initialData`: Data awal untuk edit mode (optional)
- `isSubmitting`: Submit loading state

**Usage:**
```tsx
<BookingForm
  onSubmit={handleCreate}
  onCancel={() => setShowForm(false)}
  isSubmitting={isSubmitting}
/>
```

## API Integration

### External API
Base URL: `https://tripnesia-vm51.vercel.app/api/bookings`

### Proxy Routes
Location: `app/api/kelompok-2/bookings/route.ts`

Endpoints:
- `GET /api/kelompok-2/bookings?action=list` - Fetch all bookings
- `POST /api/kelompok-2/bookings?action=create` - Create booking
- `PUT /api/kelompok-2/bookings?action=update&id={id}` - Update booking
- `DELETE /api/kelompok-2/bookings?action=delete&id={id}` - Delete booking

### Client Functions
Location: `lib/api-client.ts`

Functions:
- `fetchBookings()`: Promise<TripnesiaBookingEnriched[]>
- `createBooking(data)`: Promise<TripnesiaBooking>
- `updateBooking(id, data)`: Promise<TripnesiaBooking>
- `deleteBooking(id)`: Promise<{success: boolean, message: string}>

## Type Definitions

Location: `lib/types.ts`

### TripnesiaBooking
```typescript
interface TripnesiaBooking {
  id: number;
  name: string;
  type: string;
  destination: string;
  date: string;
}
```

### TripnesiaBookingEnriched
```typescript
interface TripnesiaBookingEnriched extends TripnesiaBooking {
  date_formatted: string;      // "15 Januari 2026"
  is_upcoming: boolean;         // true if date >= today
  type_label: string;           // "Penerbangan", "Hotel", "Paket Wisata"
}
```

## Data Enrichment

Client-side transformation dari raw API response:

1. **Date Formatting**: ISO date string → Indonesian formatted date
2. **Status Detection**: Auto-detect upcoming vs past bookings
3. **Type Labeling**: Convert type code → human-readable label

## Features Implemented

- Full CRUD operations (Create, Read, Update, Delete)
- Client-side filtering (All/Upcoming/Past)
- Form validation dengan error messages
- API error handling dengan user-friendly messages
- Loading states untuk better UX
- Responsive design mengikuti design system project
- Timeout protection (10 detik) untuk API calls

## Design System Compliance

Colors:
- Primary: `primary-500` (#3b82f6) untuk buttons dan badges
- Success: `green-100/800` untuk status upcoming
- Neutral: `neutral-50/700` untuk backgrounds dan text

Components:
- Card layout dengan shadow-sm dan border
- Button styles sesuai design system
- Form inputs dengan focus states
- Modal overlay untuk forms

## Testing Notes

Manual testing checklist:
- Create booking dengan semua field valid
- Update booking existing
- Delete booking dengan confirmation
- Filter bookings by status
- Form validation untuk required fields
- API error scenarios (timeout, network error)
- Loading states visibility

## Future Enhancements

Potential improvements:
- Search functionality by name/destination
- Date range filtering
- Export bookings to CSV/PDF
- Booking detail page dengan route `/k2/bookings/[id]`
- Image upload untuk destinations
- Multi-language support
