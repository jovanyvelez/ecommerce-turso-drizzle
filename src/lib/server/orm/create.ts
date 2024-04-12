import { db } from '$lib/server/db';
import { /* isNull, eq, sql, inArray, count  */} from 'drizzle-orm';
import {  ordenes, type SelectUser } from '../schema';
import type { ProductStore, Usuario} from '$lib/types/Interfaces_or_types';


export async function savedOrder  (productos: Array<ProductStore>, usuario: {id:string})  {
    
    const valor = productos.reduce((a, c: ProductStore) => a + c.precios[0].price * c.qtyBuy, 0);

    console.log(valor)


}    

export async function createOrder(productos: Array<ProductStore>, usuario: SelectUser) {

    const valor = productos.reduce((a, c: ProductStore) => a + c.precios[0].price * c.qtyBuy, 0);

	const order = await db.insert(ordenes).values({
		direccionEntrega: usuario.direccion,
		ciudadEntrega: usuario.ciudad,
		departamentoEntrega: usuario.departamento,
		estado: "recibido",
		userId: usuario.id,
        codMunicipio: usuario.asesor,
        valor
	}).returning();

    console.log(order);
    /**
	 * Le ponemos el codigo de la orden a cada item del detalle en el array
	 

	const orderProducts = productos.map((product) => {
		return {
			product_id: product.id,
			cantidad: product.qtyBuy,
			precio: product.precios[0].price,
			tax: product.tax,
			orden_id: order.id
		};
	})   
*/
}