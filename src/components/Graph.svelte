<script>
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

    Chart.register(...registerables);

	/**
	 * @type {Chart<"line", (number | null)[], string | undefined>}
	 */
     let chartInstance;

     	/**
	 * @type{HTMLCanvasElement}
	 */
	let chart;

    	/**
	 * @type {Array<import('../models/telemetry').Telemetry>}
	 */
	export let latestBalloonTelemetry;



    onMount(async()=>{
        chartInstance = new Chart(chart, {
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
    });


</script>

<canvas class="max-h-32" bind:this={chart} />