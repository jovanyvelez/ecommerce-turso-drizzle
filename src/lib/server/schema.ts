import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, text, real, primaryKey, unique } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	parentId: text('parent_id'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: 'children'
	}),
	children: many(categories, {
		relationName: 'children'
	}),
	productosDeLaCategoria: many(productosCategorias),
	imagen: one(images, {
		fields: [categories.id],
		references: [images.categoriaId],
		relationName: 'imagen'
	})
}));

export const productos = sqliteTable('productos', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	codigo: text('codigo').unique(),
	description: text('description').default('Sin descripción').notNull(),
	eanCode: text('ean_code').unique(),
	marca: text('marca').default('Sin marca'),
	nuevo: integer('nuevo', { mode: 'boolean' }).default(true),
	promo: integer('promo', { mode: 'boolean' }).default(false),
	descuento: real('descuento').default(0.0),
	quantity: real('quantity').default(0.0),
	tax: real('tax').default(0.0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	categoriaId: text('category_id').references(() => categories.id)
});

export const productosRelations = relations(productos, ({ many }) => ({
	categoriasDelProducto: many(productosCategorias),
	imagenes: many(images),
	precios: many(prices),
	ordenes: many(detalleOrden)
}));

export const productosCategorias = sqliteTable(
	'productos_categorias',
	{
		productId: text('product_id')
			.notNull()
			.references(() => productos.id),
		categoryId: text('category_id')
			.notNull()
			.references(() => categories.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.productId, t.categoryId] })
	})
);

export const productosCategoriasRelations = relations(productosCategorias, ({ one }) => ({
	product: one(productos, {
		fields: [productosCategorias.productId],
		references: [productos.id],
		relationName: 'categoriasDelProducto'
	}),
	category: one(categories, {
		fields: [productosCategorias.categoryId],
		references: [categories.id],
		relationName: 'categoriasDelProducto'
	})
}));

export const images = sqliteTable('images', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	main: integer('main', { mode: 'boolean' }),
	publicId: text('public_id'),
	secureUrl: text('secure_url').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	categoriaId: text('category_id').references(() => categories.id),
	productoId: text('product_id').references(() => productos.id)
});

export const imagesRelations = relations(images, ({ one }) => ({
	categoria: one(categories, {
		fields: [images.categoriaId],
		references: [categories.id]
	}),
	producto: one(productos, {
		fields: [images.productoId],
		references: [productos.id]
	})
}));

export const prices = sqliteTable(
	'prices',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		price: real('price').notNull().default(0.0),
		name: text('name', { enum: ['main', 'uno', 'dos', 'tres', 'cuatro', 'cinco'] })
			.notNull()
			.default('main'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		productId: text('product_id')
			.notNull()
			.references(() => productos.id)
	},
	(t) => ({
		unq: unique().on(t.productId, t.name)
	})
);

export const pricesRelations = relations(prices, ({ one }) => ({
	producto: one(productos, {
		fields: [prices.productId],
		references: [productos.id]
	})
}));

export const ordenes = sqliteTable('ordenes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	direccionEntrega: text('direccion_entrega').notNull(),
	ciudadEntrega: text('ciudad_entrega').notNull(),
	departamentoEntrega: text('departamento_entrega').notNull(),
	metodoPago: text('metodo_pago'),
	estado: text('estado', { enum: ['recibido', 'enviado', 'entregado', 'cancelado'] })
		.default('recibido')
		.notNull(),
	fechaDespacho: integer('id', { mode: 'timestamp_ms' }).notNull(),
	notes: text('notes'),
	valor: real('valor').notNull().default(0.0),
	codMunicipio: text('cod_municipio'),
	codVendedor: text('cod_vendedor'),
	userId: text('user_id'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const ordenesRelations = relations(ordenes, ({ many, one }) => ({
	detalle: many(detalleOrden),
	usuario: one(usuarios, {
		fields: [ordenes.userId],
		references: [usuarios.id]
	})
}));

export const detalleOrden = sqliteTable(
	'detalle_orden',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		quantity: real('quantity').default(0.0),
		price: real('price').default(0.0),
		tax: real('tax').default(0.0),
		ordenId: text('orden_id')
			.notNull()
			.references(() => ordenes.id),
		productId: text('product_id')
			.notNull()
			.references(() => productos.id),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`)
	},
	(t) => ({
		unq: unique().on(t.ordenId, t.productId)
	})
);

export const detalleOrdenRelations = relations(detalleOrden, ({ one }) => ({
	orden: one(ordenes, {
		fields: [detalleOrden.ordenId],
		references: [ordenes.id]
	}),
	producto: one(productos, {
		fields: [detalleOrden.productId],
		references: [productos.id]
	})
}));

export const usuarios = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roleId: text('role_id', { enum: ['admin', 'asesor', 'cliente', 'operador'] })
		.notNull()
		.default('cliente'),
	name: text('name').notNull(),
	phone: text('phone').notNull(),
	email: text('email').notNull().unique(),
	docType: text('doc_type', {
		enum: ['Cedula', 'Cedula_de_extranjería', 'NIT', 'Pasaporte']
	}).notNull(),
	numDoc: text('num_doc').notNull().unique(),
	departamento: text('departamento').notNull(),
	ciudad: text('ciudad').notNull(),
	direccion: text('direccion').notNull(),
	bussinesUnit: text('bussines_unit'),
	zoneId: integer('zone_id'),
	asesor: text('asesor'),
	descuento: real('descuento').default(0.0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const usuariosRelations = relations(usuarios, ({ many, one }) => ({
	ordenes: many(ordenes),
	asesorDelCliente: one(usuarios, {
		fields: [usuarios.asesor],
		references: [usuarios.id],
		relationName: 'asesoresYClientes'
	}),
	clientesDelAsesor: many(usuarios, {
		relationName: 'asesoresYClientes'
	}),
	zona: one(zonas, {
		fields: [usuarios.zoneId],
		references: [zonas.id],
		relationName: 'zona'
	})
}));

export const zonas = sqliteTable('zones', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	zone: text('zone').notNull().unique(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const zonasRelations = relations(zonas, ({ many }) => ({
	ordenes: many(usuarios)
}));

export const departamentos = sqliteTable('departamentos', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	departamento: text('departamento').notNull().unique()
});

export const departamentosRelations = relations(departamentos, ({ many }) => ({
	ciudades: many(ciudades)
}));

export const ciudades = sqliteTable('ciudades', {
	id: integer('id').primaryKey(),
	ciudad: text('ciudad').notNull(),
	codigo: text('codigo').notNull().unique(),
	departamentoId: text('departamento_id').notNull()
});

export const ciudadesRelations = relations(ciudades, ({ one }) => ({
	departamento: one(departamentos, {
		fields: [ciudades.departamentoId],
		references: [departamentos.id]
	})
}));

export const users = sqliteTable('usuarios', {
	id: text('id').primaryKey().notNull(),
	email: text('username').notNull().unique(),
	password: text('password').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const usersRelation = relations(users, ({ many, one }) => ({
	session: many(session),
	datos: one(usuarios, {
		fields: [users.email],
		references: [usuarios.email],
	})
}));

export const session = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull()
});

export const sessionRelation = relations(session, ({ one }) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	})
}));

export type UserInsertSchema = typeof users.$inferInsert;