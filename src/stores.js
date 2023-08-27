import { writable } from 'svelte/store';



/**
 * @type {import('svelte/store').Writable<Array<import('./models/HistoricalTelemetry').HistoricalTelemetry>>}
 */
export let trackedBalloonsList = writable([]);


/**
 * @type {import('svelte/store').Writable<Array<import('./models/telemetry').Telemetry>>}
 */
export let balloonTelemetry = writable([]);

/**
 * @type {import('svelte/store').Writable<import('./models/BalloonConfigFormData').BalloonConfigFormData>}
 */
export let balloonConfigData = writable({
    callsign: '',
    telCallFormat: '',
    slotId: 0,
    startDate: new Date()
});
