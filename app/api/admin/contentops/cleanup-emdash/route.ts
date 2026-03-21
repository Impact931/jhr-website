import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';

/**
 * POST /api/admin/contentops/cleanup-emdash
 *
 * One-time cleanup: replaces all em-dashes (—) with spaced hyphens ( - )
 * in body, excerpt, quickAnswer, and metaDescription across all articles.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { slug: string; status: string; replacements: number }[] = [];

  for (const sk of ['published', 'draft'] as const) {
    const articles = await listBlogs(sk);

    for (const summary of articles) {
      const full = await getBlogContent(summary.slug, sk);
      if (!full) continue;

      let count = 0;
      const countAndReplace = (text: string | undefined): string | undefined => {
        if (!text) return text;
        const matches = text.match(/—/g);
        if (matches) count += matches.length;
        return text.replace(/—/g, ' - ');
      };

      const cleanBody = countAndReplace(full.body);
      const cleanExcerpt = countAndReplace(full.excerpt);
      const cleanQuickAnswer = countAndReplace(full.quickAnswer);

      if (count === 0) {
        results.push({ slug: summary.slug, status: `${sk}-no-changes`, replacements: 0 });
        continue;
      }

      await saveBlogPost(
        {
          slug: full.slug,
          title: full.title,
          body: cleanBody,
          excerpt: cleanExcerpt,
          quickAnswer: cleanQuickAnswer,
          sections: full.sections,
          featuredImage: full.featuredImage,
          author: full.author,
          tags: full.tags,
          categories: full.categories,
          seo: full.seo,
          seoMetadata: full.seoMetadata,
          structuredData: full.structuredData,
          geoMetadata: full.geoMetadata,
        },
        sk
      );

      results.push({ slug: summary.slug, status: `${sk}-cleaned`, replacements: count });
    }
  }

  const totalReplacements = results.reduce((sum, r) => sum + r.replacements, 0);
  return NextResponse.json({
    message: `Cleaned ${totalReplacements} em-dashes across ${results.filter(r => r.replacements > 0).length} articles`,
    results,
  });
}
