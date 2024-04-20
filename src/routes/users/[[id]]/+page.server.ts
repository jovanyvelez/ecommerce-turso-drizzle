import { superValidate } from 'sveltekit-superforms';
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