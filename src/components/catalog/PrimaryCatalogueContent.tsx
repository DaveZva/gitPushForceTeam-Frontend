import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { registrationApi } from "../../services/api/registrationApi";
import { BREED_NAMES, FIFE_CATEGORIES } from "../../utils/emsRules";

interface CatEntry {
    cat: {
        entryNumber: number;
        name: string;
        ems: string;
        sex: string;
        dob: string;
        regNumber: string;
        father: string;
        mother: string;
        owner: string;
        breeder: string;
        breederCountry: string;
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
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredData = useMemo(() => {
        if (!searchTerm) return catalogData;
        const lowerTerm = searchTerm.toLowerCase();

        return catalogData.filter(entry =>
            entry.cat.name.toLowerCase().includes(lowerTerm) ||
            entry.cat.owner.toLowerCase().includes(lowerTerm) ||
            entry.cat.ems.toLowerCase().includes(lowerTerm) ||
            entry.cat.entryNumber.toString().includes(lowerTerm)
        );
    }, [catalogData, searchTerm]);

    const groupedData = useMemo(() => {
        const grouped = new Map<number, Map<string, Map<string, Map<string, CatEntry[]>>>>();

        filteredData.forEach(entry => {
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
    }, [filteredData]);

    if (isLoading) return <LoadingSpinner className="py-24" />;

    return (
        <div className="space-y-8 text-left font-sans tracking-tight text-gray-900">
            <div className="sticky top-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100 mb-8">
                <input
                    type="text"
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#027BFF] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {t('common.noResults')}
                </div>
            )}

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
                                                    {entries
                                                        .sort((a, b) => a.cat.entryNumber - b.cat.entryNumber)
                                                        .map(e => (
                                                            <div key={e.cat.entryNumber} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-start mb-2 text-left">
                                                                    <span className="font-bold text-[#027BFF] text-lg">{e.cat.entryNumber}. {e.cat.name}</span>
                                                                    {e.group && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">GR {e.group}</span>}
                                                                </div>
                                                                <div className="text-xs text-gray-500 space-y-1 text-left">
                                                                    <p><strong>EMS:</strong> {e.cat.ems} | <strong>{t('cat.sex')}:</strong> {e.cat.sex} | <strong>{t('cat.born')}:</strong> {e.cat.dob}</p>
                                                                    <div className="pt-2 mt-2 border-t border-gray-50 space-y-1">
                                                                        <p className="truncate"><strong>{t('cat.father')}:</strong> {e.cat.father}</p>
                                                                        <p className="truncate"><strong>{t('cat.mother')}:</strong> {e.cat.mother}</p>
                                                                        <p><strong>{t('cat.owner')}:</strong> {e.cat.owner} | <strong>{t('cat.breeder')}:</strong> {e.cat.breeder} ({e.cat.breederCountry})</p>
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