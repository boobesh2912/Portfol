import { create } from 'zustand'

export const useEditorStore = create((set) => ({
  activeSection: 'hero',
  hasUnsavedChanges: false,
  onboardingComplete: false,
  onboardingStep: 0,

  setActiveSection: (section) => set({ activeSection: section }),
  setUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
  setOnboardingComplete: (val) => set({ onboardingComplete: val }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
}))
