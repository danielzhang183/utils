import Queue from './queue'

export interface PLimtPromiseReturn {
  (fn: Function, ...args: Parameters<any>[]): Promise<unknown>
  activeCount: number
  pendingCount: number
  reset: () => void
}

export function pLimit(concurrency: number): PLimtPromiseReturn {
  if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0))
    throw new TypeError('Expected `concurrency` to be a number from 1 and up')

  const queue = new Queue()
  let activeCount = 0

  const next = () => {
    activeCount--

    if (queue.size > 0)
      queue.dequeue()()
  }

  const run = async (fn: Function, resolve: Function, args: any[]) => {
    activeCount++
    const result = (async () => fn(...args))()
    resolve(result)
    try {
      await result
    }
    catch {}
    next()
  }

  const enqueue = (fn: Function, resolve: (value: unknown) => void, args: any[]) => {
    queue.enqueue(run.bind(undefined, fn, resolve, args));

    (async () => {
      // This function needs to wait until the next microtask before comparing
      // `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
      // when the run function is dequeued and called. The comparison in the if-statement
      // needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
      await Promise.resolve()

      if (activeCount < concurrency && queue.size > 0)
        queue.dequeue()()
    })()
  }

  const generator = (fn: Function, ...args: Parameters<any>) => new Promise((resolve) => {
    enqueue(fn, resolve, args)
  })

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.size,
    },
    reset: {
      value: () => queue.clear(),
    },
  })

  return generator as PLimtPromiseReturn
}
