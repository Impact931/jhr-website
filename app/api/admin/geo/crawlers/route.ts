import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const SITE_URL = process.env.SITE_URL || 'https://jhr-photography.com';

interface CrawlerStatus {
  name: string;
  status: 'allowed' | 'blocked' | 'not-specified';
  fixLine?: string;
}

const AI_CRAWLERS = [
  { name: 'GPTBot', agent: 'GPTBot' },
  { name: 'ClaudeBot', agent: 'ClaudeBot' },
  { name: 'PerplexityBot', agent: 'PerplexityBot' },
  { name: 'Google-Extended', agent: 'Google-Extended' },
  { name: 'Bingbot', agent: 'Bingbot' },
];

function parseRobotsTxt(robotsTxt: string): CrawlerStatus[] {
  const lines = robotsTxt.split('\n').map((l) => l.trim());
  const results: CrawlerStatus[] = [];

  for (const crawler of AI_CRAWLERS) {
    // Find sections for this user agent
    let found = false;
    let blocked = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line === `user-agent: ${crawler.agent.toLowerCase()}`) {
        found = true;
        // Check subsequent lines until next user-agent or end
        for (let j = i + 1; j < lines.length; j++) {
          const directive = lines[j].toLowerCase().trim();
          if (directive.startsWith('user-agent:')) break;
          if (directive === 'disallow: /') {
            blocked = true;
            break;
          }
          if (directive === 'allow: /') {
            break;
          }
        }
        break;
      }
    }

    // Also check wildcard user-agent blocks
    if (!found) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line === 'user-agent: *') {
          for (let j = i + 1; j < lines.length; j++) {
            const directive = lines[j].toLowerCase().trim();
            if (directive.startsWith('user-agent:')) break;
            if (directive === 'disallow: /') {
              // Wildcard blocks everything, but specific allow overrides
              if (!found) {
                blocked = true;
              }
              break;
            }
          }
        }
      }
    }

    const status: CrawlerStatus = {
      name: crawler.name,
      status: found ? (blocked ? 'blocked' : 'allowed') : (blocked ? 'blocked' : 'not-specified'),
    };

    if (status.status === 'blocked') {
      status.fixLine = `User-agent: ${crawler.agent}\nAllow: /`;
    } else if (status.status === 'not-specified') {
      status.fixLine = `User-agent: ${crawler.agent}\nAllow: /`;
    }

    results.push(status);
  }

  return results;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${SITE_URL}/robots.txt`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({
        crawlers: AI_CRAWLERS.map((c) => ({
          name: c.name,
          status: 'not-specified' as const,
          fixLine: `User-agent: ${c.agent}\nAllow: /`,
        })),
        robotsTxtFound: false,
        rawRobotsTxt: null,
      });
    }

    const robotsTxt = await res.text();
    const crawlers = parseRobotsTxt(robotsTxt);

    return NextResponse.json({
      crawlers,
      robotsTxtFound: true,
      rawRobotsTxt: robotsTxt,
    });
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    return NextResponse.json({ error: 'Failed to fetch robots.txt' }, { status: 500 });
  }
}
