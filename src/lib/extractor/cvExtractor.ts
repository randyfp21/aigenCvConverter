import { CanonicalCV, WorkExperience } from '@/types/cv';

/**
 * Calculates total years of experience from work history dates.
 */
export function calculateExperienceSeniority(workExperiences: Array<{ start_date: string; end_date: string }>): {
  totalYears: number;
  seniority: 'Junior' | 'Middle' | 'Senior';
  formattedString: string;
} {
  if (!workExperiences || workExperiences.length === 0) {
    return { totalYears: 1, seniority: 'Junior', formattedString: 'Junior (1 Year)' };
  }

  let minYear = 2030;
  let maxYear = 1970;
  const currentYear = new Date().getFullYear();

  for (const job of workExperiences) {
    const datesText = `${job.start_date} ${job.end_date}`;
    const yearMatches = datesText.match(/\b(19\d\d|20\d\d)\b/g);

    if (yearMatches) {
      for (const yStr of yearMatches) {
        const y = parseInt(yStr, 10);
        if (y < minYear) minYear = y;
        if (y > maxYear) maxYear = y;
      }
    }

    if (/present|current|sekarang|saat ini|hingga kini/i.test(job.end_date)) {
      maxYear = currentYear;
    }
  }

  if (minYear === 2030 || maxYear === 1970) {
    const est = Math.max(1, workExperiences.length * 2);
    const sen = est >= 5 ? 'Senior' : est >= 3 ? 'Middle' : 'Junior';
    return { totalYears: est, seniority: sen, formattedString: `${sen} (${est} Years)` };
  }

  const calculatedYears = Math.max(1, maxYear - minYear + 1);
  let seniority: 'Junior' | 'Middle' | 'Senior' = 'Junior';

  if (calculatedYears >= 5) {
    seniority = 'Senior';
  } else if (calculatedYears >= 3) {
    seniority = 'Middle';
  } else {
    seniority = 'Junior';
  }

  return {
    totalYears: calculatedYears,
    seniority,
    formattedString: `${seniority} (${calculatedYears} Year${calculatedYears > 1 ? 's' : ''})`,
  };
}

/**
 * Normalizes text line to compare against section header dictionary.
 */
