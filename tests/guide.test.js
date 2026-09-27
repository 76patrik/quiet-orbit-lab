import test from 'node:test';
import assert from 'node:assert/strict';
import {currentWeek,schedule,todayPlan,examNotices,topicsOfWeek} from '../src/guide.js';
import {blankState,recordAnswer,completeLesson,completeBuilder,rateCard} from '../src/progress.js';
import {lessons,units,questions} from '../src/curriculum.js';
import {cards} from '../src/games.js';
test('current week follows the calendar of the nine-week plan',()=>{
  assert.equal(currentWeek('2026-09-01').n,1);assert.equal(currentWeek('2026-09-26').n,1);assert.equal(currentWeek('2026-09-28').n,2);assert.equal(currentWeek('2026-11-20').n,9);assert.equal(currentWeek('2026-11-21'),null);
  assert.deepEqual(topicsOfWeek(2).map(t=>t.id),['nea','minimize','regular-grammar','kleene']);
});
test('schedule spreads week-one lessons over the week and flags what is behind',()=>{
  const s=blankState();assert.equal(schedule(s,'2026-09-21').expected,3);assert.equal(schedule(s,'2026-09-27').expected,lessons.length);
  for(const l of lessons.slice(0,3))completeLesson(s,l.id,'2026-09-21');assert.ok(schedule(s,'2026-09-21').onTrack);
  const w3=schedule(s,'2026-10-06');assert.ok(w3.missing.includes('nea')&&w3.missing.includes(lessons[3].id)&&!w3.missing.includes('pumping'));
});
test('fresh start: next lesson, a daily round and the weekly check',()=>{
  const plan=todayPlan(blankState(),'2026-09-26');assert.deepEqual(plan.steps.map(s=>s.id),['learn','daily','week']);
  assert.equal(plan.steps[0].href,'#lesson/'+lessons[0].id);assert.ok(plan.minutes>0);
});
test('due reviews come first, errors before cards, bosses once a unit is done',()=>{
  const s=blankState();recordAnswer(s,'m1',false,{day:'2026-09-25'});
  let plan=todayPlan(s,'2026-09-26');assert.deepEqual(plan.steps.slice(0,3).map(x=>x.id),['review','learn','fix']);
  recordAnswer(s,'m1',true,{day:'2026-09-26',review:true});plan=todayPlan(s,'2026-09-26');assert.equal(plan.steps[0].done,true);assert.ok(!plan.steps.some(x=>x.id==='fix'));
  for(const id of units[0].lessons)completeLesson(s,id,'2026-09-26');plan=todayPlan(s,'2026-09-26');
  const boss=plan.steps.find(x=>x.id==='boss');assert.equal(boss.actionId,units[0].id);
});
test('after week one the plan points to the open topic of the current week',()=>{
  const s=blankState();for(const l of lessons)completeLesson(s,l.id,'2026-09-27');s.bosses=Object.fromEntries(units.map(u=>[u.id,'2026-09-27']));
  const plan=todayPlan(s,'2026-09-29');assert.equal(plan.steps.find(x=>x.id==='learn').href,'#topic/nea');assert.equal(plan.week.n,2);
  const q=questions.find(q=>q.lesson==='nea');recordAnswer(s,q.id,true,{day:'2026-09-29'});assert.equal(todayPlan(s,'2026-09-29').steps.find(x=>x.id==='learn').href,'#topic/minimize');
});
test('weekly check step reflects score and required automata',()=>{
  const s=blankState();s.checks.push({date:'2026-09-26',score:8,seconds:300});completeBuilder(s,'ends1','2026-09-26');
  assert.equal(todayPlan(s,'2026-09-26').steps.find(x=>x.id==='week').done,false);completeBuilder(s,'alternate','2026-09-26');assert.equal(todayPlan(s,'2026-09-26').steps.find(x=>x.id==='week').done,true);
});
test('exam notices warn three weeks ahead, also about missing material',()=>{
  const s=blankState();assert.deepEqual(examNotices(s,'2026-09-26'),[]);
  const n=examNotices(s,'2026-11-10');assert.deepEqual(n.map(e=>e.id),['ti','fire']);assert.match(n[1].text,/Lernmaterialien fehlen/);
});
