import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainHeader } from '../components/MainHeader';

export function AppLayout() {
    return (
        <>
            <MainHeader />
            <main className="container">
                <Outlet />
            </main>
        </>
    );
}