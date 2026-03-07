// ContentOps Engine — Phase 3: Validation & GEO Scoring

import type { ArticlePayload, GEOScore, ValidationResult } from './types';

// --- Hard fail checks ---

function checkHardFails(article: ArticlePayload): string[] {
  const fails: string[] = [];

  if (article.externalLinkCount < 4) {
    fails.push(`External link count is ${article.externalLinkCount}, minimum is 4`);
  }

  if (article.internalLinkCount < 2) {
    fails.push(`Internal link count is ${article.internalLinkCount}, minimum is 2`);
  }

  if (article.wordCount < 900) {
    fails.push(`Word count is ${article.wordCount}, minimum is 900`);
  }

  if (!article.quickAnswer || article.quickAnswer.trim().length === 0) {
    fails.push('Missing quickAnswer block');
  }

  if (!article.faqBlock || article.faqBlock.length < 5) {
    fails.push(`FAQ block has ${article.faqBlock?.length ?? 0} items, minimum is 5`);
  }

  if (/\s/.test(article.slug)) {
    fails.push('Slug contains spaces');
  }

  if (article.slug !== article.slug.toLowerCase()) {
    fails.push('Slug contains uppercase characters');
  }

  const titleLower = article.title.toLowerCase();
  const keywordLower = article.primaryKeyword.toLowerCase();
  if (!titleLower.includes(keywordLower)) {
    fails.push(`Primary keyword "${article.primaryKeyword}" not found in title "${article.title}"`);
  }

  return fails;
}

// --- Soft fail checks ---

function checkSoftFails(article: ArticlePayload): string[] {
  const fails: string[] = [];

  const metaLen = article.metaDescription.length;
  if (metaLen < 140 || metaLen > 160) {
    fails.push(`Meta description is ${metaLen} characters, recommended range is 140-160`);
  }

  // Count statistics in body — look for patterns like numbers with % or numerals
  const statsPattern = /\d+[\d,.]*\s*(%|percent|billion|million|thousand|trillion)/gi;
  const statsMatches = article.body.match(statsPattern) || [];
  if (statsMatches.length < 3) {
    fails.push(`Found ${statsMatches.length} statistics in body, recommended minimum is 3`);
  }

  return fails;
}

// --- GEO Scoring (0-100) ---

function scoreQuickAnswer(article: ArticlePayload): number {
  // 20 points max
  if (!article.quickAnswer || article.quickAnswer.trim().length === 0) return 0;

  const wordCount = article.quickAnswer.split(/\s+/).filter(Boolean).length;

  // Ideal: 50-75 words
  if (wordCount >= 50 && wordCount <= 75) return 20;
  if (wordCount >= 40 && wordCount <= 85) return 15;
  if (wordCount >= 25) return 10;
  return 5;
}

function scoreStatisticsDensity(article: ArticlePayload): number {
  // 20 points max
  const statsPattern = /\d+[\d,.]*\s*(%|percent|billion|million|thousand|trillion)/gi;
  const matches = article.body.match(statsPattern) || [];
  const count = matches.length;

  if (count >= 5) return 20;
  if (count >= 4) return 16;
  if (count >= 3) return 12;
  if (count >= 2) return 8;
  if (count >= 1) return 4;
  return 0;
}

function scoreQuotableDefinition(article: ArticlePayload): number {
  // 15 points max — check for definition-like patterns
  const definitionPatterns = [
    /\bis\s+(?:defined\s+as|the\s+process\s+of|a\s+(?:method|practice|approach|strategy|technique))/i,
    /\brefers\s+to\b/i,
    /\bmeans\s+(?:that|the)/i,
    /\binvolves\s+/i,
  ];

  let score = 0;
  for (const pattern of definitionPatterns) {
    if (pattern.test(article.body)) {
      score += 5;
    }
    if (score >= 15) break;
  }

  // Bonus for excerpt being quotable (concise, informative)
  if (article.excerpt && article.excerpt.length >= 50 && article.excerpt.length <= 200) {
    score = Math.min(15, score + 5);
  }

  return score;
}

