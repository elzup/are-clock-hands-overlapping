import { describe, expect, it } from "vitest"
import {
  angleDistance,
  clockTimeFromDate,
  createClockTime,
  DEFAULT_TOLERANCE,
  DomainError,
  hourOnDial,
  isSameClockTime,
  judgeOverlap,
  toAngle,
  toHour,
  toleranceFromDegrees,
  toleranceFromSeconds,
  toMinute,
  toSecond,
} from "../../index.js"

describe("時刻", () => {
  it.each([[-1], [24], [1.5], [Number.NaN]])("toHour(%d) は不正", (value) => {
    expect(() => toHour(value)).toThrow(DomainError)
  })

  it.each([[-1], [60], [0.5]])("toMinute(%d) は不正", (value) => {
    expect(() => toMinute(value)).toThrow(DomainError)
  })

  it.each([
    [-0.1],
    [60],
    [Number.POSITIVE_INFINITY],
  ])("toSecond(%d) は不正", (value) => {
    expect(() => toSecond(value)).toThrow(DomainError)
  })

  it("13 時の文字盤位置は 1", () => {
    expect(hourOnDial(toHour(13))).toBe(1)
  })

  it("ClockTime は値で等価判定する", () => {
    const a = createClockTime({ hour: 1, minute: 2, second: 3 })
    const b = createClockTime({ hour: 1, minute: 2, second: 3 })
    const c = createClockTime({ hour: 1, minute: 2 })
    expect(isSameClockTime(a, b)).toBe(true)
    expect(isSameClockTime(a, c)).toBe(false)
  })

  it("ClockTime は素のオブジェクトなので JSON 化・structuredClone できる", () => {
    const time = createClockTime({ hour: 1, minute: 2, second: 3 })
    expect(JSON.parse(JSON.stringify(time))).toEqual({
      hour: 1,
      minute: 2,
      second: 3,
    })
    expect(structuredClone(time)).toEqual(time)
  })

  it("clockTimeFromDate はミリ秒を秒の小数にする", () => {
    const time = clockTimeFromDate(new Date(2026, 0, 1, 1, 5, 27, 500))
    expect(time.second).toBe(27.5)
  })
})

describe("Angle", () => {
  it("[0, 360) に正規化する", () => {
    expect(toAngle(360)).toBe(0)
    expect(toAngle(-90)).toBe(270)
    expect(toAngle(725)).toBe(5)
  })

  it("0° をまたぐ差は小さい方", () => {
    expect(angleDistance(toAngle(359), toAngle(1))).toBe(2)
  })

  it("NaN は不正", () => {
    expect(() => toAngle(Number.NaN)).toThrow(DomainError)
  })
})

describe("Tolerance", () => {
  it("負の値は不正", () => {
    expect(() => toleranceFromDegrees(-1)).toThrow(DomainError)
    expect(() => toleranceFromSeconds(-1)).toThrow(DomainError)
  })

  it("既定値は 0.5 秒ぶんの相対角度", () => {
    expect(DEFAULT_TOLERANCE).toBeCloseTo(toleranceFromSeconds(0.5))
  })
})

describe("judgeOverlap", () => {
  it("判定理由を角度で説明できる", () => {
    const judgement = judgeOverlap(
      createClockTime({ hour: 6, minute: 0 }),
      DEFAULT_TOLERANCE
    )
    expect(judgement.isOverlapping).toBe(false)
    expect(judgement.angleBetweenDegrees).toBe(180)
    expect(
      judgeOverlap(createClockTime({ hour: 0, minute: 0 }), DEFAULT_TOLERANCE)
        .isOverlapping
    ).toBe(true)
  })
})
