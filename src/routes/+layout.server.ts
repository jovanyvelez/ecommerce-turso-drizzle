import { mainCategories } from "$lib/server/orm/queries";

export const load = async ({locals}) => {

    const categories = await mainCategories();


    let user, userType;
    if (!locals.usuario) {
        user = null;
        userType = null;
        return { categories, user, userType };
    }
    
    user = locals.usuario.name;
    userType = locals.usuario.roleId;
    return { categories, user, userType };
}




