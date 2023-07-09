import { intlFormatDistance } from "date-fns";

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 * 
 * Source: https://www.builder.io/blog/relative-time
 */
export function getRelativeTimeString(leftDate: Date, rightDate: Date) {
    return intlFormatDistance(leftDate, rightDate)
  }

  export function formatDate(date: Date) {
    return date.toISOString()
  }