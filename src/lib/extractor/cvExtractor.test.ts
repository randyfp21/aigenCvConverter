import { extractCanonicalCvFromText } from './cvExtractor';
import { translateCanonicalCv } from '../translator/translationEngine';
import { validateCvConversionPipeline } from '../validation/auditEngine';

describe('CV Extraction & Preservation Pipeline', () => {
  const sampleRawText = `
Randy Farhan
randy.farhan@example.com | +62 812 3456 7890 | Jakarta, Indonesia

PROFESSIONAL SUMMARY
Senior IT Project Manager with 7+ years of experience leading enterprise software integration.

WORK EXPERIENCE
IT Project Manager - PT Bank ABC
Jun 2024 - Present
• Led end-to-end digital transformation for BSI Mobile services.
• Optimized messaging architecture using Apache Kafka and PostgreSQL microservices.

TECHNICAL QUALIFICATIONS
Golang, React, PostgreSQL, Kafka, Docker, AWS

CERTIFICATIONS
AWS Certified Solutions Architect
Certified ScrumMaster

EDUCATION
Institut Teknologi Bandung (ITB) - Computer Science
  `;

  test('should parse raw text into Canonical CV structure accurately', () => {
    const cv = extractCanonicalCvFromText(sampleRawText);

    expect(cv.personal_information.full_name).toBe('Randy Farhan');
    expect(cv.personal_information.email).toBe('randy.farhan@example.com');
    expect(cv.work_experience.length).toBeGreaterThan(0);
    expect(cv.work_experience[0].company).toContain('PT Bank ABC');
    expect(cv.work_experience[0].position).toContain('IT Project Manager');
    expect(cv.technical_qualifications).toContain('PostgreSQL');
    expect(cv.certifications.length).toBe(2);
  });

  test('should translate descriptions while preserving proper nouns & company names', () => {
    const cv = extractCanonicalCvFromText(sampleRawText);
    const translated = translateCanonicalCv(cv, 'id');

    expect(translated.work_experience[0].company).toBe('PT Bank ABC'); // Company name unchanged
    expect(translated.work_experience[0].position).toBe('IT Project Manager'); // Job title unchanged
    expect(translated.technical_qualifications).toContain('PostgreSQL'); // Tech stack preserved
  });

  test('should pass data loss audit when source count matches target output', () => {
    const cv = extractCanonicalCvFromText(sampleRawText);
    const report = validateCvConversionPipeline(cv, cv, 'company-a', 'en');

    expect(report.isValid).toBe(true);
    expect(report.dataLossCheck.passed).toBe(true);
  });
});
