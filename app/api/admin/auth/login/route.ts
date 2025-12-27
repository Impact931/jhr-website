import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const editorPassword = process.env.EDITOR_PASSWORD;

    if (!editorPassword) {
      console.error('EDITOR_PASSWORD not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password !== editorPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create a simple session token
    const sessionToken = Buffer.from(`editor:${Date.now()}:${Math.random().toString(36)}`).toString('base64');

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('editor_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
