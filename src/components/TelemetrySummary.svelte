<script>
	import { slide } from 'svelte/transition';
	import { buildTelemetryQuery } from '../queries';
	import { onDestroy } from 'svelte';
	import { trackedBalloons } from '../stores';
	import Modal from './Modal.svelte';
	import { decodeTelemetry } from '../U4B';
	/**
	 * @type {string}
	 */
	export let telemetryId;

	/**
	 * @type {import("../models/telmetry").Telemetry}
	 */
	let telemetry;
	trackedBalloons.subscribe((balloons) => {
		let match = balloons.find((balloon) => balloon.id == telemetryId);
		if (match !== undefined) {
			telemetry = match;
		} else {
			console.log('telemetryId mismatch -- something stupid happened');
		}
	});
	let showModal = false;
	const openDashbord = () => {
		showModal = true;
	};

	let dataFound = false;
	async function getTelemetry() {
		/**
		 * @type {import("../models/wsprLiveData").WsprLiveData}
		 */
		let data;
		let url = `https://db1.wspr.live/?query=${buildTelemetryQuery(
			telemetry.callsign,
			telemetry.slotId,
			telemetry.formatMask,
			telemetry.lastUpdated
		)}+FORMAT+JSON`;
		const res = await fetch(url);
		const json = await res.json();
        console.log(json);

		try {
			if (res.ok) {
				if (json.data.length > 0) {
                    console.log(json.data[0]);
					data = json.data[0];
					let decodedTelemetry = decodeTelemetry(data);
					telemetry.telemetryCallsign = data.telemetry_tx_sign;
					telemetry.temperature = decodedTelemetry.temperature;
					telemetry.altitude = decodedTelemetry.altitude;
					telemetry.battery = decodedTelemetry.battery;
					telemetry.speed = decodedTelemetry.speed;
					telemetry.gpsStatus = decodedTelemetry.gpsStatus;
					telemetry.satsStatus = decodedTelemetry.satsStatus;
					telemetry.gridSquare = data.standard_tx_loc + decodedTelemetry.telemetrySubsquare;
					telemetry.lastReportedBy = decodedTelemetry.lastReportedBy;
					telemetry.lastUpdated = decodedTelemetry.lastUpdated;

					dataFound = true;

					trackedBalloons.update((balloons) => {
						const index = balloons.findIndex((balloon) => balloon.id === telemetry.id);
						if (index !== -1) {
							balloons[index] = { ...balloons[index], ...telemetry };
						}
						return balloons;
					});
				} else {
					dataFound = false;
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

	const intervalId = setInterval(() => {
		promise = getTelemetry();
	}, 20000);

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

{#if showModal}
	<Modal minHeight="800px" />
{/if}
<div id="container" out:slide={{ duration: 400 }} in:slide={{ delay: 400, duration: 400 }}>
	<div id="callsign"><h3>{telemetry.name}</h3></div>
	{#await promise}
		<center>
			<div class="spinner" id="big-spinner" />
			<p>...fetching latest telemetry data</p>
		</center>
	{:then}
		{#if dataFound}
			<h5 style="margin-top: 15px;">Callsign: {telemetry.callsign}</h5>
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
				<button class="rounded" on:click={openDashbord}>
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
