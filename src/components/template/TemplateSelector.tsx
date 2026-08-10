import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Building, MapPin, Phone, Globe, Palette, Settings2 } from 'lucide-react';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { CompanyTemplateConfig } from '@/types/cv';
import { getStoredTemplateHistory, saveTemplateToHistory } from '@/lib/templates/templateManager';
import { AddCompanyModal } from './AddCompanyModal';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: CompanyTemplateConfig) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [customTemplates, setCustomTemplates] = useState<CompanyTemplateConfig[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<CompanyTemplateConfig | null>(null);

  useEffect(() => {
    const history = getStoredTemplateHistory();
    setCustomTemplates(history);

    if (history.length > 0) {
      const match = history.find((h) => h.id === selectedTemplateId);
      if (match) {
        onSelectTemplate(match);
      }
    }
  }, []);

  // Merge official templates and custom templates; custom templates override official ones if IDs match
  const allTemplates = [
    ...COMPANY_TEMPLATES.map((official) => {
      const customOverride = customTemplates.find((c) => c.id === official.id);
      return customOverride || official;
    }),
    ...customTemplates.filter((c) => !COMPANY_TEMPLATES.some((p) => p.id === c.id)),
  ];

  const handleSaveCompany = (template: CompanyTemplateConfig) => {
    const updated = saveTemplateToHistory(template);
    setCustomTemplates(updated);
    onSelectTemplate(template);
  };

  const handleOpenEditModal = (tmpl: CompanyTemplateConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTemplate(tmpl);
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingTemplate(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>STEP 2 — Pilih & Kustomisasi Detail PT Perusahaan</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400">
            Kustomisasi logo top-right, warna separator, alamat, website, dan nomor telepon untuk setiap PT.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah PT Baru</span>
        </button>
      </div>

      {/* Main Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allTemplates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          const sepColor = tmpl.theme?.separator_color || tmpl.theme?.secondary_color || '#0284C7';

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className={`relative border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Parameterized Separator Color Bar at Top */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: sepColor }}
              />

              <div>
                {/* Header Row: Company Code, Edit Button & Top-Right Logo */}
                <div className="flex items-start justify-between mb-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {tmpl.code}
                    </span>

                    {/* Edit Detail Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(tmpl, e)}
                      title="Edit Logo, Footer & Color Parameters"
                      className="p-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white border border-slate-700 transition-all"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Top-Right Company Logo */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1 bg-slate-900 border border-slate-700 shadow-md overflow-hidden">
                    {tmpl.logo_url && tmpl.logo_url.startsWith('data:image') ? (
                      <img src={tmpl.logo_url} alt={tmpl.company_name} className="w-full h-full object-contain" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: tmpl.logo_svg }}
                      />
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                  {tmpl.company_name}
                </h3>
                <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">{tmpl.tagline}</p>

                {/* Separator Line Preview */}
                <div className="my-2 flex items-center space-x-2">
                  <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: sepColor }} />
                  <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    {sepColor}
                  </span>
                </div>
              </div>

              {/* Footer Details (Address, Website & Phone Parameterized per PT Card) */}
              <div className="space-y-3 mt-2">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px] text-slate-400">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{tmpl.company_address || 'Jakarta, Indonesia'}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="truncate">{tmpl.company_website || 'www.company.com'}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{tmpl.company_phone || '+62 21 500 8000'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditModal(tmpl, e)}
                    className="col-span-2 py-2.5 rounded-xl font-semibold text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center space-x-1"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit PT</span>
                  </button>

                  <button
                    type="button"
                    className={`col-span-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Dipilih</span>
                      </>
                    ) : (
                      <span>Pilih PT</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New PT Card Button */}
        <div
          onClick={handleOpenAddModal}
          className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/20 hover:bg-slate-900/40 rounded-2xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">+ Tambah Perusahaan PT Baru</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Customize nama, logo, warna separator, alamat, website, dan telp PT
            </p>
          </div>
        </div>
      </div>

      <AddCompanyModal
        isOpen={isAddModalOpen}
        initialData={editingTemplate}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveCompany}
      />
    </div>
  );
};
