import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { registrationApi } from "../../services/api/registrationApi";
import { BREED_NAMES, FIFE_CATEGORIES } from "../../utils/emsRules";

interface CatEntry {
    cat: {
        entryNumber: number; name: string; ems: string; sex: string; dob: string;
        regNumber: string; father: string; mother: string; owner: string;
        breeder: string; breederCountry: string;
    };
    category: string;
    colour: string;
    className: string;
    classSortOrder: number;
    group: string | null;
}

interface Props {
    showId: string | number;
}

export const PrimaryCatalogueContent = ({ showId }: Props) => {
    const { t } = useTranslation();
    const [catalogData, setCatalogData] = useState<CatEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const apiData = await registrationApi.getCatalog(showId);
                setCatalogData(apiData.map((dto: any) => ({
                    cat: {
                        entryNumber: dto.entryNumber,
                        name: dto.name,
                        ems: dto.ems,
                        sex: dto.sex,
                        dob: dto.birthDate,
                        regNumber: dto.registrationNumber,
                        father: dto.father,
                        mother: dto.mother,
                        owner: dto.ownerName,
                        breeder: dto.breederName,
                        breederCountry: dto.breederCountry
                    },
                    category: dto.category,
                    colour: dto.color,
                    className: dto.className,
                    classSortOrder: dto.classSortOrder,
                    group: dto.group
                })));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [showId]);

    const groupedData = useMemo(() => {
        const grouped = new Map<number, Map<string, Map<string, Map<string, CatEntry[]>>>>();
        catalogData.forEach(entry => {
            const fifeCat = FIFE_CATEGORIES[entry.category];
            const primaryKey = fifeCat ? fifeCat.index : 99;
            if (!grouped.has(primaryKey)) grouped.set(primaryKey, new Map());
            const byCategory = grouped.get(primaryKey)!;
            if (!byCategory.has(entry.category)) byCategory.set(entry.category, new Map());
            const byBreed = byCategory.get(entry.category)!;
            if (!byBreed.has(entry.colour)) byBreed.set(entry.colour, new Map());
            const byColour = byBreed.get(entry.colour)!;
            if (!byColour.has(entry.className)) byColour.set(entry.className, []);
            byColour.get(entry.className)!.push(entry);
        });
        return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
    }, [catalogData]);

    if (isLoading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#027BFF]"></div></div>;

    return (
        <div className="space-y-12 text-left font-sans tracking-tight text-gray-900">
            {Array.from(groupedData.entries()).map(([catIndex, byBreed]) => (
                <div key={catIndex} className="mt-12 p-6 bg-white rounded-xl shadow-lg border-t-8 border-[#027BFF]">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 border-b border-gray-200 pb-4 mb-6">
                        {t('catalog.category')} {catIndex === 99 ? t('catalog.categoryOther') : catIndex}
                    </h1>
                    {Array.from(byBreed.entries()).map(([breedName, byColour]) => (
                        <div key={breedName} className="mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-2 mb-6 text-left">
                                {BREED_NAMES[breedName] || breedName} <span className="text-[#027BFF]">({breedName})</span>
                            </h2>
                            {Array.from(byColour.entries()).map(([colourName, byClass]) => (
                                <div key={colourName} className="mt-6 bg-blue-50/30 p-4 rounded-xl">
                                    <h3 className="text-lg font-bold text-[#027BFF] mb-4 text-left">EMS: {colourName}</h3>
                                    {Array.from(byClass.entries())
                                        .sort((a, b) => {
                                            const orderA = a[1][0]?.classSortOrder || 999;
                                            const orderB = b[1][0]?.classSortOrder || 999;
                                            return orderA - orderB;
                                        })
                                        .map(([className, entries]) => (
                                            <div key={className} className="mb-6 last:mb-0">
                                                <h4 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-200 mb-4">{className}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {entries.map(e => (
                                                        <div key={e.cat.entryNumber} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                            <div className="flex justify-between items-start mb-2 text-left">
                                                                <span className="font-bold text-[#027BFF] text-lg">{e.cat.entryNumber}. {e.cat.name}</span>
                                                                {e.group && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">GR {e.group}</span>}
                                                            </div>
                                                            <div className="text-xs text-gray-500 space-y-1 text-left">
                                                                <p><strong>EMS:</strong> {e.cat.ems} | <strong>Sex:</strong> {e.cat.sex} | <strong>Born:</strong> {e.cat.dob}</p>
                                                                <div className="pt-2 mt-2 border-t border-gray-50 space-y-1">
                                                                    <p className="truncate"><strong>Father:</strong> {e.cat.father}</p>
                                                                    <p className="truncate"><strong>Mother:</strong> {e.cat.mother}</p>
                                                                    <p><strong>Owner:</strong> {e.cat.owner} | <strong>Breeder:</strong> {e.cat.breeder} ({e.cat.breederCountry})</p>
                                                                    <p className="text-[10px] text-gray-400">Reg: {e.cat.regNumber}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};