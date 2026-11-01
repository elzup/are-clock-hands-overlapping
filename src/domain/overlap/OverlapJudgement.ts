import type { Angle } from "../hand/Angle.js"
import type { ClockTime } from "../time/ClockTime.js"

type OverlapJudgementProps = {
  time: ClockTime
  hourHand: Angle
  minuteHand: Angle
  angleBetweenDegrees: number
  isOverlapping: boolean
}

/** 判定結果 (値オブジェクト)。なぜその結論になったかを角度で説明できる */
export class OverlapJudgement {
  private constructor(private readonly props: OverlapJudgementProps) {}

  static of(props: OverlapJudgementProps): OverlapJudgement {
    return new OverlapJudgement({ ...props })
  }

  get time(): ClockTime {
    return this.props.time
  }

  get hourHand(): Angle {
    return this.props.hourHand
  }

  get minuteHand(): Angle {
    return this.props.minuteHand
  }

  get angleBetweenDegrees(): number {
    return this.props.angleBetweenDegrees
  }

  get isOverlapping(): boolean {
    return this.props.isOverlapping
  }
}
