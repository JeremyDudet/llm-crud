import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  removeCommand,
  executeCommand,
} from "@/features/commandStack/commandStackSlice";
import { Button } from "@/components/ui/button";

export function CommandList() {
  const commands = useSelector(
    (state: RootState) => state.commandStack.commands
  );
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeCommand(id));
  };

  const handleExecute = (id: string) => {
    dispatch(executeCommand(id));
    // Add logic to execute the command, e.g., API call
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Interpreted Commands</h2>
      {commands.length === 0 ? (
        <p className="text-muted">No commands to display.</p>
      ) : (
        <ul className="space-y-4">
          {commands.map((command) => (
            <li key={command.id} className="p-4 bg-white shadow rounded">
              <p className="font-semibold">
                {command.action} {command.quantity ?? ""} {command.unit ?? ""}{" "}
                of {command.item}
              </p>
              <div className="mt-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExecute(command.id)}
                  disabled={command.processed}
                >
                  {command.processed ? "Executed" : "Execute"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(command.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
