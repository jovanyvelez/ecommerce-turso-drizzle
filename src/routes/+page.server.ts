import { db } from "$lib/server/db"
import { usersTable } from "$lib/server/schema";
import { asc, desc } from "drizzle-orm";

export const load = async () => {
   // await db.insert(usersTable).values({username: 'admin', admin: true});
    
    const users = await db.query.usersTable.findMany({
        orderBy: [asc(usersTable.username)],
    });
    console.log(users)
    return {
        users
    }
}