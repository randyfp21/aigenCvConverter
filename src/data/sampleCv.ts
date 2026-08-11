import { CanonicalCV } from '@/types/cv';

export const SAMPLE_RANDY_FARHAN_CV: CanonicalCV = {
  personal_information: {
    full_name: 'Randy Farhan',
    email: 'randy.farhan@example.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta, Indonesia',
    linkedin: 'linkedin.com/in/randy-farhan',
    website: 'https://randyfarhan.dev',
  },
  role: 'Senior IT Project Manager',
  years_of_experience: 'Senior (7 Years)',
  seniority_level: 'Senior',
  total_years_num: 7,
  about_me:
    'Senior IT Project Manager and Systems Architect with 7+ years of experience leading enterprise software integration, cloud migration, and fintech platform implementations across Southeast Asia.',
  summary:
    'Senior IT Project Manager and Systems Architect with 7+ years of experience leading enterprise software integration, cloud migration, and fintech platform implementations across Southeast Asia.',
  work_experience: [
    {
      id: 'job-1',
      company: 'PT Bank ABC',
      position: 'IT Project Manager',
      location: 'Jakarta, Indonesia',
      start_date: 'Jun 2024',
      end_date: 'Present',
      is_current: true,
      responsibilities: [
        'Led end-to-end digital transformation and core banking API integration for BSI Mobile services.',
        'Managed cross-functional engineering teams of 14+ software developers, QA engineers, and DevOps specialists.',
        'Optimized system throughput and messaging architecture using Apache Kafka and PostgreSQL microservices.',
        'Ensured strict compliance with Bank Indonesia ISO-27001 cybersecurity standard requirements.',
      ],
      projects: [
        {
          name: 'BSI Mobile Banking API Modernization',
          description: 'High-availability microservice gateway handling 5M daily active transactions.',
          technologies: ['Golang', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
          role: 'Lead Project Manager',
        },
      ],
    },
    {
      id: 'job-2',
      company: 'Nusantara Cloud Tech',
      position: 'IT Support Engineer',
      location: 'Bandung, Indonesia',
      start_date: 'Jan 2021',
      end_date: 'May 2024',
      is_current: false,
      responsibilities: [
        'Provided Tier-3 infrastructure support for enterprise cloud workloads hosted on AWS and GCP.',
        'Automated CI/CD deployment pipelines using Docker containers and Kubernetes clusters.',
        'Maintained database uptime of 99.99% for mission-critical PostgreSQL and MySQL clusters.',
      ],
      projects: [],
    },
  ],
  technical_qualifications: [
    'Golang',
    'React',
    'PostgreSQL',
    'Kafka',
    'Docker',
    'Kubernetes',
    'AWS Cloud Architecture',
    'System Integration',
    'Agile Scrum Project Management',
    'Microservices Design',
  ],
  categorized_qualifications: {
    frontend: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
    backend: ['Golang', 'Node.js', 'PostgreSQL', 'Kafka', 'Microservices Design'],
    infrastructure: ['Docker', 'Kubernetes', 'AWS Cloud Architecture', 'CI/CD'],
    others: ['Agile Scrum Project Management', 'System Integration'],
  },
  skills: {
    programming_languages: ['Golang', 'TypeScript', 'SQL', 'Python'],
    frameworks: ['React', 'Next.js', 'Express', 'TailwindCSS'],
    databases: ['PostgreSQL', 'MySQL', 'Redis'],
    cloud: ['AWS', 'GCP'],
    devops: ['Docker', 'Kubernetes', 'CI/CD'],
    tools: ['Git', 'Jira', 'Postman'],
    other: ['Agile', 'Scrum', 'System Architecture'],
  },
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      credential_id: 'AWS-ASA-99482',
    },
    {
      id: 'cert-2',
      name: 'Project Management Professional (PMP)',
      issuer: 'PMI Institute',
      date: '2022',
      credential_id: 'PMP-882194',
    },
    {
      id: 'cert-3',
      name: 'Certified ScrumMaster (CSM)',
      issuer: 'Scrum Alliance',
      date: '2021',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Institut Teknologi Bandung (ITB)',
      degree: 'Bachelor of Science (B.S.)',
      field_of_study: 'Computer Science & Information Technology',
      start_date: '2016',
      end_date: '2020',
    },
  ],
  languages: [
    { language: 'Bahasa Indonesia', proficiency: 'Native / Bilingual' },
    { language: 'English', proficiency: 'Full Professional Proficiency' },
  ],
  additional_information: [
    'Available for immediate onboarding across Jakarta and remote locations.',
  ],
  meta: {
    extraction_confidence: 0.99,
    source_stats: {
      work_experience_count: 2,
      skills_count: 10,
      certifications_count: 3,
      education_count: 1,
    },
  },
};
