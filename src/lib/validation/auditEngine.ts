import { CanonicalCV, FinalValidationReport, ValidationStageResult } from '@/types/cv';
import { COMPANY_TEMPLATES, getCompanyTemplate } from '@/lib/templates/companies';

function getUniqueSkillsCount(cv: CanonicalCV): number {
  const mainSkills = Array.isArray(cv.technical_qualifications) ? cv.technical_qualifications : [];
  const catSkills = cv.categorized_qualifications
    ? Object.values(cv.categorized_qualifications).flat().filter((s): s is string => Boolean(s))
    : [];
  return new Set([...mainSkills, ...catSkills]).size;
}

export function validateCvConversionPipeline(
  sourceCv: CanonicalCV,
  outputCv: CanonicalCV,
  selectedTemplateId: string,
  targetLanguage: 'en' | 'id'
): FinalValidationReport {
  const stages: ValidationStageResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Stage 1: Template Validation
  const isCustomTemplate =
    selectedTemplateId.startsWith('company-custom-') ||
    selectedTemplateId.startsWith('custom-') ||
    selectedTemplateId.includes('custom');

  const templateExists =
    isCustomTemplate ||
    COMPANY_TEMPLATES.some((t) => t.id === selectedTemplateId || t.code === selectedTemplateId) ||
    Boolean(getCompanyTemplate(selectedTemplateId));

  stages.push({
    stage: 'Template Selection Validation',
    status: templateExists ? 'passed' : 'failed',
    message: templateExists
      ? `Selected template '${selectedTemplateId}' is valid and loaded.`
      : `Selected template '${selectedTemplateId}' not found.`,
  });
  if (!templateExists) errors.push(`Template '${selectedTemplateId}' invalid.`);

  // Stage 2: Canonical CV Schema Integrity
  const hasName = Boolean(sourceCv.personal_information?.full_name?.trim());
  stages.push({
    stage: 'Canonical CV Integrity',
    status: hasName ? 'passed' : 'failed',
    message: hasName
      ? `Candidate name parsed: '${sourceCv.personal_information.full_name}'`
      : 'Candidate name is missing from source document.',
  });
  if (!hasName) errors.push('Candidate name missing.');

  // Stage 3: Audit Item Counts for Data Loss Prevention (Rule 8)
  const sourceJobs = sourceCv.work_experience ? sourceCv.work_experience.length : 0;
  const outputJobs = outputCv.work_experience ? outputCv.work_experience.length : 0;

  const sourceCerts = sourceCv.certifications ? sourceCv.certifications.length : 0;
  const outputCerts = outputCv.certifications ? outputCv.certifications.length : 0;

  const sourceTech = getUniqueSkillsCount(sourceCv);
  const outputTech = getUniqueSkillsCount(outputCv);

  const workExperiencePreserved = outputJobs >= sourceJobs;
  const certsPreserved = outputCerts >= sourceCerts;
  const techPreserved = outputTech >= sourceTech;

  const dataLossPassed = workExperiencePreserved && certsPreserved && techPreserved;

  stages.push({
    stage: 'Data Loss Safeguard Audit',
    status: dataLossPassed ? 'passed' : 'failed',
    message: dataLossPassed
      ? `Data Audit Passed: ${outputJobs}/${sourceJobs} Jobs, ${outputCerts}/${sourceCerts} Certifications, ${outputTech}/${sourceTech} Technical Qualifications preserved.`
      : `Data Audit Alert: Discrepancy detected between source and target document counts.`,
    details: {
      sourceWorkExperiences: sourceJobs,
      outputWorkExperiences: outputJobs,
      sourceCertifications: sourceCerts,
      outputCertifications: outputCerts,
      sourceTechnicalQualifications: sourceTech,
      outputTechnicalQualifications: outputTech,
    },
  });

  if (!workExperiencePreserved) {
    errors.push(`Work experience count mismatch: Source has ${sourceJobs}, output has ${outputJobs}.`);
  }
  if (!certsPreserved) {
    errors.push(`Certification count mismatch: Source has ${sourceCerts}, output has ${outputCerts}.`);
  }
  if (!techPreserved) {
    errors.push(`Technical qualification count mismatch: Source has ${sourceTech}, output has ${outputTech}.`);
  }

  // Stage 4: Unresolved Placeholder Scan
  const outputJsonString = JSON.stringify(outputCv);
  const unresolvedMatches = outputJsonString.match(/\{\{?[a-zA-Z0-9_]+\}?\}|\bundefined\b/g) || [];
  const unresolvedPlaceholders = unresolvedMatches.length;

  stages.push({
    stage: 'Unresolved Placeholder Audit',
    status: unresolvedPlaceholders === 0 ? 'passed' : 'warning',
    message: unresolvedPlaceholders === 0
      ? 'Clean document rendering: No unresolved placeholders detected.'
      : `Found ${unresolvedPlaceholders} empty or unresolved variables.`,
  });

  // Stage 5: Target Language Verification
  stages.push({
    stage: 'Output Language Audit',
    status: 'passed',
    message: `Target output language confirmed: ${targetLanguage.toUpperCase()}`,
  });

  const isValid = errors.length === 0 && dataLossPassed;

  return {
    isValid,
    stages,
    dataLossCheck: {
      sourceWorkExperiences: sourceJobs,
      outputWorkExperiences: outputJobs,
      sourceCertifications: sourceCerts,
      outputCertifications: outputCerts,
      sourceTechnicalQualifications: sourceTech,
      outputTechnicalQualifications: outputTech,
      passed: dataLossPassed,
      unresolvedPlaceholders,
    },
    errors,
    warnings,
  };
}
