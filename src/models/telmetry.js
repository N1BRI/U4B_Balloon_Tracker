
/**
 * Represents U4B Telemetry Data.
 * @typedef {Object} Telemetry
 * @property {string} name - The balloon launch name
 * @property {string} callsign - The station callsign
 * @property {string | null} telemetryCallsign - The U4B telemetry callsign
 * @property {number} slotId - The standard wspr slot id of the U4B board.
 * @property {string} formatMask - the format mask of the U4B board ex: 0_3%
 * @property {Date | null} lastUpdated - time of last update
 * @property {number | null} temperature - The temperature of the U4B board
 * @property {number | null} battery - The battery in volts of the U4B board.
 * @property {number | null} altitude - The altitude of the U4B board in meters
 * @property {number | null} speed - The speed of the U4B board in knots .
 * @property {string | null} telemetrySubsquare - The subsquare derived from telemetry transmission
 * @property {string | null} telemetryLocation - The tx gridsquare on telemetry transmission
 * @property {string | null} gridSquare - The detail gridsquare of the U4B board (i.e. grid square + subsquare from telemetry)
 * @property {number | null} gpsStatus - The gps status of the U4B board.
 * @property {number | null} satsStatus - The satellite status of the U4B board
 * @property {string | null} lastReportedBy - The callsign of telmetry reporting station
 */


/** 
* @param {string} name
* @param {string} callsign
* @param {number} slotId
* @param {string} formatMask
* @returns {Telemetry}  
*/
export function createTelemetry(name, callsign,  slotId, formatMask) {
    return {
        'name': name,
        'callsign': callsign,
        'telemetryCallsign' : null,
        'slotId' : slotId,
        'formatMask': formatMask,
        'lastUpdated': null,
        'temperature': null,
        'telemetryLocation' : null,
        'altitude':null,
        'telemetrySubsquare': null,
        'speed': null,
        'battery': null,
        'gridSquare': '',
        'gpsStatus': null,
        'satsStatus': null,
        'lastReportedBy' : null
    }
}