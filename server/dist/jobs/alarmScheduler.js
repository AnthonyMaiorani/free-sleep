import logger from '../logger.js';
import cbor from 'cbor';
import moment from 'moment-timezone';
import { executeFunction } from '../8sleep/deviceApi.js';

export const scheduleAlarm = (settingsData, side, day, dailySchedule) => {
    if (!dailySchedule.power.enabled || !dailySchedule.alarm.enabled) return;
    if (!settingsData.timeZone) return;

    const leftAway = settingsData.left.awayMode;
    const rightAway = settingsData.right.awayMode;

    // If both sides are in away mode, don’t schedule anything
    if (leftAway && rightAway) return;

    // If one side is away, schedule for both; otherwise schedule for the specified side
    const sidesToSchedule = (leftAway || rightAway) ? ['left', 'right'] : [side];

    // Get current time in the correct timezone
    const now = moment.tz(settingsData.timeZone);
    const currentDay = now.format('dddd').toLowerCase();

    // Only schedule if this is today's schedule
    if (day !== currentDay) return;

    // Create the target alarm time for today
    const alarmMoment = moment.tz(dailySchedule.alarm.time, 'HH:mm', settingsData.timeZone);

    // If the alarm time has passed for today, schedule it for tomorrow
    if (alarmMoment.isBefore(now)) {
        alarmMoment.add(1, 'day');
        logger.debug(`[scheduleAlarm] Alarm time already passed, scheduling for tomorrow`);
    }

    sidesToSchedule.forEach((schedSide) => {
        logger.debug(
            `[scheduleAlarm] Scheduling ${schedSide} alarm for ${schedSide} on ${day} (${JSON.stringify(dailySchedule)})`
        );
        logger.debug(`[scheduleAlarm] Alarm time will be: ${alarmMoment.format()}`);
        const alarmPayload = {
            pl: dailySchedule.alarm.vibrationIntensity,
            du: dailySchedule.alarm.duration,
            pi: dailySchedule.alarm.vibrationPattern,
            tt: alarmMoment.unix(), // Future timestamp instead of current time
        };
        const command = schedSide === 'left' ? 'ALARM_LEFT' : 'ALARM_RIGHT';
        const hexPayload = cbor.encode(alarmPayload).toString('hex');
        logger.debug(`[scheduleAlarm] Alarm Command: ${command} | Payload: ${JSON.stringify(alarmPayload)}`);

        // Immediate command execution with future timestamp
        executeFunction(command, hexPayload).then(() => {
            logger.info(
                `Scheduled ${schedSide} alarm for ${day} at ${dailySchedule.alarm.time} via device command`
            );
        });
    });
};
