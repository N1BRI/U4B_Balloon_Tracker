<script>
	import { createEventDispatcher } from 'svelte';
	import { trackedBalloonsList } from '../stores';
	import { createHistoricalTelemetry } from '../models/HistoricalTelemetry';
	import Tooltip from './layout/tooltip.svelte';

	const dispatch = createEventDispatcher();

	let callsign = '';
	/**
	 * @type {number}
	 */
	let slotId;
	let startDateString = new Date().toISOString().slice(0, 10);
	let isActive = true;
	let formatMask = '';
	let name = '';
	let isFormValid = true;
	let errors = { name: '', callsign: '', slotId: '', formatMask: '' };

	const validateBalloon = () => {
		const formatMaskRegex = /^[0-9]_[0-9]%$/;
		isFormValid = true;
		if (name === null || name.length === 0) {
			isFormValid = false;
			errors.name = 'Name is required';
		} else {
			errors.name = '';
		}
		if (callsign === null || callsign.length === 0) {
			isFormValid = false;
			errors.callsign = 'A valid callsign is required';
		} else {
			errors.callsign = '';
		}
		if (slotId === undefined || slotId < 0 || slotId > 9) {
			isFormValid = false;
			errors.slotId = 'Slot ID must be a number 0 - 9';
		} else {
			errors.slotId = '';
		}
		if (!formatMaskRegex.test(formatMask)) {
			isFormValid = false;
			errors.formatMask = 'please provide a valid format mask ex: 1_3%';
		} else {
			errors.formatMask = '';
		}
	};

	const cancelAddBalloonClicked = () => {
		dispatch('cancelAddBalloonClicked', {
			showModal: false
		});
	};
	const submitAddBalloonClicked = () => {
		validateBalloon();
		if (isFormValid) {
			trackedBalloonsList.update((arr) => [
				...arr,
				createHistoricalTelemetry(
					name,
					callsign,
					slotId,
					formatMask,
					new Date(startDateString),
					isActive
				)
			]);

			dispatch('submitAddBalloonClicked', {
				showModal: false
			});
		}
	};
</script>

<legend>Enter U4B Balloon Information</legend>
<form>
	<div class="input-group vertical">
		<label for="callsign"
			>Balloon Launch Name <Tooltip tooltip="This is a unique name of your choosing"
				><span class="icon-help" /></Tooltip
			></label
		>
		<input type="text" id="name" placeholder="Balloon Launch Name" bind:value={name} />
		{#if !isFormValid}
			<small class="error">{errors.name}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="callsign">Callsign <Tooltip tooltip="A valid amateur radio callsign. This is the callsign for the standard WSPR transmission"
			><span class="icon-help" /></Tooltip></label>
		<input type="text" id="callsign" placeholder="Callsign" bind:value={callsign} />
		{#if !isFormValid}
			<small class="error">{errors.callsign}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="slotId">Slot ID <Tooltip tooltip="The minute value for the standard WSPR transmission ex. 4 -- board transmits on the 4 every 10 minutes 04, 14, 24 etc."
			><span class="icon-help" /></Tooltip></label>
		<input type="number" id="slotId" bind:value={slotId} />
		{#if !isFormValid}
			<small class="error">{errors.slotId}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="formatMask">Telemetry Callsign Format Mask <Tooltip tooltip="This is the mask used to tie telemetry callsigns with U4B board ex: 1_3 means 
			callsigns that fit the format 1x3xxx where x = any letter. These are unique to a given board for a given slot id"
			><span class="icon-help" /></Tooltip></label>
		<input type="text" id="formatMask" placeholder="ex: 1_3%" bind:value={formatMask} />
		{#if !isFormValid}
			<small class="error">{errors.formatMask}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="telemetryStartDate">Telemetry Start Date <Tooltip tooltip="This sets the start date and time (00:00) for data collection"
			><span class="icon-help" /></Tooltip></label>
		<input type="date" id="telemetryStartDate" class="copyMini" bind:value={startDateString} />
	</div>
	<div class="input-group horizontal">
		<label for="balloonIsActive">Active Balloon <Tooltip tooltip="Balloons marked as active will be continuously monitored. Data will be updated in realtime"
			><span class="icon-help" /></Tooltip></label>
		<input type="checkbox" id="balloonIsActive" bind:checked={isActive} />
	</div>
	<div class="input-group vertical">
		<button on:click={submitAddBalloonClicked}>Start Tracking</button>
		<button on:click={cancelAddBalloonClicked}>Cancel</button>
	</div>
</form>

<style>
	.error {
		color: red;
		margin-left: 10px;
	}
	.copyMini {
		box-sizing: border-box;
		background: var(--input-back-color);
		color: var(--input-fore-color);
		border: 0.0625rem solid var(--input-border-color);
		border-radius: var(--universal-border-radius);
		margin: calc(var(--universal-margin) / 2);
		padding: var(--universal-padding) calc(1.5 * var(--universal-padding));
	}
	button {
		background-color: #00abab;
		color: white;
	}
</style>
