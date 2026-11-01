import { describe, expect, it } from "vitest"
import {
  Angle,
  ClockTime,
  DomainError,
  HandsOverlapSpecification,
  Hour,
  Minute,
  Second,
  Tolerance,
} from "../../index.js"

describe("時刻の値オブジェクト", () => {
  it.each([[-1], [24], [1.5], [Number.NaN]])("Hour.of(%d) は不正", (value) => {
    expect(() => Hour.of(value)).toThrow(DomainError)
  })

  it.each([[-1], [60], [0.5]])("Minute.of(%d) は不正", (value) => {
    expect(() => Minute.of(value)).toThrow(DomainError)
  })

  it.each([
    [-0.1],
    [60],
    [Number.POSITIVE_INFINITY],
  ])("Second.of(%d) は不正", (value) => {
    expect(() => Second.of(value)).toThrow(DomainError)
  })

  it("13 時の文字盤位置は 1", () => {
    expect(Hour.of(13).onDial).toBe(1)
  })

  it("ClockTime は値で等価判定する", () => {
    const a = ClockTime.of({ hour: 1, minute: 2, second: 3 })
    const b = ClockTime.of({ hour: 1, minute: 2, second: 3 })
    const c = ClockTime.of({ hour: 1, minute: 2 })
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })

  it("ClockTime.fromDate はミリ秒を秒の小数にする", () => {
    const time = ClockTime.fromDate(new Date(2026, 0, 1, 1, 5, 27, 500))
    expect(time.second.value).toBe(27.5)
  })
})

describe("Angle", () => {
  it("[0, 360) に正規化する", () => {
    expect(Angle.ofDegrees(360).degrees).toBe(0)
    expect(Angle.ofDegrees(-90).degrees).toBe(270)
    expect(Angle.ofDegrees(725).degrees).toBe(5)
  })

  it("0° をまたぐ差は小さい方", () => {
    expect(Angle.ofDegrees(359).distanceTo(Angle.ofDegrees(1))).toBe(2)
  })

  it("NaN は不正", () => {
    expect(() => Angle.ofDegrees(Number.NaN)).toThrow(DomainError)
  })
})

describe("Tolerance", () => {
  it("負の値は不正", () => {
    expect(() => Tolerance.ofDegrees(-1)).toThrow(DomainError)
    expect(() => Tolerance.ofSeconds(-1)).toThrow(DomainError)
  })

  it("既定値は 0.5 秒ぶんの相対角度", () => {
    expect(Tolerance.default().degrees).toBeCloseTo(
      Tolerance.ofSeconds(0.5).degrees
    )
  })
})

describe("HandsOverlapSpecification", () => {
  it("判定理由を角度で説明できる", () => {
    const spec = new HandsOverlapSpecification(Tolerance.default())
    const judgement = spec.judge(ClockTime.of({ hour: 6, minute: 0 }))
    expect(judgement.isOverlapping).toBe(false)
    expect(judgement.angleBetweenDegrees).toBe(180)
    expect(spec.isSatisfiedBy(ClockTime.of({ hour: 0, minute: 0 }))).toBe(true)
  })
})
