declare const brand: unique symbol

/**
 * 検証済みであることを型で表す印。実行時は素の値のまま (JSON 化・比較がそのまま効く)。
 * 生成は各ドメインの to* 関数に限り、`as` での付与はそこ以外で行わない。
 */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name }
