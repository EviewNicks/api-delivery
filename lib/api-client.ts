import type {
  Product,
  ProductListResponse,
  ProductFormData,
  Category,
  CategoryListResponse,
  GadgetRecommendationsResponse,
  GadgetProductEnriched,
  KrusitMenuListResponse,
  KrusitMenuItem,
  KrusitMenuItemEnriched,
  TripnesiaBooking,
  TripnesiaBookingListResponse,
  TripnesiaBookingCreateResponse,
  TripnesiaBookingUpdateResponse,
  TripnesiaBookingDeleteResponse,
  TripnesiaBookingEnriched,
  HouseCafeReservation,
  HouseCafeReservationEnriched
} from './types';

const BASE_URL = '/api/kelompok-1';
const TIMEOUT = 10000;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(url: string, timeout = TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - API tidak merespons dalam 10 detik');
    }
    throw new ApiError('Network error - Periksa koneksi internet');
  }
}

export async function getProducts(
  page = 1,
  limit = 12,
  search?: string,
  status?: string
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (status) params.append('status', status);

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products?${params}`);

    if (!response.ok) {
      throw new ApiError('Gagal mengambil daftar produk', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengambil data');
  }
}

export async function getProductDetail(id: string): Promise<Product> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Produk tidak ditemukan', 404);
      }
      throw new ApiError('Gagal mengambil detail produk', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengambil detail');
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/categories`);

    if (!response.ok) {
      throw new ApiError('Gagal mengambil kategori', response.status);
    }

    const data: CategoryListResponse = await response.json();
    return data.categories;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengambil kategori');
  }
}

export async function createProduct(formData: ProductFormData): Promise<Product> {
  try {
    const data = new FormData();

    data.append('code', formData.code);
    data.append('name', formData.name);
    if (formData.description) data.append('description', formData.description);
    data.append('modalAwal', formData.modalAwal);
    data.append('currentPrice', formData.currentPrice);
    data.append('quantity', formData.quantity);
    data.append('categoryId', formData.categoryId);
    data.append('sizes', formData.sizes);
    if (formData.image) data.append('image', formData.image);

    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.error || 'Gagal membuat produk', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat membuat produk');
  }
}

export async function updateProduct(id: string, formData: ProductFormData): Promise<Product> {
  try {
    const data = new FormData();

    data.append('name', formData.name);
    if (formData.description) data.append('description', formData.description);
    data.append('currentPrice', formData.currentPrice);
    if (formData.image) data.append('image', formData.image);

    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.error || 'Gagal mengupdate produk', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengupdate produk');
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.error || 'Gagal menghapus produk', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat menghapus produk');
  }
}

// Kelompok 3: GadgetHouse API

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function resolveImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return '/images/kelompok-3/placeholder-gadget.jpg';
}

function extractCategory(title: string): string {
  const lower = title.toLowerCase();

  if (lower.includes('laptop')) return 'Laptop';
  if (lower.includes('tablet')) return 'Tablet';
  if (lower.includes('printer')) return 'Printer';
  if (lower.includes('monitor')) return 'Monitor';
  if (lower.includes('powerbank') || lower.includes('power bank')) return 'Powerbank';
  if (lower.includes('samsung') || lower.includes('iphone') || lower.includes('galaxy')) return 'Smartphone';

  return 'Gadget';
}

export async function fetchGadgetRecommendations(): Promise<GadgetProductEnriched[]> {
  try {
    const response = await fetchWithTimeout('/api/kelompok-3/recomendations');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const result: GadgetRecommendationsResponse = await response.json();

    if (result.status === 'error') {
      throw new ApiError('API returned error status');
    }

    return result.data.map(product => ({
      ...product,
      price_number: parseInt(product.product_price, 10),
      price_formatted: formatRupiah(parseInt(product.product_price, 10)),
      image_url: resolveImageUrl(product.product_img1),
      category_guess: extractCategory(product.product_title),
    }));

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil rekomendasi produk');
  }
}

// Kelompok 4: Krusit API

function isValidImagePath(imagePath: string | null): boolean {
  if (!imagePath) {
    return false;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return true;
  }

  if (imagePath.includes('C:\\') || imagePath.includes('tmp')) {
    return false;
  }

  if (imagePath.startsWith('menus/') || imagePath.startsWith('images/')) {
    return true;
  }

  return false;
}

function resolveKrusitImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return '/images/kelompok-4/placeholder-makanan.png';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (!isValidImagePath(imagePath)) {
    return '/images/kelompok-4/placeholder-makanan.png';
  }

  return `https://projekkelompok4-production.up.railway.app/storage/${imagePath}`;
}

function fixKrusitCategory(item: KrusitMenuItem): 'makanan' | 'minuman' {
  const nameLower = item.name.toLowerCase();

  if (nameLower.includes('tea') || nameLower.includes('kopi') || nameLower.includes('jus')) {
    return 'minuman';
  }

  return item.category;
}

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

    return result.data
      .map(enrichKrusitMenuItem)
      .filter(item => item.category === 'makanan');

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil data makanan');
  }
}

