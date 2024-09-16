import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InterpretedCommand } from "@/types/InterpretedCommand";

interface CommandFormProps {
  command: InterpretedCommand;
  onSubmit: (changes: Partial<InterpretedCommand>) => void;
  onCancel: () => void;
}

export default function CommandForm({
  command,
  onSubmit,
  onCancel,
}: CommandFormProps) {
  const [editForm, setEditForm] = useState<InterpretedCommand>(command);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="rawCommand">Raw Command</Label>
      <Input
        id="rawCommand"
        name="rawCommand"
        value={editForm.rawCommand}
        onChange={handleInputChange}
      />
      <Label htmlFor="action">Action</Label>
      <Input
        id="action"
        name="action"
        value={editForm.action}
        onChange={handleInputChange}
      />
      <Label htmlFor="quantity">Quantity</Label>
      <Input
        id="quantity"
        name="quantity"
        type="number"
        value={editForm.quantity}
        onChange={handleInputChange}
      />
      <Label htmlFor="unit">Unit</Label>
      <Input
        id="unit"
        name="unit"
        value={editForm.unit}
        onChange={handleInputChange}
      />
      <Label htmlFor="item">Item</Label>
      <Input
        id="item"
        name="item"
        value={editForm.item}
        onChange={handleInputChange}
      />
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
