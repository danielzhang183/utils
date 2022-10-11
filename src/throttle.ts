export interface ThrottleOptions {
  noTrailing?: boolean
  noLeading?: boolean
  debounceMode?: boolean
}

export interface DebounceOptions {
  atBegin?: boolean
}

export interface CancelOptions {
  upcomingOnly?: boolean
}

export function throttle(
  delay: number,
  callback: Function,
  options: ThrottleOptions,
) {
  const {
    noTrailing = false,
    noLeading = false,
    debounceMode = false,
  } = options || {}

  let timerId: NodeJS.Timeout | undefined
  let cancelled = false
  let lastExec = 0

  function clearExistingTimer() {
    timerId && clearTimeout(timerId)
  }

  function cancel(options: CancelOptions = {}) {
    const { upcomingOnly = false } = options
    clearExistingTimer()
    cancelled = !upcomingOnly
  }

  const wrapper = (...args: Parameters<any>) => {
    const elapsed = +Date.now() - lastExec

    if (cancelled)
      return

    const exec = () => {
      lastExec = +Date.now()
      callback(...args)
    }

    const clear = () => (timerId = undefined)

    if (!noLeading && debounceMode && !timerId) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       */
      exec()
    }

    clearExistingTimer()

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         */
        lastExec = Date.now()
        if (!noTrailing)
          timerId = setTimeout(debounceMode ? clear : exec, delay)
      }
      else {
        /*
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec()
      }
    }
    else if (!noTrailing) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timerId = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      )
    }
  }
  wrapper.cancel = cancel

  return wrapper
}

export function debounce(
  delay: number,
  callback: Function,
  options: DebounceOptions = {},
) {
  const { atBegin = false } = options
  return throttle(delay, callback, { debounceMode: !!atBegin })
}
