export interface InterpretedCommand {
  id: number;
  action: "set" | "add" | "subtract";
  itemName: string;
  itemId: number;
  quantity: number;
  unitOfMeasureId: number;
  unitOfMeasureName: string;
  userId?: number;
  count?: number;
  status: "valid" | "invalid";
  error?: string;
  rawCommand: string; // Add this line
}
