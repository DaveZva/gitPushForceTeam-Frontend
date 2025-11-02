import React from 'react';
import { useFormContext } from 'react-hook-form';

export function Step5_NotesAndConsent() {
    const { register, formState: { errors } } = useFormContext();

    const consentBoxClass = "flex items-start gap-3 p-4 border border-gray-200 rounded-lg has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50";
    const checkboxClass = "w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500 shrink-0 mt-1";

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Poznámky a souhlas</h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                    Poznámky k přihlášce
                </label>
                <textarea
                    id="notes"
                    {...register("notes")}
                    rows="5"
                    className="w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Zde můžete uvést jakékoliv poznámky k vaší přihlášce..."
                />
            </div>

            <div className="space-y-4">
                <div className={consentBoxClass}>
                    <input
                        type="checkbox"
                        id="dataAccuracy"
                        {...register("dataAccuracy")}
                        className={checkboxClass}
                    />
                    <label htmlFor="dataAccuracy" className="cursor-pointer">
                        <strong className="text-gray-800">Prohlašuji, že všechny uvedené údaje jsou pravdivé a úplné.</strong>
                        <span className="block text-sm text-gray-600">Jsem si vědom/a, že uvedení nepravdivých údajů může vést k vyloučení z výstavy.</span>
                        {errors.dataAccuracy && <p className="mt-1 text-sm text-red-600">{errors.dataAccuracy.message}</p>}
                    </label>
                </div>

                <div className={consentBoxClass}>
                    <input
                        type="checkbox"
                        id="gdprConsent"
                        {...register("gdprConsent")}
                        className={checkboxClass}
                    />
                    <label htmlFor="gdprConsent" className="cursor-pointer">
                        <strong className="text-gray-800">Souhlasím se zpracováním osobních údajů</strong>
                        <span className="block text-sm text-gray-600">v souladu s nařízením GDPR za účelem registrace na výstavu a dalších souvisejících činností.</span>
                        {errors.gdprConsent && <p className="mt-1 text-sm text-red-600">{errors.gdprConsent.message}</p>}
                    </label>
                </div>
            </div>

            <div className="p-4 text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <strong className="font-bold">⚠️ Upozornění:</strong> Po odeslání přihlášky obdržíte potvrzovací email s platebními údaji. Přihláška bude aktivní po připsání platby na náš účet.
            </div>
        </div>
    );
}