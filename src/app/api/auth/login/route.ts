export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

const PRINSGO_BACKEND_URL = process.env.PRINSGO_BACKEND_URL || 'https://prinsgo-backend.onrender.com';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const response = await fetch(`${PRINSGO_BACKEND_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { error: data.message || 'Authentication failed' },
        { status: response.status || 401 }
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      user: data.admin,
    });

    nextResponse.cookies.set('admin_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days based on backend expiresIn
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
