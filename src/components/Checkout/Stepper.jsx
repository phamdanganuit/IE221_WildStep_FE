import React from 'react';

export default function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const canClick = isCompleted || currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            <button
              onClick={() => canClick && onStepClick(step.number)}
              disabled={!canClick}
              className={`flex flex-col items-center ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-color4 text-white'
                    : isCompleted
                    ? 'bg-teal-100 text-color4'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : <Icon className="text-lg" />}
              </div>
              <span className={`mt-2 text-xs ${isActive ? 'font-semibold text-color4' : 'text-gray-600'}`}>
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 max-md:justify-start max-md:items-center-safe transition-all ${
                  currentStep > step.number ? 'bg-color4' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}