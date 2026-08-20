import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/aigencv_db';

export const db = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isInitialized = false;

export async function initDbSchema() {
  if (isInitialized) return;

  const createCompaniesTableQuery = `
    CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(100) PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      code VARCHAR(50) NOT NULL,
      tagline TEXT,
      description TEXT,
      logo_svg TEXT,
      logo_url TEXT,
      company_address TEXT,
      company_website TEXT,
      company_phone TEXT,
      primary_color VARCHAR(20),
      secondary_color VARCHAR(20),
      accent_color VARCHAR(20),
      separator_color VARCHAR(20),
      text_color VARCHAR(20),
      background_color VARCHAR(20),
      font_family TEXT,
      show_page_border BOOLEAN DEFAULT TRUE,
      page_border_color VARCHAR(20) DEFAULT '#000000',
      page_border_width NUMERIC DEFAULT 1,
      layout_config JSONB,
      is_custom_uploaded BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCvHistoryTableQuery = `
    CREATE TABLE IF NOT EXISTS cv_history (
      id VARCHAR(100) PRIMARY KEY,
      candidate_name VARCHAR(255) NOT NULL,
      candidate_role VARCHAR(255),
      template_id VARCHAR(100),
      template_code VARCHAR(50),
      company_name VARCHAR(255),
      source_filename VARCHAR(255),
      target_language VARCHAR(10) DEFAULT 'en',
      extracted_cv_json JSONB NOT NULL,
      processed_cv_json JSONB NOT NULL,
      pdf_base64 TEXT,
      docx_base64 TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createCompaniesTableQuery);
    await db.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS show_page_border BOOLEAN DEFAULT TRUE;`);
    await db.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS page_border_color VARCHAR(20) DEFAULT '#000000';`);
    await db.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS page_border_width NUMERIC DEFAULT 1;`);
    await db.query(createCvHistoryTableQuery);
    isInitialized = true;
    console.log('PostgreSQL database schema initialized successfully (tables: companies, cv_history)');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL schema:', error);
  }
}
