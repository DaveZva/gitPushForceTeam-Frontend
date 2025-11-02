import { z } from 'zod';

// Schéma pro chovatele/vystavovatele (OPRAVENO)
const personSchema = {
    FirstName: z.string().min(2, "Jméno je povinné"),
    LastName: z.string().min(2, "Příjmení je povinné"),
    Address: z.string().min(5, "Adresa je povinná"),
    Zip: z.string().regex(/^\d{3} ?\d{2}$/, "Neplatné PSČ (formát 123 45)"),
    City: z.string().min(2, "Město je povinné"),
    Email: z.string().email("Neplatný formát emailu"),
    Phone: z.string().regex(/^((\+420 ?)|(00420 ?))?\d{3} ?\d{3} ?\d{3}$/, "Neplatné telefonní číslo (formát +420 123 456 789)"),
};

// Schéma pro 1 kočku (VRÁCENA VŠECHNA POLE)
const catSchema = z.object({
    // Základní údaje
    titleBefore: z.string().optional(),
    catName: z.string().min(2, "Jméno zvířete je povinné"),
    titleAfter: z.string().optional(),
    chipNumber: z.string().optional().refine(val => !val || /^\d{15}$/.test(val), {
        message: "Čip musí mít 15 číslic"
    }),
    gender: z.enum(['male', 'female'], { required_error: "Pohlaví je povinné" }),
    neutered: z.enum(['yes', 'no'], { required_error: "Uveďte, zda je kastrované" }),
    emsCode: z.string().min(4, "EMS kód je povinný (např. BRI ns 24)"),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum narození je povinné"),
    showClass: z.string().min(1, "Třída je povinná"),
    pedigreeNumber: z.string().optional(),
    cageType: z.string().min(1, "Typ klece je povinný"),

    // Matka
    motherTitleBefore: z.string().optional(),
    motherName: z.string().optional(),
    motherTitleAfter: z.string().optional(),
    motherBreed: z.string().optional(),
    motherEmsCode: z.string().optional(),
    motherColor: z.string().optional(),
    motherPedigreeNumber: z.string().optional(),

    // Otec
    fatherTitleBefore: z.string().optional(),
    fatherName: z.string().optional(),
    fatherTitleAfter: z.string().optional(),
    fatherBreed: z.string().optional(),
    fatherEmsCode: z.string().optional(),
    fatherColor: z.string().optional(),
    fatherPedigreeNumber: z.string().optional(),
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
    notes: z.string().optional(),
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