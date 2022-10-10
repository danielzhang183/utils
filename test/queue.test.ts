import { describe, expect, it } from 'vitest'
import Queue from '../src/p/queue'

const q = new Queue()

describe('queue', () => {
  it('enqueue', () => {
    q.enqueue('🦄')
    q.enqueue('🌈')
    expect([...q]).toMatchInlineSnapshot(`
      [
        "🦄",
        "🌈",
      ]
    `)
    expect(q.size).toBe(2)
  })

  it('dequeue', () => {
    q.dequeue()
    expect([...q]).toMatchInlineSnapshot(`
      [
        "🌈",
      ]
    `)
    expect(q.size).toBe(1)
  })

  it('clear', () => {
    q.clear()
    expect([...q]).toMatchInlineSnapshot('[]')
    expect(q.size).toBe(0)
  })
})
