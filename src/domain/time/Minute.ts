import { assertInRange, assertInteger } from "../shared/DomainError.js"

const MINUTES_PER_HOUR = 60

/** 分 (0-59) */
export class Minute {
  private constructor(readonly value: number) {}

  static of(value: number): Minute {
    assertInteger(value, "minute")
    assertInRange(value, 0, MINUTES_PER_HOUR, "minute")
    return new Minute(value)
  }

  equals(other: Minute): boolean {
    return this.value === other.value
  }
}
