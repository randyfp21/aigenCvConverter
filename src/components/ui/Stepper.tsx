import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: 'Original CV', description: 'PDF or DOCX' },
  { id: 2, label: 'Target Template', description: 'Select Company' },
  { id: 3, label: 'Output Language', description: 'EN or ID' },
  { id: 4, label: 'Validation & Review', description: 'Preservation Check' },
  { id: 5, label: 'Preview & Download', description: 'PDF & DOCX' },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6 px-4 mb-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center group relative cursor-default">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.id}
                </div>
                <div className="mt-2.5 text-center">
                  <p
                    className={`text-xs font-semibold tracking-tight transition-colors ${
                      isCurrent
                        ? 'text-blue-400'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500 hidden md:block">{step.description}</p>
                </div>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mb-6 transition-all duration-500 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
