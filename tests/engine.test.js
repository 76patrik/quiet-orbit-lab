import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSet,languageOperation,binaryWords,compileRegex,compareRegex,runDfa,compareDfa,machines,grade} from '../src/engine.js';
import {lessons,questions,allQuestions,units} from '../src/curriculum.js';

test('ε, empty sets, duplicate words and malformed set input stay distinct',()=>{
  assert.deepEqual(parseSet('{eps,0,0}'),['','0']);assert.deepEqual(parseSet('∅'),[]);
  for(const x of ['', '{∅}', '{0,,1}', '0 1', '{{0}}'])assert.throws(()=>parseSet(x));
});
test('language operations reproduce the corrected script examples',()=>{
  assert.deepEqual(languageOperation(['','0'],['1','01'],'concat'),['1','01','001']);
  assert.deepEqual(languageOperation(['00','01','001'],['','0','1'],'quotient'),['0','00','01','001']);
  assert.deepEqual(languageOperation(['ab','abb','b'],['','b'],'quotient'),['','a','b','ab','abb']);
  assert.deepEqual(languageOperation(['a'],[],'concat'),[]);
  assert.deepEqual(languageOperation(['','0','01'],['0','1'],'intersection'),['0']);
});
test('regex semantics agree with independent language predicates for all words through length 9',()=>{
  const cases=[['(0|1)*01',w=>w.endsWith('01')],['0*10*10*',w=>[...w].filter(c=>c==='1').length===2],['0*(10*10*)*',w=>[...w].filter(c=>c==='1').length%2===0],['0*(ε|1)0*',w=>[...w].filter(c=>c==='1').length<=1],['(0|1)*0|1',w=>w.endsWith('0')||w==='1'],['(01)*',w=>w.length%2===0&&[...w].every((c,i)=>c===(i%2?'1':'0'))],['(ε|0)+',w=>![...w].includes('1')]];
  for(const [expr,predicate] of cases){const regex=compileRegex(expr);for(const w of binaryWords(9))assert.equal(regex.test(w),predicate(w),`${expr}: ${w||'ε'}`);}
});
test('regex empty-language edge cases and syntax failures',()=>{
  assert.equal(compileRegex('∅*').test(''),true);assert.equal(compileRegex('∅+').test(''),false);
  assert.equal(compileRegex('ε+').test(''),true);assert.equal(compileRegex('0·1').test('01'),true);
  for(const x of ['','0|','|1','(0','0)','()','a','[01]','0··1'])assert.throws(()=>compileRegex(x),x);
});
test('regex equivalence is not a bounded preview; shortest counterexamples include ε',()=>{
  assert.equal(compareRegex('(0|1)*','(0*1*)*').equal,true);
  assert.deepEqual(compareRegex('0*','0+'),{equal:false,word:'',expected:false,actual:true});
  const long='0'.repeat(15);assert.equal(compareRegex(`0*|${long}1`,'0*').word,long+'1');
  assert.equal(compareRegex('0*(10*10*)*','(0|10*1)*').equal,true);
});
test('DFA runs match independent predicates and complementation for every word through length 9',()=>{
  const predicates={ends1:w=>w.endsWith('1'),contains1:w=>w.includes('1'),parity:w=>[...w].filter(c=>c==='1').length%2===0,alternate:w=>!w.includes('00')&&!w.includes('11'),penultimate:w=>w.length>=2&&w.at(-2)==='1'};
  for(const [key,predicate] of Object.entries(predicates)){const m=machines[key],complement={...m,accept:m.states.filter(s=>!m.accept.includes(s))};for(const w of binaryWords(9)){assert.equal(runDfa(m,w).accepted,predicate(w),`${key}: ${w}`);assert.notEqual(runDfa(m,w).accepted,runDfa(complement,w).accepted);}}
});
test('DFA builder detects missing transitions and handles arbitrary state labels',()=>{
  assert.equal(compareDfa(machines.ends1,machines.ends1).equal,true);
  const renamed={states:['X','Y'],alphabet:['0','1'],start:'X',accept:['Y'],transitions:{X:{0:'X',1:'Y'},Y:{0:'X',1:'Y'}}};
  assert.equal(compareDfa(renamed,machines.ends1).equal,true);
  assert.equal(compareDfa({...machines.ends1,accept:['A','B']},machines.ends1).word,'');
  assert.throws(()=>compareDfa({...machines.ends1,transitions:{}},machines.ends1));
});
test('curriculum is connected, unique and has usable assessment answers',()=>{
  const lids=new Set(lessons.map(l=>l.id));assert.equal(lids.size,19);
  assert.equal(new Set(allQuestions.map(q=>q.id)).size,allQuestions.length);
  assert.deepEqual(new Set(units.flatMap(u=>u.lessons)),lids);
  for(const l of lessons)assert.ok(questions.filter(q=>q.lesson===l.id).length>=3,l.id);
  for(const q of allQuestions){assert.ok(lids.has(q.lesson));const value=q.type==='set'?q.answer.length?`{${q.answer.map(w=>w||'ε').join(',')}}`:'∅':q.answer;assert.equal(grade(q,value),true,q.id);}
});
