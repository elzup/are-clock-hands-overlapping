import { assertInRange, assertInteger } from "../shared/DomainError.js"

const HOURS_PER_DAY = 24
const HOURS_PER_DIAL = 12

/** 時 (0-23)。アナログ時計の文字盤上では 12 時間周期として扱う */
export class Hour {
  private constructor(readonly value: number) {}

  static of(value: number): Hour {
    assertInteger(value, "hour")
    assertInRange(value, 0, HOURS_PER_DAY, "hour")
    return new Hour(value)
  }

  /** 文字盤上の位置 (0-11)。13 時と 1 時は針の位置が同じ */
  get onDial(): number {
    return this.value % HOURS_PER_DIAL
  }

  equals(other: Hour): boolean {
    return this.value === other.value
  }
}
