import { umzug } from "./migrationSetup";

async function runMigrations() {
  await umzug.up();
  console.log("All migrations executed successfully");
}

runMigrations().catch(console.error);
