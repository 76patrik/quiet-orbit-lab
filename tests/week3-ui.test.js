import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {week3Lessons} from '../src/week3-content.js';
import {validateImport,loadState} from '../src/progress.js';
test('week-three lessons, all workshops, remediation and exam submission through the app',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/#path/3',pretendToBeVisual:true});
 const w=dom.window,old=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  old.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [k,d] of old){if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k];}});
 await import('../src/app.js');
 const doc=w.document,el=s=>{const n=doc.querySelector(s);assert.ok(n,s);return n;};
 const settle=()=>new Promise(r=>setTimeout(r,0));const click=async s=>{el(s).click();await settle();};
 const go=async h=>{w.location.hash=h;await settle();};
 const fill=(s,v)=>{el(s).value=v;el(s).dispatchEvent(new w.Event('input',{bubbles:true}));};
 const saved=()=>validateImport(JSON.parse(w.localStorage.getItem('orbit-progress-v1')));
 assert.equal(doc.querySelectorAll('.lesson-tile').length,4);assert.ok(doc.querySelector('[data-id="week3-check"]'));
 for(const l of week3Lessons){await go('#lesson/'+l.id);assert.ok(doc.querySelector('.learning-visual'));assert.ok(doc.querySelector('a[href="#week3"]'));
  for(const mode of ['recall','method','reason']){await go(`#learn/${l.id}/${mode}`);assert.equal(doc.querySelector('.learn-solution'),null);assert.equal(doc.querySelector('.learning-visual'),null);
   if(mode==='method'){await click('[data-action="learn-level"][data-level="guided"]');assert.ok(doc.querySelector('.learn-scaffold'));await click('[data-action="learn-level"][data-level="faded"]');assert.equal(doc.querySelectorAll('.learn-scaffold li').length,1);await click('[data-action="learn-level"][data-level="solo"]');}
   fill('#learn-answer','Mein eigener Versuch mit Zwischenständen.');await click('[data-action="learn-hint"]');assert.equal(el('#learn-answer').value,'Mein eigener Versuch mit Zwischenständen.');await click('[data-action="learn-compare"]');assert.ok(doc.querySelector('.learn-solution'));assert.ok(doc.querySelector('.recovery'));
   if(mode==='method'){assert.ok(doc.querySelector('.learning-visual'));await click('[data-action="learning-visual-step"][data-dir="next"]');assert.equal(el('[data-visual-step]').dataset.visualStep,'1');}
   await click('[data-action="learn-save"]');assert.ok(saved().learning[`${l.id}:${mode}`].assisted);assert.equal(saved().completed[l.id],undefined);
  }
 }
 await go('#practice/nea');await click('[data-action="practice-single"][data-id="wk2-suffix-word-3"]');assert.equal(doc.querySelector('.recovery'),null);
 fill('#quiz-input','{p,q}');await click('[data-action="submit-answer"]');assert.match(el('.recovery-detail').textContent,/fehlen: \{\s*r\s*\}/);assert.ok(doc.querySelector('.nfa-feedback'));const prior=JSON.stringify(saved());
 await click('[data-recovery="nea"] [data-choice="0"]');assert.match(el('[data-recovery-result]').textContent,/Richtig/);assert.equal(JSON.stringify(saved()),prior);
 await go('#week3');assert.match(el('h1').textContent,/Grenzen verstehen/);assert.equal(doc.querySelectorAll('.learning-visual').length,4);
 for(const [set,id] of [['aufgaben','ab-1'],['altklausur','ak-1']]){
  await go(`#path/${set}`);
  const link=doc.querySelector('.wt-tile-link').getAttribute('href');
  const taskId=link.split('/').at(-1);
  await go(link);const before=saved();
  await click('[data-action="wt-complete"]');
  assert.ok(saved().walkthroughCompleted[taskId]);
  assert.deepEqual(saved().completed,before.completed);
  assert.deepEqual(saved().awards,before.awards);
  assert.ok(loadState(w.localStorage).state.walkthroughCompleted[taskId],'survives reload');
  assert.match(el('[data-action="wt-complete"]').textContent,/wieder öffnen/);
  await go(`#path/${set}`);
  assert.ok(doc.querySelector(`a[href="${link}"].is-complete`));
  assert.match(el('.wt-completion-count').textContent,/1\//);
  await go(link);await click('[data-action="wt-complete"]');
  assert.equal(saved().walkthroughCompleted[taskId],undefined);
  await go(`#path/${set}`);assert.equal(doc.querySelector('.is-complete'),null);
 }
 await go('#path/3');await click('[data-action="exam-start"][data-id="week3-check"]');assert.equal(saved().examAttempts.at(-1).examId,'week3-check');assert.equal(doc.querySelector('.recovery'),null);
 await click('[data-action="exam-jump"][data-index="7"]');fill('#exam-input','Meine CNF auf Papier.');assert.equal(doc.querySelector('.rubric'),null);
 await click('[data-action="exam-submit-review"]');await click('[data-action="exam-submit"]');assert.ok(doc.querySelector('.rubric'));assert.ok(doc.querySelector('.recovery'));assert.equal(saved().examAttempts.at(-1).answers['cnf-one'],'Meine CNF auf Papier.');
});
