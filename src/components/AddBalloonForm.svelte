<script>
	import { createEventDispatcher } from 'svelte';
	import { trackedBalloons } from '../stores';
	import { createTelemetry } from '../models/telmetry'

	const dispatch = createEventDispatcher();
	
	let callsign = '';
	/**
	 * @type {number}
	 */
	let slotId;
	let formatMask = '';
	let isFormValid = true;
	let errors = {'callsign' : '', 'slotId' : '', 'formatMask' : ''};
	
	const validateBalloon = () => {
		if (callsign === null || callsign.length === 0){
			isFormValid = false;
			errors.callsign = "A valid callsign is required"
		}
		if (slotId === null || slotId  < 0 || slotId > 9){
			isFormValid = false;
			errors.slotId = "Slot ID must be a number 0 - 9"
		}
		if (formatMask === null || formatMask.length != 3){
			isFormValid = false;
			errors.formatMask = "A valid callsign is required"
		}
	}


	const cancelAddBalloonClicked = () => {
		dispatch('cancelAddBalloonClicked', {
			showModal: false
		});
	}
	const submitAddBalloonClicked = () => {
		console.log(`${callsign},  ${slotId}, ${formatMask}`);
		trackedBalloons.update(arr => [...arr, createTelemetry(callsign, slotId, formatMask)]);

		dispatch('submitAddBalloonClicked', {
			showModal: false
		});
	}
</script>

<legend>Enter U4B Balloon Information</legend>
<form>
	<div class="input-group vertical">
		<label for="callsign">Callsign</label>
		<input type="text" id="callsign" placeholder="Callsign" bind:value={callsign} required/>
	</div>
	<div class="input-group vertical">
		<label for="slotId">Slot ID</label>
		<input type="number" id="slotId" placeholder="Slot ID" bind:value={slotId} required/>
	</div>
	<div class="input-group vertical">
		<label for="formatMask">Format Mask</label>
		<input type="text" id="formatMask" placeholder="ex: 1_3%" bind:value={formatMask} required/>
	</div>
	<div class="input-group vertical">
		<button on:click={submitAddBalloonClicked}>Start Tracking</button>
		<button on:click={cancelAddBalloonClicked}>Cancel</button>
	</div>
</form>

<style>
</style>
