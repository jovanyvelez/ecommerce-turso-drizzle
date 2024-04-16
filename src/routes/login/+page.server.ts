import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth/lucia';
import { Argon2id } from 'oslo/password';
import { superValidate, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { userSession } from '$lib/server/orm/queries.js';

const userSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6)
		.max(255)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
		.trim(),
});

export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	const form = await superValidate(zod(userSchema));
	return { form };
};

export const actions = {
	login: async (event) => {
		//const form = await superValidate(event.request, userSchema);
		//if (!form.valid) return fail(400, { form });

		if (event.locals.user) {
			throw redirect(302, '/carrito');
		}

		const form = await superValidate(event.request, zod(userSchema));


		if (!form.valid) {
			return message( form, 'Form not valid');
		}

		const existUser = await userSession(form.data.email);

		if (!existUser) {
			return message(
				form,
				'Nombre de usuario o contraseña incorrectos'
			)
		}

		const validPassword = await new Argon2id().verify(existUser.password, form.data.password);
		if (!validPassword) {
			return message(
				form, 'Incorrect username or password'
			);
		}

		const session = await lucia.createSession(existUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/carrito');
		//return message(form, 'Form posted successfully!');

	}
};
