// src/controllers/UserController.ts
import { Request, Response } from "express";
import UserService from "../services/UserService";

export class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const user = await UserService.createUser(username, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await UserService.getUser(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const [updateCount, updatedUsers] = await UserService.updateUser(
        id,
        updates
      );
      if (updateCount > 0) {
        res.json(updatedUsers[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleteCount = await UserService.deleteUser(id);
      if (deleteCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new UserController();
