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
 * Creates an official target DOCX template buffer containing exact placeholders:
 * {Nama_lengkap}, {role}, {about_me}, {years_of_experience},
 * {professional_experience}, {technical_qualification}, {education}, {certifications},
 * {company_name}, {company_address}, {company_phone}
 */
export async function createOfficialCompanyDocxTemplate(
  companyName: string,
  companyCode: string,
  primaryColorHex: string,
  companyAddress = 'Jakarta, Indonesia',
  companyPhone = '+62 21 500 8000'
): Promise<Buffer> {
  const cleanColor = (primaryColorHex || '#0F172A').replace('#', '');

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
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `{company_name}`,
                    bold: true,
                    size: 16,
                    color: cleanColor,
                    font: 'Calibri',
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
                    text: `{company_address}  •  Tel: {company_phone}`,
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
          // Company Banner Table Header with Logo Text
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: cleanColor },
                    margins: { top: 220, bottom: 220, left: 300, right: 300 },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: cleanColor },
                      left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{company_name}',
                            bold: true,
                            size: 28,
                            color: 'FFFFFF',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{company_address}  |  {company_phone}',
                            size: 16,
                            color: 'E2E8F0',
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
                color: cleanColor,
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
                color: cleanColor,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: cleanColor } },
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
                color: cleanColor,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: cleanColor } },
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
                color: cleanColor,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: cleanColor } },
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
                            color: cleanColor,
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
                            color: cleanColor,
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
