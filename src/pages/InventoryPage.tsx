import React, { useEffect, useState } from 'react';
import { Item } from '../db/db';
import { inventoryService } from '../db/inventoryService';

const InventoryPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form State
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getAllItems();
            // Sort by active status then name
            const sorted = data.sort((a, b) => {
                if (a.isActive === b.isActive) return a.name.localeCompare(b.name);
                return a.isActive ? -1 : 1;
            });
            setItems(sorted);
        } catch (error) {
            console.error("Failed to load items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setName('');
        setPrice('');
        setStock('');
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setName(item.name); // Will be disabled
        setPrice(item.price.toString());
        setStock(item.stock.toString());
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validation
        if (!name.trim()) return setFormError("Item Name is required");
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);

        if (isNaN(priceNum) || priceNum <= 0) return setFormError("Price must be a positive number");
        if (isNaN(stockNum) || stockNum < 0) return setFormError("Stock cannot be negative");

        try {
            if (editingItem) {
                // Update
                if (!editingItem.id) return;
                await inventoryService.updateItem({
                    ...editingItem,
                    price: priceNum,
                    stock: stockNum
                });
            } else {
                // Create
                await inventoryService.addItem({
                    name: name.trim(),
                    price: priceNum,
                    stock: stockNum
                });
            }
            setIsModalOpen(false);
            loadItems();
        } catch (err) {
            console.error(err);
            setFormError("Failed to save item. Please try again.");
        }
    };

    const handleToggleStatus = async (item: Item) => {
        if (!item.id) return;
        try {
            await inventoryService.toggleItemStatus(item.id, !item.isActive);
            loadItems();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Inventory...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Inventory Management</h2>
                <button onClick={handleAddNew} style={styles.addButton}>+ Add Item</button>
            </div>

            {items.length === 0 ? (
                <div style={styles.emptyState}>No items added yet.</div>
            ) : (
                <div style={styles.list}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            ...styles.card,
                            opacity: item.isActive ? 1 : 0.6,
                            backgroundColor: item.isActive ? 'white' : '#f9f9f9'
                        }}>
                            <div style={styles.cardInfo}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.itemName}>{item.name}</h3>
                                    {!item.isActive && <span style={styles.disabledBadge}>Disabled</span>}
                                </div>
                                <div style={styles.details}>
                                    <span>₹{item.price}</span>
                                    <span style={{
                                        ...styles.stock,
                                        color: item.isActive && item.stock <= 5 ? '#d32f2f' : '#666',
                                        fontWeight: item.isActive && item.stock <= 5 ? 'bold' : 'normal'
                                    }}>
                                        Stock: {item.stock}
                                        {item.isActive && item.stock <= 5 && " (Low)"}
                                    </span>
                                </div>
                            </div>
                            <div style={styles.actions}>
                                <button
                                    onClick={() => handleEdit(item)}
                                    style={styles.editButton}
                                    disabled={!item.isActive}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(item)}
                                    style={{
                                        ...styles.toggleButton,
                                        color: item.isActive ? '#d32f2f' : '#2e7d32',
                                        backgroundColor: item.isActive ? '#ffebee' : '#e8f5e9'
                                    }}
                                >
                                    {item.isActive ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <form onSubmit={handleSave} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Item Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={!!editingItem}
                                    style={{ ...styles.input, backgroundColor: editingItem ? '#f0f0f0' : 'white' }}
                                    placeholder="e.g. Chicken Biryani"
                                />
                            </div>
                            <div style={styles.row}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        style={styles.input}
                                        placeholder="0"
                                        min="1"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Stock Qty</label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={e => setStock(e.target.value)}
                                        style={styles.input}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {formError && <div style={styles.error}>{formError}</div>}

                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.saveButton}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '1rem',
        maxWidth: '800px',
        margin: '0 auto',
        paddingBottom: '80px', // Space for bottom nav if needed
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    addButton: {
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        padding: '0.6rem 1rem',
        borderRadius: '6px',
        fontSize: '0.95rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px dashed #ccc',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
    },
    cardInfo: {
        flex: 1,
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.3rem',
    },
    itemName: {
        margin: 0,
        fontSize: '1rem',
        color: '#333',
    },
    disabledBadge: {
        backgroundColor: '#eee',
        color: '#666',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    details: {
        display: 'flex',
        gap: '1rem',
        fontSize: '0.9rem',
        color: '#555',
    },
    stock: {
        // dynamic color handled inline
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
    },
    editButton: {
        padding: '0.4rem 0.8rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    toggleButton: {
        padding: '0.4rem 0.8rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
    },
    modal: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        flex: 1,
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#444',
    },
    input: {
        padding: '0.6rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    error: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        textAlign: 'center',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    saveButton: {
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#f5f5f5',
        color: '#666',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default InventoryPage;
