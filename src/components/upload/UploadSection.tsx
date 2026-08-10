import React, { useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { FileMetadata } from '@/types/cv';
import { sanitizeFilename, MAX_FILE_SIZE_BYTES } from '@/lib/security/fileSanitizer';

interface UploadSectionProps {
  selectedFile: File | null;
  fileMetadata: FileMetadata | null;
  onFileSelect: (file: File | null) => void;
  onUseSample?: () => void;
  isSampleMode?: boolean;
  error?: string | null;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  fileMetadata,
  onFileSelect,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') return;
    if (file.size > MAX_FILE_SIZE_BYTES) return;
    onFileSelect(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>STEP 1 — Upload Original Source CV</span>
          {fileMetadata && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select candidate PDF or DOCX file to extract profile information.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 hover:bg-slate-900/60 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-blue-400" />
          </div>

          <h3 className="text-sm font-bold text-white mb-1">
            Drag & Drop Original CV Here
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            or <span className="text-blue-400 font-semibold hover:underline">browse file from your computer</span>
          </p>

          <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            <span className="font-bold text-blue-400">PDF</span>
            <span>•</span>
            <span className="font-bold text-emerald-400">DOCX</span>
            <span>•</span>
            <span>Up to 15MB</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-bold text-white">
                  {sanitizeFilename(selectedFile.name)}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected Source
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {formatBytes(selectedFile.size)} • File validated successfully
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change File</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
