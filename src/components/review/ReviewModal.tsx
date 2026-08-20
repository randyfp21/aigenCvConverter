import React, { useState } from 'react';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage, WorkExperience, Project, Certification, Education } from '@/types/cv';
import {
  User,
  Briefcase,
  Award,
  GraduationCap,
  Code2,
  ArrowRight,
  EyeOff,
  Clock,
  Sparkles,
  X,
  ShieldAlert,
  CheckCircle2,
  Globe,
  FolderGit2,
  AlertTriangle,
  Terminal,
  Plus,
  Trash2,
} from 'lucide-react';

import { CompanyTemplateSelect } from '@/components/template/CompanyTemplateSelect';

export interface AiStatusInfo {
  statusLog: string[];
  modelUsed: string;
  isFallback: boolean;
  errorMessage?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  extractedCv: CanonicalCV;
  processedCv: CanonicalCV;
  template: CompanyTemplateConfig;
  language: TargetLanguage;
  aiStatus?: AiStatusInfo;
  onClose: () => void;
  onConfirmExport: (finalCv: CanonicalCV, targetTemplate?: CompanyTemplateConfig) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  processedCv,
  template,
  aiStatus,
  onClose,
  onConfirmExport,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CompanyTemplateConfig>(template);
  const [candidateCv, setCandidateCv] = useState<CanonicalCV>(processedCv);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  const initialPortfolioVal =
    processedCv.personal_information?.portfolio_url ||
    processedCv.personal_information?.website ||
    processedCv.personal_information?.linkedin ||
    '';

  const [showPortfolioLink, setShowPortfolioLink] = useState<boolean>(Boolean(initialPortfolioVal));
  const [storedPortfolioLink, setStoredPortfolioLink] = useState<string>(
    initialPortfolioVal || 'https://linkedin.com/in/andina-ajeng-nurismi-a0190415b/'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    const activeLink = showPortfolioLink ? (candidateCv.personal_information.portfolio_url || storedPortfolioLink) : '';
    const finalCv: CanonicalCV = {
      ...candidateCv,
      personal_information: {
        ...candidateCv.personal_information,
        portfolio_url: activeLink,
        website: activeLink,
        linkedin: activeLink,
      },
    };
    onConfirmExport(finalCv, selectedTemplate);
  };

  const portfolioLink = candidateCv.personal_information.portfolio_url || candidateCv.personal_information.website || candidateCv.personal_information.linkedin || '';
  const cats = candidateCv.categorized_qualifications || {};

