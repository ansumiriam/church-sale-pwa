import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDB, Counter } from '../db/db';

const HomePage: React.FC = () => {
    const [counter, setCounter] = useState<Counter | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const db = await getDB();
                const counters = await db.getAll('counter');
                if (counters.length > 0) {
                    setCounter(counters[0]);
                }
            } catch (err) {
                console.error("Error fetching counter:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounter();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Status Section */}
            <div style={styles.statusCard}>
                <h3 style={styles.statusTitle}>Station Status</h3>
                {counter ? (
                    <div style={styles.statusInfo}>
                        <p><strong>Counter:</strong> {counter.name}</p>
                        {counter.operatorName && <p><strong>Operator:</strong> {counter.operatorName}</p>}
                    </div>
                ) : (
                    <div style={styles.warningBox}>
                        <p style={styles.warningText}>⚠️ Counter not configured</p>
                        <Link to="/counter-setup" style={styles.setupLink}>Setup Now</Link>
                    </div>
                )}
                <div style={styles.syncStatus}>
                    <small>Last Sync: Not synced</small>
                </div>
            </div>

            {/* Actions Grid */}
            <div style={styles.grid}>
                <Link to="/new-sale" style={{ ...styles.card, ...styles.primaryCard }}>
                    <div style={styles.cardContent}>
                        <span style={styles.icon}>🛒</span>
                        <span style={styles.cardTitle}>New Sale</span>
                    </div>
                </Link>

                <Link to="/inventory" style={styles.card}>
                    <div style={styles.cardContent}>
                        <span style={styles.icon}>📦</span>
                        <span style={styles.cardTitle}>Manage Inventory</span>
                    </div>
                </Link>

                <Link to="/sales-history" style={styles.card}>
                    <div style={styles.cardContent}>
                        <span style={styles.icon}>📜</span>
                        <span style={styles.cardTitle}>Sales History</span>
                    </div>
                </Link>

                <Link to="/counter-setup" style={styles.card}>
                    <div style={styles.cardContent}>
                        <span style={styles.icon}>⚙️</span>
                        <span style={styles.cardTitle}>Counter Setup</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
    },
    statusCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        borderLeft: '5px solid #007BFF',
    },
    statusTitle: {
        margin: '0 0 1rem 0',
        color: '#333',
        fontSize: '1.2rem',
    },
    statusInfo: {
        marginBottom: '1rem',
        lineHeight: '1.6',
    },
    warningBox: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    warningText: {
        margin: '0 0 0.5rem 0',
        fontWeight: 'bold',
    },
    setupLink: {
        color: '#856404',
        textDecoration: 'underline',
        fontWeight: 'bold',
    },
    syncStatus: {
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '0.5rem',
        marginTop: '0.5rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        textDecoration: 'none',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #eee',
    },
    primaryCard: {
        backgroundColor: '#007BFF',
        color: '#fff',
        gridColumn: '1 / -1', // Span full width
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    icon: {
        fontSize: '2rem',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },
};

export default HomePage;
