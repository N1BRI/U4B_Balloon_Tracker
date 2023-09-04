
/**
 * Represents a data object containing telemetry and standard information.
 * @typedef {Object} WsprLiveData
 * @property {number} standard_power - The power for the standard data.
 * @property {string} standard_rx_sign - The RX sign for the standard data.
 * @property {Date} standard_time - The time for the standard data.
 * @property {string} standard_tx_loc - The TX location for the standard data.
 * @property {string} standard_tx_sign - The TX sign for the standard data.
 * @property {number} telemetry_power - The power for the telemetry data.
 * @property {string} telemetry_rx_sign - The RX sign for the telemetry data.
 * @property {Date} telemetry_time - The time for the telemetry data.
 * @property {string} telemetry_rx_loc - The RX location for the telemetry data.
 * @property {string} telemetry_tx_loc - The TX location for the telemetry data.
 * @property {string} telemetry_tx_sign - The TX sign for the telemetry data.
 */


/**
 * Creates a new instance of WsprLiveData.
 * @param {number} standard_power - The power for the standard data.
 * @param {string} standard_rx_sign - The RX sign for the standard data.
 * @param {Date} standard_time - The time for the standard data.
 * @param {string} standard_tx_loc - The TX location for the standard data.
 * @param {string} standard_tx_sign - The TX sign for the standard data.
 * @param {number} telemetry_power - The power for the telemetry data.
 * @param {string} telemetry_rx_sign - The RX sign for the telemetry data.
 * @param {Date} telemetry_time - The time for the telemetry data.
 * @param {string} telemetry_tx_loc - The TX location for the telemetry data.
 * @param {string} telemetry_rx_loc - The RX location for the telemetry data.
 * @param {string} telemetry_tx_sign - The TX sign for the telemetry data.
 * @returns {WsprLiveData} A new instance of WsprLiveData.
 */
export function createWsprLiveData(
    standard_power,
    standard_rx_sign,
    standard_time,
    standard_tx_loc,
    standard_tx_sign,
    telemetry_power,
    telemetry_rx_sign,
    telemetry_time,
    telemetry_tx_loc,
    telemetry_rx_loc,
    telemetry_tx_sign
  ) {
    return {
      standard_power,
      standard_rx_sign,
      standard_time,
      standard_tx_loc,
      standard_tx_sign,
      telemetry_power,
      telemetry_rx_sign,
      telemetry_time,
      telemetry_tx_loc,
      telemetry_rx_loc,
      telemetry_tx_sign,
    };
  }