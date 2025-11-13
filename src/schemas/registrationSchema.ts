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
