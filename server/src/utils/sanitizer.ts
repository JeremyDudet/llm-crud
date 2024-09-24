export function sanitizeInput(input: string): string {
  // Remove any potentially harmful characters or scripts
  return input.replace(/[<>&'"]/g, "");
}
