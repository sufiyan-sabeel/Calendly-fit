import {
  format, formatDistanceToNow, parseISO, differenceInMinutes,
  addMinutes, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, isToday, isTomorrow, isPast, isFuture,
  areIntervalsOverlapping, setHours, setMinutes, getHours, getMinutes,
  eachDayOfInterval,
} from 'date-fns';

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}
export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, MMM d');
}
export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy h:mm a');
}
export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}
export function formatTimeSlot(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}
export function getDurationMinutes(startTime: string, endTime: string): number {
  return differenceInMinutes(parseISO(endTime), parseISO(startTime));
}
export function getDurationHours(startTime: string, endTime: string): string {
  const mins = getDurationMinutes(startTime, endTime);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
export { isToday, isTomorrow, isPast, isFuture };
export function doSlotsOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return areIntervalsOverlapping(
    { start: parseISO(s1), end: parseISO(e1) },
    { start: parseISO(s2), end: parseISO(e2) }
  );
}
export function generateTimeSlots(date: string, startHour: number, endHour: number, slotMin = 30): string[] {
  const slots: string[] = [];
  let cur = setHours(setMinutes(parseISO(date), 0), startHour);
  const end = setHours(setMinutes(parseISO(date), 0), endHour);
  while (cur < end) { slots.push(cur.toISOString()); cur = addMinutes(cur, slotMin); }
  return slots;
}
export function getWeekDays(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) });
}
export function getMonthDays(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
}
export function addBufferTime(startTime: string, endTime: string, bufferMin: number) {
  return {
    bufferedStart: addMinutes(parseISO(startTime), -bufferMin).toISOString(),
    bufferedEnd: addMinutes(parseISO(endTime), bufferMin).toISOString(),
  };
}
export function getTodayRange() {
  const n = new Date();
  return { start: startOfDay(n).toISOString(), end: endOfDay(n).toISOString() };
}
export function getWeekRange() {
  const n = new Date();
  return { start: startOfWeek(n, { weekStartsOn: 1 }).toISOString(), end: endOfWeek(n, { weekStartsOn: 1 }).toISOString() };
}
export function getMonthRange() {
  const n = new Date();
  return { start: startOfMonth(n).toISOString(), end: endOfMonth(n).toISOString() };
}
