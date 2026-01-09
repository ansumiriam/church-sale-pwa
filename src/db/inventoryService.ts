import { getDB, Item } from './db';

const INVENTORY_STORE = 'items';

export const inventoryService = {
    async getAllItems(): Promise<Item[]> {
        const db = await getDB();
        return db.getAll(INVENTORY_STORE);
    },

    async addItem(item: Omit<Item, 'id' | 'createdAt' | 'isActive'>): Promise<number> {
        const db = await getDB();
        const newItem: Item = {
            ...item,
            isActive: true,
            createdAt: new Date(),
        };
        return db.add(INVENTORY_STORE, newItem);
    },

    async updateItem(item: Item): Promise<void> {
        const db = await getDB();
        await db.put(INVENTORY_STORE, item);
    },

    async toggleItemStatus(id: number, isActive: boolean): Promise<void> {
        const db = await getDB();
        const item = await db.get(INVENTORY_STORE, id);
        if (item) {
            item.isActive = isActive;
            await db.put(INVENTORY_STORE, item);
        }
    }
};
