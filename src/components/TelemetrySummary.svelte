<script>
	import { slide } from 'svelte/transition';
	import { buildTelemetryQuery } from '../queries';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { trackedBalloonsList } from '../stores';
	import { decodeTelemetry } from '../U4B';
	import { createTelemetry } from '../models/telemetry';

	const dispatch = createEventDispatcher();

	/**
	 * @type {import('../models/HistoricalTelemetry').HistoricalTelemetry}
	 */
	export let historicalTelemetry;

	/**
	 * @type {import("../models/telemetry").Telemetry}
	 */
	let telemetry;



	trackedBalloonsList.subscribe((balloons) => {
		let match = balloons.find((balloon) => balloon.id == historicalTelemetry.id);
		if (match) {
			historicalTelemetry = match;
			if (match.telemetrySpots) {
				if (match.telemetrySpots.length > 1) {
					match.telemetrySpots[match.telemetrySpots.length - 1];
				} else {
					match.telemetrySpots = [createTelemetry()];
					telemetry = match.telemetrySpots[match.telemetrySpots.length - 1];
				}
			}
		} else {
			console.log('telemetryId mismatch -- something stupid happened');
		}
	});

	const handleShowDashboardClicked = () => {
		dispatch('showDashboardClicked', {
			showDashboard: true,
			historicalTelemetryId: historicalTelemetry.id
		});
		console.log("this is htid" + historicalTelemetry.id)
	};

	let dataFound = false;
	let historicalQueryRan = false;
	async function getTelemetry() {
		/**
		 * @type {import("../models/wsprLiveData").WsprLiveData}
		 */
		let data;
		/**
		 * @type {Date | null}
		*/
		let updateTime;

		historicalTelemetry.telemetryStartDate.setHours(0, 0, 0, 0);
		updateTime = historicalTelemetry.telemetryStartDate
		if(historicalTelemetry.telemetrySpots.length > 0){
			if(historicalQueryRan){
				if(historicalTelemetry.telemetrySpots[historicalTelemetry.telemetrySpots.length - 1].lastUpdated !== null){
					updateTime = historicalTelemetry.telemetrySpots[historicalTelemetry.telemetrySpots.length - 1].lastUpdated;
				}
			}
		}
		let url = `https://db1.wspr.live/?query=${buildTelemetryQuery(
			historicalTelemetry.callsign,
			historicalTelemetry.slotId,
			historicalTelemetry.formatMask,
			updateTime,
			historicalQueryRan
		)}+FORMAT+JSON`;
		const res = await fetch(url);
		const json = await res.json();
		try {
			if (res.ok) {
				if (json.data.length > 0) {
					json.data.forEach((/** @type {import("../models/wsprLiveData").WsprLiveData} */ record) => {
						let t = createTelemetry();
						let decodedTelemetry = decodeTelemetry(record);
						t.telemetryCallsign = record.telemetry_tx_sign;
						t.temperature = decodedTelemetry.temperature;
						t.altitude = decodedTelemetry.altitude;
						t.battery = decodedTelemetry.battery;
						t.speed = decodedTelemetry.speed;
						t.gpsStatus = decodedTelemetry.gpsStatus;
						t.satsStatus = decodedTelemetry.satsStatus;
						t.gridSquare = record.standard_tx_loc + decodedTelemetry.telemetrySubsquare;
						t.lastReportedBy = decodedTelemetry.lastReportedBy;
						t.lastUpdated = decodedTelemetry.lastUpdated;

						trackedBalloonsList.update((balloons) => {
						const index = balloons.findIndex((balloon) => balloon.id === historicalTelemetry.id);
						if (index !== -1) {
							if(!(balloons[index].telemetrySpots.find(r => r.lastUpdated === t.lastUpdated))){
								balloons[index].telemetrySpots.push(t);
							}
							
						}
						return balloons;
					});
					});
				
				
					historicalQueryRan = true;
					telemetry = historicalTelemetry.telemetrySpots[historicalTelemetry.telemetrySpots.length - 1];
					dataFound = true;

				console.log(historicalTelemetry)
				} else {
					if(historicalTelemetry.telemetrySpots.length > 0){
						telemetry = historicalTelemetry.telemetrySpots[historicalTelemetry.telemetrySpots.length - 1]
					}
					else{
						dataFound = false;
					}
				}
				return;
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	/**
	 * @type {Promise<void>}
	 */
	let promise = getTelemetry();

	/**
	 * @type {string | number | NodeJS.Timer | undefined}
	 */
	let intervalId;

	if (historicalTelemetry.balloonIsActive) {
		intervalId = setInterval(() => {
			promise = getTelemetry();
		}, 20000);
	}

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div id="container" out:slide={{ duration: 400 }} in:slide={{ delay: 400, duration: 400 }}>
	<div id="callsign"><h3>{historicalTelemetry.name}</h3></div>
	{#await promise}
		<center>
			<div class="spinner" id="big-spinner" />
			<p>...fetching latest telemetry data</p>
		</center>
	{:then}
		{#if dataFound}
			<h5 style="margin-top: 15px;">Callsign: {historicalTelemetry.callsign}</h5>
			<h5>Telemetry Callsign: {telemetry.telemetryCallsign}</h5>
			<h5>Temperature (C): {telemetry.temperature}</h5>
			<h5>Battery (V): {telemetry.battery}</h5>
			<h5>Altitude (M): {telemetry.altitude}</h5>
			<h5>Speed (Knots): {telemetry.speed}</h5>
			<h5>Grid Square: {telemetry.gridSquare}</h5>
			<h5>GPS Status: {telemetry.gpsStatus}</h5>
			<h5>Satellite Status: {telemetry.satsStatus}</h5>
			<i>
				<mark
					><small>Last Reported: {telemetry.lastUpdated} by: {telemetry.lastReportedBy}</small
					></mark
				>
			</i>
			<div id="view">
				<button class="rounded" on:click={handleShowDashboardClicked}>
					<center>
						<span class="icon-link rounded" />
					</center>
				</button>
			</div>
		{:else}
			<p>No data currently available for this balloon</p>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	button {
		height: 40px;
		width: 40px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 5px;
		padding: 0;
		border-radius: 70% !important;
	}
	#big-spinner {
		height: 3rem;
		width: 3rem;
	}
	h3,
	i {
		padding: 10px;
		margin: 0 0 5px 0;
	}
	mark {
		color: black;
		background-color: rgb(255, 242, 53);
	}
	#view {
		text-align: end;
		padding-right: 10px;
		font-size: 24;
	}
	#callsign {
		background-color: #00abab;
		color: white;
		border-radius: 6px 6px 0 0;
	}
	#container {
		margin-top: 10px;
		max-width: 300px;
		min-width: 300px;
		min-height: 400px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		border-radius: 6px;
		background-color: #f5f0f0;
	}
</style>
