type ValidationResponse = {
  isValid: boolean;
  errors?: string[];
};

export function validateCommand(command: any): ValidationResponse {
  // Check if the command is valid
  if (typeof command !== "string" || command.length === 0) {
    return { isValid: false, errors: ["Command is not a valid string"] };
  }

  // Check if the command is a valid CRUD operation
  if (!["create", "update", "delete"].includes(command)) {
    return {
      isValid: false,
      errors: ["Command is not a valid CRUD operation"],
    };
  }

  return { isValid: true };
}
