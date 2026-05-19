import { describe, it, expect } from 'vitest'
import { questionSchema } from '../src/questionSchema.js'

describe('questionSchema', () => {
  it('validates a correct multiple-choice question', () => {
    const question = {
      id: 'eg-a1-001',
      moduleId: 'english.grammar',
      skill: 'tense-aspect',
      subSkill: 'simple-present',
      level: 'A1',
      questionType: 'multiple-choice',
      difficulty: 0.2,
      prompt: 'Choose the correct form: She ___ to school every day.',
      choices: [
        { key: 'A', text: 'go' },
        { key: 'B', text: 'goes' },
        { key: 'C', text: 'going' },
        { key: 'D', text: 'gone' },
      ],
      answerKey: 'B',
      explanation: 'With she (third person singular), we add -es to go in simple present tense.',
      explanationSteps: [
        "The subject is 'she' — third person singular",
        "In simple present, third person singular verbs get -s or -es",
      ],
      hints: [
        'Think about who is doing the action',
        'When the subject is he/she/it, the verb changes in present tense.',
        'Add -s or -es to the base verb for he/she/it in simple present.',
      ],
      wrongChoiceReasons: {
        A: "'Go' is used with I/you/we/they, not with she/he/it",
        C: "'Going' is the continuous form, not simple present",
        D: "'Gone' is the past participle, used in perfect tenses",
      },
      tags: ['present-simple', 'third-person', 'verb-form'],
      estimatedTimeSec: 20,
    }

    const result = questionSchema.safeParse(question)
    expect(result.success).toBe(true)
  })

  it('rejects multiple-choice without choices', () => {
    const question = {
      id: 'eg-a1-002',
      moduleId: 'english.grammar',
      skill: 'tense-aspect',
      level: 'A1',
      questionType: 'multiple-choice',
      difficulty: 0.2,
      prompt: 'What is the answer?',
      answerKey: 'A',
      explanation: 'Because it is correct.',
    }

    const result = questionSchema.safeParse(question)
    expect(result.success).toBe(false)
  })

  it('rejects invalid question id format', () => {
    const question = {
      id: 'invalid-id',
      moduleId: 'english.grammar',
      skill: 'tense-aspect',
      level: 'A1',
      questionType: 'gap-filling',
      difficulty: 0.2,
      prompt: 'Fill in the blank.',
      answerKey: 'goes',
      explanation: 'Because it is correct.',
    }

    const result = questionSchema.safeParse(question)
    expect(result.success).toBe(false)
  })

  it('rejects difficulty out of range', () => {
    const question = {
      id: 'eg-a1-003',
      moduleId: 'english.grammar',
      skill: 'tense-aspect',
      level: 'A1',
      questionType: 'gap-filling',
      difficulty: 1.5,
      prompt: 'Fill in the blank.',
      answerKey: 'goes',
      explanation: 'Because it is correct.',
    }

    const result = questionSchema.safeParse(question)
    expect(result.success).toBe(false)
  })

  it('validates gap-filling without choices', () => {
    const question = {
      id: 'eg-a1-004',
      moduleId: 'english.grammar',
      skill: 'prepositions',
      level: 'A1',
      questionType: 'gap-filling',
      difficulty: 0.25,
      prompt: 'She lives ___ London.',
      answerKey: 'in',
      explanation: 'We use "in" for cities and large places.',
      explanationSteps: [
        'Think about the type of place: London is a city.',
        "We use 'in' for cities and large areas.",
      ],
      hints: [
        'Think about place prepositions.',
        'Cities usually take one specific preposition.',
        "'In' is used for cities, countries, and large areas.",
      ],
      tags: ['prepositions', 'place'],
    }

    const result = questionSchema.safeParse(question)
    expect(result.success).toBe(true)
  })
})
