/**
 * Strip duplicate FAQ from article body content.
 * The FAQ is already rendered as a separate section — remove it from the body HTML.
 *
 * Usage: npx tsx scripts/strip-body-faq.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { getBlogContent, saveBlogPost, publishBlog, listBlogs } from '../lib/blog-content';
import type { PageSectionContent } from '../types/inline-editor';

/**
 * Remove FAQ section from HTML body content.
 * Looks for patterns like:
 * - <h2>Frequently Asked Questions</h2> ... (to end)
 * - <h3>Frequently Asked Questions</h3> ... (to end)
 * - ### Frequently Asked Questions (markdown leftover)
 */
function stripFaqFromBody(html: string): { cleaned: string; hadFaq: boolean } {
  if (!html) return { cleaned: html, hadFaq: false };

  // Match <h2> or <h3> FAQ heading and everything after it
  const faqPatterns = [
    // HTML headings
    /<h[23]>\s*Frequently Asked Questions\s*<\/h[23]>[\s\S]*$/i,
    // Markdown heading that survived conversion
    /#{2,3}\s*Frequently Asked Questions[\s\S]*$/im,
    // Bold FAQ heading
    /<p><strong>Frequently Asked Questions<\/strong><\/p>[\s\S]*$/i,
  ];

  for (const pattern of faqPatterns) {
    if (pattern.test(html)) {
      const cleaned = html.replace(pattern, '').trim();
      return { cleaned, hadFaq: true };
    }
  }

  return { cleaned: html, hadFaq: false };
}

async function main() {
  console.log('='.repeat(80));
  console.log('Strip Duplicate FAQ from Article Bodies');
  console.log('='.repeat(80));

  if (!process.env.CUSTOM_AWS_ACCESS_KEY_ID && !process.env.AWS_ACCESS_KEY_ID) {
    console.error('ERROR: Missing AWS credentials in .env');
    process.exit(1);
  }

  const allBlogs = await listBlogs();
  const contentOpsArticles = allBlogs.filter(b => b.tags?.includes('contentops-generated'));
  console.log(`Found ${contentOpsArticles.length} ContentOps articles\n`);

  let fixed = 0;

  for (const summary of contentOpsArticles) {
    const slug = summary.slug;
    console.log(`\nChecking: ${slug}`);

    const draft = await getBlogContent(slug, 'draft');
    if (!draft) {
      console.log('  No draft, skipping');
      continue;
    }

    const sections = draft.sections || [];
    const hasFaqSection = sections.some(s => s.type === 'faq');

    if (!hasFaqSection) {
      console.log('  No separate FAQ section — keeping body FAQ');
      continue;
    }

    let bodyChanged = false;
    const fixedSections: PageSectionContent[] = sections.map(section => {
      if (section.type === 'text-block') {
        const content = (section as { content?: string }).content || '';
        const { cleaned, hadFaq } = stripFaqFromBody(content);
        if (hadFaq) {
          bodyChanged = true;
          console.log(`  Stripped FAQ from body (removed ${content.length - cleaned.length} chars)`);
          return { ...section, content: cleaned } as PageSectionContent;
        }
      }
      return section;
    });

    if (!bodyChanged) {
      console.log('  No FAQ found in body');
      continue;
    }

    // Save and republish
    await saveBlogPost(
      {
        slug,
        title: draft.title,
        sections: fixedSections,
        excerpt: draft.excerpt,
        author: draft.author,
        tags: draft.tags,
        categories: draft.categories,
        seoMetadata: draft.seoMetadata,
        structuredData: draft.structuredData,
      },
      'draft',
      'admin@jhr-photography.com'
    );
    await publishBlog(slug, 'admin@jhr-photography.com');
    console.log(`  FIXED & republished ✓`);
    fixed++;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Done — ${fixed} articles updated`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
