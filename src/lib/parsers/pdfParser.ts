/* eslint-disable @typescript-eslint/no-explicit-any */
// Injects DOMMatrix, ImageData, and Path2D into Node.js global context to prevent pdfjs-dist / pdf-parse runtime errors
class PolyfillDOMMatrix {
  a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
  constructor(init?: any) {
    if (Array.isArray(init)) {
      this.a = init[0] ?? 1;
      this.b = init[1] ?? 0;
      this.c = init[2] ?? 0;
      this.d = init[3] ?? 1;
      this.e = init[4] ?? 0;
      this.f = init[5] ?? 0;
    }
  }
  multiply() { return this; }
  translate() { return this; }
  scale() { return this; }
  rotate() { return this; }
  transformPoint(p?: any) { return p || { x: 0, y: 0 }; }
}

class PolyfillImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}

class PolyfillPath2D {
  addPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  arc() {}
  rect() {}
}

const g = global as any;
const gt = globalThis as any;

if (typeof g.DOMMatrix === 'undefined') g.DOMMatrix = PolyfillDOMMatrix;
if (typeof gt.DOMMatrix === 'undefined') gt.DOMMatrix = PolyfillDOMMatrix;

if (typeof g.ImageData === 'undefined') g.ImageData = PolyfillImageData;
if (typeof gt.ImageData === 'undefined') gt.ImageData = PolyfillImageData;

if (typeof g.Path2D === 'undefined') g.Path2D = PolyfillPath2D;
if (typeof gt.Path2D === 'undefined') gt.Path2D = PolyfillPath2D;

export interface ExtractedDocumentContent {
  rawText: string;
  pageCount: number;
  info?: Record<string, unknown>;
  hasReadableText: boolean;
  sectionsDetected: string[];
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ExtractedDocumentContent> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfModule = require('pdf-parse');
    let rawText = '';
    let pageCount = 1;

    if (pdfModule.PDFParse) {
      // Pass disableWorker: true and isEvalSupported: false to prevent Next.js Turbopack dynamic worker bundler errors
      const instance = new pdfModule.PDFParse({
        data: buffer,
        disableWorker: true,
        isEvalSupported: false,
        useSystemFonts: true,
      });
      const parsed = await instance.getText();
      rawText = parsed.text || parsed.data || '';
      pageCount = parsed.total || parsed.pages || 1;
    } else if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      rawText = data.text || '';
      pageCount = data.numpages || 1;
    } else if (pdfModule.default && typeof pdfModule.default === 'function') {
      const data = await pdfModule.default(buffer);
      rawText = data.text || '';
      pageCount = data.numpages || 1;
    }

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

    const lines = rawText.split('\n').map((l: string) => l.trim().toLowerCase());
    const sectionsDetected = commonSectionKeywords.filter((keyword: string) =>
      lines.some((line: string) => line === keyword || line.startsWith(keyword + ':'))
    );

    const hasReadableText = rawText.replace(/\s+/g, '').length > 20;

    return {
      rawText,
      pageCount,
      info: {},
      hasReadableText,
      sectionsDetected,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF document: ${error instanceof Error ? error.message : String(error)}`);
  }
}
