import { z } from 'zod';

const futureDateValidator = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    const date = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year && date <= today;
};

// Schéma pro chovatele/vystavovatele (OPRAVENO)
const personSchema = {
    FirstName: z.string()
        .min(3, 'Jméno musí mít alespoň 3 znaky')
        .max(100, 'Jméno je příliš dlouhé'),
    LastName: z.string()
        .min(3, 'Příjmení musí mít alespoň 3 znaky')
        .max(100, 'Příjmení je příliš dlouhé'),
    Address: z.string() // Ulice
        .min(3, 'Adresa musí mít alespoň 3 znaky')
        .max(100, 'Adresa je příliš dlouhá'),
    Zip: z.string()
        .regex(/^\d{3} ?\d{2}$|^\d{5}$/, 'Neplatné PSČ (formát 123 45 nebo 12345)'),
    City: z.string()
        .min(2, 'Město musí mít alespoň 2 znaky')
        .max(100, 'Město je příliš dlouhé'),
    Country: z.string()
        .min(2, 'Země je povinná'),
    Email: z.string()
        .email('Neplatný formát emailu')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Neplatný formát emailu'),
    Phone: z.string()
        .regex(/^[+]?[0-9]{9,15}$/, 'Telefonní číslo musí mít 9-15 číslic (může začínat +)'),
};

// Schéma pro 1 kočku (VRÁCENA VŠECHNA POLE)
const catSchema = z.object({
    // Základní údaje
    titleBefore: z.string().optional(),
    catName: z.string()
        .min(2, 'Jméno zvířete je povinné')
        .max(100, 'Jméno zvířete je příliš dlouhé'),
    titleAfter: z.string().optional(),
    emsCode: z.string()
        .min(4, 'EMS kód je povinný (např. BRI ns 24)'),
    pedigreeNumber: z.string() // Registrační číslo
        .min(1, 'Registrační číslo je povinné')
        .max(50, 'Registrační číslo je příliš dlouhé')
        .regex(/^[a-zA-Z0-9\s-]+$/, 'Povoleny pouze písmena, čísla, mezery a pomlčky'),
    chipNumber: z.string()
        .regex(/^[0-9]{15}$/, 'Čip musí mít přesně 15 číslic'),
    birthDate: z.string()
        .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Neplatný formát data (DD.MM.YYYY)')
        .refine(futureDateValidator, {
            message: 'Datum narození nemůže být v budoucnosti',
        }),
    gender: z.enum(['male', 'female'], {
        required_error: 'Pohlaví je povinné'
    }),
    neutered: z.enum(['yes', 'no'], {
        required_error: 'Uveďte, zda je kastrované'
    }),
    showClass: z.string()
        .min(1, 'Třída je povinná'),
    cageType: z.string()
        .min(1, 'Typ klece je povinný'),

    // Matka
    motherTitleBefore: z.string().optional(),
    motherName: z.string()
        .min(2, 'Jméno matky je povinné')
        .max(100, 'Jméno matky je příliš dlouhé'),
    motherTitleAfter: z.string().optional(),
    motherBreed: z.string().optional(),
    motherEmsCode: z.string()
        .min(1, 'EMS kód matky je povinný'),
    motherColor: z.string().optional(),
    motherPedigreeNumber: z.string().optional(),
    motherChipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: 'Čip matky musí mít 15 číslic'
    }),

    // Otec
    fatherTitleBefore: z.string().optional(),
    fatherName: z.string()
        .min(2, 'Jméno otce je povinné')
        .max(100, 'Jméno otce je příliš dlouhé'),
    fatherTitleAfter: z.string().optional(),
    fatherBreed: z.string().optional(),
    fatherEmsCode: z.string()
        .min(1, 'EMS kód otce je povinný'),
    fatherColor: z.string().optional(),
    fatherPedigreeNumber: z.string().optional(),
    fatherChipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: 'Čip otce musí mít 15 číslic'
    }),
});


export const registrationSchema = z.object({
    // Krok 1
    showId: z.string().min(1, "Prosím vyberte výstavu"),
    days: z.enum(['sat', 'sun', 'both'], { required_error: "Prosím vyberte dny účasti" }),

    // Krok 2
    cats: z.array(catSchema).min(1, "Musíte přihlásit alespoň jednu kočku"),

    // Krok 3 - Chovatel
    breederFirstName: personSchema.FirstName,
    breederLastName: personSchema.LastName,
    breederAddress: personSchema.Address,
    breederZip: personSchema.Zip,
    breederCity: personSchema.City,
    breederEmail: personSchema.Email,
    breederPhone: personSchema.Phone,

    // Krok 4 - Vystavovatel
    sameAsBreeder: z.boolean().default(false),
    exhibitorFirstName: personSchema.FirstName.optional(),
    exhibitorLastName: personSchema.LastName.optional(),
    exhibitorAddress: personSchema.Address.optional(),
    exhibitorZip: personSchema.Zip.optional(),
    exhibitorCity: personSchema.City.optional(),
    exhibitorEmail: personSchema.Email.optional(),
    exhibitorPhone: personSchema.Phone.optional(),

    // Krok 5 - Souhlas
    notes: z.string().max(1000, 'Poznámka je příliš dlouhá (max. 1000 znaků)').optional(),
    dataAccuracy: z.boolean().refine(val => val === true, {
        message: "Musíte potvrdit pravdivost údajů"
    }),
    gdprConsent: z.boolean().refine(val => val === true, {
        message: "Musíte souhlasit se zpracováním osobních údajů"
    }),

}).refine(data => {
    if (!data.sameAsBreeder) {
        return z.object({
            exhibitorFirstName: personSchema.FirstName,
            exhibitorLastName: personSchema.LastName,
            exhibitorAddress: personSchema.Address,
            exhibitorZip: personSchema.Zip,
            exhibitorCity: personSchema.City,
            exhibitorEmail: personSchema.Email,
            exhibitorPhone: personSchema.Phone,
        }).safeParse({
            exhibitorFirstName: data.exhibitorFirstName,
            exhibitorLastName: data.exhibitorLastName,
            exhibitorAddress: data.exhibitorAddress,
            exhibitorZip: data.exhibitorZip,
            exhibitorCity: data.exhibitorCity,
            exhibitorEmail: data.exhibitorEmail,
            exhibitorPhone: data.exhibitorPhone,
        }).success;
    }
    return true;
}, {
    message: "Údaje o vystavovateli jsou povinné, pokud není shodný s chovatelem",
    path: ["exhibitorFirstName"],
});