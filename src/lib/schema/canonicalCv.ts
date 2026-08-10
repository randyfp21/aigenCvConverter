import { z } from 'zod';

export const PersonalInformationSchema = z.object({
  full_name: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  linkedin: z.string().optional().default(''),
  website: z.string().optional().default(''),
});

export const ProjectSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional().default(''),
});

export const WorkExperienceSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  company: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  is_current: z.boolean().default(false),
  responsibilities: z.array(z.string()).default([]),
  projects: z.array(ProjectSchema).default([]),
});

export const SkillCategoriesSchema = z.object({
  programming_languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
  cloud: z.array(z.string()).default([]),
  devops: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  other: z.array(z.string()).default([]),
});

export const CertificationSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  name: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  credential_id: z.string().optional().default(''),
});

export const EducationSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  institution: z.string().default(''),
  degree: z.string().default(''),
  field_of_study: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
});

export const LanguageSchema = z.object({
  language: z.string().default(''),
  proficiency: z.string().default(''),
});

export const CanonicalCVSchema = z.object({
  personal_information: PersonalInformationSchema,
  role: z.string().default('Candidate'),
  years_of_experience: z.string().default('1 Year'),
  seniority_level: z.enum(['Junior', 'Middle', 'Senior']).default('Junior'),
  total_years_num: z.number().default(1),
  about_me: z.string().default(''),
  summary: z.string().default(''),
  work_experience: z.array(WorkExperienceSchema).default([]),
  technical_qualifications: z.array(z.string()).default([]),
  skills: SkillCategoriesSchema,
  certifications: z.array(CertificationSchema).default([]),
  education: z.array(EducationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  additional_information: z.array(z.string()).default([]),
  meta: z.object({
    extraction_confidence: z.number().default(1.0),
    source_stats: z.object({
      work_experience_count: z.number().default(0),
      skills_count: z.number().default(0),
      certifications_count: z.number().default(0),
      education_count: z.number().default(0),
    }).default({
      work_experience_count: 0,
      skills_count: 0,
      certifications_count: 0,
      education_count: 0,
    }),
  }).default({
    extraction_confidence: 1.0,
    source_stats: {
      work_experience_count: 0,
      skills_count: 0,
      certifications_count: 0,
      education_count: 0,
    },
  }),
});
