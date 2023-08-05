import { writable } from 'svelte/store';



/** @type {import('svelte/store').Writable<import('./models/telmetry').Telemetry[]>} */
export let trackedBalloons = writable([]);