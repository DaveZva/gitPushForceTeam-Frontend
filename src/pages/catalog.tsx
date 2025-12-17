import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registrationApi, QuickCatalogEntry, PublicShowDetail } from "../services/api/registrationApi";

const BREED_NAMES: Record<string, string> = {
    EXO: 'Exotic Shorthair',
    PER: 'Persian',
    RAG: 'Ragdoll',
    SBI: 'Birman (Sacred Birman)',
    MCO: 'Maine Coon',
    ACL: 'American Curl Longhair',
    NFO: 'Norwegian Forest Cat',
    SIB: 'Siberian',
    BSH: 'British Shorthair',
    BUR: 'Burmese',
    BEN: 'Bengal',
    ABY: 'Abyssinian',
    SIA: 'Siamese',
    OSH: 'Oriental Shorthair',
    SPH: 'Sphynx',
};

const FIFE_CATEGORIES: Record<string, { name: string; index: number; ems: string }> = {
    'EXO': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    'PER': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    'RAG': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'SBI': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'MCO': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'ACL': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'NFO': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'SIB': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'TUV': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'BEN': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'BSH': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'BUR': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'ABY': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'SIA': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'OSH': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'SPH': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
};

interface CatDetail {
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
}

interface CatEntry {
    cat: CatDetail;
    category: string;
    colour: string;
    class: string;
    group: number | null;
}

const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getClassSortOrder = (className: string): number => {
    const match = className.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
    const classPriority: Record<string, number> = {
        'SUPREME_CHAMPION': 1, 'SUPREME_PREMIOR': 2, 'GRAND_INTERNATIONAL_CHAMPION': 3,
        'GRAND_INTERNATIONAL_PREMIER': 4, 'INTERNATIONAL_CHAMPION': 5, 'INTERNATIONAL_PREMIER': 6,
        'CHAMPION': 7, 'PREMIER': 8, 'OPEN': 9, 'NEUTER': 10, 'JUNIOR': 11, 'KITTEN': 12,
        'LITTER': 16
    };
    return classPriority[className] || 99;
};

const useSortedCatalogData = (
    cats: CatEntry[],
    searchTerm: string,
    filters: { breed: string, sex: string, class: string },
    sortKey: string
) => {
    return useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();

        const filteredCats = cats.filter(entry =>
            (searchTerm === '' ||
                entry.cat.name.toLowerCase().includes(lowerCaseSearch) ||
                entry.cat.ems.toLowerCase().includes(lowerCaseSearch) ||
                entry.cat.regNumber.toLowerCase().includes(lowerCaseSearch)
            ) &&
            (filters.breed === 'All' || entry.category === filters.breed) &&
            (filters.sex === 'All' || entry.cat.sex === filters.sex) &&
            (filters.class === 'All' || entry.class === filters.class)
        );

        filteredCats.sort((a, b) => {
            switch (sortKey) {
                case 'entryNumber': return a.cat.entryNumber - b.cat.entryNumber;
                case 'name': return a.cat.name.localeCompare(b.cat.name);
                case 'breed': return a.category.localeCompare(b.category) || a.colour.localeCompare(b.colour);
                default:
                    const fifeA = FIFE_CATEGORIES[a.category]?.index || 99;
                    const fifeB = FIFE_CATEGORIES[b.category]?.index || 99;
                    if (fifeA !== fifeB) return fifeA - fifeB;
                    if (a.category !== b.category) return a.category.localeCompare(b.category);
                    if (a.colour !== b.colour) return a.colour.localeCompare(b.colour);
                    const classOrderA = getClassSortOrder(a.class);
                    const classOrderB = getClassSortOrder(b.class);
                    if (classOrderA !== classOrderB) return classOrderA - classOrderB;
                    return a.cat.entryNumber - b.cat.entryNumber;
            }
        });

        const grouped = new Map<number, Map<string, Map<string, Map<string, CatEntry[]>>>>();
        filteredCats.forEach(entry => {
            const fifeCat = FIFE_CATEGORIES[entry.category];
            const primaryKey = fifeCat ? fifeCat.index : 99;
            if (!grouped.has(primaryKey)) grouped.set(primaryKey, new Map());
            const byCategory = grouped.get(primaryKey)!;
            if (!byCategory.has(entry.category)) byCategory.set(entry.category, new Map());
            const byBreed = byCategory.get(entry.category)!;
            if (!byBreed.has(entry.colour)) byBreed.set(entry.colour, new Map());
            const byColour = byBreed.get(entry.colour)!;
            if (!byColour.has(entry.class)) byColour.set(entry.class, []);
            byColour.get(entry.class)!.push(entry);
        });

        return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
    }, [cats, searchTerm, filters, sortKey]);
};

