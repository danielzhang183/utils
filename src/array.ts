import { isArray } from './is'

export type Arrayable<T> = T | Array<T>

export function toArray<T>(array: Arrayable<T> = []): Array<T> {
  return isArray(array) ? array : [array]
}
