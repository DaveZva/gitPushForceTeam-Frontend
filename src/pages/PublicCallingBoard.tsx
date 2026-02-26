import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../services/api';

interface BoardCat {
    catalogNumber: number;
    ems: string;
    type: string;
    urgency: string;
}

interface TableState {
    judgeId: number;
    judgeName: string;
    tableNo: string;
    currentCat: BoardCat | null;
    preparingCats: BoardCat[];
    waitingCats: BoardCat[];
}

const playGong = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();

        const playTone = (freq: number, startTime: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

            osc.start(startTime);
            osc.stop(startTime + 1.5);
        };

        const now = ctx.currentTime;
        playTone(659.25, now);
        playTone(523.25, now + 0.2);

    } catch (e) {
        console.error("Audio playback failed", e);
    }
};

export const PublicCallingBoard = () => {
    const { showId } = useParams<{ showId: string }>();
    const currentShowId = Number(showId) || 1;
    const [tables, setTables] = useState<TableState[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchBoardState = useCallback(async () => {
        try {
            const res = await api.get(`/calling/show/${currentShowId}/board-state`);
            setTables(res.data);
        } catch (error) {
            console.error(error);
        }
    }, [currentShowId]);

    useEffect(() => {
        if (!isStarted) return;

        fetchBoardState();

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-calling'),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/show/${currentShowId}/board`, () => {
                    fetchBoardState();
                    playGong();
                });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, [currentShowId, fetchBoardState, isStarted]);

    const getColorClass = (type: string, urgency: string) => {
        if (urgency === 'FINAL_CALL') return 'bg-red-600 text-white animate-pulse border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)]';
        if (urgency === 'URGENT') return 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]';

        switch (type) {
            case 'BIS': return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-2 border-yellow-300 shadow-xl';
            case 'BIV': return 'bg-gradient-to-br from-purple-600 to-purple-800 text-white border-2 border-purple-400 shadow-xl';
            case 'BOB': return 'bg-gradient-to-br from-green-500 to-green-700 text-white border-2 border-green-400 shadow-xl';
            default: return 'bg-slate-800 text-white border-2 border-slate-600 shadow-lg';
        }
    };

    const getTypeLabel = (type: string) => {
        if (type === 'NORMAL' || !type) return '';
        return <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase border border-white/20 shadow-lg z-10">{type}</span>;
    };

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-10 rounded-2xl text-center border border-slate-700 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-white mb-4">Calling Board</h1>
                    <p className="text-slate-400 mb-8">Click below to start the board and enable sound notifications.</p>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/30"
                    >
                        START BOARD
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-6 overflow-hidden flex flex-col font-sans">
            <header className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">ACTIVE JUDGING</h1>
                    <div className="text-slate-500 font-bold tracking-widest mt-1">CAT SHOW BROADCAST</div>
                </div>
                <div className="text-slate-400 font-mono text-xl">{currentTime.toLocaleTimeString()}</div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(tableNum => {
                    const table = tables.find(t => t.tableNo === `T${tableNum}`);

                    if (!table) {
                        return (
                            <div key={`empty-${tableNum}`} className="bg-slate-900/40 rounded-3xl border border-slate-800/40 flex flex-col overflow-hidden shadow-lg relative">
                                <div className="bg-slate-800/20 p-5 text-center border-b border-slate-800/40">
                                    <h2 className="text-2xl font-black text-slate-700 tracking-tight truncate">ČEKÁ NA STEVARDA</h2>
                                    <span className="inline-block mt-2 bg-slate-800/50 text-slate-500 px-3 py-1 rounded-full text-sm font-bold tracking-wider border border-slate-700/50 uppercase">STŮL {tableNum}</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col gap-6">
                                    <div className="flex-1">
                                        <div className="bg-slate-800/10 rounded-2xl border border-slate-800/50 border-dashed h-[220px] flex items-center justify-center text-slate-700 font-bold tracking-widest">
                                            NEOBSAZENO
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 opacity-20">
                                        <div className="bg-slate-800 rounded-lg h-[68px] border border-slate-700 border-dashed"></div>
                                        <div className="bg-slate-800 rounded-lg h-[68px] border border-slate-700 border-dashed"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={table.judgeId} className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative">
                            <div className="bg-slate-800 p-5 text-center border-b border-slate-700">
                                <h2 className="text-2xl font-black text-white tracking-tight truncate">{table.judgeName}</h2>
                                <span className="inline-block mt-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold tracking-wider border border-blue-500/30 uppercase">STŮL {tableNum}</span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col gap-6">
                                <div className="flex-1">
                                    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-3 text-center">Current Cat</div>
                                    {table.currentCat ? (
                                        <div className={`relative rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-[220px] ${getColorClass(table.currentCat.type, table.currentCat.urgency)}`}>
                                            {getTypeLabel(table.currentCat.type)}
                                            <span className="text-7xl font-black tracking-tighter leading-none mb-2">#{table.currentCat.catalogNumber}</span>
                                            <span className="text-xl font-bold opacity-80">{table.currentCat.ems}</span>
                                            {table.currentCat.urgency === 'FINAL_CALL' && <span className="mt-4 bg-white text-red-600 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest animate-bounce">Final Call!</span>}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 border-dashed h-[220px] flex items-center justify-center text-slate-600 font-bold">
                                            TABLE EMPTY
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 text-center text-yellow-500">Preparing</div>
                                        <div className="space-y-2">
                                            {table.preparingCats.length > 0 ? table.preparingCats.map(cat => (
                                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-4 border-yellow-500 rounded-lg p-3 text-center shadow-md">
                                                    <div className="text-2xl font-black text-white">#{cat.catalogNumber}</div>
                                                    <div className="text-xs text-slate-400 font-bold mt-1">{cat.ems}</div>
                                                </div>
                                            )) : (
                                                <div className="bg-slate-800/30 rounded-lg p-3 text-center text-slate-600 text-sm border border-slate-700/50 border-dashed">-</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Next In Line</div>
                                        <div className="space-y-2">
                                            {table.waitingCats.length > 0 ? table.waitingCats.map(cat => (
                                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-4 border-slate-600 rounded-lg p-3 text-center">
                                                    <div className="text-xl font-bold text-slate-300">#{cat.catalogNumber}</div>
                                                </div>
                                            )) : (
                                                <div className="bg-slate-800/30 rounded-lg p-3 text-center text-slate-600 text-sm border border-slate-700/50 border-dashed">-</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};