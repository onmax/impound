import { relative } from 'pathe'
import { describe, expect, it } from 'vitest'
import { createToRelative } from '../src/utils'

describe('createToRelative', () => {
  it.each(['/project', '/project/', 'C:/project', 'C:\\project'])('matches `relative()` for absolute paths (cwd: %s)', (cwd) => {
    const toRelative = createToRelative(cwd)
    const base = cwd.replace(/[\\/]$/, '').replace(/\\/g, '/')
    for (const path of [
      `${base}/src/a.ts`,
      `${base}/node_modules/vue/index.mjs`,
      `${base}/a.vue?vue&type=script&setup=true&lang.ts`,
      `${base}/src/../b.ts`,
      `${base}/src/./b.ts`,
      `${base}//src/b.ts`,
      `${base}/src/`,
      `${base}`,
      `${base}-other/a.ts`,
      '/elsewhere/a.ts',
      `${base}\\src\\a.ts`,
    ]) {
      expect(toRelative(path), path).toBe(relative(cwd, path))
    }
  })

  it('leaves ids that are not absolute paths alone', () => {
    const toRelative = createToRelative('/project')
    expect(toRelative('vue')).toBe('vue')
    expect(toRelative('#app')).toBe('#app')
    expect(toRelative('\0virtual')).toBe('\0virtual')
  })

  it('returns ids as they are without a cwd', () => {
    expect(createToRelative(undefined)('/project/a.ts')).toBe('/project/a.ts')
  })
})
