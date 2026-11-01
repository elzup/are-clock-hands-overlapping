import type { ClockTime } from "../time/ClockTime.js"
import { Angle } from "./Angle.js"

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

export type HandPositions = {
  hourHand: Angle
  minuteHand: Angle
}

/** 時刻から各針の角度を求めるドメインサービス (秒針の連続運動を前提とする) */
export const calculateHandPositions = (time: ClockTime): HandPositions => {
  const hours = time.hour.onDial
  const minutes = time.minute.value
  const seconds = time.second.value

  return {
    hourHand: Angle.ofDegrees(
      hours * HOUR_HAND_DEG_PER_HOUR +
        minutes * HOUR_HAND_DEG_PER_MINUTE +
        seconds * HOUR_HAND_DEG_PER_SECOND
    ),
    minuteHand: Angle.ofDegrees(
      minutes * MINUTE_HAND_DEG_PER_MINUTE +
        seconds * MINUTE_HAND_DEG_PER_SECOND
    ),
  }
}
