
/**
 * Represents decoded U4B Telemetry Data.
 * @typedef {Object} DecodedTelemetry
 * @property {Date} lastUpdated - time of last update
 * @property {number} temperature - The temperature of the U4B board
 * @property {number} battery - The battery in volts of the U4B board.
 * @property {number} altitude - The altitude of the U4B board in meters
 * @property {number} speed - The speed of the U4B board in knots .
 * @property {string} telemetrySubsquare - The subsquare derived from telemetry transmission
 * @property {number} gpsStatus - The gps status of the U4B board.
 * @property {number} satsStatus - The satellite status of the U4B board
 * @property {string} lastReportedBy - The callsign of telmetry reporting station
 */


/**
 *  Create a new DecodedTelemetry object.
 * @param {Date} lastUpdated - time of last update
 * @param {number} temperature - The temperature of the U4B board
 * @param {number} battery - The battery in volts of the U4B board.
 * @param {number} altitude - The altitude of the U4B board in meters
 * @param {number} speed - The speed of the U4B board in knots .
 * @param {string} telemetrySubsquare - The subsquare derived from telemetry transmission
 * @param {number} gpsStatus - The gps status of the U4B board.
 * @param {number} satsStatus - The satellite status of the U4B board
 * @param {string} lastReportedBy - The callsign of telmetry reporting station
 * @returns {DecodedTelemetry} A new DecodedTelemetry object.
 */
export function createDecodedTelemetry(
  lastUpdated,
  temperature,
  battery,
  altitude,
  speed,
  telemetrySubsquare,
  gpsStatus,
  satsStatus,
  lastReportedBy
) {
  return {
    lastUpdated,
    temperature,
    battery,
    altitude,
    speed,
    telemetrySubsquare,
    gpsStatus,
    satsStatus,
    lastReportedBy
  };
}
