import { create } from 'zustand'

interface SettingsState {
  restTimerDefault: number
  setRestTimerDefault: (seconds: number) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  restTimerDefault: 90,
  setRestTimerDefault: (seconds: number) => {
    if (seconds < 10 || seconds > 600) return
    set({ restTimerDefault: seconds })
  },
}))
