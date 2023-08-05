
/**
 * Represents U4B Telemetry Data.
 * @typedef {Object} Telemetry
 * @property {string} callsign - The station callsign
 * @property {number} slotId - The slot id of the U4B board.
 * @property {string} formatMask - the format mask of the U4B board ex: 0_3%
 * @property {string} intervalTimerId - Id of the timer that fires to query wspr.live for new telemetry
 * @property {Date | null} lastUpdated - time of last update
 * @property {number | null} temperature - The temperature of the U4B board
 * @property {number | null} battery - The battery in volts of the U4B board.
 * @property {string | null} gridSquare - The temperature of the U4B board
 * @property {number | null} gpsStatus - The gps status of the U4B board.
 * @property {number | null} satsStatus - The satellite status of the U4B board
 */


/** 
* @param {string} callsign
* @param {number} slotId
* @param {string} formatMask
* @returns {Telemetry}  
*/
export function createTelemetry(callsign, slotId, formatMask) {
    return {
        'callsign': callsign,
        'slotId': slotId,
        'formatMask': formatMask,
        'intervalTimerId': '',
        'lastUpdated': null,
        'temperature': null,
        'battery': null,
        'gridSquare': '',
        'gpsStatus': null,
        'satsStatus': null
    }
}