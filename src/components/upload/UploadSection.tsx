import React, { useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { FileMetadata } from '@/types/cv';

interface UploadSectionProps {
  selectedFile: File | null;
  fileMetadata: FileMetadata | null;
  onFileSelect: (file: File | null) => void;
  onUseSample: () => void;
  isSampleMode: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  fileMetadata,
  onFileSelect,
  onUseSample,
  isSampleMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 bg-white/40 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-2xl">
      {/* Liquid Ambient Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-blue-500/20 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-indigo-500/20 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/40 dark:border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest text-blue-600 dark:text-sky-400 uppercase">STEP 1</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Unggah CV Kandidat (PDF / DOCX)
              </h2>
              {fileMetadata && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              File CV kandidat akan dianalisis secara presisi oleh <strong>Gemini AI (gemini-3-flash-preview)</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onUseSample}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all duration-300 flex items-center space-x-1.5 backdrop-blur-xl ${
              isSampleMode
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Gunakan Contoh CV Kandidat (Randy Farhan)</span>
          </button>
        </div>

        {/* Translucent Glass Dropzone Container */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl p-8 border-2 border-dashed transition-all duration-500 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-2xl ${
            selectedFile || isSampleMode
              ? 'border-blue-500/60 bg-blue-500/5 dark:bg-blue-600/10 shadow-lg shadow-blue-500/10'
              : 'border-white/60 dark:border-white/15 hover:border-blue-500/60 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFileSelect(e.target.files[0]);
              }
            }}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 transform group-hover:scale-105 transition-transform duration-500">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              Tarik &amp; Lepaskan File CV di Sini, atau <span className="text-blue-600 dark:text-sky-400 underline">Cari File</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Mendukung Format PDF &amp; DOCX (Maksimal 25MB)
            </p>
          </div>

          {/* Uploaded File Pill */}
          {fileMetadata && (
            <div className="mt-2 inline-flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/20 backdrop-blur-2xl shadow-lg text-xs font-semibold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>{fileMetadata.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                ({Math.round(fileMetadata.sizeBytes / 1024)} KB)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
