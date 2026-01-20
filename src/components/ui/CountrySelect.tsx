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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div
                className={`w-full px-4 py-2 border rounded-xl bg-white cursor-pointer flex items-center justify-between transition-colors
                    ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}
                    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setSearch('');
                }}
            >
                <span className={`block truncate ${!displayValue ? 'text-gray-400' : 'text-gray-900'}`}>
                    {displayValue || placeholder || '-- Select --'}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto animate-fade-in">
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                        <input
                            type="text"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Hledat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                            <div
                                key={c.code}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center
                                    ${value === c.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                onClick={() => {
                                    onChange(c.code);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                            >
                                <span className="inline-block w-8 text-gray-400 text-xs mr-2 font-mono">{c.code}</span>
                                {getDisplayName(c)}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            Nenalezeno
                        </div>
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};