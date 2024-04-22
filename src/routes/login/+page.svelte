<script lang="ts">
	import type { ActionData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	//export let form: ActionData;
	export let data;
	const { form, errors, message, constraints, enhance } = superForm(data.form);

	/* const { form, errors, enhance, delayed, message, reset, constraints } = superForm(data.form, {
		resetForm: true,
		//validators: userSchema
	}); */
</script>

<!--SuperDebug data={$form} /-->
{#if $message}<h3 class="text-center text-3xl">{$message}</h3>{/if}

<div class="px-4 pt-8 flex flex-col w-full place-items-center">
	<form method="post" action="?/login" use:enhance>
		
		<div>
		<label for="email">Tu direccion Email</label>
		<input
			type="email"
			name="email"
			id="email"
			placeholder="email"
			bind:value={$form.email}
			{...$constraints.email}
			class="input input-primary input-bordered w-full max-w-xs"
		/><br />
		{#if $errors.email}<p class="text-red-500">{$errors.email}</p>{/if}
	</div>
		<label for="password">Tu num de documento </label>
		<input
			type="text"
			name="password"
			id="password"
			placeholder="min 6 caracteres"
			bind:value={$form.password}
			aria-invalid={$errors.password ? 'true' : undefined}
			{...$constraints.password}
			class="input input-primary input-bordered w-full max-w-xs"
		/><br />
		{#if $errors.password}<p class="text-red-500">{$errors.password}</p>{/if}

		<div class="flex justify-center mb-4 m-4">

			<button type="submit" class=" btn btn-primary btn-md ">Continue</button>
		</div>
	</form>
	<a href="/users">Create an account</a>
</div>
