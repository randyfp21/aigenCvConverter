export interface PersonalInformation {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  role?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string[];
  projects: Project[];
}

export interface SkillCategories {
  programming_languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  devops: string[];
  tools: string[];
  other: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential_id?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface ProvenanceSource {
  field: string;
  value: string;
  source_page?: number;
  confidence: number;
}

export interface CanonicalCV {
  personal_information: PersonalInformation;
  role: string;
  years_of_experience: string;
  seniority_level: 'Junior' | 'Middle' | 'Senior';
  total_years_num: number;
  about_me: string;
  summary: string;
  work_experience: WorkExperience[];
  technical_qualifications: string[];
  skills: SkillCategories;
  certifications: Certification[];
  education: Education[];
  languages: Language[];
  additional_information: string[];
  meta: {
    extraction_confidence: number;
    source_stats: {
      work_experience_count: number;
      skills_count: number;
      certifications_count: number;
      education_count: number;
    };
    provenance?: ProvenanceSource[];
  };
}

export type TargetLanguage = 'en' | 'id';

export interface CompanyTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  font_family: string;
}

export interface CompanyTemplateConfig {
  id: string;
  company_name: string;
  code: string;
  tagline: string;
  description: string;
  logo_svg: string;
  company_address?: string;
  company_phone?: string;
  isCustomUploaded?: boolean;
  uploadedAt?: string;
  templateDocxBuffer?: Buffer;
  theme: CompanyTheme;
  layout: {
    header_style: 'standard' | 'centered' | 'banner' | 'sidebar';
    columns: 1 | 2;
    section_order: string[];
    section_titles: Record<string, { en: string; id: string }>;
  };
}

export interface FileMetadata {
  name: string;
  sizeBytes: number;
  mimeType: string;
  extension: 'pdf' | 'docx';
}

export interface ValidationStageResult {
  stage: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: Record<string, unknown>;
}

export interface FinalValidationReport {
  isValid: boolean;
  stages: ValidationStageResult[];
  dataLossCheck: {
    sourceWorkExperiences: number;
    outputWorkExperiences: number;
    sourceCertifications: number;
    outputCertifications: number;
    sourceTechnicalQualifications: number;
    outputTechnicalQualifications: number;
    passed: boolean;
    unresolvedPlaceholders: number;
  };
  errors: string[];
  warnings: string[];
}

export interface ConversionJob {
  id: string;
  uploadedFile?: FileMetadata;
  extractedCV?: CanonicalCV;
  selectedTemplateId: string;
  targetLanguage: TargetLanguage;
  currentStep: 'upload' | 'template' | 'language' | 'review' | 'converting' | 'preview';
  validationReport?: FinalValidationReport;
  outputPdfUrl?: string;
  outputDocxUrl?: string;
}
