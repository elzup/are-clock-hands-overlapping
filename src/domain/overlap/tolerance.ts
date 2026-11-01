import { RELATIVE_HAND_SPEED_DEG_PER_SECOND } from "../hand/handPositions.js"
import type { Brand } from "../shared/brand.js"
import { assertFiniteNumber, DomainError } from "../shared/domainError.js"

/** 「重なっている」とみなす針同士の角度差の許容値 (°) */
export type Tolerance = Brand<number, "Tolerance">

export const toleranceFromDegrees = (degrees: number): Tolerance => {
  assertFiniteNumber(degrees, "tolerance")
  if (degrees < 0) {
    throw new DomainError(`tolerance must be non-negative: ${degrees}`)
  }
  return degrees as Tolerance
}

/** 秒単位で指定する (長針が短針に何秒で追いつく角度までを許容するか) */
export const toleranceFromSeconds = (seconds: number): Tolerance => {
  assertFiniteNumber(seconds, "tolerance seconds")
  return toleranceFromDegrees(seconds * RELATIVE_HAND_SPEED_DEG_PER_SECOND)
}

/**
 * 既定値は長針が短針に 0.5 秒で追いつく角度 (≈0.0458°)。
 * 厳密な重なりの瞬間は整数秒にならない (例 1:05:27.27...) ため許容 0 では整数秒入力が
 * 0:00:00 以外すべて false になる。半秒幅にすると「重なる瞬間に最も近い整数秒」だけが
 * 1 回の重なりにつきちょうど 1 つ true になる (12 時間で 11 回)。
 */
export const DEFAULT_TOLERANCE: Tolerance = toleranceFromSeconds(0.5)
