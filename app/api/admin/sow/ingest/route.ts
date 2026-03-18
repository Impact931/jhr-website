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
import { generateSOWDocx } from '@/lib/sow/docx-generator';
import { uploadToGoogleDrive, uploadToGoogleDriveReturnId, exportDriveFileAsPdf } from '@/lib/sow/google-drive';
import { uploadPdfToS3 } from '@/lib/sow/s3-upload';
import { createGmailDraft } from '@/lib/sow/gmail-draft';
import { sowDeliveryEmail } from '@/lib/email-templates/sow-email';
import { sendSlackNotification } from '@/lib/slack';
import { saveSOWLog, type SOWLogEntry } from '@/lib/sow/log';
import type { SOWContractData } from '@/lib/sow/types';

const WEBHOOK_SECRET = process.env.ASSIGNMENTS_WEBHOOK_SECRET;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SOW_FOLDER_ID;
const OPS_EMAILS = ['jayson@jhr-photography.com', 'angus@jhr-photography.com'];

export async function POST(request: NextRequest) {
  const log: SOWLogEntry = {
    timestamp: new Date().toISOString(),
    steps: [],
    success: false,
  };

  function step(name: string, detail?: string) {
    log.steps.push({ name, detail, at: new Date().toISOString() });
  }

  function stepError(name: string, error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack?.split('\n').slice(0, 3).join(' | ') : undefined;
    log.steps.push({ name, detail: msg, error: true, stack, at: new Date().toISOString() });
  }

  // Validate webhook secret
  const secret = request.headers.get('x-jhr-secret');
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    step('parse_body');
    const body = await request.json();

    // Log the raw webhook payload keys for debugging
    step('webhook_payload', `keys: ${Object.keys(body).join(', ')}${body.data ? ` | data.keys: ${Object.keys(body.data).join(', ')}` : ''}`);

    const notionPageId = body.notionPageId || body.page_id || body.data?.id || body.id;
    log.notionPageId = notionPageId;

    if (!notionPageId) {
      step('missing_page_id', JSON.stringify({ bodyKeys: Object.keys(body), dataKeys: body.data ? Object.keys(body.data) : null }));
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'Missing notionPageId', log: log.steps }, { status: 400 });
    }

    step('notion_fetch_page', notionPageId);
    const contractPage = await getNotionPage(notionPageId);
    if (!contractPage) {
      stepError('notion_fetch_page', 'getNotionPage returned null');
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'Failed to fetch Notion contract page', log: log.steps }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: Record<string, any> = contractPage.properties || {};
    step('properties_found', Object.keys(props).join(', '));

    // Idempotency: if Document Link is already set, return early
    const existingDocLink = extractUrl(props['Document Link']);
    if (existingDocLink) {
      step('idempotency_skip', existingDocLink);
      log.success = true;
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({
        message: 'Contract already processed',
        documentUrl: existingDocLink,
        log: log.steps,
      });
    }

    // --- Extract contract properties ---
    step('extract_properties');
    const title = extractTitle(props['Title']) || extractTitle(props['Name']) || 'Untitled Contract';
    const status = extractStatus(props['Status']) || extractSelect(props['Status']);
    const docType = extractSelect(props['Doc Type']) || 'Statement of Work';
    const documentDate = extractDate(props['Document Date']) || new Date().toISOString().split('T')[0];
    const paymentStructure = extractSelect(props['Payment Structure']) || extractPlainText(props['Payment Structure']);

    let dealAmount = '';
    const dealAmountNum = extractNumber(props['Deal Amount']);
    if (dealAmountNum !== null) {
      dealAmount = `$${dealAmountNum.toLocaleString()}`;
    } else {
      dealAmount = extractFormula(props['Deal Amount']) || extractPlainText(props['Deal Amount']);
    }

    log.title = title;
    step('contract_meta', `title=${title} | docType=${docType} | status=${status} | dealAmount=${dealAmount}`);

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
    step('resolve_deal');
    const dealIds = extractRelation(props['Deal']);
    step('deal_ids', dealIds.length ? dealIds.join(', ') : 'none');
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
        step('deal_resolved', `dealName=${dealName} | eventDate=${eventDate}`);
      } else {
        step('deal_resolved', 'FAILED to fetch deal page');
      }
    }

    // Contact relation
    step('resolve_contact');
    const contactIds = extractRelation(props['Contact']);
    if (contactIds.length > 0) {
      const contactPage = await getNotionPage(contactIds[0]);
      if (contactPage) {
        const cp = contactPage.properties || {};
        contactName = extractTitle(cp['Contact Name']) || extractTitle(cp['Name']);
        contactEmail = extractEmail(cp['Email']);
        contactPhone = extractPhone(cp['Phone (Cell)']) || extractPhone(cp['Phone']);
        step('contact_resolved', `name=${contactName} | email=${contactEmail}`);
      }
    } else {
      step('contact_resolved', 'no contact relation');
    }

    // Account relation
    step('resolve_account');
    const accountIds = extractRelation(props['Account']);
    if (accountIds.length > 0) {
      const accountPage = await getNotionPage(accountIds[0]);
      if (accountPage) {
        const ap = accountPage.properties || {};
        accountName = extractTitle(ap['Account Name']) || extractTitle(ap['Name']);
        accountWebsite = extractUrl(ap['Website']);
        step('account_resolved', accountName);
      }
    } else {
      step('account_resolved', 'no account relation');
    }

    // Product/Service relation (multiple)
    step('resolve_products');
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
    step('products_resolved', `${products.length} products`);

    // --- Fetch page blocks → SOWBlock[] ---
    step('fetch_blocks');
    const pageBlocks = await getPageBlocks(notionPageId);
    step('blocks_fetched', `${pageBlocks.length} blocks`);

    const sowBlocks = notionBlocksToSOW(pageBlocks);
    step('blocks_converted', `${sowBlocks.length} SOW blocks`);

    const contractData: SOWContractData = {
      notionPageId, title, status, dealAmount, paymentStructure, docType, documentDate,
      dealName, eventDate, eventType, dealValue, services, deliverables, attire, licensing,
      contactName, contactEmail, contactPhone, accountName, accountWebsite, products,
      blocks: sowBlocks,
    };

    const displayDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : documentDate;

    const meta = {
      title, docType, documentDate: displayDate,
      accountName: accountName || 'Client',
      contactName: contactName || 'Client',
    };

    const safeTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');

    // --- Generate DOCX ---
    step('generate_docx');
    let docxBuffer: Buffer;
    try {
      docxBuffer = await generateSOWDocx(sowBlocks, meta);
      step('docx_generated', `${docxBuffer.length}b`);
    } catch (e) {
      stepError('generate_docx', e);
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'DOCX generation failed', log: log.steps }, { status: 500 });
    }

    // --- Upload DOCX to Google Drive ---
    step('drive_upload', `folder=${DRIVE_FOLDER_ID}`);
    let driveFileId: string | null;
    let driveUrl: string | null;
    try {
      driveFileId = await uploadToGoogleDriveReturnId(
        docxBuffer,
        `${safeTitle}.docx`,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        DRIVE_FOLDER_ID
      );
      driveUrl = driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : null;
    } catch (e) {
      stepError('drive_upload', e);
      driveFileId = null;
      driveUrl = null;
    }
    if (driveUrl) {
      step('drive_uploaded', driveUrl);
    } else {
      stepError('drive_upload', 'uploadToGoogleDriveReturnId returned null');
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'Drive upload failed — cannot export PDF', log: log.steps }, { status: 500 });
    }
    log.driveUrl = driveUrl;

    // --- Export PDF from Google Drive ---
    step('drive_pdf_export');
    let pdfBuffer: Buffer | null;
    try {
      pdfBuffer = await exportDriveFileAsPdf(driveFileId!);
    } catch (e) {
      stepError('drive_pdf_export', e);
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'Drive PDF export failed', log: log.steps }, { status: 500 });
    }
    if (!pdfBuffer) {
      stepError('drive_pdf_export', 'exportDriveFileAsPdf returned null');
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'Drive PDF export returned empty', log: log.steps }, { status: 500 });
    }
    step('pdf_exported', `${pdfBuffer.length}b`);

    // --- Upload PDF to S3 (client download link) ---
    step('s3_upload');
    let pdfDownloadUrl: string | null;
    try {
      pdfDownloadUrl = await uploadPdfToS3(pdfBuffer, `${safeTitle}.pdf`);
    } catch (e) {
      stepError('s3_upload', e);
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'S3 upload failed', log: log.steps }, { status: 500 });
    }
    if (!pdfDownloadUrl) {
      stepError('s3_upload', 'uploadPdfToS3 returned null');
      await saveSOWLog(log).catch(() => {});
      return NextResponse.json({ error: 'S3 upload failed', log: log.steps }, { status: 500 });
    }
    step('s3_uploaded', pdfDownloadUrl);

    // --- Create Gmail drafts for ops (PDF attachment only) ---
    step('gmail_drafts');
    const emailContent = sowDeliveryEmail(contractData, pdfDownloadUrl);
    const attachments = [
      { filename: `${safeTitle}.pdf`, mimeType: 'application/pdf', content: pdfBuffer },
    ];

    const draftPromises = OPS_EMAILS.map((opsEmail) =>
      createGmailDraft(
        opsEmail, contactEmail || opsEmail,
        emailContent.subject, emailContent.htmlBody, emailContent.textBody, attachments
      ).then((id) => {
        step(`draft_${opsEmail}`, id ? `OK (${id})` : 'returned null');
        return id;
      }).catch((e) => {
        stepError(`draft_${opsEmail}`, e);
        return null;
      })
    );

    const draftResults = await Promise.allSettled(draftPromises);
    const draftIds = draftResults.map((r) => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean);
    step('drafts_complete', `${draftIds.length}/${OPS_EMAILS.length} created`);

    // --- Write back to Notion ---
    step('notion_writeback');
    const notionDocUrl = driveUrl || pdfDownloadUrl;
    try {
      await updateNotionPage(notionPageId, {
        'Document Link': { url: notionDocUrl },
        'Agreement URL': { url: pdfDownloadUrl },
        'Status': { status: { name: 'Sent for Signature' } },
      });
      step('notion_writeback_done');
    } catch (error) {
      stepError('notion_writeback', error);
    }

    // --- Slack notification ---
    step('slack_notify');
    try {
      const slackResult = await sendSlackNotification({
        text: `*SOW Sent* -- ${title}\n${contactName} (${accountName})\n${dealAmount ? `${dealAmount} | ` : ''}${eventDate ? displayDate : ''}\nDrive: ${driveUrl || 'n/a'}\nPDF: ${pdfDownloadUrl}\nDrafts: ${draftIds.length} inbox(es)`,
      });
      step('slack_result', slackResult ? 'sent' : 'failed (no webhook?)');
    } catch (e) {
      stepError('slack_notify', e);
    }

    log.success = true;
    await saveSOWLog(log).catch(() => {});

    return NextResponse.json({
      success: true,
      pdfUrl: pdfDownloadUrl,
      driveUrl: driveUrl || null,
      draftCount: draftIds.length,
      title, contactName, accountName,
      log: log.steps,
    });
  } catch (error) {
    stepError('unhandled_error', error);
    await saveSOWLog(log).catch(() => {});
    return NextResponse.json({ error: 'Internal server error', log: log.steps }, { status: 500 });
  }
}
