import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from '@react-pdf/renderer';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';

export async function generatePdfBuffer(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage
): Promise<Buffer> {
  const { theme, layout, company_name, company_address, company_website, company_phone, logo_svg, logo_url } = template;
  const titles = layout.section_titles;

  const sepColor = theme.separator_color || theme.secondary_color || '#0284C7';
  const primaryColor = theme.primary_color || '#0F172A';

  // Helper to extract or base64 encode company logo image src for @react-pdf/renderer
  const getLogoSrc = (): string | null => {
    if (logo_url && logo_url.startsWith('data:image')) {
      return logo_url;
    }
    const hrefMatch = logo_svg?.match(/href=["'](data:image\/[^"']+)["']/);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
    if (logo_svg && logo_svg.trim().startsWith('<svg')) {
      try {
        const base64Svg = Buffer.from(logo_svg).toString('base64');
        return `data:image/svg+xml;base64,${base64Svg}`;
      } catch (e) {
        console.warn('Failed to base64 encode logo_svg:', e);
      }
    }
    return null;
  };

  const logoSrc = getLogoSrc();
  const portfolioLink = cv.personal_information.portfolio_url || cv.personal_information.website || cv.personal_information.linkedin || '';

  const styles = StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 48,
      paddingHorizontal: 40,
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: theme.text_color || '#1F2937',
      backgroundColor: '#FFFFFF',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: sepColor,
      marginBottom: 16,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    logoImage: {
      width: 52,
      height: 52,
      objectFit: 'contain',
      borderRadius: 6,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: primaryColor,
    },
    roleText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: sepColor,
      marginTop: 2,
    },
    portfolioText: {
      fontSize: 8.5,
      color: '#475569',
      marginTop: 3,
    },
    sectionContainer: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: primaryColor,
      borderBottomWidth: 1.5,
      borderBottomColor: sepColor,
      paddingBottom: 3,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.4,
      color: '#374151',
    },
    jobContainer: {
      marginBottom: 10,
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 10.5,
      fontWeight: 'bold',
      color: '#111827',
    },
    companyText: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: sepColor,
    },
    jobDate: {
      fontSize: 9,
      color: '#6B7280',
    },
    bulletItem: {
      fontSize: 9,
      lineHeight: 1.35,
      marginBottom: 2.5,
      paddingLeft: 8,
      color: '#374151',
    },
    projectBullet: {
      fontSize: 8.5,
      lineHeight: 1.3,
      marginBottom: 2,
      paddingLeft: 14,
      color: '#0F766E',
    },
    skillBadge: {
      fontSize: 8.5,
      backgroundColor: '#F1F5F9',
      color: primaryColor,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 3,
      marginRight: 4,
      marginBottom: 4,
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    certItem: {
      fontSize: 9,
      color: '#1F2937',
      marginBottom: 2,
    },
    eduItem: {
      fontSize: 9,
      marginBottom: 3,
      color: '#1F2937',
    },
    footer: {
      position: 'absolute',
      bottom: 18,
      left: 40,
      right: 40,
      fontSize: 8,
      textAlign: 'center',
      color: '#64748B',
      borderTopWidth: 1,
      borderTopColor: sepColor,
      paddingTop: 6,
    },
  });

  const PdfDocument = (
    <Document title={`Candidate Profile - ${cv.personal_information.full_name}`}>
      <Page size="A4" style={styles.page}>
        {/* Top Header with Candidate Info Left & Top-Right Company Logo */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{cv.personal_information.full_name || 'Candidate Profile'}</Text>
            <Text style={styles.roleText}>
              {cv.role} {cv.years_of_experience ? `• ${cv.years_of_experience}` : ''}
            </Text>
            {portfolioLink ? (
              <Text style={styles.portfolioText}>Portfolio / Link: {portfolioLink}</Text>
            ) : null}
          </View>

          <View style={styles.headerRight}>
            {logoSrc ? (
              <Image src={logoSrc} style={styles.logoImage} />
            ) : (
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: primaryColor,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                  {company_name.substring(0, 4)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Dynamic Sections Based on Template Layout */}
        {layout.section_order.map((sectionKey) => {
          if (sectionKey === 'summary' && (cv.about_me || cv.summary)) {
            return (
              <View key="summary" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.summary?.[lang] || 'Summary About Me'}</Text>
                <Text style={styles.summaryText}>{cv.about_me || cv.summary}</Text>
              </View>
            );
          }

          if (sectionKey === 'work_experience' && cv.work_experience.length > 0) {
            return (
              <View key="work_experience" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.work_experience?.[lang] || 'Professional Experience'}</Text>
                {cv.work_experience.map((job, idx) => (
                  <View key={job.id || idx} style={styles.jobContainer}>
                    <View style={styles.jobHeader}>
                      <Text style={styles.jobTitle}>{job.position}</Text>
                      <Text style={styles.jobDate}>
                        {job.start_date} {job.start_date || job.end_date ? '-' : ''} {job.end_date}
                      </Text>
                    </View>
                    <Text style={styles.companyText}>{job.company}</Text>
                    {job.responsibilities.map((resp, rIdx) => (
                      <Text key={rIdx} style={styles.bulletItem}>
                        - {resp}
                      </Text>
                    ))}
                    {job.projects && job.projects.length > 0
                      ? job.projects.map((proj, pIdx) => (
                          <Text key={pIdx} style={styles.projectBullet}>
                            ▸ Project: {proj.name} - {proj.description} {proj.technologies.length > 0 ? `(Tech: ${proj.technologies.join(', ')})` : ''} {proj.link ? `[${proj.link}]` : ''}
                          </Text>
                        ))
                      : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'technical_qualifications' && cv.technical_qualifications.length > 0) {
            return (
              <View key="technical_qualifications" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.technical_qualifications?.[lang] || 'Technical Qualifications'}</Text>
                <View style={styles.skillsWrap}>
                  {cv.technical_qualifications.map((qual, qIdx) => (
                    <Text key={qIdx} style={styles.skillBadge}>
                      - {qual}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }

          if (sectionKey === 'certifications' && cv.certifications.length > 0) {
            return (
              <View key="certifications" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.certifications?.[lang] || 'List Certification'}</Text>
                {cv.certifications.map((cert, cIdx) => (
                  <Text key={cert.id || cIdx} style={styles.certItem}>
                    • {cert.name} {cert.issuer ? `(${cert.issuer})` : ''} {cert.date ? `- ${cert.date}` : ''}
                  </Text>
                ))}
              </View>
            );
          }

          if (sectionKey === 'education' && cv.education.length > 0) {
            return (
              <View key="education" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.education?.[lang] || 'List Education'}</Text>
                {cv.education.map((edu, eIdx) => (
                  <Text key={edu.id || eIdx} style={styles.eduItem}>
                    • {edu.institution} {edu.degree ? `- ${edu.degree}` : ''} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                  </Text>
                ))}
              </View>
            );
          }

          return null;
        })}

        {/* Bottom Page Footer */}
        <Text style={styles.footer}>
          {company_name}  •  {company_address || 'Jakarta, Indonesia'}  •  {company_website || 'www.company.com'}  •  Tel: {company_phone || '+62 21 500 8000'}
        </Text>
      </Page>
    </Document>
  );

  return await renderToBuffer(PdfDocument);
}
