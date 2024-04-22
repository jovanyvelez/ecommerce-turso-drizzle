<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';

	import SuperDebug from 'sveltekit-superforms';

	export let data;

	const { departments, index } = data;

	type Municipio = {
		ciudad: string;
		id: string;
	};

	let municipios: Array<Municipio> = [];

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
		resetForm: true
	});

	async function handleSubmit() {
		municipios = index?.get($form.departamento)?.ciudades || [];
		$form.ciudad = '';
	}
</script>

{#if $message}
	<h3 class=" text-center text-xl text-red-500">{$message}</h3>
{/if}

<h1 class="text-xl sm:text-3xl text-center my-4">Datos de facturacion</h1>

<form action="?/register" method="post">
	<input type="hidden" name="id" bind:value={$form.id} />

	<div class="flex flex-wrap flex-col sm:w-8/12 sm:p-10 mx-3 sm:mx-auto">
		<input
			id="name"
			name="name"
			type="text"
			placeholder="Nombre y apellidos o Razon Social"
			data-invalid={$errors.name}
			bind:value={$form.name}
			{...$constraints.name}
			class="input w-full mb-4 {$errors?.name ? 'input-error' : 'input-bordered'} rounded-xl"
		/>

		{#if $errors.name}
			<small class="text-error">{$errors.name}</small>
		{/if}

		<div>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Correo Electrónico"
				data-invalid={$errors.email}
				bind:value={$form.email}
				{...$constraints.email}
				class="input w-full {$errors?.email ? 'input-error' : 'input-bordered'}   rounded-md"
			/>
		</div>

		{#if $errors.email}
			<small class="text-error">{$errors.email}</small>
		{/if}

		<div>
			<input
				id="telefono"
				name="phone"
				type="text"
				placeholder="Tefono de contacto"
				data-invalid={$errors.phone}
				bind:value={$form.phone}
				{...$constraints.phone}
				class="input mt-4 w-full {$errors?.phone
					? 'input-error'
					: 'input-bordered'}  input-bordered rounded-xl"
			/>
		</div>
		<!--Hasta aqui todo ok-->
		{#if $errors.phone}
			<small class="text-error">{$errors.phone}</small>
		{/if}

		<div
			id="tipo"
			class=" flex flex-col sm:flex-row justify-center items-center p-2 px-2 border my-4 border-slate-300 rounded-lg"
		>
			<select
				name="docType"
				bind:value={$form.docType}
				data-invalid={$errors.docType}
				class="select select-bordered select-xs mr-2 mb-3"
			>
				<option disabled>tipo</option>
				<option value="Cedula">Cedula</option>
				<option value="Cedula_de_extranjería">Cedula_de_extranjería</option>
				<option value="NIT">NIT</option>
				<option value="Pasaporte">Pasaporte</option>
			</select>

			<input
				type="text"
				name="numDoc"
				bind:value={$form.numDoc}
				{...$constraints.numDoc}
				data-invalid={$errors.numDoc}
				class="input w-8/12 {$errors?.numDoc ? 'input-error' : 'input-bordered'}"
				placeholder="Numero de identificación"
			/>
		</div>
		{#if $errors.numDoc}
			<small class="text-error">{$errors.numDoc}</small>
		{/if}
		{#if $errors.docType}
			<small class="text-error">{$errors.docType}</small>
		{/if}

		<div>
			<input
				id="direccion"
				name="direccion"
				type="text"
				placeholder="Escriba direccion"
				data-invalid={$errors.direccion}
				bind:value={$form.direccion}
				{...$constraints.direccion}
				class="input input-bordered w-full my-4{$errors?.direccion
					? 'input-error'
					: 'input-bordered'}  rounded-md mt-4"
			/>
		</div>
		{#if $errors.direccion}
			<small class="text-error">{$errors.direccion}</small>
		{/if}
	</div>

	<div class="flex justify flex-col sm:w-8/12 sm:p-5 mx-3 sm:mx-auto">
		<select
			id="departamento"
			bind:value={$form.departamento}
			class="select select-bordered w-full mt-4"
			data-invalid={$errors.departamento}
			{...$constraints.departamento}
			on:change={() => handleSubmit()}
			name="departamento"
		>
			<option value="" disabled selected hidden>Departamento</option>
			{#if departments}
				{#each departments as departamento (departamento.id)}
					<option value={departamento.name}>
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
				name="ciudad"
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

		<div>
			<div class="w-full flex justify-center mt-5">
				<button type="submit" class="btn btn-primary btn-sm my-4">Registrar</button>

				{#if $delayed}
					<span class="text-4xl">Un momento</span>
				{/if}
			</div>
		</div>
	</div>
</form>

<SuperDebug data={$form} />
