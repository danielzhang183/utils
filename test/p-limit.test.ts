import { describe, expect, it } from 'vitest'
import pLimit from '../src/p/p-limit'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve, ms))
}

function fetchSomething(input: string) {
  input === 'foo' ? sleep(2000) : sleep(100)
  return input
}

describe('p-limit', () => {
  it('1 concurrency', async () => {
    const limit = pLimit(1)
    expect(limit.activeCount).toMatchInlineSnapshot('0')
    expect(limit.pendingCount).toMatchInlineSnapshot('0')
    const res = await limit(() => fetchSomething('foo'))
    expect(res).toMatchInlineSnapshot('"foo"')
  })

  it('2 concurrency', async () => {
    const mlimit = pLimit(2)
    expect(mlimit.activeCount).toMatchInlineSnapshot('0')
    expect(mlimit.pendingCount).toMatchInlineSnapshot('0')
    const batch = Promise.all(
      ['foo', 'bar'].map(p => mlimit(() => fetchSomething(p))),
    )
    const res = await batch
    expect(res).toMatchInlineSnapshot(`
      [
        "foo",
        "bar",
      ]
    `)
  })
})
