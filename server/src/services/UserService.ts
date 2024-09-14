import { db } from "../database";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export class UserService {
  async createUser(email: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
      })
      .returning();
  }

  async getUser(id: number) {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getAllUsers() {
    return db.select().from(users).all();
  }

  async updateUser(id: number, updates: Partial<typeof users.$inferInsert>) {
    return db.update(users).set(updates).where(eq(users.id, id)).run();
  }

  async deleteUser(id: number) {
    return db.delete(users).where(eq(users.id, id)).run();
  }
}

export default new UserService();
