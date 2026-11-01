import type { Brand } from "../shared/brand.js"
import { assertFiniteNumber } from "../shared/domainError.js"

const FULL_TURN_DEGREES = 360
const HALF_TURN_DEGREES = 180

/** 12 時方向を 0° とし時計回りに測った角度 (°)。[0, 360) に正規化済み */
export type Angle = Brand<number, "Angle">

export const toAngle = (degrees: number): Angle => {
  assertFiniteNumber(degrees, "angle")
  return (((degrees % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) %
    FULL_TURN_DEGREES) as Angle
}

/** 2 つの角度がなす小さい方の角 (0-180°)。359° と 1° の差は 2° */
export const angleDistance = (a: Angle, b: Angle): number => {
  const diff = Math.abs(a - b)
  return diff > HALF_TURN_DEGREES ? FULL_TURN_DEGREES - diff : diff
}
