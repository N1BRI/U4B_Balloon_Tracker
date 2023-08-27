<script>
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';
	import Spinner from '../components/layout/Spinner.svelte';
	import { balloonTelemetry } from '../stores';
	import { getTelemetryData } from '../queries';

	export let form;
	/**
	 * @type {import('../models/BalloonConfigFormData').BalloonConfigFormData}
	 */
	let configData;

	/**
	 * @type {Promise<void>}
	 */
	let promise;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined | null}
	 */
	let telemetryTimerId = null;
	let historicalQueryRan = false;
	let timerStroke = 'gray';

	let balloonConfigLoaded = false;

	function startTelemetryTimer() {
		timerStroke = timerStroke === 'gray' ? 'blue' : 'gray';
		if (telemetryTimerId != null) {
			clearInterval(telemetryTimerId);
			telemetryTimerId = null;
		} else {
			telemetryTimerId = setInterval(() => {
				promise = getTelemetryData(configData, historicalQueryRan);
			}, 20000);
		}
	}
	/**
	 * @type {Array<import('../models/telemetry').Telemetry>}
	 */
	let latestBalloonTelemetry;
	balloonTelemetry.subscribe((value) => {
		latestBalloonTelemetry = value;
	});


	onMount(async () => {
		balloonTelemetry.set([]);
		if (form?.success) {
		configData = form.formData;
		promise = getTelemetryData(configData, historicalQueryRan);
		balloonConfigLoaded = true;
		historicalQueryRan = true;
		startTelemetryTimer();
	} else {
		balloonConfigLoaded = false;
	}

	});

	onDestroy(() => {});
</script>

<BalloonConfigForm
	{form}
	{timerStroke}
	{balloonConfigLoaded}
	on:toggleTimerClicked={startTelemetryTimer}
/>
<h1>{latestBalloonTelemetry.length}</h1>
{#await promise}
	<center>
		<Spinner />
		<p>...fetching latest telemetry data</p>
	</center>
{:then}
	<center>
		{#if latestBalloonTelemetry.length > 0}
			{#each latestBalloonTelemetry as telemetry}
				<p>{telemetry.telemetryCallsign}</p>
				<p>{telemetry.temperature}</p>
				<p>{telemetry.lastUpdated}</p>
				<p>{telemetry.gridSquare}</p>
			{/each}
		{/if}

	</center>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
