import { assertFiniteNumber, assertInRange } from "../shared/DomainError.js"

const SECONDS_PER_MINUTE = 60

/**
 * 秒 (0 以上 60 未満)。
 * 針が厳密に重なる瞬間は 1:05:27.27... のように整数秒にならないため、小数を許容する。
 */
export class Second {
  private constructor(readonly value: number) {}

  static of(value: number): Second {
    assertFiniteNumber(value, "second")
    assertInRange(value, 0, SECONDS_PER_MINUTE, "second")
    return new Second(value)
  }

  static zero(): Second {
    return new Second(0)
  }

  equals(other: Second): boolean {
    return this.value === other.value
  }
}
