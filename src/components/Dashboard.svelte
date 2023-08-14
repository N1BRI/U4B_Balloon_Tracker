<script>
	import { onMount, onDestroy, createEventDispatcher, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { trackedBalloonsList } from '../stores';
	import { maidenheadToLatLng } from '../models/coordinates';
	import { Chart, registerables } from 'chart.js';
	import { createTelemetry } from '../models/telemetry';

	Chart.register(...registerables);

	// const addDataTest = () => {
	// 	let t = createTelemetry();
	// 	t.altitude = 80;
	// 	t.battery = 4;
	// 	t.gpsStatus = 1;
	// 	t.speed = 50;
	// 	t.temperature = 42;
	// 	t.gridSquare = 'FN27oj';
	// 	t.lastUpdated = new Date();
	// 	trackedBalloonsList.update((balloons) => {
	// 		const index = balloons.findIndex((balloon) => balloon.id === historicalTelemetryId);
	// 		if (index !== -1) {
	// 			if (!balloons[index].telemetrySpots.find((r) => r.lastUpdated === t.lastUpdated)) {
	// 				balloons[index].telemetrySpots.push(t);
	// 			}
	// 		}
	// 		console.log(historicalTelemetry);
	// 		return balloons;
	// 	});
	// };
	/**
	 * @type{HTMLCanvasElement}
	 */
	let altitudeChart;

	/**
	 * @type{HTMLCanvasElement}
	 */
	let powerChart;

	/**
	 * @type{HTMLCanvasElement}
	 */
	let speedsChart;

	/**
	 * @type{HTMLCanvasElement}
	 */
	let temperaturesChart;

	/**
	 * @type {{ addLatLng: (arg0: import("../models/coordinates").Coordinates) => void; addTo: (arg0: { remove: () => void; }) => void; }}
	 */
	let balloonPath;

	const dispatch = createEventDispatcher();

	/**
	 * @type {HTMLDivElement}
	 */
	let mapElement;
	/**
	 * @type {{ remove: () => void; }}
	 */
	let map;
	/**
	 * @type {string}
	 */
	export let historicalTelemetryId;
	/**
	 * @type {import('../models/HistoricalTelemetry').HistoricalTelemetry}
	 */
	let historicalTelemetry;

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
	 */
	let altitudeChartInstance;

	/**
	 * @type {Chart<"bar", (number | null)[], string | undefined>}
	 */
	let powerChartInstance;

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
	 */
	let speedChartInstance;

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
	 */
	let temperatureChartInstance;

	/**
	 * @type {number[][]}
	 */
	let balloonTrackPoints = [];

	trackedBalloonsList.subscribe((balloons) => {
		let match = balloons.find((balloon) => balloon.id === historicalTelemetryId);
		if (match) {
			historicalTelemetry = match;
		} else {
			console.log('telemetryId mismatch -- something stupid happened');
		}
	});

	afterUpdate(() => {
		if (historicalTelemetry && historicalTelemetry.telemetrySpots) {
			const latestTelemetry = historicalTelemetry.telemetrySpots.slice(-1)[0];

			if (latestTelemetry) {
				if (altitudeChartInstance) {
					if (
						!altitudeChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
						altitudeChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
						altitudeChartInstance.data.datasets[0].data.push(
							latestTelemetry.altitude
								? latestTelemetry.altitude * 3.28084
								: latestTelemetry.altitude
						);
						altitudeChartInstance.update();
					}
				}

				if (powerChartInstance) {
					if (
						!powerChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
					powerChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
					powerChartInstance.data.datasets[0].data.push(latestTelemetry.battery);
					powerChartInstance.update();
					}
				}
				if (speedChartInstance) {
					if (
						!speedChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
					speedChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
					speedChartInstance.data.datasets[0].data.push(
						latestTelemetry.speed ? latestTelemetry.speed * 1.15078 : latestTelemetry.speed
					);
					speedChartInstance.update();
					}

					if (temperatureChartInstance) {
						if (
						!temperatureChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
						temperatureChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
						temperatureChartInstance.data.datasets[0].data.push(
							latestTelemetry.temperature
								? (latestTelemetry.temperature * 9) / 5 + 32
								: latestTelemetry.temperature
						);
						temperatureChartInstance.update();
					}
					}
					if (map && latestTelemetry.gridSquare && balloonPath) {
						let coords = maidenheadToLatLng(latestTelemetry.gridSquare);
						balloonPath.addLatLng([coords.latitude, coords.longitude]);
						balloonPath.addTo(map);
					}
				}
			}
		}
	});

	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');

			map = leaflet.map(mapElement).setView([50, -70], 3);

			leaflet
				.tileLayer(
					'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
					{
						attribution:
							'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
					}
				)
				.addTo(map);

			historicalTelemetry.telemetrySpots.forEach((record) => {
				if (record.gridSquare) {
					let coords = maidenheadToLatLng(record.gridSquare);
					balloonTrackPoints.push([coords.latitude, coords.longitude]);
				}
			});
			balloonPath = leaflet.polyline(balloonTrackPoints);
			balloonPath.addTo(map);
		}

		if (altitudeChart) {
			altitudeChartInstance = new Chart(altitudeChart, {
				type: 'line',
				data: {
					labels: historicalTelemetry.telemetrySpots.map((l) => l.lastUpdated?.toString()),
					datasets: [
						{
							label: 'Altitude (Feet)',
							data: historicalTelemetry.telemetrySpots.map((l) =>
								l.altitude ? l.altitude * 3.28084 : l.altitude
							),
							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
		if (powerChart) {
			powerChartInstance = new Chart(powerChart, {
				type: 'bar',
				data: {
					labels: historicalTelemetry.telemetrySpots.map((l) => l.lastUpdated?.toString()),
					datasets: [
						{
							label: 'Power (V)',
							data: historicalTelemetry.telemetrySpots.map((l) => l.battery),
							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						y: {
							min: 3,
							max: 6
						}
					}
				}
			});
		}
		speedChartInstance = new Chart(speedsChart, {
			type: 'line',
			data: {
				labels: historicalTelemetry.telemetrySpots.map((l) => l.lastUpdated?.toString()),
				datasets: [
					{
						label: 'Speed (MPH)',
						data: historicalTelemetry.telemetrySpots.map((l) =>
							l.speed ? l.speed * 1.15078 : l.speed
						),
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});

		temperatureChartInstance = new Chart(temperaturesChart, {
			type: 'line',
			data: {
				labels: historicalTelemetry.telemetrySpots.map((l) => l.lastUpdated?.toString()),
				datasets: [
					{
						label: 'Temperature (F)',
						data: historicalTelemetry.telemetrySpots.map((l) =>
							l.temperature ? (l.temperature * 9) / 5 + 32 : l.temperature
						),
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
		altitudeChartInstance.destroy();
	});

</script>


<div class="main">
	<div id="map" bind:this={mapElement} />
	<canvas bind:this={altitudeChart} />
	<canvas bind:this={speedsChart} />
	<canvas bind:this={powerChart} />
	<canvas bind:this={temperaturesChart} />
	<!-- <button on:click={addDataTest}>Add d</button> -->
</div>

<style>
	@import 'leaflet/dist/leaflet.css';
	#map {
		height: 400px;
		width: 100%;
	}
	.main {
		display: flex;
		z-index: 9999;
		flex-direction: column;
		padding: 10px;
	}

	canvas {
		max-height: 200px;
	}

</style>
