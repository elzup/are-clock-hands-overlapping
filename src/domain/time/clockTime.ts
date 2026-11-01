import { type Hour, toHour } from "./hour.js"
import { type Minute, toMinute } from "./minute.js"
import { type Second, toSecond } from "./second.js"

export interface ClockTimeProps {
  hour: number
  minute: number
  second?: number
}

/** アナログ時計が指し示す時刻 (検証済み) */
export interface ClockTime {
  readonly hour: Hour
  readonly minute: Minute
  readonly second: Second
}

const MS_PER_SECOND = 1000

export const createClockTime = ({
  hour,
  minute,
  second = 0,
}: ClockTimeProps): ClockTime => ({
  hour: toHour(hour),
  minute: toMinute(minute),
  second: toSecond(second),
})

/** ローカルタイムゾーンでの時刻として解釈する (ミリ秒も秒の小数として保持) */
export const clockTimeFromDate = (date: Date): ClockTime =>
  createClockTime({
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds() + date.getMilliseconds() / MS_PER_SECOND,
  })

export const isSameClockTime = (a: ClockTime, b: ClockTime): boolean =>
  a.hour === b.hour && a.minute === b.minute && a.second === b.second
