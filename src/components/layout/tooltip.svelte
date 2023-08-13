<script>
	/**
	 * @type {string}
	 */
	export let tooltip;
</script>

<div class="tooltip">
	<slot />
	<span class="tooltiptext">{tooltip}</span>
</div>

<style>
	.tooltip {
		position:relative;
		border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
	}

	/* Tooltip text */
	.tooltip .tooltiptext {
		visibility: hidden;
		width: 220px;
		background-color: #00abab;
		color: #fff;
		text-align: center;
		padding: 5px;
		border-radius: 6px;

		/* Position the tooltip text - see examples below! */
		position: absolute;
		z-index: 1;
	}

	/* Show the tooltip text when you mouse over the tooltip container */
	.tooltip:hover .tooltiptext {
		visibility: visible;
	}
</style>
