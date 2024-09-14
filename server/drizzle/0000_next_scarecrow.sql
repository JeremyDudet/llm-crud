CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit` text
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`is_active` integer DEFAULT true NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`email_verification_token` text,
	`is_email_verified` integer DEFAULT false NOT NULL,
	`reset_password_token` text,
	`reset_password_expires` integer,
	`refresh_token` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);