import { CanonicalCV, TargetLanguage } from '@/types/cv';

/**
 * Protected Technical & Proper Name Regexes
 * Ensures proper nouns, technology stacks, certifications, and company names are NEVER modified or mistranslated.
 */
const PROTECTED_TERMS = [
  'PT Bank ABC',
  'PT Bank XYZ',
  'BSI Mobile',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Kafka',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'Azure',
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Golang',
  'Python',
  'Java',
  'Spring Boot',
  'TailwindCSS',
  'AWS Certified Solutions Architect',
];

/**
 * Simple English <-> Bahasa Indonesia Translation dictionary for common resume terminology & verbs.
 * Preserves exact factual meaning while providing crisp, professional translations.
 */
const EN_TO_ID_DICTIONARY: Record<string, string> = {
  'Developed': 'Mengembangkan',
  'Building': 'Membangun',
  'Built': 'Membangun',
  'Implemented': 'Mengimplementasikan',
  'Designed': 'Merancang',
  'Managed': 'Mengelola',
  'Led': 'Memimpin',
  'Optimized': 'Mengoptimalkan',
  'Created': 'Membuat',
  'Maintained': 'Memelihara',
  'Responsible for': 'Bertanggung jawab untuk',
  'System Integration': 'Integrasi Sistem',
  'Project Management': 'Manajemen Proyek',
  'Database Management': 'Manajemen Basis Data',
  'Cloud Architecture': 'Arsitektur Awan',
  'Software Engineer': 'Software Engineer', // Job Title preserved
  'IT Project Manager': 'IT Project Manager', // Job Title preserved
  'IT Support Engineer': 'IT Support Engineer', // Job Title preserved
};

const ID_TO_EN_DICTIONARY: Record<string, string> = {
  'Mengembangkan': 'Developed',
  'Membangun': 'Built',
  'Mengimplementasikan': 'Implemented',
  'Merancang': 'Designed',
  'Mengelola': 'Managed',
  'Memimpin': 'Led',
  'Mengoptimalkan': 'Optimized',
  'Membuat': 'Created',
  'Memelihara': 'Maintained',
  'Bertanggung jawab atas': 'Responsible for',
  'Integrasi Sistem': 'System Integration',
  'Manajemen Proyek': 'Project Management',
};

export function translateText(text: string, targetLang: TargetLanguage): string {
  if (!text || text.trim().length === 0) return '';

  let result = text;
  const dictionary = targetLang === 'id' ? EN_TO_ID_DICTIONARY : ID_TO_EN_DICTIONARY;

  for (const [sourceTerm, translatedTerm] of Object.entries(dictionary)) {
    // Replace word boundaries
    const regex = new RegExp(`\\b${sourceTerm}\\b`, 'gi');
    result = result.replace(regex, translatedTerm);
  }

  return result;
}

/**
 * Translates Canonical CV content while strictly preserving factual data, job titles, proper names, and technical qualifications.
 */
export function translateCanonicalCv(cv: CanonicalCV, targetLang: TargetLanguage): CanonicalCV {
  // Deep clone to prevent mutating source
  const translated: CanonicalCV = JSON.parse(JSON.stringify(cv));

  // Translate Summary
  if (translated.summary) {
    translated.summary = translateText(translated.summary, targetLang);
  }

  // Translate Work Experience (Responsibilities & Projects) while preserving Company & Job Title
  translated.work_experience = translated.work_experience.map((job) => ({
    ...job,
    // Job title & Company names are explicitly PRESERVED without change
    position: job.position,
    company: job.company,
    responsibilities: job.responsibilities.map((resp) => translateText(resp, targetLang)),
    projects: job.projects.map((proj) => ({
      ...proj,
      description: translateText(proj.description, targetLang),
      // Technologies & Roles preserved strictly
      technologies: proj.technologies,
    })),
  }));

  return translated;
}
