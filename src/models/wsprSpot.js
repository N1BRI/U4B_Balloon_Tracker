/**
 * Represents an wsprSpot with the following properties.
 *
 * @typedef {Object} wsprSpot
 * @property {string} rx_sign - The RX sign, e.g., "NZ1J".
 * @property {number} spot_power - The spot power, e.g., 10.
 * @property {string} spot_rx_loc - The spot RX location, e.g., "FN31".
 * @property {number} spot_snr - The spot SNR (Signal-to-Noise Ratio), e.g., 41.
 * @property {string} spot_time - The spot time in the format "YYYY-MM-DD HH:mm:ss", e.g., "2023-09-01 14:36:00".
 * @property {string} spot_tx_loc - The spot TX location, e.g., "FN31".
 */


/**
 * Creates a new wsprSpot object with default values.
 * @returns {wsprSpot} A new wsprSpot object with default values.
 */
export function createWsprSpot() {
    return {
      rx_sign: "",
      spot_power: 0,
      spot_rx_loc: "",
      spot_snr: 0,
      spot_time: "",
      spot_tx_loc: ""
    };
  }