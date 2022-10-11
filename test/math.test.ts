import { describe, expect, it } from 'vitest'
import { clamp, sum } from '../src/math'

describe('math', () => {
  it('clamp', () => {
    expect(clamp(2, 1, 3)).toBe(2)
    expect(clamp(3, 1, 2)).toBe(2)
    expect(clamp(1, 2, 2)).toBe(2)
    expect(clamp(1, 1, 1)).toBe(1)
  })

  it('sum', () => {
    expect(sum(1)).toBe(1)
    expect(sum(1, 2)).toBe(3)
    expect(sum(1, 2, 3)).toBe(6)
    expect(sum([1, 2, 3])).toBe(6)
    expect(sum([1], [2, 3])).toEqual(6)
    // @ts-expect-error
    expect(sum(1, 2, [3])).toEqual(6)
  })
})
