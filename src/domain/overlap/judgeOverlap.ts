import type { Angle } from "../hand/angle.js"
import { angleDistance } from "../hand/angle.js"
import { calculateHandPositions } from "../hand/handPositions.js"
import type { ClockTime } from "../time/clockTime.js"
import type { Tolerance } from "./tolerance.js"

// 浮動小数の丸め誤差 (例 30 * 1 + 0.5 * 5 + ...) で境界ちょうどの値が落ちるのを防ぐ
const FLOAT_EPSILON_DEGREES = 1e-9

/** 判定結果。なぜその結論になったかを角度で説明できる */
export interface OverlapJudgement {
  readonly time: ClockTime
  readonly hourHand: Angle
  readonly minuteHand: Angle
  readonly angleBetweenDegrees: number
  readonly isOverlapping: boolean
}

/** 長針と短針が許容範囲内で重なっているかを判定する */
export const judgeOverlap = (
  time: ClockTime,
  tolerance: Tolerance
): OverlapJudgement => {
  const { hourHand, minuteHand } = calculateHandPositions(time)
  const angleBetweenDegrees = angleDistance(hourHand, minuteHand)

  return {
    time,
    hourHand,
    minuteHand,
    angleBetweenDegrees,
    isOverlapping: angleBetweenDegrees <= tolerance + FLOAT_EPSILON_DEGREES,
  }
}
