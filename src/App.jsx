import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';

import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Secretariat from './pages/secretariat/ExhibitionManagementPage.jsx';
import CatRegisterPage from './pages/catRegister/CatRegistrationForm';

function App() {
    // 't' potřebujeme pro texty na placeholder stránkách
    const { t } = useTranslation();

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Všechny cesty uvnitř použijí AppLayout (s hlavičkou) */}
                    <Route path="/" element={<AppLayout />}>

                        <Route index element={<Dashboard />} />
                        <Route path="apply" element={<CatRegisterPage />} />
                        <Route path="exhibitions" element={<Secretariat />} />
                        <Route path="my-applications" element={<h2>{t('nav.myApplications')}</h2>} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;