import { CompanyTemplateConfig } from '@/types/cv';

export const COMPANY_TEMPLATES: CompanyTemplateConfig[] = [
  {
    id: 'company-aigen',
    company_name: 'PT Aigen Global Teknologi',
    code: 'AIGEN',
    tagline: 'AI & Advanced Enterprise Software Solutions',
    description: 'Official corporate CV template with deep navy and cyan highlights, executive technical summary, and structured qualifications matrix.',
    company_address: 'Menara Aigen, Jl. HR Rasuna Said Blok X-5, Jakarta Selatan 12950',
    company_website: 'www.aigen.co.id',
    company_phone: '+62 21 520 8890',
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#0F172A"/>
      <path d="M30 70V30L50 50L70 30V70" stroke="#38BDF8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="50" cy="70" r="6" fill="#818CF8"/>
    </svg>`,
    theme: {
      primary_color: '#0F172A',
      secondary_color: '#0284C7',
      accent_color: '#38BDF8',
      separator_color: '#0284C7',
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
        summary: { en: 'Executive Summary', id: 'Ringkasan Eksekutif' },
        work_experience: { en: 'Professional Experience', id: 'Pengalaman Kerja' },
        technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
        skills: { en: 'Technical Skills & Competencies', id: 'Keahlian & Kompetensi Teknikal' },
        certifications: { en: 'Professional Certifications', id: 'Sertifikasi Profesional' },
        education: { en: 'Education & Academic History', id: 'Pendidikan' },
        languages: { en: 'Languages', id: 'Bahasa' },
      },
    },
  },
  {
    id: 'company-gsg',
    company_name: 'PT Gudang Solusi Group',
    code: 'GSG',
    tagline: 'Integrated Business & Enterprise Technology Consultancy',
    description: 'Clean emerald corporate template featuring a side-by-side profile summary, prominent certifications list, and linear career timeline.',
    company_address: 'Gudang Solusi Plaza, Jl. Jend. Sudirman Kav. 52-53, Jakarta Pusat 12190',
    company_website: 'www.gudangsolusi.com',
    company_phone: '+62 21 515 9900',
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#065F46"/>
      <circle cx="50" cy="50" r="28" stroke="#34D399" stroke-width="7"/>
      <path d="M35 50H65M50 35V65" stroke="#A7F3D0" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    theme: {
      primary_color: '#065F46',
      secondary_color: '#10B981',
      accent_color: '#047857',
      separator_color: '#10B981',
      text_color: '#111827',
      background_color: '#FFFFFF',
      font_family: 'Arial, sans-serif',
    },
    layout: {
      header_style: 'banner',
      columns: 1,
      section_order: [
        'personal_information',
        'summary',
        'technical_qualifications',
        'work_experience',
        'certifications',
        'skills',
        'education',
        'languages',
      ],
      section_titles: {
        summary: { en: 'Professional Profile', id: 'Profil Profesional' },
        work_experience: { en: 'Career History', id: 'Riwayat Karir' },
        technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
        skills: { en: 'Core Skills', id: 'Keahlian Utama' },
        certifications: { en: 'Certifications & Accreditations', id: 'Sertifikasi & Akreditasi' },
        education: { en: 'Education', id: 'Pendidikan' },
        languages: { en: 'Languages', id: 'Bahasa' },
      },
    },
  },
  {
    id: 'company-nft',
    company_name: 'PT NFT',
    code: 'NFT',
    tagline: 'Next-Gen Innovation, Web3 & Tech Architecture Labs',
    description: 'Modern indigo template with highlighted project portfolios per employment record and dynamic badge-style skills presentation.',
    company_address: 'NFT Innovation Hub, Jl. TB Simatupang No. 88, Jakarta Selatan 12430',
    company_website: 'www.nftlabs.io',
    company_phone: '+62 21 788 4430',
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#4C1D95"/>
      <path d="M30 35L50 20L70 35V65L50 80L30 65V35Z" stroke="#C084FC" stroke-width="6" stroke-linejoin="round"/>
      <path d="M50 20V80M30 35L70 65M70 35L30 65" stroke="#DDD6FE" stroke-width="4"/>
    </svg>`,
    theme: {
      primary_color: '#4C1D95',
      secondary_color: '#8B5CF6',
      accent_color: '#6D28D9',
      separator_color: '#8B5CF6',
      text_color: '#1F2937',
      background_color: '#FFFFFF',
      font_family: 'Helvetica, Arial, sans-serif',
    },
    layout: {
      header_style: 'centered',
      columns: 1,
      section_order: [
        'personal_information',
        'summary',
        'work_experience',
        'skills',
        'technical_qualifications',
        'certifications',
        'education',
        'languages',
      ],
      section_titles: {
        summary: { en: 'About Me', id: 'Tentang Saya' },
        work_experience: { en: 'Employment Experience & Key Projects', id: 'Pengalaman Kerja & Proyek Utama' },
        technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
        skills: { en: 'Tech Stack & Competencies', id: 'Teknologi & Kompetensi' },
        certifications: { en: 'Certifications', id: 'Sertifikasi' },
        education: { en: 'Academic Education', id: 'Pendidikan Akademik' },
        languages: { en: 'Language Proficiency', id: 'Kemampuan Bahasa' },
      },
    },
  },
  {
    id: 'company-rombags',
    company_name: 'PT Rombag Teknoware',
    code: 'ROMBAGS',
    tagline: 'High-Performance Software Engineering & Digital Infrastructure',
    description: 'Amber and Charcoal engineering template with bold section titles, compact project details, and executive technical competencies.',
    company_address: 'Rombags Tech Tower, Jl. Boulevard Barat Raya, Kelapa Gading, Jakarta Utara 14240',
    company_website: 'www.rombags.tech',
    company_phone: '+62 21 458 1120',
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#78350F"/>
      <path d="M25 40L50 25L75 40V70L50 85L25 70V40Z" stroke="#F59E0B" stroke-width="6"/>
      <circle cx="50" cy="55" r="12" fill="#FBBF24"/>
    </svg>`,
    theme: {
      primary_color: '#78350F',
      secondary_color: '#D97706',
      accent_color: '#B45309',
      separator_color: '#D97706',
      text_color: '#1F2937',
      background_color: '#FFFFFF',
      font_family: 'Arial, sans-serif',
    },
    layout: {
      header_style: 'standard',
      columns: 1,
      section_order: [
        'personal_information',
        'summary',
        'work_experience',
        'technical_qualifications',
        'certifications',
        'skills',
        'education',
        'languages',
      ],
      section_titles: {
        summary: { en: 'Executive Profile', id: 'Profil Eksekutif' },
        work_experience: { en: 'Professional Experience', id: 'Pengalaman Kerja' },
        technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
        skills: { en: 'Engineering Skills', id: 'Keahlian Teknikal' },
        certifications: { en: 'Certifications', id: 'Sertifikasi' },
        education: { en: 'Education', id: 'Pendidikan' },
        languages: { en: 'Languages', id: 'Bahasa' },
      },
    },
  },
];

export function getCompanyTemplate(id: string): CompanyTemplateConfig {
  const template = COMPANY_TEMPLATES.find((t) => t.id === id || t.code === id || t.company_name === id);
  if (template) return template;

  return {
    id: id || 'custom-tmpl',
    company_name: 'Custom Company PT',
    code: 'CUSTOM',
    tagline: 'Custom Corporate Template',
    description: 'Custom corporate PT template.',
    company_address: 'Jakarta, Indonesia',
    company_website: 'www.company.com',
    company_phone: '+62 21 500 8000',
    logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#0F766E"/>
      <path d="M30 30H70V70H30V30Z" stroke="#14B8A6" stroke-width="6"/>
    </svg>`,
    theme: {
      primary_color: '#0F766E',
      secondary_color: '#14B8A6',
      accent_color: '#0D9488',
      separator_color: '#14B8A6',
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
}
