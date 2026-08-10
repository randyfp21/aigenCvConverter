import React, { useState } from 'react';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { User, Briefcase, Award, GraduationCap, Code2, ArrowRight, EyeOff, Clock, Sparkles, X, ShieldAlert, CheckCircle2, Globe, FolderGit2, AlertTriangle, Terminal } from 'lucide-react';

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
  onConfirmExport: (finalCv: CanonicalCV) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  processedCv,
  template,
  aiStatus,
  onClose,
  onConfirmExport,
}) => {
  const [candidateCv, setCandidateCv] = useState<CanonicalCV>(processedCv);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmExport(candidateCv);
  };

  const portfolioLink = candidateCv.personal_information.portfolio_url || candidateCv.personal_information.website || candidateCv.personal_information.linkedin || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
      <div className="bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto backdrop-blur-3xl text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Konfirmasi Hasil Analisis CV Gemini AI</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-300 border border-blue-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Model: {aiStatus?.modelUsed || 'gemini-3-flash-preview'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tinjau kualifikasi kandidat, <strong>Link Portfolio</strong>, &amp; <strong>Pengalaman Proyek</strong> sebelum dicetak ke template PT <strong>{template.company_name}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowLogs(!showLogs)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>{showLogs ? 'Sembunyikan Log Progress' : 'Lihat Progress Log AI'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Banner if Quota Limit Hit or Fallback Used */}
        {aiStatus?.isFallback && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
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
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300 max-h-40 overflow-y-auto shadow-inner">
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
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Informasi Kontak vs. Link Portfolio Kandidat:</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Email Pribadi &amp; No. HP disembunyikan. <strong>Link Portfolio / GitHub / Behance kandidat TETAP DIPERTAHANKAN</strong> untuk menunjukkan karya &amp; rekam jejak kandidat.
            </p>
          </div>
        </div>

        {/* Main Qualification Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Candidate Overview */}
          <div className="space-y-4">
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                <User className="w-4 h-4 text-blue-500" />
                <span>Profil &amp; Portfolio Kandidat</span>
              </h3>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">Nama Lengkap &#123;Nama_lengkap&#125;</label>
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
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">Role / Jabatan Kandidat &#123;role&#125;</label>
                <input
                  type="text"
                  value={candidateCv.role}
                  onChange={(e) => setCandidateCv({ ...candidateCv, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-blue-600 dark:text-sky-400 font-bold shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">Senioritas &amp; Lama Pengalaman &#123;years_of_experience&#125;</label>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{candidateCv.years_of_experience}</span>
                </div>
              </div>

              {/* Portfolio Link Display */}
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-500" />
                  <span>Link Portfolio / GitHub &#123;portfolio_url&#125;</span>
                </label>
                <input
                  type="text"
                  value={portfolioLink}
                  onChange={(e) =>
                    setCandidateCv({
                      ...candidateCv,
                      personal_information: {
                        ...candidateCv.personal_information,
                        portfolio_url: e.target.value,
                        website: e.target.value,
                      },
                    })
                  }
                  placeholder="https://github.com/username atau portfolio"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sky-600 dark:text-sky-300 font-mono text-[11px] shadow-sm"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3 text-amber-500" />
                  <span>Email Pribadi: <strong className="text-slate-400">[Disembunyikan]</strong></span>
                </p>
                <p className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3 text-amber-500" />
                  <span>No. HP Pribadi: <strong className="text-slate-400">[Disembunyikan]</strong></span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Summary About Me &#123;about_me&#125;</span>
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
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs leading-relaxed focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>Kualifikasi Teknikal &#123;technical_qualification&#125;</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {candidateCv.technical_qualifications.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                  >
                    ✓ {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Work Experience, Project History & Education */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>Pengalaman Kerja &amp; Proyek &#123;professional_experience&#125; ({candidateCv.work_experience.length})</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Proyek Di-extract</span>
                </span>
              </h3>

              <div className="space-y-4">
                {candidateCv.work_experience.map((job, idx) => (
                  <div key={job.id || idx} className="border-l-2 border-blue-500 pl-3.5 py-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{job.position}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {job.start_date} {job.start_date || job.end_date ? '-' : ''} {job.end_date}
                      </span>
                    </div>
                    <p className="font-bold text-blue-600 dark:text-sky-400 text-xs">{job.company}</p>

                    <ul className="space-y-1 pt-1">
                      {job.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5 text-[11px]">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Extracted Projects per Employment Record */}
                    {job.projects && job.projects.length > 0 && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3" />
                          <span>Detail Pengalaman Proyek ({job.projects.length}):</span>
                        </p>
                        {job.projects.map((proj, pIdx) => (
                          <div key={pIdx} className="text-[11px] text-slate-700 dark:text-slate-300 pl-2 border-l border-emerald-500/40">
                            <p className="font-bold text-slate-900 dark:text-white">
                              ▸ {proj.name}
                              {proj.link && (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-sky-500 ml-1.5 underline">
                                  [{proj.link}]
                                </a>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{proj.description}</p>
                            {proj.technologies.length > 0 && (
                              <p className="text-[9.5px] text-emerald-600 dark:text-emerald-300 font-mono">Tech: {proj.technologies.join(', ')}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs">
                <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Sertifikasi &#123;certifications&#125;</span>
                </h3>
                <ul className="space-y-1.5">
                  {candidateCv.certifications.map((cert, cIdx) => (
                    <li key={cert.id || cIdx} className="text-[11px] text-slate-700 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">• {cert.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-2">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs">
                <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span>Pendidikan &#123;education&#125;</span>
                </h3>
                <ul className="space-y-1.5">
                  {candidateCv.education.map((edu, eIdx) => (
                    <li key={edu.id || eIdx} className="text-[11px] text-slate-700 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">• {edu.institution}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-2">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Batal / Ubah Pilihan
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-7 py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Konfirmasi &amp; Hasilkan CV Perusahaan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
