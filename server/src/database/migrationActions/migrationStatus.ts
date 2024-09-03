// src/database/migrationStatus.ts
import { umzug } from "./migrationSetup.js";

export const migrationStatus = async () => {
  const pending = await umzug.pending();
  const executed = await umzug.executed();

  console.log("Executed migrations:");
  executed.forEach((migration) => console.log(migration.name));

  console.log("\nPending migrations:");
  pending.forEach((migration) => console.log(migration.name));

  console.log(
    `\nTotal: ${executed.length} executed, ${pending.length} pending`
  );
};

// If this is meant to be run as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  migrationStatus().catch(console.error);
}
