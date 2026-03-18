import { getGoogleAccessToken } from '@/lib/google-auth';

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const IMPERSONATE_EMAIL = 'jayson@jhr-photography.com';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Upload a file to Google Drive and return the view URL.
 */
export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId?: string
): Promise<string | null> {
  const accessToken = await getGoogleAccessToken(IMPERSONATE_EMAIL, SCOPES);
  if (!accessToken) {
    console.error('Failed to get Google Drive access token');
    return null;
  }

  // Build multipart upload body
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const metadata = JSON.stringify({
    name: fileName,
    mimeType,
    ...(folderId ? { parents: [folderId] } : {}),
  });

  // Construct multipart body — Drive expects raw binary, not base64
  const preamble = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    '',
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    '',
    '',
  ].join('\r\n');

  const epilogue = Buffer.from(`\r\n--${boundary}--`, 'utf-8');

  const body = Buffer.concat([
    Buffer.from(preamble, 'utf-8'),
    fileBuffer,
    epilogue,
  ]);

  const res = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Google Drive upload failed:', res.status, err);
    return null;
  }

  const data = await res.json();
  return `https://drive.google.com/file/d/${data.id}/view`;
}
