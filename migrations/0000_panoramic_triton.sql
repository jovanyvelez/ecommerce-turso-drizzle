CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`parent_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ciudades` (
	`id` integer PRIMARY KEY NOT NULL,
	`ciudad` text NOT NULL,
	`codigo` text NOT NULL,
	`departamento_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `departamentos` (
	`id` text PRIMARY KEY NOT NULL,
	`departamento` text NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`main` integer,
	`public_id` text,
	`secure_url` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`category_id` text,
	`product_id` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ordenes` (
	`id` text PRIMARY KEY NOT NULL,
	`direccion_entrega` text NOT NULL,
	`ciudad_entrega` text NOT NULL,
	`departamento_entrega` text NOT NULL,
	`metodo_pago` text,
	`estado` text DEFAULT 'recibido' NOT NULL,
	`fecha_despacho` integer,
	`notes` text,
	`valor` real DEFAULT 0 NOT NULL,
	`cod_municipio` text,
	`cod_vendedor` text,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` text PRIMARY KEY NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`name` text DEFAULT 'main' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`product_id` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true,
	`codigo` text,
	`description` text DEFAULT 'Sin descripción' NOT NULL,
	`ean_code` text,
	`marca` text DEFAULT 'Sin marca',
	`nuevo` integer DEFAULT true,
	`promo` integer DEFAULT false,
	`descuento` real DEFAULT 0,
	`quantity` real DEFAULT 0,
	`tax` real DEFAULT 0,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`category_id` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `productos_categorias` (
	`product_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`category_id`, `product_id`),
	FOREIGN KEY (`product_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
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
CREATE UNIQUE INDEX `ciudades_codigo_unique` ON `ciudades` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `departamentos_departamento_unique` ON `departamentos` (`departamento`);--> statement-breakpoint
CREATE UNIQUE INDEX `detalle_orden_orden_id_product_id_unique` ON `detalle_orden` (`orden_id`,`product_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `prices_product_id_name_unique` ON `prices` (`product_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `productos_codigo_unique` ON `productos` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `productos_ean_code_unique` ON `productos` (`ean_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_username_unique` ON `usuarios` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_num_doc_unique` ON `users` (`num_doc`);--> statement-breakpoint
CREATE UNIQUE INDEX `zones_zone_unique` ON `zones` (`zone`);