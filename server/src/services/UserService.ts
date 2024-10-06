import { db } from "../database";
import { User } from "../database/schema";
import { eq } from "drizzle-orm";

export class UserService {
  async getUser(id: number) {
    const result = await db
      .select()
      .from(User)
      .where(eq(User.id, id))
      .execute();
    return result[0] || null;
  }

  async getAllUsers() {
    return db.select().from(User).execute();
  }

  async updateUser(id: number, updates: Partial<typeof User.$inferInsert>) {
    await db.update(User).set(updates).where(eq(User.id, id)).execute();
    return this.getUser(id);
  }

  async deleteUser(id: number) {
    return db.delete(User).where(eq(User.id, id)).execute();
  }
}

export default new UserService();
