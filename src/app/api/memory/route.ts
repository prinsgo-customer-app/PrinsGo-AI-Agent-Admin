export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiMemory from '@/models/AiMemory';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token) as { userId?: string, organizations?: string[], role?: string } | null;
    if (!decoded || !decoded.userId || !decoded.organizations) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(decoded.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const memories = await AiMemory.find({
      workspaceId: { $in: decoded.organizations }
    })
      .sort({ createdAt: -1 })
      .populate('workspaceId', 'name')
      .populate('userId', 'name email');

    return NextResponse.json(memories);
  } catch (error) {
    console.error('Memory endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