function scoreHeadingStructure(article: ArticlePayload): number {
  // 15 points max
  const h2Matches = article.body.match(/^##\s+/gm) || [];
  const h2Count = h2Matches.length;

  let score = 0;

  // At least 4 H2s
  if (h2Count >= 4) score += 8;
  else if (h2Count >= 3) score += 5;
  else if (h2Count >= 2) score += 3;

  // Check for question-based headings (good for GEO)
  const questionHeadings = article.body.match(/^##\s+.*\?/gm) || [];
  if (questionHeadings.length >= 2) score += 4;
  else if (questionHeadings.length >= 1) score += 2;

  // Check for logical hierarchy (H3s under H2s)
  const h3Matches = article.body.match(/^###\s+/gm) || [];
  if (h3Matches.length > 0) score += 3;

  return Math.min(15, score);
}

function scoreNamedEntityDensity(article: ArticlePayload): number {
  // 10 points max — check for named entities
  const namedEntities = [
    // Organizations
    /\b(?:PCMA|MPI|ASAE|CEIR|IAEE|EventMB|BizBash)\b/g,
    // Locations
    /\b(?:Nashville|Music\s+City|Tennessee|Gaylord\s+Opryland|Music\s+City\s+Center)\b/g,
    // Brand
    /\bJHR\s+Photography\b/g,
    // Proper nouns (capitalized multi-word phrases, rough heuristic)
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
  ];

  let totalMatches = 0;
  for (const pattern of namedEntities) {
    const matches = article.body.match(pattern) || [];
    totalMatches += matches.length;
  }

  if (totalMatches >= 15) return 10;
  if (totalMatches >= 10) return 8;
  if (totalMatches >= 6) return 5;
  if (totalMatches >= 3) return 3;
  return 0;
}

function scoreExternalCitations(article: ArticlePayload): number {
  // 10 points max
  const count = article.externalLinkCount;

  if (count >= 6) return 10;
  if (count >= 5) return 8;
  if (count >= 4) return 6;
  if (count >= 3) return 4;
  if (count >= 2) return 2;
  return 0;
}

function scoreFaqQuality(article: ArticlePayload): number {
  // 10 points max
  if (!article.faqBlock || article.faqBlock.length === 0) return 0;

  let score = 0;

  // Count
  if (article.faqBlock.length >= 7) score += 4;
  else if (article.faqBlock.length >= 5) score += 3;
  else score += 1;

  // Quality: check answer length (should be substantive)
  const avgAnswerLength =
    article.faqBlock.reduce((sum, faq) => sum + faq.answer.split(/\s+/).length, 0) /
    article.faqBlock.length;

  if (avgAnswerLength >= 30) score += 4;
  else if (avgAnswerLength >= 20) score += 3;
  else if (avgAnswerLength >= 10) score += 2;

  // Diversity: questions should be varied
  const uniqueStarts = new Set(
    article.faqBlock.map((faq) => faq.question.split(/\s+/).slice(0, 2).join(' ').toLowerCase())
  );
  if (uniqueStarts.size >= article.faqBlock.length * 0.7) score += 2;

  return Math.min(10, score);
}

function computeGEOScore(article: ArticlePayload): GEOScore {
  const quickAnswerScore = scoreQuickAnswer(article);
  const statisticsDensity = scoreStatisticsDensity(article);
  const quotableDefinition = scoreQuotableDefinition(article);
  const headingStructure = scoreHeadingStructure(article);
  const namedEntityDensity = scoreNamedEntityDensity(article);
  const externalCitations = scoreExternalCitations(article);
  const faqQuality = scoreFaqQuality(article);

  const totalScore =
    quickAnswerScore +
    statisticsDensity +
    quotableDefinition +
    headingStructure +
    namedEntityDensity +
    externalCitations +
    faqQuality;

  return {
    quickAnswerScore,
    statisticsDensity,
    quotableDefinition,
    headingStructure,
    namedEntityDensity,
    externalCitations,
    faqQuality,
    totalScore,
  };
}

// --- Main validation function ---

export async function validateArticle(article: ArticlePayload): Promise<ValidationResult> {
  const hardFails = checkHardFails(article);
  const softFails = checkSoftFails(article);
  const geoScore = computeGEOScore(article);

  // Must pass all hard checks AND meet GEO threshold
  const passed = hardFails.length === 0 && geoScore.totalScore >= 70;

  if (geoScore.totalScore < 70 && hardFails.length === 0) {
    hardFails.push(`GEO score is ${geoScore.totalScore}/100, minimum threshold is 70`);
  }

  return {
    passed,
    hardFails,
    softFails,
    geoScore,
  };
}
