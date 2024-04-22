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
	register: async ({ request }) => {
	
	
		//Asignamos los datos enviados a un form de superform
		const form = await superValidate(request, zod(UserSchema));
	
		//let registro = form.data;
	
		//Prueba de verificacion de los datos colectados


		console.log(form.data);
		
	
		if (!form.valid) return message(form, 'Form not valid');
	
	}
}






