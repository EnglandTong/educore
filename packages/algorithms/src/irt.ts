export interface IRTParams {
  difficulty: number
  discrimination: number
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/** Map 0-1 difficulty to -3 to 3 IRT scale */
export function mapDifficultyToIRT(difficulty01: number): number {
  return difficulty01 * 6 - 3
}

/** Map -3 to 3 IRT scale to 0-1 difficulty */
export function mapIRTToDifficulty(difficultyIRT: number): number {
  return (difficultyIRT + 3) / 6
}

/** Calculate probability of correct response given ability and question parameters */
export function probability(ability: number, params: IRTParams): number {
  const { difficulty, discrimination } = params
  return sigmoid(discrimination * (ability - difficulty))
}

/** Estimate ability from response pattern using Maximum Likelihood Estimation */
export function estimateAbility(
  responses: { params: IRTParams; correct: boolean }[]
): number {
  if (responses.length === 0) {
    return 0
  }

  let ability = 0
  const maxIterations = 50
  const tolerance = 0.001

  for (let iter = 0; iter < maxIterations; iter++) {
    let numerator = 0
    let denominator = 0

    for (const { params, correct } of responses) {
      const p = probability(ability, params)
      const w = p * (1 - p)
      if (w < 1e-10) continue

      numerator += params.discrimination * (correct ? 1 : 0 - p)
      denominator += params.discrimination * params.discrimination * w
    }

    if (Math.abs(denominator) < 1e-10) {
      break
    }

    const delta = numerator / denominator
    ability += delta

    if (Math.abs(delta) < tolerance) {
      break
    }
  }

  return Math.max(-3, Math.min(3, ability))
}

/** Select optimal next question difficulty given current ability estimate */
export function optimalDifficulty(ability: number): number {
  return mapIRTToDifficulty(ability)
}
