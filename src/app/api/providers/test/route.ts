export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId || !decoded.organizations) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json();
    const { providerName, apiKey } = payload;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is required to test connection.' }, { status: 400 });
    }

    let isSuccess = false;
    let message = 'Connection failed';

    // In a real production setup, we test against the actual API URL.
    if (providerName === 'GEMINI') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (response.ok) {
        isSuccess = true;
        message = 'Connection successful!';
      } else {
        const errorData = await response.json();
        message = `Connection failed: ${errorData.error?.message || 'Invalid API Key'}`;
      }
    } else if (providerName === 'OPENAI') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (response.ok) {
        isSuccess = true;
        message = 'Connection successful!';
      } else {
        const errorData = await response.json();
        message = `Connection failed: ${errorData.error?.message || 'Invalid API Key'}`;
      }
    } else {
      return NextResponse.json({ error: 'Unsupported provider for testing.' }, { status: 400 });
    }

    if (isSuccess) {
      return NextResponse.json({ success: true, message });
    } else {
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } catch (error) {
    console.error('Provider test error:', error);
    return NextResponse.json({ error: 'Internal server error during connection test.' }, { status: 500 });
  }
}