const PrimaryCatalogueContent = ({ showId }: { showId: string | number }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ breed: 'All', sex: 'All', class: 'All' });
    const [sortKey, setSortKey] = useState('fifeOrder');
    const [catalogData, setCatalogData] = useState<CatEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const idToFetch = showId || 1;
                const apiData = await registrationApi.getCatalog(idToFetch);
                const mappedData: CatEntry[] = apiData.map(dto => ({
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
                    class: dto.className,
                    group: dto.group
                }));
                setCatalogData(mappedData);
                setError(null);
            } catch (err) {
                console.error("Chyba při načítání katalogu:", err);
                setError(t('catalog.errorLoading'));
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [showId, t]);

    const uniqueBreeds = useMemo(() => ['All', ...Array.from(new Set(catalogData.map(c => c.category))).sort()], [catalogData]);
    const uniqueSex = useMemo(() => ['All', ...Array.from(new Set(catalogData.map(c => c.cat.sex))).sort()], [catalogData]);
    const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(catalogData.map(c => c.class))).sort((a, b) => getClassSortOrder(a) - getClassSortOrder(b))], [catalogData]);

    const sortedData = useSortedCatalogData(catalogData, searchTerm, filters, sortKey);

    const totalFilteredCats = useMemo(() => {
        let count = 0;
        sortedData.forEach(byCategory => byCategory.forEach(byBreed => byBreed.forEach(byColour => byColour.forEach(entries => count += entries.length))));
        return count;
    }, [sortedData]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

    const renderCatDetails = (entry: CatEntry) => (
        <div className="text-sm space-y-1 mt-2 text-gray-700">
            <div className="flex flex-wrap gap-x-4">
                <span className="font-black text-[#027BFF] tracking-tight">{entry.cat.name}</span>
                <span className="font-medium text-gray-500 text-xs mt-0.5">({t('catalog.regNo')}: {entry.cat.regNumber})</span>
            </div>
            <div className="flex flex-wrap gap-x-4 text-xs sm:text-sm">
                <span className="font-medium"><strong className="text-gray-900">EMS:</strong> {entry.cat.ems}</span>
                <span className="font-medium"><strong className="text-gray-900">{t('catalog.sex')}:</strong> {entry.cat.sex}</span>
                <span className="font-medium"><strong className="text-gray-900">{t('catalog.dob')}:</strong> {entry.cat.dob}</span>
            </div>
            <div className="pl-4 text-xs space-y-0.5 mt-2 border-l-2 border-gray-100">
                <p className="text-gray-600 truncate"><strong className="text-gray-900">{t('catalog.father')}:</strong> {entry.cat.father}</p>
                <p className="text-gray-600 truncate"><strong className="text-gray-900">{t('catalog.mother')}:</strong> {entry.cat.mother}</p>
                <p className="text-gray-600"><strong className="text-gray-900">{t('catalog.owner')}:</strong> {entry.cat.owner} <span className="mx-1 text-gray-400">|</span> <strong className="text-gray-900">{t('catalog.breeder')}:</strong> {entry.cat.breeder} ({entry.cat.breederCountry})</p>
            </div>
        </div>
    );

    const renderHierarchicalList = () => (
        <div className="space-y-12">
            {Array.from(sortedData.entries()).map(([catIndex, byBreed]) => (
                <div key={catIndex} className="mt-12 p-6 bg-white rounded-xl shadow-2xl border-t-8 border-[#027BFF]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b-2 border-gray-300 pb-4 mb-6">
                        {t('catalog.category')} {catIndex === 99 ? t('catalog.categoryOther') : catIndex}
                    </h1>
                    {Array.from(byBreed.entries()).map(([breedName, byColour]) => (
                        <div key={breedName} className="mt-10 p-6 bg-white rounded-xl shadow-lg border-t-4 border-gray-300">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4">{BREED_NAMES[breedName] || breedName} <span className="text-[#027BFF]">({breedName})</span></h1>
                            {Array.from(byColour.entries()).map(([colourName, byClass]) => (
                                <div key={`${breedName}-${colourName}`} className="mt-6 p-4 bg-blue-50/70 rounded-lg shadow-inner">
                                    <h2 className="text-xl font-bold text-[#027BFF] border-b-2 border-[#027BFF] pb-3 mb-4">EMS: {colourName}</h2>
                                    {Array.from(byClass.entries()).map(([className, entries]) => (
                                        <div key={`${breedName}-${className}`} className="mt-4 pt-0">
                                            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">{className}</h3>
                                            <ul className="list-none space-y-4">
                                                {entries.map(entry => (
                                                    <li key={entry.cat.entryNumber} className="p-3 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                                        <div className="flex items-start justify-between flex-wrap">
                                                            <h4 className="text-base font-bold text-gray-900 flex items-baseline">
                                                                <span className="text-xl text-[#027BFF] mr-2">#.</span>
                                                                <span className="ml-0 text-sm sm:text-base font-bold">{entry.category} <span className="text-gray-600 font-normal ml-1">({entry.colour})</span></span>
                                                            </h4>
                                                            {entry.group && <div className="text-xs font-medium text-white bg-[#005fcc] px-2 py-0.5 rounded-full mt-1 sm:mt-0">{t('catalog.group')}: {entry.group}</div>}
                                                        </div>
                                                        {renderCatDetails(entry)}
                                                    </li>
                                                ))}
                                            </ul>
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

    const renderFlatList = () => {
        const flatList: CatEntry[] = [];
        sortedData.forEach(byCategory => byCategory.forEach(byBreed => byBreed.forEach(byColour => byColour.forEach(entries => flatList.push(...entries)))));
        return (
            <div className="p-6 bg-white rounded-xl shadow-2xl border-t-8 border-[#027BFF]">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b-2 border-gray-300 pb-4 mb-6">{t('catalog.listSorted')}</h1>
                <ul className="list-none space-y-4 mt-6">
                    {flatList.map(entry => (
                        <li key={entry.cat.entryNumber} className="p-3 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between flex-wrap">
                                <h4 className="text-base font-bold text-gray-900 flex items-baseline">
                                    <span className="text-xl text-[#027BFF] mr-2">{entry.cat.entryNumber}.</span>
                                    <span className="ml-0 text-sm sm:text-base font-bold">{entry.cat.name}<span className="text-gray-600 font-normal ml-2">({entry.category} - {entry.colour})</span></span>
                                </h4>
                                <div className="text-xs font-medium text-white bg-[#005fcc] px-2 py-0.5 rounded-full mt-1 sm:mt-0">{entry.class}</div>
                            </div>
                            {renderCatDetails(entry)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-24"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#027BFF]"></div><p className="mt-6 text-gray-600 font-medium text-lg">{t('catalog.loading')}</p></div>;
    if (error) return <div className="p-8 mt-8 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center shadow-sm"><h3 className="text-lg font-bold">{t('catalog.errorTitle')}</h3><p>{error}</p></div>;
    if (catalogData.length === 0) return <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-200 mt-8"><h3 className="text-lg font-bold text-gray-900">{t('catalog.preparingTitle')}</h3><p className="text-gray-500 mt-2 max-w-md text-center">{t('catalog.preparingDesc')}</p></div>;

    return (
        <div className="py-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold tracking-[-1px] text-gray-900 whitespace-nowrap">{t('catalog.primaryTitle')}</h2>
                <div className="w-full sm:w-2/3 flex flex-col md:flex-row gap-3">
                    <div className="relative w-full">
                        <input type="text" placeholder={t('catalog.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-[#027BFF] focus:border-[#027BFF] transition" />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-white text-[#027BFF] border-2 border-[#027BFF] rounded-full font-semibold text-sm transition-all duration-300 hover:bg-[#027BFF] hover:text-white hover:shadow-lg whitespace-nowrap">{t('catalog.exportPdf')}</button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm cursor-pointer hover:border-gray-400 transition">
                    <option value="fifeOrder">{t('catalog.sortFife')}</option>
                    <option value="entryNumber">{t('catalog.sortNumber')}</option>
                    <option value="name">{t('catalog.sortName')}</option>
                    <option value="breed">{t('catalog.sortBreed')}</option>
                </select>
                <select value={filters.breed} onChange={(e) => handleFilterChange('breed', e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm cursor-pointer">
                    <option value="All">{t('catalog.filterBreed')}</option>
                    {uniqueBreeds.filter(c => c !== 'All').map(breed => <option key={breed} value={breed}>{BREED_NAMES[breed] || breed} ({breed})</option>)}
                </select>
                <select value={filters.sex} onChange={(e) => handleFilterChange('sex', e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm cursor-pointer">
                    <option value="All">{t('catalog.filterSex')}</option>
                    {uniqueSex.filter(s => s !== 'All').map(sex => <option key={sex} value={sex}>{sex}</option>)}
                </select>
                <select value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm cursor-pointer">
                    <option value="All">{t('catalog.filterClass')}</option>
                    {uniqueClasses.filter(c => c !== 'All').map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
            </div>
            <p className="text-gray-600 text-sm mb-6 text-left font-medium">
                {t('catalog.shownCount', { count: totalFilteredCats, total: catalogData.length })}
            </p>
            {totalFilteredCats === 0 && (searchTerm !== '' || filters.breed !== 'All' || filters.sex !== 'All' || filters.class !== 'All') && <div className="p-8 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 font-medium text-center">{t('catalog.noResults')}</div>}
            {sortKey === 'fifeOrder' ? renderHierarchicalList() : renderFlatList()}
            <footer className="mt-10 pt-4 border-t text-center text-gray-500 text-sm">{t('catalog.footerTotal', { count: catalogData.length })}</footer>
        </div>
    );
};

interface JudgeStatus { name: string; sat: number; sun: number; }
interface JudgeReportRow { no: number; ems: string; sex: string; class: number; born: string; AdM: string; AdF: string; NeM: string; NeF: string; '11M': string; '11F': string; '12M': string; '12F': string; results: string; [key: string]: any; }
interface NominationEntry { no: number; breed: string; judge: string; badge: string; }

const judges: JudgeStatus[] = [
    { name: 'Mrs. Eva Porat SE', sat: 100, sun: 100 },
    { name: 'Mrs. Annika Berner SE', sat: 100, sun: 100 },
    { name: 'Mrs. Manuela Centamore IT', sat: 100, sun: 100 },
    { name: 'Mrs. Daria Łukasik-Weber PL', sat: 100, sun: 100 },
    { name: 'Mrs. Anne-Louise Nygaard Sadek DK', sat: 100, sun: 100 },
    { name: 'Mr. Juan José Martinez Vizcaino ES', sat: 100, sun: 100 },
    { name: 'Mr. Kristof Van Roy BE', sat: 100, sun: 100 },
    { name: 'Mrs. Anna Wilczek PL', sat: 100, sun: 0 },
];

const JudgeReportDetail = ({ judgeName, date }: { judgeName: string; date: string }) => {
    const reportData: JudgeReportRow[] = [
        { no: 1, ems: 'EXO n', sex: '1,0', class: 1, born: '2023-05-04', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'PH' },
        { no: 7, ems: 'PER as 24 62', sex: '1,0', class: 12, born: '2025-05-09', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC, NOM' },
    ];
    const columns = [
        { key: 'no', label: 'No.', align: 'center' }, { key: 'ems', label: 'EMS', align: 'left' }, { key: 'sex', label: 'Sex', align: 'center' }, { key: 'class', label: 'Class', align: 'center' }, { key: 'born', label: 'Born', align: 'center' },
        { key: 'AdM', label: 'Ad M', align: 'center', highlight: true }, { key: 'AdF', label: 'Ad F', align: 'center', highlight: true },
        { key: 'NeM', label: 'Ne M', align: 'center', disabled: true }, { key: 'NeF', label: 'Ne F', align: 'center', disabled: true },
        { key: '11M', label: '11 M', align: 'center', highlight: true }, { key: '11F', label: '11 F', align: 'center', highlight: true },
        { key: '12M', label: '12 M', align: 'center' }, { key: '12F', label: '12 F', align: 'center' }, { key: 'results', label: 'Results', align: 'left' },
    ];
    return (
        <div className="p-6">
            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-sm min-w-[1200px]">
                    <thead><tr>{columns.map(col => <th key={col.key} className={`bg-[#027BFF] text-white p-2 font-semibold text-center whitespace-nowrap ${col.disabled ? 'line-through opacity-80' : ''}`}>{col.label}</th>)}</tr></thead>
                    <tbody>{reportData.map((row, index) => <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">{columns.map(col => <td key={col.key} className={`p-2 border border-gray-200 text-${col.align} ${col.highlight ? 'bg-blue-50/70' : 'bg-white'} ${row[col.key] === 'X' ? 'font-bold text-[#027BFF]' : ''}`}>{row[col.key]}</td>)}</tr>)}</tbody>
                </table>
            </div>
            <p className="mt-4 text-gray-500 text-sm text-left">Cats total: {reportData.length}</p>
        </div>
    );
};

const NominationDetailTable = ({ category, date, location = "FP – Poznań" }: { category: string; date: string; location?: string }) => {
    const tableData: { [key: string]: NominationEntry[] } = {
        'Adult Males': [{ no: 38, breed: 'SBI a', judge: 'Mrs. Eva Porat SE', badge: 'BIC' }],
        'Adult Females': [{ no: 14, breed: 'RAG a 03', judge: 'Mrs. Eva Porat SE', badge: 'BIS' }]
    };
    const judgesInTable = ['Mrs. Eva Porat SE', 'Mrs. Annika Berner SE', 'Mrs. Manuela Centamore IT', 'Mrs. Daria Łukasik-Weber PL'];
    return (
        <div className="p-6 pt-10">
            <div className="flex items-center justify-between flex-wrap pb-4 mb-4 border-b border-gray-200"><div className="flex flex-col text-left"><h2 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900">{category}</h2><span className="text-sm text-gray-600 mt-1">{location} — {date}</span></div></div>
            <div className="scroll-container w-full overflow-x-auto pb-4"><table className="w-full border-collapse text-sm min-w-[1200px] shadow-lg rounded-xl overflow-hidden"><thead><tr><th className="bg-gray-100 text-gray-800 p-3 font-bold text-left whitespace-nowrap border-b-2 border-white min-w-[180px]">Class</th>{judgesInTable.map((judge, i) => <th key={i} className="bg-[#027BFF]/90 text-white p-3 font-semibold text-center whitespace-nowrap border-l border-[#027BFF]">{judge.split(' ')[1]} {judge.split(' ')[2]}</th>)}</tr></thead><tbody>{Object.keys(tableData).map((className, i) => <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50 transition duration-150"><th className="bg-gray-50 text-gray-900 p-3 font-bold text-left whitespace-nowrap">{className}</th>{judgesInTable.map((judgeName, j) => { const entry = tableData[className]?.find(e => e.judge === judgeName); return <td key={j} className={`p-2 text-center border-l border-gray-100 ${entry ? 'bg-white' : 'bg-gray-50/50 text-gray-400'}`}>{entry ? <div className="flex flex-col items-center"><span className="entry-number font-bold text-lg text-gray-900">{entry.no}</span><span className="entry-breed text-xs text-gray-600">{entry.breed}</span>{entry.badge && <span className="badge mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-[#027BFF] bg-[#e9f4ff]">{entry.badge}</span>}</div> : <span className="text-gray-400">–</span>}</td> })}</tr>)}</tbody></table></div>
        </div>
    );
};

export default function Catalog() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<"info" | "primary" | "secondary">("info");
    const { showId } = useParams<{ showId: string }>();

    const [quickEntries, setQuickEntries] = useState<QuickCatalogEntry[]>([]);
    const [quickLoading, setQuickLoading] = useState<boolean>(false);
    const [quickError, setQuickError] = useState<string | null>(null);
    const [activeQuickFilter, setActiveQuickFilter] = useState<number | 'ALL'>('ALL');

    const [showInfo, setShowInfo] = useState<PublicShowDetail | null>(null);
    const [infoLoading, setInfoLoading] = useState<boolean>(true);
    const [infoError, setInfoError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [modalJudge, setModalJudge] = useState<string | null>(null);
    const [modalCategory, setModalCategory] = useState<string | null>(null);

    useEffect(() => {
        const loadAllData = async () => {
            const idToFetch = showId || 1;
            setInfoLoading(true);
            setQuickLoading(true);
            try {
                const [infoData, catalogData] = await Promise.all([
                    registrationApi.getShowInfo(idToFetch),
                    registrationApi.getQuickCatalog(idToFetch)
                ]);

                setShowInfo(infoData);
                setQuickEntries(catalogData);
                setInfoError(null);
                setQuickError(null);
            } catch (err) {
                console.error(err);
                setInfoError(t('catalog.errorLoading'));
                setQuickError(t('catalog.errorLoadingQuick'));
            } finally {
                setInfoLoading(false);
                setQuickLoading(false);
            }
        };

        loadAllData();
    }, [showId, t]);

    const filteredQuickEntries = useMemo(() => {
        const filtered = quickEntries.filter(entry => {
            if (activeQuickFilter === 'ALL') return true;
            return entry.category === activeQuickFilter;
        });
        return filtered.sort((a, b) => a.catalogNumber - b.catalogNumber);

    }, [quickEntries, activeQuickFilter]);

    const capacityPercentage = useMemo(() => {
        if (!showInfo || !showInfo.maxCats) return 0;
        const pct = (showInfo.occupiedSpots / showInfo.maxCats) * 100;
        return Math.min(pct, 100);
    }, [showInfo]);

    const openModal = (date: string, judgeName: string | null = null, category: string | null = null) => {
        setModalDate(date); setModalJudge(judgeName); setModalCategory(category); setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setModalDate(null); setModalJudge(null); setModalCategory(null); };

    const QuickFilterButton = ({ label, value }: { label: string, value: number | 'ALL' }) => (
        <button
            onClick={() => setActiveQuickFilter(value)}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold whitespace-nowrap transition 
                ${activeQuickFilter === value
                ? 'bg-[#027BFF] text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            {infoLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#027BFF]"></div>
                    <p className="mt-4 text-gray-500">{t('catalog.loading')}</p>
                </div>
            ) : infoError ? (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
                    <h3 className="font-bold text-lg">{t('catalog.errorTitle')}</h3>
                    <p>{infoError}</p>
                </div>
            ) : showInfo && (
                <>
                    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 border-b border-gray-200">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-2px] text-gray-900 mb-4">{showInfo.name}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 gap-3 text-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center text-[#027BFF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <p className="text-sm font-medium">{formatDate(showInfo.startDate)} – {formatDate(showInfo.endDate)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center text-[#027BFF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </div>
                                <p className="text-sm font-medium">{showInfo.venueName}, {showInfo.venueCity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 mt-8">
                        <div className="flex gap-2 sm:gap-4 md:gap-8 justify-start">
                            <button onClick={() => setTab("info")} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition ${tab === "info" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t('catalog.tabInfo')}</button>
                            <button onClick={() => setTab("primary")} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition ${tab === "primary" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t('catalog.tabPrimary')}</button>
                            <button onClick={() => setTab("secondary")} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition ${tab === "secondary" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t('catalog.tabSecondary')}</button>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 mt-10">
                        {tab === "info" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-10">
                                    <section className="text-left">
                                        <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">{t('catalog.infoTitle')}</h2>
                                        <div className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">{showInfo.description}</div>
                                    </section>
                                    <section>
                                        <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-4">{t('catalog.schedule')}</h2>
                                        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            {showInfo.vetCheckStart && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.vetCheckStart)}</div>
                                                    <p className="text-gray-800 font-medium">{t('catalog.vetCheck')}</p>
                                                </div>
                                            )}
                                            {showInfo.judgingStart && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.judgingStart)}</div>
                                                    <p className="text-gray-800 font-medium">{t('catalog.judgingStart')}</p>
                                                </div>
                                            )}
                                            {showInfo.judgingEnd && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.judgingEnd)}</div>
                                                    <p className="text-gray-800 font-medium">{t('catalog.showOpen')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                                <aside className="space-y-8">
                                    <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#027BFF] to-[#005fcc] text-white">
                                        <h3 className="text-lg font-semibold mb-3">{t('catalog.registrationStatus')}</h3>
                                        <p className="text-3xl font-bold tracking-[-1px] mb-2">{showInfo.occupiedSpots} / {showInfo.maxCats}</p>
                                        <div className="w-full h-3 bg-black/20 rounded-full mb-3 overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${capacityPercentage > 90 ? 'bg-red-400' : 'bg-white'}`} style={{ width: `${capacityPercentage}%` }}></div>
                                        </div>
                                        <p className="text-sm text-white/90 mb-5">{showInfo.occupiedSpots >= showInfo.maxCats ? t('catalog.capacityFull') : t('catalog.spotsFilling')}</p>
                                        {showInfo.occupiedSpots < showInfo.maxCats ? (
                                            <Link to="/apply" className="block w-full text-center py-2.5 bg-white text-[#027BFF] tracking-[-1px] font-semibold rounded-full border-2 border-white hover:bg-transparent hover:text-white transition-all">{t('catalog.registerBtn')}</Link>
                                        ) : (
                                            <button disabled className="block w-full text-center py-2.5 bg-gray-400 text-white font-semibold rounded-full cursor-not-allowed opacity-80">{t('catalog.registrationClosed')}</button>
                                        )}
                                    </div>
                                    <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center text-[#027BFF]">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 21a7.5 7.5 0 00-15 0" /></svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 tracking-[-1px]">{t('catalog.organizerTitle')}</h3>
                                        </div>
                                        <p className="font-semibold text-gray-800 mb-1 text-left">{showInfo.organizerName}</p>
                                        {showInfo.organizerWebsiteUrl && (
                                            <a href={showInfo.organizerWebsiteUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline text-left block mb-2">{showInfo.organizerWebsiteUrl}</a>
                                        )}
                                        <Link to="/apply" className="block w-full text-center py-2.5 mt-2 bg-white text-[#027BFF] font-semibold rounded-full border-2 border-[#027BFF] tracking-[-1px] hover:bg-[#027BFF] hover:text-white transition-all duration-300">{t('catalog.contactBtn')}</Link>
                                    </div>
                                </aside>
                            </div>
                        )}

                        {tab === "primary" && <PrimaryCatalogueContent showId={showId || 1} />}

                        {tab === "secondary" && (
                            <div className="py-10 space-y-8">
                                <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-left"><h2 className="text-xl font-semibold text-gray-900">Cat Show: FP – Poznań</h2><p className="text-sm text-gray-500">{t('catalog.dateAndPlace') || 'Date: 2025–11–15 & 2025–11–16'}</p></div>
                                    <div className="text-sm text-gray-700 text-left sm:text-right"><p className="font-semibold">{t('catalog.judgesAndColours')}</p><div className="flex flex-wrap gap-3 mt-1 sm:justify-end"><a href="#" onClick={(e) => { e.preventDefault(); openModal("2025–11–15", null); }} className="text-[#027BFF] font-semibold hover:underline">[2025–11–15]</a><a href="#" onClick={(e) => { e.preventDefault(); openModal("2025–11–16", null); }} className="text-[#027BFF] font-semibold hover:underline">[2025–11–16]</a></div></div>
                                </section>

                                <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
                                    <h3 className="text-lg sm:text-xl font-semibold tracking-[-1px] text-gray-900 mb-4">{t('catalog.judgesReports')}</h3>
                                    <div className="divide-y divide-gray-200">{judges.map((j, idx) => (<div key={idx} className="py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="md:w-1/3 font-medium text-gray-900 text-left">{j.name}</div><div className="md:w-1/3 flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{j.sat}%</span><div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"><div className="h-full bg-[#027BFF]" style={{ width: `${j.sat}%` }} /></div><a href="#" onClick={(e) => { e.preventDefault(); openModal("2025-11-15", j.name); }} className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap">[2025–11–15]</a></div><div className="md:w-1/3 flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{j.sun}%</span><div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"><div className={`h-full ${j.sun === 0 ? 'bg-gray-300' : 'bg-[#027BFF]'}`} style={{ width: `${j.sun}%` }} /></div><a href="#" onClick={(e) => { e.preventDefault(); openModal("2025-11-16", j.name); }} className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap">[2025–11–16]</a></div></div>))}</div>
                                </section>

                                <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">{t('catalog.nominations')}</h3>
                                    <div className="space-y-4 text-sm sm:text-base"><div><div className="text-[#027BFF] font-bold mb-1 text-left">2025–11–15</div><div className="flex flex-wrap gap-x-4 gap-y-2">{['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM', 'NFO'].map((cat, i) => (<a key={i} href="#" onClick={(e) => { e.preventDefault(); openModal('2025–11–15', null, cat); }} className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF]">[{cat}]</a>))}</div></div><div><div className="text-[#027BFF] font-bold mb-1 text-left">2025–11–16</div><div className="flex flex-wrap gap-x-4 gap-y-2">{['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM'].map((cat, i) => (<a key={i} href="#" onClick={(e) => { e.preventDefault(); openModal('2025–11–16', null, cat); }} className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF]">[{cat}]</a>))}</div></div></div>
                                </section>

                                <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">{t('catalog.quickCatalogTitle')}</h3>
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                        <QuickFilterButton label="[ALL]" value="ALL" />
                                        <QuickFilterButton label="[cat 1]" value={1} />
                                        <QuickFilterButton label="[cat 2]" value={2} />
                                        <QuickFilterButton label="[cat 3]" value={3} />
                                        <QuickFilterButton label="[cat 4]" value={4} />
                                        <QuickFilterButton label="[DOM]" value={5} />
                                    </div>
                                    {quickLoading ? (
                                        <div className="text-center py-8 text-gray-500">{t('catalog.loadingQuick')}</div>
                                    ) : quickError ? (
                                        <div className="text-center py-8 text-red-500">{quickError}</div>
                                    ) : filteredQuickEntries.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 italic">{t('catalog.noQuickResults')}</div>
                                    ) : (
                                        <>
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full border-collapse text-sm">
                                                    <thead>
                                                    <tr className="bg-[#027BFF] text-white">
                                                        <th className="p-2 text-left">No.</th>
                                                        <th className="p-2 text-left">EMS</th>
                                                        <th className="p-2 text-left">{t('catForm.catName')}</th>
                                                        <th className="p-2 text-center">{t('catForm.gender')}</th>
                                                        <th className="p-2 text-left">{t('catForm.showClass')}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {filteredQuickEntries.map((row) => (
                                                        <tr key={row.catalogNumber} className="border-b hover:bg-gray-50">
                                                            <td className="p-2 font-bold">{row.catalogNumber}</td>
                                                            <td className="p-2 font-semibold text-blue-600">{row.emsCode}</td>
                                                            <td className="p-2 font-medium">{row.catName}</td>
                                                            <td className="p-2 text-center">{row.gender === 'MALE' ? '1,0' : '0,1'}</td>
                                                            <td className="p-2">{row.showClass.replace(/_/g, ' ')}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="md:hidden flex flex-col gap-4">
                                                {filteredQuickEntries.map((row) => (
                                                    <div key={row.catalogNumber} className="border rounded-xl shadow-sm p-4 bg-white">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-lg text-[#027BFF]">#{row.catalogNumber}</span>
                                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{row.emsCode}</span>
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900 mb-1 text-left">{row.catName}</h4>
                                                        <div className="text-sm text-gray-500 flex gap-4 text-left">
                                                            <span>Sex: {row.gender === 'MALE' ? '1,0' : '0,1'}</span>
                                                            <span>Class: {row.showClass.replace(/_/g, ' ')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {isModalOpen && modalDate && (
                <div className="fixed inset-0 z-50 flex justify-center p-4 pt-32">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-7xl max-h-[75vh] overflow-y-auto">
                        <button onClick={closeModal} className="absolute top-4 right-4 z-20 transition-all duration-200 bg-white text-[#027BFF] border-2 border-[#027BFF] hover:bg-[#027BFF] hover:text-white hover:shadow-lg w-8 h-8 p-1 rounded-full flex items-center justify-center sm:w-auto sm:h-auto sm:px-4 sm:py-2"><span className="sm:hidden">X</span><span className="hidden sm:inline font-semibold">{t('catalog.close')}</span></button>
                        {modalJudge ? (
                            <div className="p-6"><h2 className="text-xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6 text-left">{modalJudge} — {modalDate} — Category 1</h2><JudgeReportDetail judgeName={modalJudge} date={modalDate} /></div>
                        ) : modalCategory ? (
                            <NominationDetailTable category={modalCategory} date={modalDate} />
                        ) : (
                            <div className="p-6 pt-10"><h2 className="text-xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6 text-left">{t('catalog.judgeAssignment')} — {modalDate}</h2><p>Zde by byla tabulka přidělení (statický mock)...</p></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}