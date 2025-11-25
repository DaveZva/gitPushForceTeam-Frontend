import React from 'react';
import { useTranslation } from 'react-i18next';

interface FormStepperProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
}

export const FormStepper: React.FC<FormStepperProps> = ({
                                                            currentStep,
                                                            totalSteps,
                                                            labels
                                                        }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full px-4 sm:px-8">
            <div
                className="grid items-start"
                style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
            >
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                    const isCompleted = step < currentStep;
                    const isCurrent = step === currentStep;

                    return (
                        <div key={step} className="relative flex flex-col items-center">

                            {/* Čára mezi kroky */}
                            {step < totalSteps && (
                                <div
                                    className={`absolute top-4 left-1/2 h-0.5 w-full transition-colors duration-300 
                                        ${
                                        isCompleted
                                            ? 'bg-[#027BFF]'
                                            : 'bg-gray-300'
                                    }
                                    `}
                                />
                            )}

                            {/* Kruh */}
                            <div
                                className={`
                                    relative z-10 flex h-8 w-8 items-center justify-center rounded-full 
                                    font-semibold transition-all duration-300 
                                    ${
                                    isCompleted || isCurrent
                                        ? 'bg-[#027BFF] text-white'
                                        : 'border-2 border-gray-300 bg-white text-gray-400'
                                }
                                `}
                            >
                                {step}
                            </div>

                            {/* Popisek */}
                            <div
                                className={`
                                    mt-2 text-center text-sm transition-colors duration-300 
                                    ${
                                    isCurrent
                                        ? 'font-bold text-[#027BFF]'
                                        : isCompleted
                                            ? 'font-medium text-gray-700'
                                            : 'text-gray-400'
                                }
                                `}
                            >
                                {t(labels[step - 1])}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};