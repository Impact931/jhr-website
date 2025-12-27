import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('editor_session');

  if (!session?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Basic validation - check if session token is valid format
  try {
    const decoded = Buffer.from(session.value, 'base64').toString();
    if (decoded.startsWith('editor:')) {
      return NextResponse.json({ authenticated: true });
    }
  } catch {
    // Invalid token format
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
