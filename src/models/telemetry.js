
/**
 * Represents U4B Telemetry Data.
 * @typedef {Object} Telemetry
 * @property {string | null} telemetryCallsign - telemetry callsign
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
* @returns {Telemetry}  
*/
export function createTelemetry() {
    return {
        'telemetryCallsign' : null,
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