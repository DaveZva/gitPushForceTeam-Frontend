import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { registrationApi } from '../../../services/api/registrationApi';

export function Step1_Exhibition() {
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
                    <select
                        id="showId"
                        {...register("showId")}
                        className="w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Vyberte výstavu...</option>
                        {shows.map(show => (
                            <option key={show.id} value={show.id}>
                                {show.name} ({show.date})
                            </option>
                        ))}
                    </select>
                )}
            </FormField>

            <FormField label="Účast na výstavě *" name="days" error={errors.days}>
                <div className="flex flex-col p-2 space-y-2 bg-gray-100 rounded-lg sm:flex-row sm:space-y-0 sm:space-x-2">
                    {['sat', 'sun', 'both'].map((day) => (
                        <label key={day} className="flex-1 px-4 py-3 text-center transition-colors duration-200 rounded-md cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white">
                            <input
                                type="radio"
                                value={day}
                                {...register("days")}
                                className="sr-only" // Skryje radio button
                            />
                            {day === 'sat' && 'Sobota'}
                            {day === 'sun' && 'Neděle'}
                            {day === "both" && 'Oba dny'}
                        </label>
                    ))}
                </div>
            </FormField>
        </div>
    );
}