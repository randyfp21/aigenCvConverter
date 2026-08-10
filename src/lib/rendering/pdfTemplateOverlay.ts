import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { generatePdfBuffer as generateReactPdfBuffer } from './pdfRenderer';

export async function overlayCvOnPdfTemplate(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage,
  templatePdfBuffer?: Buffer
): Promise<Buffer> {
  // If no custom target template buffer is provided, fallback to vector renderer
  if (!templatePdfBuffer || templatePdfBuffer.length < 100) {
    return await generateReactPdfBuffer(cv, template, lang);
  }

  try {
    // 1. Load the exact PDF document uploaded by the user
    const pdfDoc = await PDFDocument.load(templatePdfBuffer);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      return await generateReactPdfBuffer(cv, template, lang);
    }

    let currentPage = pages[0];
    const { width, height } = currentPage.getSize();

    // Convert theme hex colors to pdf-lib rgb
    const hexToRgb = (hex: string) => {
      const clean = (hex || '#0F172A').replace('#', '');
      const r = parseInt(clean.substring(0, 2) || '00', 16) / 255;
      const g = parseInt(clean.substring(2, 4) || '00', 16) / 255;
      const b = parseInt(clean.substring(4, 6) || '00', 16) / 255;
      return rgb(r, g, b);
    };

    const primaryColor = hexToRgb(template.theme.primary_color || '#0F172A');
    const secondaryColor = hexToRgb(template.theme.secondary_color || '#0284C7');
    const textColor = rgb(0.12, 0.16, 0.22); // Dark slate

    // Starting position below template logo & header region
    let currentY = height - 125;
    const marginX = 45;
    const contentWidth = width - marginX * 2;

    const titles = template.layout.section_titles;

    // Helper: Draw Section Header
    const drawSectionHeader = (titleText: string) => {
      if (currentY < 80) {
        currentPage = pdfDoc.addPage([width, height]);
        currentY = height - 60;
      }

      currentPage.drawText(titleText.toUpperCase(), {
        x: marginX,
        y: currentY,
        size: 11,
        font: helveticaBold,
        color: primaryColor,
      });

      currentY -= 4;
      currentPage.drawLine({
        start: { x: marginX, y: currentY },
        end: { x: width - marginX, y: currentY },
        thickness: 1,
        color: secondaryColor,
      });

      currentY -= 14;
    };

    // Helper: Draw Word-Wrapped Text
    const drawWrappedText = (text: string, size = 9, isBold = false, indent = 0) => {
      const font = isBold ? helveticaBold : helvetica;
      const maxLineWidth = contentWidth - indent;

      const words = text.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, size);

        if (testWidth > maxLineWidth && currentLine) {
          if (currentY < 50) {
            currentPage = pdfDoc.addPage([width, height]);
            currentY = height - 60;
          }

          currentPage.drawText(currentLine, {
            x: marginX + indent,
            y: currentY,
            size,
            font,
            color: textColor,
          });

          currentY -= size * 1.35;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (currentY < 50) {
          currentPage = pdfDoc.addPage([width, height]);
          currentY = height - 60;
        }

        currentPage.drawText(currentLine, {
          x: marginX + indent,
          y: currentY,
          size,
          font,
          color: textColor,
        });

        currentY -= size * 1.35;
      }
    };

    // 2. Candidate Name & Role Overlay
    currentPage.drawText(cv.personal_information.full_name || 'Candidate Profile', {
      x: marginX,
      y: currentY,
      size: 17,
      font: helveticaBold,
      color: primaryColor,
    });

    currentY -= 14;
    currentPage.drawText(`${cv.role} • ${cv.years_of_experience}`, {
      x: marginX,
      y: currentY,
      size: 9.5,
      font: helveticaBold,
      color: secondaryColor,
    });

    currentY -= 22;

    // 3. Dynamic Section Overlay
    for (const sectionKey of template.layout.section_order) {
      if (sectionKey === 'summary' && (cv.about_me || cv.summary)) {
        drawSectionHeader(titles.summary?.[lang] || 'Summary About Me');
        drawWrappedText(cv.about_me || cv.summary, 9, false, 0);
        currentY -= 10;
      }

      if (sectionKey === 'work_experience' && cv.work_experience.length > 0) {
        drawSectionHeader(titles.work_experience?.[lang] || 'Professional Experience');

        for (const job of cv.work_experience) {
          if (currentY < 80) {
            currentPage = pdfDoc.addPage([width, height]);
            currentY = height - 60;
          }

          currentPage.drawText(job.position || 'Role', {
            x: marginX,
            y: currentY,
            size: 10,
            font: helveticaBold,
            color: textColor,
          });

          const dateStr = `${job.start_date} ${job.start_date || job.end_date ? '-' : ''} ${job.end_date}`;
          if (dateStr.trim()) {
            const dateWidth = helvetica.widthOfTextAtSize(dateStr, 8.5);
            currentPage.drawText(dateStr, {
              x: width - marginX - dateWidth,
              y: currentY,
              size: 8.5,
              font: helvetica,
              color: rgb(0.4, 0.4, 0.4),
            });
          }

          currentY -= 12;

          currentPage.drawText(job.company || 'Company', {
            x: marginX,
            y: currentY,
            size: 9.5,
            font: helveticaBold,
            color: secondaryColor,
          });

          currentY -= 12;

          for (const resp of job.responsibilities) {
            drawWrappedText(`•  ${resp}`, 9, false, 8);
          }

          currentY -= 8;
        }
        currentY -= 6;
      }

      if (sectionKey === 'technical_qualifications' && cv.technical_qualifications.length > 0) {
        drawSectionHeader(titles.technical_qualifications?.[lang] || 'Technical Qualifications');
        drawWrappedText(cv.technical_qualifications.map((q) => `✓ ${q}`).join('   '), 9, true, 0);
        currentY -= 12;
      }

      if (sectionKey === 'certifications' && cv.certifications.length > 0) {
        drawSectionHeader(titles.certifications?.[lang] || 'List Certification');
        for (const cert of cv.certifications) {
          drawWrappedText(`•  ${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''}`, 9, false, 4);
        }
        currentY -= 10;
      }

      if (sectionKey === 'education' && cv.education.length > 0) {
        drawSectionHeader(titles.education?.[lang] || 'List Education');
        for (const edu of cv.education) {
          drawWrappedText(`•  ${edu.institution} ${edu.degree ? `- ${edu.degree}` : ''}`, 9, false, 4);
        }
        currentY -= 10;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error('PDF Template Overlay Error, falling back to React PDF renderer:', err);
    return await generateReactPdfBuffer(cv, template, lang);
  }
}
