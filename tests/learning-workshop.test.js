import test from 'node:test';import assert from 'node:assert/strict';
import {learningContracts,chomskyRows} from '../src/learning-contracts.js';
import {blankState,validateImport,xpTotal} from '../src/progress.js';
import {recordLearning,validateLearning,evidenceStatus} from '../src/learning-evidence.js';
import {allTopics,lessons,lessonsOfWeek} from '../src/curriculum.js';
import {nextLearningStep} from '../src/learning-next.js';
import {createActivityClock,tickActivityClock,lessonTime} from '../src/learning-time.js';
import {learningWorkshop} from '../src/learning-workshop.js';
import {JSDOM} from 'jsdom';
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
test('all topics have concrete recall, complete method tasks and reasoning',()=>{for(const t of allTopics){const c=learningContracts[t.id];assert.ok(c,t.id);assert.ok(c.recall[1].length>30);assert.ok(c.method.steps.length>=3);assert.ok(c.reason.solution.length>20);for(const mode of ['recall','method','reason'])assert.ok(new JSDOM(learningWorkshop(t.id,mode,blankState(),esc)).window.document.querySelector('[data-learn-id]'));}assert.equal(chomskyRows.length,4);assert.ok(chomskyRows.every(r=>r.length===6));});
test('learning evidence is backwards compatible, separate, and repeated only across days',()=>{const s=blankState(),legacy=JSON.parse(JSON.stringify(s));delete legacy.learning;assert.deepEqual(validateImport(legacy).learning,{});const data={score:3,max:3,assisted:false,answer:'Lösung',day:'2026-10-03'};recordLearning(s,'dfa:method',data);recordLearning(s,'dfa:method',data);assert.deepEqual(s.learning['dfa:method'].days,['2026-10-03']);assert.equal(s.learning['dfa:method'].due,'2026-10-04');assert.equal(xpTotal(s),0);assert.deepEqual(s.completed,{});recordLearning(s,'dfa:method',{...data,day:'2026-10-04'});assert.equal(s.learning['dfa:method'].due,'2026-10-07');assert.equal(evidenceStatus(s,'dfa','method','2026-10-04').className,'done');recordLearning(s,'dfa:method',{...data,assisted:true,day:'2026-10-05'});assert.equal(evidenceStatus(s,'dfa','method','2026-10-05').className,'open');assert.deepEqual(validateImport(JSON.parse(JSON.stringify(s))).learning,s.learning);assert.throws(()=>validateLearning({'__proto__:method':{}}));assert.throws(()=>validateLearning({'dfa:method':{...s.learning['dfa:method'],score:99}}));});
test('completion links advance within weeks, across weeks, and handle the end',()=>{const s=blankState();s.completed.motivation='2026-10-03';assert.equal(nextLearningStep(s,{lessonId:'motivation'}).href,'#lesson/complexity');for(const l of lessonsOfWeek(1))s.completed[l.id]='2026-10-03';assert.equal(nextLearningStep(s,{lessonId:'transfer'}).href,'#lesson/nea');for(const l of lessonsOfWeek(2))s.completed[l.id]='2026-10-03';assert.equal(nextLearningStep(s,{lessonId:'kleene'}).href,'#path/3');assert.equal(nextLearningStep(s,{week:9}).href,'#exams');});
test('active timer excludes time on other pages and hidden tabs',()=>{const c=createActivityClock(0);tickActivityClock(c,1000,true);assert.equal(tickActivityClock(c,6000,false),5);assert.equal(tickActivityClock(c,66000,true),5);assert.equal(tickActivityClock(c,71000,false),10);for(const l of lessons){const t=lessonTime(l);assert.ok(t.min>l.minutes&&t.max>t.min);}});

test('independent workshop automata match their stated language, not the earlier lesson examples',async()=>{
 const {methodMachines}=await import('../src/learning-method-models.js');const {runDfa,binaryWords}=await import('../src/engine.js');
 for(const w of binaryWords(5)){
  assert.equal(runDfa(methodMachines.dfa,w).accepted,w.endsWith('1'));
  assert.equal(runDfa(methodMachines.parity,w).accepted,[...w].filter(c=>c==='0').length%2===0);
  assert.equal(runDfa(methodMachines.grammar,w).accepted,/^1*0$/.test(w));
  assert.equal(runDfa(methodMachines.determinize,w).accepted,w.endsWith('10'));
  assert.equal(runDfa(methodMachines.minimize,w).accepted,w.length>=2&&w.endsWith('1'));
  const a=w.replaceAll('0','a').replaceAll('1','b');
  assert.equal(runDfa(methodMachines.alternate,a).accepted,!a.includes('aa'));
  assert.equal(runDfa(methodMachines.complement,a).accepted,!/^a+$/.test(a));
  assert.equal(runDfa(methodMachines['regular-grammar'],a).accepted,a.startsWith('b')&&a.includes('a'));
 }
});
