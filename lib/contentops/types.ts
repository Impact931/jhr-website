// ContentOps Engine — Type definitions

export type ICPTag = 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4';

export type ArticleStatus = 'draft' | 'review' | 'approved' | 'published';

export interface ContentOpsConfig {
  topic: string;
  primaryKeyword: string;
  icpTag: ICPTag;
  articleType: string;
  wordCountTarget: number;
  ctaPath: string;
}

export interface ResearchPayload {
  currentStats: Array<{
    stat: string;
    source: string;
  }>;
  authorityLinks: Array<{
    url: string;
    title: string;
    domain: string;
  }>;
  expertQuotes: Array<{
    quote: string;
    attribution: string;
  }>;
  relatedQuestions: string[];
  competitorUrls: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LinkAuditItem {
  url: string;
  anchorText: string;
  type: 'internal' | 'external';
  status: 'valid' | 'broken' | 'unchecked';
}

export interface OpenGraphData {
  title: string;
  description: string;
  image?: string;
  type: string;
}

export interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface ArticlePayload {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  body: string; // markdown
  wordCount: number;
  readTime: number;
  icpTag: ICPTag;
  primaryKeyword: string;
  secondaryKeywords: string[];
  faqBlock: FAQItem[];
  linkAudit: LinkAuditItem[];
  linkAuditStatus: 'pending' | 'passed' | 'failed';
  externalLinkCount: number;
  internalLinkCount: number;
  schemaMarkup: SchemaMarkup;
  openGraph: OpenGraphData;
  status: ArticleStatus;
}

export interface GEOScore {
  quickAnswerScore: number;
  statisticsDensity: number;
  quotableDefinition: number;
  headingStructure: number;
  namedEntityDensity: number;
  externalCitations: number;
  faqQuality: number;
  totalScore: number;
}

export interface ValidationResult {
  passed: boolean;
  hardFails: string[];
  softFails: string[];
  geoScore: GEOScore;
}
