import React, { useState } from 'react';
import '../../../styles/Step2_CatInfo.css';

const FormField = ({ label, name, value, onChange, placeholder, type = 'text', required = false, children }) => (
    <div className="form-field">
        <label htmlFor={name}>{label}</label>
        {type === 'select' ? (
            <select
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                required={required}
            >
                {children}
            </select>
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        )}
    </div>
);

export function Step2_CatInfo({ data, onChange }) {
    const [activeTab, setActiveTab] = useState('basic');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div className="form-grid-3-col">
                        <FormField
                            label="Titul(y) před"
                            name="titleBefore"
                            type="select"
                            value={data.titleBefore}
                            onChange={onChange}
                            placeholder="GIC"
                        >
                            <option value="champion">CH</option>
                            <option value="inter-champion">IC</option>
                            <option value="grand-inter-champion">GIC</option>
                            <option value="supreme-champion">SC</option>
                            <option value="national-winner">NV</option>
                            <option value="world-winner">WW</option>
                            <option value="junior-world-winner">JWW</option>
                        </FormField>

                        <FormField
                            label="Jméno zvířete"
                            name="catName"
                            value={data.catName}
                            onChange={onChange}
                            placeholder="Molly"
                            //required
                        />

                        <FormField
                            label="Titul(y) za"
                            name="titleAfter"
                            type="select"
                            value={data.titleAfter}
                            onChange={onChange}
                            placeholder="JW"
                        >
                            <option value="junior-winner">JW</option>
                            <option value="distinguished-show-merit">DSM</option>
                            <option value="distinguished-variety-merit">DVM</option>
                            <option value="distinguished-merit">DM</option>
                        </FormField>

                        <FormField
                            label="Čip"
                            name="chipNumber"
                            value={data.chipNumber}
                            onChange={onChange}
                            placeholder="15 místné číslo"
                        />

                        <FormField
                            label="Pohlaví"
                            name="gender"
                            type="select"
                            value={data.gender}
                            onChange={onChange}
                            //required
                        >
                            <option value="male">Kocour (1.0)</option>
                            <option value="female">Kočka (0.1)</option>
                        </FormField>
                        <FormField
                            label="Kastrované"
                            name="neutered"
                            type="select"
                            value={data.neutered}
                            onChange={onChange}
                            //required
                        >
                            <option value="yes">Ano</option>
                            <option value="no">Ne</option>
                        </FormField>

                        <div className="form-field">
                            <label htmlFor="emsPrefix">EMS kód</label>
                            <div className="ems-input-group">
                                <select
                                    id="emsPrefix"
                                    name="emsPrefix"
                                    value={data.emsCode?.substring(0, 3) || ''}
                                    onChange={(e) => {
                                        const newPrefix = e.target.value;
                                        const currentSuffix = data.emsCode?.substring(4) || '';
                                        onChange({
                                            target: {
                                                name: 'emsCode',
                                                value: `${newPrefix} ${currentSuffix}`
                                            }
                                        });
                                    }}
                                >
                                    <option value="BRI">BRI</option> {/* Britská */}
                                    <option value="PER">PER</option> {/* Perská */}
                                    <option value="MCO">MCO</option> {/* Maine Coon */}
                                    <option value="SIA">SIA</option> {/* Siamská */}
                                    <option value="BEN">BEN</option> {/* Bengálská */}
                                    <option value="RAG">RAG</option> {/* Ragdoll */}
                                    <option value="SFO">SFO</option> {/* Scottish Fold */}
                                    <option value="OTH">OTH</option> {/* Jiné */}
                                </select>

                                <input
                                    type="text"
                                    name="emsSuffix"
                                    value={data.emsCode?.substring(4) || ''}
                                    onChange={(e) => {
                                        const newSuffix = e.target.value;
                                        const currentPrefix = data.emsCode?.substring(0, 3) || '';
                                        onChange({
                                            target: {
                                                name: 'emsCode',
                                                value: `${currentPrefix} ${newSuffix}`
                                            }
                                        });
                                    }}
                                    placeholder="ns 24"
                                />
                            </div>
                        </div>

                        <FormField
                            label="Datum narození"
                            name="birthDate"
                            type="date"
                            value={data.birthDate}
                            onChange={onChange}
                            //required
                        />

                        <FormField
                            label="Třída (IFR/SCHK)"
                            name="showClass"
                            type="select"
                            value={data.showClass}
                            onChange={onChange}
                        >
                            <option value="class7">Třída 7 - otevrená</option>
                            <option value="class6">Třída 6 - čestná</option>
                            <option value="class5">Třída 5 - veteránů</option>
                            <option value="class4">Třída 4 - kastráti</option>
                            <option value="class3">Třída 3 - mladých</option>
                            <option value="class2">Třída 2 - juniorů</option>
                            <option value="class1">Třída 1 - koťat</option>
                        </FormField>

                        <FormField
                            label="Registrační číslo"
                            name="pedigreeNumber"
                            value={data.pedigreeNumber}
                            onChange={onChange}
                            placeholder="CSZ FO 1234/18"
                        />

                        <FormField
                            label="Typ klece"
                            name="cageType"
                            type="select"
                            value={data.cageType}
                            onChange={onChange}
                        >
                            <option value="class7">Vlastní klec - 1700 CZK</option>
                            <option value="class6">Klec k zapůjčení 70x70 - 2200 CZK</option>
                            <option value="class5">Klec k zapůjčení 120x70 - 2800 CZK</option>
                        </FormField>
                    </div>
                );
            case 'pedigree':
                return (
                    <div className="form-grid-3-col">
                        <FormField
                            label="Titul(y) před"
                            name="motherTitleBefore"
                            value={data.motherTitleBefore}
                            onChange={onChange}
                            placeholder="CH"
                        />
                        <FormField
                            label="Jméno zvířete"
                            name="motherName"
                            value={data.motherName}
                            onChange={onChange}
                            placeholder="Jméno matky"
                        />
                        <FormField
                            label="Titul(y) za"
                            name="motherTitleAfter"
                            value={data.motherTitleAfter}
                            onChange={onChange}
                        />
                        <FormField
                            label="Plemeno"
                            name="motherBreed"
                            value={data.motherBreed}
                            onChange={onChange}
                            placeholder="Britská krátkosrstá"
                        />
                        <FormField
                            label="EMS kód"
                            name="motherEmsCode"
                            value={data.motherEmsCode}
                            onChange={onChange}
                        />
                        <FormField
                            label="Barva"
                            name="motherColor"
                            value={data.motherColor}
                            onChange={onChange}
                        />
                        <FormField
                            label="Registrační číslo"
                            name="motherPedigreeNumber"
                            value={data.motherPedigreeNumber}
                            onChange={onChange}
                        />
                    </div>
                );
            case 'breeder':
                return (
                    <div className="form-grid-3-col">
                        <FormField
                            label="Titul(y) před"
                            name="fatherTitleBefore"
                            value={data.fatherTitleBefore}
                            onChange={onChange}
                            placeholder="GIC"
                        />
                        <FormField
                            label="Jméno zvířete"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={onChange}
                            placeholder="Jméno otce"
                        />
                        <FormField
                            label="Titul(y) za"
                            name="fatherTitleAfter"
                            value={data.fatherTitleAfter}
                            onChange={onChange}
                        />
                        <FormField
                            label="Plemeno"
                            name="fatherBreed"
                            value={data.fatherBreed}
                            onChange={onChange}
                            placeholder="Britská krátkosrstá"
                        />
                        <FormField
                            label="EMS kód"
                            name="fatherEmsCode"
                            value={data.fatherEmsCode}
                            onChange={onChange}
                        />
                        <FormField
                            label="Barva"
                            name="fatherColor"
                            value={data.fatherColor}
                            onChange={onChange}
                        />
                        <FormField
                            label="Registrační číslo"
                            name="fatherPedigreeNumber"
                            value={data.fatherPedigreeNumber}
                            onChange={onChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="step-content-wrapper">
                <div className="tabs-with-button">
                    <div className="tabs-container">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            Údaje o zvířeti
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'pedigree' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pedigree')}
                        >
                            Rodokmen zvířete: Matka
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'breeder' ? 'active' : ''}`}
                            onClick={() => setActiveTab('breeder')}
                        >
                            Rodokmen zvířete: Otec
                        </button>
                    </div>
                    <button type="button" className="btn-add-animal">
                        + přidat další zvíře
                    </button>
                </div>

                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </>
    );
}
