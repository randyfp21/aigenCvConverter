import React, { useState, useEffect } from 'react';
import { Building, ChevronDown, Database } from 'lucide-react';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { CompanyTemplateConfig } from '@/types/cv';
import { fetchTemplatesFromPgDatabase } from '@/lib/templates/templateManager';

interface CompanyTemplateSelectProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: CompanyTemplateConfig) => void;
  className?: string;
  disabled?: boolean;
}

export const CompanyTemplateSelect: React.FC<CompanyTemplateSelectProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  className = '',
  disabled = false,
}) => {
  const [allTemplates, setAllTemplates] = useState<CompanyTemplateConfig[]>(COMPANY_TEMPLATES);
  const [isPgConnected, setIsPgConnected] = useState<boolean>(false);

  useEffect(() => {
    fetchTemplatesFromPgDatabase().then((dbTemplates) => {
      setIsPgConnected(true);
      if (dbTemplates.length > 0) {
        // Merge official templates and custom PostgreSQL templates
        const merged = [
          ...COMPANY_TEMPLATES.map((official) => {
            const customOverride = dbTemplates.find((c) => c.id === official.id);
            return customOverride || official;
          }),
          ...dbTemplates.filter((c) => !COMPANY_TEMPLATES.some((p) => p.id === c.id)),
        ];
        setAllTemplates(merged);

        const currentMatch = merged.find((t) => t.id === selectedTemplateId);
        if (currentMatch) {
          onSelectTemplate(currentMatch);
        }
      }
    });
  }, []);

  const selectedTemplate = allTemplates.find((t) => t.id === selectedTemplateId) || allTemplates[0];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-blue-500" />
          <span>Target Template Company Perusahaan:</span>
        </label>
        {isPgConnected && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Database className="w-2.5 h-2.5 text-emerald-500" />
            <span>PostgreSQL Active</span>
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={selectedTemplateId}
          disabled={disabled}
          onChange={(e) => {
            const match = allTemplates.find((t) => t.id === e.target.value);
            if (match) {
              onSelectTemplate(match);
            }
          }}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {allTemplates.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-bold">
              [{tmpl.code}] {tmpl.company_name} — {tmpl.tagline || tmpl.description || 'Official Corporate Template'}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {selectedTemplate && (
        <div className="mt-3 space-y-2">
          {/* Interactive Options: Logo Company & Footer Perusahaan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs backdrop-blur-md">
            {/* Toggle Logo Company */}
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedTemplate.show_company_logo ?? true}
                disabled={disabled}
                onChange={(e) => {
                  onSelectTemplate({
                    ...selectedTemplate,
                    show_company_logo: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                🖼️ Tampilkan Logo Company
              </span>
            </label>

            {/* Toggle Footer Perusahaan */}
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedTemplate.show_company_footer ?? true}
                disabled={disabled}
                onChange={(e) => {
                  onSelectTemplate({
                    ...selectedTemplate,
                    show_company_footer: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                🏢 Tampilkan Footer Perusahaan
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 backdrop-blur-md">
            <span className="truncate">
              Format Dokumen: <strong className="text-slate-900 dark:text-white font-bold">{selectedTemplate.company_name}</strong> ({selectedTemplate.code})
            </span>
            <div className="flex items-center space-x-1.5 shrink-0 ml-2">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                style={{ backgroundColor: selectedTemplate.theme?.primary_color || '#0F172A' }}
                title="Warna Utama"
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                style={{ backgroundColor: selectedTemplate.theme?.separator_color || selectedTemplate.theme?.secondary_color || '#0284C7' }}
                title="Warna Separator"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
