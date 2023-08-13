<script>
	import Header from '../components/layout/Header.svelte';
	import Modal from '../components/Modal.svelte';
	import AddBalloonForm from '../components/AddBalloonForm.svelte';
	import TelemetrySummary from '../components/TelemetrySummary.svelte';
	import { trackedBalloonsList } from '../stores';
	import Dashboard from '../components/Dashboard.svelte';
	import Footer from '../components/layout/Footer.svelte';

	let showModal = false;
	let showDashboard = false;

	/**
	 * @type {import("../models/HistoricalTelemetry").HistoricalTelemetry[]}
	 */
	let balloons;
	/**
	 * @type {string}
	 */
	let historicalTelemetryId;
	const showAddBalloonModal = () => {
		showModal = true;
	};
	trackedBalloonsList.subscribe((value) => {
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
	 * @param {{ detail: { showDashboard: boolean, historicalTelemetryId: string }; }} e
	 */
	const handleChildButtonClicked = (e) => {
		showDashboard = e.detail.showDashboard;
		historicalTelemetryId = e.detail.historicalTelemetryId;
	}
	/**
	 * @param {{ detail: { showDashboard: boolean, historicalTelemetryId: string }; }} e
	 */
	const handleCloseDashboardClick = (e) => {
		showDashboard = e.detail.showDashboard;
	}


</script>
<Modal showModal={showDashboard} height="100%" width="100%" onOverFlowY="scroll">
	<Dashboard on:closeDashboardClick={handleCloseDashboardClick} historicalTelemetryId={historicalTelemetryId}></Dashboard>
</Modal>
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
			<TelemetrySummary historicalTelemetry={balloon}
			on:showDashboardClicked={handleChildButtonClicked}/>
		</div>
	{/each}
</main>
<Footer/>

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
		padding: 0px 10px 100px 10px;
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

	@media (max-width: 767px) {
  main {
    justify-content: center;
  }
}
</style>
