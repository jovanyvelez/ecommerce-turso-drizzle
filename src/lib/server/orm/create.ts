import { db } from '$lib/server/db';
import { eq,sql } from 'drizzle-orm';
import {  ordenes, detalleOrden, productos, type SelectUser } from '../schema';
import type { ProductStore } from '$lib/types/Interfaces_or_types';


export async function createOrder(carrito: Array<ProductStore>, usuario: SelectUser) {

    const valor = carrito.reduce((a, c: ProductStore) => a + c.precios[0].price * c.qtyBuy, 0);

	
	const order = await db.insert(ordenes).values({
		direccionEntrega: usuario.direccion,
		ciudadEntrega: usuario.ciudad,
		departamentoEntrega: usuario.departamento,
		estado: "recibido",
		userId: usuario.id,
        codVendedor: usuario.asesor,
        valor
	}).returning({numOrder: ordenes.id});

    /**
	 * Le ponemos el codigo de la orden a cada item del detalle en el array
	*/ 

	const orderProducts = carrito.map((product) => {
		return {
			productId: product.id,
			quantity: product.qtyBuy,
			price: product.precios[0].price,
			tax: product.tax,
			ordenId: order[0].numOrder
		};
	});
	
	/**
	 * Grabamos el detalle de la orden en la base de datos
	 */

	await db.insert(detalleOrden).values(orderProducts);

	/**
	 * Actualizamos en inventario final por producto en la tabla productos
	 */

	await Promise.all(
		carrito.map(async (element) => {
			await db.update(productos)
			.set({ quantity: sql`productos.quantity - ${element.qtyBuy}` })
			.where(eq(productos.id, element.id));
		})
	);




}