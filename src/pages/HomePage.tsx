import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="card">
            <h2>Welcome</h2>
            <p>Select an action below:</p>
            <ul>
                <li><Link to="/new-sale">New Sale</Link></li>
                <li><Link to="/inventory">Manage Inventory</Link></li>
                <li><Link to="/sales-history">Sales History</Link></li>
                <li><Link to="/counter-setup">Counter Setup</Link></li>
            </ul>
        </div>
    );
};

export default HomePage;
