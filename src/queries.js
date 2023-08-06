import { format }  from 'date-fns';

/**
 * @param {string} callsign
 * @param {number} slotId
 * @param {string} formatMask
 * @param {Date | null } lastUpdatedTime
 */
export function buildTelemetryQuery(callsign, slotId, formatMask, lastUpdatedTime){
    let lastUpdateString = ''
    slotId = slotId + 2
    if (lastUpdatedTime === null){
        lastUpdatedTime = new Date();
    }
    lastUpdateString = format(lastUpdatedTime, 'yyyy-MM-dd HH:mm:ss')
    console.log(lastUpdateString);
  return  encodeURIComponent(
    `
    SELECT * from
    (select tx_sign, tx_loc as tel_loc, rx_sign, time, power
    FROM wspr.rx
    WHERE tx_sign LIKE '${formatMask}'
    and cast(EXTRACT(minute FROM time) as varchar2) like '%${slotId}'
    and time >= '${lastUpdateString}'
    order by time desc limit 1) tele
    join (select time, DATE_ADD(time, INTERVAL ${slotId} MINUTE) tele_time, tx_loc FROM wspr.rx
    where tx_sign = '${callsign}'
    order by time desc
    limit 1) st
    on DATE_FORMAT(tele.time, 'YYYY-MM-DD HH24:MI') = DATE_FORMAT(st.tele_time, 'YYYY-MM-DD HH24:MI')
    order by time desc
    `
  );
}

