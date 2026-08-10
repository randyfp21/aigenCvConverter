import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, FileUp, History, Sparkles, Building } from 'lucide-react';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { CompanyTemplateConfig } from '@/types/cv';
import {
  getStoredTemplateHistory,
  getStoredCompanyPdfMap,
  createTemplateFromUploadedFile,
  UploadedCompanyPdfMap,
} from '@/lib/templates/templateManager';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: CompanyTemplateConfig) => void;
  onTargetTemplateFileSelect?: (file: File | null) => void;
}

// Converts Base64 data URI string back to a File object
function base64ToFile(base64Data: string, filename: string): File {
  const arr = base64Data.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const bstr = atob(arr[1] || arr[0]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onTargetTemplateFileSelect,
}) => {
  const [historyTemplates, setHistoryTemplates] = useState<CompanyTemplateConfig[]>([]);
  const [pdfMap, setPdfMap] = useState<UploadedCompanyPdfMap>({});
  const [activeTab, setActiveTab] = useState<'pts' | 'history'>('pts');
  const [uploadingForCompanyId, setUploadingForCompanyId] = useState<string | null>(null);

  const generalFileInputRef = useRef<HTMLInputElement>(null);
  const companyFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistoryTemplates(getStoredTemplateHistory());
    setPdfMap(getStoredCompanyPdfMap());
  }, []);

  const handleGeneralFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const newTemplate = createTemplateFromUploadedFile(file.name, undefined, base64);
        setHistoryTemplates(getStoredTemplateHistory());
        setPdfMap(getStoredCompanyPdfMap());

        if (onTargetTemplateFileSelect) {
          onTargetTemplateFileSelect(file);
        }

        onSelectTemplate(newTemplate);
        setActiveTab('history');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && uploadingForCompanyId) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const updatedTemplate = createTemplateFromUploadedFile(file.name, uploadingForCompanyId, base64);
        setHistoryTemplates(getStoredTemplateHistory());
        setPdfMap(getStoredCompanyPdfMap());

        if (onTargetTemplateFileSelect) {
          onTargetTemplateFileSelect(file);
        }

        onSelectTemplate(updatedTemplate);
        setUploadingForCompanyId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCompanyPdfUpload = (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadingForCompanyId(companyId);
    companyFileInputRef.current?.click();
  };

  const handleSelectCompanyCard = (tmpl: CompanyTemplateConfig) => {
    onSelectTemplate(tmpl);

    // If company has stored target file Base64, convert back to File and pass to parent
    const stored = pdfMap[tmpl.id];
    if (stored && stored.pdfBase64 && onTargetTemplateFileSelect) {
      const fileObj = base64ToFile(stored.pdfBase64, stored.pdfFileName);
      onTargetTemplateFileSelect(fileObj);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>STEP 2 — Select / Upload Target CV Template (DOCX)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400">
            Upload your target DOCX template file to map candidate variables directly into your exact document layout.
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pts')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>4 Official PT Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Uploaded History ({historyTemplates.length})</span>
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={generalFileInputRef}
        onChange={handleGeneralFileUpload}
        accept=".docx,.pdf"
        className="hidden"
      />

      <input
        type="file"
        ref={companyFileInputRef}
        onChange={handleCompanyPdfUpload}
        accept=".docx,.pdf"
        className="hidden"
      />

      {/* Main Grid: 4 Official Companies / PTs */}
      {activeTab === 'pts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANY_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            const pdfAttachment = pdfMap[tmpl.id];

            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectCompanyCard(tmpl)}
                className={`relative border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1 bg-slate-900 border border-slate-700">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: tmpl.logo_svg }}
                      />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {tmpl.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                    {tmpl.company_name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">{tmpl.tagline}</p>

                  {pdfAttachment ? (
                    <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Target DOCX Loaded: {pdfAttachment.pdfFileName}</span>
                    </div>
                  ) : (
                    <div className="mb-4 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>Ready to receive target DOCX</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => triggerCompanyPdfUpload(tmpl.id, e)}
                    className="w-full py-2 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Upload Target DOCX</span>
                  </button>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Template</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {historyTemplates.length === 0 ? (
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300 mb-1">No Custom Uploaded History Yet</p>
              <p className="text-slate-500 mb-4">
                Upload target template DOCX files for your PTs above to store them in your history registry.
              </p>
              <button
                type="button"
                onClick={() => generalFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center mx-auto space-x-2"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload Target DOCX Template</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {historyTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectCompanyCard(tmpl)}
                    className={`relative border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1 bg-slate-900 border border-slate-700">
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: tmpl.logo_svg }}
                          />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          History Target
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1">{tmpl.company_name}</h3>
                      <p className="text-xs text-slate-300 mb-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {tmpl.description}
                      </p>

                      {tmpl.uploadedAt && (
                        <p className="text-[10px] text-slate-400 mb-4">
                          Saved: {tmpl.uploadedAt}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Template Selected</span>
                        </>
                      ) : (
                        <span>Select Template</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
