import api from "../api";

export interface StewardQueueEntry {
    id: number;
    catalogNumber: number;
    catName: string;
    ems: string;
    sex: string;
    birthDate: string;
    status: 'WAITING' | 'READY' | 'JUDGING' | 'DONE' | 'ABSENT';
    urgency: string;
    callingRecordId?: number;
    judgeId: number;
    group?: string;
    category?: string;
    breed?: string;
}

export interface StewardJudgeDto {
    id: number;
    name: string;
    isLocked: boolean;
    lockedBySteward: string | null;
    isLockedByMe: boolean;
    tableNumber: number | null;
}

export const stewardApi = {
    getJudges: async (showId: number): Promise<StewardJudgeDto[]> => {
        const res = await api.get(`/steward/shows/${showId}/judges`);
        return res.data;
    },

    lockJudge: async (showId: number, judgeId: number, tableNumber: number): Promise<boolean> => {
        const res = await api.post(`/steward/shows/${showId}/judges/${judgeId}/lock`, { tableNumber });
        return res.data.success;
    },

    unlockJudge: async (showId: number, judgeId: number): Promise<void> => {
        await api.post(`/steward/shows/${showId}/judges/${judgeId}/unlock`);
    },

    getQueue: async (showId: number, judgeId: number): Promise<StewardQueueEntry[]> => {
        const res = await api.get(`/steward/shows/${showId}/judges/${judgeId}/queue`);
        return res.data;
    },

    updateSheetStatus: async (sheetId: number, status: string): Promise<void> => {
        await api.patch(`/steward/sheets/${sheetId}/status`, { status });
    },

    callToBoard: async (payload: { showId: number, tableNo: string, judgeName: string, catNumber: number, category: string, urgency: string }) => {
        const res = await api.post('/calling/call', payload);
        return res.data;
    },

    removeFromBoard: async (callingRecordId: number) => {
        await api.delete(`/calling/${callingRecordId}`);
    },

    updateUrgency: async (callingRecordId: number, urgency: string) => {
        const res = await api.patch(`/calling/${callingRecordId}/urgency`, { urgency });
        return res.data;
    }
};