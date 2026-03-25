import { renderHook, act } from '@testing-library/react-native'
import { useRestTimer } from '../useRestTimer'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useRestTimer', () => {
  it('starts with isRunning false, remainingSeconds 0, isComplete false', () => {
    const { result } = renderHook(() => useRestTimer())
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('start(duration): sets remainingSeconds to duration, isRunning true', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(60)
    })
    expect(result.current.remainingSeconds).toBe(60)
    expect(result.current.isRunning).toBe(true)
  })

  it('counts down each second', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(30)
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(result.current.remainingSeconds).toBe(25)
  })

  it('reaches 0: sets isComplete true, isRunning false', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(12)
    })
    act(() => {
      jest.advanceTimersByTime(12000)
    })
    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isComplete).toBe(true)
    expect(result.current.isRunning).toBe(false)
  })

  it('calls onComplete callback when timer reaches 0', () => {
    const onComplete = jest.fn()
    const { result } = renderHook(() => useRestTimer(onComplete))
    act(() => {
      result.current.start(10)
    })
    act(() => {
      jest.advanceTimersByTime(10000)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('skip(): stops immediately, sets isRunning false', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(60)
    })
    act(() => {
      jest.advanceTimersByTime(10000)
    })
    act(() => {
      result.current.skip()
    })
    expect(result.current.isRunning).toBe(false)
    // remainingSeconds stops incrementing after skip
    const remaining = result.current.remainingSeconds
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(result.current.remainingSeconds).toBe(remaining)
  })

  it('rejects duration below 10 seconds', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(9)
    })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(0)
  })

  it('rejects duration above 600 seconds', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(601)
    })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(0)
  })

  it('reset(): resets state to initial', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(30)
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isComplete).toBe(false)
  })

  it('cleanup on unmount: clears interval (no errors after unmount)', () => {
    const { result, unmount } = renderHook(() => useRestTimer())
    act(() => {
      result.current.start(60)
    })
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    unmount()
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    // Test passes if no errors thrown
  })
})
