export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiRepository from '@/models/AiRepository';
import '@/models/AiOrganization';
import mongoose from 'mongoose';
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

    const repos = await AiRepository.find({
      workspaceId: { $in: decoded.organizations }
    })
      .sort({ createdAt: -1 })
      .populate('workspaceId', 'name');

    // Also check if GitHub is actually connected in this workspace
    const githubConfig = await mongoose.model('AiProviderConfig').findOne({
      providerName: 'CUSTOM',
      modelName: 'github_oauth',
      workspaceId: { $in: decoded.organizations },
      status: 'ENABLED'
    });

    return NextResponse.json({
      repos,
      isGithubConnected: !!githubConfig,
    });
  } catch (error) {
    console.error('Repositories endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
