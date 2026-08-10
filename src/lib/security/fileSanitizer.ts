import { FileMetadata } from '@/types/cv';

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  metadata?: FileMetadata;
}

export function sanitizeFilename(filename: string): string {
  // Strip path traversal attempts and sanitize characters
  return filename
    .replace(/^.*[\\/]/, '') // remove path directory components
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // sanitize special characters
}

export function validateUploadedFile(
  filename: string,
  sizeBytes: number,
  mimeType: string,
  buffer?: Buffer
): FileValidationResult {
  const cleanName = sanitizeFilename(filename);

  if (sizeBytes <= 0) {
    return { isValid: false, error: 'Uploaded file is empty (0 bytes).' };
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of 15 MB.`,
    };
  }

  const lowerName = cleanName.toLowerCase();
  let extension: 'pdf' | 'docx' | null = null;

  if (lowerName.endsWith('.pdf')) {
    extension = 'pdf';
  } else if (lowerName.endsWith('.docx')) {
    extension = 'docx';
  } else {
    return {
      isValid: false,
      error: 'Invalid file extension. Only PDF (.pdf) and DOCX (.docx) files are supported.',
    };
  }

  // Validate magic bytes if buffer is available
  if (buffer && buffer.length >= 4) {
    if (extension === 'pdf') {
      const isPdfHeader = buffer.subarray(0, 4).toString('utf-8') === '%PDF';
      if (!isPdfHeader) {
        return {
          isValid: false,
          error: 'File extension is .pdf, but document magic header is not a valid PDF.',
        };
      }
    } else if (extension === 'docx') {
      // DOCX is a zip file starting with PK\x03\x04
      const isZipHeader = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
      if (!isZipHeader) {
        return {
          isValid: false,
          error: 'File extension is .docx, but document magic header is not a valid DOCX package.',
        };
      }
    }
  }

  return {
    isValid: true,
    metadata: {
      name: cleanName,
      sizeBytes,
      mimeType: extension === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension,
    },
  };
}
