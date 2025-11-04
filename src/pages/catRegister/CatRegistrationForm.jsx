// Soubor: src/pages/catRegister/CatRegistrationForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { registrationSchema } from '../../schemas/registrationSchema';
import { FormStepper } from '../../components/FormStepper';
import { Step1_Exhibition } from './steps/Step1_Exhibition';
import { Step2_CatInfo } from './steps/Step2_CatInfo';
import { Step3_BreederInfo } from './steps/Step3_BreederInfo';
import { Step4_ExhibitorInfo } from './steps/Step4_ExhibitorInfo';
import { Step5_NotesAndConsent } from './steps/Step5_NotesAndConsent';
import { Step6_Recap } from './steps/Step6_Recap';
import { storageUtils } from '../../utils/storage';
import { registrationApi } from '../../services/api/registrationApi';
import '../../styles/CatRegistration.css';

// Import naší nové komponenty
import { Button } from '../../components/ui/Button';

// Výchozí hodnoty pro jednu kočku (VRÁCENA VŠECHNA POLE)
export const defaultCatValues = {
    // ... (zbytek zůstává stejný) ...
};

// Definice polí pro validaci v jednotlivých krocích
const fieldsByStep = [
    // ... (zůstává stejné) ...
];

function CatRegistrationForm() {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stepLabels = [
        // ... (zůstává stejné) ...
    ];
    const totalSteps = stepLabels.length;

    const methods = useForm({
        // ... (zůstává stejné) ...
    });

    const { handleSubmit, watch, reset, trigger } = methods;

    useEffect(() => {
        // ... (zůstává stejné) ...
    }, [watch]);

    const onSubmit = async (data) => {
        // ... (zůstává stejné) ...
    };

    const handleNext = async () => {
        // ... (zůstává stejné) ...
    };

    const handlePrevious = () => {
        // ... (zůstává stejné) ...
    };

    const handleReset = () => {
        // ... (zůstává stejné) ...
    };

    // !!!!!!!!!!
    // Definice stylů pro tlačítka jsou pryč.
    // Už je nepotřebujeme, jsou v komponentě Button.jsx
    // !!!!!!!!!!

    return (
        <FormProvider {...methods}>
            <div className="min-h-screen bg-gray-50">
                <div className="container max-w-5xl mx-auto p-4 sm:p-8">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t('form.title')}
                        </h1>

                        {/* ZDE je první náhrada */}
                        <Button variant="reset" onClick={handleReset}>
                            {t('form.resetAll')}
                        </Button>
                    </div>

                    <FormStepper
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        labels={stepLabels}
                    />

                    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl mt-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* ... (kroky zůstávají stejné) ... */}
                        </form>
                    </div>

                    <div className="flex justify-between mt-10">
                        {/* ZDE je druhá náhrada */}
                        <Button
                            variant="secondary"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                        >
                            ← {t('form.back')}
                        </Button>

                        {currentStep < totalSteps ? (
                            /* ZDE je třetí náhrada */
                            <Button variant="primary" onClick={handleNext}>
                                {currentStep === totalSteps - 1 ? t('form.toRecap') : t('form.continue')} →
                            </Button>
                        ) : (
                            /* ZDE je čtvrtá náhrada */
                            <Button
                                variant="submit"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('form.submitting') : t('form.submit')}
                            </Button>
                        )}
                    </div>

                    <div className="mt-8 text-center text-gray-500">
                        💾 {t('form.autosaveInfo')}
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}

export default CatRegistrationForm;