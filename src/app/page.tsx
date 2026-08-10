/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UploadSection } from '@/components/upload/UploadSection';
import { TemplateSelector } from '@/components/template/TemplateSelector';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { ReviewModal } from '@/components/review/ReviewModal';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import {
  CanonicalCV,
  CompanyTemplateConfig,
  FileMetadata,
  FinalValidationReport,
  TargetLanguage,
} from '@/types/cv';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(false);
  const [selectedTemplateConfig, setSelectedTemplateConfig] = useState<CompanyTemplateConfig>(
    COMPANY_TEMPLATES[0]
  );
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('en');

  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const [extractedCv, setExtractedCv] = useState<CanonicalCV | null>(null);
  const [processedCv, setProcessedCv] = useState<CanonicalCV | null>(null);
  const [validationReport, setValidationReport] = useState<FinalValidationReport | null>(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [outputDocxUrl, setOutputDocxUrl] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

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

    try {
      const formData = new FormData();
      if (isSampleMode) {
        formData.append('isSample', 'true');
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }

      formData.append('templateId', selectedTemplateConfig.id);
      formData.append('language', targetLanguage);

      const res = await fetch('/api/cv/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'CV conversion failed.');
      }

      setExtractedCv(data.extractedCv);
      setProcessedCv(data.processedCv);
      setValidationReport(data.validationReport);
      setOutputPdfUrl(data.outputs.pdfBase64);
      setOutputDocxUrl(data.outputs.docxBase64);

      // Open Review & Confirmation Modal first to let user confirm Gemini AI analysis
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('Conversion Error:', err);
      setConversionError(err instanceof Error ? err.message : 'Unknown error during conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleConfirmExport = (confirmedCv: CanonicalCV) => {
    setProcessedCv(confirmedCv);
    setIsReviewModalOpen(false);
    setCurrentStep(4);
  };

  const isValidateButtonEnabled = Boolean(selectedFile || isSampleMode);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Auto Allow Directive */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              AI
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">
                Mode Gemini AI & Privacy Safeguard Aktif
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Konfirmasi hasil analisis AI aktif. Informasi kontak pribadi (email & phone) disembunyikan untuk CV Perusahaan.
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Corporate CV Qualification Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Corporate Standardized CV Converter
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Unggah CV kandidat, atur parameter PT (Logo top-right, warna separator, alamat, website, & telp di footer), dan konfirmasi hasil analisis sebelum mencetak.
          </p>
        </div>

        {/* STEP 1 to 3 Flow */}
        {currentStep <= 3 && (
          <div className="space-y-6">
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

            {/* Validation & Convert Action Banner */}
            <div className="sticky bottom-6 z-40 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Validation Status:</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isValidateButtonEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isValidateButtonEnabled ? 'Ready for Conversion' : 'Awaiting File'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Source: {fileMetadata ? fileMetadata.name : 'No file loaded'} • Target PT:{' '}
                    {selectedTemplateConfig.company_name} ({selectedTemplateConfig.code})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleValidateAndConvert}
                  disabled={!isValidateButtonEnabled || isConverting}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-xl flex items-center justify-center space-x-2 ${
                    isValidateButtonEnabled && !isConverting
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/25 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {isConverting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analisis Gemini AI & Process...</span>
                    </>
                  ) : (
                    <>
                      <span>Analisis & Konfirmasi Data AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {conversionError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                Conversion Error: {conversionError}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PREVIEW & DOWNLOAD */}
        {currentStep === 4 && processedCv && outputPdfUrl && outputDocxUrl && (
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
          onClose={() => setIsReviewModalOpen(false)}
          onConfirmExport={handleConfirmExport}
        />
      )}
    </main>
  );
}
