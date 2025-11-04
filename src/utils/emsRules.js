// --- 1. DATABÁZE PLEMEN ---
// Získáno z FIFe "Breeds" a vaší QRC karty.
export const BREED_NAMES = {
    // Cat 1
    "EXO": "Exotic", "PER": "Persian", "RAG": "Ragdoll", "SBI": "Sacred Birman", "TUV": "Turkish Van",
    // Cat 2
    "ACL": "American Curl Longhair", "ACS": "American Curl Shorthair", "LPL": "LaPerm Longhair", "LPS": "LaPerm Shorthair", "MCO": "Maine Coon", "NEM": "Neva Masquerade", "NFO": "Norwegian Forest Cat", "SIB": "Siberian", "TUA": "Turkish Angora",
    // Cat 3
    "BEN": "Bengal", "BLH": "British Longhair", "BML": "Burmilla", "BSH": "British Shorthair", "BUR": "Burmese", "CHA": "Chartreux", "CYM": "Cymric", "EUR": "European", "KBL": "Kurilean Bobtail Longhair", "KBS": "Kurilean Bobtail Shorthair", "KOR": "Korat", "MAN": "Manx", "MAU": "Egyptian Mau", "OCI": "Ocicat", "SIN": "Singapura", "SNO": "Snowshoe", "SOK": "Sokoke", "SRL": "Selkirk Rex Longhair", "SRS": "Selkirk Rex Shorthair",
    // Cat 4
    "ABY": "Abyssinian", "BAL": "Balinese", "CRX": "Cornish Rex", "DRX": "Devon Rex", "DSP": "Don Sphynx", "GRX": "German Rex", "JBS": "Japanese Bobtail", "OLH": "Oriental Longhair", "OSH": "Oriental Shorthair", "PEB": "Peterbald", "RUS": "Russian Blue", "SIA": "Siamese", "SOM": "Somali", "SPH": "Sphynx", "THA": "Thai",
    // Preliminary
    "BOM": "Bombay", "LYO": "Lykoi",
    // Housecats
    "HCL": "Housecat longhair", "HCS": "Housecat shorthair",
    // Non-recognised (Můžeme přidat)
    "XLH": "Neregistrovaná dlouhosrstá", "XSH": "Neregistrovaná krátkosrstá"
};

// --- 2. MOŽNOSTI PRO VÝBĚR (SELECT) ---
export const BREED_OPTIONS = Object.keys(BREED_NAMES).map(code => ({
    value: code,
    label: `${code} (${BREED_NAMES[code]})`
}));


