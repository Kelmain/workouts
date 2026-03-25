/**
 * TDD tests for settings store (Zustand).
 * Tests drive:
 *   - Default rest timer is 90s
 *   - setRestTimerDefault updates value
 *   - Rejects values below 10 or above 600
 */

import { useSettingsStore } from '../settings-store'

beforeEach(() => {
  useSettingsStore.setState({
    restTimerDefault: 90,
  })
})

describe('settings store', () => {
  it('has default rest timer of 90s', () => {
    expect(useSettingsStore.getState().restTimerDefault).toBe(90)
  })

  it('updates rest timer default', () => {
    useSettingsStore.getState().setRestTimerDefault(120)
    expect(useSettingsStore.getState().restTimerDefault).toBe(120)
  })

  it('rejects rest timer below 10', () => {
    useSettingsStore.getState().setRestTimerDefault(5)
    expect(useSettingsStore.getState().restTimerDefault).toBe(90)
  })

  it('rejects rest timer above 600', () => {
    useSettingsStore.getState().setRestTimerDefault(700)
    expect(useSettingsStore.getState().restTimerDefault).toBe(90)
  })

  it('accepts boundary value 10', () => {
    useSettingsStore.getState().setRestTimerDefault(10)
    expect(useSettingsStore.getState().restTimerDefault).toBe(10)
  })

  it('accepts boundary value 600', () => {
    useSettingsStore.getState().setRestTimerDefault(600)
    expect(useSettingsStore.getState().restTimerDefault).toBe(600)
  })
})
