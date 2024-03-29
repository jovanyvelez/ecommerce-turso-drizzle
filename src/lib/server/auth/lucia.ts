import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { db } from "../db";
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { users, session} from "../schema";


const adapter = new DrizzleSQLiteAdapter(db, session, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
            email: attributes.email,
			password: attributes.password
		};
	}
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

type DatabaseUserAttributes = {
	email: string;
	password: string;
}

