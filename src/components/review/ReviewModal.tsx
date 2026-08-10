import React from 'react';
import { CanonicalCV, CompanyTemplateConfig, TargetLanguage } from '@/types/cv';
import { User, Briefcase, Award, GraduationCap, Code2, ArrowRight, EyeOff, Clock, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  cv: CanonicalCV;
  template: CompanyTemplateConfig;
  language: TargetLanguage;
  onConfirm: () => void;
  onBack: () => void;
  isConverting: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  cv,
  template,
  language,
  onConfirm,
  onBack,
  isConverting,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">STEP 4 — Review Extracted & Qualified CV Data</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DOCX Placeholders Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data candidate analyzed and formatted for target template placeholders (<code>{`{Nama_lengkap}`}</code>, <code>{`{role}`}</code>, <code>{`{about_me}`}</code>, <code>{`{years_of_experience}`}</code>).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isConverting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            Modify Selection
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConverting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {isConverting ? (
              <span>Mapping to Target DOCX...</span>
            ) : (
              <>
                <span>Confirm & Map to Target Template</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Qualification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Qualifications & Seniority */}
        <div className="space-y-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-400" />
              <span>Candidate Qualification</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-500 text-[10px]">Nama Lengkap &#123;Nama_lengkap&#125;</p>
                <p className="font-bold text-white text-base">{cv.personal_information.full_name}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[10px]">Role Kandidat &#123;role&#125;</p>
                <p className="font-bold text-blue-400 text-sm">{cv.role || 'Professional'}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[10px]">Lama Pengalaman &#123;years_of_experience&#125;</p>
                <div className="mt-1 inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{cv.years_of_experience}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2 mt-2">
                <EyeOff className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Contact Privacy Active</p>
                  <p className="text-[10px] text-slate-300">
                    Email, Phone & Location omitted in final target CV output.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Summary About Me &#123;about_me&#125;</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {cv.about_me || cv.summary}
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Technical Qualification ({cv.technical_qualifications.length})</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.technical_qualifications.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                >
                  ✓ {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Work Experiences, Education & Certifications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Professional Experience ({cv.work_experience.length})</span>
            </h3>

            <div className="space-y-4">
              {cv.work_experience.map((job, idx) => (
                <div key={job.id || idx} className="border-l-2 border-blue-500 pl-4 py-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{job.position}</h4>
                    <span className="text-xs text-slate-400">
                      {job.start_date} {job.start_date || job.end_date ? '-' : ''} {job.end_date}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">{job.company}</p>

                  <ul className="space-y-1">
                    {job.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>List Certification ({cv.certifications.length})</span>
              </h3>
              <ul className="space-y-2">
                {cv.certifications.map((cert, cIdx) => (
                  <li key={cert.id || cIdx} className="text-xs text-slate-300">
                    <p className="font-semibold text-white">{cert.name}</p>
                    <p className="text-[10px] text-slate-400">{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>List Education ({cv.education.length})</span>
              </h3>
              <ul className="space-y-2">
                {cv.education.map((edu, eIdx) => (
                  <li key={edu.id || eIdx} className="text-xs text-slate-300">
                    <p className="font-semibold text-white">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
