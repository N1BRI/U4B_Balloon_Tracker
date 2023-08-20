<script>
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '../components/layout/Header.svelte';
	import Modal from '../components/Modal.svelte';
	import AddBalloonForm from '../components/AddBalloonForm.svelte';
	import TelemetrySummary from '../components/TelemetrySummary.svelte';
	import { trackedBalloonsList } from '../stores';
	import Dashboard from '../components/Dashboard.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';

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
	console.log($page.url.searchParams.get('launchname')); 
	console.log($page.url.searchParams.get('callsign')); 
	console.log($page.url.searchParams.get('telcallsign')); 
	console.log($page.url.searchParams.get('slotid')); 
	console.log($page.url.searchParams.get('start')); 
</script>
<BalloonConfigForm/>

