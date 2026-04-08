import React from "react";
import { Check } from "lucide-react";

export default function StepNavbar({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) {
  return (
    <div className="w-full mt-6">
      <nav aria-label="Loan application steps">
        <ol className="flex items-center justify-center gap-4 sm:gap-6">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const pillBase =
              "w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold shadow-sm";
            const pillClass = isCompleted
              ? `${pillBase} bg-emerald-600 text-white border border-emerald-700`
              : isActive
                ? `${pillBase} bg-blue-600 text-white border border-blue-700`
                : `${pillBase} bg-white text-slate-700 border border-slate-200`;

            return (
              <li key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                  aria-current={isActive ? "step" : undefined}
                  title={step.label}
                >
                  <span className={pillClass} aria-hidden>
                    {isCompleted ? (
                      <Check size={14} />
                    ) : (
                      <span className="text-[12px]">{idx + 1}</span>
                    )}
                  </span>

                  <span
                    className={`text-xs ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"}`}
                  >
                    {step.shortLabel || step.label}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <span
                    className="hidden sm:inline-block w-10 h-px bg-slate-200 mx-3"
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-4">
        <div className="h-px w-full bg-linear-to-r from-transparent via-blue-900 to-transparent" />
      </div>
    </div>
  );
}
