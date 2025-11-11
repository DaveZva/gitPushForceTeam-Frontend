import React, { useState, ReactNode } from 'react';
import { useFormContext, FieldError, FieldErrors, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BREED_OPTIONS, validateEmsCode } from "../../../utils/emsRules";
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

type CatFieldName = Path<CatFormData>;
type FormPath = `cats.${number}.${CatFieldName}`;

interface FormFieldProps {
    label: string;
    name: FormPath;
    children: ReactNode;
    error?: FieldError;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, children, error }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
            {label}
        </label>
        {children}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
);

const FormGrid: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
    </div>
);

interface CatFormProps {
    catIndex: number;
    onRemove: (() => void) | null;
}

export function CatForm({ catIndex, onRemove }: CatFormProps) {
    const { t } = useTranslation();
    type ActiveTab = 'basic' | 'pedigree' | 'father';
    const [activeTab, setActiveTab] = useState<ActiveTab>('basic');

    const {
        register,
        formState: { errors },
        watch,
        setValue,
        setError,
        clearErrors
    } = useFormContext<RegistrationFormData>();

    const fieldName = (name: CatFieldName): FormPath => `cats.${catIndex}.${name}`;

    const getError = (name: CatFieldName): FieldError | undefined => {
        const fieldErrors = errors.cats?.[catIndex] as FieldErrors<CatFormData> | undefined;
        return fieldErrors?.[name];
    };

    const emsCodeValue = watch(fieldName("emsCode"));
    const emsPrefix = emsCodeValue?.substring(0, 3) || '';
    const emsSuffix = emsCodeValue?.substring(4) || '';

    const handleEmsChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const newPrefix = (name === "emsPrefix") ? value : emsPrefix;
        const newSuffix = (name === "emsSuffix") ? value : emsSuffix;

        const fullEmsCode = `${newPrefix} ${newSuffix}`.trimStart();
        const path = fieldName('emsCode');

        setValue(path, fullEmsCode, { shouldValidate: true, shouldDirty: true });
        const result = validateEmsCode(fullEmsCode);

        if (result === true) {
            clearErrors(path);
        } else {
            setError(path, { type: 'custom', message: result });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <FormGrid>
                        <FormField label={t('catForm.titleBefore')} name={fieldName("titleBefore")} error={getError("titleBefore")}>
                            <Select {...register(fieldName("titleBefore"))}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="champion">CH</option>
                                <option value="inter-champion">IC</option>
                                <option value="grand-inter-champion">GIC</option>
                                <option value="supreme-champion">SC</option>
                                <option value="national-winner">NV</option>
                                <option value="world-winner">WW</option>
                                <option value="junior-world-winner">JWW</option>
                            </Select>
                        </FormField>

                        <FormField label={t('catForm.catName')} name={fieldName("catName")} error={getError("catName")}>
                            <Input type="text" {...register(fieldName("catName"))} placeholder="Molly" />
                        </FormField>

                        <FormField label={t('catForm.titleAfter')} name={fieldName("titleAfter")} error={getError("titleAfter")}>
                            <Select {...register(fieldName("titleAfter"))}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="junior-winner">JW</option>
                                <option value="distinguished-show-merit">DSM</option>
                                <option value="distinguished-variety-merit">DVM</option>
                                <option value="distinguished-merit">DM</option>
                            </Select>
                        </FormField>

                        <FormField label={t('catForm.chipNumber')} name={fieldName("chipNumber")} error={getError("chipNumber")}>
                            <Input type="text" {...register(fieldName("chipNumber"))} placeholder="15 místné číslo" />
                        </FormField>

                        <FormField label={t('catForm.gender')} name={fieldName("gender")} error={getError("gender")}>
                            <Select {...register(fieldName("gender"))}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="male">{t('catForm.male')}</option>
                                <option value="female">{t('catForm.female')}</option>
                            </Select>
                        </FormField>

                        <FormField label={t('catForm.neutered')} name={fieldName("neutered")} error={getError("neutered")}>
                            <Select {...register(fieldName("neutered"))}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="yes">{t('common.yes')}</option>
                                <option value="no">{t('common.no')}</option>
                            </Select>
                        </FormField>

                        <input type="hidden" {...register(fieldName("emsCode"))} />

                        <FormField label={t('catForm.emsCode')} name={fieldName("emsCode")} error={getError("emsCode")}>
                            <div className="flex gap-2">
                                <Select
                                    name="emsPrefix"
                                    value={emsPrefix}
                                    onChange={handleEmsChange}
                                    className="w-1/3"
                                >
                                    <option value="">-- Plemeno --</option>
                                    {BREED_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    type="text"
                                    name="emsSuffix" // Ani toto se neregistruje
                                    value={emsSuffix}
                                    onChange={handleEmsChange}
                                    className="w-2/3"
                                    placeholder="n 03 24"
                                />
                            </div>
                        </FormField>

                        <FormField label={t('catForm.birthDate')} name={fieldName("birthDate")} error={getError("birthDate")}>
                            <Input type="date" {...register(fieldName("birthDate"))} />
                        </FormField>

                        <FormField label={t('catForm.showClass')} name={fieldName("showClass")} error={getError("showClass")}>
                            <Select {...register(fieldName("showClass"))}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="supreme_champion">{t('catForm.classOptions.c1')}</option>
                                <option value="supreme_premior">{t('catForm.classOptions.c2')}</option>
                                <option value="grant_inter_champion">{t('catForm.classOptions.c3')}</option>
                                <option value="grant_inter_premier">{t('catForm.classOptions.c4')}</option>
                                <option value="international_champion">{t('catForm.classOptions.c5')}</option>
                                <option value="international_premier">{t('catForm.classOptions.c6')}</option>
                                <option value="champion">{t('catForm.classOptions.c7')}</option>
                                <option value="premier">{t('catForm.classOptions.c8')}</option>
                                <option value="open">{t('catForm.classOptions.c9')}</option>
                                <option value="neuter">{t('catForm.classOptions.c10')}</option>
                                <option value="junior">{t('catForm.classOptions.c11')}</option>
                                <option value="kitten">{t('catForm.classOptions.c12')}</option>
                                <option value="novice_class">{t('catForm.classOptions.c13a')}</option>
                                <option value="control_class">{t('catForm.classOptions.c13b')}</option>
                                <option value="determination_class">{t('catForm.classOptions.c13c')}</option>
                                <option value="domestic_cat">{t('catForm.classOptions.c14')}</option>
                                <option value="out_of_competition">{t('catForm.classOptions.c15')}</option>
                                <option value="litter">{t('catForm.classOptions.c16')}</option>
                                <option value="veteran">{t('catForm.classOptions.c17')}</option>
                            </Select>
                        </FormField>

                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("pedigreeNumber")} error={getError("pedigreeNumber")}>
                            <Input type="text" {...register(fieldName("pedigreeNumber"))} placeholder="CSZ FO 1234/18" />
                        </FormField>

                        <FormField label={t('catForm.cageType')} name={fieldName("cageType")} error={getError("cageType")}>
                            <Select {...register(fieldName("cageType"))}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="own_cage">{t('catForm.cageOptions.own')}</option>
                                <option value="rent_small">{t('catForm.cageOptions.rentSmall')}</option>
                                <option value="rent_large">{t('catForm.cageOptions.rentLarge')}</option>
                            </Select>
                        </FormField>
                    </FormGrid>
                );
            case 'pedigree':
                return (
                    <FormGrid>
                        <FormField label={t('catForm.titleBefore')} name={fieldName("motherTitleBefore")} error={getError("motherTitleBefore")}>
                            <Input type="text" {...register(fieldName("motherTitleBefore"))} placeholder="CH" />
                        </FormField>
                        <FormField label={t('catForm.name')} name={fieldName("motherName")} error={getError("motherName")}>
                            <Input type="text" {...register(fieldName("motherName"))} placeholder={t('catForm.motherNamePlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.titleAfter')} name={fieldName("motherTitleAfter")} error={getError("motherTitleAfter")}>
                            <Input type="text" {...register(fieldName("motherTitleAfter"))} />
                        </FormField>
                        <FormField label={t('catForm.breed')} name={fieldName("motherBreed")} error={getError("motherBreed")}>
                            <Input type="text" {...register(fieldName("motherBreed"))} placeholder={t('catForm.breedPlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.emsCodeShort')} name={fieldName("motherEmsCode")} error={getError("motherEmsCode")}>
                            <Input type="text" {...register(fieldName("motherEmsCode"))} />
                        </FormField>
                        <FormField label={t('catForm.color')} name={fieldName("motherColor")} error={getError("motherColor")}>
                            <Input type="text" {...register(fieldName("motherColor"))} />
                        </FormField>
                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("motherPedigreeNumber")} error={getError("motherPedigreeNumber")}>
                            <Input type="text" {...register(fieldName("motherPedigreeNumber"))} />
                        </FormField>
                    </FormGrid>
                );
            case 'father': // Otec
                return (
                    <FormGrid>
                        <FormField label={t('catForm.titleBefore')} name={fieldName("fatherTitleBefore")} error={getError("fatherTitleBefore")}>
                            <Input type="text" {...register(fieldName("fatherTitleBefore"))} placeholder="GIC" />
                        </FormField>
                        <FormField label={t('catForm.name')} name={fieldName("fatherName")} error={getError("fatherName")}>
                            <Input type="text" {...register(fieldName("fatherName"))} placeholder={t('catForm.fatherNamePlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.titleAfter')} name={fieldName("fatherTitleAfter")} error={getError("fatherTitleAfter")}>
                            <Input type="text" {...register(fieldName("fatherTitleAfter"))} />
                        </FormField>
                        <FormField label={t('catForm.breed')} name={fieldName("fatherBreed")} error={getError("fatherBreed")}>
                            <Input type="text" {...register(fieldName("fatherBreed"))} placeholder={t('catForm.breedPlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.emsCodeShort')} name={fieldName("fatherEmsCode")} error={getError("fatherEmsCode")}>
                            <Input type="text" {...register(fieldName("fatherEmsCode"))} />
                        </FormField>
                        <FormField label={t('catForm.color')} name={fieldName("fatherColor")} error={getError("fatherColor")}>
                            <Input type="text" {...register(fieldName("fatherColor"))} />
                        </FormField>
                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("fatherPedigreeNumber")} error={getError("fatherPedigreeNumber")}>
                            <Input type="text" {...register(fieldName("fatherPedigreeNumber"))} />
                        </FormField>
                    </FormGrid>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex flex-col items-stretch gap-6 mb-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col flex-grow p-1 bg-gray-100 rounded-full md:flex-row">
                    <Button
                        variant={activeTab === 'basic' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('basic')}
                        style={{ width: "33.3%", margin: "0 5px 0 5px" }}
                        className="hover:bg-primary-500 hover:text-black"
                    >
                        {t('catForm.tabs.basic')}
                    </Button>
                    <Button
                        variant={activeTab === 'pedigree' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('pedigree')}
                        style={{ width: "33.3%", margin: "0 5px 0 5px" }}
                        className="hover:bg-primary-500 hover:text-black"
                    >
                        {t('catForm.tabs.mother')}
                    </Button>
                    <Button
                        variant={activeTab === 'father' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('father')}
                        style={{ width: "33.3%", margin: "0 5px 0 5px" }}
                        className="hover:bg-primary-500 hover:text-black"
                    >
                        {t('catForm.tabs.father')}
                    </Button>
                </div>

                {onRemove && (
                    <Button
                        variant="outlineDanger"
                        onClick={onRemove}
                    >
                        {t('catForm.removeCat')}
                    </Button>
                )}
            </div>

            <div className="pt-4">
                {renderTabContent()}
            </div>
        </div>
    );
}