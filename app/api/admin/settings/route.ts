import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSettings, updateSettings, DEFAULT_SEO_GEO_PROMPT, getPresetPrompt } from '@/lib/settings';
import type { SiteSettings } from '@/lib/settings';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSettings();
    return NextResponse.json({
      settings,
      defaultPrompt: DEFAULT_SEO_GEO_PROMPT,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Partial<SiteSettings> = await request.json();
    const settings = await updateSettings(body);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Load a preset SEO/GEO prompt
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preset } = body;

    if (!preset) {
      return NextResponse.json(
        { error: 'Preset name is required' },
        { status: 400 }
      );
    }

    const prompt = getPresetPrompt(preset);
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid preset name' },
        { status: 400 }
      );
    }

    return NextResponse.json({ prompt, preset });
  } catch (error) {
    console.error('Error loading preset:', error);
    return NextResponse.json(
      { error: 'Failed to load preset' },
      { status: 500 }
    );
  }
}
