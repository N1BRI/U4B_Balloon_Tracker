<script>
	import Header from '../components/layout/Header.svelte';
	import Modal from '../components/Modal.svelte';
	import AddBalloonForm from '../components/AddBalloonForm.svelte';
	import TelemetrySummary from '../components/TelemetrySummary.svelte';
	import { trackedBalloons } from '../stores';

	let showModal = false;
	let showDashboard = false;

	/**
	 * @type {import("../models/telmetry").Telemetry[]}
	 */
	let balloons;
	const showAddBalloonModal = () => {
		showModal = true;
	};
	trackedBalloons.subscribe((value) => {
		balloons = value;
	});
	/**
	 * @param {{ detail: { showModal: boolean; }; }} e
	 */
	const handleCancelAddBalloonClicked = (e) => {
		showModal = e.detail.showModal;
	};
	/**
	 * @param {{ detail: { showModal: boolean; }; }} e
	 */
	const handleSubmitAddBalloonClicked = (e) => {
		showModal = e.detail.showModal;
	};
	/**
	 * @param {{ detail: { showDashboard: boolean, telemetryId: string }; }} e
	 */
	const handleChildButtonClicked = (e) => {
		showDashboard = e.detail.showDashboard;
	}


</script>
<Modal showModal={showDashboard}></Modal>
<Modal {showModal}>
	<AddBalloonForm
		on:cancelAddBalloonClicked={handleCancelAddBalloonClicked}
		on:submitAddBalloonClicked={handleSubmitAddBalloonClicked}
	/>
</Modal>
<Header />
<div class="panel-row">
	<div class=" ">
		<button id="addBalloonBtn" on:click={showAddBalloonModal}>+</button>
	</div>
	{#if balloons.length < 1}
		<div class="">
			<h3 class="startMsg">Click the '+' button to add a balloon</h3>
		</div>
	{/if}
</div>
<main class="">
	{#each balloons as balloon}
		<div class="telemetry-container">
			<TelemetrySummary telemetryId={balloon.id} on:showDashboardClicked={handleChildButtonClicked}/>
		</div>
	{/each}
</main>

<style>
	.panel-row {
		display: flex;
		align-items: center;
	}
	.telemetry-container {
		margin: 10px;
	}
	main {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		padding: 1em;
		margin: 0 auto;
	}

	#addBalloonBtn:active {
		background-color: #017272;
	}

	#addBalloonBtn {
		border-radius: 50%;
		height: 40px;
		background-color: #00abab;
		color: white;
		width: 40px;
		margin: 1em;
		border: 1px solid transparent;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
	.startMsg {
		color: #787878;
	}
</style>
