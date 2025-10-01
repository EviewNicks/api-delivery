import type {
  Product,
  ProductListResponse,
  GadgetRecommendationsResponse,
  GadgetProductEnriched,
  KrusitMenuListResponse,
  KrusitMenuItem,
  KrusitMenuItemEnriched
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