import React from 'react';
import { useFormContext } from 'react-hook-form';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import { Checkbox } from '../../../components/ui/Checkbox';

export function Step5_NotesAndConsent() {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Poznámky a souhlas</h2>

            <div className="flex flex-col gap-2">

                <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                    Poznámky k přihlášce
                </label>

                <textarea
                    id="notes"
                    rows={5}
                    placeholder="Zde můžete uvést jakékoliv poznámky k vaší přihlášce..."
                    className={`w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.notes ? 'ring-2 ring-red-500' : ''} `}
                    {...register("notes")}
                />

                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
            </div>
            {/* ==== ZDE KONČÍ NAHRAZENÁ KOMPONENTA TEXTAREA ==== */}


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