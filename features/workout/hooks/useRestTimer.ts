import { useReducer, useRef, useCallback, useEffect } from 'react'

interface RestTimerState {
  remainingSeconds: number
  isRunning: boolean
  isComplete: boolean
}

interface RestTimerActions {
  start: (durationSeconds: number) => void
  skip: () => void
  reset: () => void
}

type RestTimer = RestTimerState & RestTimerActions

const MIN_DURATION = 10
const MAX_DURATION = 600

type Action =
  | { type: 'START'; duration: number }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }
  | { type: 'SKIP' }
  | { type: 'RESET' }

function reducer(state: RestTimerState, action: Action): RestTimerState {
  switch (action.type) {
    case 'START':
      return { remainingSeconds: action.duration, isRunning: true, isComplete: false }
    case 'TICK':
      return { ...state, remainingSeconds: state.remainingSeconds - 1 }
    case 'COMPLETE':
      return { remainingSeconds: 0, isRunning: false, isComplete: true }
    case 'SKIP':
      return { ...state, isRunning: false }
    case 'RESET':
      return { remainingSeconds: 0, isRunning: false, isComplete: false }
    default:
      return state
  }
}

const initialState: RestTimerState = {
  remainingSeconds: 0,
  isRunning: false,
  isComplete: false,
}

export function useRestTimer(onComplete?: () => void): RestTimer {
  const [state, dispatch] = useReducer(reducer, initialState)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  const remainingRef = useRef(0)

  // Keep callback ref up to date without triggering re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [])

  const clearCurrentTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(
    (durationSeconds: number) => {
      if (durationSeconds < MIN_DURATION || durationSeconds > MAX_DURATION) {
        return
      }
      clearCurrentTimer()
      remainingRef.current = durationSeconds
      dispatch({ type: 'START', duration: durationSeconds })

      const tick = () => {
        remainingRef.current -= 1
        if (remainingRef.current <= 0) {
          intervalRef.current = null
          onCompleteRef.current?.()
          dispatch({ type: 'COMPLETE' })
        } else {
          dispatch({ type: 'TICK' })
          intervalRef.current = setTimeout(tick, 1000)
        }
      }
      intervalRef.current = setTimeout(tick, 1000)
    },
    [clearCurrentTimer]
  )

  const skip = useCallback(() => {
    clearCurrentTimer()
    dispatch({ type: 'SKIP' })
  }, [clearCurrentTimer])

  const reset = useCallback(() => {
    clearCurrentTimer()
    remainingRef.current = 0
    dispatch({ type: 'RESET' })
  }, [clearCurrentTimer])

  return {
    ...state,
    start,
    skip,
    reset,
  }
}
