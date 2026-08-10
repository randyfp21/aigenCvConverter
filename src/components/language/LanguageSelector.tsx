import React from 'react';
import { TargetLanguage } from '@/types/cv';
import { CheckCircle2 } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: TargetLanguage;
  onSelectLanguage: (lang: TargetLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 bg-white/40 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-white/40 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black tracking-widest text-blue-600 dark:text-sky-400 uppercase">STEP 3</span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pilih Bahasa Output Dokumen CV</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Gemini AI akan menerjemahkan kualifikasi dan poin tanggung jawab sesuai bahasa target yang dipilih.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* English Option */}
        <button
          type="button"
          onClick={() => onSelectLanguage('en')}
          className={`p-5 rounded-3xl border text-left transition-all duration-500 flex items-center justify-between backdrop-blur-3xl glass-glow ${
            selectedLanguage === 'en'
              ? 'bg-blue-500/10 dark:bg-white/15 border-blue-500 ring-2 ring-blue-500/30 shadow-2xl scale-[1.01]'
              : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/60 dark:hover:bg-white/10'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-sky-400 flex items-center justify-center font-black text-lg backdrop-blur-md">
              EN
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">English (International Corporate)</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Standard format for multinational enterprises &amp; global clients
              </p>
            </div>
          </div>
          {selectedLanguage === 'en' && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
        </button>

        {/* Indonesian Option */}
        <button
          type="button"
          onClick={() => onSelectLanguage('id')}
          className={`p-5 rounded-3xl border text-left transition-all duration-500 flex items-center justify-between backdrop-blur-3xl glass-glow ${
            selectedLanguage === 'id'
              ? 'bg-emerald-500/10 dark:bg-white/15 border-emerald-500 ring-2 ring-emerald-500/30 shadow-2xl scale-[1.01]'
              : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-emerald-500/50 hover:bg-white/60 dark:hover:bg-white/10'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg backdrop-blur-md">
              ID
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Bahasa Indonesia (Resmi Nasional)</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Format baku Indonesia untuk instansi, BUMN, &amp; korporasi nasional
              </p>
            </div>
          </div>
          {selectedLanguage === 'id' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
        </button>
      </div>
    </div>
  );
};
