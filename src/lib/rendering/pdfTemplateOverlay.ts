import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { generatePdfBuffer as generateReactPdfBuffer } from './pdfRenderer';

export async function overlayCvOnPdfTemplate(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage,
  templatePdfBuffer?: Buffer
): Promise<Buffer> {
  // If no custom target PDF template buffer provided, use the vector template renderer fallback
  if (!templatePdfBuffer || templatePdfBuffer.length < 100) {
    return await generateReactPdfBuffer(cv, template, lang);
  }

  try {
    // 1. Load the exact Target Template PDF uploaded by the user
    const pdfDoc = await PDFDocument.load(templatePdfBuffer);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    let currentPage = pages[0];
    const { width, height } = currentPage.getSize();

    // Convert hex color to rgb
    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2) || '00', 16) / 255;
      const g = parseInt(clean.substring(2, 4) || '00', 16) / 255;
      const b = parseInt(clean.substring(4, 6) || '00', 16) / 255;
      return rgb(r, g, b);
    };

    const primaryColor = hexToRgb(template.theme.primary_color || '#0F172A');
    const secondaryColor = hexToRgb(template.theme.secondary_color || '#0284C7');
    const textColor = rgb(0.12, 0.16, 0.22); // Dark slate

    // Calculate starting position below template header
    let currentY = height - 120;
    const marginX = 45;
    const contentWidth = width - marginX * 2;

    const titles = template.layout.section_titles;

    // Helper: Draw Section Title on PDF Template
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

    // Helper: Draw Text Line with Word Wrap
    const drawWrappedText = (text: string, size = 9, isBold = false, indent = 0) => {
      const font = isBold ? helveticaBold : helvetica;
      const maxLineWidth = contentWidth - indent;

      // Word wrapping math
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

    // 2. Overlay Candidate Full Name
    currentPage.drawText(cv.personal_information.full_name || 'Candidate Profile', {
      x: marginX,
      y: currentY,
      size: 18,
      font: helveticaBold,
      color: primaryColor,
    });

    currentY -= 14;
    currentPage.drawText(`Confidential Candidate Profile • Standardized for ${template.company_name}`, {
      x: marginX,
      y: currentY,
      size: 8.5,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    currentY -= 24;

    // 3. Dynamic Section Rendering onto Target PDF
    for (const sectionKey of template.layout.section_order) {
      if (sectionKey === 'summary' && cv.summary) {
        drawSectionHeader(titles.summary?.[lang] || 'Summary');
        drawWrappedText(cv.summary, 9.5, false, 0);
        currentY -= 10;
      }

      if (sectionKey === 'work_experience' && cv.work_experience.length > 0) {
        drawSectionHeader(titles.work_experience?.[lang] || 'Work Experience');

        for (const job of cv.work_experience) {
          if (currentY < 80) {
            currentPage = pdfDoc.addPage([width, height]);
            currentY = height - 60;
          }

          // Job Title & Dates
          currentPage.drawText(job.position, {
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

          // Company Name
          currentPage.drawText(job.company, {
            x: marginX,
            y: currentY,
            size: 9.5,
            font: helveticaBold,
            color: secondaryColor,
          });

          currentY -= 12;

          // Responsibilities
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
        drawSectionHeader(titles.certifications?.[lang] || 'Certifications');
        for (const cert of cv.certifications) {
          drawWrappedText(`•  ${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''}`, 9, false, 4);
        }
        currentY -= 10;
      }

      if (sectionKey === 'education' && cv.education.length > 0) {
        drawSectionHeader(titles.education?.[lang] || 'Education');
        for (const edu of cv.education) {
          drawWrappedText(`•  ${edu.institution} ${edu.degree ? `- ${edu.degree}` : ''}`, 9, false, 4);
        }
        currentY -= 10;
      }
    }

    // Save and return overlaid PDF bytes
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error('PDF Template Overlay Error, falling back to React PDF renderer:', err);
    return await generateReactPdfBuffer(cv, template, lang);
  }
}
