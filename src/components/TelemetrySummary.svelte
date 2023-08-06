<script>
	/**
	 * @type {import("../models/telmetry").Telemetry}
	 */
	export let telemetry;
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

		try {
			if (res.ok) {
				data = json.data[0];
				console.log(data);
				return data;
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	let promise = getTelemetry();
	import { slide } from 'svelte/transition';
	import { buildTelemetryQuery } from '../queries';
</script>

<div id="container" out:slide={{ duration: 400 }} in:slide={{ delay: 400, duration: 400 }}>
	<div id="callsign"><h1>{telemetry.name}</h1></div>
	{#await promise}
		<div class="spinner tertiary" />
		<p>...fetching latest telemetry data</p>
	{:then t}
		<mark><i>Last Reported: {telemetry.lastUpdated} by: {telemetry.lastReportedBy}</i></mark>
		<h5 style="margin-top: 15px;">Callsign: {telemetry.callsign}</h5>
		<h5>Telemetry Callsign: {telemetry.telemetryCallsign}</h5>
		<h5>Temperature (C): {telemetry.temperature}</h5>
		<h5>Battery (V): {t?.power}</h5>
		<h5>Grid Square: {telemetry.gridSquare}</h5>
		<h5>GPS Status: {telemetry.gpsStatus}</h5>
		<h5>Satellite Status: {telemetry.satsStatus}</h5>
		<div id="view">
			<span class="icon-link" />
		</div>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	h1 {
		margin: 0 0 5px 0;
	}
	#view {
		text-align: end;
		padding-right: 10px;
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
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		border-radius: 6px;
		background-color: #f5f0f0;
	}
</style>
