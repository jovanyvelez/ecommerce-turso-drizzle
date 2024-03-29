<script lang="ts">

	import { enhance } from "$app/forms";


	export let data;
</script>

<h1>Hi, {data.user.email}!</h1>
<p>Your user ID is {data.user.id}.</p>

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
