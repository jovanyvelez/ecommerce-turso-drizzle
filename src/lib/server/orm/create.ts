import { db } from '$lib/server/db';
import { /* isNull, eq, sql, inArray, count  */} from 'drizzle-orm';
import {  ordenes, detalleOrden, type SelectUser } from '../schema';
import type { ProductStore } from '$lib/types/Interfaces_or_types';


export async function createOrder(productos: Array<ProductStore>, usuario: SelectUser) {

    const valor = productos.reduce((a, c: ProductStore) => a + c.precios[0].price * c.qtyBuy, 0);

	const order = await db.insert(ordenes).values({
		direccionEntrega: usuario.direccion,
		ciudadEntrega: usuario.ciudad,
		departamentoEntrega: usuario.departamento,
		estado: "recibido",
		userId: usuario.id,
        codVendedor: usuario.asesor,
        valor
	}).returning({numOrder: ordenes.id});

    console.log(order);
    /**
	 * Le ponemos el codigo de la orden a cada item del detalle en el array
	*/ 

	const orderProducts = productos.map((product) => {
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
/*
	import { eq } from 'drizzle-orm';
	import { db } from '../drizzle/db';
	import { suppliers } from '../drizzle/schema';
	
	const { id } = req.params;
	
	await db
		.update(suppliers)
		.set({
		  city: 'TestCity1Updated',
		  country: 'TestCountry1Updated',
		})
		.where(eq(suppliers.id, id));
*/
}