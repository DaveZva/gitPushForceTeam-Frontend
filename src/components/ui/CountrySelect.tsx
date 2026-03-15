import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { countries, Country } from '../../data/countries';

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
                                                                value,
                                                                onChange,
                                                                label,
                                                                placeholder,
                                                                error
                                                            }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const getDisplayName = (c: Country) => i18n.language === 'cs' ? c.name_cs : c.name_en;

    const selectedCountry = countries.find(c => c.code === value);
    const displayValue = selectedCountry ? getDisplayName(selectedCountry) : value;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredCountries = useMemo(() => {
        const lowerSearch = search.toLowerCase();
        return countries.filter(c =>
            getDisplayName(c).toLowerCase().includes(lowerSearch)
        );
    }, [search, i18n.language]);

    return (
        <div className="w-full relative" ref={wrapperRef}>
            {label && (
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                    {label}
                </label>
            )}

            <div
                className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 cursor-pointer flex items-center justify-between transition-all
                    ${error ? 'border-red-500' : 'border-gray-100 hover:border-gray-200'}
                    focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#027BFF]`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setSearch('');
                }}
            >
                <span className={`block truncate font-medium ${!displayValue ? 'text-gray-400' : 'text-gray-900'}`}>
                    {displayValue || placeholder || '-- Select --'}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-[10001] w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-hidden flex flex-col animate-fade-in">
                    <div className="p-3 sticky top-0 bg-white border-b border-gray-100">
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-100 text-black placeholder-gray-500 rounded-xl text-sm border-2 border-transparent focus:border-[#027BFF] focus:bg-white outline-none transition-all"
                            placeholder="Hledat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>

                    <div className="overflow-y-auto max-h-48 scrollbar-thin">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                                <div
                                    key={c.code}
                                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center
                                        ${value === c.code ? 'bg-blue-50 text-[#027BFF] font-bold' : 'text-gray-700 font-medium'}`}
                                    onClick={() => {
                                        onChange(c.code);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <span className="inline-block w-8 text-gray-400 text-[10px] mr-2 font-mono font-bold">{c.code}</span>
                                    {getDisplayName(c)}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-sm text-gray-400 text-center italic">
                                Nenalezeno
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};