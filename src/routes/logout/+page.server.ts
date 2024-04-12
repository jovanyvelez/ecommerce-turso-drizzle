import { lucia } from "$lib/server/auth/lucia";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ( event ) => {
	
	if (!event.locals.session) {
		return fail(401);
	}
	await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		throw redirect(302,"/");

}
