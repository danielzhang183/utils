import { isArray } from './is'
import type { Arrayable, Nullable } from './types'

export function toArray<T>(array: Arrayable<T> = []): Array<T> {
  return isArray(array) ? array : [array]
}

export function flatternArrayable<T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> {
  return toArray(array).flat(1) as Array<T>
}

export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}

export function last(array: readonly []): undefined
export function last<T>(array: readonly T[]): T
export function last<T>(array: readonly T[]): T | undefined {
  return at(array, -1)
}

export function at(array: readonly [], index: number): undefined
export function at<T>(array: readonly T[], index: number): T
export function at<T>(array: readonly T[], index: number): T | undefined {
  const len = array.length
  if (!len)
    return undefined

  if (index < 0)
    index += len

  return array[index]
}

export function sample<T>(arr: T[], count: number) {
  return Array.from({ length: count }, _ => arr[Math.round(Math.random() * (arr.length - 1))])
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}
