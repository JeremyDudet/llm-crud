import { umzug } from "./migrationSetup.js";

async function undoLastMigration() {
  await umzug.down();
  console.log("Last migration has been reverted");
}

undoLastMigration().catch(console.error);
