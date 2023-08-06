/*  Magic numbers abound!
    Decodes balloon telemetry packed in WSPR signals.
    This code is based on VE3KCL's 308d spreadsheet 
    https://www.qrp-labs.com/images/ultimate3builder/ve3kcl/s4/308d.xls 
*/
const ALT_MAX = 1068
const ALPHA_RANGE_MAX = 24
const ALPHA_MAX = 26
const METER_SCALE_FACTOR = 20

const POWERS = {
    '0': 0,
    '3': 1,
    '7': 2,
    '10': 3,
    '13': 4,
    '17': 5,
    '20': 6,
    '23': 7,
    '27': 8,
    '30': 9,
    '33': 10,
    '37': 11,
    '40': 12,
    '43': 13,
    '47': 14,
    '50': 15,
    '53': 16,
    '57': 17,
    '60': 18
}

export function decodeTelemetry(callsign, locator, power, time) {
    let telemetry = {
        'callsign': callsign.toUpperCase(),
        'channel': getChannel(callsign),
        'power': power,
        'locator': locator.toUpperCase(),
        'subsquare': '',
        'altitude': '',
        'temperature': getTemperature(locator, power),
        'battery': getBattery(locator, power),
        'speed': '',
        'gps': '',
        'satellites': '',
        'time': time
    }

    let subSquareAlt = getSubsquareAndAltitude(callsign)
    let speedSatsGps = getSpeedGpsSats(locator, power)
    telemetry.subsquare = subSquareAlt[0] + subSquareAlt[1]
    telemetry.altitude = subSquareAlt[2]
    telemetry.speed = speedSatsGps[0]
    telemetry.gps = speedSatsGps[1]
    telemetry.satellites = speedSatsGps[2]

    return telemetry
}

function getCallsignNumber(callsign) {

    let decodedSecondChar;


    decodedSecondChar = 10 + getAlphabeticPos(callsign[1]);
    

    return (
        ALPHA_MAX * ALPHA_MAX * ALPHA_MAX * decodedSecondChar +
        ALPHA_MAX * ALPHA_MAX * getAlphabeticPos(callsign[3]) +
        ALPHA_MAX * getAlphabeticPos(callsign[4]) +
        getAlphabeticPos(callsign[5])
    );
}


function getChannel(callsign) {
    if (callsign[0] === 'Q') {
      return parseInt(callsign[3]) + 10;
    } else {
      return 0;
    }
  }


function getAlphabeticPos(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0)
}

function getSubsquareAndAltitude(callsign) {
    const callsignNumber = getCallsignNumber(callsign);
  
    const r1 = parseInt(callsignNumber / (ALPHA_RANGE_MAX * ALT_MAX));
    const subsquareI = String.fromCharCode(r1 + 'A'.charCodeAt(0));
  
    const r3 = callsignNumber - r1 * (ALPHA_RANGE_MAX * ALT_MAX);
    const r4 = parseInt(r3 / ALT_MAX);
    const subsquareII = String.fromCharCode(r4 + 'A'.charCodeAt(0));
  
    const r6 = r3 - r4 * ALT_MAX;
    const altitude = r6 * METER_SCALE_FACTOR;
  
    return [subsquareI, subsquareII, altitude ];
  }

function getLocatorNumber(locator, power){

    
    let powerValue = POWERS[power.toUpperCase()];

    const locatorNumber =
      getAlphabeticPos(locator[0]) * 18 * 10 * 10 * 19 +
      getAlphabeticPos(locator[1]) * 10 * 10 * 19 +
      parseInt(locator[2]) * 10 * 19 +
      parseInt(locator[3]) * 19 +
      powerValue;
  
    return locatorNumber;
}

function getTemperature(locator, power){
    const locatorNumber = getLocatorNumber(locator, power);
    const t1 = parseInt(locatorNumber / (40 * 42 * 2 * 2));
    const t2 = t1 * 2 + 457;
    const t3 = (5 * t2) / 1024;
    return 100 * (t3 - 2.73);
}

function getBattery(locator, power){
    const locatorNumber = getLocatorNumber(locator, power);
    const b1 = parseInt(locatorNumber / (40 * 42 * 2 * 2));
    const b2 = locatorNumber - b1 * (40 * 42 * 2 * 2);
    const b3 = parseInt(b2 / (42 * 2 * 2));
    const b4 = b3 * 10 + 614;
    return (5 * b4) / 1024;
}

function getSpeedGpsSats(locator, power){
    const locatorNumber = getLocatorNumber(locator, power);
    const s1 = parseInt(locatorNumber / (40 * 42 * 2 * 2));
    const s2 = locatorNumber - s1 * (40 * 42 * 2 * 2);
    const s3 = parseInt(s2 / (42 * 2 * 2));
    const s4 = s2 - s3 * 42 * 2 * 2;
    const s5 = parseInt(s4 / (2 * 2));
    const speed = s5 * 2;
    const gps1 = s4 - s5 * 2 * 2;
    const gps = parseInt(gps1 / 2);
    const sats = gps1 % 2;
    return [ speed, gps, sats ];
}