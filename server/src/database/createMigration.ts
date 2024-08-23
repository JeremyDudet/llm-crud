import { umzug } from "./migrationSetup";

async function createMigration() {
  const name = process.argv[2];
  if (!name) {
    console.error("Please provide a name for the migration");
    process.exit(1);
  }
  await umzug.create({
    name: name + ".ts",
    skipVerify: true,
  });
  console.log(`Migration ${name}.ts created successfully`);
}

createMigration().catch(console.error);
