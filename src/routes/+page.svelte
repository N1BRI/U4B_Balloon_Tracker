<script>
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';
	import Spinner from '../components/layout/Spinner.svelte';
	import Map from '../components/Map.svelte'
	import { balloonTelemetry, wsprSpots } from '../stores';
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
	import { maidenheadToLatLng, strCoordinates } from '../models/coordinates';
	import Dashboard from '../components/Dashboard.svelte';
	import Graph from '../components/Graph.svelte';

	
	export let form;
	/**
	 * @type {import('../models/BalloonConfigFormData').BalloonConfigFormData}
	 */
	let configData;

	/**
	 * @type {Promise<void>}
	 */
	let latestTelemetryPromise;

	/**
	 * @type {Promise<import('../models/wsprSpot').wsprSpot[]>}
	 */
	let latestSpotsPromise;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined | null}
	 */
	let telemetryTimerId = null;
	let historicalQueryRan = false;
	let timerStroke = 'gray';

	let balloonConfigLoaded = false;

		const FIVE_MINUTES = 300000;

	function startTelemetryTimer() {
		timerStroke = timerStroke === 'gray' ? 'blue' : 'gray';
		if (telemetryTimerId != null) {
			clearInterval(telemetryTimerId);
			telemetryTimerId = null;
		} else {
			telemetryTimerId = setInterval(() => {
				latestTelemetryPromise = getTelemetryData(configData, historicalQueryRan);
			}, FIVE_MINUTES);
		}
	}

	//  async function addDataTest() {
	// 	let t = createTelemetry();
	// 	t.altitude = 80;
	// 	t.battery = 4;
	// 	t.gpsStatus = 1;
	// 	t.speed = 50;
	// 	t.temperature = 42;
	// 	t.gridSquare = 'EM95qe';
	// 	t.lastUpdated = new Date();
	// 	console.log(t)
	// 	balloonTelemetry.update((telemetry) => [...telemetry, t] );

	// };

	/**
	 * @type {Array<import('../models/telemetry').Telemetry>}
	 */
	let latestBalloonTelemetry;
	balloonTelemetry.subscribe((value) => {
		latestBalloonTelemetry = value;
	});

	/**
	 * @type {Array<import('../models/wsprSpot').wsprSpot>}
	 */
	 let latestWsprSpots;
	wsprSpots.subscribe((value) => {
		latestWsprSpots = value;
	});

	onMount(async () => {
		balloonTelemetry.set([]);
		if (form?.success) {
			configData = form.formData;
			latestTelemetryPromise = getTelemetryData(configData, historicalQueryRan);
			//latestSpotsPromise = getLatestSpots(configData.callsign, configData.startDate);
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

{#await latestTelemetryPromise}
	<center>
		<Spinner />
		<p>...fetching latest telemetry data</p>
	</center>
{:then}
	{#if latestBalloonTelemetry.length > 0}
		<div class="flex px-1 mt-4 flex-wrap-reverse md:flex-nowrap md:px-7">
			<div
				class="flex flex-1 md:flex-1  flex-col border-solid bg-gray-100 rounded-md shadow-md py-3 md:mr-4 px-4 text-s"
			>
			<Map latestBalloonTelemetry={latestBalloonTelemetry} latestWsprSpots={latestWsprSpots}/>
			<Dashboard/>
			</div>
			<div class="flex flex-1 md:flex-none md:w-70 md:flex-2 border-solid mb-6 md:mb-0 bg-gray-100 rounded-md shadow-md pb-4 px-4 text-s self-start">
				<div class="max-h-fit">
					<h1 class="text-2xl my-2">Lastest Balloon Status</h1>
					<mark class="bg-indigo-400 rounded-md py-1 px-2 text-white"
						>@ {latestBalloonTelemetry[latestBalloonTelemetry.length - 1].lastUpdated}</mark
					>
					<div class="flex py-1">
						<BatteryChargingIcon size="24" />
						<strong class="px-3"
							>{latestBalloonTelemetry[latestBalloonTelemetry.length - 1].battery.toFixed(3)} Volts</strong
						>
					</div>
					<div class="flex py-1">
						<ThermometerIcon size="24" /><strong class="px-3"
							>{celsiusToFahrenheit(latestBalloonTelemetry[latestBalloonTelemetry.length - 1].temperature)} °F</strong
						>
					</div>
					<div class="flex py-1">
						<TrendingUpIcon size="24" /><strong class="px-3"
							>{metersToFeet(latestBalloonTelemetry[latestBalloonTelemetry.length - 1].altitude)} Feet</strong
						>
					</div>
					<div class="flex py-1">
						<WindIcon size="24" /><strong class="px-3"
							>{knotsToMPH(latestBalloonTelemetry[latestBalloonTelemetry.length - 1].speed)} MPH</strong
						>
					</div>
					<div class="flex py-1">
						<MapPinIcon size="24" /><strong class="px-3"
							>{latestBalloonTelemetry[latestBalloonTelemetry.length - 1].gridSquare.substring(0, 6)} - {strCoordinates(
								maidenheadToLatLng(latestBalloonTelemetry[latestBalloonTelemetry.length - 1].gridSquare ?? '')
							)}</strong
						>
					</div>
					{#if latestBalloonTelemetry[latestBalloonTelemetry.length - 1].gpsStatus !== 1}
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
					{#if latestBalloonTelemetry[latestBalloonTelemetry.length - 1].satsStatus !== 1}
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


<style>
</style>