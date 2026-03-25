import { useState, useRef, useCallback, useEffect } from 'react'

interface WorkoutTimerState {
  elapsedSeconds: number
  isRunning: boolean
}

interface WorkoutTimerActions {
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
}

type WorkoutTimer = WorkoutTimerState & WorkoutTimerActions

export function useWorkoutTimer(): WorkoutTimer {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedElapsedRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startInterval = useCallback((baseElapsed: number) => {
    startTimeRef.current = Date.now() - baseElapsed * 1000
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)
  }, [])

  const start = useCallback(() => {
    pausedElapsedRef.current = 0
    setElapsedSeconds(0)
    setIsRunning(true)
    startInterval(0)
  }, [startInterval])

  const pause = useCallback(() => {
    clearCurrentInterval()
    setIsRunning(false)
    setElapsedSeconds(prev => {
      pausedElapsedRef.current = prev
      return prev
    })
  }, [clearCurrentInterval])

  const resume = useCallback(() => {
    setIsRunning(true)
    startInterval(pausedElapsedRef.current)
  }, [startInterval])

  const stop = useCallback(() => {
    clearCurrentInterval()
    pausedElapsedRef.current = 0
    setElapsedSeconds(0)
    setIsRunning(false)
  }, [clearCurrentInterval])

  const reset = useCallback(() => {
    clearCurrentInterval()
    pausedElapsedRef.current = 0
    setElapsedSeconds(0)
    setIsRunning(false)
  }, [clearCurrentInterval])

  return {
    elapsedSeconds,
    isRunning,
    start,
    pause,
    resume,
    stop,
    reset,
  }
}
