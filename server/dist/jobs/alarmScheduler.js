import logger from '../logger.js';
import cbor from 'cbor';
import moment from 'moment-timezone';
import { executeFunction } from '../8sleep/deviceApi.js';
export const scheduleAlarm = (settingsData, side, day, dailySchedule) => {
    // Only proceed if power and alarm are both enabled
    if (!dailySchedule.power.enabled || !dailySchedule.alarm.enabled)
        return;
    // If there's no timezone configured, we can’t compute when to schedule
    if (!settingsData.timeZone)
        return;
    // Determine the current day in the correct timezone
    const now = moment.tz(settingsData.timeZone);
    const currentDay = now.format('dddd').toLowerCase();
    // We only schedule alarms for “today’s” schedule
    if (day !== currentDay) {
        return;
    }
    // If either side is in away mode, we schedule on both sides;
    // otherwise, we schedule only on the requested side.
    const anyAway = settingsData.left.awayMode || settingsData.right.awayMode;
    const sidesToSchedule = anyAway ? ['left', 'right'] : [side];
    logger.debug(`[scheduleAlarm] Sides to schedule: ${JSON.stringify(sidesToSchedule)}`);
    // Compute the base alarm moment (same for all sides)
    let alarmMoment = moment.tz(dailySchedule.alarm.time, 'HH:mm', settingsData.timeZone);
    // If that time for today has already passed, push it to tomorrow
    if (alarmMoment.isBefore(now)) {
        alarmMoment = alarmMoment.add(1, 'day');
        logger.debug(`[scheduleAlarm] Alarm time already passed, scheduling for tomorrow`);
    }
    // Loop through each side we need to schedule
    sidesToSchedule.forEach((scheduleSide) => {
        logger.debug(`[scheduleAlarm] Scheduling ${scheduleSide} alarm for ${scheduleSide} on ${day} (${JSON.stringify(dailySchedule)})`);
        logger.debug(`[scheduleAlarm] Alarm time will be: ${alarmMoment.format()}`);
        const alarmPayload = {
            pl: dailySchedule.alarm.vibrationIntensity,
            du: dailySchedule.alarm.duration,
            pi: dailySchedule.alarm.vibrationPattern,
            tt: alarmMoment.unix(),
        };
        const command = scheduleSide === 'left' ? 'ALARM_LEFT' : 'ALARM_RIGHT';
        const hexPayload = cbor.encode(alarmPayload).toString('hex');
        logger.debug(`[scheduleAlarm] Alarm Command: ${command} | Payload: ${JSON.stringify(alarmPayload)}`);
        executeFunction(command, hexPayload).then(() => {
            logger.info(`Scheduled ${scheduleSide} alarm for ${day} at ${dailySchedule.alarm.time} via device command`);
        });
    });
};
