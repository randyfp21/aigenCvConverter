import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { createOfficialCompanyDocxTemplate } from '@/lib/templates/defaultDocxTemplates';

export async function renderDocxFromTemplate(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage,
  templateDocxBuffer?: Buffer
): Promise<Buffer> {
  let docxBaseBuffer: Buffer;

  // Check if templateDocxBuffer is a valid DOCX zip file (starts with 504b0304 PK header)
  if (templateDocxBuffer && templateDocxBuffer.length >= 100 && templateDocxBuffer.slice(0, 4).toString('hex') === '504b0304') {
    docxBaseBuffer = templateDocxBuffer;
  } else {
    docxBaseBuffer = await createOfficialCompanyDocxTemplate(
      template.company_name,
      template.code,
      template.theme.primary_color || '#0F172A',
      template.company_address,
      template.company_phone
    );
  }

  try {
    const zip = new PizZip(docxBaseBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => '',
    });

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

    const experienceList = cv.work_experience.map((job) => ({
      position: job.position,
      role: job.position,
      company: job.company,
      start_date: job.start_date,
      end_date: job.end_date,
      dates: `${job.start_date} - ${job.end_date}`,
      responsibilities: job.responsibilities.map((r) => `• ${r}`).join('\n'),
      responsibilities_list: job.responsibilities.map((r) => ({ detail: r })),
    }));

    const skillsList = cv.technical_qualifications.map((s) => ({
      skill: s,
      qualification: s,
      name: s,
    }));

    const educationList = cv.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field_of_study,
      dates: `${e.start_date} - ${e.end_date}`,
    }));

    const certificationList = cv.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    }));

    // Comprehensive Placeholder Dictionary
    const templateData: Record<string, unknown> = {
      // Company Info Placeholders
      company_name: template.company_name,
      Company_name: template.company_name,
      COMPANY_NAME: template.company_name,
      company_address: template.company_address || 'Jakarta, Indonesia',
      Company_address: template.company_address || 'Jakarta, Indonesia',
      company_phone: template.company_phone || '+62 21 500 8000',
      Company_phone: template.company_phone || '+62 21 500 8000',
      company_code: template.code,

      // 1. Full Name Placeholders
      Nama_lengkap: cv.personal_information.full_name || 'Candidate',
      nama_lengkap: cv.personal_information.full_name || 'Candidate',
      NAMA_LENGKAP: cv.personal_information.full_name || 'Candidate',
      NamaLengkap: cv.personal_information.full_name || 'Candidate',
      'Nama Lengkap': cv.personal_information.full_name || 'Candidate',
      fullName: cv.personal_information.full_name || 'Candidate',
      full_name: cv.personal_information.full_name || 'Candidate',
      Name: cv.personal_information.full_name || 'Candidate',
      name: cv.personal_information.full_name || 'Candidate',

      // 2. Candidate Role Placeholders
      role: cv.role || 'Candidate',
      Role: cv.role || 'Candidate',
      ROLE: cv.role || 'Candidate',
      jabatan: cv.role || 'Candidate',
      Jabatan: cv.role || 'Candidate',
      position: cv.role || 'Candidate',
      Position: cv.role || 'Candidate',

      // 3. Years of Experience & Seniority Placeholders
      years_of_experience: cv.years_of_experience || 'Junior (1 Year)',
      Years_of_experience: cv.years_of_experience || 'Junior (1 Year)',
      YEARS_OF_EXPERIENCE: cv.years_of_experience || 'Junior (1 Year)',
      yearsOfExperience: cv.years_of_experience || 'Junior (1 Year)',
      'Lama Pengalaman': cv.years_of_experience || 'Junior (1 Year)',
      lama_pengalaman: cv.years_of_experience || 'Junior (1 Year)',
      Lama_pengalaman: cv.years_of_experience || 'Junior (1 Year)',
      seniority_level: cv.seniority_level || 'Junior',
      experience_years: cv.years_of_experience || 'Junior (1 Year)',

      // 4. About Me & Summary Placeholders
      about_me: cv.about_me || cv.summary || '',
      About_me: cv.about_me || cv.summary || '',
      ABOUT_ME: cv.about_me || cv.summary || '',
      AboutMe: cv.about_me || cv.summary || '',
      'About Me': cv.about_me || cv.summary || '',
      summary: cv.about_me || cv.summary || '',
      Summary: cv.about_me || cv.summary || '',
      profil: cv.about_me || cv.summary || '',
      Profil: cv.about_me || cv.summary || '',

      // 5. Professional Experience Placeholders (Formatted Text & Arrays)
      professional_experience: professionalExperienceText,
      Professional_experience: professionalExperienceText,
      PROFESSIONAL_EXPERIENCE: professionalExperienceText,
      ProfessionalExperience: professionalExperienceText,
      'Professional Experience': professionalExperienceText,
      work_experience: professionalExperienceText,
      Work_experience: professionalExperienceText,
      WorkExperience: professionalExperienceText,
      'Work Experience': professionalExperienceText,
      pengalaman_kerja: professionalExperienceText,
      Pengalaman_kerja: professionalExperienceText,
      'Pengalaman Kerja': professionalExperienceText,

      // 6. Technical Qualification Placeholders
      technical_qualification: technicalQualificationText,
      Technical_qualification: technicalQualificationText,
      TECHNICAL_QUALIFICATION: technicalQualificationText,
      TechnicalQualification: technicalQualificationText,
      'Technical Qualification': technicalQualificationText,
      technical_qualifications: technicalQualificationText,
      Technical_qualifications: technicalQualificationText,
      skills: technicalQualificationText,
      Skills: technicalQualificationText,
      keahlian: technicalQualificationText,
      Keahlian: technicalQualificationText,
      kualifikasi_teknikal: technicalQualificationText,
      'Kualifikasi Teknikal': technicalQualificationText,

      // 7. Education Placeholders
      education: educationText,
      Education: educationText,
      EDUCATION: educationText,
      pendidikan: educationText,
      Pendidikan: educationText,
      riwayat_pendidikan: educationText,
      'Riwayat Pendidikan': educationText,

      // 8. Certification Placeholders
      certifications: certificationsText,
      Certifications: certificationsText,
      CERTIFICATIONS: certificationsText,
      sertifikasi: certificationsText,
      Sertifikasi: certificationsText,
      sertifikat: certificationsText,
      Sertifikat: certificationsText,

      // 9. Loop Arrays
      work_experiences: experienceList,
      professional_experiences: experienceList,
      skills_list: skillsList,
      qualifications_list: skillsList,
      education_list: educationList,
      certification_list: certificationList,
    };

    doc.render(templateData);

    const outputBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return outputBuffer;
  } catch (error) {
    console.error('Docxtemplater Error, falling back to official company template:', error);
    const fallbackTemplate = await createOfficialCompanyDocxTemplate(
      template.company_name,
      template.code,
      template.theme.primary_color || '#0F172A',
      template.company_address,
      template.company_phone
    );

    const zip = new PizZip(fallbackTemplate);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, nullGetter: () => '' });
    doc.render({
      company_name: template.company_name,
      company_address: template.company_address || 'Jakarta, Indonesia',
      company_phone: template.company_phone || '+62 21 500 8000',
      Nama_lengkap: cv.personal_information.full_name || 'Candidate',
      role: cv.role || 'Candidate',
      about_me: cv.about_me || cv.summary || '',
      years_of_experience: cv.years_of_experience || 'Junior (1 Year)',
      professional_experience: cv.work_experience.map((j) => `${j.position} at ${j.company}\n${j.responsibilities.map((r) => `• ${r}`).join('\n')}`).join('\n\n'),
      technical_qualification: cv.technical_qualifications.map((t) => `• ${t}`).join('\n'),
      education: cv.education.map((e) => `• ${e.institution}`).join('\n'),
      certifications: cv.certifications.map((c) => `• ${c.name}`).join('\n'),
    });

    return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  }
}
