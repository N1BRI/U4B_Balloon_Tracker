<script>
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';
	import Spinner from '../components/layout/Spinner.svelte';
	import { balloonTelemetry } from '../stores';
	import { getTelemetryData } from '../queries';
	import {
		ThermometerIcon,
		BatteryChargingIcon,
		MapPinIcon,
		TrendingUpIcon,
		AlertCircleIcon,
		CheckCircleIcon,
		WindIcon
	} from 'svelte-feather-icons';
	import { celsiusToFahrenheit, knotsToMPH, metersToFeet } from '../helpers';

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

{#await promise}
	<center>
		<Spinner />
		<p>...fetching latest telemetry data</p>
	</center>
{:then}
	{#if latestBalloonTelemetry.length > 0}
		<div class="flex px-3 mt-4">
			<div
				class="flex flex-1 flex-col border-solid bg-gray-100 rounded-md shadow-md py-3 px-4 mr-3 text-s"
			>
				{#each latestBalloonTelemetry as telemetry}
					<p>{telemetry.telemetryCallsign}</p>
					<p>{telemetry.temperature}</p>
					<p>{telemetry.lastUpdated}</p>
					<p>{telemetry.gridSquare}</p>
				{/each}
			</div>
			<div class="flex flex-2 border-solid bg-gray-100 rounded-md shadow-md pb-4 px-4 text-s">
				<div>
					<h1 class="text-2xl my-2">Lastest Balloon Status</h1>
					<mark class="bg-indigo-400 rounded-md py-1 px-2 text-white"
						>@ {latestBalloonTelemetry[0].lastUpdated}</mark
					>
					<div class="flex py-1">
						<BatteryChargingIcon size="24" />
						<strong class="px-3"
							>{latestBalloonTelemetry[0].battery == null
								? 0.0
								: latestBalloonTelemetry[0].battery.toFixed(3)} Volts</strong
						>
					</div>
					<div class="flex py-1">
						<ThermometerIcon size="24" /><strong class="px-3"
							>{celsiusToFahrenheit(latestBalloonTelemetry[0].temperature)} °F</strong
						>
					</div>
					<div class="flex py-1">
						<TrendingUpIcon size="24" /><strong class="px-3"
							>{metersToFeet(latestBalloonTelemetry[0].altitude)} Feet</strong
						>
					</div>
					<div class="flex py-1">
						<WindIcon size="24" /><strong class="px-3"
							>{knotsToMPH(latestBalloonTelemetry[0].speed)} MPH</strong
						>
					</div>
					<div class="flex py-1">
						
							<MapPinIcon size="24" /><strong class="px-3"
								>{latestBalloonTelemetry[0].gridSquare}</strong
							
						>
					</div>
					{#if latestBalloonTelemetry[0].gpsStatus !== 1}
						<div class="flex py-1 text-red-500">
							<AlertCircleIcon size="24" /><strong class="px-3">GPS Not Connected</strong>
						</div>
					{:else}
						<div class="flex py-1">
							<CheckCircleIcon size="24" class="text-green-600" /><strong class="px-3"
								>GPS Locked</strong
							>
						</div>
					{/if}
					{#if latestBalloonTelemetry[0].satsStatus !== 1}
						<div class="flex py-1 text-red-500">
							<AlertCircleIcon size="24" /><strong class="px-3">Sats Not Connected</strong>
						</div>
					{:else}
						<div class="flex py-1">
							<CheckCircleIcon size="24" class="text-green-600" /><strong class="px-3"
								>Sats Locked</strong
							>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
