import { Outlet } from 'react-router-dom';
import { MainHeader } from '../components/MainHeader';

export function AppLayout() {
    return (
        <>
            <MainHeader />
            <main className="container">
                {/* Zde se vykreslí obsah stránky (Dashboard, HealthCheck, atd.) */}
                <Outlet />
            </main>
        </>
    );
}