export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiAuditLog from '@/models/AiAuditLog';
import '@/models/AiUser';
import '@/models/AiOrganization';
import '@/models/AiAgent';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId || !decoded.organizations) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const logs = await AiAuditLog.find({
      workspaceId: { $in: decoded.organizations }
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name email')
      .populate('workspaceId', 'name')
      .populate('agentId', 'name');

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Audit logs endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
