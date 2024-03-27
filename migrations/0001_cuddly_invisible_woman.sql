CREATE TABLE `ordenes` (
	`id` integer NOT NULL,
	`direccion_entrega` text NOT NULL,
	`ciudad_entrega` text NOT NULL,
	`departamento_entrega` text NOT NULL,
	`metodo_pago` text,
	`estado` text DEFAULT 'recibido' NOT NULL,
	`notes` text,
	`valor` real DEFAULT 0 NOT NULL,
	`cod_municipio` text,
	`cod_vendedor` text,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
