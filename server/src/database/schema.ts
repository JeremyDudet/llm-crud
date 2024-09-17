import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("user", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  role: text("role").notNull().default("user"),
  email: text("email").notNull().unique(),
  emailVerificationToken: text("email_verification_token"),
  isEmailVerified: integer("is_email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: integer("reset_password_expires", {
    mode: "timestamp",
  }),
  refreshToken: text("refresh_token"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Modified items table
export const items = sqliteTable("item", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  par: real("par").notNull(),
  unitOfMeasureId: integer("unit_of_measure_id").references(
    () => unitOfMeasures.id
  ),
  reorderPoint: real("reorder_point").notNull(),
  stockCheckFrequency: integer("stock_check_frequency").notNull(),
  description: text("description"),
  leadTime: integer("lead_time"),
  brands: text("brands"),
  notes: text("notes"),
  currentCost: real("current_cost"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const commands = sqliteTable("command", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// InventoryCount table
export const inventoryCounts = sqliteTable("inventory_count", {
  id: integer("id").primaryKey(),
  count: real("count").notNull(), // this is the count of the item
  checkedAt: integer("checked_at", { mode: "timestamp" }), // this is the timestamp for when the item was checked off the shopping list
  countedAt: integer("counted_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // this is the timestamp for when the item was counted
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }), // this is the id of the item that was counted
  userId: integer("user_id")
    .notNull()
    .references(() => users.id), // this is the id of the user that performed the count
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const vendors = sqliteTable("vendor", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  pointOfContact: text("point_of_contact"),
  website: text("website"),
  notes: text("notes"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// A receipt is a document that records the purchase of items from a vendor
export const receipts = sqliteTable("receipt", {
  id: integer("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  totalAmount: real("total_amount").notNull(),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// New table for tracking item costs over time
export const itemCosts = sqliteTable("item_cost", {
  id: integer("id").primaryKey(),
  itemId: integer("item_id").references(() => items.id),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  receiptId: integer("receipt_id").references(() => receipts.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const unitOfMeasures = sqliteTable("unit_of_measure", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Junction table to store item details for each receipt
export const receiptItems = sqliteTable("receipt_item", {
  id: integer("id").primaryKey(),
  receiptId: integer("receipt_id").references(() => receipts.id),
  itemId: integer("item_id").references(() => items.id),
  quantity: real("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ItemVendors Junction Table
export const itemVendors = sqliteTable("item_vendor", {
  id: integer("id").primaryKey(),
  itemId: integer("item_id").references(() => items.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// This is a relation to the receipts table
export const vendorRelations = relations(vendors, ({ many }) => ({
  receipts: many(receipts),
  itemVendors: many(itemVendors),
}));

export const receiptRelations = relations(receipts, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [receipts.vendorId],
    references: [vendors.id],
  }),
  itemCosts: many(itemCosts),
}));

export const itemRelations = relations(items, ({ many, one }) => ({
  receiptItems: many(receiptItems),
  inventoryCounts: many(inventoryCounts),
  unitOfMeasure: one(unitOfMeasures, {
    fields: [items.unitOfMeasureId],
    references: [unitOfMeasures.id],
  }),
  itemVendors: many(itemVendors),
  itemCosts: many(itemCosts),
}));

export const receiptItemRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
  item: one(items, {
    fields: [receiptItems.itemId],
    references: [items.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  inventoryCounts: many(inventoryCounts),
}));

export const inventoryCountRelations = relations(
  inventoryCounts,
  ({ one }) => ({
    item: one(items, {
      fields: [inventoryCounts.itemId],
      references: [items.id],
    }),
    user: one(users, {
      fields: [inventoryCounts.userId],
      references: [users.id],
    }),
  })
);

export const unitOfMeasureRelations = relations(unitOfMeasures, ({ many }) => ({
  items: many(items),
}));

export const itemVendorRelations = relations(itemVendors, ({ one }) => ({
  item: one(items, {
    fields: [itemVendors.itemId],
    references: [items.id],
  }),
  vendor: one(vendors, {
    fields: [itemVendors.vendorId],
    references: [vendors.id],
  }),
}));
