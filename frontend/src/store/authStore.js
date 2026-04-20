// Auth is now fully managed by Clerk via @clerk/react hooks.
// This file is kept as a no-op stub so any stale imports don't crash.
import { create } from 'zustand'

export const useAuthStore = create(() => ({
  user: null,
  session: null,
  loading: false,
  initialize: () => {},
  signOut: () => {},
}))
