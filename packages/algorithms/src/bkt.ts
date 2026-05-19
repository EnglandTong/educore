export interface BKTParams {
  pKnown: number
  pLearn: number
  pSlip: number
  pGuess: number
}

export interface BKTUpdateResult {
  pKnown: number
  learned: boolean
}

const DEFAULT_PARAMS: BKTParams = {
  pKnown: 0.3,
  pLearn: 0.15,
  pSlip: 0.1,
  pGuess: 0.25,
}

const MASTERY_THRESHOLD = 0.85

/**
 * Update BKT parameters after observing an answer.
 *
 * Formula:
 *   If correct:
 *     P(Known|Correct) = P(Known) * (1 - P(Slip)) / P(Correct)
 *     where P(Correct) = P(Known)*(1-P(Slip)) + (1-P(Known))*P(Guess)
 *   If incorrect:
 *     P(Known|Incorrect) = P(Known) * P(Slip) / P(Incorrect)
 *     where P(Incorrect) = P(Known)*P(Slip) + (1-P(Known))*(1-P(Guess))
 *
 *   Then apply learning:
 *     P(Known_new) = P(Known|obs) + (1 - P(Known|obs)) * P(Learn)
 */
export function updateBKT(
  params: Partial<BKTParams> & { pKnown: number },
  isCorrect: boolean
): BKTUpdateResult {
  const { pKnown, pLearn, pSlip, pGuess } = { ...DEFAULT_PARAMS, ...params }

  if (pKnown < 0 || pKnown > 1 || pLearn < 0 || pLearn > 1 || pSlip < 0 || pSlip > 1 || pGuess < 0 || pGuess > 1) {
    throw new Error('BKT parameters must be between 0 and 1')
  }

  let pKnownGivenObs: number

  if (isCorrect) {
    const pCorrect = pKnown * (1 - pSlip) + (1 - pKnown) * pGuess
    pKnownGivenObs = (pKnown * (1 - pSlip)) / pCorrect
  } else {
    const pIncorrect = pKnown * pSlip + (1 - pKnown) * (1 - pGuess)
    pKnownGivenObs = (pKnown * pSlip) / pIncorrect
  }

  const pKnownNew = pKnownGivenObs + (1 - pKnownGivenObs) * pLearn

  return {
    pKnown: Math.min(1, Math.max(0, pKnownNew)),
    learned: pKnownNew >= MASTERY_THRESHOLD,
  }
}
