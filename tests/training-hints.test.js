import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,questionById} from '../src/curriculum.js';
import {hintsFor,inputSymbols,answerText} from '../src/training-hints.js';
import {grade} from '../src/engine.js';

test('every training exercise has usable staged assistance and a consistent final result',()=>{
 for(const q of questions){
  const hints=hintsFor(q);
  assert.ok(hints.length>=2,q.id);
  assert.equal(new Set(hints.map(h=>h.text)).size,hints.length,q.id);
  assert.ok(hints.every(h=>h.title&&h.text&&!h.text.includes('undefined')),q.id);
  assert.ok(hints.at(-1).text.endsWith('Ergebnis: '+answerText(q)),q.id);
  assert.ok(grade(q,q.type==='choice'?q.answer:answerText(q)),q.id);
 }
});
test('worked hints use actual operands, preserve B · A and distinguish epsilon from empty sets',()=>{
 assert.match(hintsFor(questionById.co1)[1].text,/ε · 1 = 1/);
 assert.match(hintsFor(questionById.co2)[0].text,/B links/);
 assert.match(hintsFor(questionById.qu1)[1].text,/00 auf ε/);
 assert.match(hintsFor(questionById.qu1)[1].text,/übrig bleibt 00/);
 assert.match(hintsFor(questionById['variant-words-3-4'])[1].text,/3\^4/);
 assert.match(hintsFor(questionById['variant-cyk-0-aabb'])[1].text,/a \| abb; aa \| bb; aab \| b/);
 assert.match(hintsFor(questionById['variant-subset-0-0'])[1].text,/keinen Zustand/);
});
test('input keyboards include binary digits for sets, regex and word answers',()=>{
 for(const q of questions.filter(q=>['set','regex','text'].includes(q.type))){
  if(q.symbols){for(const symbol of q.symbols)assert.ok(inputSymbols(q).includes(symbol),q.id);}
  else {assert.ok(inputSymbols(q).includes('0'),q.id);assert.ok(inputSymbols(q).includes('1'),q.id);}
 }
 assert.ok(inputSymbols(questionById['variant-cyk-0-aabb']).includes('S'));
});
