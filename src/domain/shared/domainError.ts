/** ドメインの不変条件に違反したときに投げられるエラー */
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DomainError"
  }
}

export const assertFiniteNumber = (value: number, label: string): void => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new DomainError(`${label} must be a finite number: ${value}`)
  }
}

export const assertInteger = (value: number, label: string): void => {
  assertFiniteNumber(value, label)
  if (!Number.isInteger(value)) {
    throw new DomainError(`${label} must be an integer: ${value}`)
  }
}

export const assertInRange = (
  value: number,
  minInclusive: number,
  maxExclusive: number,
  label: string
): void => {
  if (value < minInclusive || value >= maxExclusive) {
    throw new DomainError(
      `${label} must be in [${minInclusive}, ${maxExclusive}): ${value}`
    )
  }
}
