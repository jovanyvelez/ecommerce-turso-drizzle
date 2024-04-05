<script lang="ts">
	import MostrarCategorias from '$lib/components/MostrarCategorias.svelte';
	export let data;

	const { hijos,descendant, productos } = data;
</script>

{#if hijos}
	<MostrarCategorias categorias={hijos} />
{/if}

<h1 class="text-2xl text-red-500">{productos.length}</h1>
<pre>{JSON.stringify(productos, null, 2)}</pre>

