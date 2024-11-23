import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add any necessary health checks here
    const health = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Health check failed', error: error.message },
      { status: 503 }
    );
  }
}
