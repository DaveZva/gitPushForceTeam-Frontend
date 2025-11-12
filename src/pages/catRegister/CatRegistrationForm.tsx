import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { Resolver } from 'react-hook-form';

import {
    createRegistrationSchema,
    RegistrationFormData,
    CatFormData
} from '../../schemas/registrationSchema';
import { FormStepper } from '../../components/FormStepper';
import { Step1_Exhibition } from './steps/Step1_Exhibition';
import { Step2_CatInfo } from './steps/Step2_CatInfo';
import { Step3_BreederInfo } from './steps/Step3_BreederInfo';
import { Step4_ExhibitorInfo } from './steps/Step4_ExhibitorInfo';
import { Step5_NotesAndConsent } from './steps/Step5_NotesAndConsent';
import { Step6_Recap } from './steps/Step6_Recap';
import { storageUtils } from '../../utils/storage';
import { registrationApi, RegistrationPayload } from '../../services/api/registrationApi';
import '../../styles/CatRegistration.css';
import { Button } from '../../components/ui/Button';

export const defaultCatValues: CatFormData = {
    titleBefore: "",
    catName: "",
    titleAfter: "",
    chipNumber: "",
    gender: "male",
    neutered: "no",
    emsCode: "",
    birthDate: "",
    showClass: "",
    pedigreeNumber: "",
    cageType: "",
    motherTitleBefore: "",
    motherName: "",
    motherTitleAfter: "",
    motherBreed: "",
    motherEmsCode: "",
    motherColor: "",
    motherPedigreeNumber: "",
    fatherTitleBefore: "",
    fatherName: "",
    fatherTitleAfter: "",
    fatherBreed: "",
    fatherEmsCode: "",
    fatherColor: "",
    fatherPedigreeNumber: "",
};

const fieldsByStep: (keyof RegistrationFormData)[][] = [
    [],
    ['showId', 'days'],
    ['cats'],
    ['breederFirstName', 'breederLastName', 'breederAddress', 'breederZip', 'breederCity', 'breederEmail', 'breederPhone'],
    ['sameAsBreeder', 'exhibitorFirstName', 'exhibitorLastName', 'exhibitorAddress', 'exhibitorZip', 'exhibitorCity', 'exhibitorEmail', 'exhibitorPhone'],
    ['dataAccuracy', 'gdprConsent'],
    [],
];

interface SubmitSuccessProps {
    registrationNumber: string;
    onBackToStart: () => void;
}
const SubmitSuccess: React.FC<SubmitSuccessProps> = ({ registrationNumber, onBackToStart }) => {
    const { t } = useTranslation();
    return (
        <div className="text-center p-10 bg-white rounded-lg shadow-xl">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="text-2xl font-bold text-green-600 mt-4 mb-2">
                {t('alert.submitSuccess', { number: registrationNumber })}
            </h2>
            <p className="text-lg text-gray-700 mb-2">
                {t('submitSuccess.message', 'Vaše číslo přihlášky je:')}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-6">
                {registrationNumber}
            </p>
            <p className="text-gray-600 mb-8">
                {t('submitSuccess.info', 'Potvrzení a platební údaje byly odeslány na Váš email.')}
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="primary" onClick={onBackToStart}>
                    {t('submitSuccess.backButton', 'Nová přihláška')}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => alert('Funkce pro stažení PDF se připravuje!')}
                >
                    Stáhnout PDF (připravuje se)
                </Button>
            </div>
        </div>
    );
};


