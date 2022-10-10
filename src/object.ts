/**
 * Determines whether an object has a property with the specified name
 */
export function hasOwnProperty<T>(obj: T, v: PropertyKey) {
  if (obj === null)
    return false
  return Object.prototype.hasOwnProperty.call(obj, v)
}
