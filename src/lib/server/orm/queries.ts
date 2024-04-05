import { db } from '$lib/server/db';
import { isNull, eq, sql, inArray } from 'drizzle-orm';
import { categories, usuarios, productos, images, prices } from '../schema';

export async function mainCategories() {
	const categorias = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(isNull(categories.parentId));
	return categorias;
}

export async function buscarUsuarioPorEmail(email: string | null) {
	if (email === null) {
		return null;
	}

	const users = await db.select().from(usuarios).where(eq(usuarios.email, email));

	if (users.length === 0) {
		return null;
	}

	const user = users[0];
	return { id: user.id, roleId: user.roleId, name: user.name };
}


export async function productosAleatorios(){

	const categoríasConDescendientes = await getCategoriesWithDescendants();

	if (!categoríasConDescendientes) {
		return null;
	};

	let productosDeCategorias;

	if(Array.isArray(categoríasConDescendientes) ) {

		productosDeCategorias = await Promise.all(categoríasConDescendientes.map(async (category) => {
			const rootAndChildren: string[] = [category.root.id, ...category.children];
			const productos = await getRandomProductsByListCategories(rootAndChildren);
			return {root: category.root, productos};
		}));
	}else{
		productosDeCategorias = [{root: categoríasConDescendientes.root, productos: categoríasConDescendientes.children}]
	}

	return productosDeCategorias;
}

//Una manera algo ineficiente de hacerlo
/*
export async function getRootCategoriesWithDescendants1() {
	const rootCategories = await db
		.select({ id: categories.id })
		.from(categories)
		.where(isNull(categories.parentId));

	const categoriesWithDescendants = await Promise.all(
		rootCategories.map(async (category) => {
			const descendants = await getDescendants(category.id);

			return { root: category.id, children: [...descendants] };
		})
	);

	return categoriesWithDescendants;
}

async function getDescendants(parentId: string) {
	const descendientes = await db
		.select({ id: categories.id })
		.from(categories)
		.where(eq(categories.parentId, parentId));

	const descendants = descendientes.map((descendiente) => descendiente.id);

	let descendantsWithChildren: string[] = [];

	for (const descendant of descendants) {
		const children = await getDescendants(descendant);

		descendantsWithChildren = [...descendantsWithChildren, ...children, descendant];
	}

	return descendantsWithChildren;
}*/

/* interface Category {
	id: string;
	parentId: string | null;
	children: string[];
}

export async function getRootCategoriesWithDescendants() {
	
	const categoryMap = new Map();
	const rootCategories: Array<{id: string, nombre: string}> = [];

	//  Query database and get all categories
	const allCategories = await db
		.select({ id: categories.id, nombre: categories.name, parentId: categories.parentId })
		.from(categories);

	// Build a map of categories where the key is the category id
	allCategories.forEach((category) => {
		categoryMap.set(category.id, { id: category.id, nombre:category.nombre, children: [] });
		if (category.parentId === null) {
			rootCategories.push({id:category.id, nombre:category.nombre});
		}
	});

	// Populate children for each category
	allCategories.forEach((category) => {
		if (category.parentId !== null) {
			categoryMap.get(category.parentId).children.push(category.id);
		}
	});

	// Build the final structure
	const result = rootCategories.map((root) => {
		return {
			root,
			children: getCategoryDescendants(categoryMap, root.id)
		};
	});

	return result;
}

function getCategoryDescendants(categoryMap: Map<string, Category>, categoryId: string): string[] {
	const descendants = [];
	const category = categoryMap.get(categoryId);

	if (category) {
		for (const childId of category.children) {
			descendants.push(childId);
			descendants.push(...getCategoryDescendants(categoryMap, childId));
		}
	}
	return descendants;
} */


interface Category {
    id: string;
    parentId: string | null;
    children: string[];
}

export async function getCategoriesWithDescendants(categoryId?: string) {
    const categoryMap = new Map();
    const rootCategories: Array<{id: string, nombre: string}> = [];

    //  Query database and get all categories
    const allCategories = await db
        .select({ id: categories.id, nombre: categories.name, parentId: categories.parentId })
        .from(categories);

    // Build a map of categories where the key is the category id
    allCategories.forEach((category) => {
        categoryMap.set(category.id, { id: category.id, nombre: category.nombre, children: [] });
        if (category.parentId === null) {
            rootCategories.push({id: category.id, nombre: category.nombre});
        }
    });

    // Populate children for each category
    allCategories.forEach((category) => {
        if (category.parentId !== null) {
            categoryMap.get(category.parentId).children.push(category.id);
        }
    });

    // Check if categoryId is provided
    if (categoryId) {
        const selectedCategory = categoryMap.get(categoryId);

        if (!selectedCategory) {
            return null; // Category not found
        }

        // Build the final structure for the selected category
        const result = {
            root: { id: selectedCategory.id, nombre: selectedCategory.nombre },
            children: getCategoryDescendants(categoryMap, categoryId)
        };

        return result;
    } else {
        // Build the final structure for root categories
        const result = rootCategories.map((root) => {
            return {
                root,
                children: getCategoryDescendants(categoryMap, root.id)
            };
        });

        return result;
    }
}

function getCategoryDescendants(categoryMap: Map<string, Category>, categoryId: string): string[] {
    const descendants = [];
    const category = categoryMap.get(categoryId);

    if (category) {
        for (const childId of category.children) {
            descendants.push(childId);
            descendants.push(...getCategoryDescendants(categoryMap, childId));
        }
    }
    
    return descendants;
}

export async function getSingleCategoryDescendants(categoryId: string, categoryIdList: Array<{id: string, name: string}>) {
	
	const children = categoryIdList.map((category) => {
		return category.id
	})

	const categoryMap = new Map();
}

export async function getRandomProductsByListCategories(categoria: Array<string>) {
	
	/*const randomCategories = await db
    .select({ id: productos.id, name: productos.name, secureUrl: images.secureUrl, precio: prices.price })
    .from(productos)
    .where(inArray(productos.categoriaId, categoria))
    .orderBy(sql`RANDOM()`)
    .limit(4)
    .fullJoin(images, eq(productos.id, images.productoId))
    .fullJoin(prices, eq(productos.id, prices.productId));
 */

	const products = await db.query.productos.findMany({
		where: inArray(productos.categoriaId, categoria),
		columns: { id: true, name: true },
		with: {
			imagenes: {
				where: eq(images.main, true),
				columns: {
					secureUrl: true,
				}
			},
			precios: {
        where: eq(prices.name, 'main'),
        columns: {
          price: true
        }
      }
		},
		orderBy: sql`RANDOM()`,
		limit: 4
	});

	//console.log(JSON.stringify(users, null, 2));

	return products;
}

export async function children (parent: string): Promise<Array<{id: string, name: string}>> {

	const  hijos = await db.query.categories.findMany({
		where:eq(categories.parentId, parent),
		columns: {
			id: true,
			name: true
		}
	});

	return hijos;
}