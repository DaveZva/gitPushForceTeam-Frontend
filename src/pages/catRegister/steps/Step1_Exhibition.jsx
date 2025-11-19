import React, { useState, useEffect } from 'react';
import { registrationApi } from '../../../services/api/registrationApi';

export function Step1_Exhibition({ data, onChange }) {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error('Chyba při načítání výstav:', error);
            } finally {
                setLoading(false);
            }
        };
        loadShows();
    }, []);

    return (
        <div className="registration-form">
            <h2>Výběr výstavy</h2>

            <div className="form-section">
                <div className="form-field">
                    <label htmlFor="showId">Výstava *</label>
                    {loading ? (
                        <p>Načítám výstavy...</p>
                    ) : (
                        <select
                            id="showId"
                            name="showId"
                            value={data.showId || ''}
                            onChange={onChange}
                            required
                        >
                            <option value="">Vyberte výstavu...</option>
                            {shows.map(show => (
                                <option key={show.id} value={show.id}>
                                    {show.name} ({show.date})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-field">
                    <label>Účast na výstavě *</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="days"
                                value="sat"
                                checked={data.days === 'sat'}
                                onChange={onChange}
                            />
                            Sobota
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="days"
                                value="sun"
                                checked={data.days === 'sun'}
                                onChange={onChange}
                            />
                            Neděle
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="days"
                                value="both"
                                checked={data.days === 'both'}
                                onChange={onChange}
                            />
                            Oba dny
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}