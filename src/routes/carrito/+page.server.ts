import type {  Actions } from './$types';

import { buscarUsuarioOrden } from '$lib/server/orm/queries';
import { createOrder } from '$lib/server/orm/create';
import enviarCorreo  from '$lib/server/send_mails/mails';



export async function load() {
    return { };
}


export const actions = {
	compra: async ({ request, locals}) => {

		if(!locals.usuario)  { 
			return { success: false, savedorder: "nada" }
		}
		const usuario = await buscarUsuarioOrden(locals.usuario.id);

		if(!usuario) return { success: false, savedorder: "nada" }
		
		const data = await request.formData();

		const carrito = JSON.parse(data.get("carrito") as string)

		const idOrder = await createOrder(carrito, usuario);

		await enviarCorreo(usuario.email,'Compra exitosa',`<p>Felicidades tu compra fue exitosa y tu número de orden es <strong>${idOrder}</strong></p>`)

		return { success: true, savedorder: "4" };

	},

}satisfies Actions;