<script lang="ts">
    export let data;
    const { users } = data;
</script>


{#each users as user}
    <p>{user.username}</p>
{/each}