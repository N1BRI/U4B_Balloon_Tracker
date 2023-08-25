<script>
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';
	import { buildTelemetryQuery } from '../queries';
	import Spinner from '../components/layout/Spinner.svelte';

	export let form;
	/**
	 * @type {import('../models/BalloonConfigFormData').BalloonConfigFormData}
	 */
	let configData;

	/**
	 * @type import('../models/telemetry').Telemetry[]
	 */
	let telemetry = [];

	/**
	 * @type {Promise<void>}
	 */
	let promise;

	let historicalQueryRan = false;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined | null}
	 */
	let telemetryTimerId = null;
	let timerStroke = 'gray'

	function startTelemetryTimer() {
		timerStroke = timerStroke === 'gray' ? 'blue' : 'gray';
		if (telemetryTimerId != null) {
			clearInterval(telemetryTimerId);
			telemetryTimerId = null;
		} else {
			telemetryTimerId = setInterval(() => {
				promise = getTelemetryData();
			}, 20000);
		}
	}

	async function getTelemetryData() {
		if (telemetry.length > 0) {
			configData.startDate = telemetry[telemetry.length - 1].lastUpdated ?? new Date();
		}
		let url = `https://db1.wspr.live/?query=${buildTelemetryQuery(
			configData.callsign,
			configData.slotId,
			configData.telCallFormat,
			configData.startDate,
			historicalQueryRan
		)}+FORMAT+JSON`;
		const res = await fetch(url);
		const json = await res.json();
		historicalQueryRan = true;
		console.log(json);
	}

	if (form?.success) {
		configData = form.formData;
		promise = getTelemetryData();
		startTelemetryTimer();
	}

	onMount(async () => {});

	onDestroy(() => {});
</script>

<BalloonConfigForm {form} {timerStroke} on:toggleTimerClicked={startTelemetryTimer}/>
{#await promise}
	<center>
		<Spinner />
		<p>...fetching latest telemetry data</p>
	</center>
{:then}
	<center></center>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
