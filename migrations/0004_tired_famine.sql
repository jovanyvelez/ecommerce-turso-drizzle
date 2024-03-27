CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text DEFAULT 'cliente' NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`doc_type` text NOT NULL,
	`num_doc` text NOT NULL,
	`departamento` text NOT NULL,
	`ciudad` text NOT NULL,
	`direccion` text NOT NULL,
	`bussines_unit` text,
	`zone_id` integer,
	`asesor` text,
	`descuento` real DEFAULT 0,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `zones` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`zone` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_num_doc_unique` ON `users` (`num_doc`);--> statement-breakpoint
CREATE UNIQUE INDEX `zones_zone_unique` ON `zones` (`zone`);