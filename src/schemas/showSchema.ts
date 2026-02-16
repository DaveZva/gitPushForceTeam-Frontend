import { z } from 'zod';
import {TFunction} from "i18next";

const showStatusEnum = z.enum([
    'PLANNED',
    'OPEN',
    'CLOSED',
    'COMPLETED',
    'CANCELLED'
]);

export const createShowSchema = (t: TFunction) => z.object({
    name: z.string().min(5, t('validation.exhibition.name.min')),
    description: z.string().optional(),
    status: showStatusEnum.default('PLANNED'),
    maxCats: z.coerce.number().min(10, t('validation.exhibition.maxCats.min')).max(2000, t('validation.exhibition.maxCats.max')),
    venueName: z.string().min(3, t('validation.exhibition.venueName.min')),
    venueAddress: z.string().optional(),
    venueCity: z.string().optional(),
    venueState: z.string().optional(),
    venueZip: z.string().optional(),

    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.startDate.invalid')
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.endDate.invalid')
    }),
    registrationDeadline: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.registrationDeadline.invalid')
    }),

    vetCheckStart: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.vetCheckStart.invalid')
    }),
    judgingStart: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.judgingStart.invalid')
    }),
    judgingEnd: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
        message: t('validation.exhibition.judgingEnd.invalid')
    }),

    organizerName: z.string().min(3, t('validation.exhibition.organizerName.min')),
    organizerContactEmail: z.string().email(t('validation.exhibition.contactEmail.invalid')).optional().or(z.literal('')),
    websiteUrl: z.string().url(t('validation.exhibition.websiteUrl.invalid')).optional().or(z.literal('')),

}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: t('validation.exhibition.date.order'),
    path: ['endDate'],
});

export type ShowFormData = z.infer<ReturnType<typeof createShowSchema>>;