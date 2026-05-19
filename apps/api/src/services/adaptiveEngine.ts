export interface SelectionWeights {
  weak: number;
  current: number;
  review: number;
}

export const DEFAULT_SELECTION_WEIGHTS: SelectionWeights = {
  weak: 60,
  current: 25,
  review: 15
};
