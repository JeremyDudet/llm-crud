import { umzug } from "./migrationSetup";

async function undoAllMigrations() {
  await umzug.down({ to: 0 });
  console.log("All migrations have been reverted");
}

undoAllMigrations().catch(console.error);
