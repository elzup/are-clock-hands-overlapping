import { ClockTime, type ClockTimeProps } from "../domain/time/ClockTime.js"

/**
 * Temporal.PlainTime / PlainDateTime / ZonedDateTime と同じ形。
 * Temporal の型定義は TS の lib に未収録の環境があるため、構造で受ける。
 */
export type TemporalTimeLike = {
  readonly hour: number
  readonly minute: number
  readonly second: number
  readonly millisecond: number
  readonly microsecond: number
  readonly nanosecond: number
}

/** Temporal.Instant と同じ形 (ローカルタイムゾーンで解釈する) */
export type TemporalInstantLike = {
  readonly epochMilliseconds: number
}

export type TimeInput =
  | ClockTimeProps
  | Date
  | TemporalTimeLike
  | TemporalInstantLike

const MS_PER_SECOND = 1e3
const US_PER_SECOND = 1e6
const NS_PER_SECOND = 1e9

const isTemporalTimeLike = (input: TimeInput): input is TemporalTimeLike =>
  "hour" in input && typeof (input as TemporalTimeLike).nanosecond === "number"

const isTemporalInstantLike = (
  input: TimeInput
): input is TemporalInstantLike =>
  !("hour" in input) &&
  typeof (input as TemporalInstantLike).epochMilliseconds === "number"

// Temporal の値はプロトタイプ上の getter なので spread では値が取れない。明示的に読む
const fromTemporalTime = (time: TemporalTimeLike): ClockTime =>
  ClockTime.of({
    hour: time.hour,
    minute: time.minute,
    second:
      time.second +
      time.millisecond / MS_PER_SECOND +
      time.microsecond / US_PER_SECOND +
      time.nanosecond / NS_PER_SECOND,
  })

export const toClockTime = (input: TimeInput): ClockTime => {
  if (input instanceof Date) return ClockTime.fromDate(input)
  if (isTemporalTimeLike(input)) return fromTemporalTime(input)
  if (isTemporalInstantLike(input)) {
    return ClockTime.fromDate(new Date(input.epochMilliseconds))
  }
  return ClockTime.of(input)
}
