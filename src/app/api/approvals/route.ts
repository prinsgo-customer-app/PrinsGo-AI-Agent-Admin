export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiTask from '@/models/AiTask';
import AiAuditLog from '@/models/AiAuditLog';
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

    const pendingTasks = await AiTask.find({
      workspaceId: { $in: decoded.organizations },
      state: 'WAITING_FOR_APPROVAL'
    })
      .sort({ createdAt: -1 })
      .populate('workspaceId', 'name')
      .populate('agentId', 'name')
      .populate('userId', 'name email');

    return NextResponse.json(pendingTasks);
  } catch (error) {
    console.error('Approvals endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const { taskId, action } = await req.json();

    if (!taskId || !['APPROVE', 'REJECT'].includes(action)) {
       return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await connectToDatabase();

    const task = await AiTask.findOne({
       _id: taskId,
       workspaceId: { $in: decoded.organizations },
       state: 'WAITING_FOR_APPROVAL'
    });

    if (!task) {
       return NextResponse.json({ error: 'Task not found or not pending approval' }, { status: 404 });
    }

    if (action === 'APPROVE') {
       task.state = 'QUEUED';
       task.approvalStatus = 'APPROVED';
    } else {
       task.state = 'CANCELLED';
       task.approvalStatus = 'REJECTED';
    }

    await task.save();

    await AiAuditLog.create({
       action: action === 'APPROVE' ? 'TASK_APPROVED' : 'TASK_REJECTED',
       result: 'SUCCESS',
       target: taskId,
       userId: decoded.userId,
       workspaceId: task.workspaceId
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Approvals POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