// --- 3. CHYTRÝ "WHITELIST" VALIDÁTOR (Finální verze 4.0) ---
// Toto je mozek celé operace. Zkontroluje suffix proti sadě pravidel.
function masterValidator(suffix, rules) {
    const parts = suffix.trim().split(' ').filter(p => p); // Rozdělí a odstraní prázdné
    const breedCode = rules.breedCode;

    // --- A. Plemeno bez suffixu (např. RUS, CHA, KOR, SIN, SOK, BOM) ---
    if (rules.colors.length === 0) {
        return (suffix.trim() === '') ? true : `${breedCode} nesmí mít žádný dodatečný kód.`;
    }

    // --- B. Plemeno s barvou (většina) ---
    if (parts.length === 0) {
        return "Chybí kód barvy (např. 'n', 'w'...).";
    }

    const colorPart = parts[0];
    const otherParts = parts.slice(1);

    // --- C. Příprava a parsování (Logika 4.0) ---
    let modifier = '';
    let hasSilver = false;
    let isWhite = (colorPart === 'w');
    let colorIsValid = false;

    // --- D. Kontrola barvy (Logika 4.0) ---
    if (isWhite) {
        // 1. Je to 'w'?
        if (rules.colors.includes('w')) {
            colorIsValid = true;
        }
    } else {
        // 2. Je to speciální/běžná barva? (např. 'n', 'a', 'am', '*m', 'nt')
        if (rules.colors.includes(colorPart)) {
            colorIsValid = true;
        }

        // 3. Není to barva s modifikátorem? (např. 'ns', 'ay')
        if (!colorIsValid) {
            let potentialModifier = colorPart.slice(-1);
            if (rules.modifiers.includes(potentialModifier)) {
                let potentialBase = colorPart.slice(0, -1);
                if (rules.colors.includes(potentialBase)) {
                    colorIsValid = true;
                    modifier = potentialModifier;
                    if (modifier === 's') hasSilver = true;
                }
            }
        }
    }

    // Finální verdikt o barvě
    if (!colorIsValid) {
        return `Kód barvy "${colorPart}" není pro plemeno ${breedCode} povolen.`;
    }

    // --- E. Kontrola ostatních částí (kresby, bílá, oči, OSTATNÍ) ---
    let hasPattern = false;
    let hasPiebald = false;
    let hasEyeColor = false;

    const allowedEyeColors = rules.eyeColors || [];

    // První průchod: Najdeme klíčové kódy
    for (const part of otherParts) {
        if (rules.patterns.includes(part)) hasPattern = true;
        if (rules.white.includes(part)) hasPiebald = true;
        if (part.startsWith('6')) hasEyeColor = true;
    }

    // Druhý průchod: Validujeme každou část
    for (const part of otherParts) {
        const isPattern = rules.patterns.includes(part);
        const isWhite = rules.white.includes(part);
        const isPointed = rules.pointed.includes(part);
        const isEye = part.startsWith('6');
        const isOther = (rules.other || []).includes(part);

        if (isEye) {
            // 1. Je tato barva očí vůbec povolena?
            if (!allowedEyeColors.includes(part)) {
                return `Barva očí "${part}" není pro ${breedCode} povolena.`;
            }
            // PRAVIDLO 1 & 3: TUV musí, HCL/HCS nesmí, ostatní smí jen za podmínek
            const conditionMet =
                isWhite ||
                (hasSilver && hasPattern) ||
                hasPiebald ||
                breedCode === 'TUV';

            if (!conditionMet) {
                return `Kód očí (${part}) je povolen jen u 'w', 's + kresba', 's bílou' (01-03) nebo u plemene TUV.`;
            }
        } else if (!isPattern && !isWhite && !isPointed && !isOther) {
            // Kód není ani kresba, ani bílá, ani pointed, ani kód očí, ani "jiný"
            return `Kód "${part}" není pro plemeno ${breedCode} povolen.`;
        }
    }

    // --- F. Finální kontroly ---
    // PRAVIDLO 1: TUV musí mít kód očí
    if (breedCode === 'TUV' && !hasEyeColor) {
        return `TUV (Turkish Van) musí mít vždy kód barvy očí (např. 63, 64).`;
    }

    return true; // Vše prošlo
}


