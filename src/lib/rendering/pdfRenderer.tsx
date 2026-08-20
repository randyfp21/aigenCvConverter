import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  Rect,
  Circle,
  G,
  renderToBuffer,
} from '@react-pdf/renderer';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';

interface ParsedRect {
  x?: number;
  y?: number;
  width: number;
  height: number;
  rx?: number;
  fill?: string;
}

interface ParsedPath {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  fill?: string;
}

interface ParsedCircle {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

function parseSvgLogo(svgString?: string) {
  if (!svgString || typeof svgString !== 'string') return null;

  const rectMatch = svgString.match(/<rect\s+([^>]+)\/?>/i);
  let rect: ParsedRect | null = null;
  if (rectMatch) {
    const attrStr = rectMatch[1];
    const width = parseFloat((attrStr.match(/width=["']([^"']+)["']/) || [])[1] || '100');
    const height = parseFloat((attrStr.match(/height=["']([^"']+)["']/) || [])[1] || '100');
    const rx = parseFloat((attrStr.match(/rx=["']([^"']+)["']/) || [])[1] || '0');
    const fill = (attrStr.match(/fill=["']([^"']+)["']/) || [])[1] || '#0F172A';
    rect = { width, height, rx, fill };
  }

  const paths: ParsedPath[] = [];
  const pathRegex = /<path\s+([^>]+)\/?>/gi;
  let match: RegExpExecArray | null;
  while ((match = pathRegex.exec(svgString)) !== null) {
    const attrStr = match[1];
    const d = (attrStr.match(/d=["']([^"']+)["']/) || [])[1];
    if (d) {
      const stroke = (attrStr.match(/stroke=["']([^"']+)["']/) || [])[1];
      const strokeWidth = parseFloat((attrStr.match(/stroke-width=["']([^"']+)["']/) || [])[1] || '1');
      const strokeLinecap = (attrStr.match(/stroke-linecap=["']([^"']+)["']/) || [])[1] as any;
      const strokeLinejoin = (attrStr.match(/stroke-linejoin=["']([^"']+)["']/) || [])[1] as any;
      const fill = (attrStr.match(/fill=["']([^"']+)["']/) || [])[1] || 'none';
      paths.push({ d, stroke, strokeWidth, strokeLinecap, strokeLinejoin, fill });
    }
  }

  const circles: ParsedCircle[] = [];
  const circleRegex = /<circle\s+([^>]+)\/?>/gi;
  while ((match = circleRegex.exec(svgString)) !== null) {
    const attrStr = match[1];
    const cx = parseFloat((attrStr.match(/cx=["']([^"']+)["']/) || [])[1] || '50');
    const cy = parseFloat((attrStr.match(/cy=["']([^"']+)["']/) || [])[1] || '50');
    const r = parseFloat((attrStr.match(/r=["']([^"']+)["']/) || [])[1] || '10');
    const fill = (attrStr.match(/fill=["']([^"']+)["']/) || [])[1] || 'none';
    const stroke = (attrStr.match(/stroke=["']([^"']+)["']/) || [])[1];
    const strokeWidth = parseFloat((attrStr.match(/stroke-width=["']([^"']+)["']/) || [])[1] || '0');
    circles.push({ cx, cy, r, fill, stroke, strokeWidth });
  }

  if (!rect && paths.length === 0 && circles.length === 0) return null;
  return { rect, paths, circles };
}

function getRasterLogoSrc(logo_url?: string, logo_svg?: string): string | null {
  if (logo_url) {
    const trimmed = logo_url.trim();
    if (
      trimmed.startsWith('data:image/png') ||
      trimmed.startsWith('data:image/jpeg') ||
      trimmed.startsWith('data:image/jpg') ||
      trimmed.startsWith('data:image/webp') ||
      trimmed.startsWith('data:image/gif') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://')
    ) {
      return trimmed;
    }
  }

  if (logo_svg) {
    const hrefMatch = logo_svg.match(/href=["'](data:image\/[^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
  }

  return null;
}

export async function generatePdfBuffer(
  cv: CanonicalCV,
  template: CompanyTemplateConfig,
  lang: TargetLanguage
): Promise<Buffer> {
  const { theme, layout, company_name, company_address, company_website, company_phone, logo_svg, logo_url } = template;
  const titles = layout.section_titles;

  const sepColor = theme.separator_color || theme.secondary_color || '#0284C7';
  const primaryColor = theme.primary_color || '#0F172A';

  // Map user-selected font_family to valid standard PDF fonts
  const getPdfFontFamily = (): string => {
    const family = (theme.font_family || '').toLowerCase();
    if (family.includes('times') || family.includes('georgia') || family.includes('serif')) {
      return 'Times-Roman';
    }
    if (family.includes('courier') || family.includes('mono')) {
      return 'Courier';
    }
    return 'Helvetica';
  };

  const pdfFont = getPdfFontFamily();

  const rasterLogoSrc = getRasterLogoSrc(logo_url, logo_svg);
  const parsedSvg = !rasterLogoSrc ? parseSvgLogo(logo_svg) : null;
  const portfolioLink = cv.personal_information.portfolio_url || cv.personal_information.website || cv.personal_information.linkedin || '';

  const cats = cv.categorized_qualifications || {};
  const hasFrontend = Boolean(cats.frontend && cats.frontend.length > 0);
  const hasBackend = Boolean(cats.backend && cats.backend.length > 0);
  const hasInfras = Boolean(cats.infrastructure && cats.infrastructure.length > 0);
  const hasDbTools = Boolean(cats.databases_tools && cats.databases_tools.length > 0);
  const hasOthers = Boolean(cats.others && cats.others.length > 0);
  const hasCategorized = hasFrontend || hasBackend || hasInfras || hasDbTools || hasOthers;

  const styles = StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 44,
      paddingHorizontal: 32,
      fontFamily: pdfFont,
      fontSize: 9.5,
      color: theme.text_color || '#1F2937',
      backgroundColor: '#FFFFFF',
    },
    pageBorder: {
      position: 'absolute',
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      borderWidth: theme.page_border_width || 1,
      borderColor: theme.page_border_color || '#000000',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: sepColor,
      marginBottom: 10,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    logoImage: {
      width: 44,
      height: 44,
      objectFit: 'contain',
      borderRadius: 4,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: primaryColor,
    },
    roleText: {
      fontSize: 10,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: sepColor,
      marginTop: 1,
    },
    portfolioText: {
      fontSize: 8,
      color: '#475569',
      marginTop: 2,
    },
    sectionContainer: {
      marginBottom: 9,
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: primaryColor,
      borderBottomWidth: 1,
      borderBottomColor: sepColor,
      paddingBottom: 2,
      marginBottom: 5,
      textTransform: 'uppercase',
    },
    summaryText: {
      fontSize: 9,
      lineHeight: 1.3,
      color: '#374151',
    },
    jobContainer: {
      marginBottom: 6,
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    jobTitle: {
      fontSize: 9.5,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: '#111827',
    },
    companyText: {
      fontSize: 9,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: sepColor,
      marginBottom: 2,
    },
    jobDate: {
      fontSize: 8.5,
      color: '#6B7280',
    },
    bulletItem: {
      fontSize: 8.5,
      lineHeight: 1.28,
      marginBottom: 1.5,
      paddingLeft: 6,
      color: '#374151',
    },
    projectBullet: {
      fontSize: 8,
      lineHeight: 1.25,
      marginBottom: 1.5,
      paddingLeft: 12,
      color: '#0F766E',
    },
    categoryRow: {
      fontSize: 8.5,
      lineHeight: 1.3,
      marginBottom: 2,
    },
    skillBadge: {
      fontSize: 8,
      backgroundColor: '#F1F5F9',
      color: primaryColor,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      marginRight: 3,
      marginBottom: 3,
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    certItem: {
      fontSize: 8.5,
      color: '#1F2937',
      marginBottom: 1.5,
    },
    eduItem: {
      fontSize: 8.5,
      marginBottom: 2,
      color: '#1F2937',
    },
    footerBanner: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: primaryColor,
      paddingVertical: 6,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 2,
      borderTopColor: sepColor,
    },
    footerText: {
      fontSize: 7.5,
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

  const showLogo = template.show_company_logo ?? true;
  const showFooter = template.show_company_footer ?? true;

  const PdfDocument = (
    <Document title={`Candidate Profile - ${cv.personal_information.full_name}`}>
      <Page size="A4" style={styles.page}>
        {/* Optional Outer Page Border Box */}
        {theme.show_page_border && (
          <View style={styles.pageBorder} fixed />
        )}

        {/* Compact Header: Candidate Info Left & Top-Right Company Logo */}
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

          {showLogo && (
            <View style={styles.headerRight}>
              {rasterLogoSrc ? (
                <Image src={rasterLogoSrc} style={styles.logoImage} />
              ) : parsedSvg ? (
                <Svg viewBox="0 0 100 100" style={styles.logoImage}>
                  {parsedSvg.rect && (
                    <Rect
                      x={parsedSvg.rect.x || 0}
                      y={parsedSvg.rect.y || 0}
                      width={parsedSvg.rect.width}
                      height={parsedSvg.rect.height}
                      rx={parsedSvg.rect.rx || 0}
                      fill={parsedSvg.rect.fill || primaryColor}
                    />
                  )}
                  {parsedSvg.paths.map((p, pIdx) => (
                    <Path
                      key={`p-${pIdx}`}
                      d={p.d}
                      stroke={p.stroke}
                      strokeWidth={p.strokeWidth}
                      strokeLinecap={p.strokeLinecap}
                      strokeLinejoin={p.strokeLinejoin}
                      fill={p.fill}
                    />
                  ))}
                  {parsedSvg.circles.map((c, cIdx) => (
                    <Circle
                      key={`c-${cIdx}`}
                      cx={c.cx}
                      cy={c.cy}
                      r={c.r}
                      fill={c.fill}
                      stroke={c.stroke}
                      strokeWidth={c.strokeWidth}
                    />
                  ))}
                </Svg>
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: primaryColor,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                    {(company_name || 'PT').substring(0, 4).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Dynamic Compact Sections */}
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
                        • {resp}
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
                {hasCategorized ? (
                  <View>
                    {hasFrontend && (
                      <Text style={styles.categoryRow}>
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Front End: </Text>
                        <Text style={{ color: '#374151' }}>{cats.frontend!.join(', ')}</Text>
                      </Text>
                    )}
                    {hasBackend && (
                      <Text style={styles.categoryRow}>
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Back End: </Text>
                        <Text style={{ color: '#374151' }}>{cats.backend!.join(', ')}</Text>
                      </Text>
                    )}
                    {hasInfras && (
                      <Text style={styles.categoryRow}>
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Infrastructure &amp; Cloud: </Text>
                        <Text style={{ color: '#374151' }}>{cats.infrastructure!.join(', ')}</Text>
                      </Text>
                    )}
                    {hasDbTools && (
                      <Text style={styles.categoryRow}>
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Databases &amp; Tools: </Text>
                        <Text style={{ color: '#374151' }}>{cats.databases_tools!.join(', ')}</Text>
                      </Text>
                    )}
                    {hasOthers && (
                      <Text style={styles.categoryRow}>
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Others: </Text>
                        <Text style={{ color: '#374151' }}>{cats.others!.join(', ')}</Text>
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.skillsWrap}>
                    {cv.technical_qualifications.map((qual, qIdx) => (
                      <Text key={qIdx} style={styles.skillBadge}>
                        ✓ {qual}
                      </Text>
                    ))}
                  </View>
                )}
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

        {/* Color Block Footer Banner on EVERY PAGE */}
        {showFooter && (
          <View style={styles.footerBanner} fixed>
            <Text style={styles.footerText}>
              {company_name}  •  {company_address || 'Jakarta, Indonesia'}  •  {company_website || 'www.company.com'}  •  Tel: {company_phone || '+62 21 500 8000'}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );

  return await renderToBuffer(PdfDocument);
}
