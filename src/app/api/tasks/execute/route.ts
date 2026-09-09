export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiTask from '@/models/AiTask';
import AiIntegration from '@/models/AiIntegration';
import AiAuditLog from '@/models/AiAuditLog';
import AiAgent from '@/models/AiAgent';
import { verifyToken } from '@/lib/auth';
import { HermesClient } from '@/lib/hermesClient';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token) as { userId?: string, organizations?: string[], role?: string } | null;
    if (!decoded || !decoded.userId || !decoded.organizations) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { agentId, description } = await req.json();

    if (!agentId || !description) {
      return NextResponse.json({ error: 'Agent ID and description are required' }, { status: 400 });
    }

    await connectToDatabase();

    const agent = await AiAgent.findOne({
      _id: agentId,
      workspaceId: { $in: decoded.organizations }
    });

    if (!agent) {
       return NextResponse.json({ error: 'Agent not found or access denied' }, { status: 404 });
    }

    // Determine approval requirement based on risk or tools
    // Assuming a simple logic: "destroy", "delete", "commit" keywords require approval
    const requiresApproval = /delete|destroy|commit|production/i.test(description);

    const task = new AiTask({
       description,
       state: requiresApproval ? 'WAITING_FOR_APPROVAL' : 'QUEUED',
       userId: decoded.userId,
       workspaceId: agent.workspaceId,
       agentId: agent._id,
       toolsUsed: [],
       createdAt: new Date(),
       updatedAt: new Date()
    });

    await task.save();

    await AiAuditLog.create({
       action: 'TASK_CREATED',
       result: 'SUCCESS',
       target: task._id,
       userId: decoded.userId,
       agentId: agent._id,
       workspaceId: agent.workspaceId,
       createdAt: new Date()
    });

    if (task.state === 'WAITING_FOR_APPROVAL') {
       return NextResponse.json({ message: 'Task requires approval', task });
    }

    // Transition to RUNNING
    task.state = 'RUNNING';
    task.startedAt = new Date();
    await task.save();

    // Check Hermes integration
    const hermesIntegrations = await AiIntegration.find({
       workspaceId: agent.workspaceId,
       name: 'Hermes'
    });

    if (hermesIntegrations.length === 0 || hermesIntegrations[0].status !== 'CONNECTED') {
       task.state = 'FAILED';
       task.error = 'Hermes execution blocked: Integration is not connected or configured properly.';
       task.completedAt = new Date();
       await task.save();

       await AiAuditLog.create({
          action: 'TASK_FAILED',
          result: 'FAILURE',
          target: task._id,
          userId: decoded.userId,
          agentId: agent._id,
          workspaceId: agent.workspaceId,
          createdAt: new Date()
       });

       return NextResponse.json({ error: task.error, task }, { status: 503 });
    }

    const hermes = hermesIntegrations[0];
    const client = new HermesClient(hermes.config.baseUrl, hermes.config.apiKey);

    try {
       const result = await client.executeTask(agent.systemInstructions, description, []);

       task.state = 'COMPLETED';
       task.result = JSON.stringify(result);
       task.completedAt = new Date();
       await task.save();

       await AiAuditLog.create({
          action: 'TASK_COMPLETED',
          result: 'SUCCESS',
          target: task._id,
          userId: decoded.userId,
          agentId: agent._id,
          workspaceId: agent.workspaceId,
          createdAt: new Date()
       });

       return NextResponse.json({ message: 'Task executed successfully', task });
    } catch (e: unknown) {
       task.state = 'FAILED';
       task.error = `Hermes execution failed: ${(e as Error).message}`;
       task.completedAt = new Date();
       await task.save();

       await AiAuditLog.create({
          action: 'TASK_FAILED',
          result: 'FAILURE',
          target: task._id,
          userId: decoded.userId,
          agentId: agent._id,
          workspaceId: agent.workspaceId,
          createdAt: new Date()
       });

       return NextResponse.json({ error: task.error, task }, { status: 500 });
    }

  } catch (error) {
    console.error('Task execute endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
