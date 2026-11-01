import { HandsOverlapSpecification } from "../domain/overlap/HandsOverlapSpecification.js"
import { Tolerance } from "../domain/overlap/Tolerance.js"
import { ClockTime, type ClockTimeProps } from "../domain/time/ClockTime.js"

export type TimeInput = ClockTimeProps | Date

export type JudgeOptions = {
  /** 許容する角度差 (°)。toleranceSeconds と同時指定はできない */
  toleranceDegrees?: number
  /** 許容する時間差 (秒)。長針が短針に追いつく速さで角度に換算する */
  toleranceSeconds?: number
}

/** 外部に返す DTO。ドメインオブジェクトを漏らさずプリミティブだけにする */
export type OverlapResult = {
  isOverlapping: boolean
  hourHandDegrees: number
  minuteHandDegrees: number
  angleBetweenDegrees: number
}

const toClockTime = (input: TimeInput): ClockTime =>
  input instanceof Date ? ClockTime.fromDate(input) : ClockTime.of(input)

const toTolerance = (options: JudgeOptions): Tolerance => {
  const { toleranceDegrees, toleranceSeconds } = options
  if (toleranceDegrees !== undefined && toleranceSeconds !== undefined) {
    throw new TypeError(
      "toleranceDegrees and toleranceSeconds cannot be specified together"
    )
  }
  if (toleranceDegrees !== undefined)
    return Tolerance.ofDegrees(toleranceDegrees)
  if (toleranceSeconds !== undefined)
    return Tolerance.ofSeconds(toleranceSeconds)
  return Tolerance.default()
}

/** ユースケース: 時刻を受け取り、長針と短針の重なりを判定する */
export const judgeHandsOverlap = (
  input: TimeInput,
  options: JudgeOptions = {}
): OverlapResult => {
  const judgement = new HandsOverlapSpecification(toTolerance(options)).judge(
    toClockTime(input)
  )

  return {
    isOverlapping: judgement.isOverlapping,
    hourHandDegrees: judgement.hourHand.degrees,
    minuteHandDegrees: judgement.minuteHand.degrees,
    angleBetweenDegrees: judgement.angleBetweenDegrees,
  }
}

/** 長針と短針が重なっているかだけを返すショートハンド */
export const areClockHandsOverlapping = (
  input: TimeInput,
  options: JudgeOptions = {}
): boolean => judgeHandsOverlap(input, options).isOverlapping
