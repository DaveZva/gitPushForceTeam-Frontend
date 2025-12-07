import React, { useState } from 'react';

const ALL_JUDGES = [
    { id: 1, name: 'Mrs. Eva Porat', country: 'SE', categories: ['I', 'II'] },
    { id: 2, name: 'Mr. Luigi Comorio', country: 'IT', categories: ['All'] },
    { id: 3, name: 'Mrs. Daria Lukasik', country: 'PL', categories: ['III', 'IV'] },
];

export const JudgesSteawardsTab = ({ showId }: { showId: string | undefined }) => {
    const [assignedJudges, setAssignedJudges] = useState<any[]>([]); // Ti, co už jsou na výstavě
    const [availableJudges, setAvailableJudges] = useState<any[]>(ALL_JUDGES);
    const [search, setSearch] = useState('');

    const handleAssign = (judge: any) => {
        // API call: POST /api/v1/secretariat/shows/{id}/judges { judgeId: ... }
        setAssignedJudges([...assignedJudges, judge]);
        setAvailableJudges(availableJudges.filter(j => j.id !== judge.id));
    };

    const handleRemove = (judge: any) => {
        // API call: DELETE ...
        setAvailableJudges([...availableJudges, judge]);
        setAssignedJudges(assignedJudges.filter(j => j.id !== judge.id));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Levý sloupec - Přiřazení rozhodčí */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-600">●</span> Rozhodčí na výstavě
                </h3>

                {assignedJudges.length === 0 ? (
                    <p className="text-gray-400 text-sm italic py-4">Zatím nebyli přiřazeni žádní rozhodčí.</p>
                ) : (
                    <div className="space-y-3">
                        {assignedJudges.map(judge => (
                            <div key={judge.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                <div>
                                    <p className="font-semibold text-gray-900">{judge.name} <span className="text-xs text-gray-500">({judge.country})</span></p>
                                    <p className="text-xs text-gray-600">Kvalifikace: {judge.categories.join(', ')}</p>
                                </div>
                                <button onClick={() => handleRemove(judge)} className="text-red-500 hover:text-red-700 text-sm font-medium">Odebrat</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pravý sloupec - Výběr z databáze */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Databáze rozhodčích</h3>
                <input
                    type="text"
                    placeholder="Hledat jméno nebo zemi..."
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#027BFF] focus:border-[#027BFF]"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {availableJudges
                        .filter(j => j.name.toLowerCase().includes(search.toLowerCase()))
                        .map(judge => (
                            <div key={judge.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <div>
                                    <p className="font-medium text-gray-900">{judge.name} <span className="text-xs text-gray-500">({judge.country})</span></p>
                                    <p className="text-xs text-gray-500">Kategorie: {judge.categories.join(', ')}</p>
                                </div>
                                <button
                                    onClick={() => handleAssign(judge)}
                                    className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded shadow-sm hover:bg-gray-50"
                                >
                                    + Přidat
                                </button>
                            </div>
                        ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-[#027BFF] text-sm font-medium hover:underline">+ Vytvořit nového rozhodčího</button>
                </div>
            </div>
        </div>
    );
};