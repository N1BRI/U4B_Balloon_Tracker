<script>
	import { page } from '$app/stores';
	import '../app.css';
</script>

<center class="mt-6 text-xl">
	<div>
		<h1>Sorry... looks like there was an issue</h1>
		{#if $page?.error}
			<div class="mt-4 p-4 border-y-2">
				{#if $page?.status}
					<p>Page status: {$page?.status}</p>
				{/if}
				{#if $page?.error?.message}
					<p>{$page?.error?.message}</p>
				{/if}
			</div>
		{/if}
	</div>
</center>
