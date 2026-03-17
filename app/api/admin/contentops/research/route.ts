import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';
import { createKnowledgeEntry } from '@/lib/knowledge';

// Allow up to 60s for Perplexity research
export const maxDuration = 60;

/**
 * Format research data as markdown for knowledge base storage
 */
function researchToMarkdown(
  topic: string,
  primaryKeyword: string,
  icpTag: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  research: any
): string {
  const lines: string[] = [
    `# Research: ${topic}`,
    ``,
    `**Primary Keyword:** ${primaryKeyword}`,
    `**ICP Target:** ${icpTag}`,
    `**Researched:** ${new Date().toISOString().split('T')[0]}`,
    ``,
  ];

  if (research.currentStats?.length) {
    lines.push(`## Statistics`, ``);
    for (const s of research.currentStats) {
      lines.push(`- ${s.stat} *(${s.source})*`);
    }
    lines.push(``);
  }

  if (research.localInsights?.length) {
    lines.push(`## Nashville Insights`, ``);
    for (const l of research.localInsights) {
      lines.push(`- ${l.insight} *(${l.source})*`);
    }
    lines.push(``);
  }

  if (research.expertQuotes?.length) {
    lines.push(`## Expert Quotes`, ``);
    for (const q of research.expertQuotes) {
      lines.push(`> "${q.quote}"`);
      lines.push(`> — ${q.attribution}`);
      lines.push(``);
    }
  }

  if (research.authorityLinks?.length) {
    lines.push(`## Authority Links`, ``);
    for (const l of research.authorityLinks) {
      lines.push(`- [${l.title}](${l.url}) — ${l.domain}`);
    }
    lines.push(``);
  }

  if (research.contentGaps?.length) {
    lines.push(`## Content Gaps (Competitive Advantage)`, ``);
    for (const g of research.contentGaps) {
      lines.push(`- ${g}`);
    }
    lines.push(``);
  }

  if (research.geoAnswerFragments?.length) {
    lines.push(`## GEO Answer Fragments`, ``);
    for (const f of research.geoAnswerFragments) {
      lines.push(`**Q: ${f.question}**`);
      lines.push(`${f.answer}`);
      lines.push(``);
    }
  }

  if (research.relatedQuestions?.length) {
    lines.push(`## Related Questions`, ``);
    for (const q of research.relatedQuestions) {
      lines.push(`- ${q}`);
    }
    lines.push(``);
  }

  if (research.topicClusterKeywords?.length) {
    lines.push(`## Topic Cluster Keywords`, ``);
    lines.push(research.topicClusterKeywords.join(', '));
    lines.push(``);
  }

  if (research.competitorUrls?.length) {
    lines.push(`## Competitor URLs (currently ranking)`, ``);
    for (const u of research.competitorUrls) {
      lines.push(`- ${u}`);
    }
    lines.push(``);
  }

  return lines.join('\n');
}

/**
 * POST /api/admin/contentops/research — Run Phase 1 research + save to knowledge base
 *
 * Body: { topic: string, icpTag: string, primaryKeyword: string }
 * Response: { research: ResearchPayload, competitorContext?, knowledgeId? } or { error: string }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, icpTag, primaryKeyword } = body;

    if (!topic || !icpTag || !primaryKeyword) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, icpTag, primaryKeyword' },
        { status: 400 }
      );
    }

    const result = await runResearch(topic, icpTag, primaryKeyword);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Save research to knowledge base — fire and forget (don't block response)
    // This runs in background; we return a placeholder and update async
    let knowledgeId: string | null = null;
    const knowledgeSave = (async () => {
      try {
        const markdown = researchToMarkdown(topic, primaryKeyword, icpTag, result.data);
        const entry = await createKnowledgeEntry({
          title: `Research: ${topic}`,
          content: markdown,
          category: 'Document',
          tags: ['contentops-research', icpTag, primaryKeyword, 'auto-generated'],
        });
        return entry.id;
      } catch (knErr) {
        console.warn('[ContentOps] Failed to save research to knowledge base:', knErr);
        return null;
      }
    })();

    // Race the knowledge save against a 3s timeout — return response either way
    try {
      knowledgeId = await Promise.race([
        knowledgeSave,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3_000)),
      ]);
    } catch {
      // ignore — knowledge save is best-effort
    }

    return NextResponse.json({
      research: result.data,
      provider: result.provider || 'unknown',
      knowledgeId,
    });
  } catch (error) {
    console.error('ContentOps research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research phase failed' },
      { status: 500 }
    );
  }
}
