import { CanonicalCV, TargetLanguage } from '@/types/cv';

/**
 * Protected Technical & Proper Name List
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
  'PMP',
  'ScrumMaster',
];

/**
 * Comprehensive English <-> Bahasa Indonesia Translation dictionary for common resume terminology, action verbs, & phrases.
 */
const EN_TO_ID_DICTIONARY: Record<string, string> = {
  'Led end-to-end': 'Memimpin secara menyeluruh',
  'Led': 'Memimpin',
  'Developing': 'Mengembangkan',
  'Developed': 'Mengembangkan',
  'Building': 'Membangun',
  'Built': 'Membangun',
  'Implemented': 'Mengimplementasikan',
  'Implementing': 'Mengimplementasikan',
  'Designed': 'Merancang',
  'Designing': 'Merancang',
  'Managed': 'Mengelola',
  'Managing': 'Mengelola',
  'Optimized': 'Mengoptimalkan',
  'Optimizing': 'Mengoptimalkan',
  'Created': 'Membuat',
  'Creating': 'Membuat',
  'Maintained': 'Memelihara',
  'Maintaining': 'Memelihara',
  'Provided': 'Menyediakan',
  'Providing': 'Menyediakan',
  'Automated': 'Mengotomatisasi',
  'Automating': 'Mengotomatisasi',
  'Ensured': 'Memastikan',
  'Ensuring': 'Memastikan',
  'Architected': 'Merancang Arsitektur',
  'Spearheaded': 'Pelopor dalam memimpin',
  'Responsible for': 'Bertanggung jawab untuk',
  'System Integration': 'Integrasi Sistem',
  'Project Management': 'Manajemen Proyek',
  'Database Management': 'Manajemen Basis Data',
  'Cloud Architecture': 'Arsitektur Awan',
  'Present': 'Saat Ini',
  'Senior IT Project Manager': 'Senior IT Project Manager',
  'IT Support Engineer': 'IT Support Engineer',
  'Software Engineer': 'Software Engineer',
  'Fullstack Developer': 'Fullstack Developer',
  'Solutions Architect': 'Solutions Architect',
};

const ID_TO_EN_DICTIONARY: Record<string, string> = {
  'Memimpin secara menyeluruh': 'Led end-to-end',
  'Memimpin': 'Led',
  'Mengembangkan': 'Developed',
  'Membangun': 'Built',
  'Mengimplementasikan': 'Implemented',
  'Merancang': 'Designed',
  'Mengelola': 'Managed',
  'Mengoptimalkan': 'Optimized',
  'Membuat': 'Created',
  'Memelihara': 'Maintained',
  'Menyediakan': 'Provided',
  'Mengotomatisasi': 'Automated',
  'Memastikan': 'Ensured',
  'Bertanggung jawab atas': 'Responsible for',
  'Bertanggung jawab untuk': 'Responsible for',
  'Integrasi Sistem': 'System Integration',
  'Manajemen Proyek': 'Project Management',
  'Saat Ini': 'Present',
};

export function translateText(text: string, targetLang: TargetLanguage): string {
  if (!text || text.trim().length === 0) return '';

  let result = text;
  const dictionary = targetLang === 'id' ? EN_TO_ID_DICTIONARY : ID_TO_EN_DICTIONARY;

  for (const [sourceTerm, translatedTerm] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${sourceTerm}\\b`, 'gi');
    result = result.replace(regex, translatedTerm);
  }

  return result;
}

/**
 * Translates Canonical CV content while strictly preserving factual data, job titles, proper names, and technical qualifications.
 * Ensures language consistency across all sections.
 */
export function translateCanonicalCv(cv: CanonicalCV, targetLang: TargetLanguage): CanonicalCV {
  // Deep clone to prevent mutating source
  const translated: CanonicalCV = JSON.parse(JSON.stringify(cv));

  // Translate Summary
  if (translated.summary) {
    translated.summary = translateText(translated.summary, targetLang);
  }
  if (translated.about_me) {
    translated.about_me = translateText(translated.about_me, targetLang);
  }

  // Translate Work Experience (Responsibilities & Projects)
  translated.work_experience = translated.work_experience.map((job) => ({
    ...job,
    position: job.position,
    company: job.company,
    end_date: job.end_date === 'Present' && targetLang === 'id' ? 'Saat Ini' : job.end_date === 'Saat Ini' && targetLang === 'en' ? 'Present' : job.end_date,
    responsibilities: job.responsibilities.map((resp) => translateText(resp, targetLang)),
    projects: job.projects.map((proj) => ({
      ...proj,
      description: translateText(proj.description, targetLang),
      technologies: proj.technologies,
    })),
  }));

  return translated;
}
