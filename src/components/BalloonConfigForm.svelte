
<script>
    let isTracking = false;
    let test = '';
</script>

<div class="flex flex-col bg-gray-100 shadow-md">
    <div class="flex justify-between pt-3">
    <h1 class="text-2xl px-6 ">Enter Balloon Information</h1>
    <button on:click={()=>console.log(test)}
            class="rounded-md border-2 border-solid  border-gray-300 px-2 mx-6  transition ease-in-out hover:bg-slate-200 duration-300"
            >{isTracking ? 'Stop Tracking' : 'Start Tracking'}</button
        >
    </div>
	<form class="flex flex-wrap justify-between flex-1 pb-1 px-4 ">
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Launch Name</label>
			<input
				type="text"
				id="launchName"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Callsign</label>
			<input
				type="text"
				id="callsign"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="slotId">Slot ID</label>
			<input
				type="text"
				id="slotId"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="telCallFormat">Telemetry Callsign Format</label>
			<input
				type="text"
				id="telCallFormat"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="startDate">Telemetry Start Date</label>
			<input
            bind:value={test}
				type="date"
				id="startDate"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>

	</form>

</div>
