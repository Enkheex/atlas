import { NextResponse } from 'next/server';

// Define the backend URL from environment variables
// Fallback to localhost if not set (safety net)
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Connect to YOUR Python backend
    const response = await fetch(`${BACKEND_URL}/api/open-classrooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`Backend Error: ${response.status}`);
      return NextResponse.json({ error: 'Failed to fetch data from backend' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST route proxy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Connect to YOUR Python backend
    const response = await fetch(`${BACKEND_URL}/api/open-classrooms`, {
      method: 'GET',
      // 'no-store' is better for real-time availability than 'no-cache'
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Backend Error: ${response.status}`);
      return NextResponse.json({ error: 'Failed to fetch data from backend' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET route proxy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
