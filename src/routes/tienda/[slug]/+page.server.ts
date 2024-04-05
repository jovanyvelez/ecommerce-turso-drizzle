import {
	children,
	getCategoriesWithDescendants,
	getProductsByListCategories
} from '$lib/server/orm/queries';

export async function load({ params }) {
	
	type mQuery = {
		param: string;
		page: number;
		por_categoria: boolean;
	};

	let query: mQuery;

	try {
		query = JSON.parse(params.slug);
	} catch (error) {
		query = { param: '', page: 1, por_categoria: false };
	}


	const pageSize = 12;

	//consultamos todas las categorias hijas y descendientes de la categoria
	//y luego consultamos todos los productos de las categorias

	
	let descendant;
	let productos;
	let hijos;

	if (!query.por_categoria) {
		//productos = await products_by_name_query(query.param, pageSize, query.page);
	} else {

		hijos = await children(query.param); //array con id de categorias hijas
		descendant = await getCategoriesWithDescendants(query.param); //array con id de categorias descendientes
		if (descendant && !Array.isArray(descendant)) {
			productos = await getProductsByListCategories([descendant.root.id, ...descendant.children], pageSize, query.page);
		}else{
			productos = null;
		}
	}

	const {products, totalRegistros} = productos;



	return {hijos, products, cantidad: totalRegistros, query, page: query.page, pages: Math.ceil( totalRegistros / pageSize)};
}
