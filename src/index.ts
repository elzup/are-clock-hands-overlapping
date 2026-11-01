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
export { Angle } from "./domain/hand/Angle.js"
export {
  calculateHandPositions,
  type HandPositions,
  RELATIVE_HAND_SPEED_DEG_PER_SECOND,
} from "./domain/hand/HandPositionCalculator.js"
export { HandsOverlapSpecification } from "./domain/overlap/HandsOverlapSpecification.js"
export { OverlapJudgement } from "./domain/overlap/OverlapJudgement.js"
export { Tolerance } from "./domain/overlap/Tolerance.js"
export { DomainError } from "./domain/shared/DomainError.js"
export { ClockTime, type ClockTimeProps } from "./domain/time/ClockTime.js"
export { Hour } from "./domain/time/Hour.js"
export { Minute } from "./domain/time/Minute.js"
export { Second } from "./domain/time/Second.js"
