import { z } from 'zod';
import { TFunction } from 'i18next';

export const createResetPasswordSchema = (t: TFunction) => {
    return z.object({
        password: z.string()
            .min(8, t('validation.auth.password.min'))
            .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*_\-]).{8,}$/, t('auth.passwordComplexity')),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.passwordsDoNotMatch'),
        path: ["confirmPassword"],
    });
};

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;