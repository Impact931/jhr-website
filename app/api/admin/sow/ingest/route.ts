import { NextRequest, NextResponse } from 'next/server';
import {
  getNotionPage,
  getPageBlocks,
  updateNotionPage,
  extractRelation,
  extractTitle,
  extractPlainText,
  extractEmail,
  extractPhone,
  extractSelect,
  extractDate,
  extractNumber,
  extractUrl,
  extractFormula,
  extractStatus,
} from '@/lib/notion';
import { notionBlocksToSOW } from '@/lib/sow/notion-blocks';
import { generateSOWPdf } from '@/lib/sow/pdf-generator';
import { generateSOWDocx } from '@/lib/sow/docx-generator';
import { uploadToGoogleDrive } from '@/lib/sow/google-drive';
import { createGmailDraft } from '@/lib/sow/gmail-draft';
import { sowDeliveryEmail } from '@/lib/email-templates/sow-email';
import { sendSlackNotification } from '@/lib/slack';
import type { SOWContractData } from '@/lib/sow/types';

const WEBHOOK_SECRET = process.env.ASSIGNMENTS_WEBHOOK_SECRET;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SOW_FOLDER_ID;
const OPS_EMAILS = ['jayson@jhr-photography.com', 'angus@jhr-photography.com'];

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const secret = request.headers.get('x-jhr-secret');
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const notionPageId = body.notionPageId || body.page_id || body.data?.id || body.id;

    if (!notionPageId) {
      return NextResponse.json({ error: 'Missing notionPageId' }, { status: 400 });
    }

    // Fetch contract page from Notion
    const contractPage = await getNotionPage(notionPageId);
    if (!contractPage) {
      return NextResponse.json({ error: 'Failed to fetch Notion contract page' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: Record<string, any> = contractPage.properties || {};

    // Idempotency: if Document Link is already set, return early
    const existingDocLink = extractUrl(props['Document Link']);
    if (existingDocLink) {
      return NextResponse.json({
        message: 'Contract already processed',
        documentUrl: existingDocLink,
      });
    }

    // --- Extract contract properties ---
    const title = extractTitle(props['Title']) || extractTitle(props['Name']) || 'Untitled Contract';
    const status = extractStatus(props['Status']) || extractSelect(props['Status']);
    const docType = extractSelect(props['Doc Type']) || 'Statement of Work';
    const documentDate = extractDate(props['Document Date']) || new Date().toISOString().split('T')[0];
    const paymentStructure = extractSelect(props['Payment Structure']) || extractPlainText(props['Payment Structure']);

    // Deal Amount - try number first, then formula
    let dealAmount = '';
    const dealAmountNum = extractNumber(props['Deal Amount']);
    if (dealAmountNum !== null) {
      dealAmount = `$${dealAmountNum.toLocaleString()}`;
    } else {
      dealAmount = extractFormula(props['Deal Amount']) || extractPlainText(props['Deal Amount']);
    }

    // --- Resolve relations ---
    let dealName = '';
    let eventDate = '';
    let eventType = '';
    let dealValue = '';
    let services = '';
    let deliverables = '';
    let attire = '';
    let licensing = '';
    let contactName = '';
    let contactEmail = '';
    let contactPhone = '';
    let accountName = '';
    let accountWebsite = '';
    const products: SOWContractData['products'] = [];

    // Deal relation
    const dealIds = extractRelation(props['Deal']);
    if (dealIds.length > 0) {
      const dealPage = await getNotionPage(dealIds[0]);
      if (dealPage) {
        const dp = dealPage.properties || {};
        dealName = extractTitle(dp['Deal Name']) || extractTitle(dp['Name']);
        eventDate = extractDate(dp['Event Date']);
        eventType = extractSelect(dp['Event Type']);
        const dv = extractNumber(dp['Deal Value']);
        dealValue = dv !== null ? `$${dv.toLocaleString()}` : extractFormula(dp['Deal Value']) || '';
        services = extractPlainText(dp['Services']) || extractSelect(dp['Services']);
        deliverables = extractPlainText(dp['Deliverables']);
        attire = extractSelect(dp['Attire']);
        licensing = extractPlainText(dp['Licensing']) || extractSelect(dp['Licensing']);
      }
    }

    // Contact relation
    const contactIds = extractRelation(props['Contact']);
    if (contactIds.length > 0) {
      const contactPage = await getNotionPage(contactIds[0]);
      if (contactPage) {
        const cp = contactPage.properties || {};
        contactName = extractTitle(cp['Contact Name']) || extractTitle(cp['Name']);
        contactEmail = extractEmail(cp['Email']);
        contactPhone = extractPhone(cp['Phone (Cell)']) || extractPhone(cp['Phone']);
      }
    }

    // Account relation
    const accountIds = extractRelation(props['Account']);
    if (accountIds.length > 0) {
      const accountPage = await getNotionPage(accountIds[0]);
      if (accountPage) {
        const ap = accountPage.properties || {};
        accountName = extractTitle(ap['Account Name']) || extractTitle(ap['Name']);
        accountWebsite = extractUrl(ap['Website']);
      }
    }

    // Product/Service relation (multiple)
    const productIds = extractRelation(props['Product/Service']) || extractRelation(props['Products']);
    for (const pid of productIds) {
      const productPage = await getNotionPage(pid);
      if (productPage) {
        const pp = productPage.properties || {};
        const pName = extractTitle(pp['Product Name']) || extractTitle(pp['Name']);
        const pNum = extractNumber(pp['Price']);
        const pPrice = pNum !== null ? `$${pNum.toLocaleString()}` : extractFormula(pp['Price']) || '';
        const pDesc = extractPlainText(pp['Description']);
        products.push({ name: pName, price: pPrice, description: pDesc });
      }
    }

    // --- Fetch page blocks → SOWBlock[] ---
    const pageBlocks = await getPageBlocks(notionPageId);
    const sowBlocks = notionBlocksToSOW(pageBlocks);

    const contractData: SOWContractData = {
      notionPageId,
      title,
      status,
      dealAmount,
      paymentStructure,
      docType,
      documentDate,
      dealName,
      eventDate,
      eventType,
      dealValue,
      services,
      deliverables,
      attire,
      licensing,
      contactName,
      contactEmail,
      contactPhone,
      accountName,
      accountWebsite,
      products,
      blocks: sowBlocks,
    };

    // Format date for display
    const displayDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : documentDate;

    const meta = {
      title,
      docType,
      documentDate: displayDate,
      accountName: accountName || 'Client',
      contactName: contactName || 'Client',
    };

    // Sanitize title for filenames
    const safeTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');

    // --- Generate PDF + DOCX in parallel ---
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generateSOWPdf(sowBlocks, meta),
      generateSOWDocx(sowBlocks, meta),
    ]);

    // --- Upload DOCX to Google Drive ---
    const driveUrl = await uploadToGoogleDrive(
      docxBuffer,
      `${safeTitle}.docx`,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      DRIVE_FOLDER_ID
    );

    if (!driveUrl) {
      console.error('Failed to upload DOCX to Google Drive');
      return NextResponse.json({ error: 'Drive upload failed' }, { status: 500 });
    }

    // --- Create Gmail drafts for ops ---
    const emailContent = sowDeliveryEmail(contractData, driveUrl);
    const attachments = [
      {
        filename: `${safeTitle}.pdf`,
        mimeType: 'application/pdf',
        content: pdfBuffer,
      },
      {
        filename: `${safeTitle}.docx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: docxBuffer,
      },
    ];

    const draftPromises = OPS_EMAILS.map((opsEmail) =>
      createGmailDraft(
        opsEmail,
        contactEmail || opsEmail,
        emailContent.subject,
        emailContent.htmlBody,
        emailContent.textBody,
        attachments
      ).catch((e) => {
        console.error(`Failed to create draft for ${opsEmail}:`, e);
        return null;
      })
    );

    const draftResults = await Promise.allSettled(draftPromises);
    const draftIds = draftResults
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter(Boolean);

    // --- Write back to Notion ---
    try {
      await updateNotionPage(notionPageId, {
        'Document Link': { url: driveUrl },
        'Agreement URL': { url: driveUrl },
        'Status': { status: { name: 'Sent for Signature' } },
      });
    } catch (error) {
      console.error('Failed to update Notion contract page:', error);
    }

    // --- Slack notification ---
    sendSlackNotification({
      text: `:page_facing_up: *SOW Sent* — ${title}\n:bust_in_silhouette: ${contactName} (${accountName})\n${dealAmount ? `:moneybag: ${dealAmount}` : ''}${eventDate ? `\n:calendar_spiral: ${displayDate}` : ''}\n:link: ${driveUrl}\n:email: Drafts created in ${draftIds.length} inbox(es)`,
    }).catch((e) => console.error('Failed to send Slack notification:', e));

    return NextResponse.json({
      success: true,
      documentUrl: driveUrl,
      draftCount: draftIds.length,
      title,
      contactName,
      accountName,
    });
  } catch (error) {
    console.error('SOW ingest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
