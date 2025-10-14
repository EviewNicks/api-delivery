import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://projekkelompok4-production.up.railway.app';
const TIMEOUT = 10000;

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}/api/minuman`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch minuman data', status: response.status },
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
