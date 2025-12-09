import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import CatRegisterPage from './pages/catRegister/CatRegistrationForm';
import MyApplicationsPage from './pages/user/MyApplicationsPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import PaymentPage from './pages/user/PaymentPage';
import { PaymentResultPage } from './pages/user/PaymentResultPage';
import { PrivateRoute } from './components/PrivateRoute';
import Catalog from './pages/./catalog';

import { SecretariatLayout } from './layouts/SecretarialLayout'; // Vytvořeno v předchozím kroku
import SecretariatDashboard from './pages/secretariat/SecretariatDashboard'; // Vytvořeno v předchozím kroku
import ShowManagementPage from './pages/secretariat/ShowManagementPage'; // Seznam výstav
import { ShowCreatePage } from './pages/secretariat/ShowCreatePage';
import ShowControlCenter from './pages/secretariat/ShowControlCenter'; // Detail výstavy (řídící centrum)
import ShowEditPage from './pages/secretariat/ShowEditPage';

function App() {
    const { t } = useTranslation();
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>

                        <Route index element={<Dashboard />} />
                        <Route path="apply" element={<CatRegisterPage />} />
                        <Route path="my-applications" element={<MyApplicationsPage />} />
                        <Route path="my-cats" element={<h2>{t('nav.myCats')}</h2>} />
                        <Route path="catalog" element={<Catalog />} />
                        <Route path="catalog/:showId" element={<Catalog />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="payment/:registrationId" element={<PaymentPage />} />
                        <Route path="secretariat" element={<SecretariatLayout />}>
                            <Route index element={<SecretariatDashboard />} />
                            <Route path="shows" element={<ShowManagementPage />} />
                            <Route path="new/show" element={<ShowCreatePage />} />
                            <Route path="shows/:id" element={<ShowControlCenter />} />
                            <Route path="shows/:id/edit" element={<ShowEditPage />} />
                        </Route>
                        <Route path="/payment/result" element={
                            <PrivateRoute>
                                <Elements stripe={stripePromise}>
                                    <PaymentResultPage />
                                </Elements>
                            </PrivateRoute>
                        } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
export default App;
