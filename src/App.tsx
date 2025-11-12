import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Secretariat from './pages/secretariat/ShowManagementPage';
import CatRegisterPage from './pages/catRegister/CatRegistrationForm';
import { ShowCreatePage } from './pages/secretariat/ShowCreatePage';
import MyApplicationsPage from './pages/owner/MyApplicationsPage';
// import EditExhibition from './pages/secretariat/ExhibitionEditPage';

function App() {
    const { t } = useTranslation();

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>

                        <Route index element={<Dashboard />} />
                        <Route path="apply" element={<CatRegisterPage />} />
                        <Route path="my-applications" element={<MyApplicationsPage />} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />

                        <Route path="secretariat">
                            <Route index element={<Secretariat />} />
                            <Route path="new/show" element={<ShowCreatePage />} />
                            {/* <Route path="edit/:id" element={<EditExhibition />} /> */}
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
export default App;
