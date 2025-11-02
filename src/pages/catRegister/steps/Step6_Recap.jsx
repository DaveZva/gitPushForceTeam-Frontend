import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { registrationApi } from '../../../services/api/registrationApi';

export function Step6_Recap() {
    const { getValues } = useFormContext();
    const data = getValues();

    // --- Definice přesunuty sem dovnitř ---
    const RecapItem = ({ label, value }) => (
        <div className="py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <p className="text-base font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );
    const RecapSection = ({ title, children }) => (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-2 mb-4">
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    );

    // --- 2. Přidáme stav pro načtení výstav ---
    const [shows, setShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error("Chyba při načítání výstav v rekapitulaci:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadShows();
    }, []); // Prázdné pole znamená "spustit jen jednou"


    // --- 3. Najdeme název výstavy ---
    const selectedShow = shows.find(show => String(show.id) === String(data.showId));
    const showName = isLoading ? "Načítám..." : (selectedShow ? `${selectedShow.name} (${selectedShow.date})` : data.showId);


    // Jednoduché mapování pro čitelnější výstup
    const daysMap = { sat: "Sobota", sun: "Neděle", both: "Oba dny" };
    const genderMap = { male: "Kocour", female: "Kočka" };
    const neuteredMap = { yes: "Ano", no: "Ne" };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Rekapitulace přihlášky</h2>
            <p className="text-gray-600">
                Prosím zkontrolujte všechny zadané údaje. Pokud je vše v pořádku, odešlete přihlášku.
            </p>

            <div className="space-y-6">
                <RecapSection title="Výstava">
                    {/* --- 4. Použijeme nalezený název --- */}
                    <RecapItem label="Název výstavy" value={showName} />
                    <RecapItem label="Dny účasti" value={daysMap[data.days]} />
                </RecapSection>

                <RecapSection title="Kočka">
                    <RecapItem label="Jméno" value={`${data.titleBefore || ''} ${data.catName} ${data.titleAfter || ''}`} />
                    <RecapItem label="Pohlaví" value={genderMap[data.gender]} />
                    <RecapItem label="Kastrované" value={neuteredMap[data.neutered]} />
                    <RecapItem label="Datum narození" value={data.birthDate} />
                    <RecapItem label="EMS kód" value={data.emsCode} />
                    <RecapItem label="Třída" value={data.showClass} />
                    <RecapItem label="Čip" value={data.chipNumber} />
                    <RecapItem label="Typ klece" value={data.cageType} />
                </RecapSection>

                <RecapSection title="Chovatel">
                    <RecapItem label="Jméno a Příjmení" value={`${data.breederFirstName} ${data.breederLastName}`} />
                    <RecapItem label="Adresa" value={`${data.breederAddress}, ${data.breederZip} ${data.breederCity}`} />
                    <RecapItem label="Email" value={data.breederEmail} />
                    <RecapItem label="Telefon" value={data.breederPhone} />
                </RecapSection>

                <RecapSection title="Vystavovatel">
                    {data.sameAsBreeder ? (
                        <p className="p-3 text-gray-700 bg-gray-100 rounded-md">
                            Shodný s chovatelem
                        </p>
                    ) : (
                        <>
                            <RecapItem label="Jméno a Příjmení" value={`${data.exhibitorFirstName} ${data.exhibitorLastName}`} />
                            <RecapItem label="Adresa" value={`${data.exhibitorAddress}, ${data.exhibitorZip} ${data.exhibitorCity}`} />
                            <RecapItem label="Email" value={data.exhibitorEmail} />
                            <RecapItem label="Telefon" value={data.exhibitorPhone} />
                        </>
                    )}
                </RecapSection>

                <RecapSection title="Poznámky a Souhlasy">
                    <RecapItem label="Poznámky" value={data.notes} />
                    <RecapItem label="Pravdivost údajů" value={data.dataAccuracy ? "✓ Souhlasím" : "X Nesouhlasím"} />
                    <RecapItem label="Souhlas GDPR" value={data.gdprConsent ? "✓ Souhlasím" : "X Nesouhlasím"} />
                </RecapSection>
            </div>
        </div>
    );
}