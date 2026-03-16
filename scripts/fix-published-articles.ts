/**
 * Fix Published Articles — Converts markdown body to HTML, adds SEO metadata
 *
 * Usage: npx tsx scripts/fix-published-articles.ts
 *
 * Fixes:
 * 1. Converts markdown body content to HTML
 * 2. Populates seoMetadata field from seo field
 * 3. Adds structuredData for JSON-LD
 * 4. Re-publishes fixed versions
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { getBlogContent, saveBlogPost, publishBlog, listBlogs } from '../lib/blog-content';
import type { PageSectionContent } from '../types/inline-editor';

/**
 * Convert markdown to HTML.
 * Handles: headings, bold, italic, links, lists, blockquotes, paragraphs.
 */
function markdownToHtml(md: string): string {
  if (!md) return '';

  // If it already has HTML tags, return as-is
  if (/<(?:h[1-6]|p|ul|ol|li|a|div|section|blockquote|strong|em)\b/i.test(md)) {
    return md;
  }

  let html = md;

  // Headings (### before ##)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Internal links (no https)
  html = html.replace(
    /\[([^\]]+)\]\((\/?[^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Unordered lists
  html = html.replace(/^(?:- |\* )(.+)$/gm, '<li>$1</li>');
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> tags in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

  // FAQ formatting: **Q: ...** and A: ...
  html = html.replace(/<strong>Q:\s*(.+?)<\/strong>/g, '<strong>Q: $1</strong>');

  // Wrap remaining plain text lines in <p> tags
  const lines = html.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('</ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('</ol') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('</blockquote') ||
      trimmed.startsWith('<p') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith('<section') ||
      trimmed.startsWith('<a ')
    ) {
      result.push(trimmed);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }

  return result.join('\n');
}

async function main() {
  console.log('='.repeat(80));
  console.log('JHR Photography — Fix Published Articles');
  console.log('='.repeat(80));

  // Verify AWS credentials
  if (!process.env.CUSTOM_AWS_ACCESS_KEY_ID && !process.env.AWS_ACCESS_KEY_ID) {
    console.error('ERROR: Missing AWS credentials in .env');
    process.exit(1);
  }

  // List all blog posts
  const allBlogs = await listBlogs();
  console.log(`Found ${allBlogs.length} total blog posts\n`);

  const contentOpsArticles = allBlogs.filter(
    (b) => b.tags?.includes('contentops-generated')
  );
  console.log(`Found ${contentOpsArticles.length} ContentOps-generated articles to fix\n`);

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const summary of contentOpsArticles) {
    const slug = summary.slug;
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Processing: ${slug}`);

    try {
      // Get draft version (source of truth)
      const draft = await getBlogContent(slug, 'draft');
      if (!draft) {
        console.log(`  No draft found, skipping`);
        skipped++;
        continue;
      }

      const sections = draft.sections || [];
      let needsUpdate = false;

      // Fix each text-block section
      const fixedSections: PageSectionContent[] = sections.map((section) => {
        if (section.type === 'text-block') {
          const content = (section as { content?: string }).content || '';
          // Check if content has markdown indicators (## headings, [links](url), **bold**)
          const hasMarkdown =
            /^#{1,3} /m.test(content) ||
            /\[.+\]\(.+\)/.test(content) ||
            /\*\*.+\*\*/.test(content);
          const hasHtml = /<(?:h[1-6]|p|ul|ol|li|a)\b/i.test(content);

          if (hasMarkdown && !hasHtml) {
            console.log(`  Converting markdown to HTML in text-block section`);
            const htmlContent = markdownToHtml(content);
            needsUpdate = true;
            return { ...section, content: htmlContent } as PageSectionContent;
          }
        }
        return section;
      });

      // Build seoMetadata from seo field if missing
      const existingSeoMeta = draft.seoMetadata;
      const existingSeo = draft.seo as {
        pageTitle?: string;
        metaDescription?: string;
        ogTitle?: string;
        ogDescription?: string;
      } | undefined;

      let seoMetadata = existingSeoMeta;
      if (!existingSeoMeta?.metaTitle && existingSeo) {
        console.log(`  Adding seoMetadata from seo field`);
        seoMetadata = {
          metaTitle: existingSeo.pageTitle || draft.title,
          metaDescription: existingSeo.metaDescription || draft.excerpt || '',
          keywords: draft.tags?.filter((t) => t !== 'contentops-generated') || [],
          ogTitle: existingSeo.ogTitle || draft.title,
          ogDescription: existingSeo.ogDescription || existingSeo.metaDescription || draft.excerpt || '',
        };
        needsUpdate = true;
      }

      // Build structuredData if missing
      let structuredData = draft.structuredData;
      if (!structuredData?.headline) {
        console.log(`  Adding structuredData`);
        structuredData = {
          headline: draft.title,
          datePublished: draft.publishedAt || draft.createdAt,
          author: draft.author || 'Jayson Rivas',
          publisher: 'JHR Photography',
          description: draft.excerpt || draft.title,
        };
        needsUpdate = true;
      }

      if (!needsUpdate) {
        console.log(`  Already in good shape, skipping`);
        skipped++;
        continue;
      }

      // Save updated draft
      console.log(`  Saving fixed draft...`);
      await saveBlogPost(
        {
          slug,
          title: draft.title,
          sections: fixedSections,
          excerpt: draft.excerpt,
          author: draft.author,
          tags: draft.tags,
          categories: draft.categories,
          seo: existingSeo as { pageTitle: string; metaDescription: string; ogTitle: string; ogDescription: string },
          seoMetadata,
          structuredData,
        },
        'draft',
        'admin@jhr-photography.com'
      );

      // Re-publish
      console.log(`  Re-publishing...`);
      await publishBlog(slug, 'admin@jhr-photography.com');

      console.log(`  FIXED ✓`);
      fixed++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: ${msg}`);
      errors++;
    }
  }

  // Also fix any non-contentops articles that might have issues
  const otherArticles = allBlogs.filter(
    (b) => !b.tags?.includes('contentops-generated')
  );
  if (otherArticles.length > 0) {
    console.log(`\n\nAlso checking ${otherArticles.length} other articles...`);
    for (const summary of otherArticles) {
      const draft = await getBlogContent(summary.slug, 'published');
      if (draft?.seoMetadata || !draft?.seo) continue;
      console.log(`  ${summary.slug} — would benefit from seoMetadata migration (skipping non-contentops)`);
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`DONE — Fixed: ${fixed}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log('='.repeat(80));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
