# Comprehensive Database Management Guide

This guide provides detailed instructions for managing our SQLite database, including setup, creating and running migrations, rollbacks, and best practices.

## Table of Contents

1. [Setup](#setup)
2. [Migration System Overview](#migration-system-overview)
3. [Creating Migrations](#creating-migrations)
4. [Running Migrations](#running-migrations)
5. [Rolling Back Migrations](#rolling-back-migrations)
6. [Checking Migration Status](#checking-migration-status)
7. [Viewing Database Data](#viewing-database-data)
8. [Scripts](#scripts)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Setup

Ensure you have the necessary dependencies installed:

```bash
npm install sequelize umzug sqlite3
npm install --save-dev @types/umzug @types/sequelize
```

Create a `migrationSetup.ts` file in your `src/database` directory:

```typescript
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

export const umzug = new Umzug({
  migrations: { glob: "src/database/migrations/*.ts" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof umzug._types.migration;
```

## Migration System Overview

Our migration system uses Umzug and Sequelize to manage database schema changes. It allows you to:

- Create new migrations
- Run pending migrations
- Roll back migrations
- Check the status of migrations

There is no limit to the number of migrations you can create or run. The system will execute all pending migrations in the order they were created.

## Creating Migrations

To create a new migration:

1. Run the command:

   ```bash
   npm run migrate:create -- <migration-name>
   ```

   Replace `<migration-name>` with a descriptive name for your migration.

2. This creates a new file in the `src/database/migrations` directory.

3. Edit the new file to define your `up` and `down` migrations.

Example migration:

```typescript
import { Migration } from "../migrationSetup";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "phone_number", {
    type: "TEXT",
    allowNull: true,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "phone_number");
};
```

## Running Migrations

To apply all pending migrations:

```bash
npm run migrate
```

This command executes all migrations that haven't been run yet. It will run as many migrations as you have created and that haven't been applied to the database.

## Rolling Back Migrations

To roll back the most recent migration:

```bash
npm run migrate:undo
```

To roll back all migrations:

```bash
npm run migrate:undo:all
```

## Checking Migration Status

To see which migrations have been run and which are pending:

```bash
npm run migrate:status
```

This command displays:

- A list of executed migrations
- A list of pending migrations
- A summary of the total executed and pending migrations

## Viewing Database Data

To view the data in your database:

```bash
sqlite3 path/to/database.sqlite
```

Once in the SQLite prompt, you can run SQL queries:

-- View all tables

```sql
.tables
```

-- View schema of a specific table

```sql
.schema <table_name>
```

-- Query data from a table

```sql
SELECT * FROM <table_name>;
```

-- Exit SQLite prompt

```sql
.exit
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "migrate": "ts-node src/database/runMigrations.ts",
    "migrate:create": "ts-node src/database/createMigration.ts",
    "migrate:undo": "ts-node src/database/undoLastMigration.ts",
    "migrate:undo:all": "ts-node src/database/undoAllMigrations.ts",
    "migrate:status": "ts-node src/database/migrationStatus.ts"
  }
}
```

Create the corresponding files in your `src/database` directory:

1. `runMigrations.ts`:

```typescript
import { umzug } from "./migrationSetup";

async function runMigrations() {
  await umzug.up();
  console.log("All migrations executed successfully");
}

runMigrations().catch(console.error);
```

2. `createMigration.ts`:

```typescript
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
```

3. `undoLastMigration.ts`:

```typescript
import { umzug } from "./migrationSetup";

async function undoLastMigration() {
  await umzug.down();
  console.log("Last migration has been reverted");
}

undoLastMigration().catch(console.error);
```

4. `undoAllMigrations.ts`:

```typescript
import { umzug } from "./migrationSetup";

async function undoAllMigrations() {
  await umzug.down({ to: 0 });
  console.log("All migrations have been reverted");
}

undoAllMigrations().catch(console.error);
```

5. `migrationStatus.ts`:

```typescript
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
```

## Best Practices

1. Always create a migration for database changes. Never modify the database schema directly.
2. Keep migrations small and focused on a single change.
3. Test migrations thoroughly in a development environment before applying them to production.
4. Always backup your database before running migrations in production.
5. Write clear and descriptive migration names.
6. Ensure that the `down` migration correctly reverts the changes made in the `up` migration.
7. Run the `migrate:status` command before and after applying migrations to verify the changes.
8. Commit migration files to version control so all developers have the same database schema.

## Troubleshooting

If you encounter issues with migrations:

1. Check the migration files for any errors.
2. Ensure your database connection is correct in the `migrationSetup.ts` file.
3. Look at the Umzug and Sequelize documentation for more detailed error information.
4. If a migration fails, fix the issue and try running it again.
5. Use the `migrate:status` command to understand the current state of your migrations.
6. If you need to make changes to a migration that has already been run, create a new migration instead of modifying the existing one.

Remember, database migrations are a powerful tool but should be used carefully, especially in a production environment. Always have a rollback plan and test thoroughly before applying changes to production databases.
