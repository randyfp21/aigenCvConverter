import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { generateDocxBuffer as generateFallbackDocx } from './docxRenderer';

export async function renderDocxFromTemplate(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage,
  templateDocxBuffer?: Buffer
): Promise<Buffer> {
  // If no custom target DOCX template buffer is uploaded, use the programmatic DOCX fallback
  if (!templateDocxBuffer || templateDocxBuffer.length < 100) {
    return await generateFallbackDocx(cv, template, lang);
  }

  try {
    // 1. Unzip the target DOCX template preserving 100% of original headers, footers, logos & tables
    const zip = new PizZip(templateDocxBuffer);

    // 2. Instantiate Docxtemplater with linebreaks enabled
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 3. Format candidate data mapping into target DOCX placeholders
    const professionalExperienceText = cv.work_experience
      .map((job) => {
        const companyStr = job.company || 'Company / Enterprise';
        const positionStr = job.position || 'Professional Role';
        const dateStr = job.start_date || job.end_date ? ` (${job.start_date} - ${job.end_date})` : '';
        const respText = job.responsibilities.map((r) => `  • ${r}`).join('\n');

        return `${positionStr} — ${companyStr}${dateStr}\n${respText}`;
      })
      .join('\n\n');

    const technicalQualificationText = cv.technical_qualifications
      .map((t) => `• ${t}`)
      .join('\n');

    const educationText = cv.education
      .map((e) => `• ${e.institution} ${e.degree ? `- ${e.degree}` : ''}`)
      .join('\n');

    const certificationsText = cv.certifications
      .map((c) => `• ${c.name} ${c.issuer ? `(${c.issuer})` : ''}`)
      .join('\n');

    const templateData = {
      // Primary placeholders requested by PRD
      Nama_lengkap: cv.personal_information.full_name || 'Candidate',
      nama_lengkap: cv.personal_information.full_name || 'Candidate',
      fullName: cv.personal_information.full_name || 'Candidate',
      role: cv.role || 'Candidate',
      about_me: cv.about_me || cv.summary || '',
      years_of_experience: cv.years_of_experience || 'Junior (1 Year)',
      seniority_level: cv.seniority_level || 'Junior',

      // Section placeholders
      professional_experience: professionalExperienceText,
      work_experience: professionalExperienceText,
      technical_qualification: technicalQualificationText,
      technical_qualifications: technicalQualificationText,
      education: educationText,
      certifications: certificationsText,

      // Arrays for loop tags if used in template (e.g. {#work_experience}{position}{/work_experience})
      work_experiences: cv.work_experience,
      skills_list: cv.technical_qualifications.map((s) => ({ skill: s })),
      education_list: cv.education,
      certification_list: cv.certifications,
    };

    // 4. Render exact placeholder replacement into target DOCX template
    doc.render(templateData);

    // 5. Generate output DOCX buffer preserving original logos, headers, footers & formatting
    const outputBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return outputBuffer;
  } catch (error) {
    console.error('Docxtemplater Error, falling back to standard renderer:', error);
    return await generateFallbackDocx(cv, template, lang);
  }
}
