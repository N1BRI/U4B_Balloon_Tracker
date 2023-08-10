<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { trackedBalloonsList } from '../stores';
	import { createTelemetry } from '../models/telemetry';
	import { maidenheadToLatLng } from '../models/coordinates';

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
            historicalTelemetry.telemetrySpots.forEach((record)=>{
                if(record.gridSquare){
                    let coords = maidenheadToLatLng(record.gridSquare)
                    balloonTrackPoints.push([coords.latitude, coords.longitude]);
                }
            })
            leaflet.polyline(balloonTrackPoints).addTo(map);
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

<main>
	<button on:click={closeDashboardClick}>x</button>
	<div id="map" bind:this={mapElement} />
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
	main {
		padding: 10px;
	}
	#map {
		height: 600px;
		width: 90%;
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
