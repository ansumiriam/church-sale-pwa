import { openDB, DBSchema } from 'idb';

// Define the Counter interface
export interface Counter {
    id?: number;
    name: string;
    operatorName?: string;
    createdAt: Date;
}

// Define the Item interface
export interface Item {
    id?: number;
    name: string;
    price: number;
    stock: number;
    isActive: boolean;
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
    items: {
        key: number;
        value: Item;
    };
}

const dbPromise = openDB<SaleDB>('church-sale-db', 3, {
    upgrade(db, oldVersion) {
        if (oldVersion < 1) {
            db.createObjectStore('sales', { keyPath: 'key', autoIncrement: true });
        }
        if (oldVersion < 2) {
            db.createObjectStore('counter', { keyPath: 'id', autoIncrement: true });
        }
        if (oldVersion < 3) {
            db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        }
    },
});

export const getDB = () => dbPromise;
