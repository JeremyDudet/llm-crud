// src/controllers/UserController.ts
import { Request, Response } from "express";
import UserService from "../services/UserService";

export class UserController {
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
      const updatedUser = await UserService.updateUser(id, updates);
      if (updatedUser) {
        res.json(updatedUser);
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
      const result = await UserService.deleteUser(id);
      if (result) {
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
