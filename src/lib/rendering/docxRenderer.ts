import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from 'docx';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';

export async function generateDocxBuffer(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage
): Promise<Buffer> {
  const { theme, layout, company_name } = template;
  const titles = layout.section_titles;

  const primaryColorHex = theme.primary_color.replace('#', '');
  const secondaryColorHex = theme.secondary_color.replace('#', '');

  const children: (Paragraph)[] = [];

  // Header Banner / Title - Contact Details (Email, Phone, Location) omitted for privacy & confidentiality
  children.push(
    new Paragraph({
      text: `${company_name} — Standardized CV`,
      heading: HeadingLevel.HEADING_3,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: cv.personal_information.full_name || 'Candidate Name',
          bold: true,
          size: 32, // 16pt
          color: primaryColorHex,
        }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Confidential Candidate Profile • Internal Reference Standard',
          size: 18,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { after: 240 },
      border: {
        bottom: {
          color: primaryColorHex,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
    })
  );

  // Dynamic Section Generator
  for (const sectionKey of layout.section_order) {
    if (sectionKey === 'summary' && cv.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: (titles.summary?.[lang] || 'Summary').toUpperCase(),
              bold: true,
              size: 22,
              color: primaryColorHex,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.summary, size: 20 })],
          spacing: { after: 200 },
        })
      );
    }

    if (sectionKey === 'work_experience' && cv.work_experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: (titles.work_experience?.[lang] || 'Work Experience').toUpperCase(),
              bold: true,
              size: 22,
              color: primaryColorHex,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      for (const job of cv.work_experience) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: job.position, bold: true, italics: true, size: 22 }),
              new TextRun({ text: `   ${job.start_date} - ${job.end_date}`, size: 18, color: '777777' }),
            ],
            spacing: { before: 100, after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: job.company, bold: true, italics: true, size: 20, color: secondaryColorHex })],
            spacing: { after: 100 },
          })
        );

        for (const resp of job.responsibilities) {
          children.push(
            new Paragraph({
              text: resp,
              bullet: { level: 0 },
              spacing: { after: 40 },
            })
          );
        }
      }
    }

    if (sectionKey === 'technical_qualifications' && cv.technical_qualifications.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: (titles.technical_qualifications?.[lang] || 'Technical Qualifications').toUpperCase(),
              bold: true,
              size: 22,
              color: primaryColorHex,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.technical_qualifications.join('  •  '), size: 20 })],
          spacing: { after: 200 },
        })
      );
    }

    if (sectionKey === 'certifications' && cv.certifications.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: (titles.certifications?.[lang] || 'Certifications').toUpperCase(),
              bold: true,
              size: 22,
              color: primaryColorHex,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      for (const cert of cv.certifications) {
        children.push(
          new Paragraph({
            text: `${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''}`,
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      }
    }

    if (sectionKey === 'education' && cv.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: (titles.education?.[lang] || 'Education').toUpperCase(),
              bold: true,
              size: 22,
              color: primaryColorHex,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      for (const edu of cv.education) {
        children.push(
          new Paragraph({
            text: `${edu.institution} ${edu.degree ? `- ${edu.degree}` : ''}`,
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
