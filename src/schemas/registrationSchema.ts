import { z } from 'zod';
import { validateEmsCode, validateGroupForBreed } from '../utils/emsRules';
import { TFunction } from 'i18next';

const createPersonSchema = (t: TFunction) => ({
    FirstName: z.string().min(2, t('validation.person.firstName.min')),
    LastName: z.string().min(2, t('validation.person.lastName.min')),
    Address: z.string().min(5, t('validation.person.address.min')),
    Zip: z.string().regex(/^\d{3} ?\d{2}$/, t('validation.person.zip.invalid')),
    City: z.string().min(2, t('validation.person.city.min')),
    Email: z.string().email(t('validation.person.email.invalid')),
    Phone: z.string().regex(/^((\+420 ?)|(00420 ?))?\d{3} ?\d{3} ?\d{3}$/, t('validation.person.phone.invalid')),
    LocalOrganization: z.string().min(2, t('validation.person.localOrganization.min')).max(100, t('validation.person.localOrganization.max')),
    MembershipNumber: z.string()
        .min(4, t('validation.person.membershipNumber.min'))
        .max(15, t('validation.person.membershipNumber.max'))
});

const validateCommonDate = (dateString: string | undefined, t: TFunction): string | true => {
    if (!dateString || dateString.trim() === '') return true;
    const date = new Date(dateString);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) return true;

    if (date.getFullYear() < 2010) {
        return t('validation.cat.age.tooOld') || 'Rok narození nesmí být starší než 2010.';
    }

    if (date > today) {
        return t('validation.cat.age.future') || 'Datum narození nesmí být v budoucnu.';
    }

    return true;
};

const validateCatAge= (dateString: string, t: TFunction): string | true => {
    const commonValidation = validateCommonDate(dateString, t);
    if (commonValidation !== true) return commonValidation;

    const birthDate = new Date(dateString);
    const today = new Date();
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const minAgeDate = new Date(today);
    minAgeDate.setMonth(today.getMonth() - 4);

    if (birthDate > minAgeDate) {
        return t('validation.cat.age.min') || 'Kočka musí být starší 4 měsíců';
    }

    return true;
};

const createCatSchema = (t: TFunction) => z.object({
    titleBefore: z.string().optional(),
    catName: z.string().min(2, t('validation.cat.name.min')),
    titleAfter: z.string().optional(),
    chipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: t('validation.cat.chipNumber.invalid')
    }),

    gender: z.enum(['male', 'female'], {
        message: t('validation.cat.gender.required')
    }),
    neutered: z.enum(["yes", "no"], {
        message: t('validation.cat.neutered.required')
    }),

    birthDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, t('validation.cat.birthDate.invalid'))
        .superRefine((val, ctx) => {
            const result = validateCatAge(val, t);
            if (result !== true) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result,
                });
            }
        }),
    group: z.string().optional(),
    showClass: z.string().min(1, t('validation.cat.showClass.required')),
    pedigreeNumber: z.string().optional(),
    cageType: z.string().min(1, t('validation.cat.cageType.required')),
    emsCode: z.string().superRefine((val, ctx) => {
        const result = validateEmsCode(val);
        if (result !== true) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t(result, { defaultValue: result }),
            });
        }
    }),

    motherTitleBefore: z.string().optional(),
    motherName: z.string().optional(),
    motherTitleAfter: z.string().optional(),
    motherBirthDate: z.string()
        .refine(val => val === '' || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: t('validation.cat.birthDate.invalid')
        })
        .superRefine((val, ctx) => {
            const result = validateCommonDate(val, t);
            if (result !== true) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: result, });
            }
        })
        .optional(),
    motherEmsCode: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") return;
        const result = validateEmsCode(val);
        if (result !== true) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t(result, { defaultValue: result }),
            });
        }
    }),
    motherPedigreeNumber: z.string().optional(),
    motherChipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: t('validation.cat.chipNumber.invalid')
    }),
    motherGender: z.enum(['male', 'female'], {
        message: t('validation.cat.gender.required')
    }),

    fatherTitleBefore: z.string().optional(),
    fatherName: z.string().optional(),
    fatherTitleAfter: z.string().optional(),
    fatherBirthDate: z.string()
        .refine(val => val === '' || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: t('validation.cat.birthDate.invalid')
        })
        .superRefine((val, ctx) => {
            const result = validateCommonDate(val, t);
            if (result !== true) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: result, });
            }
        })
        .optional(),
    fatherEmsCode: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") return;
        const result = validateEmsCode(val);
        if (result !== true) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t(result, { defaultValue: result }),
            });
        }
    }),
    fatherPedigreeNumber: z.string().optional(),
    fatherChipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: t('validation.cat.chipNumber.invalid')
    }),
    fatherGender: z.enum(['male', 'female'], {
        message: t('validation.cat.gender.required')
    }),
    isSaved: z.boolean().optional()
}).superRefine((data, ctx) => {
    // Validace skupiny na základě EMS kódu s použitím 't'
    if (data.emsCode && data.emsCode.length >= 3) {
        const breedCode = data.emsCode.split(' ')[0].toUpperCase();

        const groupResult = validateGroupForBreed(breedCode, data.group, t);

        if (groupResult !== true) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: groupResult,
                path: ["group"]
            });
        }
    }
}).refine((data) => {
    if (!data.motherBirthDate || data.motherBirthDate.trim() === '') return true;
    if (!data.birthDate) return true;

    const catDate = new Date(data.birthDate);
    const motherDate = new Date(data.motherBirthDate);

    if (isNaN(catDate.getTime()) || isNaN(motherDate.getTime())) return true;

    const minMotherDate = new Date(catDate);
    minMotherDate.setFullYear(minMotherDate.getFullYear() - 1);

    return motherDate <= minMotherDate;
}, {
    message: t('validation.cat.motherYoungerThanCat') || "Matka musí být starší než kočka alespoň o 1 rok.",
    path: ["motherBirthDate"]
}).refine((data) => {
    if (!data.fatherBirthDate || data.fatherBirthDate.trim() === '') return true;
    if (!data.birthDate) return true;

    const catDate = new Date(data.birthDate);
    const fatherDate = new Date(data.fatherBirthDate);

    if (isNaN(catDate.getTime()) || isNaN(fatherDate.getTime())) return true;

    const minFatherDate = new Date(catDate);
    minFatherDate.setFullYear(minFatherDate.getFullYear() - 1);

    return fatherDate <= minFatherDate;
}, {
    message: t('validation.cat.fatherYoungerThanCat') || "Otec musí být starší než kočka alespoň o 1 rok.",
    path: ["fatherBirthDate"]
});

