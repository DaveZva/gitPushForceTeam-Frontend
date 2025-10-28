import React, { useState, useEffect } from 'react';
import { storageUtils } from '../../../utils/storage';

export function Step4_ExhibitorInfo({ data, onChange, onLoadExhibitor, onCopyBreeder }) {
    const [savedExhibitors, setSavedExhibitors] = useState([]);

    useEffect(() => {
        setSavedExhibitors(storageUtils.getExhibitors());
    }, []);

    const handleLoadExhibitor = (e) => {
        const exhibitorId = parseInt(e.target.value);
        if (exhibitorId) {
            const exhibitor = savedExhibitors.find(ex => ex.id === exhibitorId);
            if (exhibitor) {
                onLoadExhibitor(exhibitor);
            }
        }
    };

    return (
        <div className="registration-form">
            <h2>Údaje o vystavovateli</h2>

            {savedExhibitors.length > 0 && !data.sameAsBreeder && (
                <div className="form-field" style={{ backgroundColor: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <label>Načíst uloženého vystavovatele</label>
                    <select onChange={handleLoadExhibitor} defaultValue="">
                        <option value="">-- Vyberte ze seznamu --</option>
                        {savedExhibitors.map(exhibitor => (
                            <option key={exhibitor.id} value={exhibitor.id}>
                                {exhibitor.firstName} {exhibitor.lastName} ({exhibitor.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="info-box" style={{ backgroundColor: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        id="sameAsBreeder"
                        checked={data.sameAsBreeder || false}
                        onChange={onCopyBreeder}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.95rem' }}>
            Vystavovatel je stejný jako chovatel
          </span>
                </label>
            </div>

            <div className="form-section" style={{ opacity: data.sameAsBreeder ? 0.5 : 1 }}>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="exhibitorFirstName">Jméno *</label>
                        <input
                            type="text"
                            id="exhibitorFirstName"
                            name="exhibitorFirstName"
                            value={data.exhibitorFirstName || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="exhibitorLastName">Příjmení *</label>
                        <input
                            type="text"
                            id="exhibitorLastName"
                            name="exhibitorLastName"
                            value={data.exhibitorLastName || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="exhibitorAddress">Ulice a číslo popisné *</label>
                    <input
                        type="text"
                        id="exhibitorAddress"
                        name="exhibitorAddress"
                        value={data.exhibitorAddress || ''}
                        onChange={onChange}
                        required
                        disabled={data.sameAsBreeder}
                        placeholder="Např. Hlavní 123"
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="exhibitorZip">PSČ *</label>
                        <input
                            type="text"
                            id="exhibitorZip"
                            name="exhibitorZip"
                            value={data.exhibitorZip || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                            placeholder="123 45"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="exhibitorCity">Město *</label>
                        <input
                            type="text"
                            id="exhibitorCity"
                            name="exhibitorCity"
                            value={data.exhibitorCity || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="exhibitorEmail">Email *</label>
                        <input
                            type="email"
                            id="exhibitorEmail"
                            name="exhibitorEmail"
                            value={data.exhibitorEmail || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="exhibitorPhone">Telefon *</label>
                        <input
                            type="phone"
                            id="exhibitorPhone"
                            name="exhibitorPhone"
                            value={data.exhibitorPhone || ''}
                            onChange={onChange}
                            required
                            disabled={data.sameAsBreeder}
                            placeholder="+420 123 456 789"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}