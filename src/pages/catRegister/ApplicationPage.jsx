import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePersistentForm } from './usePersistentForm';

// Import všech kroků
import { Step1_Show } from './Step1_Show';
import { Step2_Breeder } from './Step2_Breeder';
import { Step3_Owner } from './Step3_Owner';
import { Step4_Animal } from './Step4_Animal';
import { Step5_Final } from './Step5_Final';

// Import stylů
import styles from './Application.module.css';

const defaultFormData = { /* ... tvůj defaultFormData objekt ... */ };
const TOTAL_STEPS = 5;

// Přejmenoval jsem CatRegister na ApplicationPage
export function ApplicationPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = usePersistentForm('catApplicationForm', defaultFormData);

    const createStepDataUpdater = (stepKey) => {
        return (stepData) => {
            setFormData(prevData => ({
                ...prevData,
                [stepKey]: stepData
            }));
        };
    };

    const nextStep = () => {
        if (step < TOTAL_STEPS) setStep(s => s + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(s => s - 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulář odeslán:", formData);
        alert(t('form.alert.success'));
        window.localStorage.removeItem('catApplicationForm');
    };

    // Funkce pro vykreslení aktuálního kroku
    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return <Step1_Show data={formData.step1} setData={createStepDataUpdater('step1')} />;
            case 2:
                return <Step2_Breeder data={formData.step2} setData={createStepDataUpdater('step2')} />;
            case 3:
                return <Step3_Owner data={formData.step3} setData={createStepDataUpdater('step3')} breederData={formData.step2} />;
            case 4:
                return <Step4_Animal data={formData.step4} setData={createStepDataUpdater('step4')} />;
            case 5:
                return <Step5_Final data={formData.step5} setData={createStepDataUpdater('step5')} />;
            default:
                return <Step1_Show data={formData.step1} setData={createStepDataUpdater('step1')} />;
        }
    };

    return (
        // Použití CSS modulu
        <div className={styles.applicationFormContainer}>
            {renderCurrentStep()}

            <footer className={styles.navigationFooter}>
                <div className={styles.navWrapper}>
                    <button
                        type="button"
                        onClick={prevStep}
                        className={styles.prevButton}
                        style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
                    >
                        <span className={styles.arrow}>&lt;</span> {t('form.actions.back')}
                    </button>

                    <span className={styles.stepNumber}>{step}</span>

                    {step < TOTAL_STEPS && (
                        <button type="button" onClick={nextStep} className={styles.nextButton}>
                            {t('form.actions.saveAndContinue')}
                        </button>
                    )}

                    {step === TOTAL_STEPS && (
                        <button type="button" onClick={handleSubmit} className={styles.submitButton}>
                            {t('form.actions.submitApplication')}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}