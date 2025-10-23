import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Importy
import { AppLayout } from './layouts/AppLayout'; // Náš nový "obal"
import Dashboard from './pages/Dashboard';
import HealthCheckPage from './pages/HealthCheck';

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
                        <Route path="health" element={<HealthCheckPage />} />
                        {/* Placeholder stránky pro odkazy v navigaci */}
                        <Route path="apply" element={<h2>{t('nav.newApplication')}</h2>} />
                        <Route path="my-applications" element={<h2>{t('nav.myApplications')}</h2>} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;