  // --- EDIT HANDLERS FOR WORK EXPERIENCE ---
  const handleUpdateWorkExp = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...candidateCv.work_experience];
    updated[index] = { ...updated[index], [field]: value };
    setCandidateCv({ ...candidateCv, work_experience: updated });
  };

  const handleUpdateResponsibility = (jobIdx: number, respIdx: number, value: string) => {
    const updatedJobs = [...candidateCv.work_experience];
    const updatedResps = [...updatedJobs[jobIdx].responsibilities];
    updatedResps[respIdx] = value;
    updatedJobs[jobIdx] = { ...updatedJobs[jobIdx], responsibilities: updatedResps };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  const handleAddResponsibility = (jobIdx: number) => {
    const updatedJobs = [...candidateCv.work_experience];
    updatedJobs[jobIdx] = {
      ...updatedJobs[jobIdx],
      responsibilities: [...updatedJobs[jobIdx].responsibilities, 'Poin tanggung jawab / pencapaian baru'],
    };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  const handleRemoveResponsibility = (jobIdx: number, respIdx: number) => {
    const updatedJobs = [...candidateCv.work_experience];
    const updatedResps = updatedJobs[jobIdx].responsibilities.filter((_, idx) => idx !== respIdx);
    updatedJobs[jobIdx] = { ...updatedJobs[jobIdx], responsibilities: updatedResps };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  const handleAddWorkExp = () => {
    const newJob: WorkExperience = {
      id: `job-${Date.now()}`,
      position: 'Role / Posisi Pekerjaan Baru',
      company: 'Nama Perusahaan',
      location: 'Jakarta',
      start_date: '2023',
      end_date: 'Saat Ini',
      is_current: true,
      responsibilities: ['Mengembangkan dan mengelola proyek perusahaan'],
      projects: [],
    };
    setCandidateCv({ ...candidateCv, work_experience: [...candidateCv.work_experience, newJob] });
  };

  const handleRemoveWorkExp = (jobIdx: number) => {
    const updatedJobs = candidateCv.work_experience.filter((_, idx) => idx !== jobIdx);
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  // --- EDIT HANDLERS FOR PROJECTS ---
  const handleUpdateProject = (jobIdx: number, projIdx: number, field: keyof Project, value: any) => {
    const updatedJobs = [...candidateCv.work_experience];
    const updatedProjs = [...(updatedJobs[jobIdx].projects || [])];
    if (field === 'technologies' && typeof value === 'string') {
      updatedProjs[projIdx] = {
        ...updatedProjs[projIdx],
        technologies: value.split(',').map((s) => s.trim()).filter(Boolean),
      };
    } else {
      updatedProjs[projIdx] = { ...updatedProjs[projIdx], [field]: value };
    }
    updatedJobs[jobIdx] = { ...updatedJobs[jobIdx], projects: updatedProjs };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  const handleAddProject = (jobIdx: number) => {
    const updatedJobs = [...candidateCv.work_experience];
    const newProj: Project = {
      name: 'Nama Proyek Baru',
      description: 'Deskripsi dan pencapaian proyek',
      technologies: ['React', 'TypeScript', 'PostgreSQL'],
      role: 'Developer',
      link: '',
    };
    updatedJobs[jobIdx] = {
      ...updatedJobs[jobIdx],
      projects: [...(updatedJobs[jobIdx].projects || []), newProj],
    };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  const handleRemoveProject = (jobIdx: number, projIdx: number) => {
    const updatedJobs = [...candidateCv.work_experience];
    const updatedProjs = (updatedJobs[jobIdx].projects || []).filter((_, idx) => idx !== projIdx);
    updatedJobs[jobIdx] = { ...updatedJobs[jobIdx], projects: updatedProjs };
    setCandidateCv({ ...candidateCv, work_experience: updatedJobs });
  };

  // --- EDIT HANDLERS FOR SKILLS ---
  const handleUpdateSkillCategory = (categoryKey: string, valueStr: string) => {
    const skillsArr = valueStr.split(',').map((s) => s.trim()).filter(Boolean);
    const updatedCats = {
      ...(candidateCv.categorized_qualifications || {}),
      [categoryKey]: skillsArr,
    };
    const allSkills = Array.from(new Set(Object.values(updatedCats).flat().filter(Boolean)));
    setCandidateCv({
      ...candidateCv,
      categorized_qualifications: updatedCats,
      technical_qualifications: allSkills as string[],
    });
  };

  const handleUpdateAllSkills = (valueStr: string) => {
    const skillsArr = valueStr.split(',').map((s) => s.trim()).filter(Boolean);
    setCandidateCv({
      ...candidateCv,
      technical_qualifications: skillsArr,
    });
  };

  // --- EDIT HANDLERS FOR EDUCATION ---
  const handleUpdateEdu = (index: number, field: keyof Education, value: string) => {
    const updated = [...candidateCv.education];
    updated[index] = { ...updated[index], [field]: value };
    setCandidateCv({ ...candidateCv, education: updated });
  };

  const handleAddEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: 'Nama Universitas / Institusi',
      degree: 'Sarjana (S1)',
      field_of_study: 'Teknik Informatika',
      start_date: '2018',
      end_date: '2022',
    };
    setCandidateCv({ ...candidateCv, education: [...candidateCv.education, newEdu] });
  };

  const handleRemoveEdu = (index: number) => {
    const updated = candidateCv.education.filter((_, idx) => idx !== index);
    setCandidateCv({ ...candidateCv, education: updated });
  };

  // --- EDIT HANDLERS FOR CERTIFICATIONS ---
  const handleUpdateCert = (index: number, field: keyof Certification, value: string) => {
    const updated = [...candidateCv.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCandidateCv({ ...candidateCv, certifications: updated });
  };

  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Nama Sertifikasi',
      issuer: 'Penerbit (e.g. AWS / Google)',
      date: '2023',
    };
    setCandidateCv({ ...candidateCv, certifications: [...candidateCv.certifications, newCert] });
  };

  const handleRemoveCert = (index: number) => {
    const updated = candidateCv.certifications.filter((_, idx) => idx !== index);
    setCandidateCv({ ...candidateCv, certifications: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-3xl">
      <div className="bg-white/90 dark:bg-slate-950/90 border border-white/60 dark:border-white/10 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto backdrop-blur-3xl text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/40 dark:border-white/10 pb-4 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit &amp; Konfirmasi CV Kandidat</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-white/10 text-blue-600 dark:text-sky-300 border border-blue-500/20 dark:border-white/20 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Mode Edit Interaktif</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Seluruh field di bawah ini <strong>dapat Anda edit secara bebas</strong> (Nama, Role, Portfolio, Summary, Skills, Pengalaman Kerja, Proyek, Sertifikasi, &amp; Pendidikan) sebelum dicetak ke template PT <strong>{template.company_name}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowLogs(!showLogs)}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/10 flex items-center gap-1.5 shadow-sm backdrop-blur-md"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>{showLogs ? 'Sembunyikan Log Progress' : 'Lihat Progress Log AI'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Banner if Quota Limit Hit or Fallback Used */}
        {aiStatus?.isFallback && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 backdrop-blur-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perhatian Status Kuota API Gemini AI:</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                Model utama Gemini mengalami batas kuota (Rate Limit / Quota Exceeded). Sistem mengalihkan ekstraksi ke parser cadangan untuk memastikan proses konversi Anda tidak gagal.
              </p>
            </div>
          </div>
        )}

        {/* Real-time Progress Log Section */}
        {showLogs && aiStatus?.statusLog && (
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 font-mono text-[11px] space-y-1.5 text-slate-300 max-h-40 overflow-y-auto shadow-inner backdrop-blur-2xl">
            <p className="text-[10px] uppercase tracking-wider font-bold text-sky-400 mb-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Catatan Status &amp; Diagnosa Proses Gemini AI:</span>
            </p>
            {aiStatus.statusLog.map((log, lIdx) => (
              <p key={lIdx} className="leading-snug">
                <span className="text-slate-500 mr-2">[{lIdx + 1}]</span>
                <span className={log.includes('⚠️') ? 'text-amber-400 font-semibold' : log.includes('✅') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                  {log}
                </span>
              </p>
            ))}
          </div>
        )}

        {/* Privacy Safeguard Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-xs flex items-start gap-2.5 backdrop-blur-xl">
          <ShieldAlert className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Privasi Kontak &amp; Opsi Link Portfolio:</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Email Pribadi &amp; No. HP disembunyikan. Anda dapat mengubah data di bawah ini, atau menyembunyikan/menampilkan link portfolio sesuai kebutuhan.
            </p>
          </div>
        </div>

        {/* Company Template Selector Box (PostgreSQL Database Connected) */}
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm">
          <CompanyTemplateSelect
            selectedTemplateId={selectedTemplate.id}
            onSelectTemplate={(newTmpl) => setSelectedTemplate(newTmpl)}
          />
        </div>

        {/* Main Qualification Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Candidate Overview & Skills */}
          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 space-y-3 text-xs backdrop-blur-2xl shadow-sm">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-white/10 pb-2">
                <User className="w-4 h-4 text-blue-500" />
                <span>Profil &amp; Informasi Kandidat</span>
              </h3>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5 font-semibold">Nama Lengkap &#123;Nama_lengkap&#125;</label>
                <input
                  type="text"
                  value={candidateCv.personal_information.full_name}
                  onChange={(e) =>
                    setCandidateCv({
                      ...candidateCv,
                      personal_information: {
                        ...candidateCv.personal_information,
                        full_name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5 font-semibold">Role / Jabatan Utama &#123;role&#125;</label>
                <input
                  type="text"
                  value={candidateCv.role}
                  onChange={(e) => setCandidateCv({ ...candidateCv, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-sky-400 font-bold italic shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5 font-semibold">Senioritas &amp; Pengalaman &#123;years_of_experience&#125;</label>
                <input
                  type="text"
                  value={candidateCv.years_of_experience}
                  onChange={(e) => setCandidateCv({ ...candidateCv, years_of_experience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Portfolio Link Display with Toggle Option */}
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 space-y-2.5 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">Tampilkan Portfolio / LinkedIn</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">Link karya / LinkedIn di dokumen CV.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showPortfolioLink}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setShowPortfolioLink(isChecked);
                      if (isChecked) {
                        const activeLink = storedPortfolioLink || portfolioLink || 'https://linkedin.com/in/andina-ajeng-nurismi-a0190415b/';
                        setCandidateCv({
                          ...candidateCv,
                          personal_information: {
                            ...candidateCv.personal_information,
                            portfolio_url: activeLink,
                            website: activeLink,
                            linkedin: activeLink,
                          },
                        });
                      } else {
                        setCandidateCv({
                          ...candidateCv,
                          personal_information: {
                            ...candidateCv.personal_information,
                            portfolio_url: '',
                            website: '',
                            linkedin: '',
                          },
                        });
                      }
                    }}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer accent-sky-500"
                  />
                </div>

                {showPortfolioLink ? (
                  <div className="space-y-1 pt-1">
                    <label className="text-slate-500 text-[10px] block font-semibold">
                      URL Link Portfolio / LinkedIn &#123;portfolio_url&#125;
                    </label>
                    <input
                      type="text"
                      value={portfolioLink || storedPortfolioLink}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStoredPortfolioLink(val);
                        setCandidateCv({
                          ...candidateCv,
                          personal_information: {
                            ...candidateCv.personal_information,
                            portfolio_url: val,
                            website: val,
                            linkedin: val,
                          },
                        });
                      }}
                      placeholder="e.g. https://linkedin.com/in/andina-ajeng-nurismi-a0190415b/"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-mono text-[11px] shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <p className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Link akan DICETAK pada dokumen CV.</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-[9.5px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-1">
                    <EyeOff className="w-3 h-3 text-amber-500" />
                    <span>Link DISEMBUYIKAN (Tidak akan dicetak pada dokumen CV).</span>
                  </p>
                )}
              </div>
            </div>

            {/* Summary About Me */}
            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 text-xs backdrop-blur-2xl shadow-sm">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Executive Summary &#123;about_me&#125;</span>
              </h3>
              <textarea
                rows={4}
                value={candidateCv.about_me || candidateCv.summary}
                onChange={(e) =>
                  setCandidateCv({
                    ...candidateCv,
                    about_me: e.target.value,
                    summary: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm backdrop-blur-md"
              />
            </div>

            {/* Editable Categorized Technical Qualifications */}
            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 text-xs backdrop-blur-2xl space-y-3 shadow-sm">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span>Kualifikasi Teknikal &#123;technical_qualification&#125;</span>
                </div>
              </h3>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-sky-500 uppercase tracking-wider block mb-1">Front End (Pisahkan dengan koma):</label>
                  <input
                    type="text"
                    value={(cats.frontend || []).join(', ')}
                    onChange={(e) => handleUpdateSkillCategory('frontend', e.target.value)}
                    placeholder="React, Next.js, TypeScript, TailwindCSS"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-sky-600 dark:text-sky-300 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Back End (Pisahkan dengan koma):</label>
                  <input
                    type="text"
                    value={(cats.backend || []).join(', ')}
                    onChange={(e) => handleUpdateSkillCategory('backend', e.target.value)}
                    placeholder="Node.js, Golang, PostgreSQL, Microservices"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-blue-600 dark:text-blue-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-1">Infrastructure &amp; Cloud (Pisahkan dengan koma):</label>
                  <input
                    type="text"
                    value={(cats.infrastructure || []).join(', ')}
                    onChange={(e) => handleUpdateSkillCategory('infrastructure', e.target.value)}
                    placeholder="Docker, Kubernetes, AWS, Kafka, CI/CD"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-purple-600 dark:text-purple-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">Databases &amp; Tools (Pisahkan dengan koma):</label>
                  <input
                    type="text"
                    value={(cats.databases_tools || []).join(', ')}
                    onChange={(e) => handleUpdateSkillCategory('databases_tools', e.target.value)}
                    placeholder="PostgreSQL, Redis, MongoDB, Git, Jira"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-emerald-600 dark:text-emerald-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Skills Keseluruhan (Flat List):</label>
                  <input
                    type="text"
                    value={(candidateCv.technical_qualifications || []).join(', ')}
                    onChange={(e) => handleUpdateAllSkills(e.target.value)}
                    placeholder="Semua skill teknikal..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Work Experience, Project History & Education */}
          <div className="md:col-span-2 space-y-4">
            {/* Work Experience Section */}
            <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 text-xs backdrop-blur-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Pengalaman Kerja &amp; Proyek &#123;professional_experience&#125; ({candidateCv.work_experience.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddWorkExp}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-sky-300 hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pekerjaan</span>
                </button>
              </div>

              <div className="space-y-6">
                {candidateCv.work_experience.map((job, idx) => (
                  <div key={job.id || idx} className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 backdrop-blur-md shadow-sm">
                    {/* Header Row: Position + Dates + Remove Job */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-6">
                        <label className="text-[9.5px] font-semibold text-slate-400 uppercase block">Posisi / Jabatan (Bold &amp; Italic)</label>
                        <input
                          type="text"
                          value={job.position}
                          onChange={(e) => handleUpdateWorkExp(idx, 'position', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-extrabold italic text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-5 flex items-center space-x-1.5">
                        <div className="flex-1">
                          <label className="text-[9.5px] font-semibold text-slate-400 uppercase block">Tgl Mulai</label>
                          <input
                            type="text"
                            value={job.start_date}
                            onChange={(e) => handleUpdateWorkExp(idx, 'start_date', e.target.value)}
                            placeholder="Jan 2021"
                            className="w-full px-2 py-1 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-slate-400 font-bold self-end pb-1.5">-</span>
                        <div className="flex-1">
                          <label className="text-[9.5px] font-semibold text-slate-400 uppercase block">Tgl Selesai</label>
                          <input
                            type="text"
                            value={job.end_date}
                            onChange={(e) => handleUpdateWorkExp(idx, 'end_date', e.target.value)}
                            placeholder="Saat Ini / Dec 2023"
                            className="w-full px-2 py-1 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveWorkExp(idx)}
                          title="Hapus Pekerjaan"
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400 uppercase block">Nama Perusahaan (Bold &amp; Italic)</label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => handleUpdateWorkExp(idx, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-sky-400 font-bold italic text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Responsibilities Bullets */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Poin Responsibilitas &amp; Pencapaian ({job.responsibilities.length}):</label>
                        <button
                          type="button"
                          onClick={() => handleAddResponsibility(idx)}
                          className="text-[10px] font-bold text-blue-600 dark:text-sky-300 hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Responsibilitas</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {job.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <input
                              type="text"
                              value={resp}
                              onChange={(e) => handleUpdateResponsibility(idx, rIdx, e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveResponsibility(idx, rIdx)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extracted Projects Section */}
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-[10.5px] flex items-center gap-1">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>Detail Pengalaman Proyek ({job.projects ? job.projects.length : 0}):</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddProject(idx)}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Detail Proyek</span>
                        </button>
                      </div>

                      {job.projects && job.projects.length > 0 ? (
                        <div className="space-y-3">
                          {job.projects.map((proj, pIdx) => (
                            <div key={pIdx} className="p-2.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 space-y-1.5 relative">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={proj.name}
                                  onChange={(e) => handleUpdateProject(idx, pIdx, 'name', e.target.value)}
                                  placeholder="Nama Proyek"
                                  className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs flex-1 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProject(idx, pIdx)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <textarea
                                rows={2}
                                value={proj.description}
                                onChange={(e) => handleUpdateProject(idx, pIdx, 'description', e.target.value)}
                                placeholder="Deskripsi proyek..."
                                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10.5px] text-slate-700 dark:text-slate-300 focus:outline-none"
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={(proj.technologies || []).join(', ')}
                                  onChange={(e) => handleUpdateProject(idx, pIdx, 'technologies', e.target.value)}
                                  placeholder="Tech Stack (React, Node.js)"
                                  className="px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] text-emerald-600 dark:text-emerald-300 font-mono focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={proj.link || ''}
                                  onChange={(e) => handleUpdateProject(idx, pIdx, 'link', e.target.value)}
                                  placeholder="Link Demo / Repo (https://...)"
                                  className="px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] text-sky-600 dark:text-sky-300 font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">Belum ada detail proyek untuk pekerjaan ini.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Education Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Certifications */}
              <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 text-xs backdrop-blur-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sertifikasi ({candidateCv.certifications.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {candidateCv.certifications.map((cert, cIdx) => (
                    <div key={cert.id || cIdx} className="p-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleUpdateCert(cIdx, 'name', e.target.value)}
                          placeholder="Nama Sertifikasi"
                          className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-transparent text-xs flex-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCert(cIdx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCert(cIdx, 'issuer', e.target.value)}
                          placeholder="Penerbit (AWS, GCP)"
                          className="px-2 py-0.5 rounded-lg bg-transparent text-[10px] text-slate-600 dark:text-slate-300 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => handleUpdateCert(cIdx, 'date', e.target.value)}
                          placeholder="Tahun / Tanggal"
                          className="px-2 py-0.5 rounded-lg bg-transparent text-[10px] text-slate-600 dark:text-slate-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 text-xs backdrop-blur-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pendidikan ({candidateCv.education.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEdu}
                    className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {candidateCv.education.map((edu, eIdx) => (
                    <div key={edu.id || eIdx} className="p-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEdu(eIdx, 'institution', e.target.value)}
                          placeholder="Nama Universitas / Sekolah"
                          className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-transparent text-xs flex-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEdu(eIdx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEdu(eIdx, 'degree', e.target.value)}
                          placeholder="Gelar (S1 / S2 / D3)"
                          className="px-2 py-0.5 rounded-lg bg-transparent text-[10px] text-slate-600 dark:text-slate-300 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.field_of_study}
                          onChange={(e) => handleUpdateEdu(eIdx, 'field_of_study', e.target.value)}
                          placeholder="Jurusan / Program Studi"
                          className="px-2 py-0.5 rounded-lg bg-transparent text-[10px] text-slate-600 dark:text-slate-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/40 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/10 transition-all backdrop-blur-md"
          >
            Batal / Ubah Pilihan
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-7 py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 flex items-center space-x-2 transition-all transform active:scale-95 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Simpan Edit &amp; Hasilkan CV Perusahaan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
