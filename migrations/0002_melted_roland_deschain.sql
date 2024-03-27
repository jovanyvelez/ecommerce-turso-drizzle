CREATE TABLE `detalle_orden` (
	`id` text PRIMARY KEY NOT NULL,
	`quantity` real DEFAULT 0,
	`price` real DEFAULT 0,
	`tax` real DEFAULT 0,
	`orden_id` text NOT NULL,
	`product_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`orden_id`) REFERENCES `ordenes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
