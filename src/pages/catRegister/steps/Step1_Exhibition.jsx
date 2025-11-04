// Soubor: src/pages/catRegister/steps/Step1_Exhibition.jsx (UPRAVENÝ)
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { registrationApi } from '../../../services/api/registrationApi';

// Importujeme naše nové UI komponenty
import { Select } from '../../../components/ui/Select';
import { RadioGroup } from '../../../components/ui/RadioGroup';
import { Radio } from '../../../components/ui/Radio';

export function Step1_Exhibition() {
    // Tuto pomocnou komponentu zde zatím necháme,
    // protože ji stále používáme jako obal
    const FormField = ({ label, name, children, error }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );

    const { register, formState: { errors } } = useFormContext();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error('Chyba při načítání výstav:', error);
            } finally {
                setLoading(false);
            }
        };
        loadShows();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Výběr výstavy</h2>

            <FormField label="Výstava *" name="showId" error={errors.showId}>
                {loading ? (
                    <div className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg">Načítám výstavy...</div>
                ) : (
                    // POUŽITÍ KOMPONENTY <Select>
                    <Select id="showId" {...register("showId")}>
                        <option value="">Vyberte výstavu...</option>
                        {shows.map(show => (
                            <option key={show.id} value={show.id}>
                                {show.name} ({show.date})
                            </option>
                        ))}
                    </Select>
                )}
            </FormField>

            <FormField label="Účast na výstavě *" name="days" error={errors.days}>
                {/* POUŽITÍ KOMPONENT <RadioGroup> a <Radio> */}
                <RadioGroup>
                    <Radio
                        label="Sobota"
                        value="sat"
                        registration={register("days")}
                    />
                    <Radio
                        label="Neděle"
                        value="sun"
                        registration={register("days")}
                    />
                    <Radio
                        label="Oba dny"
                        value="both"
                        registration={register("days")}
                    />
                </RadioGroup>
            </FormField>
        </div>
    );
}