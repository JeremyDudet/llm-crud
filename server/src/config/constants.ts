// src/config/constants.ts
export const ALLOWED_ACTIONS = ["set", "add", "subtract"] as const;
export type AllowedAction = (typeof ALLOWED_ACTIONS)[number];
import { InferInsertModel } from "drizzle-orm";
import { db } from "../database";
import { Item, UnitOfMeasure } from "../database/schema";

type Item = InferInsertModel<typeof Item>;
type UnitOfMeasure = InferInsertModel<typeof UnitOfMeasure>;

// Fetch inventory items from the database
export const fetchInventoryItems = async (): Promise<Item[]> => {
  try {
    const returnedItems = await db.select().from(Item);
    return returnedItems;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error("Failed to fetch inventory items");
  }
};

// Fetch unit of measures from the database
export const fetchUnitOfMeasures = async (): Promise<UnitOfMeasure[]> => {
  try {
    const returnedUnitOfMeasures = await db.select().from(UnitOfMeasure);
    return returnedUnitOfMeasures;
  } catch (error) {
    console.error("Error fetching unit of measures:", error);
    throw new Error("Failed to fetch unit of measures");
  }
};
