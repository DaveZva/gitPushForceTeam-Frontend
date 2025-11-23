import { z } from 'zod';
import { TFunction } from 'i18next';

export const createResetPasswordSchema = (t: TFunction) => {
    return z.object({
        password: z.string()
            .min(6, t('validation.auth.password.min', 'Heslo musí mít alespoň 6 znaků')),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.passwordsDoNotMatch'),
        path: ["confirmPassword"], // Toto zajistí, že chyba se ukáže u pole confirmPassword
    });
};

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;