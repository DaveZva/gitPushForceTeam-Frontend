import { useState, useEffect, useMemo } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { secretariatApi } from "../../services/api/secretariatApi";

interface Props {
    showId: string | number;
    judgeId: number;
    date: string;
}

const formatDate = (dateInput: any) => {
    if (!dateInput) return "";
    try {
        if (Array.isArray(dateInput)) {
            const [y, m, d] = dateInput;
            return `${d}.${m}.${y}`;
        }
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return String(dateInput);
        return d.toLocaleDateString("cs-CZ");
    } catch {
        return "";
    }
};

export const JudgeReportDetail = ({ showId, judgeId, date }: Props) => {
    const { t } = useTranslation();
    const [sheets, setSheets] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const basicList = await secretariatApi.getJudgeSheets(showId, judgeId, date);

                if (!Array.isArray(basicList)) {
                    setSheets([]);
                    return;
                }

                const enrichedData = await Promise.all(basicList.map(async (sheet) => {
                    try {
                        if (sheet.catEntryId) {
                            const detail = await secretariatApi.getEntryDetail(sheet.catEntryId);
                            return { ...sheet, ...detail, _hasDetails: true };
                        }
                        return sheet;
                    } catch (e) {
                        console.error(`Failed to fetch details for entry ${sheet.catEntryId}`, e);
                        return sheet;
                    }
                }));

                setSheets(enrichedData);
            } catch (err) {
                console.error(err);
                setSheets([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [showId, judgeId, date]);

    const columns = useMemo(() => [
        { key: "no", label: "No." },
        { key: "ems", label: "EMS" },
        { key: "sex", label: "Sex" },
        { key: "class", label: "Class" },
        { key: "born", label: "Born" },
        { key: "AdM", label: "Ad M" },
        { key: "AdF", label: "Ad F" },
        { key: "NeM", label: "Ne M", disabled: true },
        { key: "NeF", label: "Ne F", disabled: true },
        { key: "11M", label: "11 M" },
        { key: "11F", label: "11 F" },
        { key: "12M", label: "12 M" },
        { key: "12F", label: "12 F" },
        { key: "results", label: "Results" }
    ], []);

    if (isLoading) return <LoadingSpinner className="py-24" />;

    return (
        <div className="p-6">
            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-[11px] min-w-[1200px]">
                    <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className={`bg-[#027BFF] text-white p-2 font-bold border border-blue-600 whitespace-nowrap ${col.disabled ? "line-through opacity-60" : ""}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sheets.map((row, index) => {
                        const ems = row.emsCode || row.ems || "";

                        const born = formatDate(row.birthDate || row.dob);

                        const classCode = row.showClassCode;

                        const genderStr = String(row.gender || row.sex || "").toUpperCase();
                        const isMale = genderStr === "MALE" || genderStr === "M";

                        let isNeuter = row.neutered === true;
                        if (["10", "2", "4", "6", "8"].includes(classCode)) {
                            isNeuter = true;
                        }

                        const getMark = (col: string) => {
                            if (!classCode) return "";

                            if (classCode === "11") return col === (isMale ? "11M" : "11F") ? "X" : "";
                            if (classCode === "12") return col === (isMale ? "12M" : "12F") ? "X" : "";

                            const adultClasses = ["1","2","3","4","5","6","7","8","9","10","13a","13b","13c","14","15","16","17"];
                            const neuterClasses = ["2","4","6","8","10"];

                            if (adultClasses.includes(classCode) || /^\d/.test(classCode)) {
                                if (isNeuter || neuterClasses.includes(classCode)) {
                                    return col === (isMale ? "NeM" : "NeF") ? "X" : "";
                                }
                                return col === (isMale ? "AdM" : "AdF") ? "X" : "";
                            }
                            return "";
                        };

                        return (
                            <tr key={row.catalogNumber ?? index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-2 border text-center font-bold">{row.catalogNumber}</td>
                                <td className="p-2 border text-left font-medium">{ems}</td>
                                <td className="p-2 border text-center">{isMale ? "1,0" : "0,1"}</td>
                                <td className="p-2 border text-center font-bold">{classCode}</td>
                                <td className="p-2 border text-center">{born}</td>

                                {["AdM","AdF","NeM","NeF","11M","11F","12M","12F"].map(col => (
                                    <td key={col} className={`p-2 border text-center font-bold ${getMark(col) ? "text-[#027BFF] bg-blue-50/50" : ""} ${(col === "NeM" || col === "NeF") ? "line-through text-gray-300" : ""}`}>
                                        {getMark(col)}
                                    </td>
                                ))}
                                <td className="p-2 border text-left italic text-gray-400">In Progress</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-gray-500 text-sm text-left">{t("catalog.totalCats")}: {sheets.length}</p>
        </div>
    );
};