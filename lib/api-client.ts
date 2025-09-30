import type { Product, ProductListResponse } from './types';

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