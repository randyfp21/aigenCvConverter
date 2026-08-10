import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';

export async function generatePdfBuffer(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage
): Promise<Buffer> {
  const { theme, layout, company_name } = template;
  const titles = layout.section_titles;

  const styles = StyleSheet.create({
    page: {
      padding: 36,
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: theme.text_color || '#1F2937',
      backgroundColor: '#FFFFFF',
    },
    headerBanner: {
      backgroundColor: theme.primary_color,
      padding: 16,
      borderRadius: 4,
      marginBottom: 16,
      color: '#FFFFFF',
    },
    headerStandard: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary_color,
      paddingBottom: 12,
      marginBottom: 16,
    },
    companyName: {
      fontSize: 10,
      color: theme.secondary_color,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: layout.header_style === 'banner' ? '#FFFFFF' : theme.primary_color,
    },
    confidentialTag: {
      fontSize: 9,
      marginTop: 4,
      color: layout.header_style === 'banner' ? '#E0F2FE' : '#6B7280',
      fontStyle: 'italic',
    },
    sectionContainer: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary_color,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondary_color,
      paddingBottom: 4,
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
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
    },
    companyText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.secondary_color,
    },
    jobDate: {
      fontSize: 9,
      color: '#6B7280',
    },
    bulletItem: {
      fontSize: 9,
      lineHeight: 1.35,
      marginBottom: 3,
      paddingLeft: 8,
      color: '#374151',
    },
    skillBadge: {
      fontSize: 8.5,
      backgroundColor: '#F3F4F6',
      color: theme.primary_color,
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
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 2,
    },
    eduItem: {
      fontSize: 9.5,
      marginBottom: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 36,
      right: 36,
      fontSize: 8,
      textAlign: 'center',
      color: '#9CA3AF',
      borderTopWidth: 0.5,
      borderTopColor: '#E5E7EB',
      paddingTop: 6,
    },
  });

  const PdfDocument = (
    <Document title={`Standardized CV - ${cv.personal_information.full_name}`}>
      <Page size="A4" style={styles.page}>
        {/* Header - Contact Details (Email, Phone, Location) intentionally omitted for privacy */}
        <View style={layout.header_style === 'banner' ? styles.headerBanner : styles.headerStandard}>
          <Text style={styles.companyName}>{company_name} • Standardized CV</Text>
          <Text style={styles.name}>{cv.personal_information.full_name || 'Candidate Profile'}</Text>
          <Text style={styles.confidentialTag}>
            Confidential Candidate Profile • Internal Reference Standard
          </Text>
        </View>

        {/* Dynamic Sections Based on Template Layout */}
        {layout.section_order.map((sectionKey) => {
          if (sectionKey === 'summary' && cv.summary) {
            return (
              <View key="summary" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.summary?.[lang] || 'Summary'}</Text>
                <Text style={styles.summaryText}>{cv.summary}</Text>
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
                        • {resp}
                      </Text>
                    ))}
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
                      ✓ {qual}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }

          if (sectionKey === 'certifications' && cv.certifications.length > 0) {
            return (
              <View key="certifications" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{titles.certifications?.[lang] || 'Certifications'}</Text>
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
                <Text style={styles.sectionTitle}>{titles.education?.[lang] || 'Education'}</Text>
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

        {/* Standard Footer */}
        <Text style={styles.footer}>
          Confidential • Standardized Employee Curriculum Vitae • {company_name}
        </Text>
      </Page>
    </Document>
  );

  return await renderToBuffer(PdfDocument);
}
