import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function parseStoredDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes("T")) {
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const sqliteMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (sqliteMatch) {
    const [, year, month, day, hour, minute, second] = sqliteMatch;
    const date = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second ?? 0),
      ),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isInCurrentMonth(createdAt: string, now = new Date()): boolean {
  const date = parseStoredDate(createdAt);
  if (!date) return false;

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function formatRelativeTime(createdAt: string, now = new Date()): string {
  const date = parseStoredDate(createdAt);
  if (!date) return createdAt;

  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR, now });
}

export function formatRelativeTimeFromDate(date: Date, now = new Date()): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR, now });
}
