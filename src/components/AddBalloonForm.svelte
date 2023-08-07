<script>
	import { createEventDispatcher } from 'svelte';
	import { trackedBalloons } from '../stores';
	import { createTelemetry } from '../models/telmetry';

	const dispatch = createEventDispatcher();

	let callsign = '';
	/**
	 * @type {number}
	 */
	let slotId;
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
		}
		else{
			errors.name = ''
		}
		if (callsign === null || callsign.length === 0) {
			isFormValid = false;
			errors.callsign = 'A valid callsign is required';
		}
		else{
			errors.callsign = ''
		}
		if (slotId === undefined || slotId < 0 || slotId > 9) {
			isFormValid = false;
			errors.slotId = 'Slot ID must be a number 0 - 9';
		}
		else{
			errors.slotId = ''
		}
		if (!formatMaskRegex.test(formatMask)) {
			isFormValid = false;
			errors.formatMask = 'please provide a valid format mask ex: 1_3%';
		}
		else{
			errors.formatMask = ''
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
			trackedBalloons.update((arr) => [
				...arr,
				createTelemetry(name, callsign, slotId, formatMask)
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
		<label for="callsign">Balloon Launch Name</label>
		<input type="text" id="name" placeholder="Balloon Launch Name" bind:value={name} />
		{#if !isFormValid}
			<small class="error">{errors.name}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="callsign">Callsign</label>
		<input type="text" id="callsign" placeholder="Callsign" bind:value={callsign} />
		{#if !isFormValid}
			<small class="error">{errors.callsign}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="slotId">Slot ID</label>
		<input type="number" id="slotId" bind:value={slotId} />
		{#if !isFormValid}
			<small class="error">{errors.slotId}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<label for="formatMask">Telemetry Callsign Format Mask</label>
		<input type="text" id="formatMask" placeholder="ex: 1_3%" bind:value={formatMask} />
		{#if !isFormValid}
			<small class="error">{errors.formatMask}</small>
		{/if}
	</div>
	<div class="input-group vertical">
		<button on:click={submitAddBalloonClicked}>Start Tracking</button>
		<button on:click={cancelAddBalloonClicked}>Cancel</button>
	</div>
</form>

<style>
	.error{
		color: red;
		margin-left: 10px;
	}
</style>
