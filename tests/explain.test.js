import test from 'node:test';
import assert from 'node:assert/strict';
import {explainFor} from '../src/explain.js';
import {allQuestions,questionById} from '../src/curriculum.js';
test('every question gets an in-place explanation with example and pitfall',()=>{
  for(const q of allQuestions){const e=explainFor(q);assert.ok(e,q.id);assert.ok(e.blocks.length>=3&&e.blocks.every(b=>b.title&&b.text&&b.text.length>20),q.id);assert.equal(e.blocks.at(-1).title,'Genau hinschauen');}
});
test('the most relevant lesson section is chosen',()=>{
  assert.match(explainFor(questionById.m1).blocks[0].text,/Instanz/);
  const cp2=explainFor(questionById.cp2);assert.ok([cp2.blocks[0],...cp2.more].some(b=>/vollständig/.test(b.text)),'all lesson sections stay reachable');
  const later=allQuestions.find(q=>q.lesson==='nea');assert.deepEqual(explainFor(later).blocks.slice(0,2).map(b=>b.title),['Grundidee','Vorgehen']);
});
