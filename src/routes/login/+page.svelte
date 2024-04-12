<script lang="ts">
	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";

export let form: ActionData;

	/* const { form, errors, enhance, delayed, message, reset, constraints } = superForm(data.form, {
		resetForm: true,
		//validators: userSchema
	}); */
</script>

<h1>Sign in</h1>
<form method="post" action="?/login" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" class="input input-primary" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" class="input input-primary" /><br />
	<button class="btn btn-primary">Continue</button>
	<p>{form?.message ?? ''}</p>
</form>
<a href="/signup">Create an account</a>
