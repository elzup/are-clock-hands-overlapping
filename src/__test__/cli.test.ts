import { describe, expect, it } from "vitest"
import { parseTime, runCli } from "../cli/run.js"

const now = new Date(2026, 0, 1, 12, 0, 0)

describe("parseTime", () => {
  it.each([
    ["1:05", { hour: 1, minute: 5, second: 0 }],
    ["01:05:27", { hour: 1, minute: 5, second: 27 }],
    ["13:05:27.25", { hour: 13, minute: 5, second: 27.25 }],
  ])("%s", (text, expected) => {
    expect(parseTime(text)).toEqual(expected)
  })

  it.each([["1"], ["1:5:"], ["a:b"], ["1:05:27:00"]])("%s は不正", (text) => {
    expect(() => parseTime(text)).toThrow(TypeError)
  })
})

describe("runCli", () => {
  it("重なっていれば true / exit 0", () => {
    expect(runCli(["1:05:27"], { now })).toEqual({
      stdout: "true",
      stderr: "",
      exitCode: 0,
    })
  })

  it("重なっていなければ false / exit 1", () => {
    expect(runCli(["6:00"], { now })).toMatchObject({
      stdout: "false",
      exitCode: 1,
    })
  })

  it("時刻省略時は現在時刻", () => {
    expect(runCli([], { now }).exitCode).toBe(0)
  })

  it("許容幅を指定できる", () => {
    expect(
      runCli(["1:05", "--tolerance-seconds", "30"], { now }).exitCode
    ).toBe(0)
    expect(runCli(["1:05", "-d", "3"], { now }).exitCode).toBe(0)
  })

  it("--json で詳細を出す", () => {
    const { stdout } = runCli(["3:00", "--json"], { now })
    expect(JSON.parse(stdout)).toMatchObject({
      isOverlapping: false,
      time: { hour: 3, minute: 0, second: 0 },
      angleBetweenDegrees: 90,
    })
  })

  it("--help / --version", () => {
    expect(runCli(["--help"]).stdout).toContain("Usage:")
    expect(runCli(["-v"], { version: "1.2.3" }).stdout).toBe("1.2.3")
  })

  it.each([
    [["25:00"]],
    [["abc"]],
    [["1:00", "2:00"]],
    [["1:00", "-s", "x"]],
    [["1:00", "-s", "1", "-d", "1"]],
    [["--unknown"]],
  ])("使い方の誤りは exit 2: %o", (argv) => {
    const result = runCli(argv, { now })
    expect(result.exitCode).toBe(2)
    expect(result.stderr).toMatch(/^error: /)
  })
})
