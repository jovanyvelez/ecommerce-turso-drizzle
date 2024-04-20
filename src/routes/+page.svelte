<script lang="ts">
	import { enhance } from '$app/forms';
	import MostrarCategorias from '$lib/components/MostrarCategorias.svelte';
	export let data;
	const { user, datos, userType, categories } = data;
</script>

{#if userType === 'cliente' || userType === undefined}
	<MostrarCategorias categorias={categories} />

	{#if datos && datos.length > 0}
		{#await datos}
			<p>...waiting</p>
		{:then categorias}
			{#each categorias as category (category.root.id)}
				<div>
					<h1 class="my-10 ml-12 text-blue-800 font-bold text-3xl text-center">
						{category.root.nombre.trim()}
					</h1>
				</div>
				<div class="flex flex-wrap justify-center">
					{#each category.productos as product (product.id)}
						<div class="card w-32 sm:w-64 bg-base-100 shadow-xl mx-2 mt-2">
							<figure>
								<img src={product.imagenes[0].secureUrl} alt="article" class="w-full" />
							</figure>
							<div class="card-body">
								<p class="card-title text-sm font-bold">{product.name.trim()}</p>
								<div class="card-actions justify-end">
									<small class="font-bold">code: {product.name}</small>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
{/if}

{#if userType !== undefined}
	<form method="post" use:enhance>
		<button class="btn btn-primary">Sign out</button>
	</form>
{/if}
