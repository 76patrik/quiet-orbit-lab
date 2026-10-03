import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {questions,questionById} from '../src/curriculum.js';
import {answerText} from '../src/training-hints.js';

// Exercise the actual app controller and DOM, including saving after button clicks.
// JSDOM does not replace a visual viewport check on a physical mobile browser.
test('training flows: full selection, symbols, hints, retry, immediate checkmarks and saved evidence',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/quiet-orbit-lab/#practice/sets',pretendToBeVisual:true});
 const w=dom.window,oldGlobals=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  oldGlobals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};
 const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [key,descriptor] of oldGlobals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}});
 await import('../src/app.js');
 const doc=w.document,el=selector=>{const node=doc.querySelector(selector);assert.ok(node,`Missing ${selector}`);return node;};
 const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
 const click=async selector=>{el(selector).click();await settle();};
 const change=async(selector,value)=>{el(selector).value=value;el(selector).dispatchEvent(new w.Event('change',{bubbles:true}));await settle();};
 const goto=async hash=>{w.location.hash=hash;await settle();};
 const saved=()=>JSON.parse(w.localStorage.getItem('orbit-progress-v1'));
 const fill=value=>{el('#quiz-input').value=value;el('#quiz-input').dispatchEvent(new w.Event('input',{bubbles:true}));};
 const start=async id=>{await goto('#practice/'+questionById[id].lesson);await click(`[data-action="practice-single"][data-id="${id}"]`);};
 const answer=async id=>{const q=questionById[id];if(q.type==='choice')await click(`[data-action="select-answer"][data-index="${q.answer}"]`);else fill(answerText(q));await click('[data-action="submit-answer"]');};

 await t.test('all 45 set exercises and individual selections are reachable',async()=>{
  const total=questions.filter(q=>q.lesson==='sets').length;assert.equal(total,45);
  assert.equal(doc.querySelectorAll('[data-practice-select]').length,total);
  assert.equal(el('[data-practice-filter="count"]').value,'all');
  assert.match(el('[data-action="practice-start"]').textContent,/45/);
  await click('#practice-picker summary');
  await click('[data-action="practice-select-all"]');
  assert.equal(doc.querySelectorAll('[data-practice-select]:checked').length,45);
  assert.equal(el('#practice-picker').open,true);
  await click('[data-action="practice-selected"]');
  assert.match(el('.quiz-status').textContent,/1 \/ 45/);
  assert.equal(doc.querySelector('.confidence'),null);
  await goto('#practice');assert.ok(doc.querySelector('.practice-resume'));
  await change('[data-practice-filter="search"]','s1');
  const available=doc.querySelectorAll('[data-practice-select]').length;
  assert.ok(available>0&&available<45);
  assert.equal(doc.querySelectorAll('[data-practice-select]:checked').length,0);
  await click('[data-action="practice-reset"]');
  assert.equal(doc.querySelectorAll('[data-practice-select]').length,questions.length);
 });

 await t.test('binary buttons edit at the cursor, clear, and Enter records once',async()=>{
  await start('co1');fill('{}');el('#quiz-input').setSelectionRange(1,1);
  await click('[data-symbol="0"]');assert.equal(el('#quiz-input').value,'{0}');
  await click('[data-symbol="1"]');assert.equal(el('#quiz-input').value,'{01}');
  await click('[data-action="erase-symbol"]');assert.equal(el('#quiz-input').value,'{0}');
  await click('[data-action="clear-input"]');assert.equal(el('#quiz-input').value,'');
  await click('[data-action="submit-answer"]');assert.match(el('#quiz-error').textContent,/zuerst eine Antwort/);
  assert.equal(saved()?.results.co1,undefined);
  fill('{1,01,001}');el('#quiz-input').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await settle();
  assert.match(el('.quiz-card .feedback').textContent,/✓ Richtig gelöst/);
  assert.equal(saved().results.co1.attempts,1);
  el('#quiz-input').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
  assert.equal(saved().results.co1.attempts,1);
  await click('[data-action="next-question"]');assert.ok(doc.querySelector('.quiz-result'));
 });

 await t.test('task-specific alphabet and regex | buttons work through the real DOM',async()=>{
  const key=s=>doc.querySelector(`.quiz-card [data-symbol="${s}"]`);
  await start('variant-build-regex-0');
  assert.ok(key('0'));assert.ok(key('1'));assert.ok(key('|'));
  assert.equal(key('a'),null);assert.equal(key('b'),null);
  fill('(0)');el('#quiz-input').setSelectionRange(2,2);
  await click('.quiz-card [data-symbol="|"]');assert.equal(el('#quiz-input').value,'(0|)');
  await click('.quiz-card [data-symbol="1"]');assert.equal(el('#quiz-input').value,'(0|1)');
  await start('e2');
  assert.ok(key('a'));assert.ok(key('b'));
  assert.equal(key('0'),null);assert.equal(key('1'),null);
  assert.match(el('#quiz-input').placeholder,/a, ab/);
  await start('a1');
  assert.ok(key('0'));assert.ok(key('1'));
  assert.equal(key('a'),null);assert.equal(key('b'),null);
  await goto('#lab/regex');
  const input=el('#regex-expression');input.value='(0)';input.setSelectionRange(2,2);
  await click('[data-target="regex-expression"][data-symbol="|"]');
  assert.equal(input.value,'(0|)');
 });

 await t.test('concrete hints keep the draft, precede the solution and lead to a clean retry',async()=>{
  await start('co2');fill('aa');
  const input=el('#quiz-input'),action=el('[data-action="submit-answer"]');
  assert.ok(input.compareDocumentPosition(action)&w.Node.DOCUMENT_POSITION_FOLLOWING);
  await click('[data-action="hint"]');assert.equal(el('#quiz-input').value,'aa');
  assert.match(el('.training-hints').textContent,/B links/);
  assert.doesNotMatch(el('.training-hints').textContent,/Ergebnis:/);
  await click('[data-action="hint"]');assert.match(el('.training-hints').textContent,/Ergebnis:/);
  assert.ok(el('[data-action="submit-answer"]').compareDocumentPosition(el('.training-hints'))&w.Node.DOCUMENT_POSITION_FOLLOWING);
  await answer('co2');assert.equal(saved().results.co2.successes.length,0);
  assert.match(el('.quiz-card .feedback').textContent,/Richtig mit Unterstützung/);
  await click('[data-action="next-question"]');await click('[data-action="retry-round"]');
  assert.equal(el('#quiz-input').value,'');assert.equal(doc.querySelector('.training-hints'),null);
  await answer('co2');assert.equal(saved().results.co2.successes.length,1);
  assert.equal(saved().errors.co2.resolved,true);
 });

 await t.test('seven distinct successes earn the lesson checkmark before ending the last round',async()=>{
  const ids=questions.filter(q=>q.lesson==='sets').slice(0,7).map(q=>q.id);
  for(const id of ids){await start(id);await answer(id);}
  assert.ok(saved().completed.sets);assert.equal(saved().awards['lesson:sets'].xp,25);
  assert.match(el('.quiz-card .completed-stamp').textContent,/✓ Lektion abgeschlossen/);
  await goto('#practice/sets');
  const solvedRow=el('[data-practice-select="s1"]').closest('.task-row');assert.match(solvedRow.textContent,/✓ Ohne Hilfe gelöst/);
  await change('[data-practice-filter="status"]','open');assert.equal(doc.querySelector('[data-practice-select="s1"]'),null);
  await change('[data-practice-filter="status"]','new');assert.equal(doc.querySelectorAll('[data-practice-select]').length,38);
  await goto('#path');await click('[data-action="week"][data-week="1"]');
  assert.ok(el('a.lesson-tile[href="#lesson/sets"] .lesson-num.current'));
 });

 await t.test('a parse error remains editable, and wrong answers can be retried',async()=>{
  await start('a1');fill('{');await click('[data-action="submit-answer"]');
  assert.ok(el('#quiz-error').textContent.length);assert.equal(saved().results.a1,undefined);
  fill('{00}');await click('[data-action="submit-answer"]');
  assert.equal(saved().results.a1.correct,0);assert.match(el('.feedback.error').textContent,/Richtige Antwort/);
  await click('[data-action="next-question"]');await click('[data-action="retry-round"]');await answer('a1');
  assert.equal(saved().results.a1.attempts,2);assert.equal(saved().errors.a1.resolved,true);
 });
 await t.test('wrong DEA answers reveal synchronized visuals in training, results and review',async()=>{
  await start('d3');assert.equal(doc.querySelector('[data-dfa-feedback]'),null);
  await click('[data-action="select-answer"][data-index="0"]');await click('[data-action="submit-answer"]');
  assert.ok(el('.dfa-transition-table'));assert.equal(el('.dfa-node.is-current').dataset.state,'A');
  assert.equal(el('[data-dfa-feedback]').closest('details'),null);
  const before=JSON.stringify(saved());
  await click('[data-dfa-feedback] [data-step="2"]');assert.equal(el('.dfa-node.is-current').dataset.state,'B');
  assert.equal(el('.dfa-active-cell').textContent,'B');assert.equal(JSON.stringify(saved()),before);
  assert.equal(doc.activeElement.dataset.step,'2');
  await click('[data-action="next-question"]');assert.ok(el('.quiz-result'));assert.ok(el('[data-dfa-feedback]'));
  await goto('#review');assert.ok(el('[data-dfa-id="review-d3"]'));assert.equal(el('[data-dfa-id="review-d3"]').closest('details'),null);
  await start('variant-run-contains1-eps');await click('[data-action="skip"]');
  assert.equal(doc.querySelectorAll('[data-dfa-feedback] [data-step]').length,1);
  assert.match(el('.dfa-run-status').textContent,/ε wird abgelehnt/);
  await start('d3');await answer('d3');assert.ok(el('[data-dfa-feedback]'));
  await click('[data-action="next-question"]');assert.ok(el('[data-dfa-id="result-d3"]'));
 });

 await t.test('builder mistakes show both machines without awarding independent credit after a solution',async()=>{
  const {machines}=await import('../src/engine.js');
  await goto('#lab/builder');
  for(const input of doc.querySelectorAll('[data-builder-state]')){input.value='A';input.dispatchEvent(new w.Event('change',{bubbles:true}));}
  await click('[data-action="builder-check"]');
  assert.equal(doc.querySelectorAll('#builder-output [data-dfa-feedback]').length,2);
  assert.match(el('#builder-output').textContent,/Gegenbeispiel: 1/);
  const fillBuilder=()=>{
    for(const input of doc.querySelectorAll('[data-builder-state]')){input.value=machines.ends1.transitions[input.dataset.builderState][input.dataset.builderChar];input.dispatchEvent(new w.Event('change',{bubbles:true}));}
    for(const input of doc.querySelectorAll('[data-builder-accept]')){input.checked=machines.ends1.accept.includes(input.dataset.builderAccept);input.dispatchEvent(new w.Event('change',{bubbles:true}));}
  };
  fillBuilder();await click('[data-action="builder-check"]');
  assert.match(el('#builder-output').textContent,/mit Unterstützung/);assert.equal(saved().builders.ends1,undefined);
  await click('[data-action="builder-reset"]');await click('[data-action="builder-check"]');
  assert.ok(el('#builder-output .dfa-transition-table'));assert.match(el('#builder-output').textContent,/fehlt/);
  await click('[data-action="builder-reset"]');fillBuilder();await click('[data-action="builder-check"]');
  assert.ok(saved().builders.ends1);assert.ok(el('#builder-output .dfa-transition-table'));assert.match(el('#builder-output').textContent,/Dein korrekter DEA/);
 });

 await t.test('shared lesson examples display their own DEA and replay without earning progress',async()=>{
  // Opening a lesson updates the existing navigation bookmark, not learning evidence.
  const evidence=()=>{const {lastLesson,...rest}=saved();return JSON.stringify(rest);};
  const before=evidence();
  await goto('#lesson/dfa');
  const panel=el('.worked-example [data-dfa-feedback]');assert.equal(panel.closest('details'),null);
  assert.equal(el('.worked-example .dfa-node.is-current').dataset.state,'N');
  await click('.worked-example [data-step="1"]');assert.equal(el('.worked-example .dfa-node.is-current').dataset.state,'Z');
  assert.equal(el('.worked-example .dfa-active-cell').textContent,'Z');
  await goto('#lesson/parity');assert.equal(el('.worked-example .dfa-node.is-current').dataset.state,'r0');
  await click('.worked-example [data-step="1"]');assert.equal(el('.worked-example .dfa-node.is-current').dataset.state,'r1');
  await goto('#lesson/minimize');assert.equal(doc.querySelectorAll('.worked-example .dfa-transition-table').length,2);
  await goto('#lesson/sets');assert.equal(doc.querySelector('.worked-example [data-dfa-feedback]'),null);
  assert.equal(evidence(),before);
 });

 await t.test('learning pictures work in lessons and later topics without awarding progress',async()=>{
  const evidence=()=>{const {lastLesson,...rest}=saved();return JSON.stringify(rest);};
  const before=evidence();
  for(const route of ['#lesson/sets','#lesson/epsilon','#topic/cyk','#topic/tm','#topic/reduction']){
   await goto(route);
   assert.equal(el('[data-learning-visual]').dataset.visualStep,'0');
   await click('[data-learning-visual] [data-dir="next"]');
   assert.equal(el('[data-learning-visual]').dataset.visualStep,'1');
   assert.ok(doc.activeElement.closest('[data-learning-visual]'));
   await click('[data-learning-visual] [data-dir="reset"]');
   assert.equal(el('[data-learning-visual]').dataset.visualStep,'0');
  }
  for(let week=1;week<=9;week++){
   await goto('#path/'+week);assert.ok(doc.querySelector('.lv-route a'));
  }
  assert.equal(evidence(),before);
 });

 await t.test('workshops submit before reveal, persist self-ratings, and retain hint use',async()=>{
  await goto('#learn/dfa/reason');
  assert.equal(doc.querySelector('.learn-solution'),null);
  await click('[data-action="learn-compare"]');assert.match(el('#learn-status').textContent,/zuerst/);
  el('#learn-answer').value='Der Zustand nach dem letzten Zeichen entscheidet.';
  el('#learn-answer').dispatchEvent(new w.Event('input',{bubbles:true}));
  await click('[data-action="learn-hint"]');
  el('#learn-assisted').checked=false;el('#learn-assisted').dispatchEvent(new w.Event('change',{bubbles:true}));
  await click('[data-action="learn-compare"]');assert.equal(el('#learn-answer').readOnly,true);
  for(const cb of doc.querySelectorAll('[data-learn-mark]')){cb.checked=true;cb.dispatchEvent(new w.Event('change',{bubbles:true}));}
  const xp=JSON.stringify(saved().awards);
  await click('[data-action="learn-save"]');assert.equal(saved().learning['dfa:reason'].assisted,true);
  assert.equal(JSON.stringify(saved().awards),xp);
  await goto('#learn-review');assert.match(el('.learn-review-card').textContent,/mit Hilfe/);
  await goto('#learn/hierarchy/recall');
  await click('[data-action="learn-table-mode"][data-level="all"]');
  assert.equal(doc.querySelectorAll('[data-chomsky-cell]').length,20);
  assert.equal(doc.querySelector('.chomsky-expected'),null);
  for(const cell of doc.querySelectorAll('[data-chomsky-cell]')){cell.value='weiß ich nicht';cell.dispatchEvent(new w.Event('input',{bubbles:true}));}
  await click('[data-action="learn-compare"]');assert.equal(doc.querySelectorAll('.chomsky-expected').length,20);
  await click('[data-action="learn-save"]');assert.equal(saved().learning['hierarchy:table-all'].score,0);
  await goto('#learn/sets/method');assert.equal(doc.querySelector('.learn-scaffold'),null);
  await click('[data-action="learn-level"][data-level="faded"]');assert.equal(doc.querySelectorAll('.learn-scaffold li').length,1);
 });

});
