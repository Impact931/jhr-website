import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from 'docx';
import type { SOWBlock, RichTextSpan } from './types';

function spansToTextRuns(spans: RichTextSpan[], overrides?: Partial<{ bold: boolean; italics: boolean; size: number; color: string }>): TextRun[] {
  if (!spans || spans.length === 0) return [new TextRun('')];
  const runs: TextRun[] = [];
  for (const span of spans) {
    // Notion shift+enter creates \n within a text span — split into separate TextRuns with line breaks
    const lines = span.text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      runs.push(
        new TextRun({
          text: lines[i],
          bold: overrides?.bold ?? span.annotations.bold,
          italics: overrides?.italics ?? span.annotations.italic,
          underline: span.annotations.underline ? {} : undefined,
          strike: span.annotations.strikethrough || undefined,
          size: overrides?.size,
          color: overrides?.color,
          break: i > 0 ? 1 : undefined,
          ...(span.href ? { hyperlink: span.href } : {}),
        })
      );
    }
  }
  return runs;
}

function blocksToParagraphs(blocks: SOWBlock[]): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  let numberedIdx = 0;

  for (const block of blocks) {
    switch (block.type) {
      case 'heading_1':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 36, bold: true }),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
        break;

      case 'heading_2':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 30, bold: true }),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        break;

      case 'heading_3':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 24, bold: true }),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
        break;

      case 'paragraph':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 22 }),
            spacing: { after: 120 },
          })
        );
        break;

      case 'bulleted_list_item':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 22 }),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
        if (block.children) {
          for (const child of block.children) {
            elements.push(...blocksToParagraphs([child]));
          }
        }
        break;

      case 'numbered_list_item':
        numberedIdx++;
        elements.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${numberedIdx}. `, bold: false, size: 22 }),
              ...spansToTextRuns(block.richText, { size: 22 }),
            ],
            spacing: { after: 60 },
            indent: { left: 360 },
          })
        );
        if (block.children) {
          for (const child of block.children) {
            elements.push(...blocksToParagraphs([child]));
          }
        }
        break;

      case 'divider':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: [new TextRun('')],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E4E4E7' },
            },
            spacing: { before: 120, after: 120 },
          })
        );
        break;

      case 'callout':
      case 'quote':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 22, italics: true, color: '52525B' }),
            indent: { left: 360 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 12, color: 'C8A45E' },
            },
            spacing: { before: 120, after: 120 },
          })
        );
        if (block.children) {
          for (const child of block.children) {
            elements.push(...blocksToParagraphs([child]));
          }
        }
        break;

      case 'toggle':
        numberedIdx = 0;
        elements.push(
          new Paragraph({
            children: spansToTextRuns(block.richText, { size: 22, bold: true }),
            spacing: { before: 120, after: 60 },
          })
        );
        if (block.children) {
          for (const child of block.children) {
            elements.push(...blocksToParagraphs([child]));
          }
        }
        break;

      case 'table':
        numberedIdx = 0;
        if (block.tableRows && block.tableRows.length > 0) {
          elements.push(buildTable(block.tableRows));
        }
        break;
    }
  }

  return elements;
}

function buildTable(rows: RichTextSpan[][][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIdx) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: spansToTextRuns(cell, {
                    size: 20,
                    bold: rowIdx === 0,
                    color: rowIdx === 0 ? 'FFFFFF' : '1A1A1A',
                  }),
                }),
              ],
              shading:
                rowIdx === 0
                  ? { type: ShadingType.SOLID, color: '18181B' }
                  : undefined,
            })
        ),
      })
    ),
  });
}

/**
 * Generate a branded DOCX from SOW blocks.
 */
export async function generateSOWDocx(
  blocks: SOWBlock[],
  meta: {
    title: string;
    docType: string;
    documentDate: string;
    accountName: string;
    contactName: string;
  }
): Promise<Buffer> {
  const doc = new Document({
    creator: 'JHR Photography',
    title: meta.title,
    description: `${meta.docType} for ${meta.accountName}`,
    sections: [
      {
        properties: {
          page: {
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'JHR Photography',
                    bold: true,
                    size: 20,
                    color: 'C8A45E',
                  }),
                  new TextRun({
                    text: `\t${meta.documentDate}`,
                    size: 16,
                    color: '71717A',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'JHR Photography | Nashville, TN    Page ',
                    size: 16,
                    color: 'A1A1AA',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: 'A1A1AA',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: 'A1A1AA',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: 'A1A1AA',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Company name
          new Paragraph({
            children: [
              new TextRun({
                text: 'JHR Photography',
                bold: true,
                size: 36,
                color: 'C8A45E',
              }),
            ],
            spacing: { after: 40 },
          }),
          // Document type + client
          new Paragraph({
            children: [
              new TextRun({
                text: `Statement of Work`,
                bold: true,
                size: 48,
                color: '1A1A1A',
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: meta.accountName || meta.contactName,
                bold: true,
                size: 32,
                color: '3F3F46',
              }),
            ],
            spacing: { after: 80 },
          }),
          // Gold divider
          new Paragraph({
            children: [new TextRun('')],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 12, color: 'C8A45E' },
            },
            spacing: { after: 120 },
          }),
          // Prepared for line
          new Paragraph({
            children: [
              new TextRun({
                text: `Prepared for ${meta.contactName}`,
                size: 22,
                color: '52525B',
              }),
              new TextRun({
                text: `  |  ${meta.documentDate}`,
                size: 22,
                color: '71717A',
              }),
            ],
            spacing: { after: 280 },
          }),
          // Content
          ...blocksToParagraphs(blocks),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
