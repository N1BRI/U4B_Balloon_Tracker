export const setCookie = (/** @type {any} */ name, /** @type {any} */ value, /** @type {number} */ days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }



 /**
 * @param {number | null} temp
 */
 export function celsiusToFahrenheit(temp){
  return temp === null ? null : (temp * 9) / 5 + 32
 }


  /**
 * @param {number | null} speed
 */
  export function knotsToMPH(speed){
    return speed === null ? null : speed * 1.15078;
   }

 
     /**
 * @param {number | null} altitude
 */
  export function metersToFeet(altitude){
    return altitude === null ? null : altitude * 3.28084;
   }

   