import { db } from "../database";
import { Item } from "../database/schema";
import { eq } from "drizzle-orm";

export class ItemService {
  async getAllItems() {
    return db.select().from(Item).execute();
  }

  async getItem(id: number) {
    const result = await db
      .select()
      .from(Item)
      .where(eq(Item.id, id))
      .execute();
    return result[0] || null;
  }

  async createItem(itemData: Partial<typeof Item.$inferInsert>) {
    const requiredFields = [
      "name",
      "par",
      "reorderPoint",
      "stockCheckFrequency",
    ] as const;
    const missingFields = requiredFields.filter(
      (field) => !(field in itemData)
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const result = await db
      .insert(Item)
      .values(itemData as typeof Item.$inferInsert)
      .returning()
      .execute();
    return result[0];
  }

  async updateItem(id: number, updates: Partial<typeof Item.$inferInsert>) {
    const result = await db
      .update(Item)
      .set(updates)
      .where(eq(Item.id, id))
      .returning()
      .execute();
    return result[0] || null;
  }

  async deleteItem(id: number) {
    await db.delete(Item).where(eq(Item.id, id)).execute();
    return true;
  }
}

export default new ItemService();
