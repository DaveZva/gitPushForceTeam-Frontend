import React, { useState, useEffect } from 'react';
import { storageUtils } from '../../../utils/storage';

export function Step3_BreederInfo({ data, onChange, onLoadBreeder }) {
    const [savedBreeders, setSavedBreeders] = useState([]);

    useEffect(() => {
        setSavedBreeders(storageUtils.getBreeders());
    }, []);

    const handleLoadBreeder = (e) => {
        const breederId = parseInt(e.target.value);
        if (breederId) {
            const breeder = savedBreeders.find(b => b.id === breederId);
            if (breeder) {
                onLoadBreeder(breeder);
            }
        }
    };

    return (
        <div className="registration-form">
            <h2>Údaje o chovateli</h2>

            {savedBreeders.length > 0 && (
                <div className="form-field" style={{ backgroundColor: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <label>Načíst uloženého chovatele</label>
                    <select onChange={handleLoadBreeder} defaultValue="">
                        <option value="">-- Vyberte ze seznamu --</option>
                        {savedBreeders.map(breeder => (
                            <option key={breeder.id} value={breeder.id}>
                                {breeder.firstName} {breeder.lastName} ({breeder.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="form-section">
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="breederFirstName">Jméno *</label>
                        <input
                            type="text"
                            id="breederFirstName"
                            name="breederFirstName"
                            value={data.breederFirstName || ''}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="breederLastName">Příjmení *</label>
                        <input
                            type="text"
                            id="breederLastName"
                            name="breederLastName"
                            value={data.breederLastName || ''}
                            onChange={onChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="breederAddress">Ulice a číslo popisné *</label>
                    <input
                        type="text"
                        id="breederAddress"
                        name="breederAddress"
                        value={data.breederAddress || ''}
                        onChange={onChange}
                        required
                        placeholder="Např. Hlavní 123"
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="breederZip">PSČ *</label>
                        <input
                            type="text"
                            id="breederZip"
                            name="breederZip"
                            value={data.breederZip || ''}
                            onChange={onChange}
                            required
                            placeholder="123 45"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="breederCity">Město *</label>
                        <input
                            type="text"
                            id="breederCity"
                            name="breederCity"
                            value={data.breederCity || ''}
                            onChange={onChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="breederEmail">Email *</label>
                        <input
                            type="email"
                            id="breederEmail"
                            name="breederEmail"
                            value={data.breederEmail || ''}
                            onChange={onChange}
                            required
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="breederPhone">Telefon *</label>
                        <input
                            type="phone"
                            id="breederPhone"
                            name="breederPhone"
                            value={data.breederPhone || ''}
                            onChange={onChange}
                            required
                            placeholder="+420 123 456 789"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}