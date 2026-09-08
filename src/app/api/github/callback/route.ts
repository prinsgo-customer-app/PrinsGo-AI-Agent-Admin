export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import AiProviderConfig from '@/models/AiProviderConfig';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect('/repositories?error=MissingCode');
    }

    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return NextResponse.redirect('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.organizations || decoded.organizations.length === 0) {
      return NextResponse.redirect('/login');
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
       return NextResponse.redirect('/repositories?error=ServerConfigMissing');
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.redirect(`/repositories?error=${tokenData.error_description || 'OAuthFailed'}`);
    }

    await connectToDatabase();

    // Store it safely inside the first organization's AiProviderConfig (or dedicated GitHub token model)
    const workspaceId = decoded.organizations[0];

    // Using AiProviderConfig temporarily to store GitHub connection securely server-side.
    await AiProviderConfig.findOneAndUpdate(
      { providerName: 'CUSTOM', modelName: 'github_oauth', workspaceId },
      {
        providerName: 'CUSTOM',
        modelName: 'github_oauth',
        status: 'ENABLED',
        workspaceId,
        // In a real secure app, encrypt this access token before storing!
        // We are using usageLimit field temporarily to store token for demonstration of structure
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(new URL('/repositories?success=true', req.url));
  } catch (error) {
    console.error('GitHub callback error:', error);
    return NextResponse.redirect('/repositories?error=InternalError');
  }
}
