import React, { useState, ReactNode } from 'react';
import { useFormContext, FieldError, FieldErrors, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BREED_OPTIONS, validateEmsCode, BREED_GROUP_RULES } from "../../../utils/emsRules";
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {children}
    </div>
);

interface CatFormProps {
    catIndex: number;
    onRemove: (() => void) | null;
}

export function CatForm({ catIndex, onRemove }: CatFormProps) {
    const { t } = useTranslation();
    type ActiveTab = 'basic' | 'mother' | 'father';
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

    const isSaved = watch(fieldName("isSaved")) === true;

    const emsCodeValue = watch(fieldName("emsCode")) || "";
    const motherEmsCodeValue = watch(fieldName("motherEmsCode")) || "";
    const fatherEmsCodeValue = watch(fieldName("fatherEmsCode")) || "";

    const parseEms = (val: string) => ({
        prefix: val.length >= 3 ? val.substring(0, 3) : "",
        suffix: val.length > 3 ? val.substring(4) : ""
    });

    // @ts-ignore
    const { prefix: emsPrefix, suffix: emsSuffix } = parseEms(emsCodeValue);
    // @ts-ignore
    const { prefix: motherEmsPrefix, suffix: motherEmsSuffix } = parseEms(motherEmsCodeValue);
    // @ts-ignore
    const { prefix: fatherEmsPrefix, suffix: fatherEmsSuffix } = parseEms(fatherEmsCodeValue);

    const maxGroupForBreed = BREED_GROUP_RULES[emsPrefix as keyof typeof BREED_GROUP_RULES];

    const handleGenericEmsChange = (
        fieldToUpdate: CatFieldName,
        currentPrefix: string,
        currentSuffix: string,
        changeType: 'prefix' | 'suffix',
        newValue: string
    ) => {
        const newPrefix = changeType === 'prefix' ? newValue : currentPrefix;
        const newSuffix = changeType === 'suffix' ? newValue : currentSuffix;
        const fullEmsCode = newPrefix ? `${newPrefix} ${newSuffix}` : "";

        const path = fieldName(fieldToUpdate);
        setValue(path, fullEmsCode, { shouldValidate: true, shouldDirty: true });

        const result = validateEmsCode(fullEmsCode);

        if (result === true) {
            clearErrors(path);
        } else {
            const errorMessage: string = typeof result === 'string' ? result : 'Neplatný kód';
            setError(path, { type: 'custom', message: errorMessage });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <FormGrid key="basic">
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
                            <Input
                                type="text"
                                {...register(fieldName("catName"))}
                                placeholder={t('catForm.placeholders.catName')}
                                disabled={isSaved}
                            />
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
                            <Input
                                type="text"
                                {...register(fieldName("chipNumber"))}
                                placeholder={t('catForm.placeholders.chipNumber')}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.gender')} name={fieldName("gender")} error={getError("gender")}>
                            <Select {...register(fieldName("gender"))} disabled={isSaved}>
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
                                    value={emsPrefix}
                                    onChange={(e) => handleGenericEmsChange("emsCode", emsPrefix, emsSuffix, 'prefix', e.target.value)}
                                    className="w-1/3"
                                >
                                    <option value="">-- {t('catForm.breed')} --</option>
                                    {BREED_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    type="text"
                                    value={emsSuffix}
                                    onChange={(e) => handleGenericEmsChange("emsCode", emsPrefix, emsSuffix, 'suffix', e.target.value)}
                                    className="w-2/3"
                                    placeholder={t('catForm.placeholders.ems')}
                                />
                            </div>
                        </FormField>

                        <FormField label={t('catForm.group')} name={fieldName("group")} error={getError("group")}>
                            <Select
                                {...register(fieldName("group"))}
                                disabled={!maxGroupForBreed}
                                className={!maxGroupForBreed ? "bg-gray-200 cursor-not-allowed" : ""}
                            >
                                <option value="">{t('common.select')}</option>
                                {[...Array(11)].map((_, i) => {
                                    const val = i + 1;
                                    return (
                                        <option key={val} value={val}>
                                            {t('catForm.groupOption', { number: val })}
                                        </option>
                                    );
                                })}
                            </Select>
                            {!maxGroupForBreed && emsPrefix && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                    {t('catForm.groupNotRequired')}
                                </span>
                            )}
                        </FormField>

                        <FormField label={t('catForm.birthDate')} name={fieldName("birthDate")} error={getError("birthDate")}>
                            <Input
                                type="date"
                                {...register(fieldName("birthDate"))}
                                disabled={isSaved}
                            />
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
                            <Input
                                type="text"
                                {...register(fieldName("pedigreeNumber"))}
                                placeholder={t('catForm.placeholders.pedigreeNumber')}
                                disabled={isSaved}
                            />
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

            case 'mother':
                return (
                    <FormGrid key="mother">
                        <FormField label={t('catForm.titleBefore')} name={fieldName("motherTitleBefore")} error={getError("motherTitleBefore")}>
                            <Select {...register(fieldName("motherTitleBefore"))}>
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

                        <FormField label={t('catForm.catName')} name={fieldName("motherName")} error={getError("motherName")}>
                            <Input
                                type="text"
                                {...register(fieldName("motherName"))}
                                placeholder={t('catForm.placeholders.mother')}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.titleAfter')} name={fieldName("motherTitleAfter")} error={getError("motherTitleAfter")}>
                            <Select {...register(fieldName("motherTitleAfter"))}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="junior-winner">JW</option>
                                <option value="distinguished-show-merit">DSM</option>
                                <option value="distinguished-variety-merit">DVM</option>
                                <option value="distinguished-merit">DM</option>
                            </Select>
                        </FormField>

                        <input type="hidden" {...register(fieldName("motherEmsCode"))} />
                        <FormField label={t('catForm.emsCode')} name={fieldName("motherEmsCode")} error={getError("motherEmsCode")}>
                            <div className="flex gap-2">
                                <Select
                                    value={motherEmsPrefix}
                                    onChange={(e) => handleGenericEmsChange("motherEmsCode", motherEmsPrefix, motherEmsSuffix, 'prefix', e.target.value)}
                                    className="w-1/3"
                                    disabled={isSaved}
                                >
                                    <option value="">-- {t('catForm.breed')} --</option>
                                    {BREED_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    type="text"
                                    value={motherEmsSuffix}
                                    onChange={(e) => handleGenericEmsChange("motherEmsCode", motherEmsPrefix, motherEmsSuffix, 'suffix', e.target.value)}
                                    className="w-2/3"
                                    placeholder={t('catForm.placeholders.ems')}
                                    disabled={isSaved}
                                />
                            </div>
                        </FormField>

                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("motherPedigreeNumber")} error={getError("motherPedigreeNumber")}>
                            <Input
                                type="text"
                                {...register(fieldName("motherPedigreeNumber"))}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.chipNumber')} name={fieldName("motherChipNumber")} error={getError("motherChipNumber")}>
                            <Input
                                type="text"
                                {...register(fieldName("motherChipNumber"))}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.birthDate')} name={fieldName("motherBirthDate")} error={getError("motherBirthDate")}>
                            <Input
                                type="date"
                                {...register(fieldName("motherBirthDate"))}
                                disabled={isSaved}
                            />
                        </FormField>
                    </FormGrid>
                );

            case 'father':
                return (
                    <FormGrid key="father">
                        <FormField label={t('catForm.titleBefore')} name={fieldName("fatherTitleBefore")} error={getError("fatherTitleBefore")}>
                            <Select {...register(fieldName("fatherTitleBefore"))}>
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

                        <FormField label={t('catForm.catName')} name={fieldName("fatherName")} error={getError("fatherName")}>
                            <Input
                                type="text"
                                {...register(fieldName("fatherName"))}
                                placeholder={t('catForm.placeholders.father')}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.titleAfter')} name={fieldName("fatherTitleAfter")} error={getError("fatherTitleAfter")}>
                            <Select {...register(fieldName("fatherTitleAfter"))}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="junior-winner">JW</option>
                                <option value="distinguished-show-merit">DSM</option>
                                <option value="distinguished-variety-merit">DVM</option>
                                <option value="distinguished-merit">DM</option>
                            </Select>
                        </FormField>

                        <input type="hidden" {...register(fieldName("fatherEmsCode"))} />
                        <FormField label={t('catForm.emsCodeShort')} name={fieldName("fatherEmsCode")} error={getError("fatherEmsCode")}>
                            <div className="flex gap-2">
                                <Select
                                    value={fatherEmsPrefix}
                                    onChange={(e) => handleGenericEmsChange("fatherEmsCode", fatherEmsPrefix, fatherEmsSuffix, 'prefix', e.target.value)}
                                    className="w-1/3"
                                    disabled={isSaved}
                                >
                                    <option value="">-- {t('catForm.breed')} --</option>
                                    {BREED_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    type="text"
                                    value={fatherEmsSuffix}
                                    onChange={(e) => handleGenericEmsChange("fatherEmsCode", fatherEmsPrefix, fatherEmsSuffix, 'suffix', e.target.value)}
                                    className="w-2/3"
                                    placeholder={t('catForm.placeholders.ems')}
                                    disabled={isSaved}
                                />
                            </div>
                        </FormField>

                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("fatherPedigreeNumber")} error={getError("fatherPedigreeNumber")}>
                            <Input
                                type="text"
                                {...register(fieldName("fatherPedigreeNumber"))}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.chipNumber')} name={fieldName("fatherChipNumber")} error={getError("fatherChipNumber")}>
                            <Input
                                type="text"
                                {...register(fieldName("fatherChipNumber"))}
                                disabled={isSaved}
                            />
                        </FormField>

                        <FormField label={t('catForm.birthDate')} name={fieldName("fatherBirthDate")} error={getError("fatherBirthDate")}>
                            <Input
                                type="date"
                                {...register(fieldName("fatherBirthDate"))}
                                disabled={isSaved}
                            />
                        </FormField>
                    </FormGrid>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex flex-col items-stretch gap-6 mb-8 md:flex-row md:items-center md:justify-between">

                <div className="flex flex-col flex-grow p-1 rounded-full md:flex-row gap-2 sm:gap-3 md:gap-4">

                    <Button
                        variant={activeTab === 'basic' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('basic')}
                        className="flex-1 min-w-[60px] text-sm sm:text-base hover:bg-primary-500 hover:text-blue"
                    >
                        {t('catForm.tabs.basic')}
                    </Button>

                    <Button
                        variant={activeTab === 'mother' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('mother')}
                        className="flex-1 min-w-[60px] text-sm sm:text-base hover:bg-primary-500 hover:text-blue"
                    >
                        {t('catForm.tabs.mother')}
                    </Button>

                    <Button
                        variant={activeTab === 'father' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('father')}
                        className="flex-1 min-w-[60px] text-sm sm:text-base hover:bg-primary-500 hover:text-blue"
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