<script lang="ts">
	import MostrarCategorias from '$lib/components/MostrarCategorias.svelte';
	export let data;

	const { hijos,descendant } = data;
</script>

{#if hijos}
	<MostrarCategorias categorias={hijos} />
{/if}


<pre>{JSON.stringify(descendant, null, 2)}</pre>

