import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {lessonsOfWeek,questions} from '../src/curriculum.js';
import {answerText} from '../src/training-hints.js';
import {validateImport,loadState} from '../src/progress.js';

test('both weeks share the interactive path and all six new lessons save real progress',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/quiet-orbit-lab/#path/2',pretendToBeVisual:true});
 const w=dom.window,old=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  old.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [key,d] of old){if(d)Object.defineProperty(globalThis,key,d);else delete globalThis[key];}});
 await import('../src/app.js');
 const doc=w.document,el=s=>{const node=doc.querySelector(s);assert.ok(node,s);return node;};
 // Native anchor navigation schedules the URL change, then the hashchange event.
 const settle=async()=>{await new Promise(resolve=>setTimeout(resolve,0));await new Promise(resolve=>setTimeout(resolve,0));};
 const click=async s=>{el(s).click();await settle();};
 const go=async hash=>{w.location.hash=hash;await settle();};
 const saved=()=>validateImport(JSON.parse(w.localStorage.getItem('orbit-progress-v1')));
 assert.equal(doc.querySelectorAll('.card.unit .lesson-grid .lesson-tile').length,6);
 assert.equal(doc.querySelectorAll('.card.unit').length,3);
 assert.equal(el('[data-week="2"]').getAttribute('aria-pressed'),'true');
 assert.deepEqual([...doc.querySelectorAll('.lesson-num')].map(n=>n.textContent.trim()),['01','02','03','04','05','06']);
 assert.match(el('.week-meta').textContent,/0\/6 Lektionen/);
 assert.equal(el('a[href="#week2/overview"]').textContent,'Skript öffnen');
 assert.ok(el('a[download][href="./assets/Lernskript_Woche_2_Theoretische_Informatik.pdf"]'));
 await click('[data-week="1"]');assert.equal(w.location.hash,'#path/1');
 assert.equal(doc.querySelectorAll('.card.unit .lesson-grid .lesson-tile').length,19);
 assert.equal(doc.querySelectorAll('.card.unit').length,5);assert.match(el('.week-meta').textContent,/0\/19 Lektionen/);
 const scriptLink=el('a[href="./assets/Lernskript_Woche_1_Theoretische_Informatik.pdf"]:not([download])');
 assert.equal(scriptLink.textContent,'Skript öffnen');assert.equal(scriptLink.target,'_blank');assert.ok(scriptLink.relList.contains('noopener'));
 assert.equal(el('a[download][href="./assets/Lernskript_Woche_1_Theoretische_Informatik.pdf"]').textContent,'PDF herunterladen');
 assert.equal(el('a[href="#lab"].btn').textContent,'Lernlabore');
 await click('[data-week="2"]');assert.equal(w.location.hash,'#path/2');

 for(const l of lessonsOfWeek(2)){
  await click(`.lesson-tile[href="#lesson/${l.id}"]`);
  assert.equal(el('h1').textContent,l.title);assert.match(el('.reading > .eyebrow').textContent,/WOCHE 2 · LEKTION/);
  assert.equal(el('.back-link').getAttribute('href'),'#path/2');
  assert.ok(el('.lesson-method details'));assert.ok(el(`a[href="#practice/${l.id}"]`));
  el('#lesson-note').value=`Meine eigene Erklärung: ${l.id}`;
  await click('[data-action="save-note"]');assert.equal(saved().notes[l.id],`Meine eigene Erklärung: ${l.id}`);
  await click('[data-action="lesson-quiz"]');assert.match(el('.quiz-status').textContent,/1 \/ 8/);
  for(let i=0;i<8;i++){
   const q=questions.find(q=>q.lesson===l.id&&q.prompt===el('#question-title').textContent);assert.ok(q);
   if(q.type==='choice')await click(`[data-action="select-answer"][data-index="${q.answer}"]`);
   else el('#quiz-input').value=answerText(q);
   await click('[data-action="submit-answer"]');assert.match(el('.quiz-card .feedback').textContent,/✓ Richtig gelöst/);
   if(i===6){assert.ok(saved().completed[l.id]);assert.match(el('.completed-stamp').textContent,/Lektion abgeschlossen/);}
   await click('[data-action="next-question"]');
  }
  assert.ok(el('.quiz-result'));assert.ok(el('.quiz-result a[href="#path/2"]'));
  await click('.quiz-result a[href="#path/2"]');assert.ok(el(`.lesson-tile[href="#lesson/${l.id}"] .lesson-num.current`));
 }
 assert.match(el('.week-meta').textContent,/6\/6 Lektionen/);
 assert.deepEqual([...doc.querySelectorAll('.unit-head .pill')].map(n=>n.textContent),['2/2','2/2','2/2']);
 const reloaded=loadState(w.localStorage);assert.equal(reloaded.error,null);assert.equal(Object.keys(reloaded.state.completed).length,6);
 await go('#lesson/epsilon');assert.equal(el('#lesson-note').value,'Meine eigene Erklärung: epsilon');
 await click('[data-action="lesson-lab"]');assert.equal(w.location.hash,'#week2-lab');assert.equal(el('[data-w2-select="nfa"]').value,'original6');
 await go('#lesson/minimize');await click('[data-action="lesson-lab"]');assert.equal(el('[data-w2-select="min"]').value,'original7');
 await go('#week2');assert.equal(doc.querySelectorAll('.lesson-tile').length,6);
 await click('a[href="#week2/overview"]');assert.match(el('h1').textContent,/Lernskript Woche 2/);
 await go('#stats');assert.match(el('.stats-grid').textContent,/6\/25/);
 await go('#path/1');assert.match(el('.week-meta').textContent,/0\/19 Lektionen/);
 await go('#path/2');await click('[data-action="exam-start"][data-id="week2-check"]');
 assert.equal(saved().examAttempts.at(-1).examId,'week2-check');assert.equal(saved().examAttempts.at(-1).limitSeconds,3600);
 await go('#path/2');await click('[data-action="exam-start"][data-id="week2-check"]');assert.equal(saved().examAttempts.length,1,'an existing check is resumed');
 await go('#play');assert.equal(doc.querySelectorAll('.boss-card').length,8);assert.ok(el('[data-action="start-boss"][data-id="w2-laeufe"]'));
 await go('#path/999');assert.match(el('h1').textContent,/Hier ist noch kein Lernpfad/);
});
