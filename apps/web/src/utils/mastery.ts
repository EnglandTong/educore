import { parseMasteryLevel as parseMasteryLevelFromConstants } from '@educore/constants'
import type { MasteryLevel } from '@/types'

/** Shared mastery level parse — single source via @educore/constants. */
export function parseMasteryLevel(level: string | undefined): MasteryLevel {
  return parseMasteryLevelFromConstants(level) as MasteryLevel
}
