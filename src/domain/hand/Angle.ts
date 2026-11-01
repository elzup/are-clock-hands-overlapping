import { assertFiniteNumber } from "../shared/DomainError.js"

const FULL_TURN_DEGREES = 360
const HALF_TURN_DEGREES = 180

/** 12 時方向を 0° とし時計回りに測った角度。[0, 360) に正規化して保持する */
export class Angle {
  private constructor(readonly degrees: number) {}

  static ofDegrees(degrees: number): Angle {
    assertFiniteNumber(degrees, "angle")
    const normalized =
      ((degrees % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES
    return new Angle(normalized)
  }

  /** 2 つの角度がなす小さい方の角 (0-180°)。359° と 1° の差は 2° */
  distanceTo(other: Angle): number {
    const diff = Math.abs(this.degrees - other.degrees)
    return diff > HALF_TURN_DEGREES ? FULL_TURN_DEGREES - diff : diff
  }
}
