import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {questions} from '../src/curriculum.js';
import {blankState,saveState,today,addDays} from '../src/progress.js';

test('168 due reviews can all be reached or split into explicit smaller rounds',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{
  url:'https://orbit.test/quiet-orbit-lab/#review',pretendToBeVisual:true
 });
 const w=dom.window,previous=new Map(),intervals=[];
 for(const [key,value] of Object.entries({
  window:w,document:w.document,location:w.location,navigator:w.navigator,
  Event:w.Event,matchMedia:()=>({matches:true})
 })){
  previous.set(key,Object.getOwnPropertyDescriptor(globalThis,key));
  Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};
 const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{
  intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();
  for(const [key,descriptor] of previous){
   if(descriptor)Object.defineProperty(globalThis,key,descriptor);
   else delete globalThis[key];
  }
 });
 const yesterday=addDays(today(),-1),state=blankState();
 assert.ok(questions.length>=168);
 for(const q of questions.slice(0,168))state.results[q.id]={
  attempts:1,correct:1,stage:1,due:yesterday,successes:[yesterday],
  everWrong:false,repaired:false,lastAdvance:yesterday
 };
 assert.ok(saveState(state,w.localStorage));
 await import('../src/app.js');
 const doc=w.document,el=selector=>{
  const node=doc.querySelector(selector);assert.ok(node,'Missing '+selector);return node;
 };
 const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
 const click=async selector=>{el(selector).click();await settle();};
 const go=async hash=>{w.location.hash=hash;await settle();};
 const change=async(selector,value)=>{
  el(selector).value=value;
  el(selector).dispatchEvent(new w.Event('change',{bubbles:true}));
  await settle();
 };
 const saved=()=>JSON.parse(w.localStorage.getItem('orbit-progress-v1'));
 assert.equal(el('.score').textContent.trim(),'168');
 assert.equal(el('#review-count').value,'all');
 assert.match(el('[data-action="review"]').textContent,/Alle 168 Wiederholungen starten/);
 await go('#');
 await click('[data-action="plan-next"]');
 assert.equal(w.location.hash,'#review');
 assert.equal(el('#review-count').value,'all');

 await change('#review-count','15');
 assert.match(el('[data-action="review"]').textContent,/15 von 168 Wiederholungen starten/);
 await click('[data-action="review"]');
 assert.match(el('.quiz-status').textContent,/1 \/ 15/);
 await go('#review');
 assert.equal(el('.score').textContent.trim(),'168');

 await change('#review-count','all');
 await click('[data-action="review"]');
 assert.match(el('.quiz-status').textContent,/1 \/ 168/);
 const first=questions[0];
 assert.equal(el('.quiz-card h1').textContent,first.prompt);
 await click('[data-action="select-answer"][data-index="'+first.answer+'"]');
 await click('[data-action="submit-answer"]');
 assert.equal(saved().results[first.id].attempts,2);
 await go('#review');
 assert.equal(el('.score').textContent.trim(),'167');
 assert.match(el('[data-action="review"]').textContent,/Alle 167 Wiederholungen starten/);

 await change('#review-count','60');
 await click('[data-action="review"]');
 assert.match(el('.quiz-status').textContent,/1 \/ 60/);
});
