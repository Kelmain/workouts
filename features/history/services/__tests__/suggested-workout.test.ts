/**
 * TDD tests for suggested workout logic.
 * Tests drive:
 *   - Returns 'lower' if last workout was 'upper'
 *   - Returns 'upper' if last workout was 'lower'
 *   - Returns 'upper' if last workout was 'full'
 *   - Returns 'upper' if no workout history (default)
 */

import { getSuggestedPlanType } from '../suggested-workout'
import type { WorkoutLog } from '../../types'

function makeLog(planType: WorkoutLog['planType']): WorkoutLog {
  return {
    id: 'log-1',
    date: new Date('2026-03-25T10:00:00Z'),
    planType,
    durationSeconds: 1800,
    exercises: [],
    notes: null,
  }
}

describe('getSuggestedPlanType', () => {
  it('suggests lower if last workout was upper', () => {
    expect(getSuggestedPlanType([makeLog('upper')])).toBe('lower')
  })

  it('suggests upper if last workout was lower', () => {
    expect(getSuggestedPlanType([makeLog('lower')])).toBe('upper')
  })

  it('suggests upper if last workout was full', () => {
    expect(getSuggestedPlanType([makeLog('full')])).toBe('upper')
  })

  it('suggests upper if last workout was custom', () => {
    expect(getSuggestedPlanType([makeLog('custom')])).toBe('upper')
  })

  it('defaults to upper when no history', () => {
    expect(getSuggestedPlanType([])).toBe('upper')
  })
})
