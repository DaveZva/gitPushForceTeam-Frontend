import { z } from 'zod';
import { validateEmsCode } from '../utils/emsRules';
import type { TFunction } from 'i18next';

// Schéma pro chovatele/vystavovatele (nyní uvnitř funkce)
const createPersonSchema = (t: TFunction) => ({
    FirstName: z.string().min(2, t('errors.firstNameRequired')),
    LastName: z.string().min(2, t('errors.lastNameRequired')),
    Address: z.string().min(5, t('errors.addressRequired')),
    Zip: z.string().regex(/^\d{3} ?\d{2}$/, t('errors.zipInvalid')),
    City: z.string().min(2, t('errors.cityRequired')),
    Email: z.string().email(t('errors.emailInvalid')),
    Phone: z.string().regex(/^((\+420 ?)|(00420 ?))?\d{3} ?\d{3} ?\d{3}$/, t('errors.phoneInvalid')),
});

const createCatSchema = (t: TFunction) => z.object({
    titleBefore: z.string().optional(),
    catName: z.string().min(2, t('errors.catNameRequired')),
    titleAfter: z.string().optional(),
    chipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: t('errors.chipInvalid')
    }),

    gender: z.enum(['male', 'female'], {
        required_error: t('errors.genderRequired')
    }),
    neutered: z.enum(['yes', 'no'], {
        required_error: t('errors.neuteredRequired')
    }),

    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('errors.birthDateRequired')),
    showClass: z.string().min(1, t('errors.showClassRequired')),
    pedigreeNumber: z.string().optional(),
    cageType: z.string().min(1, t('errors.cageTypeRequired')),


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
    motherBreed: z.string().optional(),
    motherEmsCode: z.string().optional(),
    motherColor: z.string().optional(),
    motherPedigreeNumber: z.string().optional(),

    // Otec
    fatherTitleBefore: z.string().optional(),
    fatherName: z.string().optional(),
    fatherTitleAfter: z.string().optional(),
    fatherBreed: z.string().optional(),
    fatherEmsCode: z.string().optional(),
    fatherColor: z.string().optional(),
    fatherPedigreeNumber: z.string().optional(),
});


export const createRegistrationSchema = (t: TFunction) => {
    const personSchema = createPersonSchema(t);
    const catSchema = createCatSchema(t);

    return z.object({
        // Krok 1
        showId: z.string().min(1, t('errors.showIdRequired')),
        days: z.enum(['sat', 'sun', 'both'], {
            required_error: t('errors.daysRequired')
        }),

        // Krok 2
        cats: z.array(catSchema).min(1, t('errors.catsMinRequired')),

        // Krok 3 - Chovatel
        breederFirstName: personSchema.FirstName,
        breederLastName: personSchema.LastName,
        breederAddress: personSchema.Address,
        breederZip: personSchema.Zip,
        breederCity: personSchema.City,
        breederEmail: personSchema.Email,
        breederPhone: personSchema.Phone,

        // Krok 4 - Vystavovatel
        sameAsBreeder: z.boolean().default(false),
        exhibitorFirstName: personSchema.FirstName.optional(),
        exhibitorLastName: personSchema.LastName.optional(),
        exhibitorAddress: personSchema.Address.optional(),
        exhibitorZip: personSchema.Zip.optional(),
        exhibitorCity: personSchema.City.optional(),
        exhibitorEmail: personSchema.Email.optional(),
        exhibitorPhone: personSchema.Phone.optional(),

        // Krok 5 - Souhlas
        notes: z.string().optional(),
        dataAccuracy: z.boolean().refine(val => val === true, {
            message: t('errors.dataAccuracyRequired')
        }),
        gdprConsent: z.boolean().refine(val => val === true, {
            message: t('errors.gdprConsentRequired')
        }),

    }).refine(data => {
        if (!data.sameAsBreeder) {
            return z.object({
                exhibitorFirstName: personSchema.FirstName,
                exhibitorLastName: personSchema.LastName,
                exhibitorAddress: personSchema.Address,
                exhibitorZip: personSchema.Zip,
                exhibitorCity: personSchema.City,
                exhibitorEmail: personSchema.Email,
                exhibitorPhone: personSchema.Phone,
            }).safeParse({
                exhibitorFirstName: data.exhibitorFirstName,
                exhibitorLastName: data.exhibitorLastName,
                exhibitorAddress: data.exhibitorAddress,
                exhibitorZip: data.exhibitorZip,
                exhibitorCity: data.exhibitorCity,
                exhibitorEmail: data.exhibitorEmail,
                exhibitorPhone: data.exhibitorPhone,
            }).success;
        }
        return true;
    }, {
        message: t('errors.exhibitorRequired'),
        path: ["exhibitorFirstName"],
    });
};

const dummyT = (key: string) => key;
const baseSchemaForTypes = createRegistrationSchema(dummyT as TFunction);

export type RegistrationFormData = z.infer<typeof baseSchemaForTypes>;
export type CatFormData = RegistrationFormData['cats'][0];