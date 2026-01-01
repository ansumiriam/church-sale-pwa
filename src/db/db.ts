import { openDB, DBSchema } from 'idb';

interface SaleDB extends DBSchema {
    sales: {
        key: number;
        value: {
            item: string;
            price: number;
            date: Date;
        };
    };
}

const dbPromise = openDB<SaleDB>('church-sale-db', 1, {
    upgrade(db) {
        db.createObjectStore('sales', { keyPath: 'key', autoIncrement: true });
    },
});

export const getDB = () => dbPromise;
