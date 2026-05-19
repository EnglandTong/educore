#!/usr/bin/env python3
"""Generate seed data files for english-reading module."""
import json
import os

PATH = "D:/Development/EducationPlatform/modules/english-reading/seeds/"

# ============================================================
# A1 data
# ============================================================
A1 = []

A1.append({
    "id": "er-a1-001",
    "moduleId": "english.reading",
    "skill": "phonics-decoding",
    "subSkill": "letter-sounds",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.1,
    "prompt": "Which word starts with the same sound as 'cat'?",
    "choices": [{"key": "A", "text": "dog"}, {"key": "B", "text": "car"}, {"key": "C", "text": "fish"}, {"key": "D", "text": "ball"}],
    "answerKey": "B",
    "wrongChoiceReasons": {
        "A": "'Dog' starts with /d/, not /k/. Listen to the first sound.",
        "C": "'Fish' starts with /f/. Say 'cat' and 'fish' \u2014 do they start the same?",
        "D": "'Ball' starts with /b/. The word 'cat' starts with /k/."
    },
    "explanation": "'Cat' and 'car' both start with the letter 'c' which makes the /k/ sound.",
    "explanationSteps": ["Say the word 'cat' slowly.", "Listen to the first sound: /k/.", "Find another word that starts with the same sound."],
    "hints": ["Say each word out loud.", "Focus on the very first sound, not the spelling."],
    "tags": ["phonics", "beginning-sounds", "letter-c"],
    "estimatedTimeSec": 20
})

A1.append({
    "id": "er-a1-002",
    "moduleId": "english.reading",
    "skill": "phonics-decoding",
    "subSkill": "letter-sounds",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "Which word starts with the same sound as 'sun'?",
    "choices": [{"key": "A", "text": "top"}, {"key": "B", "text": "run"}, {"key": "C", "text": "sad"}, {"key": "D", "text": "mop"}],
    "answerKey": "C",
    "wrongChoiceReasons": {
        "A": "'Top' starts with /t/. Listen to the first sound of 'sun'.",
        "B": "'Run' starts with /r/. Say 'sun' then 'run' \u2014 the first sounds are different.",
        "D": "'Mop' starts with /m/. Keep listening for the /s/ sound."
    },
    "explanation": "'Sun' and 'sad' both start with the letter 's' which makes the /s/ sound.",
    "explanationSteps": ["Say the word 'sun' out loud.", "Hear the /s/ at the beginning.", "Find the word that also starts with /s/."],
    "hints": ["Make the first sound of 'sun': ssssss.", "Now say each choice and listen for the same sound."],
    "tags": ["phonics", "beginning-sounds", "letter-s"],
    "estimatedTimeSec": 20
})

print("Script loaded. Writing files...")

with open(PATH + "A1.json", "w", encoding="utf-8") as f:
    json.dump(A1, f, indent=2, ensure_ascii=False)
print(f"A1.json written with {len(A1)} questions")
