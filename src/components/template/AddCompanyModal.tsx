import React, { useState } from 'react';
import { CompanyTemplateConfig } from '@/types/cv';
import { X, Building2, Palette, MapPin, Phone, Sparkles } from 'lucide-react';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTemplate: CompanyTemplateConfig) => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [companyName, setCompanyName] = useState('');
  const [code, setCode] = useState('');
  const [tagline, setTagline] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0F172A'); // Dark navy
  const [separatorColor, setSeparatorColor] = useState('#0284C7'); // Sky blue
  const [secondaryColor, setSecondaryColor] = useState('#38BDF8');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = (code || companyName.substring(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const templateId = `company-custom-${Date.now()}`;

    const newTemplate: CompanyTemplateConfig = {
      id: templateId,
      company_name: companyName || 'PT Perusahaan Baru',
      code: cleanCode || 'NEWPT',
      tagline: tagline || 'Corporate Technology & Business Services',
      description: `Custom company template for ${companyName}.`,
      company_address: companyAddress || 'Jakarta, Indonesia',
      company_phone: companyPhone || '+62 21 500 8000',
      isCustomUploaded: true,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      logo_svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="${primaryColor}"/>
        <path d="M30 30H70V70H30V30Z" stroke="${separatorColor}" stroke-width="6"/>
        <circle cx="50" cy="50" r="12" fill="${secondaryColor}"/>
      </svg>`,
      theme: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: secondaryColor,
        separator_color: separatorColor,
        text_color: '#1F2937',
        background_color: '#FFFFFF',
        font_family: 'Inter, Helvetica, Arial, sans-serif',
      },
      layout: {
        header_style: 'standard',
        columns: 1,
        section_order: [
          'personal_information',
          'summary',
          'work_experience',
          'technical_qualifications',
          'skills',
          'certifications',
          'education',
          'languages',
        ],
        section_titles: {
          summary: { en: 'Executive Summary', id: 'Ringkasan Eksekutif' },
          work_experience: { en: 'Professional Experience', id: 'Pengalaman Kerja' },
          technical_qualifications: { en: 'Technical Qualifications', id: 'Kualifikasi Teknikal' },
          skills: { en: 'Technical Skills & Competencies', id: 'Keahlian & Kompetensi Teknikal' },
          certifications: { en: 'Professional Certifications', id: 'Sertifikasi Profesional' },
          education: { en: 'Education & Academic History', id: 'Pendidikan' },
          languages: { en: 'Languages', id: 'Bahasa' },
        },
      },
    };

    onSave(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Perusahaan / PT Baru</h3>
              <p className="text-xs text-slate-400">Atur parameter logo, warna separator, header & footer PT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / PT *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: PT Aigen Global Teknologi"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kode PT (Short Code)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="AIGEN"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="AI & Enterprise Solutions"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Alamat Perusahaan (Header/Footer)</span>
            </label>
            <input
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Menara Aigen, Jl. HR Rasuna Said, Jakarta Selatan"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nomor Telepon Perusahaan (Footer)</span>
            </label>
            <input
              type="text"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="+62 21 520 8890"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Color Parameterizer */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Kustomisasi Warna & Separator</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Warna Utama</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-300 font-mono">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Warna Separator</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={separatorColor}
                    onChange={(e) => setSeparatorColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-300 font-mono">{separatorColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Warna Akses</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-300 font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan & Pakai PT Ini</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
