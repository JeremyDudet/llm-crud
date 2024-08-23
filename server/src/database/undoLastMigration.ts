import { umzug } from "./migrationSetup";

async function undoLastMigration() {
  await umzug.down();
  console.log("Last migration has been reverted");
}

undoLastMigration().catch(console.error);
