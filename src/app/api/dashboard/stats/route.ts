export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiTask from '@/models/AiTask';
import AiAgent from '@/models/AiAgent';
import AiRepository from '@/models/AiRepository';
import AiProviderConfig from '@/models/AiProviderConfig';
import AiAutomation from '@/models/AiAutomation';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.organizations) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const orgFilter = { workspaceId: { $in: decoded.organizations } };

    const activeTasksCount = await AiTask.countDocuments({ ...orgFilter, state: { $in: ['QUEUED', 'PLANNING', 'RUNNING'] } });
    const pendingApprovalsCount = await AiTask.countDocuments({ ...orgFilter, state: 'WAITING_FOR_APPROVAL' });
    const agentsCount = await AiAgent.countDocuments(orgFilter);
    const connectedReposCount = await AiRepository.countDocuments({ ...orgFilter, status: 'CONNECTED' });
    const connectedProvidersCount = await AiProviderConfig.countDocuments({ ...orgFilter, status: 'ENABLED' });
    const automationsCount = await AiAutomation.countDocuments({ ...orgFilter, status: 'ACTIVE' });

    return NextResponse.json({
      activeTasks: activeTasksCount,
      pendingApprovals: pendingApprovalsCount,
      activeAgents: agentsCount,
      connectedRepos: connectedReposCount,
      connectedProviders: connectedProvidersCount,
      activeAutomations: automationsCount,
    });
  } catch (error) {
    console.error('Stats endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
