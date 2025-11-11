import { z } from 'zod';
import { validateEmsCode } from '../utils/emsRules';
import i18n from 'i18next';

const t = (key: string) => i18n.t(key);

const createPersonSchema = () => ({
    FirstName: z.string().min(2, t('validation.person.firstName.min')),
    LastName: z.string().min(2, t('validation.person.lastName.min')),
    Address: z.string().min(5, t('validation.person.address.min')),
    Zip: z.string().regex(/^\d{3} ?\d{2}$/, t('validation.person.zip.invalid')),
    City: z.string().min(2, t('validation.person.city.min')),
    Email: z.string().email(t('validation.person.email.invalid')),
    Phone: z.string().regex(/^((\+420 ?)|(00420 ?))?\d{3} ?\d{3} ?\d{3}$/, t('validation.person.phone.invalid')),
});

const createCatSchema = () => z.object({
    // Základní údaje
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

    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('validation.cat.birthDate.invalid')),
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

export const createRegistrationSchema = () => {
    const personSchema = createPersonSchema();
    const catSchema = createCatSchema();

    return z.object({
        showId: z.string().min(1, t('validation.registration.showId.required')),
        days: z.enum(['sat', 'sun', 'both'], {
            message: t('validation.registration.days.required')
        }),

        cats: z.array(catSchema).min(1, t('validation.registration.cats.min')),

        breederFirstName: personSchema.FirstName,
        breederLastName: personSchema.LastName,
        breederAddress: personSchema.Address,
        breederZip: personSchema.Zip,
        breederCity: personSchema.City,
        breederEmail: personSchema.Email,
        breederPhone: personSchema.Phone,

        sameAsBreeder: z.boolean().default(false),
        exhibitorFirstName: personSchema.FirstName.optional(),
        exhibitorLastName: personSchema.LastName.optional(),
        exhibitorAddress: personSchema.Address.optional(),
        exhibitorZip: personSchema.Zip.optional(),
        exhibitorCity: personSchema.City.optional(),
        exhibitorEmail: personSchema.Email.optional(),
        exhibitorPhone: personSchema.Phone.optional(),

        notes: z.string().optional(),
        dataAccuracy: z.boolean().refine(val => val === true, {
            message: t('validation.registration.dataAccuracy.required')
        }),
        gdprConsent: z.boolean().refine(val => val === true, {
            message: t('validation.registration.gdprConsent.required')
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
        message: t('validation.registration.exhibitor.required'),
        path: ["exhibitorFirstName"],
    });
};

export type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;
export type CatFormData = RegistrationFormData['cats'][0];