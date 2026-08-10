import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ProgressAuditModalProps {
  currentStageIndex: number;
}

const STAGES = [
  'Reading original CV file structure',
  'Extracting raw document text & layout blocks',
  'Detecting canonical CV section boundaries',
  'Structuring factual CV data model',
  'Translating descriptions with protected entity guard',
  'Mapping canonical fields to company template schema',
  'Rendering vector PDF & programmatic DOCX documents',
  'Performing pre-download data loss audit validation',
];

export const ProgressAuditModal: React.FC<ProgressAuditModalProps> = ({ currentStageIndex }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Converting & Generating CV</h3>
            <p className="text-xs text-slate-400">Processing document pipeline...</p>
          </div>
        </div>

        <div className="space-y-3">
          {STAGES.map((stageName, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={idx} className="flex items-center space-x-3 text-xs">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                )}

                <span
                  className={
                    isDone
                      ? 'text-emerald-400 font-medium'
                      : isCurrent
                      ? 'text-white font-bold'
                      : 'text-slate-500'
                  }
                >
                  {stageName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
