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

	/**
	 * @type {string}
	 */
	let selectedTelemetryTitle;
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
	
	const handleOpenDashboardClick = (/** @type {{ detail: { showDashboard: boolean; historicalTelemetryId: string; title: string; }; }} */ e) => {
		showDashboard = e.detail.showDashboard;
		historicalTelemetryId = e.detail.historicalTelemetryId;
		selectedTelemetryTitle = e.detail.title;
	}
	/**
	 * @param {{ detail: { showDashboard: boolean, historicalTelemetryId: string }; }} e
	 */
	const handleCloseDashboardClick = (e) => {
		showDashboard = e.detail.showDashboard;
	}


</script>
<Modal bind:showModal={showDashboard} maxHeight={'100%'} maxWidth={'100%'} title={selectedTelemetryTitle}>
	<Dashboard on:closeDashboardClick={handleCloseDashboardClick} historicalTelemetryId={historicalTelemetryId}></Dashboard>
</Modal>
<Modal bind:showModal={showModal} title={"Enter U4B Balloon Information"} maxHeight={'90%'} maxWidth={'500px'}>
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
<main class="main-panel">
	{#each balloons as balloon}
		<div class="telemetry-container">
			<TelemetrySummary historicalTelemetry={balloon}
			on:showDashboardClicked={handleOpenDashboardClick}/>
		</div>
	{/each}
</main>
<Footer/>

<style>
	.main-panel{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 100px;
		padding-bottom: 300px;
	}
	.panel-row {
		display: flex;
		align-items: center;
	}
	.telemetry-container {
		margin: 10px;
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
