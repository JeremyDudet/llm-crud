import { sanitizeInput } from "../utils/sanitizer";

export function preprocessText(text: string): string {
  // Remove any special characters or extra whitespace
  let cleanedText = text.replace(/[^\w\s]/gi, "").trim();

  // Convert to lowercase for consistency
  cleanedText = cleanedText.toLowerCase();

  // Sanitize input to prevent any potential security issues
  cleanedText = sanitizeInput(cleanedText);

  return cleanedText;
}
