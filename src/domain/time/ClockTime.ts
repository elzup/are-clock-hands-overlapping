import { Hour } from "./Hour.js"
import { Minute } from "./Minute.js"
import { Second } from "./Second.js"

export type ClockTimeProps = {
  hour: number
  minute: number
  second?: number
}

/** アナログ時計が指し示す時刻 (値オブジェクト) */
export class ClockTime {
  private constructor(
    readonly hour: Hour,
    readonly minute: Minute,
    readonly second: Second
  ) {}

  static of({ hour, minute, second }: ClockTimeProps): ClockTime {
    return new ClockTime(
      Hour.of(hour),
      Minute.of(minute),
      second === undefined ? Second.zero() : Second.of(second)
    )
  }

  /** ローカルタイムゾーンでの時刻として解釈する (ミリ秒も秒の小数として保持) */
  static fromDate(date: Date): ClockTime {
    const MS_PER_SECOND = 1000
    return ClockTime.of({
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds() + date.getMilliseconds() / MS_PER_SECOND,
    })
  }

  equals(other: ClockTime): boolean {
    return (
      this.hour.equals(other.hour) &&
      this.minute.equals(other.minute) &&
      this.second.equals(other.second)
    )
  }
}
