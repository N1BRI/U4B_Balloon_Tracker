<script>
	/**
	 * @type {import("../models/telmetry").Telemetry}
	 */
	export let telemetry;
    let isLoading = true;
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { buildTelemetryQuery } from '../queries';

	onMount(async () => {
		/**
		 * @type {import("../models/wsprLiveData").WsprLiveData[]}
		 */
		let data;
		let url = `https://db1.wspr.live/?query=${buildTelemetryQuery(telemetry.callsign,
            telemetry.slotId, telemetry.formatMask, telemetry.lastUpdated)}+FORMAT+JSON`;
		console.log(url);
		try {
			const response = await fetch(url);
			if (response.ok) {
				let wsprLiveResponse = await response.json();
				data = wsprLiveResponse.data;
				console.log(data);
				telemetry.callsign = data[0].tx_sign;
				telemetry.lastUpdated = data[0].time;
				telemetry.battery = data[0].power;
				telemetry.lastReportedBy = data[0].rx_sign;
                telemetry = telemetry
                
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error:', error);
		}
        finally {
            
            isLoading = false;
        }
	});
</script>

<div id="container" out:slide={{ duration: 400 }} in:slide={{ delay: 400, duration: 400 }}>
	<div id="callsign"><h1>{telemetry.callsign}</h1></div>
    {#if {isLoading}}
        <h1>loading...</h1>
    {:else}
	<mark><i>Last Reported: {telemetry.lastUpdated} by: {telemetry.lastReportedBy}</i></mark>
	<h5 style="margin-top: 15px;">Temperature (C): {telemetry.temperature}</h5>
	<h5>Battery (V): {telemetry.battery}</h5>
	<h5>Grid Square: {telemetry.gridSquare}</h5>
	<h5>GPS Status: {telemetry.gpsStatus}</h5>
	<h5>Satellite Status: {telemetry.satsStatus}</h5>
	<div id="view">
		<span class="icon-link" />
	</div>
    {/if}
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
