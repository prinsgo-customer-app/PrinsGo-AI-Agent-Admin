export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiAgent from '@/models/AiAgent';
import '@/models/AiOrganization';
import '@/models/AiProviderConfig';
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

    if (!['OWNER', 'SUPER_ADMIN', 'ADMIN', 'DEVELOPER'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient role permissions' }, { status: 403 });
    }

    await connectToDatabase();

    const agents = await AiAgent.find({
      workspaceId: { $in: decoded.organizations }
    })
      .sort({ createdAt: -1 })
      .populate('workspaceId', 'name')
      .populate('preferredModel', 'providerName modelName');

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Agents endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
