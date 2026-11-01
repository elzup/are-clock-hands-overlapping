import type { ClockTime } from "../time/clockTime.js"
import { hourOnDial } from "../time/hour.js"
import { type Angle, toAngle } from "./angle.js"

// 短針: 12 時間で 360° → 1 時間 30°、1 分 0.5°、1 秒 1/120°
const HOUR_HAND_DEG_PER_HOUR = 30
const HOUR_HAND_DEG_PER_MINUTE = 0.5
const HOUR_HAND_DEG_PER_SECOND = HOUR_HAND_DEG_PER_MINUTE / 60

// 長針: 60 分で 360° → 1 分 6°、1 秒 0.1°
const MINUTE_HAND_DEG_PER_MINUTE = 6
const MINUTE_HAND_DEG_PER_SECOND = MINUTE_HAND_DEG_PER_MINUTE / 60

/** 長針が短針に追いつく相対角速度 (°/秒) */
export const RELATIVE_HAND_SPEED_DEG_PER_SECOND =
  MINUTE_HAND_DEG_PER_SECOND - HOUR_HAND_DEG_PER_SECOND

export interface HandPositions {
  readonly hourHand: Angle
  readonly minuteHand: Angle
}

/** 時刻から各針の角度を求める (秒針の連続運動を前提とする) */
export const calculateHandPositions = ({
  hour,
  minute,
  second,
}: ClockTime): HandPositions => ({
  hourHand: toAngle(
    hourOnDial(hour) * HOUR_HAND_DEG_PER_HOUR +
      minute * HOUR_HAND_DEG_PER_MINUTE +
      second * HOUR_HAND_DEG_PER_SECOND
  ),
  minuteHand: toAngle(
    minute * MINUTE_HAND_DEG_PER_MINUTE + second * MINUTE_HAND_DEG_PER_SECOND
  ),
})