export async function fetchKrusitMinuman(): Promise<KrusitMenuItemEnriched[]> {
  try {
    const response = await fetchWithTimeout('/api/kelompok-4/minuman');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const result: KrusitMenuListResponse = await response.json();

    if (result.status === 'error') {
      throw new ApiError('API returned error status');
    }

    return result.data
      .map(enrichKrusitMenuItem)
      .filter(item => item.category === 'minuman');

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil data minuman');
  }
}

// Kelompok 2: Tripnesia API

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function isUpcoming(dateString: string): boolean {
  const bookingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
}

function getTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    'flight': 'Penerbangan',
    'hotel': 'Hotel',
    'tour': 'Paket Wisata'
  };
  return typeMap[type] || type;
}

function enrichBooking(booking: TripnesiaBooking): TripnesiaBookingEnriched {
  return {
    ...booking,
    date_formatted: formatDate(booking.date),
    is_upcoming: isUpcoming(booking.date),
    type_label: getTypeLabel(booking.type)
  };
}

export async function fetchBookings(): Promise<TripnesiaBookingEnriched[]> {
  try {
    const response = await fetchWithTimeout('/api/kelompok-2/bookings?action=list');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const result: TripnesiaBookingListResponse = await response.json();
    return result.data.map(enrichBooking);

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil data booking');
  }
}

export async function createBooking(data: Omit<TripnesiaBooking, 'id'>): Promise<TripnesiaBooking> {
  try {
    const response = await fetch('/api/kelompok-2/bookings?action=create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError('Gagal membuat booking', response.status);
    }

    const result: TripnesiaBookingCreateResponse = await response.json();
    return result.data;

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat membuat booking');
  }
}

export async function updateBooking(id: number, data: Omit<TripnesiaBooking, 'id'>): Promise<TripnesiaBooking> {
  try {
    const response = await fetch(`/api/kelompok-2/bookings?action=update&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      throw new ApiError('Gagal mengupdate booking', response.status);
    }

    const result: TripnesiaBookingUpdateResponse = await response.json();
    return result.data;

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengupdate booking');
  }
}

export async function deleteBooking(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/kelompok-2/bookings?action=delete&id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new ApiError('Gagal menghapus booking', response.status);
    }

    const result: TripnesiaBookingDeleteResponse = await response.json();
    return { success: true, message: result.message };

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat menghapus booking');
  }
}

// Kelompok 6: House Cafe API

function formatReservationDateTime(tanggal: string, jam: string): {
  datetime_formatted: string;
  date_formatted: string;
  time_formatted: string;
} {
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

function enrichReservation(reservation: HouseCafeReservation): HouseCafeReservationEnriched {
  const { datetime_formatted, date_formatted, time_formatted } = formatReservationDateTime(
    reservation.tanggal,
    reservation.jam
  );
  const is_upcoming = isReservationUpcoming(reservation.tanggal, reservation.jam);

  return {
    ...reservation,
    datetime_formatted,
    date_formatted,
    time_formatted,
    is_upcoming,
    status: is_upcoming ? 'upcoming' : 'past'
  };
}

export async function fetchReservations(): Promise<HouseCafeReservationEnriched[]> {
  try {
    const response = await fetchWithTimeout('/api/kelompok-6/reservasi');

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const data: HouseCafeReservation[] = await response.json();
    return data.map(enrichReservation);

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Gagal mengambil data reservasi');
  }
}

export async function fetchReservationDetail(id: number): Promise<HouseCafeReservationEnriched> {
  try {
    const response = await fetchWithTimeout(`/api/kelompok-6/reservasi?id=${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Reservasi tidak ditemukan', 404);
      }
      throw new ApiError('Gagal mengambil detail reservasi', response.status);
    }

    const data: HouseCafeReservation[] = await response.json();

    if (!data || data.length === 0) {
      throw new ApiError('Reservasi tidak ditemukan', 404);
    }

    return enrichReservation(data[0]);

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengambil detail reservasi');
  }
}

export async function createReservation(data: Omit<HouseCafeReservation, 'id' | 'created_at'>): Promise<HouseCafeReservation> {
  try {
    const response = await fetch('/api/kelompok-6/reservasi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError('Gagal membuat reservasi', response.status);
    }

    const result: HouseCafeReservation[] = await response.json();
    return result[0];

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat membuat reservasi');
  }
}

export async function updateReservation(id: number, data: Partial<Omit<HouseCafeReservation, 'id' | 'created_at'>>): Promise<HouseCafeReservation> {
  try {
    const response = await fetch(`/api/kelompok-6/reservasi?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError('Gagal mengupdate reservasi', response.status);
    }

    const result: HouseCafeReservation[] = await response.json();
    return result[0];

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat mengupdate reservasi');
  }
}

export async function deleteReservation(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/kelompok-6/reservasi?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new ApiError('Gagal menghapus reservasi', response.status);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Terjadi kesalahan saat menghapus reservasi');
  }
}