import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const User = sqliteTable("user", {
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
export const Item = sqliteTable("item", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  par: real("par").notNull(),
  unitOfMeasureId: integer("unit_of_measure_id").references(
    () => UnitOfMeasure.id
  ),
  reorderPoint: real("reorder_point").notNull(),
  // add vendors
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

export const Command = sqliteTable("command", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// InventoryCount table
export const InventoryCount = sqliteTable("inventory_count", {
  id: integer("id").primaryKey(),
  count: real("count").notNull(), // this is the count of the item
  checkedAt: integer("checked_at", { mode: "timestamp" }), // this is the timestamp for when the item was checked off the shopping list
  countedAt: integer("counted_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // this is the timestamp for when the item was counted
  itemId: integer("item_id")
    .notNull()
    .references(() => Item.id, { onDelete: "cascade" }), // this is the id of the item that was counted
  userId: integer("user_id")
    .notNull()
    .references(() => User.id), // this is the id of the user that performed the count
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const Vendor = sqliteTable("vendor", {
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
export const Receipt = sqliteTable("receipt", {
  id: integer("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => Vendor.id),
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
export const ItemCost = sqliteTable("item_cost", {
  id: integer("id").primaryKey(),
  itemId: integer("item_id").references(() => Item.id),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  receiptId: integer("receipt_id").references(() => Receipt.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const UnitOfMeasure = sqliteTable("unit_of_measure", {
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
export const ReceiptItem = sqliteTable("receipt_item", {
  id: integer("id").primaryKey(),
  receiptId: integer("receipt_id").references(() => Receipt.id),
  itemId: integer("item_id").references(() => Item.id),
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
export const ItemVendor = sqliteTable("item_vendor", {
  id: integer("id").primaryKey(),
  itemId: integer("item_id").references(() => Item.id),
  vendorId: integer("vendor_id").references(() => Vendor.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// This is a relation to the receipts table
export const VendorRelation = relations(Vendor, ({ many }) => ({
  receipts: many(Receipt),
  itemVendors: many(ItemVendor),
}));

export const ReceiptRelation = relations(Receipt, ({ one, many }) => ({
  vendor: one(Vendor, {
    fields: [Receipt.vendorId],
    references: [Vendor.id],
  }),
  itemCosts: many(ItemCost),
}));

export const ItemRelation = relations(Item, ({ many, one }) => ({
  receiptItems: many(ReceiptItem),
  inventoryCounts: many(InventoryCount),
  unitOfMeasure: one(UnitOfMeasure, {
    fields: [Item.unitOfMeasureId],
    references: [UnitOfMeasure.id],
  }),
  itemVendors: many(ItemVendor),
  itemCosts: many(ItemCost),
}));

export const ReceiptItemRelation = relations(ReceiptItem, ({ one }) => ({
  receipt: one(Receipt, {
    fields: [ReceiptItem.receiptId],
    references: [Receipt.id],
  }),
  item: one(Item, {
    fields: [ReceiptItem.itemId],
    references: [Item.id],
  }),
}));

export const UserRelation = relations(User, ({ many }) => ({
  inventoryCounts: many(InventoryCount),
}));

export const InventoryCountRelation = relations(InventoryCount, ({ one }) => ({
  item: one(Item, {
    fields: [InventoryCount.itemId],
    references: [Item.id],
  }),
  user: one(User, {
    fields: [InventoryCount.userId],
    references: [User.id],
  }),
}));

export const UnitOfMeasureRelation = relations(UnitOfMeasure, ({ many }) => ({
  items: many(Item),
}));

export const ItemVendorRelation = relations(ItemVendor, ({ one }) => ({
  item: one(Item, {
    fields: [ItemVendor.itemId],
    references: [Item.id],
  }),
  vendor: one(Vendor, {
    fields: [ItemVendor.vendorId],
    references: [Vendor.id],
  }),
}));
