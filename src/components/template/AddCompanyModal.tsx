import React, { useState, useEffect, useRef } from 'react';
import { CompanyTemplateConfig } from '@/types/cv';
import { X, Building2, Palette, MapPin, Phone, Globe, Upload, Sparkles, Type, Frame } from 'lucide-react';

interface AddCompanyModalProps {
  isOpen: boolean;
  initialData?: CompanyTemplateConfig | null;
  onClose: () => void;
  onSave: (template: CompanyTemplateConfig) => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [code, setCode] = useState('');
  const [tagline, setTagline] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0F172A');
  const [separatorColor, setSeparatorColor] = useState('#0284C7');
  const [secondaryColor, setSecondaryColor] = useState('#38BDF8');
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [showPageBorder, setShowPageBorder] = useState<boolean>(true);
  const [pageBorderColor, setPageBorderColor] = useState('#000000');
  const [pageBorderWidth, setPageBorderWidth] = useState<number>(1);
  const [logoSvg, setLogoSvg] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.company_name || '');
      setCode(initialData.code || '');
      setTagline(initialData.tagline || '');
      setCompanyAddress(initialData.company_address || '');
      setCompanyWebsite(initialData.company_website || '');
      setCompanyPhone(initialData.company_phone || '');
      setPrimaryColor(initialData.theme?.primary_color || '#0F172A');
      setSeparatorColor(initialData.theme?.separator_color || initialData.theme?.secondary_color || '#0284C7');
      setSecondaryColor(initialData.theme?.secondary_color || '#38BDF8');
      setFontFamily(initialData.theme?.font_family || 'Calibri');
      setShowPageBorder(initialData.theme?.show_page_border ?? true);
      setPageBorderColor(initialData.theme?.page_border_color || '#000000');
      setPageBorderWidth(initialData.theme?.page_border_width || 1);
      setLogoSvg(initialData.logo_svg || '');
      setLogoUrl(initialData.logo_url || '');
    } else {
      setCompanyName('');
      setCode('');
      setTagline('');
      setCompanyAddress('');
      setCompanyWebsite('');
      setCompanyPhone('');
      setPrimaryColor('#0F172A');
      setSeparatorColor('#0284C7');
      setSecondaryColor('#38BDF8');
      setFontFamily('Calibri');
      setShowPageBorder(true);
      setPageBorderColor('#000000');
      setPageBorderWidth(1);
      setLogoSvg('');
      setLogoUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setLogoUrl(base64);
        const imgSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="${primaryColor}"/>
          <image href="${base64}" x="10" y="10" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
        </svg>`;
        setLogoSvg(imgSvg);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = (code || companyName.substring(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const templateId = initialData?.id || `company-custom-${Date.now()}`;

    const defaultSvg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="${primaryColor}"/>
      <path d="M30 30H70V70H30V30Z" stroke="${separatorColor}" stroke-width="6"/>
      <circle cx="50" cy="50" r="12" fill="${secondaryColor}"/>
    </svg>`;

    const updatedTemplate: CompanyTemplateConfig = {
      id: templateId,
      company_name: companyName || 'PT Perusahaan Baru',
      code: cleanCode || 'NEWPT',
      tagline: tagline || 'Corporate Technology & Business Services',
      description: `Custom company template for ${companyName}.`,
      company_address: companyAddress || 'Jakarta, Indonesia',
      company_website: companyWebsite || 'www.company.com',
      company_phone: companyPhone || '+62 21 500 8000',
      isCustomUploaded: true,
      uploadedAt: initialData?.uploadedAt || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      logo_svg: logoSvg || defaultSvg,
      logo_url: logoUrl || initialData?.logo_url || '',
      theme: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: secondaryColor,
        separator_color: separatorColor,
        text_color: '#1F2937',
        background_color: '#FFFFFF',
        font_family: fontFamily,
        show_page_border: showPageBorder,
        page_border_color: pageBorderColor,
        page_border_width: pageBorderWidth,
      },
      layout: initialData?.layout || {
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

    onSave(updatedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-3xl">
      <div className="bg-white/60 dark:bg-slate-950/80 border border-white/60 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto backdrop-blur-3xl text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between border-b border-white/40 dark:border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-sky-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {initialData ? `Edit Detail ${initialData.company_name}` : 'Tambah Perusahaan / PT Baru'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Kustomisasi logo, footer, warna, font, &amp; border outer CV</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Logo Customizer Preview */}
          <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 flex items-center justify-between shadow-sm backdrop-blur-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/15 p-1 flex items-center justify-center overflow-hidden shadow-sm backdrop-blur-md">
                {logoUrl ? (
                  <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                ) : logoSvg ? (
                  <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: logoSvg }} />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Logo Perusahaan (Pojok Kanan Atas)</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {logoUrl ? '✓ Logo Gambar Ter-upload' : 'Upload logo PNG/JPG/SVG milik PT Anda'}
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={logoFileInputRef}
              onChange={handleLogoFileUpload}
              accept="image/*,.svg"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => logoFileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-2xl text-[11px] font-bold text-blue-600 dark:text-sky-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 flex items-center gap-1.5 shadow-sm backdrop-blur-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{logoUrl ? 'Ganti Logo' : 'Upload Logo'}</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">Nama Perusahaan / PT *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: PT Aigen Global Teknologi"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm backdrop-blur-md font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">Kode PT (Short Code)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="AIGEN"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 uppercase shadow-sm font-mono font-semibold backdrop-blur-md"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="AI & Enterprise Solutions"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-semibold backdrop-blur-md"
              />
            </div>
          </div>

          {/* Opsi Pemilihan Font Document CV */}
          <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 space-y-2 shadow-sm backdrop-blur-2xl">
            <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Type className="w-4 h-4 text-blue-500" />
              <span>Pilihan Jenis Font CV (Document Font Family)</span>
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-900 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-blue-500 backdrop-blur-md shadow-sm"
            >
              <option value="Calibri">Calibri (Standard Executive - Default Word)</option>
              <option value="Helvetica">Helvetica / Inter (Modern Minimalist)</option>
              <option value="Arial">Arial / Roboto (Clean Corporate)</option>
              <option value="Times New Roman">Times New Roman (Classic Formal Serif)</option>
              <option value="Georgia">Georgia (Executive Serif)</option>
            </select>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Font yang dipilih akan diterapkan secara konsisten pada output PDF dan DOCX.
            </p>
          </div>

          {/* Opsi Border Hitam / Warna Tipis di Edge CV */}
          <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 space-y-3 shadow-sm backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Frame className="w-4 h-4 text-emerald-500" />
                <span>Gunakan Border Outer CV (Border Tipis Pinggir Dokumen)</span>
              </label>
              <input
                type="checkbox"
                checked={showPageBorder}
                onChange={(e) => setShowPageBorder(e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {showPageBorder && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/40 dark:border-white/10">
                <div>
                  <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">Ketebalan Border (pt)</label>
                  <select
                    value={pageBorderWidth}
                    onChange={(e) => setPageBorderWidth(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-900 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs font-bold"
                  >
                    <option value={0.5}>0.5 pt (Sangat Tipis)</option>
                    <option value={1}>1.0 pt (Standar Presisi)</option>
                    <option value={1.5}>1.5 pt (Sedang)</option>
                    <option value={2}>2.0 pt (Tebal Tegas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">Warna Border Outer</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={pageBorderColor}
                      onChange={(e) => setPageBorderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-white/60 dark:border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-800 dark:text-slate-200 font-mono font-bold">{pageBorderColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Alamat Perusahaan (Footer)</span>
            </label>
            <input
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Menara Aigen, Jl. HR Rasuna Said, Jakarta Selatan"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-semibold backdrop-blur-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Website Perusahaan (Footer)</span>
              </label>
              <input
                type="text"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="www.aigen.co.id"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-semibold backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Nomor Telepon (Footer)</span>
              </label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="+62 21 520 8890"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-semibold backdrop-blur-md"
              />
            </div>
          </div>

          {/* Color Parameterizer */}
          <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 space-y-3 shadow-sm backdrop-blur-2xl">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Kustomisasi Warna &amp; Separator</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">Warna Utama</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/60 dark:border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-800 dark:text-slate-200 font-mono font-bold">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">Warna Separator</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={separatorColor}
                    onChange={(e) => setSeparatorColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/60 dark:border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-800 dark:text-slate-200 font-mono font-bold">{separatorColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">Warna Akses</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/60 dark:border-white/20 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-800 dark:text-slate-200 font-mono font-bold">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/40 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/10 transition-all backdrop-blur-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 transition-all transform active:scale-95 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>{initialData ? 'Simpan Perubahan PT' : 'Simpan & Pakai PT Ini'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
