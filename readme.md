# are-clock-hands-overlapping

[![ooparts](https://raw.githubusercontent.com/elzup/ooparts-spec/main/badge.svg)](https://github.com/elzup/ooparts-spec)

> Judge whether the hour and minute hands of an analog clock overlap — deliberately built with DDD.

アナログ時計の長針と短針が重なっているかを判定する。たったこれだけのことを、あえて DDD で。

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

areClockHandsOverlapping({ hour: 0, minute: 0 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5, second: 27 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5 }) // false
areClockHandsOverlapping(new Date()) // local time

// 許容幅を変える (角度 or 秒)
areClockHandsOverlapping({ hour: 1, minute: 5 }, { toleranceSeconds: 30 }) // true
areClockHandsOverlapping({ hour: 1, minute: 5 }, { toleranceDegrees: 3 }) // true

judgeHandsOverlap({ hour: 3, minute: 0 })
// { isOverlapping: false, hourHandDegrees: 90, minuteHandDegrees: 0, angleBetweenDegrees: 90 }
```

### 既定の許容幅

針が厳密に重なる瞬間は `1:05:27.27…` のように整数秒にならない (12 時間で 11 回、`720/11` 分ごと)。
既定の許容幅は「長針が短針に 0.5 秒で追いつく角度 (≈0.0458°)」で、**重なる瞬間に最も近い整数秒だけ**が `true` になる。
12 時間の全整数秒を判定すると、ちょうど 11 個が `true` になる。

## Architecture

```
src/
├── application/              # ユースケース層 (公開 API・DTO 変換)
│   └── judgeHandsOverlap.ts
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
