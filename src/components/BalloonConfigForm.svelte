<script>
	import { error } from "@sveltejs/kit";
	let isTracking = false;
	/**
	 * @type import("../routes/$types").ActionData
	 */
	export let form;

	let timerStroke = 'black'
	const toggleTimer = () =>{
		timerStroke = timerStroke === 'black' ? 'blue' : 'black'
	}
</script>

<form class="flex flex-col bg-gray-100 shadow-md" method="POST">
	<div class="flex justify-between pt-3">
		<h1 class="text-2xl px-6">Enter Balloon Information</h1>
		<div class="flex">
			<button class:bg-blue-200={timerStroke === 'blue'} class="rounded-md border-2 border-solid border-gray-300 px-2 transition ease-in-out duration-300" on:click|preventDefault={toggleTimer}> 
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="{timerStroke}" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
				  </svg>
				  
			</button>
			<button
			class="rounded-md border-2 border-solid border-gray-300 px-2 mx-6 transition ease-in-out hover:bg-slate-200 duration-300"
			>Start Tracking</button
		>

		</div>
		
	</div>
	<div class="flex flex-wrap justify-between flex-1 pb-1 px-4">
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Launch Name</label>
			<input
                value={form?.formData.launchName ?? ''}
				type="text"
				name="launchName"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
            {#if (form?.errors?.launchName)}
                <small class="text-red-600">{form?.errors?.launchName}</small>
            {/if}
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Callsign</label>
			<input
            value={form?.formData.callsign ?? ''}
				type="text"
				name="callsign"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
            {#if (form?.errors?.callsign)}
                <small class="text-red-600">{form?.errors?.callsign}</small>
            {/if}
		</div>
        <div class="p-2 flex flex-col flex-1">
			<label for="callsign">Telemetry Call Format</label>
			<input
                value={form?.formData.telCallFormat ?? ''}
				type="text"
				name="telCallFormat"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
            {#if (form?.errors?.launchName)}
                <small class="text-red-600">{form?.errors?.telCallFormat}</small>
            {/if}
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="slotId">Slot ID</label>
			<input
                value={form?.formData.slotId ?? 0}  
				type="number"
				name="slotId"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
            {#if (form?.errors?.launchName)}
                <small class="text-red-600">{form?.errors?.slotId}</small>
            {/if}
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="startDate">Telemetry Start Date</label>
			<input
                value={form?.formData.startDate.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
				type="date"
				name="startDate"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
            {#if (form?.errors?.launchName)}
                <small class="text-red-600">{form?.errors?.startDate}</small>
            {/if}
		</div>
	</div>
</form>

<style>
	.active{
		background-color: blue;
	}
</style>