import { db } from "../database";
import { Item } from "../database/schema";
import { eq } from "drizzle-orm";

export class ItemService {
  async getAllItems() {
    return db.select().from(Item).all();
  }

  async getItem(id: number) {
    return db.select().from(Item).where(eq(Item.id, id)).get();
  }

  async createItem(itemData: Partial<typeof Item.$inferInsert>) {
    return db.insert(Item).values(itemData).returning();
  }

  async updateItem(id: number, updates: Partial<typeof Item.$inferInsert>) {
    return db.update(Item).set(updates).where(eq(Item.id, id)).returning();
  }

  async deleteItem(id: number) {
    return db.delete(Item).where(eq(Item.id, id)).run();
  }
}

export default new ItemService();
