import { TFunction } from 'i18next';

export const FIFE_CATEGORIES: Record<string, { name: string; index: number; ems: string }> = {
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



export const BREED_NAMES: Record<string, string> = {
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
    // Non-recognised
    "XLH": "Neregistrovaná dlouhosrstá", "XSH": "Neregistrovaná krátkosrstá"
};


export const BREED_GROUP_RULES: Record<string, number> = {
    "ALC" : 11,
    "ACS" : 11,
    "LPL" : 11,
    "LPS" : 11,
    "MCO" : 9,
    "NEM" : 4,
    "NFO" : 9,
    "SIB" : 9,
    "TUA" : 9,
    "BLM" : 2,
    "CYM" : 3,
    "KBL" : 4,
    "KBS" : 4,
    "MAN" : 3,
    "SRL" : 9,
    "SRS" : 9,
    "CRX" : 9,
    "DRX" : 9,
    "DSP" : 5,
    "GRX" : 9,
    "JBS" : 1,
    "PEB" : 5,
    "SPH" : 5,
    "LYO" : 1,
    "HCL" : 1,
    "HCS" : 1
};


export const validateGroupForBreed = (breedCode: string, group: string | undefined | null, t: TFunction): string | true => {
    const maxGroup = BREED_GROUP_RULES[breedCode];


    if (!maxGroup) {
        if (group && group.trim() !== "") {
            return t('validation.cat.group.notRequired', { breed: breedCode });
        }
        return true;
    }


    if (!group || group.trim() === "") {
        return t('validation.cat.group.required', { breed: breedCode, max: maxGroup });
    }

    const groupNum = parseInt(group, 10);
    if (isNaN(groupNum) || groupNum < 1 || groupNum > maxGroup) {
        return t('validation.cat.group.invalid', { breed: breedCode, max: maxGroup });
    }

    return true;
};


export const EMS_GROUPS = [
    { value: '1', label: 'Skupina 1' },
    { value: '2', label: 'Skupina 2' },
    { value: '3', label: 'Skupina 3' },
    { value: '4', label: 'Skupina 4' },
    { value: '5', label: 'Skupina 5' },
    { value: '6', label: 'Skupina 6' },
    { value: '7', label: 'Skupina 7' },
    { value: '8', label: 'Skupina 8' },
    { value: '9', label: 'Skupina 9' },
    { value: '10', label: 'Skupina 10' },
    { value: '11', label: 'Skupina 11' },
    { value: '12', label: 'Skupina 12' },
    { value: '13', label: 'Skupina 13' },
];

interface BreedOption {
    value: string;
    label: string;
}

export const BREED_OPTIONS: BreedOption[] = Object.keys(BREED_NAMES).map(code => ({
    value: code,
    label: `${code} (${BREED_NAMES[code]})`
}));

interface EmsRuleSet {
    breedCode: string;
    colors: string[];
    modifiers: string[];
    white: string[];
    patterns: string[];
    pointed: string[];
    eyeColors?: string[];
    other?: string[];
}


function masterValidator(suffix: string, rules: EmsRuleSet): true | string {
    const parts = suffix.trim().split(' ').filter(p => p);
    const breedCode = rules.breedCode;


    if (rules.colors.length === 0) {
        return (suffix.trim() === '') ? true : `${breedCode} nesmí mít žádný dodatečný kód.`;
    }


    if (parts.length === 0) {
        return "Chybí kód barvy (např. 'n', 'w'...).";
    }

    const colorPart = parts[0];
    const otherParts = parts.slice(1);


    let modifier = '';
    let hasSilver = false;
    let isWhite = (colorPart === 'w');
    let colorIsValid = false;


    if (isWhite) {

        if (rules.colors.includes('w')) {
            colorIsValid = true;
        }
    } else {

        if (rules.colors.includes(colorPart)) {
            colorIsValid = true;
        }

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

    if (!colorIsValid) {
        return `Kód barvy "${colorPart}" není pro plemeno ${breedCode} povolen.`;
    }

    let hasPattern = false;
    let hasPiebald = false;
    let hasEyeColor = false;

    const allowedEyeColors = rules.eyeColors || [];
    const allowedOther = rules.other || [];

    for (const part of otherParts) {
        if (rules.patterns.includes(part)) hasPattern = true;
        if (rules.white.includes(part)) hasPiebald = true;
        if (part.startsWith('6')) hasEyeColor = true;
    }

    for (const part of otherParts) {
        const isPattern = rules.patterns.includes(part);
        const isWhite = rules.white.includes(part);
        const isPointed = rules.pointed.includes(part);
        const isEye = part.startsWith('6');
        const isOther = allowedOther.includes(part);

        if (isEye) {
            if (!allowedEyeColors.includes(part)) {
                return `Barva očí "${part}" není pro ${breedCode} povolena.`;
            }
            const conditionMet =
                isWhite ||
                (hasSilver && hasPattern) ||
                hasPiebald ||
                breedCode === 'TUV';

            if (!conditionMet) {
                return `Kód očí (${part}) je povolen jen u 'w', 's + kresba', 's bílou' (01-03) nebo u plemene TUV.`;
            }
        } else if (!isPattern && !isWhite && !isPointed && !isOther) {
            return `Kód "${part}" není pro plemeno ${breedCode} povolen.`;
        }
    }

    if (breedCode === 'TUV' && !hasEyeColor) {
        return `TUV (Turkish Van) musí mít vždy kód barvy očí (např. 63, 64).`;
    }

    return true;
}




export const EMS_RULES: Record<string, EmsRuleSet> = {
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
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "SBI": {
        breedCode: "SBI",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'],
        modifiers: ['s'],
        white:     [],
        patterns:  ['21'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "TUV": {
        breedCode: "TUV",
        colors:    ['n', 'a', 'd', 'e', 'f', 'g'],
        modifiers: [],
        white:     [],
        patterns:  ['21', '22', '23', '24', '25'],
        pointed:   [],
        eyeColors: ['61', '62', '63', '64'],
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
        pointed:   [],
        eyeColors: [],
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
        colors:    [],
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
        patterns:  ['22', '23', '24'],
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
        colors:    [],
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
        colors:    [],
        modifiers: [], white: [], patterns:  [], pointed:   [], eyeColors: [], other:     []
    },
    "SNO": {
        breedCode: "SNO",
        colors:    ['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r'],
        modifiers: [],
        white:     ['05'],
        patterns:  ['21'],
        pointed:   [],
        eyeColors: [],
        other:     []
    },
    "SOK": {
        breedCode: "SOK",
        colors:    [],
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
        patterns:  [],
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
        colors:    [],
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
        patterns:  [],
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
        pointed:   [],
        eyeColors: [],
        other:     []
    },


    "BOM": {
        breedCode: "BOM",
        colors:    [],
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


    "HCL": {
        breedCode: "HCL",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r', 'm', 'am', 'cm', 'pm', 'em', '*m', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '04', '05', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: [],
        other:     ['51', '52', '53', '54']
    },
    "HCS": {
        breedCode: "HCS",
        colors:    ['w', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'o', 'p', 'q', 'r', 'm', 'am', 'cm', 'pm', 'em', '*m', 'nt', 'at', 'ft', 'gt'],
        modifiers: ['s', 'y'],
        white:     ['01', '02', '03', '04', '05', '09'],
        patterns:  ['11', '12', '21', '22', '23', '24', '25'],
        pointed:   ['31', '32', '33'],
        eyeColors: [],
        other:     ['51', '52', '53', '54']
    },


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




export function validateEmsCode(fullEmsCode: string | null | undefined): true | string {
    if (!fullEmsCode || fullEmsCode.length < 3) {
        return 'Musíte vybrat plemeno.';
    }

    const parts = fullEmsCode.split(' ');
    const prefix = parts[0];
    const suffix = parts.slice(1).join(' ');


    const breedRules = EMS_RULES[prefix] || EMS_RULES.__DEFAULT__;

    if (!breedRules.breedCode) {
        breedRules.breedCode = prefix;
    }

    return masterValidator(suffix, breedRules);
}

export const requiresGroup = (breed: string): boolean => {
    const breedsWithGroups = ['ACL', 'ACS', 'LPL', 'LPS', 'MCO', 'NEM', 'NFO', 'SIB', 'TUA', 'BML', 'CYM', 'KBL', 'KBS', 'MAN', 'SRL', 'SRS', 'CRX', 'DRX', 'DSP', 'GRX', 'JBS', 'PEB', 'SPH', 'LYO', 'HCL', 'HCS'];
    return breedsWithGroups.includes(breed.toUpperCase());
};