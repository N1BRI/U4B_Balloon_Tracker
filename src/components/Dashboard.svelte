<script>
	import { onMount, onDestroy, createEventDispatcher, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { balloonTelemetry } from '../stores';
	import { maidenheadToLatLng } from '../models/coordinates';
	import { Chart, registerables } from 'chart.js';
	import { celsiusToFahrenheit, knotsToMPH, metersToFeet } from '../helpers';
	import SliderSwitch from './layout/SliderSwitch.svelte';

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
	 * @type {{ setView?: any; remove: any; }}
	 */
	let map;

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
	 */
	let altitudeChartInstance;

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
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

	afterUpdate(async () => {



		if (latestBalloonTelemetry) {
			const latestTelemetry = latestBalloonTelemetry[latestBalloonTelemetry.length - 1];

			if (latestTelemetry) {
				if (altitudeChartInstance) {
					if (
						!altitudeChartInstance.data.labels?.find(
							(l) => l === latestTelemetry.lastUpdated?.toString()
						)
					) {
						altitudeChartInstance?.data?.labels?.push(latestTelemetry?.lastUpdated?.toString());
						altitudeChartInstance.data.datasets[0].data.push(latestTelemetry.altitude ?? 0);
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
						speedChartInstance.data.datasets[0].data.push(knotsToMPH(latestTelemetry.speed));
						speedChartInstance.update();
					}

					if (temperatureChartInstance) {
						if (
							!temperatureChartInstance.data.labels?.find(
								(l) => l === latestTelemetry.lastUpdated?.toString()
							)
						) {
							temperatureChartInstance?.data?.labels?.push(
								latestTelemetry?.lastUpdated?.toString()
							);
							// @ts-ignore
							temperatureChartInstance.data.datasets[0].data.push(
								// @ts-ignore
								celsiusToFahrenheit(latestTelemetry.temperature)
							);
							temperatureChartInstance.update();
						}
					}
				}
			}
		}
	});

	onMount(async () => {
			

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
							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						x: 
							{
								ticks: {
									maxTicksLimit: 6,
									font:{
										size: 10
									}
								}
							}
						,
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
		if (powerChart) {
			powerChartInstance = new Chart(powerChart, {
				type: 'line',
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
						x: 
							{
								ticks: {
									maxTicksLimit: 6,
									font:{
										size: 10
									}
								}
							}
						,
						
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
						data: latestBalloonTelemetry.map((l) => (l.speed ? l.speed * 1.15078 : l.speed)),
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					x: 
							{
								ticks: {
									maxTicksLimit: 6,
									font:{
										size: 10
									}
								}
							}
						,
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
					x: 
							{
								ticks: {
									maxTicksLimit: 6,
									font:{
										size: 10
									}
								}
							}
						,
					y: {
						beginAtZero: true
					}
				}
			}
			
		});
	});

</script>

<div class="flex flex-col mb-20">
	<canvas class="max-h-32" bind:this={altitudeChart} />
	<canvas class="max-h-32" bind:this={speedsChart} />
	<canvas class="max-h-32" bind:this={powerChart} />
	<canvas class="max-h-32" bind:this={temperaturesChart} />
	<!-- <button on:click={addDataTest}>Add d</button> -->
</div>

