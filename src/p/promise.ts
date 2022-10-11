import type { Fn } from '../types'

export interface SingletonPromiseReturn<T> {
  (): Promise<T> | undefined
  reset(): Promise<void>
}

export function createSinglePromise<T>(fn: () => Promise<T>) {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise)
      _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    _prev && await _prev
  }

  return wrapper
}

export function sleep(ms: number, callback?: Fn<any>) {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      await callback?.()
      resolve()
    }, ms)
  })
}

export function createPromiseLock() {
  const locks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      locks.push(p)
      try {
        return await p
      }
      finally {
        remove(locks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(locks)
    },
    isWaiting() {
      return Boolean(locks.length)
    },
    clear() {
      locks.length = 0
    },
  }
}

export interface ControlledPromise<T = void> extends Promise<T> {
  resolve(value: T | PromiseLike<T>): void
  reject(reason?: any): void
}

export function createControlledPromise<T>() {
  let resolve: any, reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}
