import { NextResponse } from 'next/server';

const CAFEKU_BASE_URL = 'https://dodgerblue-monkey-417412.hostingersite.com/api';

export async function GET() {
  try {
    const response = await fetch(`${CAFEKU_BASE_URL}/menu`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch menu data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Cafeku menu:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
