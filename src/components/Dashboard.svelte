<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { trackedBalloonsList } from '../stores';
	import { maidenheadToLatLng } from '../models/coordinates';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

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

	onMount(async () => {
		trackedBalloonsList.subscribe((balloons) => {
			let match = balloons.find((balloon) => balloon.id === historicalTelemetryId);
			if (match) {
				historicalTelemetry = match;
			} else {
				console.log('telemetryId mismatch -- something stupid happened');
			}
		});
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

			/**
			 * @type {number[][]}
			 */
			let balloonTrackPoints = [];

			/**
			 * @type {(number | null)[]}
			 */
			let balloonAltitudes = [];
			/**
			 * @type {(number | null)[]}
			 */
			 let balloonPowers = [];

			 	/**
			 * @type {(number | null)[]}
			 */
			 let balloonSpeeds = [];



			/**
			 * @type {(string | undefined)[]}
			 */
			let balloonAltitudesLabels = [];
			historicalTelemetry.telemetrySpots.forEach((record) => {
				if (record.gridSquare) {
					let coords = maidenheadToLatLng(record.gridSquare);
					balloonTrackPoints.push([coords.latitude, coords.longitude]);
					
				}
				balloonAltitudes.push(record.altitude);
				balloonAltitudesLabels.push(record.lastUpdated?.toString())
				balloonPowers.push(record.battery);
				balloonSpeeds.push(record.speed)
			});
			leaflet.polyline(balloonTrackPoints).addTo(map);
			new Chart(altitudeChart, {
				type: 'line',
				data: {
					labels: balloonAltitudesLabels.reverse(),
					datasets: [
						{
							label: 'Altitude (M)',
							data: balloonAltitudes.reverse(),
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
			new Chart(powerChart, {
				type: 'line',
				data: {
					labels: balloonAltitudesLabels.reverse(),
					datasets: [
						{
							label: 'Power (V)',
							data: balloonPowers.reverse(),
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
			new Chart(speedsChart, {
				type: 'line',
				data: {
					labels: balloonAltitudesLabels.reverse(),
					datasets: [
						{
							label: 'Speed (Knots)',
							data: balloonSpeeds.reverse(),
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
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});

	const closeDashboardClick = () => {
		dispatch('closeDashboardClick', {
			showDashboard: false
		});
	};
</script>
<div class="mainTitle">

	<h1>{historicalTelemetry?.name}</h1>
	<button on:click={closeDashboardClick}>x</button>
</div>

<main>
	<div id="map" bind:this={mapElement} />
	<canvas bind:this={altitudeChart} />
	<canvas bind:this={speedsChart} />
	<canvas bind:this={powerChart} />
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
	.mainTitle{
		display: flex;
		justify-content: space-between;
	}
	main {
		padding: 10px;
	}
	#map {
		height: 400px;
		width: 100%;
	}

	canvas {
		max-height: 200px;
	}

	button {
		float: right;
		border-radius: 50%;
		height: 40px;
		background-color: #00abab;
		color: white;
		width: 40px;
		margin: 1em;
		border: 1px solid transparent;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	:root {
		--button-back-color: none;
		--button-hover-back-color: none;
	}
</style>
