import { judgeOverlap } from "../domain/overlap/judgeOverlap.js"
import {
  DEFAULT_TOLERANCE,
  type Tolerance,
  toleranceFromDegrees,
  toleranceFromSeconds,
} from "../domain/overlap/tolerance.js"
import { type TimeInput, toClockTime } from "./timeInput.js"

export interface JudgeOptions {
  /** 許容する角度差 (°)。toleranceSeconds と同時指定はできない */
  toleranceDegrees?: number
  /** 許容する時間差 (秒)。長針が短針に追いつく速さで角度に換算する */
  toleranceSeconds?: number
}

/** 外部に返す DTO。ドメインオブジェクトを漏らさずプリミティブだけにする */
export interface OverlapResult {
  isOverlapping: boolean
  time: { hour: number; minute: number; second: number }
  hourHandDegrees: number
  minuteHandDegrees: number
  angleBetweenDegrees: number
}

const toTolerance = (options: JudgeOptions): Tolerance => {
  const { toleranceDegrees, toleranceSeconds } = options
  if (toleranceDegrees !== undefined && toleranceSeconds !== undefined) {
    throw new TypeError(
      "toleranceDegrees and toleranceSeconds cannot be specified together"
    )
  }
  if (toleranceDegrees !== undefined)
    return toleranceFromDegrees(toleranceDegrees)
  if (toleranceSeconds !== undefined)
    return toleranceFromSeconds(toleranceSeconds)
  return DEFAULT_TOLERANCE
}

/**
 * ユースケース: 時刻を受け取り、長針と短針の重なりを判定する。
 * 時刻を省略すると現在時刻 (ローカルタイムゾーン) で判定する。
 */
export const judgeHandsOverlap = (
  input: TimeInput = new Date(),
  options: JudgeOptions = {}
): OverlapResult => {
  const { time, hourHand, minuteHand, angleBetweenDegrees, isOverlapping } =
    judgeOverlap(toClockTime(input), toTolerance(options))

  // branded type は実行時には素の number なので、そのまま DTO に載せられる
  return {
    isOverlapping,
    time: { hour: time.hour, minute: time.minute, second: time.second },
    hourHandDegrees: hourHand,
    minuteHandDegrees: minuteHand,
    angleBetweenDegrees,
  }
}

/** 長針と短針が重なっているかだけを返すショートハンド。時刻省略時は現在時刻 */
export const areClockHandsOverlapping = (
  input: TimeInput = new Date(),
  options: JudgeOptions = {}
): boolean => judgeHandsOverlap(input, options).isOverlapping
