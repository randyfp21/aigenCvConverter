import { CompanyTemplateConfig } from '@/types/cv';
import { COMPANY_TEMPLATES } from './companies';

const STORAGE_KEY = 'aigencv_template_history_v2';
const PDF_MAP_KEY = 'aigencv_company_pdfs_v2';

export interface UploadedCompanyPdfMap {
  [companyId: string]: {
    pdfFileName: string;
    pdfBase64?: string;
    uploadedAt: string;
  };
}

export function getStoredCompanyPdfMap(): UploadedCompanyPdfMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PDF_MAP_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read company pdf map:', e);
    return {};
  }
}

export function attachPdfToCompanyTemplate(companyId: string, pdfFileName: string, pdfBase64?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getStoredCompanyPdfMap();
    map[companyId] = {
      pdfFileName,
      pdfBase64,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    localStorage.setItem(PDF_MAP_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to attach pdf to company template:', e);
  }
}

export function getStoredTemplateHistory(): CompanyTemplateConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompanyTemplateConfig[];
  } catch (e) {
    console.error('Failed to read template history:', e);
    return [];
  }
}

export function saveTemplateToHistory(template: CompanyTemplateConfig): CompanyTemplateConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getStoredTemplateHistory();
    const updated = [template, ...history.filter((t) => t.id !== template.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Async save to PostgreSQL database
    fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    }).catch((err) => console.warn('Failed to sync template to PostgreSQL API:', err));

    return updated;
  } catch (e) {
    console.error('Failed to save template to history:', e);
    return [];
  }
}

export async function fetchTemplatesFromPgDatabase(): Promise<CompanyTemplateConfig[]> {
  try {
    const res = await fetch('/api/templates');
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.templates)) {
      // Auto-migrate any custom local templates into PostgreSQL database
      const localHistory = getStoredTemplateHistory();
      for (const localTmpl of localHistory) {
        if (!data.templates.some((dbTmpl: CompanyTemplateConfig) => dbTmpl.id === localTmpl.id)) {
          fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localTmpl),
          }).catch(() => {});
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.templates));
      return data.templates;
    }
  } catch (e) {
    console.warn('Failed to fetch templates from PostgreSQL API. Using LocalStorage fallback:', e);
  }
  return getStoredTemplateHistory();
}

export function createTemplateFromUploadedFile(
  fileName: string,
  targetCompanyId?: string,
  base64Data?: string
): CompanyTemplateConfig {
  const companyName = targetCompanyId
    ? COMPANY_TEMPLATES.find((t) => t.id === targetCompanyId)?.company_name || fileName
    : fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9\s_-]/g, '').trim();

  const palettes = [
    { primary: '#0F172A', secondary: '#38BDF8', accent: '#818CF8' }, // Slate Blue
    { primary: '#065F46', secondary: '#34D399', accent: '#A7F3D0' }, // Emerald
    { primary: '#4C1D95', secondary: '#C084FC', accent: '#DDD6FE' }, // Indigo
    { primary: '#78350F', secondary: '#F59E0B', accent: '#FBBF24' }, // Amber
  ];

  const charCodeSum = (companyName || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = palettes[charCodeSum % palettes.length];

  const templateId = targetCompanyId || `custom-tmpl-${Date.now()}`;

  const config: CompanyTemplateConfig = {
    id: templateId,
    company_name: companyName,
    code: targetCompanyId ? targetCompanyId.replace('company-', '').toUpperCase() : 'CUSTOM',
    tagline: `Official Corporate Target CV Template (${fileName})`,
    description: `Target layout parsed for company '${companyName}'. Saved for current and future conversions.`,
    isCustomUploaded: true,
    uploadedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="${palette.primary}"/>
      <path d="M30 30H70V70H30V30Z" stroke="${palette.secondary}" stroke-width="6"/>
      <circle cx="50" cy="50" r="12" fill="${palette.accent}"/>
    </svg>`,
    theme: {
      primary_color: palette.primary,
      secondary_color: palette.secondary,
      accent_color: palette.accent,
      separator_color: palette.secondary,
      text_color: '#1F2937',
      background_color: '#FFFFFF',
      font_family: 'Inter, Helvetica, Arial, sans-serif',
    },
    layout: {
      header_style: 'standard',
      columns: 1,
      section_order: [
        'personal_information',
        'summary',
        'work_experience',
        'technical_qualifications',
        'skills',
        'certifications',
        'education',
        'languages',
      ],
      section_titles: {
        summary: { en: 'Professional Profile', id: 'Profil Profesional' },
        work_experience: { en: 'Work Experience', id: 'Pengalaman Kerja' },
        technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
        skills: { en: 'Skills & Competencies', id: 'Keahlian & Kompetensi' },
        certifications: { en: 'Certifications', id: 'Sertifikasi' },
        education: { en: 'Education', id: 'Pendidikan' },
        languages: { en: 'Languages', id: 'Bahasa' },
      },
    },
  };

  if (targetCompanyId) {
    attachPdfToCompanyTemplate(targetCompanyId, fileName, base64Data);
  }
  saveTemplateToHistory(config);
  return config;
}
