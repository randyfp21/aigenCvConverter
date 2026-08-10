import React from 'react';
import { Globe, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TargetLanguage } from '@/types/cv';

interface LanguageSelectorProps {
  selectedLanguage: TargetLanguage;
  onSelectLanguage: (lang: TargetLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>STEP 3 — Select Output Language</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400">
            Factual statements will be translated while keeping company names, technologies, and certifications protected.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode A: English */}
        <div
          onClick={() => onSelectLanguage('en')}
          className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start justify-between ${
            selectedLanguage === 'en'
              ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 text-white'
              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Convert to English</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  Default
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Standard international CV format. Responsibilities and summaries presented in English.
              </p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedLanguage === 'en'
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            {selectedLanguage === 'en' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* Mode B: Bahasa Indonesia */}
        <div
          onClick={() => onSelectLanguage('id')}
          className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start justify-between ${
            selectedLanguage === 'id'
              ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 text-white'
              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Convert to Bahasa Indonesia</h3>
              <p className="text-xs text-slate-400 mt-1">
                Standard Indonesian national CV format with localized section headers and descriptions.
              </p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedLanguage === 'id'
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            {selectedLanguage === 'id' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          <strong>Entity Protection Active:</strong> Company names (<em>PT Bank ABC</em>), technology stack (<em>PostgreSQL, Kafka, AWS</em>), job titles, and certifications are preserved verbatim.
        </span>
      </div>
    </div>
  );
};
