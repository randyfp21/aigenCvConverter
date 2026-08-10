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
 * Creates an official target DOCX template buffer with color block footer on EVERY page:
 * {Nama_lengkap}, {role}, {about_me}, {years_of_experience},
 * {professional_experience}, {technical_qualification}, {education}, {certifications},
 * {company_name}, {company_address}, {company_website}, {company_phone}
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

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 540,
              bottom: 540,
              left: 540,
              right: 540,
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
                        width: { size: 70, type: WidthType.PERCENTAGE },
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
                                size: 16,
                                color: cleanPrimary,
                                font: 'Calibri',
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
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
                                text: `LOGO`,
                                bold: true,
                                size: 14,
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
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: cleanPrimary },
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 8, color: '0284C7' },
                          bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                          right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: `{company_name}  •  {company_address}  •  {company_website}  •  Tel: {company_phone}`,
                                bold: true,
                                size: 15,
                                color: 'FFFFFF',
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
        children: [
          // Candidate Name & Role Header
          new Paragraph({
            children: [
              new TextRun({
                text: '{Nama_lengkap}',
                bold: true,
                size: 32,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '{role}',
                bold: true,
                size: 20,
                color: '0284C7',
                font: 'Calibri',
              }),
              new TextRun({
                text: '  •  ',
                size: 18,
                color: '94A3B8',
              }),
              new TextRun({
                text: '{years_of_experience}',
                bold: true,
                size: 18,
                color: '10B981',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 160 },
          }),

          // SECTION 1: ABOUT ME
          new Paragraph({
            children: [
              new TextRun({
                text: 'SUMMARY ABOUT ME',
                bold: true,
                size: 20,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '0284C7' } },
            spacing: { before: 120, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{about_me}',
                size: 18,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 160 },
          }),

          // SECTION 2: PROFESSIONAL EXPERIENCE
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 20,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '0284C7' } },
            spacing: { before: 120, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{professional_experience}',
                size: 18,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 160 },
          }),

          // SECTION 3: TECHNICAL QUALIFICATIONS
          new Paragraph({
            children: [
              new TextRun({
                text: 'TECHNICAL QUALIFICATIONS',
                bold: true,
                size: 20,
                color: cleanPrimary,
                font: 'Calibri',
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '0284C7' } },
            spacing: { before: 120, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '{technical_qualification}',
                bold: true,
                size: 18,
                color: '0369A1',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 160 },
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
                            size: 18,
                            color: cleanPrimary,
                            font: 'Calibri',
                          }),
                        ],
                        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' } },
                        spacing: { after: 60 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{education}',
                            size: 17,
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
                            size: 18,
                            color: cleanPrimary,
                            font: 'Calibri',
                          }),
                        ],
                        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' } },
                        spacing: { after: 60 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '{certifications}',
                            size: 17,
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
