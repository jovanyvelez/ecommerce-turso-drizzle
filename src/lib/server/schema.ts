import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, text, real, primaryKey } from 'drizzle-orm/sqlite-core';

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
	productosDeLaCategoria: many(productosCategorias)
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
	categoriasDelProducto: many(productosCategorias)
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
