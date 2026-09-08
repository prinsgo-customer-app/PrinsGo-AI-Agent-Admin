export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import AiUser from '@/models/AiUser';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await AiUser.findOne({ email, status: 'ACTIVE' });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials or disabled account' }, { status: 401 });
    }

    // Since we're bridging to existing DB but we need to check, if passwordHash is missing we might need a fallback.
    // Assuming standard bcrypt usage.
    const isMatch = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    user.lastActivityAt = new Date();
    await user.save();

    const token = signToken({
      userId: user._id,
      role: user.role,
      organizations: user.organizations,
    });

    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HttpOnly cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
