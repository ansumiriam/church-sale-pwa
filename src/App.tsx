import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import NewSalePage from './pages/NewSalePage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import CounterSetupPage from './pages/CounterSetupPage';

const App: React.FC = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="new-sale" element={<NewSalePage />} />
                    <Route path="sales-history" element={<SalesHistoryPage />} />
                    <Route path="counter-setup" element={<CounterSetupPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
