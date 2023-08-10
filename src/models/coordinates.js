
/**
 * @param {string} maidenhead
 * @returns {Coordinates}
 */
export function maidenheadToLatLng(maidenhead) {
    const lonIndex1 = maidenhead.charCodeAt(0) - 65;
    const latIndex1 = maidenhead.charCodeAt(1) - 65;
    const lonIndex2 = parseInt(maidenhead.charAt(2));
    const latIndex2 = parseInt(maidenhead.charAt(3));
    const lonIndex3 = maidenhead.charCodeAt(4) - 97;
    const latIndex3 = maidenhead.charCodeAt(5) - 97;
  
    const lon = (lonIndex1 * 20 + lonIndex2 * 2 + lonIndex3 * (5 / 60) + (1 / 120)) - 180;
    const lat = (latIndex1 * 10 + latIndex2 + latIndex3 * (2.5 / 60) + (1.25 / 60)) - 90;
  
    return { latitude: lat, longitude: lon };
  }

  /**
 * Represents Lat/Long Coordinates.
 * @typedef {Object} Coordinates
 * @property {number} latitude 
 * @property {number} longitude
 */