import PDFDocument from 'pdfkit';
import type { SOWBlock, RichTextSpan } from './types';

const COLORS = {
  gold: '#c8a45e',
  dark: '#1a1a1a',
  gray: '#52525b',
  lightGray: '#e4e4e7',
  white: '#ffffff',
};

const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique',
  boldItalic: 'Helvetica-BoldOblique',
};

function getFontForAnnotations(bold: boolean, italic: boolean): string {
  if (bold && italic) return FONTS.boldItalic;
  if (bold) return FONTS.bold;
  if (italic) return FONTS.italic;
  return FONTS.regular;
}

/**
 * Generate a branded PDF from SOW blocks.
 */
export async function generateSOWPdf(
  blocks: SOWBlock[],
  meta: {
    title: string;
    docType: string;
    documentDate: string;
    accountName: string;
    contactName: string;
  }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      bufferPages: true,
      info: {
        Title: meta.title,
        Author: 'JHR Photography',
        Creator: 'JHR Photography SOW Generator',
      },
    });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // --- Header ---
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill(COLORS.dark);

    doc
      .font(FONTS.bold)
      .fontSize(20)
      .fillColor(COLORS.gold)
      .text('JHR Photography', 72, 28, { width: doc.page.width - 144 });

    doc
      .font(FONTS.regular)
      .fontSize(10)
      .fillColor(COLORS.white)
      .text(`${meta.docType} | ${meta.documentDate}`, 72, 52, {
        width: doc.page.width - 144,
        align: 'left',
      });

    doc.y = 100;

    // --- Document title ---
    doc
      .font(FONTS.bold)
      .fontSize(18)
      .fillColor(COLORS.dark)
      .text(meta.title, 72, doc.y, { width: doc.page.width - 144 });

    doc.moveDown(0.3);

    // Subtitle with client info
    doc
      .font(FONTS.regular)
      .fontSize(11)
      .fillColor(COLORS.gray)
      .text(`Prepared for ${meta.contactName} — ${meta.accountName}`, { width: doc.page.width - 144 });

    doc.moveDown(0.5);

    // Gold accent line
    doc
      .moveTo(72, doc.y)
      .lineTo(doc.page.width - 72, doc.y)
      .strokeColor(COLORS.gold)
      .lineWidth(2)
      .stroke();

    doc.moveDown(1);

    // --- Body content ---
    let numberedIndex = 0;
    for (const block of blocks) {
      renderBlock(doc, block, 72, numberedIndex);
      if (block.type === 'numbered_list_item') {
        numberedIndex++;
      } else {
        numberedIndex = 0;
      }
    }

    // --- Footer on all pages ---
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      const bottom = doc.page.height - 40;
      doc
        .font(FONTS.regular)
        .fontSize(8)
        .fillColor(COLORS.gray)
        .text(
          'JHR Photography | Nashville, TN',
          72,
          bottom,
          { width: doc.page.width - 144, align: 'left', lineBreak: false }
        );
      doc
        .text(
          `Page ${i + 1} of ${pages.count}`,
          72,
          bottom,
          { width: doc.page.width - 144, align: 'right', lineBreak: false }
        );
    }

    doc.end();
  });
}

