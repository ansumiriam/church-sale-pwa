import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <div className="app-container">
            <header>
                <h1>Church Sale</h1>
                <nav>
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/inventory" className={isActive('/inventory')}>Items</Link>
                    <Link to="/new-sale" className={isActive('/new-sale')}>Sell</Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