// --- 4. HLAVNÍ OBJEKT S PRAVIDLY ---
// Toto je náš finální "slovník" se všemi pravidly.
export const EMS_RULES = {
    // === KATEGORIE 1 ===
    "EXO": {
        breedCode: "EXO",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['33'],
        eyeColors: ['61', '62', '63', '64', '67'],
        other:     []
    },
    "PER": {
        breedCode: "PER",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['33'],
        eyeColors: ['61', '62', '63', '64', '67'],
        other:     []
    },
    "RAG": {
        breedCode: "RAG",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: [],
        white:     ['03', '04'],
        patterns:  ['21'],
        pointed:   [], // '33' je implicitní a nepíše se
        eyeColors: [],
        other:     []
    },
    "SBI": {
        breedCode: "SBI",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: ['s'],
        white:     [],
        patterns:  ['21'],
        pointed:   [], // '33' je implicitní a nepíše se
        eyeColors: [],
        other:     []
    },
    "TUV": {
        breedCode: "TUV",
        colors:    ['n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: [],
        white:     [], // Vzor '01' (van) je implicitní
        patterns:  ['21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'], // Musí se vždy zapsat
        other:     []
    },

    // === KATEGORIE 2 ===
    "ACL": {
        breedCode: "ACL",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     []
    },
    "ACS": {
        breedCode: "ACS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     []
    },
    "LPL": {
        breedCode: "LPL",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['84']
    },
    "LPS": {
        breedCode: "LPS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['84']
    },
    "MCO": {
        breedCode: "MCO",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63'],
        other:     []
    },
    "NEM": {
        breedCode: "NEM",
        colors:    ['n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21'],
        pointed:   [], // Pointed je implicitní
        eyeColors: [], // Barva očí je implicitní
        other:     []
    },
    "NFO": {
        breedCode: "NFO",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'],
        other:     []
    },
    "SIB": {
        breedCode: "SIB",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'],
        other:     []
    },
    "TUA": {
        breedCode: "TUA",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'],
        other:     []
    },

    // === KATEGORIE 3 ===
    "BEN": {
        breedCode: "BEN",
        colors:    ['n'],
        modifiers: [],
        white:     [],
        patterns:  ['22', '24'],
        pointed:   ['31', '32', '33'],
        eyeColors: [],
        other:     []
    },
    "BLH": {
        breedCode: "BLH",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['11', '21', '22', '23', '24', '25'],
        pointed:   ['33'],
        eyeColors: ['61', '62', '63', '64', '67'],
        other:     []
    },
    "BML": {
        breedCode: "BML",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     [],
        patterns:  ['11', '12'],
        pointed:   ['31'],
        eyeColors: [],
        other:     []
    },
    "BSH": {
        breedCode: "BSH",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['11', '21', '22', '23', '24', '25'],
        pointed:   ['33'],
        eyeColors: ['61', '62', '63', '64', '67'],
        other:     []
    },
    "BUR": {
        breedCode: "BUR",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: [],
        white:     [],
        patterns:  [],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "CHA": {
        breedCode: "CHA",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "CYM": {
        breedCode: "CYM",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['51', '52', '53']
    },
    "EUR": {
        breedCode: "EUR",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s'],
        white:     ['01', '02', '03'],
        patterns:  ['22', 23, '24'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'],
        other:     []
    },
    "KBL": {
        breedCode: "KBL",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "KBS": {
        breedCode: "KBS",
        colors:    ['w', 'n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "KOR": {
        breedCode: "KOR",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "MAN": {
        breedCode: "MAN",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['51', '52', '53']
    },
    "MAU": {
        breedCode: "MAU",
        colors:    ['n'],
        modifiers: ['s'],
        white:     [],
        patterns:  ['24'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "OCI": {
        breedCode: "OCI",
        colors:    ['n', 'a', 'b', 'c', 'o', 'p'],
        modifiers: ['s'],
        white:     [],
        patterns:  ['24'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "SIN": {
        breedCode: "SIN",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "SNO": {
        breedCode: "SNO",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: [],
        white:     ['05'],
        patterns:  ['21'],
        pointed:   [], // Pointed je implicitní
        eyeColors: [],
        other:     []
    },
    "SOK": {
        breedCode: "SOK",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "SRL": {
        breedCode: "SRL",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['84']
    },
    "SRS": {
        breedCode: "SRS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['84']
    },

    // === KATEGORIE 4 ===
    "ABY": {
        breedCode: "ABY",
        colors:    ['n', 'a', 'o', 'p'],
        modifiers: ['s'],
        white:     [],
        patterns:  [], // Kresba '25' (ticked) je implicitní
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "BAL": {
        breedCode: "BAL",
        colors:    [
            'w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r',
            'm', 'am', 'cm', 'pm', 'em', '*m'
        ],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['21'],
        pointed:   [],
        eyeColors: ['67'],
        other:     []
    },
    "CRX": {
        breedCode: "CRX",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '67'],
        other:     []
    },
    "DRX": {
        breedCode: "DRX",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '67'],
        other:     []
    },
    "DSP": {
        breedCode: "DSP",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: [],
        white:     ['01', '02', '03', '09'],
        patterns:  ['21'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['81', '82', '83']
    },
    "GRX": {
        breedCode: "GRX",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '67'],
        other:     []
    },
    "JBS": {
        breedCode: "JBS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: [],
        white:     ['01', '02', '03', '09'],
        patterns:  ['21', '22', '23', '24'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "OLH": {
        breedCode: "OLH",
        colors:    [
            'w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r',
            'm', 'am', 'cm', 'pm', 'em', '*m'
        ],
        modifiers: ['s'],
        white:     ['01', '02', '03'],
        patterns:  ['22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '63', '64'],
        other:     []
    },
    "OSH": {
        breedCode: "OSH",
        colors:    [
            'w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r',
            'm', 'am', 'cm', 'pm', 'em', '*m'
        ],
        modifiers: ['s'],
        white:     ['01', '02', '03'],
        patterns:  ['22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '63', '64'],
        other:     []
    },
    "PEB": {
        breedCode: "PEB",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['21'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '63', '64', '65', '66', '67'],
        other:     ['81', '82', '83']
    },
    "RUS": {
        breedCode: "RUS",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "SIA": {
        breedCode: "SIA",
        colors:    [
            'w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r',
            'm', 'am', 'cm', 'pm', 'em', '*m'
        ],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03'],
        patterns:  ['21'],
        pointed:   [],
        eyeColors: ['67'],
        other:     []
    },
    "SOM": {
        breedCode: "SOM",
        colors:    ['n', 'a', 'o', 'p'],
        modifiers: ['s'],
        white:     [],
        patterns:  [], // Kresba '25' (ticked) je implicitní
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "SPH": {
        breedCode: "SPH",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: [],
        white:     ['01', '02', '03', '09'],
        patterns:  ['21'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '67'],
        other:     []
    },
    "THA": {
        breedCode: "THA",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: [],
        white:     [],
        patterns:  ['21'],
        pointed:   [], // Pointed je implicitní
        eyeColors: [], // Barva očí je implicitní
        other:     []
    },

    // === Předběžně uznaná ===
    "BOM": {
        breedCode: "BOM",
        colors:    [], // Prázdné pole = žádný suffix povolen
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "LYO": {
        breedCode: "LYO",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['84']
    },

    // === Domácí kočky ===
    "HCL": {
        breedCode: "HCL",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r', 'm', 'am', 'cm', 'pm', 'em', '*m', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '04', '05', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: [], // Barva očí se nezapisuje
        other:     ['51', '52', '53', '54']
    },
    "HCS": {
        breedCode: "HCS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r', 'm', 'am', 'cm', 'pm', 'em', '*m', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '04', '05', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: [], // Barva očí se nezapisuje
        other:     ['51', '52', '53', '54']
    },

    // Výchozí pravidla pro plemena, která nemáme definovaná (XLH/XSH)
    "__DEFAULT__": {
        breedCode: "Nespecifikované",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r', 'm', 'am', 'cm', 'pm', 'em', '*m', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '04', '05', '09'],
        patterns:  ['11', '12', '14', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: ['61', '62', '63', '64', '65', '66', '67'],
        other:     ['51', '52', '53', '54', '81', '82', '83', '84']
    }
};


// --- 5. FINÁLNÍ FUNKCE PRO ZOD / REGISTER ---
// Tato funkce propojí plemeno s jeho pravidly
export function validateEmsCode(fullEmsCode) {
    if (!fullEmsCode || fullEmsCode.length < 3) {
        return 'Musíte vybrat plemeno.';
    }

    const parts = fullEmsCode.split(' ');
    const prefix = parts[0]; // např. "EXO"
    const suffix = parts.slice(1).join(' '); // např. "ns 03 24"

    // Najdeme pravidla pro plemeno, nebo použijeme výchozí
    const breedRules = EMS_RULES[prefix] || EMS_RULES.__DEFAULT__;

    // Přidáme 'breedCode' do pravidel, aby ho validátor mohl použít v chyb. hláškách
    if (!breedRules.breedCode) {
        breedRules.breedCode = prefix;
    }

    // Zavoláme chytrý validátor
    return masterValidator(suffix, breedRules);
}