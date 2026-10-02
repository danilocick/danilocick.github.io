import type { Locale, YearMonth } from '../content/types'

const cache = new Map<string, Intl.DateTimeFormat>()

/** "sept 2021" / "set. 2021" / "Sep 2021" — month short + year, via Intl (UTC, so SSR and client agree). */
export function formatMonth(locale: Locale, ym: YearMonth): string {
  const [y, m] = ym.split('-').map(Number)
  let fmt = cache.get(locale)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    cache.set(locale, fmt)
  }
  return fmt.format(new Date(Date.UTC(y, m - 1, 1)))
}

/** Value for <time datetime>: "2021-09". */
export function isoMonth(ym: YearMonth): string {
  return ym
}
