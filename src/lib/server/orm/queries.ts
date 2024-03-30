import {db} from "$lib/server/db";
import { isNull, eq } from "drizzle-orm";
import { categories, usuarios } from "../schema";

export async function mainCategories() {
    const categorias = await db.select().from(categories).where(isNull(categories.parentId));
	return categorias;
}

export async function buscarUsuarioPorEmail(email: string | null) {
    
    if(email === null) {
        return null;
    };

    const users = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, email));
    
    if (users.length === 0) {
        return null;
    };

    const user = users[0];
    return {id:user.id, roleId: user.roleId, name:user.name};
}