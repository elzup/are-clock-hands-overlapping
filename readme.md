# are-clock-hands-overlapping

[![ooparts](https://raw.githubusercontent.com/elzup/ooparts-spec/main/badge.svg)](https://github.com/elzup/ooparts-spec)

> Judge whether the hour and minute hands of an analog clock overlap.

アナログ時計の長針と短針が重なっているかを判定する。

## Requirements

Node.js >= 26 (LTS)

## Install

```
$ npm install are-clock-hands-overlapping
```

## Usage

```ts
import {
  areClockHandsOverlapping,
  judgeHandsOverlap,
} from "are-clock-hands-overlapping"

areClockHandsOverlapping() // 省略すると現在時刻 (ローカルタイムゾーン)
areClockHandsOverlapping({ hour: 0, minute: 0 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5, second: 27 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5 }) // false

// Temporal
areClockHandsOverlapping(Temporal.PlainTime.from("01:05:27")) // true
areClockHandsOverlapping(Temporal.Now.zonedDateTimeISO("Asia/Tokyo")) // 東京の現在時刻
areClockHandsOverlapping(Temporal.Now.instant()) // ローカルタイムゾーンで解釈

// Date (ローカルタイムゾーン)
areClockHandsOverlapping(new Date(2026, 0, 1, 12, 0)) // true

// 許容幅を変える (角度 or 秒)
areClockHandsOverlapping({ hour: 1, minute: 5 }, { toleranceSeconds: 30 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5 }, { toleranceDegrees: 3 }) // true
areClockHandsOverlapping(undefined, { toleranceSeconds: 30 }) // 現在時刻 + 許容幅

judgeHandsOverlap({ hour: 3, minute: 0 })
// {
//   isOverlapping: false,
//   time: { hour: 3, minute: 0, second: 0 },
//   hourHandDegrees: 90,
//   minuteHandDegrees: 0,
//   angleBetweenDegrees: 90,
// }
```

受け付ける入力:

| 入力 | 解釈 |
|---|---|
| 省略 | 現在時刻 (ローカルタイムゾーン) |
| `{ hour, minute, second? }` | そのまま。`second` は小数可 |
| `Temporal.PlainTime` / `PlainDateTime` / `ZonedDateTime` | その時刻。ナノ秒まで使う |
| `Temporal.Instant` | ローカルタイムゾーンでの時刻 |
| `Date` | ローカルタイムゾーンでの時刻。ミリ秒まで使う |

## CLI

```
$ npx are-clock-hands-overlapping            # 現在時刻
false
$ npx are-clock-hands-overlapping 1:05:27
true
$ npx are-clock-hands-overlapping 1:05 --tolerance-seconds 30
true
$ npx are-clock-hands-overlapping 3:00 --json
{ "isOverlapping": false, "time": { ... }, "angleBetweenDegrees": 90, ... }
```

| オプション | 説明 |
|---|---|
| `[time]` | `HH:MM` / `HH:MM:SS` / `HH:MM:SS.sss`。省略時は現在時刻 |
| `-s, --tolerance-seconds <n>` | 許容幅 (秒) |
| `-d, --tolerance-degrees <n>` | 許容幅 (角度) |
| `-j, --json` | 詳細を JSON で出力 |
| `-h, --help` / `-v, --version` | ヘルプ / バージョン |

終了コードは重なっていれば `0`、いなければ `1`、使い方の誤りは `2` (`grep` と同じ流儀)。シェルの条件にそのまま使える。

```
$ are-clock-hands-overlapping && say "重なった"
```

### 既定の許容幅

針が厳密に重なる瞬間は `1:05:27.27…` のように整数秒にならない (12 時間で 11 回、`720/11` 分ごと)。
既定の許容幅は「長針が短針に 0.5 秒で追いつく角度 (≈0.0458°)」で、**重なる瞬間に最も近い整数秒だけ**が `true` になる。
12 時間の全整数秒を判定すると、ちょうど 11 個が `true` になる。

## Architecture

```
src/
├── cli/                      # インターフェース層 (引数解析・終了コード)
├── application/              # ユースケース層 (公開 API・入力変換・DTO 変換)
│   ├── judgeHandsOverlap.ts
│   └── timeInput.ts          # Date / Temporal / object → ClockTime
└── domain/                   # ドメイン層 (外部依存なし)
    ├── time/                 # 値オブジェクト: Hour / Minute / Second / ClockTime
    ├── hand/                 # 値オブジェクト Angle, ドメインサービス calculateHandPositions
    ├── overlap/              # 仕様 HandsOverlapSpecification, Tolerance, OverlapJudgement
    └── shared/               # DomainError (不変条件違反)
```

- 不正値 (`hour: 24`, `minute: 1.5`, `NaN` …) は値オブジェクトの生成時点で `DomainError` を投げる。
- ドメインオブジェクトも export しているので、独自のユースケースを組める。

```ts
import { ClockTime, HandsOverlapSpecification, Tolerance } from "are-clock-hands-overlapping"

const spec = new HandsOverlapSpecification(Tolerance.ofSeconds(1))
spec.isSatisfiedBy(ClockTime.of({ hour: 2, minute: 10, second: 54 })) // true
```

## Release

タグ push で GitHub Actions (`.github/workflows/npm-publish.yml`) が npm に公開する (OIDC Trusted Publishing)。

```
$ npm version patch
$ git push --follow-tags
```

## License

MIT
