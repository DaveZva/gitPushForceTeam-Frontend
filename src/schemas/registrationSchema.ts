import { z } from 'zod';
import { validateEmsCode } from '../utils/emsRules';
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

    // Matka
    motherTitleBefore: z.string().optional(),
    motherName: z.string().optional(),
    motherTitleAfter: z.string().optional(),
    motherBirthDate: z.string()
        .refine(val => val === '' || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: t('validation.cat.birthDate.invalid')
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
    motherChipNumber: z.string().optional(),
    motherGender: z.enum(['male', 'female'], {
        message: t('validation.cat.gender.required')
    }),

    // Otec
    fatherTitleBefore: z.string().optional(),
    fatherName: z.string().optional(),
    fatherTitleAfter: z.string().optional(),
    fatherBirthDate: z.string()
        .refine(val => val === '' || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: t('validation.cat.birthDate.invalid')
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
    fatherChipNumber: z.string().optional(),
    fatherGender: z.enum(['male', 'female'], {
        message: t('validation.cat.gender.required')
    })
}).refine((data) => {
    // VALIDACE: Matka musí být starší než kočka alespoň o 4 měsíce
    if (!data.motherBirthDate || data.motherBirthDate.trim() === '') return true;
    if (!data.birthDate) return true;

    const catDate = new Date(data.birthDate);
    const motherDate = new Date(data.motherBirthDate);

    if (isNaN(catDate.getTime()) || isNaN(motherDate.getTime())) return true;

    // Od data narození kočky odečteme 4 měsíce
    const minMotherDate = new Date(catDate);
    minMotherDate.setMonth(minMotherDate.getMonth() - 4);

    return motherDate <= minMotherDate;
}, {
    message: t('validation.cat.motherYoungerThanCat') || "Matka musí být starší než kočka alespoň o 4 měsíce.",
    path: ["motherBirthDate"]
}).refine((data) => {   //validace otce
    if (!data.fatherBirthDate || data.fatherBirthDate.trim() === '') return true;
    if (!data.birthDate) return true;

    const catDate = new Date(data.birthDate);
    const fatherDate = new Date(data.fatherBirthDate);

    if (isNaN(catDate.getTime()) || isNaN(fatherDate.getTime())) return true;

    const minFatherDate = new Date(catDate);
    minFatherDate.setMonth(minFatherDate.getMonth() - 4);

    return fatherDate <= minFatherDate;
}, {
    message: t('validation.cat.fatherYoungerThanCat') || "Otec musí být starší než kočka alespoň o 4 měsíce.",
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

const validateCatAge = (dateString: string, t: TFunction): string | true => {
    const birthDate = new Date(dateString);
    const today = new Date();

    // Nastavení času na 00:00:00 pro přesné porovnání data
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Datum před 20 lety
    const maxAgeDate = new Date(today);
    maxAgeDate.setFullYear(today.getFullYear() - 20);

    if (birthDate < maxAgeDate) {
        return t('validation.cat.age.max') || 'Kočka nesmí být starší 20 let.';
    }

    // Datum před 4 měsíci
    const minAgeDate = new Date(today);
    minAgeDate.setMonth(today.getMonth() - 4);

    if (birthDate > minAgeDate) {
        return t('validation.cat.age.min') || 'Kočka musí být starší 4 měsíců.';
    }

    return true;
};

export type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;
export type CatFormData = RegistrationFormData['cats'][0];
