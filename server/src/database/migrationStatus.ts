// src/database/migrationStatus.ts
import { umzug } from "./migrationSetup";

async function migrationStatus() {
  const pending = await umzug.pending();
  const executed = await umzug.executed();

  console.log("Executed migrations:");
  executed.forEach((migration) => console.log(migration.name));

  console.log("\nPending migrations:");
  pending.forEach((migration) => console.log(migration.name));

  console.log(
    `\nTotal: ${executed.length} executed, ${pending.length} pending`
  );
}

migrationStatus().catch(console.error);
