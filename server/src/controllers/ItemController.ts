import { Request, Response } from "express";
import ItemService from "../services/ItemService";

export class ItemController {
  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await ItemService.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const item = await ItemService.getItem(id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await ItemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedItem = await ItemService.updateItem(id, updates);
      if (updatedItem) {
        res.json(updatedItem);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleteCount = await ItemService.deleteItem(id);
      if (deleteCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ItemController();
