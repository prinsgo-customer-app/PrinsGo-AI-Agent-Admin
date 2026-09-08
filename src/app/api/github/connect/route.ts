export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'GitHub OAuth is not configured on the server.' }, { status: 500 });
  }

  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/github/callback`);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;

  return NextResponse.redirect(githubAuthUrl);
}
