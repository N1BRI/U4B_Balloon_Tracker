
/**
 * Represents U4B Telemetry Data.
 * @typedef {Object} WsprLiveData
 * @property {string} tx_sign - The station telemetry callsign
 * @property {number} power - The reported power
 * @property {string} rx_sign - the callsign of the reporting station
 * @property {string} tel_loc - telemetry location
 * @property {string} tx_loc - balloon location
 * @property {Date} time - time of report
 */


/** 
* @param {string} tx_sign
* @param {string} telLocation
* @param {number} power
* @param {string} reportedBy
* @param {string} txLocation
* @param {Date}  time
* @returns {WsprLiveData}  
*/
export function createTelemetry(tx_sign, telLocation, power, reportedBy, txLocation, time) {
    return {
        'tx_sign': tx_sign,
        'tel_loc': telLocation,
        'power': power,
        'rx_sign': reportedBy,
        'tx_loc': txLocation,
        'time': time,
    }
}