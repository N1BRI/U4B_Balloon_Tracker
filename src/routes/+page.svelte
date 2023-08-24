<script>
	import { page } from '$app/stores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import '../app.css';
	import BalloonConfigForm from '../components/BalloonConfigForm.svelte';
	import { balloonConfigData } from '../stores';

export let form;
/**
	 * @type {{ launchName: any; callsign?: any; slotId?: number; telCallFormat?: any; startDate?: Date; }}
	 */
let configData;

if(form?.success){
	configData = form.formData;
}


	onMount(async () => {


	});

onDestroy(()=>{
	console.log("hey i got called on the form submit")
})
</script>

<BalloonConfigForm form={form}/>
<h1>{configData?.launchName}</h1>
