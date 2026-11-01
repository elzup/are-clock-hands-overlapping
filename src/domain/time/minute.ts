import type { Brand } from "../shared/brand.js"
import { assertInRange, assertInteger } from "../shared/domainError.js"

const MINUTES_PER_HOUR = 60

/** 分 (0-59) */
export type Minute = Brand<number, "Minute">

export const toMinute = (value: number): Minute => {
  assertInteger(value, "minute")
  assertInRange(value, 0, MINUTES_PER_HOUR, "minute")
  return value as Minute
}
