import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDB, Counter } from '../db/db';

const CounterSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [counterName, setCounterName] = useState('');
    const [operatorName, setOperatorName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [salesExist, setSalesExist] = useState(false);
    const [existingCounterId, setExistingCounterId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            try {
                const db = await getDB();

                // Check for existing counter config
                const counters = await db.getAll('counter');
                if (counters.length > 0) {
                    const current = counters[0];
                    setCounterName(current.name);
                    setOperatorName(current.operatorName || '');
                    setExistingCounterId(current.id);
                }

                // Check if any sales exist
                const salesCount = await db.count('sales');
                setSalesExist(salesCount > 0);

            } catch (err) {
                console.error("Error loading setup data:", err);
                setError("Failed to load configuration.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!counterName.trim()) {
            setError('Counter Name is required');
            return;
        }

        try {
            const db = await getDB();
            const newCounter: Counter = {
                id: existingCounterId, // Preserve ID if updating
                name: counterName.trim(),
                operatorName: operatorName.trim() || undefined,
                createdAt: new Date(),
            };

            await db.put('counter', newCounter); // use put to update or add

            setSuccessMsg("Configuration saved successfully!");

            // Short delay before redirect to let user see success message
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            console.error("Error saving counter:", err);
            setError('Failed to save counter details.');
        }
    };

    if (loading) {
        return <div style={styles.container}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Counter Setup</h2>

            {salesExist && (
                <div style={styles.infoBox}>
                    ℹ️ <strong>Note:</strong> Sales have been recorded on this device.
                    To ensure data integrity, the Counter Name cannot be changed.
                </div>
            )}

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
                        style={{
                            ...styles.input,
                            backgroundColor: salesExist ? '#f5f5f5' : 'white',
                            cursor: salesExist ? 'not-allowed' : 'text'
                        }}
                        placeholder="e.g. Counter 1"
                        disabled={salesExist}
                    />
                    <small style={styles.helperText}>
                        {salesExist
                            ? "Counter name cannot be changed after sales are recorded."
                            : "Example: Counter 1, Book Stall, Food Stall"}
                    </small>
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
                {successMsg && <div style={styles.success}>{successMsg}</div>}

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
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
                </div>
            </form>
        </div>
    );
};

// Vanilla CSS Styles
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        fontFamily: 'sans-serif',
        backgroundColor: '#fff',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#444',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
    },
    helperText: {
        fontSize: '0.8rem',
        color: '#666',
        marginTop: '0.2rem',
    },
    infoBox: {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        lineHeight: '1.4',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    button: {
        flex: 1,
        padding: '0.75rem',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '6px',
        transition: 'background-color 0.2s',
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        padding: '0.75rem',
        fontSize: '1rem',
        color: '#666',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    error: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '0.75rem',
        borderRadius: '4px',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    success: {
        color: '#2e7d32',
        backgroundColor: '#e8f5e9',
        padding: '0.75rem',
        borderRadius: '4px',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
};

export default CounterSetupPage;
