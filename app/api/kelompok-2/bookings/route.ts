import { NextRequest, NextResponse } from 'next/server';

const TRIPNESIA_API_BASE = 'https://tripnesia-vm51.vercel.app/api/bookings';
const TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const id = searchParams.get('id');

    let url = `${TRIPNESIA_API_BASE}?action=${action}`;
    if (id) {
      url += `&id=${id}`;
    }

    const response = await fetchWithTimeout(url);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Tripnesia API GET error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch bookings', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetchWithTimeout(`${TRIPNESIA_API_BASE}?action=create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Tripnesia API POST error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create booking', code: 'CREATE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: { message: 'Booking ID is required', code: 'MISSING_ID' } },
        { status: 400 }
      );
    }

    const body = await request.json();

    const response = await fetchWithTimeout(`${TRIPNESIA_API_BASE}?action=update&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Tripnesia API PUT error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to update booking', code: 'UPDATE_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: { message: 'Booking ID is required', code: 'MISSING_ID' } },
        { status: 400 }
      );
    }

    const response = await fetchWithTimeout(`${TRIPNESIA_API_BASE}?action=delete&id=${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Tripnesia API DELETE error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to delete booking', code: 'DELETE_ERROR' } },
      { status: 500 }
    );
  }
}
