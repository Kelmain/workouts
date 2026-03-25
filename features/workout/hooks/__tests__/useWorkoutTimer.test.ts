import { renderHook, act } from '@testing-library/react-native'
import { useWorkoutTimer } from '../useWorkoutTimer'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useWorkoutTimer', () => {
  it('starts with isRunning false and elapsedSeconds 0', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    expect(result.current.isRunning).toBe(false)
    expect(result.current.elapsedSeconds).toBe(0)
  })

  it('start(): sets isRunning to true', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    expect(result.current.isRunning).toBe(true)
  })

  it('elapsed time increments each second after start', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.elapsedSeconds).toBe(3)
  })

  it('pause(): stops incrementing, preserves elapsed', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    act(() => {
      result.current.pause()
    })
    const elapsed = result.current.elapsedSeconds
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.elapsedSeconds).toBe(elapsed)
    expect(result.current.isRunning).toBe(false)
  })

  it('resume(): continues from paused elapsed', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    act(() => {
      result.current.pause()
    })
    act(() => {
      result.current.resume()
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.elapsedSeconds).toBe(8)
    expect(result.current.isRunning).toBe(true)
  })

  it('stop(): resets to 0, sets isRunning false', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(10000)
    })
    act(() => {
      result.current.stop()
    })
    expect(result.current.elapsedSeconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('reset(): resets elapsed to 0 and stops', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(7000)
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.elapsedSeconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('cleanup on unmount: clears interval (no updates after unmount)', () => {
    const { result, unmount } = renderHook(() => useWorkoutTimer())
    act(() => {
      result.current.start()
    })
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(result.current.elapsedSeconds).toBe(2)
    unmount()
    // After unmount, advancing timers should not cause state updates (no errors)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    // Test passes if no errors thrown — interval was cleared
  })
})
