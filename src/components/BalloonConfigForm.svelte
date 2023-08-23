<script>
	let isTracking = false;
	/**
	 * @type import("../routes/$types").ActionData
	 */
	export let form;
</script>

<form class="flex flex-col bg-gray-100 shadow-md" method="POST">
	<div class="flex justify-between pt-3">
		<h1 class="text-2xl px-6">Enter Balloon Information</h1>
		<button
			class="rounded-md border-2 border-solid border-gray-300 px-2 mx-6 transition ease-in-out hover:bg-slate-200 duration-300"
			>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</button
		>
	</div>
	<div class="flex flex-wrap justify-between flex-1 pb-1 px-4">
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Launch Name</label>
			<input
				type="text"
				name="launchName"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="callsign">Callsign</label>
			<input
				type="text"
				name="callsign"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
        <div class="p-2 flex flex-col flex-1">
			<label for="callsign">Telemetry Call Format</label>
			<input
				type="text"
				name="telCallFormat"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="slotId">Slot ID</label>
			<input
				type="number"
				name="slotId"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
		<div class="p-2 flex flex-col flex-1">
			<label for="startDate">Telemetry Start Date</label>
			<input
				type="date"
				name="startDate"
				class="px-2 rounded-md border-2 border-solid border-gray-300"
			/>
		</div>
	</div>
</form>
