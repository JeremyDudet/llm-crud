// src/config/constants.ts
export const ALLOWED_ACTIONS = ["set", "add", "subtract"] as const;
export type AllowedAction = (typeof ALLOWED_ACTIONS)[number];
import { InferInsertModel } from "drizzle-orm";
import { db } from "../database";
import { items, unitOfMeasures } from "../database/schema";

type Item = InferInsertModel<typeof items>;
type UnitOfMeasure = InferInsertModel<typeof unitOfMeasures>;

// Fetch inventory items from the database
export const fetchInventoryItems = async (): Promise<Item[]> => {
  try {
    const returnedItems = await db.select().from(items);
    return returnedItems;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error("Failed to fetch inventory items");
  }
};

// Fetch unit of measures from the database
export const fetchUnitOfMeasures = async (): Promise<UnitOfMeasure[]> => {
  try {
    const returnedUnitOfMeasures = await db.select().from(unitOfMeasures);
    return returnedUnitOfMeasures;
  } catch (error) {
    console.error("Error fetching unit of measures:", error);
    throw new Error("Failed to fetch unit of measures");
  }
};
