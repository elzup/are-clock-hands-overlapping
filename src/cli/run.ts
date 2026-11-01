import { parseArgs } from "node:util"
import {
  type JudgeOptions,
  judgeHandsOverlap,
} from "../application/judgeHandsOverlap.js"
import type { ClockTimeProps } from "../domain/time/ClockTime.js"

/** grep と同じ流儀: 重なっていれば 0、いなければ 1、使い方の誤りは 2 */
export const EXIT_OVERLAPPING = 0
export const EXIT_NOT_OVERLAPPING = 1
export const EXIT_USAGE_ERROR = 2

export type CliResult = {
  stdout: string
  stderr: string
  exitCode: number
}

export const HELP = `Usage: are-clock-hands-overlapping [time] [options]

Judge whether the hour and minute hands of an analog clock overlap.

Arguments:
  time                      HH:MM, HH:MM:SS or HH:MM:SS.sss (default: now)

Options:
  -s, --tolerance-seconds   tolerance in seconds
  -d, --tolerance-degrees   tolerance in degrees
  -j, --json                print the detailed result as JSON
  -h, --help                show this help
  -v, --version             show version

Exit status: 0 if overlapping, 1 if not, 2 on usage error.

Examples:
  $ are-clock-hands-overlapping 1:05:27      # true
  $ are-clock-hands-overlapping 3:00 --json
  $ are-clock-hands-overlapping && echo "now!"`

const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?$/

export const parseTime = (text: string): ClockTimeProps => {
  const match = TIME_PATTERN.exec(text.trim())
  if (match === null) {
    throw new TypeError(`invalid time: "${text}" (expected HH:MM[:SS[.sss]])`)
  }
  const [, hour, minute, second] = match
  return {
    hour: Number(hour),
    minute: Number(minute),
    second: second === undefined ? 0 : Number(second),
  }
}

const parseNumberOption = (
  value: string | undefined,
  name: string
): number | undefined => {
  if (value === undefined) return undefined
  const parsed = Number(value)
  if (value.trim() === "" || !Number.isFinite(parsed)) {
    throw new TypeError(`--${name} must be a number: "${value}"`)
  }
  return parsed
}

const parseCliArgs = (argv: readonly string[]) =>
  parseArgs({
    args: [...argv],
    allowPositionals: true,
    options: {
      "tolerance-seconds": { type: "string", short: "s" },
      "tolerance-degrees": { type: "string", short: "d" },
      json: { type: "boolean", short: "j" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  })

const judge = (
  argv: readonly string[],
  now: Date,
  version: string
): CliResult => {
  const { values, positionals } = parseCliArgs(argv)
  if (values.help) return { stdout: HELP, stderr: "", exitCode: 0 }
  if (values.version) return { stdout: version, stderr: "", exitCode: 0 }
  if (positionals.length > 1) {
    throw new TypeError(`too many arguments: ${positionals.join(" ")}`)
  }

  const options: JudgeOptions = {
    toleranceSeconds: parseNumberOption(
      values["tolerance-seconds"],
      "tolerance-seconds"
    ),
    toleranceDegrees: parseNumberOption(
      values["tolerance-degrees"],
      "tolerance-degrees"
    ),
  }
  const [timeText] = positionals
  const result = judgeHandsOverlap(
    timeText === undefined ? now : parseTime(timeText),
    options
  )

  return {
    stdout: values.json
      ? JSON.stringify(result, null, 2)
      : String(result.isOverlapping),
    stderr: "",
    exitCode: result.isOverlapping ? EXIT_OVERLAPPING : EXIT_NOT_OVERLAPPING,
  }
}

/** 副作用 (process / console) を持たない CLI 本体。テストから直接呼べる */
export const runCli = (
  argv: readonly string[],
  { now = new Date(), version = "" }: { now?: Date; version?: string } = {}
): CliResult => {
  try {
    return judge(argv, now, version)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      stdout: "",
      stderr: `error: ${message}\nRun with --help for usage.`,
      exitCode: EXIT_USAGE_ERROR,
    }
  }
}
