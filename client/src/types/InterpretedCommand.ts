export interface InterpretedCommand {
  id: string;
  action: "add" | "update" | "remove" | "check";
  item: string;
  quantity?: number;
  unit?: string;
  processed?: boolean;
  rawCommand: string;
}
