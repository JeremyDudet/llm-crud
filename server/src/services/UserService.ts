// src/services/UserService.ts
import User from "../database/models/User";
import bcrypt from "bcrypt";

export class UserService {
  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({ username, email, password: hashedPassword });
  }

  async getUser(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async getAllUsers(): Promise<User[]> {
    return User.findAll();
  }

  async updateUser(
    id: number,
    updates: Partial<User>
  ): Promise<[number, User[]]> {
    return User.update(updates, { where: { id }, returning: true });
  }

  async deleteUser(id: number): Promise<number> {
    return User.destroy({ where: { id } });
  }
}

export default new UserService();
