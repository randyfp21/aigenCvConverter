'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Stepper } from '@/components/ui/Stepper';
import { UploadSection } from '@/components/upload/UploadSection';
import { TemplateSelector } from '@/components/template/TemplateSelector';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { ReviewModal } from '@/components/review/ReviewModal';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { ProgressAuditModal } from '@/components/validation/ProgressAuditModal';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';
import { SAMPLE_RANDY_FARHAN_CV } from '@/data/sampleCv';
import {
  CanonicalCV,
  CompanyTemplateConfig,
  FileMetadata,
  TargetLanguage,
  FinalValidationReport,
} from '@/types/cv';
import { ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function HomePage() {
  // Step 1 State: Source CV Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(false);

  // Step 2 & 3 State: Target Template & Output Language
  const [selectedTemplateConfig, setSelectedTemplateConfig] = useState<CompanyTemplateConfig>(COMPANY_TEMPLATES[0]);
  const [targetTemplateFile, setTargetTemplateFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('en');

  // Step Control & Progress
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionStage, setConversionStage] = useState<number>(0);

  // Parsed & Rendered Data
  const [extractedCv, setExtractedCv] = useState<CanonicalCV | null>(null);
  const [processedCv, setProcessedCv] = useState<CanonicalCV | null>(null);
  const [validationReport, setValidationReport] = useState<FinalValidationReport | null>(null);

  const [pdfBase64Url, setPdfBase64Url] = useState<string>('');
  const [docxBase64Url, setDocxBase64Url] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidateButtonEnabled =
    (selectedFile !== null || isSampleMode) &&
    Boolean(selectedTemplateConfig) &&
    Boolean(targetLanguage);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setIsSampleMode(false);
      const ext = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx';
      setFileMetadata({
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        extension: ext || 'pdf',
      });
      setCurrentStep(2);
    } else {
      setFileMetadata(null);
      setExtractedCv(null);
    }
  };

  const handleUseSample = () => {
    setSelectedFile(null);
    setIsSampleMode(true);
    setFileMetadata({
      name: 'Randy_Farhan_CV.pdf',
      sizeBytes: 2450000,
      mimeType: 'application/pdf',
      extension: 'pdf',
    });
    setExtractedCv(SAMPLE_RANDY_FARHAN_CV);
    setCurrentStep(2);
  };

  const handleValidateAndConvert = async () => {
    setErrorMessage(null);
    setIsConverting(true);
    setConversionStage(1);

    try {
      const formData = new FormData();
      if (isSampleMode) {
        formData.append('isSample', 'true');
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (targetTemplateFile) {
        formData.append('templateFile', targetTemplateFile);
      }

      formData.append('templateId', selectedTemplateConfig.id);
      formData.append('language', targetLanguage);

      setConversionStage(2);
      await new Promise((r) => setTimeout(r, 300));
      setConversionStage(3);
      await new Promise((r) => setTimeout(r, 300));

      const res = await fetch('/api/cv/convert', {
        method: 'POST',
        body: formData,
      });

      setConversionStage(5);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'CV Conversion failed during backend validation.');
      }

      setConversionStage(6);
      await new Promise((r) => setTimeout(r, 300));
      setConversionStage(7);

      setExtractedCv(data.extractedCv);
      setProcessedCv(data.processedCv);
      setValidationReport(data.validationReport);
      setPdfBase64Url(data.outputs.pdfBase64);
      setDocxBase64Url(data.outputs.docxBase64);

      setCurrentStep(4); // Open Review Step
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsConverting(false);
    }
  };

  const handleConfirmReview = () => {
    setCurrentStep(5); // Preview Step
  };

  const handleConvertAgain = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setFileMetadata(null);
    setIsSampleMode(false);
    setTargetTemplateFile(null);
    setExtractedCv(null);
    setProcessedCv(null);
    setPdfBase64Url('');
    setDocxBase64Url('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Stepper currentStep={currentStep} />

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-3 shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Conversion Blocked</p>
              <p className="text-xs text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

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
                      {isValidateButtonEnabled ? 'Ready for Conversion' : 'Requirements Incomplete'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Source CV: {isSampleMode ? 'Randy_Farhan_CV.pdf' : selectedFile ? selectedFile.name : 'Upload File First'} • Target Template:{' '}
                    {selectedTemplateConfig.company_name} • Lang: {targetLanguage.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!isValidateButtonEnabled || isConverting}
                onClick={handleValidateAndConvert}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>Validate & Convert CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Extracted CV Data */}
        {currentStep === 4 && extractedCv && (
          <ReviewModal
            cv={extractedCv}
            template={selectedTemplateConfig}
            language={targetLanguage}
            onConfirm={handleConfirmReview}
            onBack={() => setCurrentStep(2)}
            isConverting={isConverting}
          />
        )}

        {/* STEP 5: Final Preview & Download */}
        {currentStep === 5 && (
          <PreviewSection
            template={selectedTemplateConfig}
            language={targetLanguage}
            pdfBase64Url={pdfBase64Url}
            docxBase64Url={docxBase64Url}
            candidateName={extractedCv?.personal_information.full_name || 'Candidate'}
            validationReport={validationReport || undefined}
            onConvertAgain={handleConvertAgain}
          />
        )}
      </main>

      {isConverting && <ProgressAuditModal currentStageIndex={conversionStage} />}
    </div>
  );
}
