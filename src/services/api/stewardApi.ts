import api from "../api";

export interface StewardQueueEntry {
    id: number;
    catalogNumber: number;
    catName: string;
    ems: string;
    sex: string;
    birthDate: string;
    status: 'WAITING' | 'READY' | 'JUDGING' | 'DONE' | 'ABSENT';
    urgency: boolean;
    note?: string;
    judgeId: number;
    group?: string;
    category?: string;
    breed?: string;
}

export interface JudgeInfo {
    id: number;
    name: string;
}

export const stewardApi = {
    getJudges: async (): Promise<JudgeInfo[]> => {
        return [
            { id: 1, name: "Dr. Peter First" },
            { id: 2, name: "Mrs. Anna Second" }
        ];
    },

    getQueue: async (judgeId: number): Promise<StewardQueueEntry[]> => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i + 1,
            catalogNumber: 100 + i,
            catName: `Cat Name ${i + 1}`,
            ems: "MCO n 03",
            sex: i % 2 === 0 ? "1.0" : "0.1",
            birthDate: "2023-01-01",
            status: i === 0 ? 'JUDGING' : i === 1 ? 'READY' : 'WAITING',
            urgency: false,
            judgeId: judgeId,
            breed: "MCO",
            category: "II"
        })) as StewardQueueEntry[];
    },

    updateStatus: async (entryId: number, status: string, urgency: boolean = false) => {
        return Promise.resolve();
    },

    callForAction: async (entryId: number, actionType: 'JUDGING' | 'BIV' | 'BIS' | 'NOMINATION') => {
        return Promise.resolve();
    }
};