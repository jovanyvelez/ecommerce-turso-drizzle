import { fail, redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth/lucia";
import { Argon2id } from "oslo/password";
import { superValidate } from "sveltekit-superforms";
import { z } from "zod";
import { zod } from 'sveltekit-superforms/adapters'
import { userSession } from "$lib/server/orm/queries.js";


const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).refine((data) => {
	if (!data.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)) {
	  throw new Error('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número, y un carácter especial');
	}
  }),
})

export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/");
	}
	const form = await superValidate(zod(userSchema))
	return { form };
};

export const actions = {
	login: async (event) => {
		//const form = await superValidate(event.request, userSchema);
		//if (!form.valid) return fail(400, { form });

		if(event.locals.user) {
			throw redirect(302, '/carrito');
		}


		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31 //||
			//!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: "Invalid username"
			});
		}
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}



		const existUser = await userSession(username)


		if (!existUser) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const validPassword = await new Argon2id().verify(existUser.password, password);
		if (!validPassword) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const session = await lucia.createSession(existUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		return redirect(302, "/carrito");
	}
};
