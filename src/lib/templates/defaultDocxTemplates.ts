import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  WidthType,
} from 'docx';

/**
 * Creates a clean, beautifully formatted corporate DOCX template with:
 * - Top-Right Company Logo & Code Header
 * - Styled Separator Lines with customized separator color
 * - Candidate Name, Role & Years of Experience
 * - Structured Sections ({about_me}, {professional_experience}, {technical_qualification}, {education}, {certifications})
 * - Bottom Page Footer (Company Name, Address, Website, Phone)
 */
export async function createOfficialCompanyDocxTemplate(
  companyName: string,
  companyCode: string,
  primaryColorHex: string,
  companyAddress = 'Jakarta, Indonesia',
  companyWebsite = 'www.company.com',
  companyPhone = '+62 21 500 8000'
): Promise<Buffer> {
  const cleanPrimary = (primaryColorHex || '#0F172A').replace('#', '');
  const cleanCode = (companyCode || 'PT').toUpperCase();

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                        },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `{company_name}`,
                                bold: true,
                                size: 18,
                                color: cleanPrimary,
                                font: 'Calibri',
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: `[ ${cleanCode} ]`,
                                bold: true,
                                size: 16,
                                color: '0284C7',
                                font: 'Calibri',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `{company_name}  •  {company_address}  •  {company_website}  •  Tel: {company_phone}`,
                    size: 15,
                    color: '64748B',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Top Header Banner with Logo & Company Info
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    shading: { fill: cleanPrimary },
                    margins: { top: 220, bottom: 220, left: 300, right: 300 },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: '0284C7' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{company_name}',
                            bold: true,
                            size: 26,
                            color: 'FFFFFF',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{company_address}  |  {company_website}  |  {company_phone}',
                            size: 16,
                            color: 'E2E8F0',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: cleanPrimary },
                    margins: { top: 220, bottom: 220, left: 200, right: 200 },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: '0284C7' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: `[ LOGO ${cleanCode} ]`,
                            bold: true,
                            size: 20,
                            color: '38BDF8',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Candidate Name & Role Placeholders
          new Paragraph({
            children: [
              new TextRun({
                text: '{Nama_lengkap}',
                bold: true,
                size: 36,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '{role}',
                bold: true,
                size: 22,
                color: '0284C7',
                font: 'Calibri',
              }),
              new TextRun({
                text: '  •  ',
                size: 20,
                color: '94A3B8',
              }),
              new TextRun({
                text: '{years_of_experience}',
                bold: true,
                size: 20,
                color: '10B981',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECTION 1: ABOUT ME
          new Paragraph({
            children: [
              new TextRun({
                text: 'SUMMARY ABOUT ME',
                bold: true,
                size: 22,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '0284C7' } },
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{about_me}',
                size: 20,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECTION 2: PROFESSIONAL EXPERIENCE
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 22,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '0284C7' } },
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{professional_experience}',
                size: 20,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECTION 3: TECHNICAL QUALIFICATIONS
          new Paragraph({
            children: [
              new TextRun({
                text: 'TECHNICAL QUALIFICATIONS',
                bold: true,
                size: 22,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '0284C7' } },
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{technical_qualification}',
                bold: true,
                size: 20,
                color: '0369A1',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECTION 4: LIST EDUCATION & CERTIFICATIONS
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'LIST EDUCATION',
                            bold: true,
                            size: 20,
                            color: cleanPrimary,
                            font: 'Calibri',
                          }),
                        ],
                        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' } },
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{education}',
                            size: 19,
                            color: '334155',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'LIST CERTIFICATION',
                            bold: true,
                            size: 20,
                            color: cleanPrimary,
                            font: 'Calibri',
                          }),
                        ],
                        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' } },
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{certifications}',
                            size: 19,
                            color: '334155',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
