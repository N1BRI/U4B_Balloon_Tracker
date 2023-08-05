<script>
	import Header from '../components/layout/Header.svelte';
	import Modal from '../components/Modal.svelte';
	import AddBalloonForm from '../components/AddBalloonForm.svelte';
    import TelemetrySummary from '../components/TelemetrySummary.svelte';
    import { trackedBalloons } from '../stores';

    let showModal = false;


    /**
	 * @type {import("../models/telmetry").Telemetry[]}
	 */
    let balloons;
    const showAddBalloonModal = () =>{
        showModal = true;
    }
	trackedBalloons.subscribe((value) => {
		balloons = value;
	});
    /**
	 * @param {{ detail: { showModal: boolean; }; }} e
	 */
    const handleCancelAddBalloonClicked = (e) => {
        showModal = e.detail.showModal
    }
     /**
	 * @param {{ detail: { showModal: boolean; }; }} e
	 */
    const handleSubmitAddBalloonClicked = (e) => {
        showModal = e.detail.showModal
    }
</script>

<Modal {showModal}>
	<AddBalloonForm on:cancelAddBalloonClicked={handleCancelAddBalloonClicked} 
                    on:submitAddBalloonClicked={handleSubmitAddBalloonClicked}/>
</Modal>
<Header />
<main class="">
	<div id="panel-row">
        <div class=" ">
            <button id="addBalloonBtn" on:click={showAddBalloonModal}>+</button>
        </div>  
        <div class="">
            <h3 class="startMsg">Click the '+' button to add a balloon</h3>
        </div>
	</div>
    {#if balloons.length > 0}
        {#each balloons as balloon}
            <TelemetrySummary telemetry={balloon}/>
        {/each}
    {/if}
</main>

<style>
	main {
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
		border: 1px solid transparent;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
	.startMsg {
		color: #787878;
	}
   
</style>
