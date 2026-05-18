import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, parseISO, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd.MM.yyyy', { locale: tr });
}

export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM yyyy', { locale: tr });
}

export type DateRange = { start: Date; end: Date };

export function getDateRange(period: 'week' | 'month' | 'year' | 'all'): DateRange {
  const now = new Date();
  switch (period) {
    case 'week':
      return { start: startOfWeek(now, { locale: tr }), end: endOfWeek(now, { locale: tr }) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'all':
      return { start: new Date(0), end: new Date(9999, 0) };
  }
}

export function isInRange(date: string, range: DateRange): boolean {
  const d = parseISO(date);
  return isWithinInterval(d, range);
}