function normalizeHeaderLine(line: string): string {
  return line
    .toLowerCase()
    .replace(/^[\d\w][.\s\-•)]+/, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Generates a concise, punchy 2-3 sentence executive "About Me" summary.
 */
export function generateConciseAboutMe(
  fullName: string,
  role: string,
  seniorityFormatted: string,
  topSkills: string[],
  workExpCount: number,
  existingSummary?: string
): string {
  if (existingSummary && existingSummary.length > 20 && existingSummary.length < 280) {
    return existingSummary.trim();
  }

  const skillsStr = topSkills.slice(0, 4).join(', ');
  const skillsPhrase = skillsStr ? ` specializing in ${skillsStr}` : '';

  return `Results-driven ${role} with ${seniorityFormatted} of experience across ${workExpCount || 'enterprise'} professional roles${skillsPhrase}. Proven track record in software engineering, system integration, and delivering scalable technology solutions.`;
}

/**
 * Ultra-Resilient Work Experience Extractor
 * Strictly ignores contact lines (emails, phone numbers, addresses, social links) and extracts:
 * - Perusahaan (Company)
 * - Role / Position
 * - Lama Kerja (Start & End Date)
 * - Detail Responsibilities
 */
export function parseWorkExperiences(lines: string[]): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  if (lines.length === 0) return experiences;

  // Filter out contact lines (email, phone, address, linkedin, github)
  const isContactLine = (l: string) =>
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(l) ||
    /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/.test(l) ||
    /linkedin\.com|github\.com|http|www\./i.test(l);

  const cleanLines = lines.filter((l) => !isContactLine(l));
  if (cleanLines.length === 0) return experiences;

  const jobTitleKeywords = /engineer|manager|developer|architect|analyst|lead|consultant|specialist|officer|staff|administrator|designer|director|head|supervisor|intern|magang|pengembang|manajer|pranata|tenaga|programer|programmer/i;
  const companyKeywords = /pt\s|inc\b|ltd\b|corp\b|group\b|tech\b|solutions\b|bank\b|studio\b|indonesia|nusa| global| digital| labs|agency|consulting|freelance|self-employed/i;
  const datePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|\d{1,2}\/\d{2,4}|\b\d{4}\b)\s*[-–—to\s]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|\d{1,2}\/\d{2,4}|\b\d{4}\b|present|current|sekarang|saat ini|\bnow\b)|\b\d{4}\s*[-–—]\s*\d{4}\b)/i;

  let currentJob: {
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    responsibilities: string[];
  } | null = null;

  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i].trim();
    if (!line) continue;

    const hasDate = datePattern.test(line);
    const hasJobTitle = jobTitleKeywords.test(line);
    const hasCompany = companyKeywords.test(line);
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+[.)]/.test(line);

    // Entry header trigger: Line has Date OR (JobTitle/Company AND NOT bullet point)
    if (!isBullet && (hasDate || hasJobTitle || hasCompany)) {
      if (currentJob && (currentJob.position || currentJob.company)) {
        experiences.push({
          id: Math.random().toString(36).substring(2, 9),
          ...currentJob,
          projects: [],
        });
      }

      const dateMatch = line.match(datePattern);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const isCurrent = /present|current|sekarang|saat ini|now/i.test(dateStr);

      const cleanLine = line.replace(dateStr, '').replace(/[()]/g, '').trim();
      const parts = cleanLine.split(/[-|–—•@]/).map((p) => p.trim()).filter((p) => p.length > 0);

      let position = '';
      let company = '';

      if (parts.length >= 2) {
        if (jobTitleKeywords.test(parts[0])) {
          position = parts[0];
          company = parts[1];
        } else {
          company = parts[0];
          position = parts[1];
        }
      } else if (parts.length === 1) {
        if (hasJobTitle) {
          position = parts[0];
          if (i + 1 < cleanLines.length && !datePattern.test(cleanLines[i + 1]) && !cleanLines[i + 1].startsWith('•')) {
            company = cleanLines[i + 1].trim();
            i++;
          } else {
            company = 'Company / Enterprise';
          }
        } else {
          company = parts[0];
          position = 'Professional Role';
        }
      } else {
        position = 'Professional Role';
        company = 'Company / Enterprise';
      }

      const datesSplit = dateStr.split(/[-–—to]+/i).map((d) => d.trim());
      const startDate = datesSplit[0] || '';
      const endDate = datesSplit[1] || (isCurrent ? 'Present' : '');

      currentJob = {
        company,
        position,
        location: '',
        start_date: startDate,
        end_date: endDate,
        is_current: isCurrent,
        responsibilities: [],
      };
    } else if (currentJob) {
      const cleanBullet = line.replace(/^[•\-*\d.+)]\s*/, '').trim();
      if (cleanBullet.length > 0 && cleanBullet.length < 350) {
        currentJob.responsibilities.push(cleanBullet);
      }
    }
  }

  if (currentJob && (currentJob.position || currentJob.company)) {
    experiences.push({
      id: Math.random().toString(36).substring(2, 9),
      ...currentJob,
      projects: [],
    });
  }

  return experiences;
}

/**
 * Ultra-Robust CV Parser & Qualification Engine
 */
