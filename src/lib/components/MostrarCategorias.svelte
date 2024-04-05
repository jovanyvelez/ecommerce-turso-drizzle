<script lang="ts">
	export let categorias: Array<{ id: string; name: string }>;
</script>


	<nav
		class="my-4 flex flex-col sm:flex-row justify-evenly items-center text-blue-800 font-extrabold"
	>
		{#each categorias as categoria (categoria.id)}
			<a
				href="/tienda/{JSON.stringify({ param: categoria.id, page: 1, por_categoria: true })}"
				class="py-2" data-sveltekit-reload><span>{categoria.name}</span></a
			>
		{/each}
	</nav>

