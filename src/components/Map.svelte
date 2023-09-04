<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { maidenheadToLatLng } from '../models/coordinates';

	/**
	 * @type {Array<import('../models/telemetry').Telemetry>}
	 */
	export let latestBalloonTelemetry;

	/**
	 * @type {Array<import('../models/wsprSpot').wsprSpot>}
	 */
	export let latestWsprSpots;

	/**
	 * @type {HTMLDivElement}
	 */
	let mapElement;

	/**
	 * @type {{ addLatLng: (arg0: import("../models/coordinates").Coordinates) => void; addTo: (arg0: { remove: () => void; }) => void; }}
	 */
	let balloonPath;

	/**
	 * @type {number[][]}
	 */
	let balloonTrackPoints = [];

	onMount(async () => {
		let coords = [50, -70];
		const leaflet = await import('leaflet');
		const iconPath = '/img/leaflet/';
		const leafletArc = await import('leaflet-arc');

		
		leaflet.Marker.prototype.options.icon = leaflet.icon({
			iconRetinaUrl: `${iconPath}/marker-icon-2x.png`,
			iconUrl: `${iconPath}/marker-icon.png`,
			shadowUrl: `${iconPath}/marker-shadow.png`
		});

		var osm = leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		});

		var carto = leaflet.tileLayer(
			'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
			{
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 20
			}
		);

		if (latestBalloonTelemetry[latestBalloonTelemetry.length - 1]?.gridSquare != null) {
			// @ts-ignore
			let latLang = maidenheadToLatLng(
				// @ts-ignore
				latestBalloonTelemetry[latestBalloonTelemetry.length - 1]?.gridSquare
			);
			coords = [latLang.latitude, latLang.longitude];
		}

		// 		/**
		// 		 * @type {any[]}
		// 		 */
		/**
		 * @type {any[]}
		 */
		let telemSpots = [];
		// 		latestBalloonTelemetry.forEach((spot) => {
		// 			let coordsRx = maidenheadToLatLng(spot.telemetryRxLocation);
		// 			let coordsTx = maidenheadToLatLng(spot.gridSquare);
		// 			if (!isNaN(coordsRx.latitude) && !isNaN(coordsRx.longitude) &&
		// 			!isNaN(coordsTx.latitude) && !isNaN(coordsTx.longitude) ) {
		// 				console.log("coordsRx.latitude:", coordsRx.latitude);
		// console.log("coordsRx.longitude:", coordsRx.longitude);
		// console.log("coordsTx.latitude:", coordsTx.latitude);
		// console.log("coordsTx.longitude:", coordsTx.longitude);
		// 				//wsprSpots.push(leaflet.marker([coords.latitude, coords.longitude]).bindPopup(`${spot.rx_sign} : ${spot.spot_power}`));
		// 				telemSpots.push(
		// 					leaflet.Polyline.Arc([coordsRx.latitude, coordsRx.longitude], [coordsTx.latitude, coordsTx.longitude], {
		// 						color: 'green',
		// 						weight: 2,
		// 						vertices: 200
		// 					})
		// 				);
		// 			}
		// 		});

		/**
		 * @type {any[]}
		 */
		let wsprSpots = [];
		latestWsprSpots.forEach((spot) => {
			let coordsRx = maidenheadToLatLng(spot.spot_rx_loc);
			let coordsTx = maidenheadToLatLng(
				latestBalloonTelemetry[Math.round(latestBalloonTelemetry.length / 2)].gridSquare
			);

			if (
				!isNaN(coordsRx.latitude) &&
				!isNaN(coordsRx.longitude) &&
				!isNaN(coordsTx.latitude) &&
				!isNaN(coordsTx.longitude)
			) {
				wsprSpots.push(
					leaflet
						.marker([coordsRx.latitude, coordsRx.longitude])
						.bindPopup(
							`<strong>Reporter:</strong> ${spot.rx_sign} <br><strong>SNR:</strong> ${spot.spot_snr} <br><strong>Time:</strong> ${spot.spot_time}`
						)
				);
				wsprSpots.push(
					leaflet.Polyline.Arc(
						[coordsRx.latitude, coordsRx.longitude],
						[coordsTx.latitude, coordsTx.longitude],
						{
							color: 'rgb(20, 184, 166)',
							weight: 2,
							vertices: 200
						}
					)
				);
			}
		});

		latestBalloonTelemetry.forEach((record) => {
			if (record.gridSquare) {
				let coords = maidenheadToLatLng(record.gridSquare);
				balloonTrackPoints.push([coords.latitude, coords.longitude]);
			}
		});
		balloonPath = leaflet.polyline(balloonTrackPoints);

		var spots = leaflet.layerGroup(wsprSpots);
		var map = leaflet.map(mapElement, {
			center: coords,
			zoom: 6,
			layers: [carto, balloonPath]
		});

		var baseMaps = {
			Carto: carto,
			OpenStreetMap: osm
		};

		var overlayMaps = {
			WSPRSpots: spots,
			BalloonPath: balloonPath
		};

		leaflet.control.layers(baseMaps, overlayMaps).addTo(map);
	});
</script>

<div id="map" bind:this={mapElement} />

<style>
	@import 'leaflet/dist/leaflet.css';
	#map {
		height: 400px;
		width: 100%;
	}
</style>
