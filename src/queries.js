import { format } from 'date-fns';

/**
 * @param {string} callsign
 * @param {number} slotId
 * @param {string} formatMask
 * @param {Date | null } lastUpdatedTime
 */
export function buildTelemetryQuery(callsign, slotId, formatMask, lastUpdatedTime) {
    let lastUpdateString = ''
    let telemetrySlotId = slotId === 8 ? 0 : slotId + 2;
    if (lastUpdatedTime === null) {
        lastUpdatedTime = new Date();
    }
    else {
        lastUpdatedTime = new Date(lastUpdatedTime)
    }
    lastUpdateString = format(lastUpdatedTime, 'yyyy-MM-dd HH:mm:ss')
    console.log(lastUpdateString);
    return encodeURIComponent(
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
            WHERE tx_sign LIKE '${formatMask}'
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
        ORDER BY t1.time DESC limit 1
    `
    );
}
