import React from 'react';
import { useFormContext } from 'react-hook-form';
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';
import { TextArea } from '../../../components/ui/TextArea';
import { Checkbox } from '../../../components/ui/Checkbox';

export function Step5_NotesAndConsent() {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Poznámky a souhlas</h2>

            <TextArea
                id="notes"
                label="Poznámky k přihlášce"
                placeholder="Zde můžete uvést jakékoliv poznámky k vaší přihlášce..."
                registration={register("notes")}
                error={errors.notes}
            />

            <div className="space-y-4">
                <Checkbox
                    id="dataAccuracy"
                    label="Prohlašuji, že všechny uvedené údaje jsou pravdivé a úplné."
                    description="Jsem si vědom/a, že uvedení nepravdivých údajů může vést k vyloučení z výstavy."
                    registration={register("dataAccuracy")}
                    error={errors.dataAccuracy}
                />

                <Checkbox
                    id="gdprConsent"
                    label="Souhlasím se zpracováním osobních údajů"
                    description="v souladu s nařízením GDPR za účelem registrace na výstavu a dalších souvisejících činností."
                    registration={register("gdprConsent")}
                    error={errors.gdprConsent}
                />
            </div>

            <div className="p-4 text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <strong className="font-bold">⚠️ Upozornění:</strong> Po odeslání přihlášky obdržíte potvrzovací email s platebními údaji. Přihláška bude aktivní po připsání platby na náš účet.
            </div>
        </div>
    );
}