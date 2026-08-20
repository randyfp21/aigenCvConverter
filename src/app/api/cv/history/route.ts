import { NextRequest, NextResponse } from 'next/server';
import { db, initDbSchema } from '@/lib/db';
import { CvHistoryItem } from '@/types/cv';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cv/history
 * Fetches all saved CV history drafts from PostgreSQL database table `cv_history`.
 */
export async function GET() {
  try {
    await initDbSchema();

    const { rows } = await db.query(
      'SELECT * FROM cv_history ORDER BY created_at DESC'
    );

    const history: CvHistoryItem[] = rows.map((r) => ({
      id: r.id,
      candidate_name: r.candidate_name,
      candidate_role: r.candidate_role,
      template_id: r.template_id,
      template_code: r.template_code,
      company_name: r.company_name,
      source_filename: r.source_filename,
      target_language: r.target_language,
      extracted_cv: typeof r.extracted_cv_json === 'string' ? JSON.parse(r.extracted_cv_json) : r.extracted_cv_json,
      processed_cv: typeof r.processed_cv_json === 'string' ? JSON.parse(r.processed_cv_json) : r.processed_cv_json,
      pdf_base64: r.pdf_base64,
      docx_base64: r.docx_base64,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return NextResponse.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error('Error fetching CV history from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CV history from database.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cv/history
 * Saves or updates a CV history draft in PostgreSQL database table `cv_history`.
 */
export async function POST(req: NextRequest) {
  try {
    await initDbSchema();
    const body = await req.json();

    const id = body.id || `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const candidateName = body.candidate_name || body.processed_cv?.personal_information?.full_name || 'Candidate Profile';
    const candidateRole = body.candidate_role || body.processed_cv?.role || 'Professional';
    const templateId = body.template_id || 'company-aigen';
    const templateCode = body.template_code || 'AIGEN';
    const companyName = body.company_name || 'PT Aigen Global Technology';
    const sourceFilename = body.source_filename || 'CV_Source.pdf';
    const targetLanguage = body.target_language || 'en';
    const extractedCvJson = JSON.stringify(body.extracted_cv || body.processed_cv);
    const processedCvJson = JSON.stringify(body.processed_cv || body.extracted_cv);
    const pdfBase64 = body.pdf_base64 || '';
    const docxBase64 = body.docx_base64 || '';

    const query = `
      INSERT INTO cv_history (
        id, candidate_name, candidate_role, template_id, template_code, company_name,
        source_filename, target_language, extracted_cv_json, processed_cv_json,
        pdf_base64, docx_base64, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        candidate_name = EXCLUDED.candidate_name,
        candidate_role = EXCLUDED.candidate_role,
        template_id = EXCLUDED.template_id,
        template_code = EXCLUDED.template_code,
        company_name = EXCLUDED.company_name,
        source_filename = EXCLUDED.source_filename,
        target_language = EXCLUDED.target_language,
        extracted_cv_json = EXCLUDED.extracted_cv_json,
        processed_cv_json = EXCLUDED.processed_cv_json,
        pdf_base64 = EXCLUDED.pdf_base64,
        docx_base64 = EXCLUDED.docx_base64,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      id,
      candidateName,
      candidateRole,
      templateId,
      templateCode,
      companyName,
      sourceFilename,
      targetLanguage,
      extractedCvJson,
      processedCvJson,
      pdfBase64,
      docxBase64,
    ]);

    return NextResponse.json({
      success: true,
      message: 'CV analysis draft saved to PostgreSQL history.',
      id,
      item: rows[0],
    });
  } catch (error) {
    console.error('Error saving CV history to PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save CV history to PostgreSQL database.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cv/history?id=...
 * Deletes a CV history record from PostgreSQL database.
 */
export async function DELETE(req: NextRequest) {
  try {
    await initDbSchema();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id query parameter.' }, { status: 400 });
    }

    await db.query('DELETE FROM cv_history WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'CV history record deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('Error deleting CV history record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete CV history record.' },
      { status: 500 }
    );
  }
}
