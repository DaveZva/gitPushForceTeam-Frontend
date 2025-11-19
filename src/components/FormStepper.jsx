import React from 'react';

export function FormStepper({ currentStep, totalSteps, labels }) {
    return (
        <div className="form-stepper">
            <div className="stepper-container">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div key={step} className="stepper-item">
                        <div className={`stepper-circle ${step <= currentStep ? 'active' : ''}`}>
                            {step}
                        </div>
                        <div className={`stepper-label ${step === currentStep ? 'current' : ''}`}>
                            {labels[step - 1]}
                        </div>
                        {step < totalSteps && (
                            <div className={`stepper-line ${step < currentStep ? 'active' : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
