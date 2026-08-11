/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof (global as any).DOMMatrix === 'undefined') {
  class PolyfillDOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    multiply() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    transformPoint(p?: any) { return p || { x: 0, y: 0 }; }
  }
  (global as any).DOMMatrix = PolyfillDOMMatrix;
  (globalThis as any).DOMMatrix = PolyfillDOMMatrix;
}

import { NextRequest, NextResponse } from 'next/server';
import { validateUploadedFile } from '@/lib/security/fileSanitizer';
import { parsePdfBuffer } from '@/lib/parsers/pdfParser';
import { parseDocxBuffer } from '@/lib/parsers/docxParser';
import { extractCvWithGeminiAI, GeminiExtractionResult } from '@/lib/extractor/geminiExtractor';
import { translateCanonicalCv } from '@/lib/translator/translationEngine';
import { getCompanyTemplate } from '@/lib/templates/companies';
import { validateCvConversionPipeline } from '@/lib/validation/auditEngine';
import { generatePdfBuffer } from '@/lib/rendering/pdfRenderer';
import { overlayCvOnPdfTemplate } from '@/lib/rendering/pdfTemplateOverlay';
import { renderDocxFromTemplate } from '@/lib/rendering/docxTemplateEngine';
import { SAMPLE_RANDY_FARHAN_CV } from '@/data/sampleCv';
import { TargetLanguage, FileMetadata, CompanyTemplateConfig } from '@/types/cv';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const templateFile = formData.get('templateFile') as File | null;
    const templateId = (formData.get('templateId') as string) || 'company-aigen';
    const templateConfigJson = formData.get('templateConfig') as string | null;
    const language = ((formData.get('language') as string) || 'en') as TargetLanguage;
    const customInstructions = (formData.get('customInstructions') as string) || '';
    const isSampleMode = formData.get('isSample') === 'true';

    let canonicalCv = SAMPLE_RANDY_FARHAN_CV;
    let fileMeta: FileMetadata = {
      name: 'Randy_Farhan_CV.pdf',
      sizeBytes: 2450000,
      mimeType: 'application/pdf',
      extension: 'pdf',
    };

    let extractionResult: GeminiExtractionResult = {
      cv: SAMPLE_RANDY_FARHAN_CV,
      statusLog: ['Sampel data kandidat dimuat.'],
      modelUsed: 'sample-mode',
      isFallback: false,
    };

    let uploadedFileBuffer: Buffer | undefined;

    if (!isSampleMode && file) {
      uploadedFileBuffer = Buffer.from(await file.arrayBuffer());
      const validation = validateUploadedFile(file.name, file.size, file.type, uploadedFileBuffer);

      if (!validation.isValid || !validation.metadata) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error || 'Invalid file uploaded.',
          },
          { status: 400 }
        );
      }

      fileMeta = validation.metadata;

      // Extract raw text from source CV
      let parsedDoc;
      if (validation.metadata.extension === 'pdf') {
        parsedDoc = await parsePdfBuffer(uploadedFileBuffer);
      } else {
        parsedDoc = await parseDocxBuffer(uploadedFileBuffer);
      }

      if (!parsedDoc.hasReadableText) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unable to extract readable text from source CV. Document may be scanned or empty.',
          },
          { status: 422 }
        );
      }

      // Extract & Qualify Canonical CV Schema using Gemini AI & File Upload API
      extractionResult = await extractCvWithGeminiAI(
        parsedDoc.rawText,
        uploadedFileBuffer,
        file.name,
        file.type || 'application/pdf',
        customInstructions
      );

      canonicalCv = extractionResult.cv;
    }

    // Determine Target Template Buffer ONLY if user explicitly uploaded a custom target template file
    let targetTemplateBuffer: Buffer | undefined;
    if (templateFile) {
      targetTemplateBuffer = Buffer.from(await templateFile.arrayBuffer());
    }

    // Translate if requested
    const processedCv = translateCanonicalCv(canonicalCv, language);

    // Get Target Company Template Config (Merge with client-customized templateConfig if provided)
    let templateConfig = getCompanyTemplate(templateId);

    if (templateConfigJson) {
      try {
        const customConfig = JSON.parse(templateConfigJson) as CompanyTemplateConfig;
        templateConfig = {
          ...templateConfig,
          ...customConfig,
          theme: {
            ...templateConfig.theme,
            ...customConfig.theme,
          },
        };
      } catch (e) {
        console.warn('Failed to parse custom templateConfig from formData:', e);
      }
    }

    // Audit Pipeline Validation
    const validationReport = validateCvConversionPipeline(
      canonicalCv,
      processedCv,
      templateId,
      language
    );

    if (!validationReport.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'CV Validation Failed. Information loss detected.',
          validationReport,
        },
        { status: 422 }
      );
    }

    // Render Outputs into CLEAN Corporate Company CV with customized logo, separator colors, and footer details
    let pdfBuffer: Buffer;
    if (targetTemplateBuffer) {
      pdfBuffer = await overlayCvOnPdfTemplate(
        processedCv,
        templateConfig,
        language,
        targetTemplateBuffer
      );
    } else {
      pdfBuffer = await generatePdfBuffer(processedCv, templateConfig, language);
    }

    const docxBuffer = await renderDocxFromTemplate(
      processedCv,
      templateConfig,
      language,
      targetTemplateBuffer
    );

    const pdfBase64 = pdfBuffer.toString('base64');
    const docxBase64 = docxBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      fileMetadata: fileMeta,
      extractedCv: canonicalCv,
      processedCv: processedCv,
      template: templateConfig,
      language,
      validationReport,
      aiStatus: {
        statusLog: extractionResult.statusLog,
        modelUsed: extractionResult.modelUsed,
        isFallback: extractionResult.isFallback,
        errorMessage: extractionResult.errorMessage,
      },
      outputs: {
        pdfBase64: `data:application/pdf;base64,${pdfBase64}`,
        docxBase64: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docxBase64}`,
      },
    });
  } catch (error) {
    console.error('Conversion Pipeline Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error during CV conversion.',
      },
      { status: 500 }
    );
  }
}
