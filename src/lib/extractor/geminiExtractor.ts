import { CanonicalCV } from '@/types/cv';
import { extractCanonicalCvFromText as ruleBasedFallbackExtract } from './cvExtractor';

export async function extractCvWithGeminiAI(rawCvText: string): Promise<CanonicalCV> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    'AIzaSyB33tO93N2-PKflpVAmw9ooqdhxYIiwKgI';

  if (!apiKey || apiKey.trim() === '') {
    console.warn('GEMINI_API_KEY not configured. Falling back to deterministic parser.');
    return ruleBasedFallbackExtract(rawCvText);
  }

  const modelsToTry = [
    'gemini-3-flash-preview',
    'gemini-2.0-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  const prompt = `
You are an Expert AI HR Specialist and Senior CV Analyst.
Analyze the following candidate's raw CV text and produce a fully qualified, structured JSON payload.

REQUIRED JSON SCHEMA & RULES:
1. personal_information: Object containing:
   - full_name: string (Candidate Full Name)
   - email: string
   - phone: string
   - location: string
   - linkedin: string
2. role: string (Candidate's primary role e.g., "Senior Fullstack JavaScript Developer", "IT Project Manager")
3. years_of_experience: string (Calculated total years & seniority string e.g., "Senior (7 Years)", "Middle (4 Years)", or "Junior (2 Years)")
4. seniority_level: "Junior" | "Middle" | "Senior" (Junior for 1-3 years, Middle for 3-5 years, Senior for 5+ years)
5. total_years_num: number (Total years calculated from work history)
6. about_me: string (CONCISE 2-3 sentence executive summary highlighting candidate role, total experience, core tech stack, and key impact)
7. summary: string (Same concise text as about_me)
8. work_experience: Array of objects containing:
   - id: string
   - company: string (Company Name e.g., "PT Aigen Global Teknologi", "Shopee", "PT Gudang Solusi")
   - position: string (Job Title / Position)
   - location: string
   - start_date: string (e.g., "Jan 2021" or "2021")
   - end_date: string (e.g., "Present" or "Dec 2023")
   - is_current: boolean
   - responsibilities: Array of strings (Full bullet point responsibilities and achievements extracted from source CV)
9. technical_qualifications: Array of strings (All technical skills, programming languages, tools, frameworks, databases e.g., ["Golang", "TypeScript", "React", "PostgreSQL", "Kafka", "Docker"])
10. education: Array of objects containing:
   - id: string
   - institution: string (University / Institute Name)
   - degree: string (Degree e.g., "Bachelor of Computer Science", "S1 Teknik Informatika")
   - field_of_study: string
11. certifications: Array of objects containing:
   - id: string
   - name: string (Certification Name e.g., "AWS Certified Solutions Architect")
   - issuer: string (Issuer e.g., "Amazon Web Services")
   - date: string

RAW CV TEXT TO ANALYZE:
"""
${rawCvText}
"""
`;

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini model ${modelName} returned status ${response.status}. Trying next model...`);
        continue;
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        console.warn(`Empty response from Gemini model ${modelName}. Trying next...`);
        continue;
      }

      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsedData = JSON.parse(cleanJson);

      const qualifiedCv: CanonicalCV = {
        personal_information: {
          full_name: parsedData.personal_information?.full_name || 'Candidate',
          email: parsedData.personal_information?.email || '',
          phone: parsedData.personal_information?.phone || '',
          location: parsedData.personal_information?.location || '',
          linkedin: parsedData.personal_information?.linkedin || '',
          website: '',
        },
        role: parsedData.role || 'Professional Candidate',
        years_of_experience: parsedData.years_of_experience || 'Junior (1 Year)',
        seniority_level: parsedData.seniority_level || 'Junior',
        total_years_num: typeof parsedData.total_years_num === 'number' ? parsedData.total_years_num : 1,
        about_me: parsedData.about_me || parsedData.summary || '',
        summary: parsedData.summary || parsedData.about_me || '',
        work_experience: Array.isArray(parsedData.work_experience)
          ? parsedData.work_experience.map((job: any, index: number) => ({
              id: job.id || `job-ai-${index + 1}`,
              company: job.company || 'Enterprise Company',
              position: job.position || 'Professional Role',
              location: job.location || '',
              start_date: job.start_date || '',
              end_date: job.end_date || '',
              is_current: Boolean(job.is_current),
              responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
              projects: [],
            }))
          : [],
        technical_qualifications: Array.isArray(parsedData.technical_qualifications)
          ? parsedData.technical_qualifications
          : [],
        skills: {
          programming_languages: [],
          frameworks: [],
          databases: [],
          cloud: [],
          devops: [],
          tools: [],
          other: [],
        },
        certifications: Array.isArray(parsedData.certifications)
          ? parsedData.certifications.map((c: any, index: number) => ({
              id: c.id || `cert-ai-${index + 1}`,
              name: c.name || 'Certification',
              issuer: c.issuer || '',
              date: c.date || '',
            }))
          : [],
        education: Array.isArray(parsedData.education)
          ? parsedData.education.map((e: any, index: number) => ({
              id: e.id || `edu-ai-${index + 1}`,
              institution: e.institution || 'University',
              degree: e.degree || '',
              field_of_study: e.field_of_study || '',
              start_date: e.start_date || '',
              end_date: e.end_date || '',
            }))
          : [],
        languages: [],
        additional_information: [],
        meta: {
          extraction_confidence: 0.99,
          source_stats: {
            work_experience_count: parsedData.work_experience?.length || 0,
            skills_count: parsedData.technical_qualifications?.length || 0,
            certifications_count: parsedData.certifications?.length || 0,
            education_count: parsedData.education?.length || 0,
          },
        },
      };

      console.log(`Successfully analyzed CV using Gemini AI (${modelName})`);
      return qualifiedCv;
    } catch (modelError) {
      console.warn(`Error calling Gemini model ${modelName}:`, modelError);
    }
  }

  console.warn('All Gemini AI endpoints failed or quota exceeded. Using deterministic fallback parser.');
  return ruleBasedFallbackExtract(rawCvText);
}
