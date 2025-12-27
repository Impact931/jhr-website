import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAIEdit, AI_QUICK_ACTIONS, type AIQuickAction } from '@/lib/openai';

// Verify editor session
async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('editor_session');

  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, 'base64').toString();
    return decoded.startsWith('editor:');
  } catch {
    return false;
  }
}

// POST - Generate AI-edited content
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentContent, instruction, quickAction, contentType, context } = await request.json();

    if (!currentContent) {
      return NextResponse.json({ error: 'currentContent is required' }, { status: 400 });
    }

    // Use quick action instruction if provided, otherwise use custom instruction
    let finalInstruction = instruction;
    if (quickAction && AI_QUICK_ACTIONS[quickAction as AIQuickAction]) {
      finalInstruction = AI_QUICK_ACTIONS[quickAction as AIQuickAction];
    }

    if (!finalInstruction) {
      return NextResponse.json({ error: 'instruction or quickAction is required' }, { status: 400 });
    }

    const result = await generateAIEdit({
      currentContent,
      instruction: finalInstruction,
      contentType: contentType || 'paragraph',
      context,
    });

    return NextResponse.json({
      newContent: result.newContent,
      explanation: result.explanation,
    });
  } catch (error) {
    console.error('Error generating AI edit:', error);
    return NextResponse.json({ error: 'Failed to generate AI edit' }, { status: 500 });
  }
}

// GET - Return available quick actions
export async function GET() {
  return NextResponse.json({
    quickActions: Object.entries(AI_QUICK_ACTIONS).map(([key, description]) => ({
      key,
      description,
    })),
  });
}
