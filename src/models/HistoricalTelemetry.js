/**
 * Represents Historical U4B Telemetry Data.
 * @typedef {Object} HistoricalTelemetry
 * @property {string} id - id for this balloon
 * @property {string} callsign - id for this balloon
 * @property {string} name - The balloon launch name
 * @property {Date | null} lastUpdated - time of last update
 * @property {number} slotId - The standard wspr slot id of the U4B board.
 * @property {string} formatMask - the format mask of the U4B board ex: 0_3%
 * @property {Date} telemetryStartDate - date of balloon launch
 * @property {boolean} balloonIsActive - is this balloon active? (determines if this balloon should be actively monitored)
 * @property {import("./telemetry").Telemetry[]} telemetrySpots - list of telemetry
 */

/**
* Create a HistoricalTelemetry object with default values.
* @param {string} name - The balloon launch name
* @param {string} callsign - The balloon callsign
* @param {number} slotId - The standard wspr slot id of the U4B board.
* @param {string} formatMask - the format mask of the U4B board ex: 0_3%
* @param {Date} telemetryStartDate - date of balloon launch
* @param {boolean} balloonIsActive - is this balloon active? (determines if this balloon should be actively monitored)
* @param {import("./telemetry").Telemetry[]} telemetrySpots - list of telemetry
* @returns {HistoricalTelemetry} A HistoricalTelemetry object
*/
export function createHistoricalTelemetry(
 name,
 callsign,
 slotId,
 formatMask,
 telemetryStartDate,
 balloonIsActive,
 telemetrySpots = []
) {
 return {
   id: buildTelemetryId(callsign, slotId,formatMask),
   name,
   callsign,
   lastUpdated: null,
   slotId,
   formatMask,
   telemetryStartDate,
   balloonIsActive,
   telemetrySpots,
 };
}


/**
* Create a HistoricalTelemetry id.
* @param {string} callsign - id for this balloon
* @param {number} slotId - The standard wspr slot id of the U4B board.
* @param {string} formatMask - the format mask of the U4B board ex: 0_3%
*/
export function buildTelemetryId(callsign, slotId, formatMask){
    return `${callsign}${slotId}${formatMask}`
}