<script lang="ts">
   import "../app.css";
   import MenuClient from '$lib/components/MenuClient.svelte';
   import SearchBox from '$lib/components/SearchBox.svelte';
   export let data;
   const {categories, user, userType} = data;
</script>

{#if userType === 'cliente' || userType === null || data.userType === undefined}
	<MenuClient categorias={data.categories} usuario={data.user} />
	<!--SearchBox /-->


	<main class="overflow-auto">
		<slot />
	</main>
{/if}

<label class="flex cursor-pointer gap-2 p-5">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
  <input type="checkbox" value="dim" class="toggle theme-controller"/>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</label>


  