function CatRegistrationForm() {
    const { t, i18n } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitSuccessData, setSubmitSuccessData] = useState<{ number: string } | null>(null);

    const stepLabels = [
        'stepper.exhibition',
        'stepper.cat',
        'stepper.breeder',
        'stepper.exhibitor',
        'stepper.consent',
        'stepper.recap'
    ];
    const totalSteps = stepLabels.length;
    const registrationSchema = useMemo(() => createRegistrationSchema(t), [i18n.language, t]);

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema) as Resolver<RegistrationFormData>,
        defaultValues: (storageUtils.getCurrentForm() as RegistrationFormData | null) || {
            sameAsBreeder: false,
            cats: [defaultCatValues]
        },
        mode: 'onTouched',
    });

    const { handleSubmit, watch, reset, trigger } = methods;

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (!name && !type) {
                storageUtils.saveCurrentForm(value as RegistrationFormData);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const registrationData: RegistrationPayload = {
                show: { id: data.showId, days: data.days },
                cats: data.cats,
                breeder: {
                    firstName: data.breederFirstName,
                    lastName: data.breederLastName,
                    address: data.breederAddress,
                    zip: data.breederZip,
                    city: data.breederCity,
                    email: data.breederEmail,
                    phone: data.breederPhone
                },
                exhibitor: data.sameAsBreeder ? null : {
                    firstName: data.exhibitorFirstName,
                    lastName: data.exhibitorLastName,
                    address: data.exhibitorAddress,
                    zip: data.exhibitorZip,
                    city: data.exhibitorCity,
                    email: data.exhibitorEmail,
                    phone: data.exhibitorPhone
                },
                notes: data.notes,
                consents: {
                    dataAccuracy: data.dataAccuracy,
                    gdpr: data.gdprConsent
                }
            };

            console.log("--- DATA K ODESLÁNÍ (Payload) ---");
            console.log(registrationData);

            const response = await registrationApi.submitRegistration(registrationData);

            storageUtils.saveBreeder(registrationData.breeder);

            if (registrationData.exhibitor) {
                storageUtils.saveExhibitor(registrationData.exhibitor);
            }

            storageUtils.clearCurrentForm();

            setSubmitSuccessData({ number: String(response.registrationNumber) });

            reset({
                sameAsBreeder: false,
                cats: [defaultCatValues]
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: unknown) {
            alert(t('alert.submitError'));
            console.error(t('alert.submitError'), error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmAndSubmit = () => {
        if (window.confirm(t('confirm.submitForm', 'Opravdu si přejete finálně odeslat přihlášku? Zkontrolujte prosím všechny údaje.'))) {
            handleSubmit(onSubmit)();
        }
    };

    const handleNext = async () => {
        const fieldsToValidate = fieldsByStep[currentStep];
        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleReset = () => {
        if (window.confirm(t('confirm.resetForm'))) {
            reset({
                sameAsBreeder: false,
                cats: [defaultCatValues]
            });
            storageUtils.clearCurrentForm();
            setCurrentStep(1);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="min-h-screen bg-gray-50">
                <div className="container max-w-5xl mx-auto p-4 sm:p-8">

                    {submitSuccessData ? (
                        <SubmitSuccess
                            registrationNumber={submitSuccessData.number}
                            onBackToStart={() => {
                                setSubmitSuccessData(null);
                                setCurrentStep(1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    ) : (
                        <React.Fragment>
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {t('form.title')}
                                </h1>

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
                                <form>
                                    {currentStep === 1 && <Step1_Exhibition />}
                                    {currentStep === 2 && <Step2_CatInfo />}
                                    {currentStep === 3 && <Step3_BreederInfo />}
                                    {currentStep === 4 && <Step4_ExhibitorInfo />}
                                    {currentStep === 5 && <Step5_NotesAndConsent />}
                                    {currentStep === 6 && <Step6_Recap onEditStep={setCurrentStep} />}
                                </form>
                            </div>

                            <div className="flex justify-between mt-10">
                                <Button
                                    variant="secondary"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                                >
                                    ← {t('form.back')}
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button variant="primary" onClick={handleNext}>
                                        {currentStep === totalSteps - 1 ? t('form.toRecap') : t('form.continue')} →
                                    </Button>
                                ) : (
                                    <Button
                                        variant="submit"
                                        onClick={handleConfirmAndSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? t('form.submitting', 'Odesílám...') : t('form.submit')}
                                    </Button>
                                )}
                            </div>

                            <div className="mt-8 text-center text-gray-500">
                                💾 {t('form.autosaveInfo', 'Údaje se automaticky ukládají.')}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </FormProvider>
    );
}

export default CatRegistrationForm;