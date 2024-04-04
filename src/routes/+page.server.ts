import { lucia } from "$lib/server/auth/lucia";
import { productosAleatorios } from "$lib/server/orm/queries.js";
import { fail, redirect } from "@sveltejs/kit";


export const load = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}

	return {
		user: event.locals.user,
		datos: await productosAleatorios(),
		userType: event.locals.usuario?.roleId,
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		return redirect(302, "/login");
	}
};
