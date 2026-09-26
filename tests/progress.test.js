import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState,recordAnswer,xpTotal,completeLesson,completeBuilder,dueQuestions,mastery,validateImport,streak,addDays,today,updateBadges,loadState,saveState} from '../src/progress.js';
test('XP cannot be farmed by repeated same-day answers or repeated completions',()=>{
  const s=blankState();for(let i=0;i<20;i++)recordAnswer(s,'m1',true,{day:'2026-09-26',review:true});assert.equal(xpTotal(s),10);assert.equal(s.activity['2026-09-26'].unique.length,1);
  completeLesson(s,'motivation');completeLesson(s,'motivation');assert.equal(xpTotal(s),35);
  completeBuilder(s,'ends1');completeBuilder(s,'ends1');assert.equal(xpTotal(s),85);
});
test('spaced review schedules 1,3,7,14 days and rewards only due reviews',()=>{
  const s=blankState();let d='2026-09-26';for(const interval of [1,3,7,14]){recordAnswer(s,'m1',true,{day:d,review:true});assert.equal(s.results.m1.due,addDays(d,interval));d=s.results.m1.due;}
  assert.equal(xpTotal(s),25);assert.equal(dueQuestions(s,'2026-09-26').length,0);
});
test('hints do not award XP or independent evidence; failures become review entries',()=>{
  const s=blankState();recordAnswer(s,'m1',true,{assisted:true,day:'2026-09-26'});assert.equal(xpTotal(s),0);assert.deepEqual(s.results.m1.successes,[]);assert.equal(dueQuestions(s,'2026-09-26').length,1);
  recordAnswer(s,'m2',false,{day:'2026-09-26'});recordAnswer(s,'m2',true,{day:'2026-09-27'});assert.equal(s.errors.m2.resolved,true);assert.ok(s.badges.includes('repair'));
});
test('mastery requires two distinct questions on different days and no unresolved error',()=>{
  const s=blankState();recordAnswer(s,'m1',true,{day:'2026-09-26'});recordAnswer(s,'m2',true,{day:'2026-09-26'});assert.equal(mastery(s,'motivation'),'learning');
  recordAnswer(s,'m2',true,{day:'2026-09-27'});assert.equal(mastery(s,'motivation'),'safe');recordAnswer(s,'m3',false,{day:'2026-09-27'});assert.equal(mastery(s,'motivation'),'learning');
});
test('weekly badge requires both constructions plus the assessment threshold',()=>{
  const s=blankState();s.checks.push({date:'2026-09-26',score:8,seconds:500});updateBadges(s);assert.ok(!s.badges.includes('check'));completeBuilder(s,'ends1');assert.ok(!s.badges.includes('check'));completeBuilder(s,'alternate');assert.ok(s.badges.includes('check'));
});
test('streak dates use Europe/Berlin and calendar days over DST',()=>{
  assert.equal(today(new Date('2026-09-26T23:00:00Z')),'2026-09-27');assert.equal(addDays('2026-10-25',1),'2026-10-26');
  const s=blankState();for(const d of ['2026-09-24','2026-09-25','2026-09-26'])recordAnswer(s,'m1',true,{day:d});assert.equal(streak(s,'2026-09-27'),3);assert.equal(streak(s,'2026-09-28'),0);
});
test('backup roundtrip retains learning evidence and rejects malformed imports',()=>{
  const s=blankState();recordAnswer(s,'m1',false,{day:'2026-09-26'});recordAnswer(s,'m1',true,{day:'2026-09-27'});completeLesson(s,'motivation');s.notes.motivation='<script>not executable</script>';
  assert.deepEqual(validateImport(JSON.parse(JSON.stringify(s))),s);
  for(const change of [x=>x.version=2,x=>x.results.m1.correct=-1,x=>x.completed.unknown='2026-09-26',x=>x.results.m1.successes=['yesterday'],x=>x.awards['solve:m1'].xp=999,x=>x.examDate='2026-02-30']){const bad=structuredClone(s);change(bad);assert.throws(()=>validateImport(bad));}
  assert.throws(()=>validateImport(JSON.parse('{"version":1,"__proto__":{"polluted":true}}')));assert.equal({}.polluted,undefined);
});
test('storage failures preserve an explicit error instead of a false success',()=>{
  const broken={getItem:()=>'{broken',setItem:()=>{throw Error('Quota');}};assert.ok(loadState(broken).error);assert.equal(saveState(blankState(),broken),false);
});