export function extractCanonicalCvFromText(rawText: string): CanonicalCV {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const cv: CanonicalCV = {
    personal_information: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    role: 'Candidate',
    years_of_experience: 'Junior (1 Year)',
    seniority_level: 'Junior',
    total_years_num: 1,
    about_me: '',
    summary: '',
    work_experience: [],
    technical_qualifications: [],
    skills: {
      programming_languages: [],
      frameworks: [],
      databases: [],
      cloud: [],
      devops: [],
      tools: [],
      other: [],
    },
    certifications: [],
    education: [],
    languages: [],
    additional_information: [],
    meta: {
      extraction_confidence: 0.98,
      source_stats: {
        work_experience_count: 0,
        skills_count: 0,
        certifications_count: 0,
        education_count: 0,
      },
    },
  };

  if (lines.length === 0) return cv;

  // Contact Regexes
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/g;
  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;

  // 1. Extract Contact Info & Candidate Full Name
  for (const line of lines.slice(0, 20)) {
    const emailMatches = line.match(emailRegex);
    if (emailMatches && !cv.personal_information.email) {
      cv.personal_information.email = emailMatches[0];
    }
    const linkedinMatches = line.match(linkedinRegex);
    if (linkedinMatches && !cv.personal_information.linkedin) {
      cv.personal_information.linkedin = linkedinMatches[0];
    }
    const phoneMatches = line.match(phoneRegex);
    if (phoneMatches && !cv.personal_information.phone) {
      const p = phoneMatches[0].trim();
      if (p.length >= 7 && !p.includes('@')) {
        cv.personal_information.phone = p;
      }
    }
  }

  // Full Name is the first line that does NOT contain contact details
  for (const line of lines.slice(0, 5)) {
    if (!line.includes('@') && !line.includes('http') && !phoneRegex.test(line) && line.length < 50) {
      cv.personal_information.full_name = line;
      break;
    }
  }
  if (!cv.personal_information.full_name) {
    cv.personal_information.full_name = lines[0] || 'Candidate';
  }

  // Extract candidate headline / role from top header lines (e.g. "Fullstack JavaScript Developer")
  for (const line of lines.slice(1, 6)) {
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !phoneRegex.test(line) &&
      /developer|engineer|manager|architect|analyst|designer|consultant|specialist|lead/i.test(line)
    ) {
      cv.role = line;
      break;
    }
  }

  // 2. Comprehensive Multilingual Section Headers
  type SectionKey =
    | 'summary'
    | 'work_experience'
    | 'technical_qualifications'
    | 'skills'
    | 'certifications'
    | 'education'
    | 'languages'
    | 'other';

  const sectionContent: Record<SectionKey, string[]> = {
    summary: [],
    work_experience: [],
    technical_qualifications: [],
    skills: [],
    certifications: [],
    education: [],
    languages: [],
    other: [],
  };

  const sectionHeaders: Record<string, SectionKey> = {
    'profile': 'summary',
    'summary': 'summary',
    'about me': 'summary',
    'about': 'summary',
    'profil': 'summary',
    'tentang saya': 'summary',
    'ringkasan': 'summary',
    'ringkasan eksekutif': 'summary',
    'executive summary': 'summary',
    'professional summary': 'summary',
    'personal profile': 'summary',
    'work experience': 'work_experience',
    'professional experience': 'work_experience',
    'employment history': 'work_experience',
    'career history': 'work_experience',
    'experience': 'work_experience',
    'pengalaman kerja': 'work_experience',
    'riwayat pekerjaan': 'work_experience',
    'pengalaman profesional': 'work_experience',
    'riwayat karir': 'work_experience',
    'pengalaman': 'work_experience',
    'work history': 'work_experience',
    'career overview': 'work_experience',
    'technical qualification': 'technical_qualifications',
    'technical qualifications': 'technical_qualifications',
    'qualifications': 'technical_qualifications',
    'technical skills': 'skills',
    'skills': 'skills',
    'competencies': 'skills',
    'keahlian': 'skills',
    'keterampilan': 'skills',
    'kompetensi': 'skills',
    'kualifikasi': 'technical_qualifications',
    'kualifikasi teknikal': 'technical_qualifications',
    'tech stack': 'technical_qualifications',
    'technologies': 'technical_qualifications',
    'certifications': 'certifications',
    'certification': 'certifications',
    'licenses & certifications': 'certifications',
    'sertifikasi': 'certifications',
    'sertifikat': 'certifications',
    'education': 'education',
    'academic history': 'education',
    'pendidikan': 'education',
    'riwayat pendidikan': 'education',
    'languages': 'languages',
    'bahasa': 'languages',
  };

  let currentSection: SectionKey = 'other';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const normalized = normalizeHeaderLine(line);

    let isHeader = false;
    for (const [headerText, targetKey] of Object.entries(sectionHeaders)) {
      if (normalized === headerText || normalized === headerText + 's') {
        currentSection = targetKey;
        isHeader = true;
        break;
      }
    }

    if (!isHeader) {
      sectionContent[currentSection].push(line);
    }
  }

  // 3. Process Work Experiences
  const workLines = [...sectionContent.work_experience];
  if (workLines.length === 0 && sectionContent.other.length > 0) {
    for (const l of sectionContent.other) {
      if (/engineer|manager|developer|analyst|lead|consultant|specialist|officer|staff|pt |inc|ltd|\d{4}/i.test(l)) {
        workLines.push(l);
      }
    }
  }

  cv.work_experience = parseWorkExperiences(workLines);

  // 4. Set Candidate Role if not found in header
  if (cv.role === 'Candidate' && cv.work_experience.length > 0 && cv.work_experience[0].position) {
    cv.role = cv.work_experience[0].position;
  }

  // 5. Calculate Seniority & Experience
  const expCalc = calculateExperienceSeniority(cv.work_experience);
  cv.total_years_num = expCalc.totalYears;
  cv.seniority_level = expCalc.seniority;
  cv.years_of_experience = expCalc.formattedString;

  // 6. Process Technical Qualifications
  const combinedSkillLines = [...sectionContent.technical_qualifications, ...sectionContent.skills];
  const detectedSkills: string[] = [];

  for (const line of combinedSkillLines) {
    const items = line.split(/[,;|•]/).map((s) => s.trim()).filter((s) => s.length > 0 && s.length < 40);
    detectedSkills.push(...items);
  }

  if (detectedSkills.length === 0) {
    const commonTechTerms = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'Golang', 'Go', 'C++', 'C#', 'PHP', 'SQL',
      'React', 'Next.js', 'Node.js', 'Express', 'Vue', 'Angular', 'Spring Boot', 'Tailwind',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Git'
    ];
    for (const line of lines) {
      for (const tech of commonTechTerms) {
        const regex = new RegExp(`\\b${tech}\\b`, 'i');
        if (regex.test(line) && !detectedSkills.includes(tech)) {
          detectedSkills.push(tech);
        }
      }
    }
  }
  cv.technical_qualifications = Array.from(new Set(detectedSkills));

  // 7. Concise About Me Generator
  const rawSummaryText = sectionContent.summary.join(' ');
  cv.about_me = generateConciseAboutMe(
    cv.personal_information.full_name,
    cv.role,
    cv.years_of_experience,
    cv.technical_qualifications,
    cv.work_experience.length,
    rawSummaryText
  );
  cv.summary = cv.about_me;

  // 8. Process Certifications
  const certLines = [...sectionContent.certifications];
  if (certLines.length === 0) {
    for (const line of lines) {
      if (/certified|certification|sertifikasi|sertifikat|aws|pmp|scrummaster|csm|iso-/i.test(line) && !line.includes('@')) {
        certLines.push(line);
      }
    }
  }

  for (const certLine of certLines) {
    const cleanCert = certLine.replace(/^[•\-*]\s*/, '').trim();
    if (cleanCert.length > 0) {
      cv.certifications.push({
        id: Math.random().toString(36).substring(2, 9),
        name: cleanCert,
        issuer: '',
        date: '',
      });
    }
  }

  // 9. Process Education
  const eduLines = [...sectionContent.education];
  if (eduLines.length === 0) {
    for (const line of lines) {
      if (/universitas|university|institut|polytechnic|politeknik|bachelor|master|s1|s2|diploma|computer science|teknik/i.test(line)) {
        eduLines.push(line);
      }
    }
  }

  for (const eduLine of eduLines) {
    const cleanEdu = eduLine.replace(/^[•\-*]\s*/, '').trim();
    if (cleanEdu.length > 0) {
      cv.education.push({
        id: Math.random().toString(36).substring(2, 9),
        institution: cleanEdu,
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
      });
    }
  }

  cv.meta.source_stats = {
    work_experience_count: cv.work_experience.length,
    skills_count: cv.technical_qualifications.length,
    certifications_count: cv.certifications.length,
    education_count: cv.education.length,
  };

  return cv;
}
