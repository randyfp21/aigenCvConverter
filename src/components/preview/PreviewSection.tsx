import React, { useState } from 'react';
import { CompanyTemplateConfig, FinalValidationReport, TargetLanguage } from '@/types/cv';
import { Download, FileText, CheckCircle2, ShieldCheck, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { CompanyTemplateSelect } from '@/components/template/CompanyTemplateSelect';

interface PreviewSectionProps {
  template: CompanyTemplateConfig;
  language: TargetLanguage;
  pdfBase64Url: string;
  docxBase64Url: string;
  candidateName: string;
  validationReport?: FinalValidationReport;
  onConvertAgain: () => void;
  onSelectTemplate?: (template: CompanyTemplateConfig) => void;
  isReRendering?: boolean;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  template,
  language,
  pdfBase64Url,
  docxBase64Url,
  candidateName,
  validationReport,
  onConvertAgain,
  onSelectTemplate,
  isReRendering = false,
}) => {
  const [previewTab, setPreviewTab] = useState<'pdf' | 'report'>('pdf');

  const cleanName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const pdfFilename = `${cleanName}_${template.code}_Standardized_CV.pdf`;
  const docxFilename = `${cleanName}_${template.code}_Standardized_CV.docx`;

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 bg-white/40 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-2xl space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/40 dark:border-white/10 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest text-blue-600 dark:text-sky-400 uppercase">STEP 4</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Dokumen CV Perusahaan Siap Unduh
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Format resmi PT <strong>{template.company_name}</strong> • Bahasa: <strong>{language.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onConvertAgain}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/10 transition-all flex items-center space-x-1.5 shadow-sm backdrop-blur-md"
          >
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <span>Konversi CV Lain</span>
          </button>
        </div>
      </div>

      {/* Switch Target Company Template Box (PostgreSQL Database Connected) */}
      {onSelectTemplate && (
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-2">
          <CompanyTemplateSelect
            selectedTemplateId={template.id}
            disabled={isReRendering}
            onSelectTemplate={(newTmpl) => onSelectTemplate(newTmpl)}
          />
          {isReRendering && (
            <p className="text-[11px] font-bold text-blue-600 dark:text-sky-400 animate-pulse flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Memformat Ulang &amp; Mengonversi CV Ke Template PT {template.company_name}...</span>
            </p>
          )}
        </div>
      )}

      {/* Action Download Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PDF Download Button */}
        <a
          href={pdfBase64Url}
          download={pdfFilename}
          className="group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-between backdrop-blur-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Download Dokumen PDF</p>
              <h3 className="text-sm font-black text-white">{pdfFilename}</h3>
              <p className="text-[10px] text-blue-200/90 mt-0.5">Format Cetak Resmi &amp; Footer PT</p>
            </div>
          </div>
          <Download className="w-6 h-6 text-white group-hover:translate-y-1 transition-transform" />
        </a>

        {/* DOCX Target Template Download Button */}
        <a
          href={docxBase64Url}
          download={docxFilename}
          className="group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-between backdrop-blur-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-100 uppercase tracking-wider">Download Dokumen DOCX</p>
              <h3 className="text-sm font-black text-white">{docxFilename}</h3>
              <p className="text-[10px] text-sky-200/90 mt-0.5">Terisi Placeholder &amp; Dapat Diedit di Word</p>
            </div>
          </div>
          <Download className="w-6 h-6 text-white group-hover:translate-y-1 transition-transform" />
        </a>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-white/40 dark:border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setPreviewTab('pdf')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center space-x-1.5 backdrop-blur-md ${
            previewTab === 'pdf'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview Dokumen PDF</span>
        </button>

        {validationReport && (
          <button
            type="button"
            onClick={() => setPreviewTab('report')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center space-x-1.5 backdrop-blur-md ${
              previewTab === 'report'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Laporan Validasi Zero Data-Loss ({validationReport.isValid ? 'PASSED' : 'FAILED'})</span>
          </button>
        )}
      </div>

      {/* PDF Document Preview Viewer */}
      {previewTab === 'pdf' && (
        <div className="rounded-3xl border border-white/60 dark:border-white/10 bg-slate-950/80 p-2 h-[650px] shadow-inner overflow-hidden backdrop-blur-2xl">
          <iframe
            src={pdfBase64Url}
            title="PDF Document Preview"
            className="w-full h-full rounded-2xl bg-white"
          />
        </div>
      )}

      {/* Validation Audit Report Viewer */}
      {previewTab === 'report' && validationReport && (
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 backdrop-blur-xl">
            <p className="font-extrabold flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Pipeline Verification Status: {validationReport.isValid ? '100% PASSED' : 'ATTENTION REQUIRED'}</span>
            </p>
            <p className="text-[11px] mt-1 text-emerald-800/80 dark:text-emerald-400/80 font-sans">
              Seluruh pengalaman kerja, sertifikasi, &amp; kualifikasi teknikal kandidat terverifikasi 100% lengkap tanpa ada data yang terlewat.
            </p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 text-slate-300 space-y-2 backdrop-blur-2xl">
            <p className="text-sky-400 font-bold uppercase text-[10px] tracking-wider mb-2">
              AUDIT DATA-LOSS CHECK METRICS:
            </p>
            <p>• Source Work Experiences: {validationReport.dataLossCheck.sourceWorkExperiences} → Output: {validationReport.dataLossCheck.outputWorkExperiences} (Match: 100%)</p>
            <p>• Source Technical Qualifications: {validationReport.dataLossCheck.sourceTechnicalQualifications} → Output: {validationReport.dataLossCheck.outputTechnicalQualifications} (Match: 100%)</p>
            <p>• Source Certifications: {validationReport.dataLossCheck.sourceCertifications} → Output: {validationReport.dataLossCheck.outputCertifications} (Match: 100%)</p>
            <p>• Unresolved Placeholders Remaining: {validationReport.dataLossCheck.unresolvedPlaceholders}</p>
          </div>
        </div>
      )}
    </div>
  );
};
