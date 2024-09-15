CREATE TABLE `inventory_count` (
	`id` integer PRIMARY KEY NOT NULL,
	`count` real NOT NULL,
	`checked_at` integer,
	`counted_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`item_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_cost` (
	`id` integer PRIMARY KEY NOT NULL,
	`item_id` integer,
	`cost` real NOT NULL,
	`date` integer NOT NULL,
	`receipt_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_vendor` (
	`id` integer PRIMARY KEY NOT NULL,
	`item_id` integer,
	`vendor_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`par` real NOT NULL,
	`unit_of_measure_id` integer,
	`reorder_point` real NOT NULL,
	`stock_check_frequency` integer NOT NULL,
	`description` text,
	`lead_time` integer,
	`brands` text,
	`notes` text,
	`current_cost` real,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`unit_of_measure_id`) REFERENCES `unit_of_measure`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receipt_item` (
	`id` integer PRIMARY KEY NOT NULL,
	`receipt_id` integer,
	`item_id` integer,
	`quantity` real NOT NULL,
	`unit_price` real NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receipt` (
	`id` integer PRIMARY KEY NOT NULL,
	`vendor_id` integer,
	`date` integer NOT NULL,
	`total_amount` real NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `unit_of_measure` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`abbreviation` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`is_active` integer DEFAULT true NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`email` text NOT NULL,
	`email_verification_token` text,
	`is_email_verified` integer DEFAULT false NOT NULL,
	`reset_password_token` text,
	`reset_password_expires` integer,
	`refresh_token` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vendor` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`point_of_contact` text,
	`website` text,
	`notes` text,
	`address` text,
	`phone` text,
	`email` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);