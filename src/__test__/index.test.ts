import { describe, expect, it } from "vitest"
import { areClockHandsOverlapping, judgeHandsOverlap } from "../index.js"

const SECONDS_PER_HALF_DAY = 12 * 60 * 60

const countOverlappingSeconds = (totalSeconds: number): number =>
  Array.from({ length: totalSeconds }, (_, index) => ({
    hour: Math.floor(index / 3600),
    minute: Math.floor(index / 60) % 60,
    second: index % 60,
  })).filter((time) => areClockHandsOverlapping(time)).length

describe("areClockHandsOverlapping", () => {
  it.each([
    [{ hour: 0, minute: 0 }],
    [{ hour: 12, minute: 0, second: 0 }],
    [{ hour: 1, minute: 5, second: 27 }],
    [{ hour: 2, minute: 10, second: 55 }],
    [{ hour: 13, minute: 5, second: 27 }],
    [{ hour: 10, minute: 54, second: 33 }],
  ])("重なっている %o", (time) => {
    expect(areClockHandsOverlapping(time)).toBe(true)
  })

  it.each([
    [{ hour: 6, minute: 0 }],
    [{ hour: 1, minute: 5 }],
    [{ hour: 1, minute: 5, second: 26 }],
    [{ hour: 1, minute: 5, second: 28 }],
    [{ hour: 2, minute: 10, second: 54 }],
    [{ hour: 3, minute: 15 }],
  ])("重なっていない %o", (time) => {
    expect(areClockHandsOverlapping(time)).toBe(false)
  })

  it("厳密な重なりの瞬間 (小数秒) は許容 0 でも true", () => {
    const exact = { hour: 1, minute: 5, second: 27 + 3 / 11 }
    expect(areClockHandsOverlapping(exact, { toleranceDegrees: 0 })).toBe(true)
  })

  it("12 時間の整数秒のうち重なるのはちょうど 11 回", () => {
    expect(countOverlappingSeconds(SECONDS_PER_HALF_DAY)).toBe(11)
  })

  it("24 時間では 22 回", () => {
    expect(countOverlappingSeconds(SECONDS_PER_HALF_DAY * 2)).toBe(22)
  })

  it("Date を受け取れる (ローカル時刻)", () => {
    expect(areClockHandsOverlapping(new Date(2026, 0, 1, 12, 0, 0))).toBe(true)
    expect(areClockHandsOverlapping(new Date(2026, 0, 1, 12, 30, 0))).toBe(
      false
    )
  })

  it("許容を秒で広げられる", () => {
    const time = { hour: 1, minute: 5 }
    expect(areClockHandsOverlapping(time, { toleranceSeconds: 30 })).toBe(true)
    expect(areClockHandsOverlapping(time, { toleranceSeconds: 20 })).toBe(false)
  })

  it("許容を角度で広げられる", () => {
    expect(
      areClockHandsOverlapping({ hour: 1, minute: 5 }, { toleranceDegrees: 3 })
    ).toBe(true)
  })

  it("許容の二重指定はエラー", () => {
    expect(() =>
      areClockHandsOverlapping(
        { hour: 0, minute: 0 },
        { toleranceDegrees: 1, toleranceSeconds: 1 }
      )
    ).toThrow(TypeError)
  })
})

describe("judgeHandsOverlap", () => {
  it("角度の内訳を返す", () => {
    expect(judgeHandsOverlap({ hour: 3, minute: 0 })).toEqual({
      isOverlapping: false,
      time: { hour: 3, minute: 0, second: 0 },
      hourHandDegrees: 90,
      minuteHandDegrees: 0,
      angleBetweenDegrees: 90,
    })
  })

  it("小さい方の角を返す (9 時は 270° ではなく 90°)", () => {
    expect(judgeHandsOverlap({ hour: 9, minute: 0 }).angleBetweenDegrees).toBe(
      90
    )
  })
})
