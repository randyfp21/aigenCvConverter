import React, { useState, useEffect } from 'react';
import { CvHistoryItem } from '@/types/cv';
import { History, FileText, Download, Trash2, Eye, RefreshCw, Calendar, User, Building, Database } from 'lucide-react';

interface CvHistorySectionProps {
  onOpenDraft: (item: CvHistoryItem) => void;
  onPreviewOutput: (item: CvHistoryItem) => void;
}

export const CvHistorySection: React.FC<CvHistorySectionProps> = ({
  onOpenDraft,
  onPreviewOutput,
}) => {
  const [historyItems, setHistoryItems] = useState<CvHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cv/history');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.history)) {
        setHistoryItems(data.history);
      }
    } catch (e) {
      console.warn('Failed to fetch CV history from PostgreSQL:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus draft CV ini dari database PostgreSQL?')) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/cv/history?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete CV history:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading && historyItems.length === 0) {
    return (
      <div className="rounded-3xl p-6 bg-white/40 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-xl flex items-center justify-center space-x-2 text-xs font-bold text-slate-500">
        <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span>Memuat History &amp; Draft CV dari PostgreSQL Database...</span>
      </div>
    );
  }

  if (historyItems.length === 0) {
    return null; // Do not render history box if empty
  }

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 bg-white/50 dark:bg-slate-950/50 border border-white/60 dark:border-white/10 backdrop-blur-3xl shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/40 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase flex items-center gap-1">
              <History className="w-4 h-4 text-purple-500" />
              <span>DATABASE HISTORY</span>
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Riwayat Draft &amp; Hasil Analisis CV</span>
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-500" />
              <span>PostgreSQL Persisted ({historyItems.length})</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Seluruh data ekstraksi &amp; draft CV kandidat tersimpan otomatis di PostgreSQL. Klik <strong>Buka &amp; Edit Draft</strong> untuk mengubah data atau mengganti template PT kapan saja.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          className="px-3.5 py-2 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-white/10 hover:bg-white/90 border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* History Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historyItems.map((item) => {
          const dateStr = item.created_at
            ? new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Baru saja';

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl p-5 bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                {/* Candidate Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {item.candidate_name}
                      </h3>
                      <p className="text-[11px] font-bold text-blue-600 dark:text-sky-400 truncate">
                        {item.candidate_role || 'Professional Profile'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={isDeleting === item.id}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Hapus dari Database"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Company Badge & Metadata */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>Target PT:</span>
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[160px]">
                      [{item.template_code}] {item.company_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.target_language}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onOpenDraft(item)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Edit Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPreviewOutput(item)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
