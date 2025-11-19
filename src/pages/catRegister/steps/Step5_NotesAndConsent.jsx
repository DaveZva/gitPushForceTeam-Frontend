import React from 'react';

export function Step5_NotesAndConsent({ data, onChange }) {
    return (
        <div className="registration-form">
            <h2>Poznámky a souhlas</h2>

            <div className="form-section">
                <div className="form-field">
                    <label htmlFor="notes">Poznámky k přihlášce</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={data.notes || ''}
                        onChange={onChange}
                        rows="5"
                        placeholder="Zde můžete uvést jakékoliv poznámky k vaší přihlášce..."
                    />
                </div>

                <div className="consent-section">
                    <div className="consent-box">
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="dataAccuracy"
                                name="dataAccuracy"
                                checked={data.dataAccuracy || false}
                                onChange={(e) => onChange({ target: { name: 'dataAccuracy', value: e.target.checked } })}
                                required
                                style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                            />
                            <span style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                <strong>Prohlašuji, že všechny uvedené údaje jsou pravdivé a úplné.</strong> Jsem si vědom/a, že uvedení nepravdivých údajů může vést k vyloučení z výstavy.
              </span>
                        </label>
                    </div>

                    <div className="consent-box">
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="gdprConsent"
                                name="gdprConsent"
                                checked={data.gdprConsent || false}
                                onChange={(e) => onChange({ target: { name: 'gdprConsent', value: e.target.checked } })}
                                required
                                style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                            />
                            <span style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                <strong>Souhlasím se zpracováním osobních údajů</strong> v souladu s nařízením GDPR za účelem registrace na výstavu a dalších souvisejících činností.
              </span>
                        </label>
                    </div>
                </div>

                <div className="warning-box">
                    <strong>⚠️ Upozornění:</strong> Po odeslání přihlášky obdržíte potvrzovací email s platebními údaji. Přihláška bude aktivní po připsání platby na náš účet.
                </div>
            </div>
        </div>
    );
}