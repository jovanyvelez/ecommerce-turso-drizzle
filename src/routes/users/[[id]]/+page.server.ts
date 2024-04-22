import { lucia } from "$lib/server/auth/lucia";
import {LibsqlError} from "@libsql/client";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "$lib/server/db";
import { users, usuarios } from "$lib/server/schema";
import { superValidate, message } from 'sveltekit-superforms';
import { UserSchema, type UserCrudSchema } from '$lib/types/zodSchemas/zodSchemas';

import { zod } from 'sveltekit-superforms/adapters';

import { buscarDepartamentos, findUserByEmailToModify } from '$lib/server/orm/queries';

export const load = async ({ params }) => {

    const departamentos = await buscarDepartamentos();

	const {departments, index} = departamentos;

	let user: UserCrudSchema | null = null;

	if(params.id){
		user = await findUserByEmailToModify(params.id);
	}

	const form = await superValidate(user, zod(UserSchema));

	return { departments,index,form  };
};


export const actions = {
	register: async ({ request, cookies }) => {
	
	
		//Asignamos los datos enviados a un form de superform
		const form = await superValidate(request, zod(UserSchema));

		if (!form.valid) return message(form, 'Upss, algunos datos fueron incorrectos');
	
		const hashedPassword = await new Argon2id().hash(form.data.numDoc);
		const userId = generateId(15);

		try {

			await db.insert(users).values({
				id: userId,
				email: form.data.email,
				password: hashedPassword
			});

			const { name, phone, email, docType, numDoc, departamento, ciudad, direccion } = form.data;

			await db.insert(usuarios).values({
				name,
				phone,
				email,
				docType,
				numDoc,
				departamento,
				ciudad,
				direccion
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} catch (e) {
			if (e instanceof LibsqlError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
				return fail(400, {
					message: "Ya existe ese nombre de usuario"
				});
			}
			return fail(500, {
				message: "An unknown error occurred"
			});
		}
		return redirect(302, "/carrito");
	
	}
}






