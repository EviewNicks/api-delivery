import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      'http://www.cvjayatehnik.com/api/recomendations.php',
      {
        headers: {
          'Authorization': 'Bearer Tokengadgethouse',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error('Invalid API response structure');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Kelompok 3 recommendations:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Request timeout',
          message: 'API request took too long to respond'
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to fetch recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
