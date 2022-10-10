import { toString } from './base'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isBoolean = (val?: unknown): val is boolean => typeof val === 'boolean'
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isPlainObject = (val: unknown): val is object => toString(val) === '[object Object]'
export const isDate = (val: unknown): val is Date => toString(val) === '[object Date]'
export const isMap = (val: unknown): val is Map<any, any> => toString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toString(val) === '[object Set]'
export const isArray = Array.isArray
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

// @ts-ignore
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]'
// @ts-ignore
export const isBrowser = typeof window !== 'undefined'
