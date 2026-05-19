const fs = require('fs');
const d = 'D:/Development/EducationPlatform/modules/math-algebra/seeds';
const q = [];

function Q(id, skill, sub, level, qt, diff, prompt, choices, answer, wrong, expl, steps, hints, tags, time) {
  q.push({id, moduleId: 'math.algebra', skill, subSkill: sub, level, questionType: qt, difficulty: diff, prompt, choices, answerKey: answer, wrongChoiceReasons: wrong, explanation: expl, explanationSteps: steps, hints, tags, estimatedTimeSec: time});
}

// A1: patterns-sequences (10 questions)
Q('ma-alg-a1-001','patterns-sequences','number-patterns','A1','multiple-choice',0.1,'What comes next: 2, 4, 6, 8, ___?',
  [{key:'A',text:'9'},{key:'B',text:'10'},{key:'C',text:'11'},{key:'D',text:'12'}],
  'B',{A:'Almost! Add 2: 8+2=10.',C:'Too high. Add 2 to 8.',D:'Add 2 each time.'},
  'Adds 2 each time: 8+2=10.',['Add 2 each step.','8+2=10.'],['Add from 2 to 4?','Add that to 8.'],['patterns','skip-counting','addition'],30);

Q('ma-alg-a1-002','patterns-sequences','number-patterns','A1','multiple-choice',0.15,'What comes next: 5, 10, 15, 20, ___?',
  [{key:'A',text:'22'},{key:'B',text:'25'},{key:'C',text:'30'},{key:'D',text:'35'}],
  'B',{A:'Pattern adds 5. 20+5=25.',C:'Add 5, not 10.',D:'Add 5 to 20.'},
  'Adds 5 each time: 20+5=25.',['Difference: 10-5=5.','20+5=25.'],['How much from 5 to 10?','Add that to 20.'],['patterns','skip-counting','multiplication'],30);

Q('ma-alg-a1-003','patterns-sequences','number-patterns','A1','gap-filling',0.2,'Fill in missing: 3, 6, ___, 12, 15',
  [{key:'A',text:'7'},{key:'B',text:'8'},{key:'C',text:'9'},{key:'D',text:'10'}],
  'C',{A:'Adds 3. 6+3=9.',B:'Count by 3s.',D:'Step is 3.'},
  'Adds 3: 6+3=9.',['Difference: 6-3=3.','6+3=9.'],['Difference between 3 and 6?','Add to 6.'],['patterns','missing-term','addition'],35);

Q('ma-alg-a1-004','patterns-sequences','number-patterns','A1','multiple-choice',0.15,'What comes next: 1, 4, 7, 10, ___?',
  [{key:'A',text:'11'},{key:'B',text:'12'},{key:'C',text:'13'},{key:'D',text:'14'}],
  'C',{A:'Add 3 to 10.',B:'Try adding 3.',D:'Add 3 to 10 = 13.'},
  'Adds 3 each time: 10+3=13.',['Step: 4-1=3.','10+3=13.'],['What is 4-1?','Add to 10.'],['patterns','skip-counting','addition'],30);

Q('ma-alg-a1-005','patterns-sequences','shape-patterns','A1','multiple-choice',0.2,'Shape pattern: circle, square, triangle, circle, square, ___?',
  [{key:'A',text:'circle'},{key:'B',text:'square'},{key:'C',text:'triangle'},{key:'D',text:'star'}],
  'C',{A:'Cycle of 3.',B:'Square was 2nd.',D:'Not in pattern.'},
  'Cycle of 3: circle, square, triangle. After square = triangle.',['Repeats every 3.','After square = triangle.'],['How many shapes?','After square?'],['patterns','shapes','cycles'],25);

Q('ma-alg-a1-006','patterns-sequences','number-patterns','A1','gap-filling',0.25,'Fill in missing: 20, 16, 12, ___, 4',
  [{key:'A',text:'10'},{key:'B',text:'8'},{key:'C',text:'6'},{key:'D',text:'0'}],
  'B',{A:'Subtract 4. 12-4=8.',C:'Step is 4.',D:'Too much.'},
  'Decreasing by 4: 12-4=8.',['20-16=4.','12-4=8.'],['What is 20-16?','Subtract from 12.'],['patterns','decreasing','subtraction'],35);

