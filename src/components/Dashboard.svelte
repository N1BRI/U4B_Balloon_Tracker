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
        width: 70%;
	}

    button{
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
