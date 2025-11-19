import React, { useState, useEffect } from 'react';
import { FormStepper } from '../../components/FormStepper';
import { Step1_Exhibition } from './steps/Step1_Exhibition';
import { Step2_CatInfo } from './steps/Step2_CatInfo';
import { Step3_BreederInfo } from './steps/Step3_BreederInfo';
import { Step4_ExhibitorInfo } from './steps/Step4_ExhibitorInfo';
import { Step5_NotesAndConsent } from './steps/Step5_NotesAndConsent';
import { storageUtils } from '../../utils/storage';
import { registrationApi } from '../../services/api/registrationApi';
import '../../styles/CatRegistration.css';

function CatRegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stepLabels = ['Výstava', 'Kočka', 'Chovatel', 'Vystavovatel', 'Souhlas'];

    // Načtení rozdělaného formuláře z localStorage
    useEffect(() => {
        const savedForm = storageUtils.getCurrentForm();
        if (savedForm) {
            setFormData(savedForm);
        }
    }, []);

    // Automatické ukládání formuláře při každé změně
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            storageUtils.saveCurrentForm(formData);
        }
    }, [formData]);

    // Obecná funkce pro změnu hodnot
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Načíst uloženou kočku
    const handleLoadCat = (cat) => {
        setFormData(prev => ({
            ...prev,
            catName: cat.catName,
            cattery: cat.cattery,
            gender: cat.gender,
            birthDate: cat.birthDate,
            pedigreeNumber: cat.pedigreeNumber,
            motherName: cat.motherName,
            fatherName: cat.fatherName
        }));
    };

    // Načíst uloženého chovatele
    const handleLoadBreeder = (breeder) => {
        setFormData(prev => ({
            ...prev,
            breederFirstName: breeder.firstName,
            breederLastName: breeder.lastName,
            breederAddress: breeder.address,
            breederZip: breeder.zip,
            breederCity: breeder.city,
            breederEmail: breeder.email,
            breederPhone: breeder.phone
        }));
    };

    // Načíst uloženého vystavovatele
    const handleLoadExhibitor = (exhibitor) => {
        setFormData(prev => ({
            ...prev,
            exhibitorFirstName: exhibitor.firstName,
            exhibitorLastName: exhibitor.lastName,
            exhibitorAddress: exhibitor.address,
            exhibitorZip: exhibitor.zip,
            exhibitorCity: exhibitor.city,
            exhibitorEmail: exhibitor.email,
            exhibitorPhone: exhibitor.phone,
            sameAsBreeder: false
        }));
    };

    // Zkopírovat údaje chovatele do vystavovatele
    const handleCopyBreeder = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setFormData(prev => ({
                ...prev,
                sameAsBreeder: true,
                exhibitorFirstName: prev.breederFirstName,
                exhibitorLastName: prev.breederLastName,
                exhibitorAddress: prev.breederAddress,
                exhibitorZip: prev.breederZip,
                exhibitorCity: prev.breederCity,
                exhibitorEmail: prev.breederEmail,
                exhibitorPhone: prev.breederPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                sameAsBreeder: false
            }));
        }
    };

    // Validace jednotlivých kroků
    const validateStep = () => {
        switch(currentStep) {
            case 1:
                if (!formData.showId || !formData.days) {
                    alert('Prosím vyplňte všechna povinná pole');
                    return false;
                }
                break;
            case 2:
                if (!formData.catName || !formData.gender || !formData.birthDate) {
                    alert('Prosím vyplňte všechna povinná pole u kočky');
                    return false;
                }
                break;
            case 3:
                if (!formData.breederFirstName || !formData.breederLastName || !formData.breederAddress ||
                    !formData.breederZip || !formData.breederCity || !formData.breederEmail || !formData.breederPhone) {
                    alert('Prosím vyplňte všechna povinná pole chovatele');
                    return false;
                }
                break;
            case 4:
                if (!formData.sameAsBreeder && (!formData.exhibitorFirstName || !formData.exhibitorLastName ||
                    !formData.exhibitorAddress || !formData.exhibitorZip || !formData.exhibitorCity ||
                    !formData.exhibitorEmail || !formData.exhibitorPhone)) {
                    alert('Prosím vyplňte všechna povinná pole vystavovatele');
                    return false;
                }
                break;
            case 5:
                if (!formData.dataAccuracy || !formData.gdprConsent) {
                    alert('Musíte souhlasit s podmínkami');
                    return false;
                }
                break;
        }
        return true;
    };

    // Přechod na další krok
    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    // Přechod na předchozí krok
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Odeslání formuláře
    const handleSubmit = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);

        try {
            // Příprava dat pro backend
            const registrationData = {
                show: {
                    id: formData.showId,
                    days: formData.days
                },
                cat: {
                    name: formData.catName,
                    cattery: formData.cattery,
                    breed: formData.breed,
                    gender: formData.gender,
                    birthDate: formData.birthDate,
                    color: formData.color,
                    pedigreeNumber: formData.pedigreeNumber,
                    mother: formData.motherName,
                    father: formData.fatherName
                },
                breeder: {
                    firstName: formData.breederFirstName,
                    lastName: formData.breederLastName,
                    address: formData.breederAddress,
                    zip: formData.breederZip,
                    city: formData.breederCity,
                    email: formData.breederEmail,
                    phone: formData.breederPhone
                },
                exhibitor: formData.sameAsBreeder ? null : {
                    firstName: formData.exhibitorFirstName,
                    lastName: formData.exhibitorLastName,
                    address: formData.exhibitorAddress,
                    zip: formData.exhibitorZip,
                    city: formData.exhibitorCity,
                    email: formData.exhibitorEmail,
                    phone: formData.exhibitorPhone
                },
                notes: formData.notes,
                consents: {
                    dataAccuracy: formData.dataAccuracy,
                    gdpr: formData.gdprConsent
                }
            };

            // Odeslání na backend
            const response = await registrationApi.submitRegistration(registrationData);

            // Uložení dat do localStorage pro příští použití
            storageUtils.saveCat(registrationData.cat);
            storageUtils.saveBreeder(registrationData.breeder);
            if (registrationData.exhibitor) {
                storageUtils.saveExhibitor(registrationData.exhibitor);
            }

            // Smazání aktuálního formuláře
            storageUtils.clearCurrentForm();

            alert(`Přihláška byla úspěšně odeslána! Číslo přihlášky: ${response.registrationNumber}`);

            // Reset formuláře
            setFormData({});
            setCurrentStep(1);

        } catch (error) {
            alert('Chyba při odesílání přihlášky. Zkuste to prosím později.');
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Smazání celého formuláře
    const handleReset = () => {
        if (window.confirm('Opravdu chcete smazat všechny vyplněné údaje?')) {
            setFormData({});
            storageUtils.clearCurrentForm();
            setCurrentStep(1);
        }
    };

    return (
        <div className="cat-registration-page">
            <div className="container">
                <div className="page-header">
                    <h1>Registrace kočky na výstavu</h1>
                    <button className="btn-reset" onClick={handleReset}>
                        Smazat vše
                    </button>
                </div>

                <FormStepper
                    currentStep={currentStep}
                    totalSteps={5}
                    labels={stepLabels}
                />

                <div className="registration-form-wrapper">
                    {currentStep === 1 && (
                        <Step1_Exhibition data={formData} onChange={handleChange} />
                    )}
                    {currentStep === 2 && (
                        <Step2_CatInfo
                            data={formData}
                            onChange={handleChange}
                            onLoadCat={handleLoadCat}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3_BreederInfo
                            data={formData}
                            onChange={handleChange}
                            onLoadBreeder={handleLoadBreeder}
                        />
                    )}
                    {currentStep === 4 && (
                        <Step4_ExhibitorInfo
                            data={formData}
                            onChange={handleChange}
                            onLoadExhibitor={handleLoadExhibitor}
                            onCopyBreeder={handleCopyBreeder}
                        />
                    )}
                    {currentStep === 5 && (
                        <Step5_NotesAndConsent data={formData} onChange={handleChange} />
                    )}
                </div>

                <div className="form-navigation">
                    <button
                        className="btn-secondary"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        ← Zpět
                    </button>

                    {currentStep < 5 ? (
                        <button className="btn-primary" onClick={handleNext}>
                            Pokračovat →
                        </button>
                    ) : (
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Odesílám...' : '✓ Odeslat přihlášku'}
                        </button>
                    )}
                </div>

                <div className="info-message">
                    💾 Vaše data jsou automaticky ukládána v prohlížeči. Můžete formulář kdykoli opustit a vrátit se k němu později.
                </div>
            </div>
        </div>
    );
}
export default CatRegistrationForm;