Q('ma-alg-a1-007','patterns-sequences','number-patterns','A1','multiple-choice',0.2,'What comes next: 10, 20, 30, 40, ___?',
  [{key:'A',text:'45'},{key:'B',text:'50'},{key:'C',text:'60'},{key:'D',text:'100'}],
  'B',{A:'Add 10. 40+10=50.',C:'That adds 20.',D:'Too far.'},
  'Adds 10: 40+10=50.',['20-10=10.','40+10=50.'],['What is 20-10?','Add to 40.'],['patterns','skip-counting','tens'],25);

Q('ma-alg-a1-008','patterns-sequences','arithmetic-sequences','A1','multiple-choice',0.3,'Next number: 1, 3, 5, 7, ___?',
  [{key:'A',text:'8'},{key:'B',text:'9'},{key:'C',text:'10'},{key:'D',text:'11'}],
  'B',{A:'Add 2. 7+2=9.',C:'Add 3.',D:'Too high.'},
  'Odd numbers, add 2: 7+2=9.',['3-1=2.','7+2=9.'],['Add to 1 to get 3?','Add to 7.'],['sequences','odd-numbers','arithmetic'],30);

Q('ma-alg-a1-009','patterns-sequences','shape-patterns','A1','gap-filling',0.3,'Complete: a, bb, ccc, ____, eeeee',
  [{key:'A',text:'dd'},{key:'B',text:'dddd'},{key:'C',text:'dddddd'},{key:'D',text:'ddd'}],
  'B',{A:'Need 4 letters.',C:'That is 6.',D:'Need 4.'},
  'Increases by 1: 1,2,3,4,5. Missing = 4 = dddd.',['Count: 1,2,3,?,5.','4 = dddd.'],['How many letters?','Between 3 and 5?'],['patterns','visual','counting'],30);

Q('ma-alg-a1-010','patterns-sequences','arithmetic-sequences','A1','multiple-choice',0.35,'6th number in: 2, 4, 6, 8, ...?',
  [{key:'A',text:'10'},{key:'B',text:'11'},{key:'C',text:'12'},{key:'D',text:'14'}],
  'C',{A:'5th term.',B:'Even numbers only.',D:'Too far.'},
  '2,4,6,8,10,12. 6th=12.',['List: 2,4,6,8,10,12.','6th=2x6=12.'],['First 6 numbers?','2x6?'],['sequences','even-numbers','arithmetic'],40);

// A1: variables-expressions (10 questions)
Q('ma-alg-a1-011','variables-expressions','variable-concepts','A1','multiple-choice',0.15,'If a = 5, what is a + 3?',
  [{key:'A',text:'5'},{key:'B',text:'8'},{key:'C',text:'10'},{key:'D',text:'15'}],
  'B',{A:'Replace a with 5: 5+3=8.',C:'That is a+5.',D:'That is a x 3.'},
  'a=5, so a+3=5+3=8.',['a=5.','5+3=8.'],['What does a equal?','Add 3.'],['variables','substitution','addition'],25);

Q('ma-alg-a1-012','variables-expressions','variable-concepts','A1','multiple-choice',0.2,'If b = 7, what is b - 2?',
  [{key:'A',text:'5'},{key:'B',text:'7'},{key:'C',text:'9'},{key:'D',text:'14'}],
  'A',{B:'Subtract 2 from b.',C:'That is b+2.',D:'That is b x 2.'},
  'b=7, so b-2=7-2=5.',['b=7.','7-2=5.'],['What does b equal?','Subtract 2.'],['variables','substitution','subtraction'],25);

Q('ma-alg-a1-013','variables-expressions','variable-concepts','A1','gap-filling',0.25,'If n = 4, what is 3 x n?',
  [{key:'A',text:'7'},{key:'B',text:'12'},{key:'C',text:'34'},{key:'D',text:'81'}],
  'B',{A:'That is 3+n.',C:'Putting digits.',D:'3 to power 4.'},
  'n=4, so 3 x n = 3 x 4 = 12.',['n=4.','3x4=12.'],['n equals?','3x4?'],['variables','substitution','multiplication'],30);

