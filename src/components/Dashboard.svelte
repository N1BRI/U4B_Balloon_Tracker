<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

    const dispatch = createEventDispatcher();

	/**
	 * @type {HTMLDivElement}
	 */
	let mapElement;
	/**
	 * @type {{ remove: () => void; }}
	 */
	let map;

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

			leaflet
				.marker([51.5, -0.09])
				.addTo(map)
				.bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
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
	<div id="map" bind:this={mapElement} />
    <button on:click={closeDashboardClick}>Close</button>
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
	main {
        padding: 10px;
		background-color: #eee;
		z-index: 1;
	}
	#map {
		height: 600px;
	}

    button{
		background-color: #00abab;
		color: white;
	}

    :root {

    --button-back-color: none;
    --button-hover-back-color: none;

}
</style>
