import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Secretariat from './pages/secretariat/ExhibitionManagementPage';
import CatRegisterPage from './pages/catRegister/CatRegistrationForm';
import NewExhibition from './pages/secretariat/ExhibitionCreatePage';
// import EditExhibition from './pages/secretariat/ExhibitionEditPage';

function App() {
    const { t } = useTranslation();

    return (
        <AuthProvider>
            {/* BrowserRouter může zůstat i zde, i když je častější v main.jsx */}
            <BrowserRouter>
                <Routes>
                    {/* Všechny cesty uvnitř použijí AppLayout (s hlavičkou) */}
                    <Route path="/" element={<AppLayout />}>

                        {/* Základní cesty */}
                        <Route index element={<Dashboard />} />
                        <Route path="apply" element={<CatRegisterPage />} />
                        <Route path="my-applications" element={<h2>{t('nav.myApplications')}</h2>} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />

                        <Route path="secretariat">
                            <Route path="exhibition" element={<Secretariat />}>
                                <Route index element={<Secretariat />} />
                                <Route path="new" element={<NewExhibition />} />
                                {/* <Route path="edit/:id" element={<EditExhibition />} /> */}
                            </Route>
                            {/* <Route path="users" element={<h2>Správa uživatelů</h2>} /> */}
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
export default App;
