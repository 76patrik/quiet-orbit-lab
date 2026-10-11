import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {exams,examById} from '../src/exams.js';
import {examSymbols} from '../src/symbol-keyboard.js';
import {week3Plan} from '../src/week3-plan.js';

test('keypads cover task alphabets and named set elements without reading solutions',()=>{
 for(const exam of exams)for(const q of exam.questions){
  const safe={...q};for(const key of ['answer','solution','rubric'])Object.defineProperty(safe,key,{get(){throw Error('Solution leak');}});
  const symbols=examSymbols(safe);
  assert.equal(new Set(symbols).size,symbols.length);
  if(['choice','number'].includes(q.type))assert.deepEqual(symbols,[]);
  if(q.type==='regex')for(const s of [...(q.alphabet||['0','1']),'(',')','|','*','ε'])assert.ok(symbols.includes(s),`${exam.id}/${q.id}: ${s}`);
  if(q.type==='set')for(const value of q.answer)for(const s of value)assert.ok(symbols.includes(s)||symbols.includes(value),`${exam.id}/${q.id}: ${value}`);
 }
 assert.equal(week3Plan.reduce((sum,s)=>sum+s.minutes,0),480);
});

test('real exam controller inserts, replaces, deletes and persists symbols before submission',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/#exams',pretendToBeVisual:true});
 const w=dom.window,old=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  old.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [key,descriptor] of old){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}});
 await import('../src/app.js');
 const doc=w.document,el=s=>{const n=doc.querySelector(s);assert.ok(n,s);return n;};
 const settle=()=>new Promise(r=>setTimeout(r,0));
 const click=async s=>{el(s).click();await settle();};
 const goto=async hash=>{w.location.hash=hash;await settle();};
 const saved=()=>JSON.parse(w.localStorage.getItem('orbit-progress-v1')).examAttempts;
 const fill=value=>{el('#exam-input').value=value;el('#exam-input').dispatchEvent(new w.Event('input',{bubbles:true}));};
 await click('[data-action="exam-start"][data-id="week2-check"]');
 const attemptHash=w.location.hash;
 assert.equal(doc.querySelector('.symbol-keyboard'),null); // numeric question
 await click('[data-action="exam-jump"][data-index="2"]');
 fill('{}');el('#exam-input').setSelectionRange(1,1);
 await click('[data-symbol="s"]');await click('[data-symbol=","]');await click('[data-symbol="u"]');
 assert.equal(el('#exam-input').value,'{s,u}');assert.equal(saved()[0].answers['nfa-start'],'{s,u}');
 el('#exam-input').setSelectionRange(1,4);await click('[data-symbol="∅"]');assert.equal(el('#exam-input').value,'{∅}');
 await click('[data-action="erase-symbol"]');assert.equal(el('#exam-input').value,'{}');
 await click('[data-action="clear-input"]');assert.equal(saved()[0].answers['nfa-start'],'');
 await click('[data-action="exam-jump"][data-index="6"]');
 assert.match(el('label.field').textContent,/\{a,b\}/);assert.equal(doc.querySelector('[data-symbol="0"]'),null);
 for(const symbol of ['b','a','(','a','|','b',')','*'])await click(`[data-symbol="${symbol}"]`);
 assert.equal(el('#exam-input').value,'ba(a|b)*');
 await goto('#exams');await goto(attemptHash);assert.equal(el('#exam-input').value,'ba(a|b)*');
 await click('[data-action="exam-jump"][data-index="7"]');fill('S');await click('[data-symbol="⇒"]');assert.equal(saved()[0].answers.grammar,'S⇒');
 fill('x'.repeat(4000));el('#exam-input').setSelectionRange(4000,4000);await click('[data-symbol="ε"]');assert.equal(el('#exam-input').value.length,4000);
 assert.equal(saved()[0].submittedAt,null);assert.equal(doc.querySelector('.rubric'),null);
 await goto('#exams');await click('[data-action="exam-start"][data-id="full-a"]');
 const tmIndex=examById['full-a'].questions.findIndex(q=>q.id==='tm-output');
 await click(`[data-action="exam-jump"][data-index="${tmIndex}"]`);await click('[data-symbol="0"]');await click('[data-symbol="1"]');
 assert.equal(el('#exam-input').value,'01');assert.ok(doc.querySelector('[data-symbol="□"]'));
 await goto('#path/3');assert.ok(doc.querySelector('#week3-plan-title'));assert.match(doc.body.textContent,/480 MINUTEN/);assert.match(doc.body.textContent,/noch nicht umgesetzt/);
});
