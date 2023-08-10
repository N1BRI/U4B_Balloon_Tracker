/**
 * Represents Historical U4B Telemetry Data.
 * @typedef {Object} HistoricalTelemetry
 * @property {string | null} id - id for this balloon
 * @property {Date} telemetryStartDate - date of balloon launch
 * @property {boolean} balloonIsActive - is this balloon active (determines if this balloon should be actively monitored)
 * @property {import("./telemetry").Telemetry[] | null} telemetrySpots - list of telemetry
 */

/**
 * Create a HistoricalTelemetry object.
 * @param {Date} telemetryStartDate - date of balloon launch
 * @param {boolean} balloonIsActive - is this balloon active
 * @returns {HistoricalTelemetry} A HistoricalTelemetry object
 */
export function createHistoricalTelemetry(telemetryStartDate, balloonIsActive) {
    return {
        id: null,
        telemetryStartDate: telemetryStartDate,
        balloonIsActive: balloonIsActive,
        telemetrySpots: []
    };
  }