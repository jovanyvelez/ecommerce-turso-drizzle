<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';

	import SuperDebug from 'sveltekit-superforms';

	export let data;

	const { departments, index } = data;

	type Municipio = {
		ciudad: string;
		codigo: string;
	};

	let municipios: Array<Municipio> = [];

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
		resetForm: false
	});

	async function handleSubmit() {

		municipios = index?.get($form.departamento)?.ciudades || [];
		$form.ciudad = '';

	}

</script>

{#if $message}
	<h3 class:invalid={$page.status >= 400}>{$message}</h3>
{/if}

<h2>{!$form.id ? 'Create' : 'Update'} user</h2>


<div class="flex justify flex-col">
	<select
		id="departamento"
		bind:value={$form.departamento}
		class="select select-bordered w-full mt-4"
		data-invalid={$errors.departamento}
		{...$constraints.departamento}
		on:change={() => handleSubmit()}
		name="departament"
	>
		<option value="" disabled selected hidden>Departamento</option>
		{#if departments}
			{#each departments as departamento (departamento.id)}
				<option value={departamento.id}>
					{departamento.name}
				</option>
			{/each}
		{/if}
	</select>

	{#if $errors.departamento}
		<small class="text-error">{$errors.departamento}</small>
	{/if}

	{#if municipios.length > 0}
		<label class="label mr-6 my-2 p-2" for="municipio">Seleccione Ciudad</label>
		<select
			id="municipio"
			{...$constraints.ciudad}
			bind:value={$form.ciudad}
			class="select select-bordered w-full mb-5"
			name="city"
		>
		<option value="" disabled selected hidden>Municipio</option>
			{#each municipios as Municipio (Municipio.id)}
				<option value={Municipio.ciudad}>
					{Municipio.ciudad}
				</option>
			{/each}
		</select>
		{#if $errors.ciudad}
			<small class="text-error">{$errors.ciudad}</small>
		{/if}
	{/if}
</div>

<SuperDebug data={$form} />