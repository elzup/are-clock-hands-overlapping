import { RELATIVE_HAND_SPEED_DEG_PER_SECOND } from "../hand/HandPositionCalculator.js"
import { assertFiniteNumber, DomainError } from "../shared/DomainError.js"

/**
 * 「重なっている」とみなす針同士の角度差の許容値 (°)。
 *
 * 既定値は長針が短針に 0.5 秒で追いつく角度 (≈0.0458°)。
 * 厳密な重なりの瞬間は整数秒にならない (例 1:05:27.27...) ため許容 0 では整数秒入力が
 * 0:00:00 以外すべて false になる。半秒幅にすると「重なる瞬間に最も近い整数秒」だけが
 * 1 回の重なりにつきちょうど 1 つ true になる (12 時間で 11 回)。
 */
export class Tolerance {
  private constructor(readonly degrees: number) {}

  static readonly DEFAULT_DEGREES = RELATIVE_HAND_SPEED_DEG_PER_SECOND / 2

  static ofDegrees(degrees: number): Tolerance {
    assertFiniteNumber(degrees, "tolerance")
    if (degrees < 0) {
      throw new DomainError(`tolerance must be non-negative: ${degrees}`)
    }
    return new Tolerance(degrees)
  }

  /** 秒単位で指定する (長針が短針に何秒で追いつく角度までを許容するか) */
  static ofSeconds(seconds: number): Tolerance {
    assertFiniteNumber(seconds, "tolerance seconds")
    return Tolerance.ofDegrees(seconds * RELATIVE_HAND_SPEED_DEG_PER_SECOND)
  }

  static default(): Tolerance {
    return new Tolerance(Tolerance.DEFAULT_DEGREES)
  }
}
