import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Importy
import { AppLayout } from './layouts/AppLayout'; // Náš "obal"
import Dashboard from './pages/Dashboard';
import { ApplicationPage } from './pages/catRegister/ApplicationPage.jsx';
import Secretariat from './pages/secretariat/ExhibitionManagementPage.jsx';

function App() {
    // 't' potřebujeme pro texty na placeholder stránkách
    const { t } = useTranslation();

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Všechny cesty uvnitř použijí náš AppLayout (s hlavičkou) */}
                    <Route path="/" element={<AppLayout />}>

                        {/* index=true znamená, že toto je výchozí stránka pro "/" */}
                        <Route index element={<Dashboard />} />
                        <Route path="apply" element={<ApplicationPage />} />
                        <Route path="exhibitions" element={<Secretariat />} />

                        {/* Placeholder stránky pro odkazy v navigaci */}
                        <Route path="my-applications" element={<h2>{t('nav.myApplications')}</h2>} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;