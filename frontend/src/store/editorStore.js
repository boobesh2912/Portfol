import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEditorStore = create(
  persist(
    (set) => ({
      activeSection: 'hero',
      hasUnsavedChanges: false,
      onboardingComplete: false,
      onboardingStep: 0,

      setActiveSection: (section) => set({ activeSection: section }),
      setUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
      setOnboardingComplete: (val) => set({ onboardingComplete: val }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
    }),
    {
      name: 'portfol-editor',
      partialize: (state) => ({ onboardingComplete: state.onboardingComplete }),
    }
  )
)