function renderBlock(doc: PDFKit.PDFDocument, block: SOWBlock, leftMargin: number, numberedIndex: number): void {
  const pageWidth = doc.page.width - leftMargin - 72;

  // Check if we need a new page (leave room for at least a few lines)
  if (doc.y > doc.page.height - 120) {
    doc.addPage();
    doc.y = 72;
  }

  switch (block.type) {
    case 'heading_1':
      doc.moveDown(0.8);
      doc.font(FONTS.bold).fontSize(18).fillColor(COLORS.dark);
      renderRichText(doc, block.richText, leftMargin, pageWidth, 18);
      doc.moveDown(0.4);
      break;

    case 'heading_2':
      doc.moveDown(0.6);
      doc.font(FONTS.bold).fontSize(15).fillColor(COLORS.dark);
      renderRichText(doc, block.richText, leftMargin, pageWidth, 15);
      doc.moveDown(0.3);
      break;

    case 'heading_3':
      doc.moveDown(0.4);
      doc.font(FONTS.bold).fontSize(12).fillColor(COLORS.dark);
      renderRichText(doc, block.richText, leftMargin, pageWidth, 12);
      doc.moveDown(0.2);
      break;

    case 'paragraph':
      doc.font(FONTS.regular).fontSize(11).fillColor(COLORS.dark);
      renderRichText(doc, block.richText, leftMargin, pageWidth, 11);
      doc.moveDown(0.5);
      break;

    case 'bulleted_list_item': {
      const bulletIndent = leftMargin + 20;
      doc.font(FONTS.regular).fontSize(11).fillColor(COLORS.dark);
      doc.text('\u2022 ', leftMargin, doc.y, { continued: true, width: 20 });
      renderRichText(doc, block.richText, bulletIndent, pageWidth - 20, 11);
      doc.moveDown(0.2);
      if (block.children) {
        for (const child of block.children) {
          renderBlock(doc, child, bulletIndent, 0);
        }
      }
      break;
    }

    case 'numbered_list_item': {
      const numIndent = leftMargin + 20;
      doc.font(FONTS.regular).fontSize(11).fillColor(COLORS.dark);
      doc.text(`${numberedIndex + 1}. `, leftMargin, doc.y, { continued: true, width: 20 });
      renderRichText(doc, block.richText, numIndent, pageWidth - 20, 11);
      doc.moveDown(0.2);
      if (block.children) {
        for (const child of block.children) {
          renderBlock(doc, child, numIndent, 0);
        }
      }
      break;
    }

    case 'divider':
      doc.moveDown(0.3);
      doc
        .moveTo(leftMargin, doc.y)
        .lineTo(leftMargin + pageWidth, doc.y)
        .strokeColor(COLORS.lightGray)
        .lineWidth(1)
        .stroke();
      doc.moveDown(0.5);
      break;

    case 'callout':
    case 'quote': {
      const quoteIndent = leftMargin + 12;
      // Draw left accent bar
      const startY = doc.y;
      doc.font(FONTS.italic).fontSize(11).fillColor(COLORS.gray);
      renderRichText(doc, block.richText, quoteIndent, pageWidth - 12, 11);
      if (block.children) {
        for (const child of block.children) {
          renderBlock(doc, child, quoteIndent, 0);
        }
      }
      doc
        .moveTo(leftMargin + 4, startY)
        .lineTo(leftMargin + 4, doc.y)
        .strokeColor(COLORS.gold)
        .lineWidth(2)
        .stroke();
      doc.moveDown(0.5);
      break;
    }

    case 'toggle':
      doc.font(FONTS.bold).fontSize(11).fillColor(COLORS.dark);
      renderRichText(doc, block.richText, leftMargin, pageWidth, 11);
      doc.moveDown(0.2);
      if (block.children) {
        for (const child of block.children) {
          renderBlock(doc, child, leftMargin + 16, 0);
        }
      }
      doc.moveDown(0.3);
      break;

    case 'table':
      renderTable(doc, block, leftMargin, pageWidth);
      doc.moveDown(0.5);
      break;
  }
}

function renderRichText(
  doc: PDFKit.PDFDocument,
  spans: RichTextSpan[],
  x: number,
  width: number,
  fontSize: number
): void {
  if (!spans || spans.length === 0) {
    doc.text('', x, doc.y, { width });
    return;
  }

  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    const isLast = i === spans.length - 1;
    const font = getFontForAnnotations(span.annotations.bold, span.annotations.italic);
    doc.font(font).fontSize(fontSize);
    if (span.annotations.underline) {
      doc.text(span.text, x, doc.y, { width, continued: !isLast, underline: true });
    } else {
      doc.text(span.text, x, doc.y, { width, continued: !isLast });
    }
  }
}

function renderTable(doc: PDFKit.PDFDocument, block: SOWBlock, leftMargin: number, pageWidth: number): void {
  if (!block.tableRows || block.tableRows.length === 0) return;

  const colCount = block.tableRows[0].length;
  const colWidth = pageWidth / colCount;
  const cellPadding = 4;

  for (let rowIdx = 0; rowIdx < block.tableRows.length; rowIdx++) {
    const row = block.tableRows[rowIdx];
    const isHeader = rowIdx === 0;

    if (doc.y > doc.page.height - 100) {
      doc.addPage();
      doc.y = 72;
    }

    const rowY = doc.y;
    let maxHeight = 20;

    // Measure row height
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellText = row[colIdx].map((s) => s.text).join('');
      doc.font(isHeader ? FONTS.bold : FONTS.regular).fontSize(10);
      const h = doc.heightOfString(cellText, {
        width: colWidth - cellPadding * 2,
      });
      maxHeight = Math.max(maxHeight, h + cellPadding * 2);
    }

    // Draw cells
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellX = leftMargin + colIdx * colWidth;

      // Background for header
      if (isHeader) {
        doc.rect(cellX, rowY, colWidth, maxHeight).fill(COLORS.dark);
        doc.font(FONTS.bold).fontSize(10).fillColor(COLORS.white);
      } else {
        doc.rect(cellX, rowY, colWidth, maxHeight).stroke(COLORS.lightGray);
        doc.font(FONTS.regular).fontSize(10).fillColor(COLORS.dark);
      }

      const cellText = row[colIdx].map((s) => s.text).join('');
      doc.text(cellText, cellX + cellPadding, rowY + cellPadding, {
        width: colWidth - cellPadding * 2,
      });
    }

    doc.y = rowY + maxHeight;
  }
}
