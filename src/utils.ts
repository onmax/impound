import { isAbsolute, normalize, relative } from 'pathe'

/** Paths that `relative()` would change beyond removing the `cwd` prefix. */
const UNNORMALIZED_PATH_RE = /\\|\/\.{1,2}(?:\/|$)|\/\/|\/$/

/**
 * `relative(cwd, path)` for absolute paths, leaving other ids as they are. A normalized path inside
 * `cwd`, which almost every resolved id is, only needs the prefix removed.
 */
export function createToRelative(cwd: string | undefined): (path: string) => string {
  if (!cwd) {
    return path => path
  }
  const prefix = `${normalize(cwd).replace(/\/$/, '')}/`
  return (path) => {
    if (!isAbsolute(path)) {
      return path
    }
    if (path.startsWith(prefix) && path.length > prefix.length && !UNNORMALIZED_PATH_RE.test(path)) {
      return path.slice(prefix.length)
    }
    return relative(cwd, path)
  }
}
