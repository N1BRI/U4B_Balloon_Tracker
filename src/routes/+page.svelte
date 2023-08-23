<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';


export let form;

console.log(form)




	    /**
     * @type BalloonConfigFormData
     */
	let balloonFormData = {
		launchName: null,
		callsign: null,
		telCallFormat: null,
		slotId: null,
		startDate: null
	};

	let formData = form?.formData ?? balloonFormData;

	onMount(async () => {
		balloonFormData.launchName = $page.url.searchParams.get('launchname');
		balloonFormData.callsign = $page.url.searchParams.get('callsign');
		balloonFormData.telCallFormat = $page.url.searchParams.get('telcallsign');
		balloonFormData.slotId = parseInt($page.url.searchParams.get('slotid') ?? '');

	});
</script>

<BalloonConfigForm formData={formData}/>