Q('ma-alg-a1-014','variables-expressions','writing-expressions','A1','multiple-choice',0.3,'Which means "a number plus 5" using x?',
  [{key:'A',text:'5 - x'},{key:'B',text:'x + 5'},{key:'C',text:'x x 5'},{key:'D',text:'5 / x'}],
  'B',{A:'5-x means minus.',C:'x x 5 means times.',D:'5/x means divide.'},
  'Number plus 5 with x: x+5.',['Let x = number.','Plus 5: x+5.'],['Letter for number?','Operation for plus?'],['variables','writing-expressions','translation'],30);

Q('ma-alg-a1-015','variables-expressions','writing-expressions','A1','multiple-choice',0.35,'Which means "twice a number" using y?',
  [{key:'A',text:'y + 2'},{key:'B',text:'y - 2'},{key:'C',text:'2 / y'},{key:'D',text:'2 x y'}],
  'D',{A:'y+2 means plus 2.',B:'y-2 means minus 2.',C:'2/y means divide.'},
  'Twice = multiply by 2: 2 x y.',['Let y = number.','Twice = 2 times.','2 x y.'],['Twice means?','Operation for times?'],['variables','writing-expressions','multiplication'],30);

Q('ma-alg-a1-016','variables-expressions','evaluating-expressions','A1','gap-filling',0.3,'If c = 3, what is 2 x c + 1?',
  [{key:'A',text:'5'},{key:'B',text:'6'},{key:'C',text:'7'},{key:'D',text:'9'}],
  'C',{A:'Multiply first: 2x3=6, 6+1=7.',B:'Add +1.',D:'Multiply first.'},
  '2 x c + 1 = 2 x 3 + 1 = 6 + 1 = 7.',['c=3.','2x3=6.','6+1=7.'],['2x3?','Add 1.'],['variables','evaluation','order-of-operations'],35);

Q('ma-alg-a1-017','variables-expressions','writing-expressions','A1','multiple-choice',0.35,'p apples, Sarah takes 3. Apples left?',
  [{key:'A',text:'p + 3'},{key:'B',text:'3 - p'},{key:'C',text:'p - 3'},{key:'D',text:'p / 3'}],
  'C',{A:'Takes = subtract.',B:'p-3.',D:'Not dividing.'},
  'Start with p, take 3: p-3.',['Start with p.','Take 3: p-3.'],['Takes =?','Start with p, then?'],['variables','writing-expressions','word-problems'],35);

Q('ma-alg-a1-018','variables-expressions','evaluating-expressions','A1','gap-filling',0.35,'If d = 6, what is d / 2 + 4?',
  [{key:'A',text:'3'},{key:'B',text:'5'},{key:'C',text:'7'},{key:'D',text:'10'}],
  'C',{A:'Found d/2 but add 4.',B:'6/2=3, 3+4=7.',D:'Divide first.'},
  'd/2+4 = 6/2+4 = 3+4 = 7.',['d=6.','6/2=3.','3+4=7.'],['6/2?','Add 4.'],['variables','evaluation','order-of-operations'],35);

Q('ma-alg-a1-019','variables-expressions','evaluating-expressions','A1','multiple-choice',0.4,'If x = 2, what is 3 x x + x?',
  [{key:'A',text:'6'},{key:'B',text:'8'},{key:'C',text:'10'},{key:'D',text:'12'}],
  'B',{A:'That is just 3x. Add x.',C:'3x2=6, 6+2=8.',D:'3x2x2.'},
  '3 x x + x = 3 x 2 + 2 = 6 + 2 = 8.',['x=2.','3x2=6.','6+2=8.'],['3x2?','Add x (x=2).'],['variables','evaluation','multiple-occurrences'],35);

Q('ma-alg-a1-020','variables-expressions','variable-concepts','A1','multiple-choice',0.3,'If m = 9 and n = 2, what is m - n?',
  [{key:'A',text:'7'},{key:'B',text:'11'},{key:'C',text:'18'},{key:'D',text:'92'}],
  'A',{B:'That is m+n.',C:'That is m x n.',D:'Side by side.'},
  'm-n = 9-2 = 7.',['m=9, n=2.','9-2=7.'],['What is m? n?','Subtract n from m.'],['variables','substitution','two-variables'],30);

// Write A1
fs.writeFileSync(d+'/A1.json', JSON.stringify(q.slice(0,20), null, 2), 'utf8');
console.log('A1.json:', 20, 'questions');
