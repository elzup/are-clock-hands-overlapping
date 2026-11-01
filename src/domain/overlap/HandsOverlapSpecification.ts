import { calculateHandPositions } from "../hand/HandPositionCalculator.js"
import type { ClockTime } from "../time/ClockTime.js"
import { OverlapJudgement } from "./OverlapJudgement.js"
import type { Tolerance } from "./Tolerance.js"

// 浮動小数の丸め誤差 (例 30 * 1 + 0.5 * 5 + ...) で境界ちょうどの値が落ちるのを防ぐ
const FLOAT_EPSILON_DEGREES = 1e-9

/** 仕様 (Specification パターン):「長針と短針が許容範囲内で重なっている」 */
export class HandsOverlapSpecification {
  constructor(private readonly tolerance: Tolerance) {}

  judge(time: ClockTime): OverlapJudgement {
    const { hourHand, minuteHand } = calculateHandPositions(time)
    const angleBetween = hourHand.distanceTo(minuteHand)
    const isOverlapping =
      angleBetween <= this.tolerance.degrees + FLOAT_EPSILON_DEGREES

    return OverlapJudgement.of({
      time,
      hourHand,
      minuteHand,
      angleBetweenDegrees: angleBetween,
      isOverlapping,
    })
  }

  isSatisfiedBy(time: ClockTime): boolean {
    return this.judge(time).isOverlapping
  }
}
