// application layer (通常はここだけ使えば足りる)
export {
  areClockHandsOverlapping,
  type JudgeOptions,
  judgeHandsOverlap,
  type OverlapResult,
} from "./application/judgeHandsOverlap.js"
export type {
  TemporalInstantLike,
  TemporalTimeLike,
  TimeInput,
} from "./application/timeInput.js"

// domain layer (独自のユースケースを組みたい人向け)
export { type Angle, angleDistance, toAngle } from "./domain/hand/angle.js"
export {
  calculateHandPositions,
  type HandPositions,
  RELATIVE_HAND_SPEED_DEG_PER_SECOND,
} from "./domain/hand/handPositions.js"
export {
  judgeOverlap,
  type OverlapJudgement,
} from "./domain/overlap/judgeOverlap.js"
export {
  DEFAULT_TOLERANCE,
  type Tolerance,
  toleranceFromDegrees,
  toleranceFromSeconds,
} from "./domain/overlap/tolerance.js"
export type { Brand } from "./domain/shared/brand.js"
export { DomainError } from "./domain/shared/domainError.js"
export {
  type ClockTime,
  type ClockTimeProps,
  clockTimeFromDate,
  createClockTime,
  isSameClockTime,
} from "./domain/time/clockTime.js"
export { type Hour, hourOnDial, toHour } from "./domain/time/hour.js"
export { type Minute, toMinute } from "./domain/time/minute.js"
export { type Second, toSecond } from "./domain/time/second.js"
