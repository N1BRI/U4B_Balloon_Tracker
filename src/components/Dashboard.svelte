<script>
	import { onMount, onDestroy, createEventDispatcher, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { balloonTelemetry } from '../stores';
	import { maidenheadToLatLng } from '../models/coordinates';
	import { Chart, registerables } from 'chart.js';
	// @ts-ignore
	import { createTelemetry } from '../models/telemetry';
	// @ts-ignore
	import { celsiusToFahrenheit, knotsToMPH, metersToFeet } from '../helpers';

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


	/**
	 * @type {HTMLDivElement}
	 */
	let mapElement;
	/**
	 * @type {{ remove: () => void; }}
	 */
	let map;

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


	/**
	 * @type {Array<import('../models/telemetry').Telemetry>}
	 */
	let latestBalloonTelemetry;
	balloonTelemetry.subscribe((value) => {
		latestBalloonTelemetry = value;
	});
	

	afterUpdate(() => {
		if (latestBalloonTelemetry) {
			const latestTelemetry = latestBalloonTelemetry[0];

			if (latestTelemetry) {
				if (altitudeChartInstance) {
					if (
						!altitudeChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
						altitudeChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
						altitudeChartInstance.data.datasets[0].data.push(
							latestTelemetry.altitude ?? 0
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
					// @ts-ignore
					speedChartInstance.data.datasets[0].data.push(knotsToMPH(latestTelemetry.speed) 
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
						// @ts-ignore
						temperatureChartInstance.data.datasets[0].data.push(celsiusToFahrenheit(latestTelemetry.temperature));
						temperatureChartInstance.update();
					}
					}
					if (map && latestTelemetry.gridSquare && balloonPath) {
						let coords = maidenheadToLatLng(latestTelemetry.gridSquare);
						// @ts-ignore
						balloonPath.addLatLng([coords.latitude, coords.longitude]);
						balloonPath.addTo(map);
					}
				}
			}
		}
	});
	

	onMount(async () => {
		if (browser) {
			// @ts-ignore
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

				latestBalloonTelemetry.forEach((record) => {
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
					labels: latestBalloonTelemetry.map((l) => l.lastUpdated?.toString()),
					datasets: [
						{
							label: 'Altitude (Feet)',
							data: latestBalloonTelemetry.map((l) =>
								l.altitude ? l.altitude * 3.28084 : l.altitude
							),
							borderWidth: 1,
							borderColor: 'rgb(75, 192, 192)',
							backgroundColor: 'rgb(300,300,300)'
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
					labels: latestBalloonTelemetry.map((l) => l.lastUpdated?.toString()),
					datasets: [
						{
							label: 'Power (V)',
							data: latestBalloonTelemetry.map((l) => l.battery),
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
				labels: latestBalloonTelemetry.map((l) => l.lastUpdated?.toString()),
				datasets: [
					{
						label: 'Speed (MPH)',
						data: latestBalloonTelemetry.map((l) =>
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
				labels: latestBalloonTelemetry.map((l) => l.lastUpdated?.toString()),
				datasets: [
					{
						label: 'Temperature (F)',
						data: latestBalloonTelemetry.map((l) =>
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
		//altitudeChartInstance.destroy();
	});

</script>


<div class="flex flex-col p-b6">
	<div id="map" class="border-2 border-solid border-gray-400 rounded-md" bind:this={mapElement} />
	<canvas bind:this={altitudeChart} />
	<canvas bind:this={speedsChart} />
	<canvas bind:this={powerChart} />
	<canvas bind:this={temperaturesChart} />
	<!-- <button on:click={addDataTest}>Add d</button> -->
</div>

<style>
	@import 'leaflet/dist/leaflet.css';
	#map {
		height: 500px;
		width: 100%;
	}

 canvas{
	max-height: 200px;
 }
</style>
