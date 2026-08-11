import React from 'react';
import { Sparkles, MessageSquarePlus, Wand2, CheckCircle2, Info } from 'lucide-react';

interface EnhancementSectionProps {
  customInstructions: string;
  onChangeCustomInstructions: (val: string) => void;
}

export const EnhancementSection: React.FC<EnhancementSectionProps> = ({
  customInstructions,
  onChangeCustomInstructions,
}) => {
  const quickSuggestions = [
    'Transformasi kandidat dari Fullstack Developer menjadi Solutions Architect',
    'Tambahkan pengalaman proyek interview: Migrasi Cloud Microservices ke Kubernetes & Go',
    'Fokuskan ringkasan profil pada keahlian AI Engineering & Large Language Models',
    'Tambahkan sertifikasi baru: AWS Certified Solutions Architect Associate (2026)',
  ];

  const handleChipClick = (suggestion: string) => {
    if (!customInstructions) {
      onChangeCustomInstructions(suggestion);
    } else if (!customInstructions.includes(suggestion)) {
      onChangeCustomInstructions(`${customInstructions.trim()}\n- ${suggestion}`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 bg-white/40 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-white/40 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black tracking-widest text-blue-600 dark:text-sky-400 uppercase">
              STEP 4 (OPSIONAL)
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Catatan Interview &amp; Transformasi Role (AI Enhancement)</span>
              <Wand2 className="w-5 h-5 text-purple-500 animate-pulse" />
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Jika dikosongkan, konversi berjalan standar (100% data asli CV). Jika diisi, Gemini AI akan memperkaya CV dari hasil interview atau requirement role target.
          </p>
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 dark:bg-white/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 dark:border-white/20 backdrop-blur-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Opsional / Optional</span>
        </span>
      </div>

      <div className="space-y-4">
        {/* Helper Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 backdrop-blur-md">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Kapan fitur ini digunakan?</strong> Saat kandidat memiliki pengalaman baru dari hasil interview yang belum sempat tertulis di CV asli, atau saat Anda ingin menyesuaikan CV kandidat agar cocok dengan requirement role pekerjaan yang baru.
          </p>
        </div>

        {/* Text Area Input */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
            <MessageSquarePlus className="w-4 h-4 text-blue-500" />
            <span>Instruksi Tambahan Interview / Requirement Role Target:</span>
          </label>
          <textarea
            rows={4}
            value={customInstructions}
            onChange={(e) => onChangeCustomInstructions(e.target.value)}
            placeholder="Contoh: Tambahkan pengalaman proyek Flutter & Golang dari interview kemarin. Sesuaikan ringkasan profil kandidat menjadi Senior Solutions Architect..."
            className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm backdrop-blur-md text-xs leading-relaxed font-medium"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rekomendasi Contoh Instruksi (Klik untuk Mengisi):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-[10.5px] font-bold px-3 py-1.5 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-500/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95 text-left"
              >
                <span>💡 {chip}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
