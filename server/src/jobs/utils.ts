import { DayOfWeek, Side, Time } from '../db/schedulesSchema.js';
import logger from '../logger.js';

export const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export function getDayOfWeekIndex(day: DayOfWeek): number {
  return DAYS_OF_WEEK.indexOf(day);
}

export function getDayIndexForSchedule(scheduleDay: DayOfWeek, time: Time) {
  // always use the same‐day index (no wrap to next day)
  return getDayOfWeekIndex(scheduleDay);
}

export function logJob(message: string, side: Side, day: DayOfWeek, dayIndex: number, time: string) {
  const endDay = DAYS_OF_WEEK[dayIndex];
  const endHour = Number(time.split(':')[0]);
  const timeOfDay = endHour < 11 ? 'morning' : 'night';
  logger.debug(`${message} for ${side} side for ${day} -> ${endDay} -- ${endDay} ${timeOfDay} @ ${time}`);
}
