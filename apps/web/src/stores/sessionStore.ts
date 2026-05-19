import { create } from 'zustand'

interface SessionState {
  activeModuleId: string | null
  diagnosticSessionId: string | null
  trainingSessionId: string | null
  setActiveModuleId: (id: string | null) => void
  setDiagnosticSessionId: (id: string | null) => void
  setTrainingSessionId: (id: string | null) => void
  clearLearningSessions: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  activeModuleId: null,
  diagnosticSessionId: null,
  trainingSessionId: null,
  setActiveModuleId: (id) => set({ activeModuleId: id }),
  setDiagnosticSessionId: (id) => set({ diagnosticSessionId: id }),
  setTrainingSessionId: (id) => set({ trainingSessionId: id }),
  clearLearningSessions: () => set({ diagnosticSessionId: null, trainingSessionId: null }),
}))
