import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {validateImport} from '../src/progress.js';

test('week-two reader, labs and new alphabet work through the real application controller',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/quiet-orbit-lab/#week2/overview',pretendToBeVisual:true});
 const w=dom.window,old=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  old.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [key,d] of old){if(d)Object.defineProperty(globalThis,key,d);else delete globalThis[key];}});
 await import('../src/app.js');
 const doc=w.document,el=s=>{const node=doc.querySelector(s);assert.ok(node,s);return node;};
 const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
 const click=async s=>{el(s).click();await settle();};
 const go=async hash=>{w.location.hash=hash;await settle();};
 const change=async(s,value)=>{el(s).value=value;el(s).dispatchEvent(new w.Event('change',{bubbles:true}));await settle();};
 const saved=()=>validateImport(JSON.parse(w.localStorage.getItem('orbit-progress-v1')));
 assert.match(el('h1').textContent,/Lernskript Woche 2/);
 assert.equal(doc.querySelectorAll('.w2-chapters a').length,10);
 assert.ok(doc.querySelector('a[download][href$=".pdf"]'));

 await go('#week2/epsilon');
 assert.equal(saved().week2.lastChapter,'epsilon');
 assert.ok(!doc.querySelector('.w2-recall details').open);
 await click('[data-action="w2-read"]');assert.deepEqual(saved().week2.read,['epsilon']);
 assert.equal(el('[data-action="w2-read"]').getAttribute('aria-pressed'),'true');
 assert.deepEqual(saved().awards,{});
 await go('#week2/overview');assert.ok(el('a[href="#week2/epsilon"]').textContent.includes('weiterlesen'));
 await go('#week2/epsilon');assert.match(el('[data-action="w2-read"]').textContent,/Gelesen/);
 await go('#week2/loesungen');assert.equal(el('.w2-solutions').open,false);
 await go('#week2/not-a-chapter');assert.match(el('h1').textContent,/nicht gefunden/);

 await go('#week2-lab');
 assert.match(el('#w2-run-status').textContent,/\{p\}/);
 await click('[data-action="w2-step"]');assert.match(el('#w2-run-status').textContent,/\{p, q\}/);
 await change('[data-w2-select="nfa"]','original6');
 assert.match(el('#w2-run-status').textContent,/\{q0, q2\}/);
 await click('[data-action="w2-empty"]');assert.match(el('#w2-run-status').textContent,/vollständig gelesen: angenommen/);
 el('#w2-word').value='4242';await click('[data-action="w2-word"]');
 for(let i=0;i<4;i++)await click('[data-action="w2-step"]');
 assert.match(el('#w2-run-status').textContent,/∅.*abgelehnt/);assert.equal(el('[data-action="w2-step"]').disabled,true);
 el('#w2-word').value='1';await click('[data-action="w2-word"]');assert.equal(el('#w2-word-error').hidden,false);
 await change('[data-w2-select="min"]','variant');
 assert.match(el('#w2-min-lab').textContent,/U ist unerreichbar/);
 for(let i=0;i<2;i++)await click('[data-action="w2-min-next"]');
 assert.match(el('#w2-partition').textContent,/Stabilität bestätigt/);assert.match(el('#w2-partition').textContent,/3 Zustände/);
 assert.equal(el('[data-action="w2-min-next"]').disabled,true);
 assert.deepEqual(saved().awards,{});

 await go('#practice/regular-grammar');
 await click('[data-action="practice-single"][data-id="wk2-grammar-regex-0"]');
 assert.ok(el('[data-symbol="a"]'));assert.ok(el('[data-symbol="b"]'));assert.ok(el('[data-symbol="|"]'));
 assert.equal(doc.querySelector('.quiz-card [data-symbol="0"]'),null);
 assert.equal(doc.querySelector('.quiz-card [data-symbol="1"]'),null);
 assert.match(el('#quiz-input').placeholder,/a\|b/);
 el('#quiz-input').value='(a|b)*b';await click('[data-action="submit-answer"]');
 assert.match(el('.quiz-card .feedback').textContent,/Gegenbeispiel/);
 await go('#practice/regular-grammar');await click('[data-action="practice-single"][data-id="wk2-grammar-regex-0"]');
 el('#quiz-input').value='a(a|b)*b(a|b)*';await click('[data-action="submit-answer"]');
 assert.equal(saved().results['wk2-grammar-regex-0'].correct,1);
 await go('#practice/regular-grammar');await click('[data-action="practice-single"][data-id="wk2-grammar-regex-2"]');
 assert.ok(el('.quiz-card [data-symbol="0"]'));assert.ok(el('.quiz-card [data-symbol="1"]'));assert.ok(el('.quiz-card [data-symbol="|"]'));
 assert.equal(doc.querySelector('.quiz-card [data-symbol="a"]'),null);
 assert.equal(doc.querySelector('.quiz-card [data-symbol="b"]'),null);

 await go('#week2/overview');await change('#duration-week2-check','60');
 await click('[data-action="exam-start"][data-id="week2-check"]');
 assert.equal(saved().examAttempts.at(-1).examId,'week2-check');assert.equal(saved().examAttempts.at(-1).limitSeconds,3600);
 assert.equal(saved().examAttempts.at(-1).submittedAt,null);
 await go('#exams');assert.match(el('.content').textContent,/Wochencheck · Woche 2/);
 await go('#path');await click('[data-action="week"][data-week="2"]');assert.equal(doc.querySelectorAll('.lesson-tile').length,6);assert.ok(el('a[href="#week2/overview"]'));
});
