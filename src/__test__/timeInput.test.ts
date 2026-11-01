import { afterEach, describe, expect, it, vi } from "vitest"
import {
  areClockHandsOverlapping,
  judgeHandsOverlap,
  type TemporalTimeLike,
} from "../index.js"

// Temporal.PlainTime と同じく値をプロトタイプの getter で持つ (spread では取れない)
class FakePlainTime implements TemporalTimeLike {
  constructor(
    private readonly parts: [number, number, number, number, number, number]
  ) {}
  get hour() {
    return this.parts[0]
  }
  get minute() {
    return this.parts[1]
  }
  get second() {
    return this.parts[2]
  }
  get millisecond() {
    return this.parts[3]
  }
  get microsecond() {
    return this.parts[4]
  }
  get nanosecond() {
    return this.parts[5]
  }
}

describe("省略時は現在時刻", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("現在時刻で判定する", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    expect(areClockHandsOverlapping()).toBe(true)
    vi.setSystemTime(new Date(2026, 0, 1, 12, 30, 0))
    expect(areClockHandsOverlapping()).toBe(false)
    expect(judgeHandsOverlap().time).toEqual({
      hour: 12,
      minute: 30,
      second: 0,
    })
  })

  it("option だけ渡したいときは undefined を渡す", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 1, 5, 0))
    expect(areClockHandsOverlapping(undefined, { toleranceSeconds: 30 })).toBe(
      true
    )
  })
})

describe("Temporal 形式の入力", () => {
  it("PlainTime 相当 (getter) を受け取れる", () => {
    expect(
      areClockHandsOverlapping(new FakePlainTime([1, 5, 27, 0, 0, 0]))
    ).toBe(true)
    expect(
      areClockHandsOverlapping(new FakePlainTime([1, 5, 0, 0, 0, 0]))
    ).toBe(false)
  })

  it("ミリ・マイクロ・ナノ秒を秒の小数にする", () => {
    const time = new FakePlainTime([1, 5, 27, 272, 727, 273])
    expect(judgeHandsOverlap(time).time.second).toBeCloseTo(27.272727273, 9)
    expect(areClockHandsOverlapping(time, { toleranceDegrees: 1e-6 })).toBe(
      true
    )
  })

  it("Instant 相当 (epochMilliseconds) はローカル時刻で解釈する", () => {
    const epochMilliseconds = new Date(2026, 0, 1, 0, 0, 0).getTime()
    expect(areClockHandsOverlapping({ epochMilliseconds })).toBe(true)
  })

  const temporal = (globalThis as { Temporal?: TemporalGlobal }).Temporal
  it.runIf(temporal !== undefined)("本物の Temporal を受け取れる", () => {
    const api = temporal as TemporalGlobal
    expect(areClockHandsOverlapping(api.PlainTime.from("01:05:27"))).toBe(true)
    expect(
      areClockHandsOverlapping(api.PlainDateTime.from("2026-01-01T06:00"))
    ).toBe(false)
    expect(areClockHandsOverlapping(api.Instant.fromEpochMilliseconds(0))).toBe(
      areClockHandsOverlapping(new Date(0))
    )
  })
})

type TemporalGlobal = {
  PlainTime: { from: (text: string) => TemporalTimeLike }
  PlainDateTime: { from: (text: string) => TemporalTimeLike }
  Instant: {
    fromEpochMilliseconds: (ms: number) => { epochMilliseconds: number }
  }
}
