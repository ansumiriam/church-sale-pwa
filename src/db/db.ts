import { openDB, DBSchema } from 'idb';

// Define the Counter interface
export interface Counter {
    id?: number;
    name: string;
    operatorName?: string;
    createdAt: Date;
}

interface SaleDB extends DBSchema {
    sales: {
        key: number;
        value: {
            item: string;
            price: number;
            date: Date;
        };
    };
    counter: {
        key: number;
        value: Counter;
    };
}

const dbPromise = openDB<SaleDB>('church-sale-db', 2, {
    upgrade(db, oldVersion) {
        if (oldVersion < 1) {
            db.createObjectStore('sales', { keyPath: 'key', autoIncrement: true });
        }
        if (oldVersion < 2) {
            db.createObjectStore('counter', { keyPath: 'id', autoIncrement: true });
        }
    },
});

export const getDB = () => dbPromise;
