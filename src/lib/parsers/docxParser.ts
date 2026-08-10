import mammoth from 'mammoth';
import { ExtractedDocumentContent } from './pdfParser';

export async function parseDocxBuffer(buffer: Buffer): Promise<ExtractedDocumentContent> {
  try {
    // Extract raw text
    const textResult = await mammoth.extractRawText({ buffer });
    const rawText = textResult.value || '';

    // Extract HTML representation to preserve bullet points and tables
    const htmlResult = await mammoth.convertToHtml({ buffer });
    const htmlText = htmlResult.value || '';

    const commonSectionKeywords = [
      'summary',
      'profile',
      'experience',
      'work experience',
      'employment',
      'education',
      'skills',
      'technical qualification',
      'qualifications',
      'certifications',
      'projects',
      'languages',
    ];

    const lines = rawText.split('\n').map((l) => l.trim().toLowerCase());
    const sectionsDetected = commonSectionKeywords.filter((keyword) =>
      lines.some((line) => line === keyword || line.startsWith(keyword + ':'))
    );

    const hasReadableText = rawText.replace(/\s+/g, '').length > 30;

    return {
      rawText: rawText || htmlText,
      pageCount: 1, // DOCX does not expose fixed page bounds prior to rendering
      hasReadableText,
      sectionsDetected,
    };
  } catch (error) {
    throw new Error(`Failed to parse DOCX document: ${error instanceof Error ? error.message : String(error)}`);
  }
}
