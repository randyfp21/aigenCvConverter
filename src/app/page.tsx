/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { UploadSection } from '@/components/upload/UploadSection';
import { TemplateSelector } from '@/components/template/TemplateSelector';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { EnhancementSection } from '@/components/enhancement/EnhancementSection';
import { ReviewModal, AiStatusInfo } from '@/components/review/ReviewModal';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { fetchTemplatesFromPgDatabase } from '@/lib/templates/templateManager';
import {
  CanonicalCV,
  CompanyTemplateConfig,
  FileMetadata,
  FinalValidationReport,
  TargetLanguage,
} from '@/types/cv';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Database } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(false);
  const [selectedTemplateConfig, setSelectedTemplateConfig] = useState<CompanyTemplateConfig>(
    COMPANY_TEMPLATES[0]
  );
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('en');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionProgressStep, setConversionProgressStep] = useState<string>('');

  const [extractedCv, setExtractedCv] = useState<CanonicalCV | null>(null);
  const [processedCv, setProcessedCv] = useState<CanonicalCV | null>(null);
  const [validationReport, setValidationReport] = useState<FinalValidationReport | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatusInfo | undefined>(undefined);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [outputDocxUrl, setOutputDocxUrl] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Sync selectedTemplateConfig with PostgreSQL database on client mount
  useEffect(() => {
    fetchTemplatesFromPgDatabase().then((history) => {
      if (history.length > 0) {
        const activeMatch = history.find((h) => h.id === selectedTemplateConfig.id);
        if (activeMatch) {
          setSelectedTemplateConfig(activeMatch);
        } else {
          setSelectedTemplateConfig(history[0]);
        }
      }
    });
  }, []);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFileMetadata(null);
      return;
    }
    setSelectedFile(file);
    setIsSampleMode(false);
    setFileMetadata({
      name: file.name,
      sizeBytes: file.size,
      mimeType: file.type,
      extension: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
    });
    if (currentStep === 1) setCurrentStep(2);
  };

  const handleUseSample = () => {
    setIsSampleMode(true);
    setSelectedFile(null);
    setFileMetadata({
      name: 'Randy_Farhan_CV.pdf',
      sizeBytes: 2450000,
      mimeType: 'application/pdf',
      extension: 'pdf',
    });
    if (currentStep === 1) setCurrentStep(2);
  };

  const handleValidateAndConvert = async () => {
    setIsConverting(true);
    setConversionError(null);
    setConversionProgressStep('Langkah 1/3: Mengunggah & membaca dokumen CV kandidat...');

    try {
      const formData = new FormData();
      if (isSampleMode) {
        formData.append('isSample', 'true');
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }

      formData.append('templateId', selectedTemplateConfig.id);
      formData.append('templateConfig', JSON.stringify(selectedTemplateConfig));
      formData.append('language', targetLanguage);
      if (customInstructions.trim()) {
        formData.append('customInstructions', customInstructions.trim());
      }

      setConversionProgressStep('Langkah 2/3: Gemini AI menganalisis kualifikasi & pengalaman proyek...');

      const res = await fetch('/api/cv/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'CV conversion failed.');
      }

      setConversionProgressStep('Langkah 3/3: Menyusun layout & memformat dokumen...');

      setExtractedCv(data.extractedCv);
      setProcessedCv(data.processedCv);
      setValidationReport(data.validationReport);
      setAiStatus(data.aiStatus);
      setOutputPdfUrl(data.outputs.pdfBase64);
      setOutputDocxUrl(data.outputs.docxBase64);

      // Open Review & Confirmation Modal first to let user confirm Gemini AI analysis
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('Conversion Error:', err);
      setConversionError(err instanceof Error ? err.message : 'Unknown error during conversion.');
    } finally {
      setIsConverting(false);
      setConversionProgressStep('');
    }
  };

  const handleConfirmExport = async (confirmedCv: CanonicalCV) => {
    setProcessedCv(confirmedCv);
    setIsReviewModalOpen(false);
    setCurrentStep(5);

    try {
      const res = await fetch('/api/cv/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'render',
          confirmedCv,
          templateConfig: selectedTemplateConfig,
          language: targetLanguage,
        }),
      });
      const data = await res.json();
      if (data.success && data.outputs) {
        setOutputPdfUrl(data.outputs.pdfBase64);
        setOutputDocxUrl(data.outputs.docxBase64);
      }
    } catch (err) {
      console.warn('Failed to re-render output documents on user confirmation:', err);
    }
  };

  const isValidateButtonEnabled = Boolean(selectedFile || isSampleMode);

  return (
    <ThemeProvider>
      <main className="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
        {/* iOS 27 Liquid Glass Background Blobs */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

        <Navbar />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Banner Auto Allow & PostgreSQL Active */}
          <div className="liquid-glass rounded-3xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold shadow-md">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-600 dark:text-emerald-300">
                  Mode iOS 27 Liquid Glass &amp; PostgreSQL Active
                </p>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                  Tampilan Liquid Glass, Light &amp; Dark mode aktif. PostgreSQL <strong>aigencv_db</strong> menyimpan seluruh data PT secara permanen.
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>System Online</span>
            </span>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-sky-300 text-xs font-extrabold backdrop-blur-xl shadow-md">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>iOS 27 Liquid Enterprise Qualification Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 dark:from-white dark:via-sky-200 dark:to-slate-300">
              Corporate Standardized CV Converter
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Unggah CV kandidat, pilih/edit PT (Logo top-right, warna separator, font &amp; border), dan hasilkan CV resmi.
            </p>
          </div>

          {/* STEP 1 to 4 Flow */}
          {currentStep <= 4 && (
            <div className="space-y-6 pb-32">
              <UploadSection
                selectedFile={selectedFile}
                fileMetadata={fileMetadata}
                onFileSelect={handleFileSelect}
                onUseSample={handleUseSample}
                isSampleMode={isSampleMode}
              />

              <TemplateSelector
                selectedTemplateId={selectedTemplateConfig.id}
                onSelectTemplate={(tmpl) => {
                  setSelectedTemplateConfig(tmpl);
                  if (currentStep === 2) setCurrentStep(3);
                }}
              />

              <LanguageSelector
                selectedLanguage={targetLanguage}
                onSelectLanguage={(lang) => setTargetLanguage(lang)}
              />

              {/* STEP 4 (OPSIONAL): AI Enhancement & Role Transformation */}
              <EnhancementSection
                customInstructions={customInstructions}
                onChangeCustomInstructions={setCustomInstructions}
              />

              {/* Validation & Convert Floating Action Banner (Always Floating at Bottom) */}
              <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 max-w-7xl mx-auto z-40 bg-white/70 dark:bg-slate-950/80 border border-white/80 dark:border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-3xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-sky-400 border border-blue-500/30 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">Validation Status:</span>
                      <span
                        className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                          isValidateButtonEnabled
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isValidateButtonEnabled ? 'Ready for Conversion' : 'Awaiting File'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                      Source: {fileMetadata ? fileMetadata.name : 'No file loaded'} • Target PT:{' '}
                      <strong className="text-slate-900 dark:text-white">{selectedTemplateConfig.company_name}</strong> ({selectedTemplateConfig.code})
                      {customInstructions.trim() && (
                        <span className="text-purple-600 dark:text-purple-300 font-bold ml-1.5">
                          [+ AI Enhancement Active]
                        </span>
                      )}
                    </p>
                    {isConverting && conversionProgressStep && (
                      <p className="text-[10px] font-black text-blue-600 dark:text-sky-400 animate-pulse mt-0.5">
                        {conversionProgressStep}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleValidateAndConvert}
                    disabled={!isValidateButtonEnabled || isConverting}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 glass-glow ${
                      isValidateButtonEnabled && !isConverting
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30 active:scale-95'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isConverting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analisis Gemini AI &amp; Process...</span>
                      </>
                    ) : (
                      <>
                        <span>Analisis &amp; Konfirmasi Data AI</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {conversionError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold">
                  Conversion Error: {conversionError}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: PREVIEW & DOWNLOAD */}
          {currentStep === 5 && processedCv && outputPdfUrl && outputDocxUrl && (
            <PreviewSection
              template={selectedTemplateConfig}
              language={targetLanguage}
              pdfBase64Url={outputPdfUrl}
              docxBase64Url={outputDocxUrl}
              candidateName={processedCv.personal_information.full_name || 'Candidate'}
              validationReport={validationReport || undefined}
              onConvertAgain={() => setCurrentStep(1)}
            />
          )}
        </div>

        {/* REVIEW & CONFIRMATION MODAL */}
        {extractedCv && processedCv && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            extractedCv={extractedCv}
            processedCv={processedCv}
            template={selectedTemplateConfig}
            language={targetLanguage}
            aiStatus={aiStatus}
            onClose={() => setIsReviewModalOpen(false)}
            onConfirmExport={handleConfirmExport}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
