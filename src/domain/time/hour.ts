import type { Brand } from "../shared/brand.js"
import { assertInRange, assertInteger } from "../shared/domainError.js"

const HOURS_PER_DAY = 24
const HOURS_PER_DIAL = 12

/** 時 (0-23) */
export type Hour = Brand<number, "Hour">

export const toHour = (value: number): Hour => {
  assertInteger(value, "hour")
  assertInRange(value, 0, HOURS_PER_DAY, "hour")
  return value as Hour
}

/** 文字盤上の位置 (0-11)。13 時と 1 時は針の位置が同じ */
export const hourOnDial = (hour: Hour): number => hour % HOURS_PER_DIAL
