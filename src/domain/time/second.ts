import type { Brand } from "../shared/brand.js"
import { assertFiniteNumber, assertInRange } from "../shared/domainError.js"

const SECONDS_PER_MINUTE = 60

/**
 * 秒 (0 以上 60 未満)。
 * 針が厳密に重なる瞬間は 1:05:27.27... のように整数秒にならないため、小数を許容する。
 */
export type Second = Brand<number, "Second">

export const toSecond = (value: number): Second => {
  assertFiniteNumber(value, "second")
  assertInRange(value, 0, SECONDS_PER_MINUTE, "second")
  return value as Second
}
