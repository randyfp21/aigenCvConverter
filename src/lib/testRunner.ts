import { extractCanonicalCvFromText } from './extractor/cvExtractor';
import { translateCanonicalCv } from './translator/translationEngine';
import { getCompanyTemplate } from './templates/companies';
import { validateCvConversionPipeline } from './validation/auditEngine';
import { generatePdfBuffer } from './rendering/pdfRenderer';
import { generateDocxBuffer } from './rendering/docxRenderer';

async function runUnitTests() {
  console.log('=== RUNNING CV CONVERTER END-TO-END UNIT TESTS ===');

  const testCvText = `
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

  // Test 1: Extraction Test
  console.log('Test 1: Parsing raw text into Canonical CV...');
  const cv = extractCanonicalCvFromText(testCvText);
  if (cv.personal_information.full_name !== 'Randy Farhan') throw new Error('Name extraction failed');
  if (cv.work_experience.length === 0) throw new Error('Work experience extraction failed');
  console.log('✔ Extraction Test PASSED');

  // Test 2: Entity Preservation & Translation
  console.log('Test 2: Translating CV to Bahasa Indonesia with protected terms...');
  const translatedCv = translateCanonicalCv(cv, 'id');
  if (translatedCv.work_experience[0].company !== 'PT Bank ABC') throw new Error('Company name modified!');
  if (translatedCv.work_experience[0].position !== 'IT Project Manager') throw new Error('Job title modified!');
  console.log('✔ Translation & Protected Entity Test PASSED');

  // Test 3: Validation Audit Test
  console.log('Test 3: Validating Data Loss Pre/Post Audit...');
  const template = getCompanyTemplate('company-aigen');
  const audit = validateCvConversionPipeline(cv, translatedCv, template.id, 'id');
  if (!audit.isValid) throw new Error(`Audit failed: ${audit.errors.join(', ')}`);
  console.log('✔ Audit Safeguard Test PASSED');

  // Test 4: PDF Generation Buffer Test
  console.log('Test 4: Rendering server-side PDF document buffer...');
  const pdfBuffer = await generatePdfBuffer(translatedCv, template, 'id');
  if (!pdfBuffer || pdfBuffer.length === 0) throw new Error('PDF generation produced empty buffer');
  console.log(`✔ PDF Generation PASSED (${pdfBuffer.length} bytes generated)`);

  // Test 5: DOCX Generation Buffer Test
  console.log('Test 5: Rendering programmatic DOCX document buffer...');
  const docxBuffer = await generateDocxBuffer(translatedCv, template, 'id');
  if (!docxBuffer || docxBuffer.length === 0) throw new Error('DOCX generation produced empty buffer');
  console.log(`✔ DOCX Generation PASSED (${docxBuffer.length} bytes generated)`);

  console.log('\nALL 5 UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY! ✅');
}

runUnitTests().catch((err) => {
  console.error('❌ TEST FAILURE:', err);
  process.exit(1);
});
