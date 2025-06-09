import logger from '../logger.js';
export const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export function getDayOfWeekIndex(day) {
    return DAYS_OF_WEEK.indexOf(day);
}
function getNextDayOfWeekIndex(day) {
    const dayIndex = getDayOfWeekIndex(day);
    if (dayIndex === 6)
        return 0;
    return dayIndex + 1;
}
function isEndTimeNextDay(endTime) {
    const endHour = Number(endTime.split(':')[0]);
    return endHour <= 12;
}
export function getDayIndexForSchedule(scheduleDay, time) {
    // always use the same‐day index (no wrap to next day)
    return DAYS_OF_WEEK.indexOf(scheduleDay);
}
export function logJob(message, side, day, dayIndex, time) {
    const endDay = DAYS_OF_WEEK[dayIndex];
    const endHour = Number(time.split(':')[0]);
    const timeOfDay = endHour < 11 ? 'morning' : 'night';
    logger.debug(`${message} for ${side} side for ${day} -> ${endDay} -- ${endDay} ${timeOfDay} @ ${time}`);
}
