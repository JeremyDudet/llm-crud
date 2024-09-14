import { db } from "../database";
import { eq } from "drizzle-orm";
import { InterpretedCommand } from "./LLMService";
import { inventory } from "../database/schema";

export async function executeCommand(
  command: InterpretedCommand
): Promise<string> {
  try {
    switch (command.action) {
      case "add":
        return await addItem(command);
      case "update":
        return await updateItem(command);
      case "remove":
        return await removeItem(command);
      case "check":
        return await checkItem(command);
      default:
        throw new Error(`Invalid action: ${command.action}`);
    }
  } catch (error) {
    console.error("Error executing inventory command:", error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

async function addItem(command: InterpretedCommand): Promise<string> {
  const existingItem = await db
    .select()
    .from(inventory)
    .where(eq(inventory.name, command.item))
    .get();

  if (existingItem) {
    await db
      .update(inventory)
      .set({ quantity: existingItem.quantity + (command.quantity || 0) })
      .where(eq(inventory.id, existingItem.id))
      .run();
  } else {
    await db
      .insert(inventory)
      .values({
        name: command.item,
        quantity: command.quantity || 0,
        unit: command.unit || "",
      })
      .run();
  }

  const updatedItem = await db
    .select()
    .from(inventory)
    .where(eq(inventory.name, command.item))
    .get();

  return `Added ${command.quantity} ${command.unit || ""} of ${
    command.item
  } to inventory. Total: ${updatedItem?.quantity} ${updatedItem?.unit}.`;
}

async function updateItem(command: InterpretedCommand): Promise<string> {
  const item = await db
    .select()
    .from(inventory)
    .where(eq(inventory.name, command.item))
    .get();

  if (!item) {
    throw new Error(`Item not found: ${command.item}`);
  }

  await db
    .update(inventory)
    .set({
      quantity: command.quantity ?? item.quantity,
      unit: command.unit || item.unit,
    })
    .where(eq(inventory.id, item.id))
    .run();

  return `Updated ${command.item} to ${command.quantity} ${
    command.unit || item.unit
  }.`;
}

async function removeItem(command: InterpretedCommand): Promise<string> {
  const item = await db
    .select()
    .from(inventory)
    .where(eq(inventory.name, command.item))
    .get();

  if (!item) {
    throw new Error(`Item not found: ${command.item}`);
  }

  if (command.quantity) {
    const newQuantity = Math.max(0, item.quantity - command.quantity);
    await db
      .update(inventory)
      .set({ quantity: newQuantity })
      .where(eq(inventory.id, item.id))
      .run();
    return `Removed ${command.quantity} ${item.unit || ""} of ${
      command.item
    }. New total: ${newQuantity} ${item.unit}.`;
  } else {
    await db.delete(inventory).where(eq(inventory.id, item.id)).run();
    return `Completely removed ${command.item} from inventory.`;
  }
}

async function checkItem(command: InterpretedCommand): Promise<string> {
  const item = await db
    .select()
    .from(inventory)
    .where(eq(inventory.name, command.item))
    .get();

  if (!item) {
    return `${command.item} is not in the inventory.`;
  }

  return `There are ${item.quantity} ${item.unit} of ${item.name} in the inventory.`;
}
