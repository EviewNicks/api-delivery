import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://rsjauhzcwslcsoktbplq.supabase.co/rest/v1/reservasi';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzamF1aHpjd3NsY3Nva3RicGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjI3NzUsImV4cCI6MjA3NDg5ODc3NX0.EPNgXjJxtKRyPiWVXGm79aWBEV4rQiNolsR7n5sa_p8';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let queryUrl = SUPABASE_URL;
    if (id) {
      queryUrl += `?id=eq.${id}`;
    }

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'apikey': API_TOKEN,
        'authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('K6 API Proxy GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations from House Cafe API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        'apikey': API_TOKEN,
        'authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase POST error:', errorData);
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('K6 API Proxy POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const queryUrl = `${SUPABASE_URL}?id=eq.${id}`;

    const response = await fetch(queryUrl, {
      method: 'PATCH',
      headers: {
        'apikey': API_TOKEN,
        'authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase PATCH error:', errorData);
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('K6 API Proxy PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
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
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const queryUrl = `${SUPABASE_URL}?id=eq.${id}`;

    const response = await fetch(queryUrl, {
      method: 'DELETE',
      headers: {
        'apikey': API_TOKEN,
        'authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase DELETE error:', errorData);
      throw new Error(`Supabase API error: ${response.status}`);
    }

    return NextResponse.json(
      { success: true, message: 'Reservation deleted successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );

  } catch (error) {
    console.error('K6 API Proxy DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