export const createRegistrationSchema = (t: TFunction) => {
    const personSchema = createPersonSchema(t);
    const catSchema = createCatSchema(t);

    return z.object({
        showId: z.string().min(1, t('validation.registration.showId.required')),
        days: z.enum(['sat', 'sun', 'both'], {
            message: t('validation.registration.days.required')
        }),

        cats: z.array(catSchema).min(1, t('validation.registration.cats.min')),

        ownerFirstName: personSchema.FirstName,
        ownerLastName: personSchema.LastName,
        ownerAddress: personSchema.Address,
        ownerZip: personSchema.Zip,
        ownerCity: personSchema.City,
        ownerEmail: personSchema.Email,
        ownerPhone: personSchema.Phone,
        ownerLocalOrganization: personSchema.LocalOrganization,
        ownerMembershipNumber: personSchema.MembershipNumber,

        sameAsOwner: z.boolean().default(false),
        breederFirstName: personSchema.FirstName.optional(),
        breederLastName: personSchema.LastName.optional(),
        breederAddress: personSchema.Address.optional(),
        breederZip: personSchema.Zip.optional(),
        breederCity: personSchema.City.optional(),
        breederEmail: personSchema.Email.optional(),
        breederPhone: personSchema.Phone.optional(),

        notes: z.string().optional(),
        dataAccuracy: z.boolean().refine(val => val === true, {
            message: t('validation.registration.dataAccuracy.required')
        }),
        gdprConsent: z.boolean().refine(val => val === true, {
            message: t('validation.registration.gdprConsent.required')
        }),

    }).refine(data => {
        if (!data.sameAsOwner) {
            return z.object({
                breederFirstName: personSchema.FirstName,
                breederLastName: personSchema.LastName,
                breederAddress: personSchema.Address,
                breederZip: personSchema.Zip,
                breederCity: personSchema.City,
                breederEmail: personSchema.Email,
                breederPhone: personSchema.Phone,
            }).safeParse({
                breederFirstName: data.breederFirstName,
                breederLastName: data.breederLastName,
                breederAddress: data.breederAddress,
                breederZip: data.breederZip,
                breederCity: data.breederCity,
                breederEmail: data.breederEmail,
                breederPhone: data.breederPhone,
            }).success;
        }
        return true;
    }, {
        message: t('validation.registration.exhibitor.required'),
        path: ["exhibitorFirstName"],
    });
};

export type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;
export type CatFormData = RegistrationFormData['cats'][0];