import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Předpokládáme, že je dostupné

// MOCK DATA: BREEDS (pro zobrazení plného jména plemene v katalogu)
const BREED_NAMES = {
    EXO: 'Exotic Shorthair',
    PER: 'Persian',
    RAG: 'Ragdoll',
    SBI: 'Birman (Sacred Birman)',
    MCO: 'Maine Coon',
    ACL: 'American Curl Longhair',
};

// Mapování FIFE kategorií (zjednodušené pro mock data)
const FIFE_CATEGORIES = {
    // Kategorie 1: PER, EXO
    'EXO': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    'PER': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    // Kategorie 2: RAG, SBI, MCO, ACL
    'RAG': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'SBI': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'MCO': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'ACL': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
};

// Unikátní hodnoty pro filtry (ručně doplněné pro mock data)
const UNIQUE_CATEGORIES = ['All', 'EXO', 'PER', 'RAG', 'SBI', 'MCO', 'ACL'];
const UNIQUE_SEX = ['All', '1,0 M', '0,1 F'];
const UNIQUE_CLASSES = ['All', 'Class 1 males', 'Class 1 females', 'Class 2 males', 'Class 2 females', 'Class 3 males', 'Class 5 males', 'Class 8 males', 'Class 9 males', 'Class 12 males'];


