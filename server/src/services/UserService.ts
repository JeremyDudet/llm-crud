import { db } from "../database";
import { User } from "../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export class UserService {
  async createUser(email: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db
      .insert(User)
      .values({
        email,
        passwordHash: hashedPassword,
      })
      .returning();
  }

  async getUser(id: number) {
    return db.select().from(User).where(eq(User.id, id)).get();
  }

  async getAllUsers() {
    return db.select().from(User).all();
  }

  async updateUser(id: number, updates: Partial<typeof User.$inferInsert>) {
    return db.update(User).set(updates).where(eq(User.id, id)).run();
  }

  async deleteUser(id: number) {
    return db.delete(User).where(eq(User.id, id)).run();
  }
}

export default new UserService();
