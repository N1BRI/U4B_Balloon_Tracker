<script>
// @ts-nocheck

	import { createEventDispatcher } from 'svelte';
	/**
	 * @type import("../routes/$types").ActionData
	 */
	export let form;
	export let balloonConfigLoaded = false;

	export let timerStroke = 'gray';

	const dispatch = createEventDispatcher();

	const handleToggleTimerClick = (event) => {
			dispatch('toggleTimerClicked', {});
		
	};

	function keyDownReset (event) {
		if (event.which == 13 || event.keyCode == 13) {
			return false;
		}
		return true;
};
	

	
	
</script>

<form
	class="flex flex-col flex-wrap bg-gray-100 shadow-md pb-4 px-4 text-s"
	method="POST"
	action="?/balloon"
>
	<h1 class="mx-1 mt-3 text-xl">Enter U4B Information</h1>
	<div class="flex flex-col flex-wrap border-2 border-solid rounded-md border-gray-300">
		<div class="flex flex-wrap flex-1 mx-4 lg:max-h-16">
			<div class="pt-2 flex flex-col flex-1 px-2">
				<label for="callsign">Callsign</label>
				<input
					value={form?.formData.callsign ?? ''}
					type="text"
					name="callsign"
					class="px-2 rounded-md border-2 border-solid border-gray-300  max-w-none"
				/>
				{#if form?.errors?.callsign}
					<small class="text-red-600">{form?.errors?.callsign}</small>
				{/if}
			</div>
			<div class="pt-2 flex flex-col flex-1 px-2">
				<label for="callsign">Telemetry Call Format</label>
				<input 
					value={form?.formData.telCallFormat ?? ''}
					type="text"
					name="telCallFormat"
					class="px-2 rounded-md border-2 border-solid border-gray-300 max-w-none"
				/>
				{#if form?.errors?.telCallFormat}
					<small class="text-red-600">{form?.errors?.telCallFormat}</small>
				{/if}
			</div>
			<div class="pt-2 flex flex-col flex-1 px-2">
				<label for="slotId">Slot ID</label>
				<input
					value={form?.formData.slotId ?? 0}
					step="2"
					max="8"
					min="0"
					type="number"
					name="slotId"
					class="px-2 rounded-md border-2 border-solid border-gray-300 max-w-none"
				/>
				{#if form?.errors?.slotId}
					<small class="text-red-600">{form?.errors?.slotId}</small>
				{/if}
			</div>
			<div class="pt-2 px-2 flex flex-col flex-1">
				<label for="startDate">Telemetry Start Date</label>
				<input 
					value={form?.formData.startDate.toISOString().slice(0, 10) ??
						new Date().toISOString().slice(0, 10)}
					type="date"
					name="startDate"
					class="px-2 rounded-md border-2 border-solid border-gray-300 max-w-none"
				/>
				{#if form?.errors?.startDate}
					<small class="text-red-600">{form?.errors?.startDate}</small>
				{/if}
			</div>
		</div>
		<div class="flex flex-wrap justify-end pb-3 px-1 mx-4 pt-3 s:pt-0">
				<div>
					<button
						class="rounded-md border-2 border-solid border-gray-300 px-2 m-1 transition ease-in-out hover:bg-slate-200 duration-300"
						>Start Tracking</button
					>
				</div>
				<form action="?/w1nrg" method="POST">
					<button
						class="rounded-md border-2 border-solid border-gray-300 px-2 m-1 transition ease-in-out hover:bg-slate-200 duration-300"
						>W1NRG🎈</button
					>
				</form>
				{#if balloonConfigLoaded}
				<button
					class:bg-blue-200={timerStroke === 'blue'}
					class="rounded-md border-2 border-solid border-gray-300 m-1 px-2 transition ease-in-out duration-300"
					on:click|preventDefault={handleToggleTimerClick}
					
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke={timerStroke}
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
				{/if}
			</div>
			
		</div>
</form>

<style>
</style>