// --- 1. DATové STRUKTURY PRO PRIMÁRNÍ KATALOG ---
interface CatDetail {
    entryNumber: number;
    name: string;
    ems: string;
    sex: string;
    dob: string;
    regNumber: string;
    sire: string;
    dam: string;
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

// --- 2. ZKRÁCENÁ MOCK DATA (pro Primární katalog) ---
const rawCatData: CatEntry[] = [
    // EXO (4 záznamy)
    { cat: { entryNumber: 1, name: 'CH JR RO*CAT MAN FELIX ROCKY BALBOA', ems: 'EXO d', sex: '1,0 M', dob: '2024-08-02', regNumber: 'RO FNFR LO 240826', sire: 'NW 22,24 SC RO*CAT MAN FELIX EROS RAMAZZOTTI EXO d 03 22', dam: 'NW 22,23 IC RO*CAT MAN FELIX ODETTE EXO fs', owner: 'Stanescu Hortensia', breeder: 'Hortensia Stanescu', breederCountry: 'RO' }, category: 'EXO', colour: 'EXO d', class: 'Class 9 males', group: 1 },
    { cat: { entryNumber: 5, name: 'SC BR* DARUMA CHEWIE, DSM', ems: 'EXO n 22', sex: '0,1 F', dob: '2021-01-14', regNumber: '(BR) FFB LO-052904', sire: 'WW´19, NW, AR* FOLIE ROUGE PIROPO, JW EXO n 03 22', dam: 'BR* DARUMA ATAKA EXO n 03', owner: 'Martins Dos Santos Alexsandro', breeder: 'Alexsandro Martins Dos Santos', breederCountry: 'BR' }, category: 'EXO', colour: 'EXO n 22', class: 'Class 1 females', group: 1 },
    { cat: { entryNumber: 10, name: 'NW`23`24 GIC RO*JET STONE MITCHELL', ems: 'EXO d 24', sex: '1,0 M', dob: '2018-10-10', regNumber: 'RO FNFR LO 190836', sire: 'JET STONE TATTOO EXO n 22', dam: 'JET STONE ODRY ROSE EXO f 24', owner: 'Stanescu Hortensia', breeder: 'Hortensia Stanescu', breederCountry: 'RO' }, category: 'EXO', colour: 'EXO d 24', class: 'Class 3 males', group: 1 },
    { cat: { entryNumber: 14, name: 'NW`22`24 SC RO*CAT MAN FELIX EROS RAMAZZOTTI', ems: 'EXO d 03 22', sex: '1,0 M', dob: '2015-08-12', regNumber: 'RO FNFR LO160065', sire: 'CH BOYARS TOSHICO EXO n 22', dam: 'BUBA OF NACHTIGALL PER f 03', owner: 'Stanescu Hortensia', breeder: 'Hortensia Stanescu', breederCountry: 'RO' }, category: 'EXO', colour: 'EXO d 03 22', class: 'Class 1 males', group: 1 },

    // PER (4 záznamy)
    { cat: { entryNumber: 17, name: 'SC PT* WHITE `R` US SWEET DREAMS JW DVM DSM', ems: 'PER w 62', sex: '1,0 M', dob: '2021-05-03', regNumber: '(ES) ASFE LO 65227', sire: 'MW´18 NW´17 NW´18 SC DIAPASON SIMBA OF WHITE `R´US DSM PER e', dam: 'NSW19 NW20, NW19 SC WHITE `R´US BETTY BOOP DSM PER w 61', owner: 'Dias José', breeder: 'White ´r´us', breederCountry: 'PT' }, category: 'PER', colour: 'PER w 62', class: 'Class 1 males', group: 1 },
    { cat: { entryNumber: 25, name: 'SC PT* WHITE `R` US IZON JUNIOR JW DSM', ems: 'PER d', sex: '1,0 M', dob: '2018-09-12', regNumber: '(ES) ASFE LO 65226', sire: 'MW´18 NW´17 NW´18 SC DIAPASON SIMBA OF WHITE `R´US DSM PER e', dam: 'SC WHITE `R´US FINALLY DSM PER f', owner: 'Dias José', breeder: 'White ´r´us', breederCountry: 'PT' }, category: 'PER', colour: 'PER d', class: 'Class 1 males', group: 1 },
    { cat: { entryNumber: 33, name: 'IC GR*HÈRMES PAWS ALMA', ems: 'PER n 22', sex: '1,0 M', dob: '2021-06-23', regNumber: 'GG FGR LO 203100', sire: 'CH IT*YANKEE DEL FALCO D\'ORO EXO n 22', dam: 'GICH IT*DESIDERIA DEL FALCO D\'ORO PER f', owner: 'Alevras Alexandros Ioannis', breeder: 'Alexandros Ioannis Alevras', breederCountry: 'GR' }, category: 'PER', colour: 'PER n 22', class: 'Class 5 males', group: 1 },
    { cat: { entryNumber: 43, name: 'NSW`25 CEW`24 NW`23 SP REMU-MARTIN`S BIG BOSS, DSM', ems: 'PER e 03', sex: '1,0 M', dob: '2019-03-14', regNumber: '(CZ) CSCH LO 12/22/PER', sire: 'REMU-MARTIN\'S CHARM LOOK PER a 03 23', dam: 'BEAUBELL MUJI OF REMU-MARTIN PER e 22', owner: 'Zalicha Ladislav', breeder: 'Jana Frouzova', breederCountry: 'CZ' }, category: 'PER', colour: 'PER e 03', class: 'Class 2 males', group: 1 },

    // RAG (4 záznamy)
    { cat: { entryNumber: 52, name: 'IC KCH JCH CH INDIANA JONES HAPAZU *SK', ems: 'RAG n 03', sex: '1,0 M', dob: '2023-08-29', regNumber: '(HR)SFDH LO 8535/1', sire: 'EDVARD HA-PA-ZU*SK JW RAG n 03', dam: 'NW\'22 CH IT *OF VILLA DESIRE GINEVRA RAG f 04', owner: 'Hajder Selma', breeder: 'Selma Hajder', breederCountry: '--' }, category: 'RAG', colour: 'RAG n 03', class: 'Class 5 males', group: 2 },
    { cat: { entryNumber: 59, name: 'SC GIP DK*SEIERØ`S HIGH VOLTAGE,DSM, DVM', ems: 'RAG a 03', sex: '0,1 F', dob: '2019-06-28', regNumber: 'IT ANFI LO 2020/395', sire: 'SE*LIL\'MAGICS LONELY TOGETHER RAG a 04', dam: 'CH.DK*SEIERØ\'S MAGIC MOMENT,JW RAG a 03', owner: 'Gori Giulia', breeder: 'Dorthe Seierø Eltong', breederCountry: 'DK' }, category: 'RAG', colour: 'RAG a 03', class: 'Class 2 females', group: 2 },
    { cat: { entryNumber: 73, name: 'HOT SHOT JB CRYSTAL JEWELS * CZ', ems: 'RAG a 03', sex: '1,0 M', dob: '2025-03-27', regNumber: '(CZ)ČSCH LO 391/25/RAG', sire: 'JCH,KCH,CH,SE*LIL’MAGICS HIT THE ROAD JACK, JW RAG a 03', dam: 'CH,JCH,CEW’24 BLUE CRYSTAL JEWELS *CZ, JW RAG a 03', owner: 'Karšay Ladislav', breeder: 'Ladislav Karšay, Bsc.', breederCountry: 'CZ' }, category: 'RAG', colour: 'RAG a 03', class: 'Class 12 males', group: 2 },
    { cat: { entryNumber: 84, name: 'NW23 SC BRIANNA HA-PA-ZU*SK JW DSM DVM', ems: 'RAG n 03 21', sex: '0,1 F', dob: '2021-12-11', regNumber: 'HU FH LO 13237', sire: 'CHASE AZURE EYES*PL RAG a 03', dam: 'KIARA ROYAL SECRET*PL RAG n 03 21', owner: 'Kocman Jan', breeder: 'Zuzana Molnárová', breederCountry: 'SK' }, category: 'RAG', colour: 'RAG n 03 21', class: 'Class 1 females', group: 2 },

    // SBI (2 záznamy)
    { cat: { entryNumber: 96, name: 'PR ACHTUNG BABY NOVEMBER RAIN', ems: 'SBI n', sex: '1,0 M', dob: '2022-04-29', regNumber: 'O028051', sire: 'CLOUD\'S FLOWERS FALCOR SBI b', dam: 'ACHTUNG BABY LICENCE TO KILL SBI n', owner: 'Bombardi Silvia Francesca', breeder: 'Silvia Francesca Bombardi', breederCountry: 'PT' }, category: 'SBI', colour: 'SBI n', class: 'Class 8 males', group: 2 },
    { cat: { entryNumber: 101, name: 'CEW`25 IC JCH KCH SOULOFDIAMONDS INVICTUS JW', ems: 'SBI a', sex: '1,0 M', dob: '2024-03-15', regNumber: '(PL)FPL LO 308278', sire: 'SOULOFDIAMONDS SIR LANCELOT SBI a', dam: 'DK*FAMILY\'S TEODORA SBI a', owner: 'Wolny Maja', breeder: 'Sylwia Schindel', breederCountry: 'DE' }, category: 'SBI', colour: 'SBI a', class: 'Class 5 males', group: 2 },

    // Ostatní (2 záznamy)
    { cat: { entryNumber: 107, name: 'SC JCH KCH MUHTESEM ORIGINAL SIN', ems: 'MCO a', sex: '1,0 M', dob: '2023-08-18', regNumber: '(RO)FNFR LO 240023', sire: 'GIC LEON SHAMMUAR MCO ns', dam: 'LADUSHKA AKELLALEADER MCO ns 03 22', owner: 'Crisan Vasilescu Corina Eugenia', breeder: 'Liudmila Turan', breederCountry: '--' }, category: 'MCO', colour: 'MCO a', class: 'Class 1 males', group: 2 },
    { cat: { entryNumber: 106, name: 'FI*SIRIUKSEN ÄGIRCURL', ems: 'ACL d 03 24', sex: '1,0 M', dob: '2025-05-08', regNumber: 'FI SK LO 2549320', sire: 'IC, JCH, CFA GP SIRIUKSEN VESPERCURL ACL n 23', dam: 'CH, JCH, KCH SIRIUKSEN YUKICURL ACL d 03 24', owner: 'Hämäläinen Satu', breeder: 'Satu Hämäläinen', breederCountry: 'FI' }, category: 'ACL', colour: 'ACL d 03 24', class: 'Class 12 males', group: 2 },
];

// --- 3. LOGIKA ŘAZENÍ A FILTROVÁNÍ PRO PRIMÁRNÍ KATALOG ---

// Pomocná funkce pro extrakci čísla třídy pro řazení
const getClassSortOrder = (className: string): number => {
    const match = className.match(/Class (\d+)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 99; // Neznámá třída
};

// Hlavní hook pro řazení a seskupení dat (Category -> Colour -> Class)
const useSortedCatalogData = (cats: CatEntry[], searchTerm: string, filters: { breed: string, sex: string, class: string }, sortKey: string) => {
    return useMemo(() => {
        // 1. Filtering (Text Search + Dropdown Filters)
        const lowerCaseSearch = searchTerm.toLowerCase();

        let filteredCats = cats.filter(entry =>
            (searchTerm === '' || entry.cat.name.toLowerCase().includes(lowerCaseSearch) ||
                entry.cat.ems.toLowerCase().includes(lowerCaseSearch) ||
                entry.cat.regNumber.toLowerCase().includes(lowerCaseSearch)) &&
            (filters.breed === 'All' || entry.category === filters.breed) &&
            (filters.sex === 'All' || entry.cat.sex === filters.sex) &&
            (filters.class === 'All' || entry.class === filters.class)
        );

        // 2. Sorting
        filteredCats.sort((a, b) => {
            switch (sortKey) {
                case 'entryNumber':
                    return a.cat.entryNumber - b.cat.entryNumber;
                case 'name':
                    return a.cat.name.localeCompare(b.cat.name);
                case 'breed':
                    return a.category.localeCompare(b.category) || a.colour.localeCompare(b.colour);
                default:
                    // Defaultní třídění dle FIFE kategorie (pak plemeno, pak barva, pak třída, pak katalogové číslo)
                    const fifeA = FIFE_CATEGORIES[a.category as keyof typeof FIFE_CATEGORIES]?.index || 99;
                    const fifeB = FIFE_CATEGORIES[b.category as keyof typeof FIFE_CATEGORIES]?.index || 99;

                    if (fifeA !== fifeB) return fifeA - fifeB;
                    if (a.category !== b.category) return a.category.localeCompare(b.category);
                    if (a.colour !== b.colour) return a.colour.localeCompare(b.colour);
                    if (a.class !== b.class) return getClassSortOrder(a.class) - getClassSortOrder(b.class);
                    return a.cat.entryNumber - b.cat.entryNumber;
            }
        });

        // 3. Grouping (pro zobrazení hierarchie)
        const grouped = new Map<number, Map<string, Map<string, CatEntry[]>>>();

        filteredCats.forEach(entry => {
            const fifeCat = FIFE_CATEGORIES[entry.category as keyof typeof FIFE_CATEGORIES];
            const primaryKey = fifeCat ? fifeCat.index : 99;

            if (!grouped.has(primaryKey)) {
                grouped.set(primaryKey, new Map());
            }
            const byCategory = grouped.get(primaryKey)!;

            if (!byCategory.has(entry.category)) {
                byCategory.set(entry.category, new Map());
            }
            const byBreed = byCategory.get(entry.category)!;

            if (!byBreed.has(entry.colour)) {
                byBreed.set(entry.colour, new Map());
            }
            const byColour = byBreed.get(entry.colour)!;

            if (!byColour.has(entry.class)) {
                byColour.set(entry.class, []);
            }
            byColour.get(entry.class)!.push(entry);
        });

        // Final sorting (pokud byl použit jiný sortKey, data jsou již seřazena, ale musíme seřadit i vnitřní struktury)
        const sortedCategories = Array.from(grouped.entries())
            .sort(([indexA], [indexB]) => indexA - indexB)
            .map(([categoryIndex, byBreed]) => {
                const sortedBreeds = Array.from(byBreed.entries())
                    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                    .map(([breedName, byColour]) => {
                        const sortedColours = Array.from(byColour.entries())
                            .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                            .map(([colourName, byClass]) => {
                                const sortedClasses = Array.from(byClass.entries())
                                    .sort(([nameA], [nameB]) => getClassSortOrder(nameA) - getClassSortOrder(nameB))
                                    .map(([className, entries]) => {
                                        // Vnitřní třídění už není potřeba, jelikož se data třídí globálně nahoře
                                        return [className, entries] as [string, CatEntry[]];
                                    });
                                return [colourName, new Map(sortedClasses)] as [string, Map<string, CatEntry[]>]
                            });
                        return [breedName, new Map(sortedColours)] as [string, Map<string, Map<string, CatEntry[]>>]
                    });
                return [categoryIndex, new Map(sortedBreeds)] as [number, Map<string, Map<string, Map<string, CatEntry[]>>>]
            });


        return new Map(sortedCategories);
    }, [cats, searchTerm, filters, sortKey]);
};

// --- 4. KOMPONENTY PRO PRIMÁRNÍ KATALOG (s modrým designem) ---

const PrimaryCatalogueContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ breed: 'All', sex: 'All', class: 'All' });
    const [sortKey, setSortKey] = useState('fifeOrder'); // Defaultní řazení dle FIFE hierarchie

    // Načtení dat se zohledněním filtrů a třídění
    const sortedData = useSortedCatalogData(rawCatData, searchTerm, filters, sortKey);

    // Získání celkového počtu po filtrování
    const totalFilteredCats = Array.from(sortedData.values()).flatMap(byBreed =>
        Array.from(byBreed.values()).flatMap(byColour =>
            Array.from(byColour.values()).flatMap(byClass =>
                Array.from(byClass.values()).flat()
            )
        )
    ).length;

    // Změna filtru
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Renderování detailů jedné kočky
    const renderCatDetails = (entry: CatEntry) => (
        <div className="text-sm space-y-1 mt-2 text-gray-700">
            <div className="flex flex-wrap gap-x-4">
                <span className="font-black text-[#027BFF] tracking-tight">
                    {entry.cat.name}
                </span>
                <span className="font-medium text-gray-500 text-xs mt-0.5">
                    (Reg. No.: {entry.cat.regNumber})
                </span>
            </div>

            <div className="flex flex-wrap gap-x-4 text-xs sm:text-sm">
                <span className="font-medium">
                    <strong className="text-gray-900">EMS:</strong> {entry.cat.ems}
                </span>
                <span className="font-medium">
                    <strong className="text-gray-900">Sex:</strong> {entry.cat.sex}
                </span>
                <span className="font-medium">
                    <strong className="text-gray-900">DOB:</strong> {entry.cat.dob}
                </span>
            </div>

            <div className="pl-4 text-xs space-y-0.5 mt-2">
                <p className="text-gray-600"><strong className="text-gray-900">Sire:</strong> {entry.cat.sire}</p>
                <p className="text-gray-600"><strong className="text-gray-900">Dam:</strong> {entry.cat.dam}</p>
                <p className="text-gray-600"><strong className="text-gray-900">Owner:</strong> {entry.cat.owner} (<strong className="text-gray-900">Breeder:</strong> {entry.cat.breeder}, {entry.cat.breederCountry})</p>
            </div>
        </div>
    );

    // Renderování jedné třídy
    const renderClass = (className: string, entries: CatEntry[], breedName: string) => (
        // Odstraněna horní čára a ponechán pouze silnější nadpis třídy
        <div key={`${breedName}-${className}`} className="mt-4 pt-0">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
                {className}
            </h3>
            <ul className="list-none space-y-4">
                {entries.map(entry => (
                    <li key={entry.cat.entryNumber} className="p-3 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between flex-wrap">
                            <h4 className="text-base font-bold text-gray-900 flex items-baseline">
                                <span className="text-xl text-[#027BFF] mr-2">{entry.cat.entryNumber}.</span>

                                <span className="ml-0 text-sm sm:text-base font-bold">
                                    {/* Název plemene a barvy */}
                                    {BREED_NAMES[entry.category as keyof typeof BREED_NAMES] || entry.category}
                                    <span className="text-gray-600 font-normal ml-1">({entry.colour})</span>
                                </span>
                            </h4>
                            <div className="text-xs font-medium text-white bg-[#005fcc] px-2 py-0.5 rounded-full mt-1 sm:mt-0">
                                Skupina: {entry.group ?? 'N/A'}
                            </div>
                        </div>
                        {renderCatDetails(entry)}
                    </li>
                ))}
            </ul>
        </div>
    );

    // Renderování jedné barvy
    const renderColour = (colourName: string, byClass: Map<string, CatEntry[]>, breedName: string) => (
        <div key={`${breedName}-${colourName}`} className="mt-6 p-4 bg-blue-50/70 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold text-[#027BFF] border-b-2 border-[#027BFF] pb-3 mb-4">
                Barva EMS: {colourName}
            </h2>
            {Array.from(byClass.entries()).map(([className, entries]) =>
                renderClass(className, entries, breedName)
            )}
        </div>
    );

    // Renderování jednoho plemene
    const renderBreed = (breedName: string, byColour: Map<string, Map<string, CatEntry[]>>) => (
        <div key={breedName} className="mt-10 p-6 bg-white rounded-xl shadow-lg border-t-4 border-gray-300">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                Plemeno: {BREED_NAMES[breedName as keyof typeof BREED_NAMES] || breedName} <span className="text-[#027BFF]">({breedName})</span>
            </h1>
            {Array.from(byColour.entries()).map(([colourName, byClass]) =>
                renderColour(colourName, byClass, breedName)
            )}
        </div>
    );

    // Renderování jedné FIFE kategorie
    const renderCategory = (categoryIndex: number, byBreed: Map<string, Map<string, Map<string, CatEntry[]>>>) => {
        const categoryInfo = categoryIndex === 1 ? 'Long and Semi-longhaired cats (I.)' :
            categoryIndex === 2 ? 'Semi-longhaired cats (II.)' : 'Ostatní';

        return (
            <div key={categoryIndex} className="mt-12 p-6 bg-white rounded-xl shadow-2xl border-t-8 border-[#027BFF]">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b-2 border-gray-300 pb-4 mb-6">
                    KATEGORIE {categoryIndex}: {categoryInfo}
                </h1>
                {Array.from(byBreed.entries()).map(([breedName, byColour]) =>
                    renderBreed(breedName, byColour)
                )}
            </div>
        );
    };

    // Zobrazení katalogu (buď hierarchicky nebo zploštěle, pokud se třídí jinak než FIFE)
    const renderContent = () => {
        if (sortKey !== 'fifeOrder') {
            // Zobrazit jako jeden seznam, pokud se třídí dle Jména, Čísla nebo Plemena
            const flatList = Array.from(sortedData.values()).flatMap(byBreed =>
                Array.from(byBreed.values()).flatMap(byColour =>
                    Array.from(byColour.values()).flatMap(byClass =>
                        Array.from(byClass.values()).flat()
                    )
                )
            );

            return (
                <div className="p-6 bg-white rounded-xl shadow-2xl border-t-8 border-[#027BFF]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b-2 border-gray-300 pb-4 mb-6">
                        Seznam koček (Seřazeno dle {sortKey === 'entryNumber' ? 'Katalogového čísla' : sortKey === 'name' ? 'Jména' : 'Plemena'})
                    </h1>
                    <ul className="list-none space-y-4 mt-6">
                        {flatList.map(entry => (
                            <li key={entry.cat.entryNumber} className="p-3 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between flex-wrap">
                                    <h4 className="text-base font-bold text-gray-900 flex items-baseline">
                                        <span className="text-xl text-[#027BFF] mr-2">{entry.cat.entryNumber}.</span>
                                        <span className="ml-0 text-sm sm:text-base font-bold">
                                            {entry.cat.name}
                                            <span className="text-gray-600 font-normal ml-2">
                                                ({BREED_NAMES[entry.category as keyof typeof BREED_NAMES] || entry.category} - {entry.colour})
                                            </span>
                                        </span>
                                    </h4>
                                    <div className="text-xs font-medium text-white bg-[#005fcc] px-2 py-0.5 rounded-full mt-1 sm:mt-0">
                                        {entry.class}
                                    </div>
                                </div>
                                {renderCatDetails(entry)}
                            </li>
                        ))}
                    </ul>
                </div>
            );

        } else {
            // Zobrazení dle FIFE hierarchie
            return (
                <div className="space-y-12">
                    {Array.from(sortedData.entries()).map(([categoryIndex, byBreed]) =>
                        renderCategory(categoryIndex, byBreed)
                    )}
                </div>
            );
        }
    }


    return (
        <div className="py-10">

            {/* HLAVNÍ HLAVIČKA A VYHLEDÁVÁNÍ */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold tracking-[-1px] text-gray-900 whitespace-nowrap">
                    Primární Katalog
                </h2>

                <div className="w-full sm:w-2/3 flex flex-col md:flex-row gap-3">
                    {/* VYHLEDÁVÁNÍ */}
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Hledat (Jméno, EMS, Reg. No.)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-[#027BFF] focus:border-[#027BFF] transition"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    {/* TLAČÍTKO EXPORT */}
                    <button className="w-full sm:w-auto px-4 py-2 bg-white text-[#027BFF] border-2 border-[#027BFF] rounded-full font-semibold text-sm transition-all duration-300 hover:bg-[#027BFF] hover:text-white hover:shadow-lg whitespace-nowrap">
                        Export katalogu (PDF)
                    </button>
                </div>
            </div>

            {/* FILTRY A TŘÍDĚNÍ */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Třídění */}
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm"
                    >
                        <option value="fifeOrder">Třídit dle: FIFE Hierarchie (Výchozí)</option>
                        <option value="entryNumber">Třídit dle: Katalogové číslo</option>
                        <option value="name">Třídit dle: Jméno kočky</option>
                        <option value="breed">Třídit dle: Plemeno / EMS</option>
                    </select>

                    {/* Filtr Kategorie/Plemeno */}
                    <select
                        value={filters.breed}
                        onChange={(e) => handleFilterChange('breed', e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm"
                    >
                        <option value="All">Filtr Plemeno: Vše</option>
                        {UNIQUE_CATEGORIES.filter(c => c !== 'All').map(breed => (
                            <option key={breed} value={breed}>
                                {BREED_NAMES[breed as keyof typeof BREED_NAMES] || breed} ({breed})
                            </option>
                        ))}
                    </select>

                    {/* Filtr Pohlaví */}
                    <select
                        value={filters.sex}
                        onChange={(e) => handleFilterChange('sex', e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm"
                    >
                        <option value="All">Filtr Pohlaví: Vše</option>
                        {UNIQUE_SEX.filter(s => s !== 'All').map(sex => (
                            <option key={sex} value={sex}>{sex}</option>
                        ))}
                    </select>

                    {/* Filtr Třída */}
                    <select
                        value={filters.class}
                        onChange={(e) => handleFilterChange('class', e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-[#027BFF] focus:border-[#027BFF] text-sm"
                    >
                        <option value="All">Filtr Třída: Vše</option>
                        {UNIQUE_CLASSES.filter(c => c !== 'All').map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* VÝSLEDKY VYHLEDÁVÁNÍ */}
            <p className="text-gray-600 text-sm mb-6 text-left">
                Zobrazeno {totalFilteredCats} koček z {rawCatData.length} celkem.
            </p>

            {totalFilteredCats === 0 && (searchTerm !== '' || filters.breed !== 'All' || filters.sex !== 'All' || filters.class !== 'All') && (
                <div className="p-8 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 font-medium">
                    Nenalezeny žádné záznamy odpovídající zadaným kritériím.
                </div>
            )}

            {/* SEŘAZENÝ OBSAH KATALOGU */}
            {renderContent()}

            <footer className="mt-10 pt-4 border-t text-center text-gray-500 text-sm">
                Celkový počet záznamů v katalogu: {rawCatData.length}
            </footer>
        </div>
    );
};


// --- PŮVODNÍ STRUKTURY PRO SEKUNDÁRNÍ KATALOG A MODAL ---

interface JudgeStatus {
    name: string;
    sat: number;
    sun: number;
}

interface CatalogueEntry {
    no: string;
    cat: string;
    sex: string;
    emsSat: string;
    classSat: string;
    resultSat: string;
    judgeSat: string;
    emsSun: string;
    classSun: string;
    resultSun: string;
    judgeSun: string;
    group: string;
}

interface JudgeReportRow {
    no: number;
    ems: string;
    sex: string;
    class: number;
    born: string;
    AdM: string;
    AdF: string;
    NeM: string;
    NeF: string;
    '11M': string;
    '11F': string;
    '12M': string;
    '12F': string;
    results: string;
    [key: string]: any;
}

interface NominationEntry {
    no: number;
    breed: string;
    judge: string;
    badge: string;
}

// data pro Judges' reports
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

// data pro Quick Catalogue
const catalogueData: any[] = [
    { no: '1', cat: 'NW24 SC JCH SAN-FE ALEX JW', sex: '1,0', emsSat: 'EXO n', classSat: '1', resultSat: 'PH', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'EXO n', classSun: '1', resultSun: 'ABS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '2', cat: 'CEW25 CH JCH KCH RAY OF HOPE KANDOVAN*PL JW', sex: '0,1', emsSat: 'EXO n 22', classSat: '5', resultSat: 'Ex 1, CAGCIB, NOM', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'EXO n 22', classSun: '5', resultSun: 'ABS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '3', cat: 'GIC, *QGC PL*PATI-MARRO ROMEO', sex: '1,0', emsSat: 'EXO n 33', classSat: '3', resultSat: 'Ex 1, CACS, NOM', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'EXO n 33', classSun: '3', resultSun: 'Ex 1, CACS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '4', cat: 'NW24 GIC JCH KCH THE LEGEND MIRO JW', sex: '1,0', emsSat: 'PER n', classSat: '3', resultSat: 'ABS', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'PER n', classSun: '3', resultSun: 'ABS', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '5', cat: 'KCH GLIMMER KLAN PUCHATYCH*PL', sex: '0,1', emsSat: 'PER n', classSat: '12', resultSat: 'Ex 1, CACC', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'PER n', classSun: '12', resultSun: 'Ex 1, CACC, NOM', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '6', cat: 'CH JCH KCH NARF COSMO', sex: '1,0', emsSat: 'PER ns 11', classSat: '7', resultSat: 'Ex 1, CACIB', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'PER ns 11', classSun: '5', resultSun: 'Ex 1, CAGCIB', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '7', cat: 'KCH FALCON KLAN PUCHATYCH*PL', sex: '1,0', emsSat: 'PER as 24 62', classSat: '12', resultSat: 'Ex 1, CACC, NOM, BIS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'PER as 24 62', classSun: '12', resultSun: 'Ex 1, CACC, NOM', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '8', cat: 'SP, SC NW PL*JANTAR WILLIAM DSM DSW', sex: '1,0', emsSat: 'PER d 03', classSat: '17', resultSat: '1, NOM, BIS', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'PER d 03', classSun: '2', resultSun: 'PH, NOM, BIS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
];


const JudgeReportDetail = ({ judgeName, date }: { judgeName: string; date: string }) => {
    // modal window Judges' reports ---
    const reportData: JudgeReportRow[] = [
        { no: 1, ems: 'EXO n', sex: '1,0', class: 1, born: '2023-05-04', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'PH' },
        { no: 7, ems: 'PER as 24 62', sex: '1,0', class: 12, born: '2025-05-09', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC, NOM' },
        { no: 9, ems: 'PER e 03 22', sex: '1,0', class: 2, born: '2023-07-17', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'PH, NOM' },
        { no: 14, ems: 'RAG a 03', sex: '0,1', class: 7, born: '2024-07-24', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACIB, BIV, NOM' },
        { no: 15, ems: 'RAG a 03', sex: '0,1', class: 11, born: '2025-01-09', AdM: '', AdF: 'X', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'ABS' },
        { no: 16, ems: 'RAG a 03', sex: '0,1', class: 11, born: '2025-02-17', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACJ, NOM' },
        { no: 17, ems: 'RAG a 03', sex: '1,0', class: 12, born: '2025-07-10', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC' },
        { no: 18, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-07-10', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC, NOM' },
        { no: 19, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-05-26', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 2' },
        { no: 20, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-04-09', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 3' },
        { no: 13, ems: 'RAG a 03', sex: '0,1', class: 8, born: '2024-07-30', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CAPIB, NOM' },
        { no: 38, ems: 'SBI a', sex: '1,0', class: 5, born: '2024-03-15', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACGIB, NOM' },
    ];

    const columns = [
        { key: 'no', label: 'No.', align: 'center' },
        { key: 'ems', label: 'EMS', align: 'left' },
        { key: 'sex', label: 'Sex', align: 'center' },
        { key: 'class', label: 'Class', align: 'center' },
        { key: 'born', label: 'Born', align: 'center' },
        { key: 'AdM', label: 'Ad M', align: 'center', highlight: true },
        { key: 'AdF', label: 'Ad F', align: 'center', highlight: true },
        { key: 'NeM', label: 'Ne M', align: 'center', disabled: true },
        { key: 'NeF', label: 'Ne F', align: 'center', disabled: true },
        { key: '11M', label: '11 M', align: 'center', highlight: true },
        { key: '11F', label: '11 F', align: 'center', highlight: true },
        { key: '12M', label: '12 M', align: 'center' },
        { key: '12F', label: '12 F', align: 'center' },
        { key: 'results', label: 'Results', align: 'left' },
    ];

    const catsTotal = reportData.length;

    return (
        <div className="p-6">
            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-sm min-w-[1200px]">
                    <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={`
                                        bg-[#027BFF] text-white p-2 font-semibold text-center whitespace-nowrap 
                                        ${col.disabled ? 'line-through opacity-80' : ''}
                                    `}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    className={`
                                            p-2 border border-gray-200 text-${col.align} 
                                            ${col.highlight ? 'bg-blue-50/70' : 'bg-white'} 
                                            ${row[col.key] === 'X' ? 'font-bold text-[#027BFF]' : ''}
                                        `}
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-gray-500 text-sm text-left">
                Cats total: {catsTotal}
            </p>
        </div>
    );
};

const NominationDetailTable = ({ category, date, location = "FP – Poznań" }: { category: string; date: string; location?: string }) => {
    const tableData: { [key: string]: NominationEntry[] } = {
        'Adult Males': [
            { no: 38, breed: 'SBI a', judge: 'Mrs. Eva Porat SE', badge: 'BIC' },
            { no: 11, breed: 'RAG n 03', judge: 'Mrs. Annika Berner SE', badge: '' },
            { no: 3, breed: 'EXO n 33', judge: 'Mrs. Daria Łukasik-Weber PL', badge: '' },
        ],
        'Adult Females': [
            { no: 14, breed: 'RAG a 03', judge: 'Mrs. Eva Porat SE', badge: 'BIS' },
            { no: 28, breed: 'RAG n 04', judge: 'Mrs. Annika Berner SE', badge: '' },
            { no: 2, breed: 'EXO n 22', judge: 'Mrs. Daria Łukasik-Weber PL', badge: '' },
        ],
        'Neuter Males': [
            { no: 9, breed: 'PER e 03 22', judge: 'Mrs. Eva Porat SE', badge: 'BIS' },
        ],
        'Neuter Females': [
            { no: 13, breed: 'RAG a 03', judge: 'Mrs. Eva Porat SE', badge: 'BIS' },
        ],
        'Juniors 8–12 Males': [
            { no: 32, breed: 'RAG a 04', judge: 'Mrs. Annika Berner SE', badge: 'BIS' },
        ],
        'Juniors 8–12 Females': [
            { no: 16, breed: 'RAG a 03', judge: 'Mrs. Eva Porat SE', badge: '' },
            { no: 33, breed: 'RAG a 04', judge: 'Mrs. Annika Berner SE', badge: 'BIS' },
            { no: 39, breed: 'TUV f 63', judge: 'Mrs. Daria Łukasik-Weber PL', badge: '' },
        ],
        'Kittens 4–8 Males': [
            { no: 7, breed: 'PER as 24 62', judge: 'Mrs. Eva Porat SE', badge: 'BIS' },
            { no: 21, breed: 'RAG d 03', judge: 'Mrs. Annika Berner SE', badge: '' },
            { no: 27, breed: 'RAG a 03 21', judge: 'Mrs. Daria Łukasik-Weber PL', badge: '' },
        ],
        'Kittens 4–8 Females': [
            { no: 18, breed: 'RAG a 03', judge: 'Mrs. Eva Porat SE', badge: 'BIS' },
            { no: 12, breed: 'RAG n 03', judge: 'Mrs. Annika Berner SE', badge: '' },
            { no: 25, breed: 'RAG n 03 21', judge: 'Mrs. Daria Łukasik-Weber PL', badge: '' },
        ],
        'Veteran Males': [
            { no: 8, breed: 'PER d 03', judge: 'Mrs. Annika Berner SE', badge: 'BIS' },
        ],
        'Veteran Females': [],
        'Litter': [
            { no: 37, breed: 'RAG', judge: 'Mrs. Daria Łukasik-Weber PL', badge: 'BIS' },
        ],
    };

    const judgesInTable: string[] = [
        'Mrs. Eva Porat SE', 'Mrs. Annika Berner SE', 'Mrs. Manuela Centamore IT',
        'Mrs. Daria Łukasik-Weber PL', 'Mrs. Anne-Louise Nygaard Sadek DK',
        'Mr. Juan José Martinez Vizcaino ES', 'Mr. Kristof Van Roy BE',
        'Mrs. Anna Wilczek PL'
    ];

    const rowNames: string[] = Object.keys(tableData);

    const getEntryForJudgeAndClass = (className: string, judgeName: string) => {
        const entries = tableData[className] || [];
        return entries.find(entry => entry.judge === judgeName);
    };

    return (
        <div className="p-6 pt-10">
            <div className="flex items-center justify-between flex-wrap pb-4 mb-4 border-b border-gray-200">
                <div className="flex flex-col text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900">
                        {category}
                    </h2>
                    <span className="text-sm text-gray-600 mt-1">
                        {location} — {date}
                    </span>
                </div>
            </div>

            <div className="scroll-container w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-sm min-w-[1200px] shadow-lg rounded-xl overflow-hidden">
                    <thead>
                    <tr>
                        <th className="bg-gray-100 text-gray-800 p-3 font-bold text-left whitespace-nowrap border-b-2 border-white min-w-[180px]">Class</th>
                        {judgesInTable.map((judge, i) => (
                            <th key={i} className="bg-[#027BFF]/90 text-white p-3 font-semibold text-center whitespace-nowrap border-l border-[#027BFF]">
                                {judge.split(' ')[1]} {judge.split(' ')[2]}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rowNames.map((className, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50 transition duration-150">
                            <th className="bg-gray-50 text-gray-900 p-3 font-bold text-left whitespace-nowrap">{className}</th>
                            {judgesInTable.map((judgeName, j) => {
                                const entry = getEntryForJudgeAndClass(className, judgeName);

                                return (
                                    <td key={j} className={`p-2 text-center border-l border-gray-100 ${entry ? 'bg-white' : 'bg-gray-50/50 text-gray-400'}`}>
                                        {entry ? (
                                            <div className="flex flex-col items-center">
                                                <span className="entry-number font-bold text-lg text-gray-900">{entry.no}</span>
                                                <span className="entry-breed text-xs text-gray-600">{entry.breed}</span>
                                                {entry.badge && (
                                                    <span className="badge mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-[#027BFF] bg-[#e9f4ff]">
                                                            {entry.badge}
                                                        </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">–</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- HLAVNÍ KOMPONENTA KATALOGU S Taby ---

export default function Catalog() {
    const [tab, setTab] = useState<"info" | "primary" | "secondary">("info");

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [modalJudge, setModalJudge] = useState<string | null>(null);
    const [modalCategory, setModalCategory] = useState<string | null>(null);

    const openModal = (date: string, judgeName: string | null = null, category: string | null = null) => {
        setModalDate(date);
        setModalJudge(judgeName);
        setModalCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalDate(null);
        setModalJudge(null);
        setModalCategory(null);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 border-b border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[-4px] text-gray-900 mb-4">
                    MVK Praha Winter
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 gap-3 text-gray-700">
                    {/* DATE */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-[#027BFF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">14. 12. 2025 – 15. 12. 2025</p>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-[#027BFF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11a3 3 0 110-6 3 3 0 010 6zm0 0c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">PVA Expo Letňany, Praha</p>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="flex gap-2 sm:gap-4 md:gap-8 justify-start">

                    {/* INFO */}
                    <button
                        onClick={() => setTab("info")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
                            ${tab === "info" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "info" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11.5 12h1v4h-1" /></svg>
                        Informace
                    </button>

                    {/* PRIMARY */}
                    <button
                        onClick={() => setTab("primary")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
                            ${tab === "primary" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "primary" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
                        Primární katalog
                    </button>

                    {/* SECONDARY */}
                    <button
                        onClick={() => setTab("secondary")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
                            ${tab === "secondary" ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "secondary" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
                        Výsledky
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="max-w-6xl mx-auto px-4 mt-10">

                {/* TAB 1 – INFORMACE */}
                {tab === "info" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* ABOUT */}
                            <section className="text-left">
                                <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">
                                    Informace
                                </h2>
                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    Tato prestižní mezinárodní výstava koček "MVVK Praha Winter" je vyvrcholením celoročního úsilí chovatelů a milovníků koček z celé Evropy. Akce je ideální příležitostí pro veřejnost, aby se seznámila s různými plemeny, promluvila si s chovateli o péči a genetice a získala cenné rady pro své vlastní mazlíčky. Dva dny plné soutěží nabízejí možnost získat cenné certifikáty, které jsou klíčové pro získání mezinárodního titulu šampiona. Posuzování probíhá pod dohledem mezinárodně uznávaných porotců, kteří pečlivě hodnotí stav srsti, kondici, typ a temperament každého zvířete.
                                </p>
                            </section>

                            {/* SCHEDULE */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">
                                    Harmonogram
                                </h2>

                                <div className="flex flex-col gap-6">

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            08:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Veterinární prohlídka</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            10:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Zahájení posuzování</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            16:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Výstava</p>
                                    </div>

                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="space-y-8">

                            {/* REGISTRATION STATUS */}
                            <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#027BFF] to-[#005fcc] text-white">
                                <h3 className="text-lg font-semibold mb-3">Registrace</h3>

                                <p className="text-3xl font-bold tracking-[-1px] mb-2">156 / 250</p>

                                <div className="w-full h-2 bg-white/30 rounded-full mb-3 overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: "62%" }}></div>
                                </div>

                                <p className="text-sm text-white/90 mb-5">
                                    Místa se zaplňují! Zaregistrujte své kočky.
                                </p>

                                <Link
                                    to="/entries"
                                    className="block w-full text-center py-2.5 bg-white text-[#027BFF] tracking-[-1px] font-semibold rounded-full border-2 border-white hover:bg-transparent hover:text-white transition-all"
                                >
                                    Registrovat
                                </Link>
                            </div>

                            {/* ORGANIZER */}
                            <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40">

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-[#027BFF]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 21a7.5 7.5 0 00-15 0"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 tracking-[-1px]">
                                        Organizátor
                                    </h3>
                                </div>

                                <p className="font-semibold text-gray-800 mb-1 text-left">SO Ostrava</p>
                                <p className="text-sm text-gray-600 text-left">fife-ostrava.cz</p>

                                <Link
                                    to="/entries"
                                    className="block w-full text-center py-2.5 mt-2 bg-white text-[#027BFF] font-semibold rounded-full border-2 border-[#027BFF] tracking-[-1px] hover:bg-[#027BFF] hover:text-white transition-all duration-300"
                                >
                                    Kontaktovat
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}

                {/* TAB 2 – PRIMARY CATALOG (NOVĚ VLOŽENO) */}
                {tab === "primary" && <PrimaryCatalogueContent />}

                {/* TAB 3 – SECONDARY CATALOG */}
                {tab === "secondary" && (
                    <div className="py-10 space-y-8">

                        {/* 1. Cat Show Info BOX */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-left">
                                <h2 className="text-xl font-semibold text-gray-900">Cat Show: FP – Poznań</h2>
                                <p className="text-sm text-gray-500">
                                    Date: 2025–11–15 &amp; 2025–11–16
                                </p>
                            </div>

                            <div className="text-sm text-gray-700 text-left sm:text-right">
                                <p className="font-semibold">Judges &amp; colours:</p>
                                <div className="flex flex-wrap gap-3 mt-1 sm:justify-end">
                                    <a
                                        href="#"
                                        onClick={(e) => {e.preventDefault(); openModal("2025–11–15", null);}}
                                        className="text-[#027BFF] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                        [2025–11–15]
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {e.preventDefault(); openModal("2025–11–16", null);}}
                                        className="text-[#027BFF] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                        [2025–11–16]
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* 2. Judges' reports BOX */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
                            <div className="flex items-baseline justify-between mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold tracking-[-1px] text-gray-900">
                                    Judges&apos; reports
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {judges.map((j, idx) => (
                                    <div
                                        key={idx}
                                        className="py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                                    >
                                        {/* Jméno */}
                                        <div className="md:w-1/3 font-medium text-gray-900 text-left">
                                            {j.name}
                                        </div>

                                        {/* Sobota */}
                                        <div className="md:w-1/3 flex items-center gap-3">
                                            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                                {j.sat}%
                                            </span>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all bg-[#027BFF]"
                                                    style={{ width: `${j.sat}%` }}
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                onClick={(e) => {e.preventDefault(); openModal("2025-11-15", j.name);}}
                                                className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap bg-transparent p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                                [2025–11–15]
                                            </a>
                                        </div>

                                        {/* Neděle */}
                                        <div className="md:w-1/3 flex items-center gap-3">
                                            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                                {j.sun}%
                                            </span>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        j.sun === 0 ? 'bg-gray-300' : 'bg-[#027BFF]'
                                                    }`}
                                                    style={{ width: `${j.sun}%` }}
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                onClick={(e) => {e.preventDefault(); openModal("2025-11-15", j.name);}}
                                                className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap bg-transparent p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                                [2025–11–15]
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Nominations BOX  */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">
                                Nominations
                            </h3>

                            <div className="space-y-4 text-sm sm:text-base">
                                <div>
                                    <div className="text-[#027BFF] font-bold mb-1 text-left">
                                        2025–11–15
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        {['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM', 'NFO'].map(
                                            (cat, i) => (
                                                <a
                                                    key={i}
                                                    href="#"
                                                    onClick={(e) => {e.preventDefault(); openModal('2025–11–15', null, cat);}}
                                                    className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF] focus:outline-none focus:ring-0"
                                                >
                                                    [{cat}]
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Den 2 */}
                                <div>
                                    <div className="text-[#027BFF] font-bold mb-1 text-left">
                                        2025–11–16
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        {['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM'].map(
                                            (cat, i) => (
                                                <a
                                                    key={i}
                                                    href="#"
                                                    onClick={(e) => {e.preventDefault(); openModal('2025–11–16', null, cat);}}
                                                    className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF] focus:outline-none focus:ring-0"
                                                >
                                                    [{cat}]
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Quick catalogue & results BOX */}
                        <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">
                                Quick catalogue & results
                            </h3>
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {['[cat 1]', '[cat 2]', '[cat 3]', '[cat 4]', '[HGS/HCL]', '[XSH/XLH]', '[ALL]'].map((label, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-1.5 text-sm rounded-lg font-semibold whitespace-nowrap transition
                                            ${label === '[cat 1]' ? 'bg-[#027BFF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`
                                        }
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                    <tr className="bg-[#027BFF] text-white">
                                        <th className="p-2">No.</th>
                                        <th className="p-2 text-left">Cat</th>
                                        <th className="p-2 text-center">Sex</th>
                                        <th className="p-2">EMS (Sat)</th>
                                        <th className="p-2 text-center">Class (Sat)</th>
                                        <th className="p-2">Result Sat.</th>
                                        <th className="p-2">Judge Sat.</th>
                                        <th className="p-2">EMS (Sun)</th>
                                        <th className="p-2 text-center">Class (Sun)</th>
                                        <th className="p-2">Result Sun.</th>
                                        <th className="p-2">Judge Sun.</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {catalogueData.map((row: CatalogueEntry) => (
                                        <tr key={row.no} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{row.no}</td>
                                            <td className="p-2 font-semibold">{row.cat}</td>
                                            <td className="p-2 text-center">{row.sex}</td>
                                            <td className="p-2">{row.emsSat}</td>
                                            <td className="p-2 text-center">{row.classSat}</td>
                                            <td className="p-2">{row.resultSat}</td>
                                            <td className="p-2">{row.judgeSat}</td>
                                            <td className="p-2">{row.emsSun}</td>
                                            <td className="p-2 text-center">{row.classSun}</td>
                                            <td className="p-2">{row.resultSun}</td>
                                            <td className="p-2">{row.judgeSun}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE CARDS */}
                            <div className="md:hidden flex flex-col gap-4">
                                {catalogueData.map((row: CatalogueEntry) => (
                                    <details key={row.no} className="border rounded-xl shadow-sm p-4">
                                        <summary className="font-semibold cursor-pointer text-left">#{row.no} — {row.cat}</summary>
                                        <p className="text-gray-500 text-sm mt-1 text-left">Sex: {row.sex} • EMS: {row.emsSat} • Class: {row.classSat}</p>
                                        <div className="mt-3 border-t pt-3 text-sm space-y-1 text-left">
                                            <p className="font-semibold text-[#027BFF]">Saturday</p>
                                            <p><span className="font-semibold">Result:</span> {row.resultSat}</p>
                                            <p><span className="font-semibold">Judge:</span> {row.judgeSat}</p>
                                            <p className="font-semibold text-[#027BFF]">Sunday</p>
                                            <p><span className="font-semibold">Result:</span> {row.resultSun}</p>
                                            <p><span className="font-semibold">Judge:</span> {row.judgeSun}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* MODAL WINDOW (S PLÝM OBSAHEM)*/}
            {isModalOpen && modalDate && (
                <div className="fixed inset-0 z-50 flex justify-center p-4 pt-32">
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>
                    <div className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-7xl max-h-[75vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 transition-all duration-200 bg-white text-[#027BFF] border-2 border-[#027BFF] hover:bg-[#027BFF] hover:text-white hover:shadow-lg w-8 h-8 p-1 rounded-full flex items-center justify-center sm:w-auto sm:h-auto sm:px-4 sm:py-2"
                        >
                            <span className="sm:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                            <span className="hidden sm:inline font-semibold">
                                Zavřít
                            </span>
                        </button>
                        {modalJudge ? (
                            <div className="p-6">
                                <h2 className="text-xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6 text-left">
                                    {modalJudge} — {modalDate} — Category 1
                                </h2>
                                <JudgeReportDetail judgeName={modalJudge} date={modalDate} />
                            </div>
                        ) : modalCategory ? (
                            <NominationDetailTable category={modalCategory} date={modalDate} />
                        ) : (
                            <div className="p-6 pt-10">
                                <h2 className="text-xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6 text-left">
                                    Přidělení porotců a plemen pro — {modalDate}
                                </h2>
                                <div className="overflow-x-auto pb-4">
                                    <table className="min-w-[1300px] w-full border-collapse text-sm bg-gray-50">
                                        <thead>
                                        <tr>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Eva Porat SE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Annika Berner SE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Manuela Centamore IT</th>
                                            <th className ="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Daria Łukasik-Weber PL</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Anne-Louise Nygaard Sadek DK</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mr. Juan José Martinez Vizcaino ES</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mr. Kristof Van Roy BE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Anna Wilczek PL</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>EXO n</span>
                                                    <span>PER as 24 62</span>
                                                    <span>PER e 03 22</span>
                                                    <span>RAG a 03</span>
                                                    <span>SBI a</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO 7 (11,12)</span>
                                                    <span>MCO 8 (Adult)</span>
                                                    <span>NFO miot</span>
                                                    <span>NFO 1</span>
                                                    <span>NFO 7</span>
                                                    <span>NFO 8</span>
                                                    <span>SIB 3</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>PER ns 11</span>
                                                    <span>PER d 03</span>
                                                    <span>RAG a</span>
                                                    <span>RAG n 03</span>
                                                    <span>RAG d 03</span>
                                                    <span>RAG e 03</span>
                                                    <span>RAG n 04</span>
                                                    <span>RAG a 04</span>
                                                    <span>TUV a 21 63</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO 2</span>
                                                    <span>MCO 6</span>
                                                    <span>MCO 9</span>
                                                    <span>NEM 4</span>
                                                    <span>NFO 2</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>BEN n 24 32</span>
                                                    <span>BEN n 24 33</span>
                                                    <span>BLH a</span>
                                                    <span>BSH b</span>
                                                    <span>BSH c</span>
                                                    <span>BUR b</span>
                                                    <span>BUR d</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>CRX 9</span>
                                                    <span>DRX miot</span>
                                                    <span>DRX 5</span>
                                                    <span>DRX 6</span>
                                                    <span>RUS (11,12)</span>
                                                    <span>SIA n</span>
                                                    <span>SIA n 03 21</span>
                                                    <span>SPH 1</span>
                                                    <span>SPH 3</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>HCL</span>
                                                    <span>HCS</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>EXO n 22</span>
                                                    <span>EXO n 33</span>
                                                    <span>PER n</span>
                                                    <span>RAG n 03 21</span>
                                                    <span>RAG a 03 21</span>
                                                    <span>RAG a 04 21</span>
                                                    <span>RAG miot</span>
                                                    <span>TUV f 63</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>NFO 3</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>BEN n 24</span>
                                                    <span>BLH h</span>
                                                    <span>BLH f 03</span>
                                                    <span>BML 1</span>
                                                    <span>BSH e</span>
                                                    <span>BSH f</span>
                                                    <span>BSH d 03</span>
                                                    <span>BSH p 01 62</span>
                                                    <span>BUR h</span>
                                                    <span>CHA</span>
                                                    <span>KBL 3</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>LPL 10</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO miot</span>
                                                    <span>MCO 5 (11,12)</span>
                                                    <span>MCO 7 (Adult)</span>
                                                    <span>MCO 8 (11,12)</span>
                                                    <span>NEM 1</span>
                                                    <span>NEM 3</span>
                                                    <span>NFO 6</span>
                                                    <span>SIB miot</span>
                                                    <span>SIB 4</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>MCO 1</span>
                                                    <span>MCO 3</span>
                                                    <span>MCO 5 (Adult)</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>BLH d</span>
                                                    <span>BSH a</span>
                                                    <span>BSH h</span>
                                                    <span>BSH a 03</span>
                                                    <span>BSH b 03</span>
                                                    <span>BSH qs 03</span>
                                                    <span>BSH o</span>
                                                    <span>BSH p</span>
                                                    <span>BUR n</span>
                                                    <span>BUR g</span>
                                                    <span>KBL 2</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>DRX 7</span>
                                                    <span>SPH miot</span>
                                                    <span>SPH 4</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>MCO 4</span>
                                                    <span>NEM 2</span>
                                                    <span>NEM 5</span>
                                                    <span>NEM 6</span>
                                                    <span>NFO 5</span>
                                                    <span>NFO 9</span>
                                                    <span>SIB 5</span>
                                                    <span>SIB 6</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>ABY p</span>
                                                    <span>CRX 3</span>
                                                    <span>DRX 3</span>
                                                    <span>DRX 4</span>
                                                    <span>DRX 8</span>
                                                    <span>DSP 4</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>OSH n 01</span>
                                                    <span>RUS (Adult)</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>NFO 4</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>ABY n</span>
                                                    <span>ABY o</span>
                                                    <span>CRX 1</span>
                                                    <span>CRX 2</span>
                                                    <span>DRX 1</span>
                                                    <span>DSP 5</span>
                                                    <span>OSH f 24</span>
                                                    <span>OSH n 25</span>
                                                    <span>RUS miot</span>
                                                    <span>SPH 2</span>
                                                    <span>SPH 5</span>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}