
/**
 * @param {string} maidenhead
 * @returns {Coordinates}
 */
export function maidenheadToLatLng(maidenhead) {
  if (maidenhead.length !== 4 && maidenhead.length !== 6) {
    maidenhead = maidenhead.substring(0,5);
  }

  const lonIndex1 = maidenhead.charCodeAt(0) - 65;
  const latIndex1 = maidenhead.charCodeAt(1) - 65;

  const lonIndex2 = parseInt(maidenhead.charAt(2));
  const latIndex2 = parseInt(maidenhead.charAt(3));

  let lonIndex3 = 0;
  let latIndex3 = 0;

  if (maidenhead.length === 6) {
    lonIndex3 = maidenhead.charCodeAt(4) - 97;
    latIndex3 = maidenhead.charCodeAt(5) - 97;
  }

  const lon = (lonIndex1 * 20 + lonIndex2 * 2 + lonIndex3 * (5 / 60) + (1 / 120)) - 180;
  const lat = (latIndex1 * 10 + latIndex2 + latIndex3 * (2.5 / 60) + (1.25 / 60)) - 90;

  return { latitude: lat, longitude: lon };
}



  /**
 * Represents Lat/Long Coordinates.
 * @typedef {Object} Coordinates
 * @property {number} latitude
 * @property {number} longitude
 * @param {{ latitude: any; longitude: any; }} coords
 */
  export function strCoordinates(coords){
    return `[${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}]`
  }