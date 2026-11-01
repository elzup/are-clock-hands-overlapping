#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs"
import { dirname, join } from "node:path"
import { runCli } from "./run.js"

// ESM / CJS 両ビルドで動かすため import.meta を使わず実行パスから辿る。
// bin は lib/{esm,cjs}/cli/bin.js に置かれるので package.json は 3 階層上
const readVersion = (): string => {
  const binDir = dirname(realpathSync(process.argv[1]))
  const packageJsonPath = join(binDir, "..", "..", "..", "package.json")
  const { version } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    version: string
  }
  return version
}

const { stdout, stderr, exitCode } = runCli(process.argv.slice(2), {
  version: readVersion(),
})
if (stdout !== "") console.log(stdout)
if (stderr !== "") console.error(stderr)
process.exitCode = exitCode
