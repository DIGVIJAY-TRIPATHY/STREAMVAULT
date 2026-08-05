import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Formats a date as a relative time string, e.g. "3 days ago".
 * Falls back to an empty string when the date is missing/invalid.
 */
export function formatRelativeDate(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) return "";

  return parsed.fromNow();
}

/**
 * Formats a date as a readable calendar date, e.g. "Jul 29, 2026".
 */
export function formatDate(date, format = "MMM D, YYYY") {
  if (!date) return "N/A";

  const parsed = dayjs(date);

  if (!parsed.isValid()) return "N/A";

  return parsed.format(format);
}

/**
 * Formats a duration given in seconds as `m:ss` or `h:mm:ss`.
 */
export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

/**
 * Formats a raw view/subscriber count into a compact string, e.g. 12_400 -> "12.4K".
 */
export function formatCount(count) {
  const value = Number(count) || 0;

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
