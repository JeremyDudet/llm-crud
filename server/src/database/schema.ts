import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  varchar,
  pgSchema,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
  resetPasswordExpires: timestamp("reset_password_expires"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Item = pgTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  par: decimal("par", { precision: 10, scale: 2 }).notNull(),
  unitOfMeasureId: integer("unit_of_measure_id").references(
    () => UnitOfMeasure.id
  ),
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 2 }).notNull(),
  stockCheckFrequency: integer("stock_check_frequency").notNull(),
  description: text("description"),
  leadTime: integer("lead_time"),
  brands: text("brands"),
  notes: text("notes"),
  currentCost: decimal("current_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Command = pgTable("command", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const InventoryCount = pgTable("inventory_count", {
  id: serial("id").primaryKey(),
  count: decimal("count", { precision: 10, scale: 2 }).notNull(),
  checkedAt: timestamp("checked_at"),
  countedAt: timestamp("counted_at").notNull().defaultNow(),
  itemId: integer("item_id")
    .notNull()
    .references(() => Item.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => User.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Vendor = pgTable("vendor", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  pointOfContact: varchar("point_of_contact", { length: 255 }),
  website: varchar("website", { length: 255 }),
  notes: text("notes"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Receipt = pgTable("receipt", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => Vendor.id),
  date: timestamp("date").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ItemCost = pgTable("item_cost", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => Item.id),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  receiptId: integer("receipt_id").references(() => Receipt.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const UnitOfMeasure = pgTable("unit_of_measure", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatThreads = pgTable("chat_threads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id")
    .notNull()
    .references(() => chatThreads.id),
  content: text("content").notNull(),
  role: varchar("role", { length: 50, enum: ["user", "assistant"] }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const ReceiptItem = pgTable("receipt_item", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").references(() => Receipt.id),
  itemId: integer("item_id").references(() => Item.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ItemVendor = pgTable("item_vendor", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => Item.id),
  vendorId: integer("vendor_id").references(() => Vendor.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/*============= RELATIONS =============*/

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
  receiptItems: many(ReceiptItem),
}));

export const ItemRelations = relations(Item, ({ many, one }) => ({
  itemCosts: many(ItemCost),
  inventoryCounts: many(InventoryCount),
  receiptItems: many(ReceiptItem),
  itemVendors: many(ItemVendor),
  unitOfMeasure: one(UnitOfMeasure, {
    fields: [Item.unitOfMeasureId],
    references: [UnitOfMeasure.id],
  }),
}));

export const ItemCostRelations = relations(ItemCost, ({ one }) => ({
  item: one(Item, {
    fields: [ItemCost.itemId],
    references: [Item.id],
  }),
  receipt: one(Receipt, {
    fields: [ItemCost.receiptId],
    references: [Receipt.id],
  }),
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
