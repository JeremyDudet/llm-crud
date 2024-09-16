import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  removeCommand,
  updateCommand,
  executeCommand,
} from "@/features/commandStackSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Play } from "lucide-react";
import { InterpretedCommand } from "@/types/InterpretedCommand";
import CommandForm from "./CommandForm";

export default function CommandStack() {
  const dispatch = useDispatch<AppDispatch>();
  const commands = useSelector(
    (state: RootState) => state.commandStack.commands
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (command: InterpretedCommand) => {
    setEditingId(command.id);
  };

  const handleUpdate = (id: string, changes: InterpretedCommand) => {
    dispatch(updateCommand({ id, changes }));
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    dispatch(removeCommand(id));
  };

  const handleExecute = (id: string) => {
    dispatch(executeCommand(id));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Command Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {commands.map((command) => (
            <div
              key={command.id}
              className={`mb-4 p-4 rounded-lg ${
                command.processed ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              {editingId === command.id ? (
                <CommandForm
                  command={command}
                  onSubmit={(changes) => handleUpdate(command.id, changes)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <CommandDisplay
                  command={command}
                  onEdit={() => handleEdit(command)}
                  onRemove={() => handleRemove(command.id)}
                  onExecute={() => handleExecute(command.id)}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface CommandDisplayProps {
  command: Command;
  onEdit: () => void;
  onRemove: () => void;
  onExecute: () => void;
}

function CommandDisplay({
  command,
  onEdit,
  onRemove,
  onExecute,
}: CommandDisplayProps) {
  return (
    <>
      <p className="font-semibold">{command.rawCommand}</p>
      <p className="text-sm mt-1">
        Interpreted: {command.interpretedCommand.action}{" "}
        {command.interpretedCommand.quantity} {command.interpretedCommand.unit}{" "}
        of {command.interpretedCommand.item}
      </p>
      <p className="text-sm text-gray-500">
        {new Date(command.timestamp).toLocaleString()}
      </p>
      <p className="text-sm font-medium mt-1">
        {command.processed ? "Processed" : "Pending"}
      </p>
      <div className="mt-2 space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onRemove}>
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
        {!command.processed && (
          <Button variant="outline" size="sm" onClick={onExecute}>
            <Play className="w-4 h-4 mr-1" />
            Execute
          </Button>
        )}
      </div>
    </>
  );
}
