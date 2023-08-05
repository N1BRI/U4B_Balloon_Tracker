<script>
      /**
	 * @type {import("../models/telmetry").Telemetry}
	 */
	export let telemetry;

    import { onMount } from 'svelte';

    onMount( () => {
        
    })
</script>

<div id="container">
	<div id="callsign"><h1>{telemetry.callsign}</h1></div>
	<mark><i>Updated: 2023-07-17 22:13:00</i></mark>
	<h3 style="margin-top: 15px;">Temperature (C): N/A</h3>
	<h3>Battery (V): N/A</h3>
	<h3>Grid Square: N/A</h3>
	<h3>GPS Status: N/A</h3>
	<h3>Satellite Status: N/A</h3>
	<div id="view">
		<span class="icon-link" />
	</div>
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
