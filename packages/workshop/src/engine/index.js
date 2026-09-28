/**
 * `@kolkrabbi/kol-workshop/engine` — kept as a re-export since 0.30.0. The engine moved to the
 * engine tier: the markdown half is `@kolkrabbi/kol-markdown`, the matcher `@kolkrabbi/kol-search`.
 * Import from those; this subpath and the root barrel's engine names stay so kolkrabbi.io
 * resolves until it moves.
 */
export * from '@kolkrabbi/kol-markdown'
export { matchSearchItems } from '@kolkrabbi/kol-search'
