import type { NotionBlock } from '@/lib/notion';
import type { SOWBlock, RichTextSpan, RichTextAnnotation } from './types';

const DEFAULT_ANNOTATIONS: RichTextAnnotation = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  color: 'default',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseRichText(richTextArray: any[] | undefined): RichTextSpan[] {
  if (!richTextArray || !Array.isArray(richTextArray)) return [];
  return richTextArray.map((item) => ({
    text: item.plain_text || '',
    annotations: item.annotations
      ? {
          bold: item.annotations.bold || false,
          italic: item.annotations.italic || false,
          underline: item.annotations.underline || false,
          strikethrough: item.annotations.strikethrough || false,
          color: item.annotations.color || 'default',
        }
      : { ...DEFAULT_ANNOTATIONS },
    ...(item.href ? { href: item.href } : {}),
  }));
}

type SOWBlockType = SOWBlock['type'];

const SUPPORTED_TYPES: Record<string, SOWBlockType> = {
  heading_1: 'heading_1',
  heading_2: 'heading_2',
  heading_3: 'heading_3',
  paragraph: 'paragraph',
  bulleted_list_item: 'bulleted_list_item',
  numbered_list_item: 'numbered_list_item',
  divider: 'divider',
  toggle: 'toggle',
  callout: 'callout',
  quote: 'quote',
  table: 'table',
};

/**
 * Convert a Notion block tree (from getPageBlocks) into SOWBlock[] for rendering.
 */
export function notionBlocksToSOW(blocks: NotionBlock[]): SOWBlock[] {
  const result: SOWBlock[] = [];

  for (const block of blocks) {
    const sowType = SUPPORTED_TYPES[block.type];
    if (!sowType) continue;

    if (block.type === 'divider') {
      result.push({ type: 'divider', richText: [] });
      continue;
    }

    if (block.type === 'table') {
      const tableRows: RichTextSpan[][][] = [];
      if (block._children) {
        for (const row of block._children) {
          const cells = row.table_row?.cells || [];
          tableRows.push(cells.map((cell: unknown[]) => parseRichText(cell)));
        }
      }
      result.push({ type: 'table', richText: [], tableRows });
      continue;
    }

    const data = block[block.type];
    const sowBlock: SOWBlock = {
      type: sowType,
      richText: parseRichText(data?.rich_text),
    };

    // Recursively convert children
    if (block._children && block._children.length > 0) {
      sowBlock.children = notionBlocksToSOW(block._children);
    }

    result.push(sowBlock);
  }

  return result;
}

/**
 * Convert SOWBlock[] to HTML for email body.
 */
export function blocksToHtml(blocks: SOWBlock[]): string {
  return blocks.map(blockToHtml).join('\n');
}

function spanToHtml(span: RichTextSpan): string {
  let html = escapeHtml(span.text);
  if (span.annotations.bold) html = `<strong>${html}</strong>`;
  if (span.annotations.italic) html = `<em>${html}</em>`;
  if (span.annotations.underline) html = `<u>${html}</u>`;
  if (span.annotations.strikethrough) html = `<s>${html}</s>`;
  if (span.href) html = `<a href="${escapeHtml(span.href)}">${html}</a>`;
  return html;
}

function richTextToHtml(spans: RichTextSpan[]): string {
  return spans.map(spanToHtml).join('');
}

function blockToHtml(block: SOWBlock): string {
  const content = richTextToHtml(block.richText);
  const childrenHtml = block.children ? block.children.map(blockToHtml).join('\n') : '';

  switch (block.type) {
    case 'heading_1':
      return `<h1>${content}</h1>`;
    case 'heading_2':
      return `<h2>${content}</h2>`;
    case 'heading_3':
      return `<h3>${content}</h3>`;
    case 'paragraph':
      return `<p>${content}</p>`;
    case 'bulleted_list_item':
      return `<ul><li>${content}${childrenHtml ? `\n${childrenHtml}` : ''}</li></ul>`;
    case 'numbered_list_item':
      return `<ol><li>${content}${childrenHtml ? `\n${childrenHtml}` : ''}</li></ol>`;
    case 'divider':
      return '<hr>';
    case 'toggle':
      return `<details><summary>${content}</summary>${childrenHtml}</details>`;
    case 'callout':
      return `<blockquote>${content}${childrenHtml ? `\n${childrenHtml}` : ''}</blockquote>`;
    case 'quote':
      return `<blockquote>${content}</blockquote>`;
    case 'table': {
      if (!block.tableRows || block.tableRows.length === 0) return '';
      const rows = block.tableRows.map((row, i) => {
        const tag = i === 0 ? 'th' : 'td';
        const cells = row.map((cell) => `<${tag}>${cell.map(spanToHtml).join('')}</${tag}>`).join('');
        return `<tr>${cells}</tr>`;
      });
      return `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;">${rows.join('')}</table>`;
    }
    default:
      return `<p>${content}</p>`;
  }
}

/**
 * Convert SOWBlock[] to plain text for email fallback.
 */
export function blocksToPlainText(blocks: SOWBlock[]): string {
  return blocks
    .map(blockToPlainText)
    .filter((t) => t.trim())
    .join('\n\n');
}

function blockToPlainText(block: SOWBlock): string {
  const text = block.richText.map((s) => s.text).join('');
  const childrenText = block.children
    ? block.children.map(blockToPlainText).filter(Boolean).join('\n')
    : '';

  switch (block.type) {
    case 'heading_1':
      return `# ${text}`;
    case 'heading_2':
      return `## ${text}`;
    case 'heading_3':
      return `### ${text}`;
    case 'bulleted_list_item':
      return `  - ${text}${childrenText ? '\n' + childrenText : ''}`;
    case 'numbered_list_item':
      return `  - ${text}${childrenText ? '\n' + childrenText : ''}`;
    case 'divider':
      return '---';
    case 'toggle':
      return `> ${text}\n${childrenText}`;
    case 'callout':
    case 'quote':
      return `> ${text}${childrenText ? '\n' + childrenText : ''}`;
    case 'table': {
      if (!block.tableRows) return '';
      return block.tableRows
        .map((row) => row.map((cell) => cell.map((s) => s.text).join('')).join(' | '))
        .join('\n');
    }
    default:
      return text;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
