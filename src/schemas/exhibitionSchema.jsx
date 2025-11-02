import { z } from 'zod';

export const exhibitionSchema = z.object({
    name: z.string().min(3, "Název výstavy je povinný (min. 3 znaky)"),
    description: z.string().optional(),
    status: z.enum(['PLANNED', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'], {
        required_error: "Status je povinný"
    }),

    // Místo konání
    venueName: z.string().min(3, "Název místa je povinný"),
    venueAddress: z.string().optional(),
    venueCity: z.string().optional(),
    venueState: z.string().optional(),
    venueZip: z.string().optional(),

    // Data
    // Používáme z.string() protože input type="datetime-local" vrací string
    // a validujeme, že je to platný ISO datetime string
    startDate: z.string().datetime({ message: "Neplatný formát data a času" }),
    endDate: z.string().datetime({ message: "Neplatný formát data a času" }),
    registrationDeadline: z.string().datetime({ message: "Neplatný formát data a času" }),

    // Organizátor
    organizerName: z.string().min(2, "Jméno organizátora je povinné"),
    contactEmail: z.string().email("Neplatný formát emailu").optional().or(z.literal('')),
    websiteUrl: z.string().url("Neplatný formát URL (musí začínat http:// nebo https://)").optional().or(z.literal('')),

}).refine(data => {
    // Ověření, že datum konce je po datu začátku
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "Datum konce musí být po datu začátku",
    path: ["endDate"], // Kde se chyba zobrazí
});
