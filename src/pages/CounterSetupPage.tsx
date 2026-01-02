import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDB, Counter } from '../db/db';

const CounterSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [counterName, setCounterName] = useState('');
    const [operatorName, setOperatorName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkExistingCounter = async () => {
            try {
                const db = await getDB();
                const counters = await db.getAll('counter');
                if (counters.length > 0) {
                    navigate('/');
                }
            } catch (err) {
                console.error("Error checking counter:", err);
            } finally {
                setLoading(false);
            }
        };

        checkExistingCounter();
    }, [navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!counterName.trim()) {
            setError('Counter Name is required');
            return;
        }

        try {
            const db = await getDB();
            const newCounter: Counter = {
                name: counterName.trim(),
                operatorName: operatorName.trim() || undefined,
                createdAt: new Date(),
            };
            await db.add('counter', newCounter);
            navigate('/');
        } catch (err) {
            console.error("Error saving counter:", err);
            setError('Failed to save counter details.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Counter Setup</h2>
            <form onSubmit={handleSave} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="counterName" style={styles.label}>Counter Name *</label>
                    <input
                        id="counterName"
                        type="text"
                        value={counterName}
                        onChange={(e) => {
                            setCounterName(e.target.value);
                            if (e.target.value.trim()) setError(null);
                        }}
                        style={styles.input}
                        placeholder="e.g. Counter 1"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="operatorName" style={styles.label}>Operator Name</label>
                    <input
                        id="operatorName"
                        type="text"
                        value={operatorName}
                        onChange={(e) => setOperatorName(e.target.value)}
                        style={styles.input}
                        placeholder="e.g. John Doe"
                    />
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <button
                    type="submit"
                    disabled={!counterName.trim()}
                    style={{
                        ...styles.button,
                        opacity: !counterName.trim() ? 0.6 : 1,
                        cursor: !counterName.trim() ? 'not-allowed' : 'pointer'
                    }}
                >
                    Save Configuration
                </button>
            </form>
        </div>
    );
};

// Vanilla CSS Styles (Inline for simplicity as per "No CSS frameworks" and strictly modifying this file)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#555',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '0.75rem',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '4px',
        marginTop: '1rem',
        transition: 'background-color 0.2s',
    },
    error: {
        color: 'red',
        fontSize: '0.875rem',
        marginTop: '-0.5rem',
    },
};

export default CounterSetupPage;
