import { writable } from 'svelte/store';

/**
 * @typedef {import('svelte/store').Writable<import('./models/telemetry').Telemetry[]>} WritableTelemetryArray
 */


/** @type {WritableTelemetryArray} */
export let trackedBalloons = writable([]);

/**
 * @type {import('svelte/store').Writable<Array<import('./models/telemetry').Telemetry[]>>}
 */
export let masterTrackedBalloons = writable([]);