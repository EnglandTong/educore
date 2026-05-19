const correctPool = [
  'Brilliant! You really understand this!',
  "That's right — you are on a roll!",
  'Perfect! Your hard work is shining through!',
  'Exactly! You have grown so much!',
]

const wrongPool = [
  'Not quite — but I love that you tried!',
  'Almost! You are thinking in a beautiful direction.',
  'That is a tricky one — let me help you see it differently.',
  'Close! Let us break this down together.',
]

export function pickWarmCorrect(): string {
  return correctPool[Math.floor(Math.random() * correctPool.length)] ?? correctPool[0]!
}

export function pickWarmWrong(): string {
  return wrongPool[Math.floor(Math.random() * wrongPool.length)] ?? wrongPool[0]!
}
