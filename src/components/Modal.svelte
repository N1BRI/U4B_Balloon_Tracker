<script>
	import { fade, scale } from 'svelte/transition';
	export let showModal = false;
    export let maxHeight = '';
    export let maxWidth = '';
    export let title = '';
    $:display = showModal ? 'display: flex' : 'display: none';
</script>

{#if showModal === true}
	<input type="checkbox" id="modal-control" class="modal" on:click={()=>showModal = false} transition:fade>
	<div role="dialog" aria-labelledby="dialog-title" style={display} >
		<div class="card large test" style="max-width: {maxWidth}; max-height: {maxHeight};" transition:scale>
			<label for="modal-control" class="modal-close" />
			<strong class="section" id="dialog-title">{title}</strong>
			<div class="section">
                <slot></slot>
            </div>
		</div>
	</div>
{/if}

<style>
[type="checkbox"].modal + div {
	position: absolute;
}

</style>
