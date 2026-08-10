import { NextRequest, NextResponse } from 'next/server';
import { db, initDbSchema } from '@/lib/db';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { CompanyTemplateConfig } from '@/types/cv';

export const dynamic = 'force-dynamic';

/**
 * GET /api/templates
 * Fetches all company templates from PostgreSQL database.
 * Auto-seeds default templates if the database table is empty.
 */
export async function GET() {
  try {
    await initDbSchema();

    const { rows } = await db.query(
      'SELECT * FROM companies ORDER BY is_custom_uploaded ASC, created_at ASC'
    );

    // If database is empty, seed default official templates into PostgreSQL
    if (rows.length === 0) {
      console.log('Seeding default company templates into PostgreSQL database...');
      for (const tmpl of COMPANY_TEMPLATES) {
        await db.query(
          `INSERT INTO companies (
            id, company_name, code, tagline, description, logo_svg, logo_url,
            company_address, company_website, company_phone,
            primary_color, secondary_color, accent_color, separator_color, text_color, background_color, font_family,
            layout_config, is_custom_uploaded
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO NOTHING`,
          [
            tmpl.id,
            tmpl.company_name,
            tmpl.code,
            tmpl.tagline,
            tmpl.description,
            tmpl.logo_svg,
            tmpl.logo_url || '',
            tmpl.company_address || 'Jakarta, Indonesia',
            tmpl.company_website || 'www.company.com',
            tmpl.company_phone || '+62 21 500 8000',
            tmpl.theme.primary_color,
            tmpl.theme.secondary_color,
            tmpl.theme.accent_color,
            tmpl.theme.separator_color || tmpl.theme.secondary_color,
            tmpl.theme.text_color,
            tmpl.theme.background_color,
            tmpl.theme.font_family,
            JSON.stringify(tmpl.layout),
            Boolean(tmpl.isCustomUploaded),
          ]
        );
      }

      return NextResponse.json({
        success: true,
        source: 'postgresql-seeded',
        templates: COMPANY_TEMPLATES,
      });
    }

    const templates: CompanyTemplateConfig[] = rows.map((r) => ({
      id: r.id,
      company_name: r.company_name,
      code: r.code,
      tagline: r.tagline,
      description: r.description,
      logo_svg: r.logo_svg,
      logo_url: r.logo_url,
      company_address: r.company_address,
      company_website: r.company_website,
      company_phone: r.company_phone,
      isCustomUploaded: r.is_custom_uploaded,
      theme: {
        primary_color: r.primary_color,
        secondary_color: r.secondary_color,
        accent_color: r.accent_color,
        separator_color: r.separator_color,
        text_color: r.text_color,
        background_color: r.background_color,
        font_family: r.font_family,
      },
      layout: typeof r.layout_config === 'string' ? JSON.parse(r.layout_config) : r.layout_config,
    }));

    return NextResponse.json({
      success: true,
      source: 'postgresql',
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.error('Error fetching templates from PostgreSQL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates from database.',
        fallbackTemplates: COMPANY_TEMPLATES,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates
 * Upserts a company template (creates or updates) directly in PostgreSQL database.
 */
export async function POST(req: NextRequest) {
  try {
    await initDbSchema();
    const body = (await req.json()) as CompanyTemplateConfig;

    if (!body.id || !body.company_name) {
      return NextResponse.json({ success: false, error: 'Missing required fields (id, company_name)' }, { status: 400 });
    }

    const upsertQuery = `
      INSERT INTO companies (
        id, company_name, code, tagline, description, logo_svg, logo_url,
        company_address, company_website, company_phone,
        primary_color, secondary_color, accent_color, separator_color, text_color, background_color, font_family,
        layout_config, is_custom_uploaded, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        code = EXCLUDED.code,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        logo_svg = EXCLUDED.logo_svg,
        logo_url = EXCLUDED.logo_url,
        company_address = EXCLUDED.company_address,
        company_website = EXCLUDED.company_website,
        company_phone = EXCLUDED.company_phone,
        primary_color = EXCLUDED.primary_color,
        secondary_color = EXCLUDED.secondary_color,
        accent_color = EXCLUDED.accent_color,
        separator_color = EXCLUDED.separator_color,
        text_color = EXCLUDED.text_color,
        background_color = EXCLUDED.background_color,
        font_family = EXCLUDED.font_family,
        layout_config = EXCLUDED.layout_config,
        is_custom_uploaded = EXCLUDED.is_custom_uploaded,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const { rows } = await db.query(upsertQuery, [
      body.id,
      body.company_name,
      body.code || 'PT',
      body.tagline || '',
      body.description || '',
      body.logo_svg || '',
      body.logo_url || '',
      body.company_address || 'Jakarta, Indonesia',
      body.company_website || 'www.company.com',
      body.company_phone || '+62 21 500 8000',
      body.theme?.primary_color || '#0F172A',
      body.theme?.secondary_color || '#0284C7',
      body.theme?.accent_color || '#818CF8',
      body.theme?.separator_color || body.theme?.secondary_color || '#0284C7',
      body.theme?.text_color || '#1F2937',
      body.theme?.background_color || '#FFFFFF',
      body.theme?.font_family || 'Inter, sans-serif',
      JSON.stringify(body.layout || {}),
      Boolean(body.isCustomUploaded),
    ]);

    console.log(`Saved company template '${body.company_name}' to PostgreSQL database.`);

    return NextResponse.json({
      success: true,
      message: 'Company template saved to PostgreSQL successfully.',
      template: body,
      dbRow: rows[0],
    });
  } catch (error) {
    console.error('Error saving template to PostgreSQL:', error);
    return NextResponse.json({ success: false, error: 'Failed to save template to PostgreSQL.' }, { status: 500 });
  }
}
