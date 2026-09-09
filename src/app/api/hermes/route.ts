export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import AiIntegration from '@/models/AiIntegration';
import { verifyToken } from '@/lib/auth';
import { HermesClient } from '@/lib/hermesClient';

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

    const hermesIntegrations = await AiIntegration.find({
      workspaceId: { $in: decoded.organizations },
      name: 'Hermes'
    });

    let dbStatus = 'NOT CONFIGURED';
    let runtimeStatus = 'BLOCKED';
    let message = 'Hermes integration requires external deployment of the actual Hermes Agent runtime (https://github.com/NousResearch/hermes-agent). The execution environment is currently BLOCKED pending proper backend configuration.';

    if (hermesIntegrations.length > 0) {
      const hermes = hermesIntegrations[0];
      dbStatus = hermes.status;

      if (hermes.status === 'CONNECTED' && hermes.config?.baseUrl) {
         const client = new HermesClient(hermes.config.baseUrl, hermes.config.apiKey);
         const connectionTest = await client.testConnection();
         runtimeStatus = connectionTest.status;
         message = connectionTest.message;
      } else if (hermes.status === 'DISABLED') {
         runtimeStatus = 'DISABLED';
         message = 'Hermes is administratively disabled.';
      }
    }

    // Fallback block if runtime doesn't respond
    if (runtimeStatus === 'BLOCKED' || runtimeStatus === 'ERROR') {
       runtimeStatus = 'BLOCKED';
       message = 'Hermes integration requires external deployment of the actual Hermes Agent runtime (https://github.com/NousResearch/hermes-agent). Ensure `baseUrl` is correctly configured in integration settings.';
    }

    return NextResponse.json({
      status: runtimeStatus,
      message: message
    });
  } catch (error) {
    console.error('Hermes endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
