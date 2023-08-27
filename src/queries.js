import { format } from 'date-fns';
import { createTelemetry } from './models/telemetry';
import { decodeTelemetry } from './U4B';
import { balloonTelemetry } from './stores';




/**
 * @param {string} callsign
 * @param {number} slotId
 * @param {string} formatMask
 * @param {Date | null } lastUpdatedTime
 * @param {boolean } limitQuery
 */
export function buildTelemetryQuery(callsign, slotId, formatMask, lastUpdatedTime, limitQuery = true) {
    let lastUpdateString = ''
    let telemetrySlotId = slotId === 8 ? 0 : slotId + 2;
    if (lastUpdatedTime === null) {
        lastUpdatedTime = new Date();
    }
    else {
        lastUpdatedTime = new Date(lastUpdatedTime)
    }
    lastUpdateString = format(lastUpdatedTime, 'yyyy-MM-dd HH:mm:ss')
    let url = encodeURIComponent(
        `WITH standardWspr AS (
            SELECT tx_sign, tx_loc, rx_sign, time, DATE_ADD(time, INTERVAL 2 MINUTE) time_tel, power,
                   ROW_NUMBER() OVER (PARTITION BY time ORDER BY time DESC) AS row_num
            FROM wspr.rx
            WHERE tx_sign = '${callsign}'
            AND CAST(EXTRACT(minute FROM time) AS VARCHAR2) LIKE '%${slotId}'
            AND time >= '${lastUpdateString}'
        ),
        telemetryWspr AS (
            SELECT tx_sign, tx_loc AS tel_loc, rx_sign, time, power,
                   ROW_NUMBER() OVER (PARTITION BY time ORDER BY time DESC) AS row_num
            FROM wspr.rx
            WHERE tx_sign LIKE '${formatMask}%'
            AND CAST(EXTRACT(minute FROM time) AS VARCHAR2) LIKE '%${telemetrySlotId}'
            AND time >= '${lastUpdateString}'
        )
        SELECT t1.tx_sign as standard_tx_sign, 
        t2.tx_sign as telemetry_tx_sign, 
        t1.tx_loc as standard_tx_loc, 
        t2.tel_loc AS telemetry_tx_loc, 
        t1.rx_sign as standard_rx_sign, 
        t2.rx_sign as telemetry_rx_sign, 
        t1.time as standard_time,
        t2.time as telemetry_time, 
        t1.power as standard_power, 
        t2.power as telemetry_power
        FROM (
            SELECT tx_sign, tx_loc, rx_sign, time, power, time_tel,
                   ROW_NUMBER() OVER (PARTITION BY time_tel ORDER BY time DESC) AS row_num
            FROM standardWspr
        ) AS t1
        JOIN (
            SELECT tx_sign, tel_loc, rx_sign, time, power,
                   ROW_NUMBER() OVER (PARTITION BY time ORDER BY time DESC) AS row_num
            FROM telemetryWspr
        ) AS t2
        ON t1.time_tel = t2.time AND t1.row_num = 1 AND t2.row_num = 1
        ORDER BY t1.time DESC
    `
    );
    if (limitQuery) {
        url = url + ' limit 1'
    }
    return url
}


/**
 * @type {Array<import('./models/telemetry').Telemetry>}
 */
let latestBalloonTelemetry;
balloonTelemetry.subscribe((value) => {
    latestBalloonTelemetry = value;
});

/**
 * @param {import('./models/BalloonConfigFormData').BalloonConfigFormData} configData
 * @param {boolean } isLimitedQuery
 */
export async function getTelemetryData(configData, isLimitedQuery = false) {
    if (latestBalloonTelemetry.length > 0) {
        configData.startDate = latestBalloonTelemetry[latestBalloonTelemetry.length - 1].lastUpdated ?? new Date();
    }
    let url = `https://db1.wspr.live/?query=${buildTelemetryQuery(
        configData.callsign,
        configData.slotId,
        configData.telCallFormat,
        configData.startDate,
        isLimitedQuery
    )}+FORMAT+JSON`;
    const res = await fetch(url);
    const json = await res.json();
    if (res.ok) {
        if (json.data.length > 0) {
            json.data.forEach(
                (/** @type {import("./models/wsprLiveData").WsprLiveData} */ record) => {
                    let newTelemetry = createTelemetry();
                    let decodedTelemetry = decodeTelemetry(record);
                    newTelemetry.telemetryCallsign = record.telemetry_tx_sign;
                    newTelemetry.temperature = decodedTelemetry.temperature;
                    newTelemetry.altitude = decodedTelemetry.altitude;
                    newTelemetry.battery = decodedTelemetry.battery;
                    newTelemetry.speed = decodedTelemetry.speed;
                    newTelemetry.gpsStatus = decodedTelemetry.gpsStatus;
                    newTelemetry.satsStatus = decodedTelemetry.satsStatus;
                    newTelemetry.gridSquare = record.standard_tx_loc + decodedTelemetry.telemetrySubsquare;
                    newTelemetry.lastReportedBy = decodedTelemetry.lastReportedBy;
                    newTelemetry.lastUpdated = decodedTelemetry.lastUpdated;

                    let lastTelemetryTime = latestBalloonTelemetry[0]?.lastUpdated;
                    if (!isLimitedQuery) {
                        balloonTelemetry.update((telemetry) => [...telemetry, newTelemetry]);
                    }
                    else if(lastTelemetryTime != null && lastTelemetryTime < newTelemetry.lastUpdated){
                        balloonTelemetry.update((telemetry) => [...telemetry, newTelemetry]);
                    }
                }


            );
        }
    }
}



