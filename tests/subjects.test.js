import test from 'node:test';
import assert from 'node:assert/strict';
import {subjects,examDateOf,examSchedule,nextExam,daysUntil} from '../src/subjects.js';
import {blankState,validateImport} from '../src/progress.js';
test('three subjects with their exam dates; only TI has content',()=>{
  assert.deepEqual(subjects.map(s=>[s.id,s.examDate,s.status]),[['ti','2026-11-20','active'],['fire','2026-11-27','pending'],['vwl','2026-12-02','pending']]);
  const s=blankState();assert.equal(examDateOf(s,'fire'),'2026-11-27');assert.equal(examDateOf(s,'vwl'),'2026-12-02');assert.equal(examDateOf(s,'ti'),s.examDate);
});
test('exam schedule is sorted and next exam skips past dates',()=>{
  const s=blankState();assert.deepEqual(examSchedule(s,'2026-09-26').map(x=>x.id),['ti','fire','vwl']);
  assert.equal(nextExam(s,'2026-09-26').id,'ti');assert.equal(nextExam(s,'2026-11-21').id,'fire');assert.equal(nextExam(s,'2026-12-02').days,0);assert.equal(nextExam(s,'2026-12-03'),null);
  s.examDates.vwl='2026-11-01';assert.equal(examSchedule(s,'2026-09-26')[0].id,'vwl');assert.equal(daysUntil('2026-10-26','2026-10-25'),1);
});
test('old backups without examDates stay valid; bad examDates are rejected',()=>{
  const old=blankState();delete old.examDates;assert.deepEqual(validateImport(JSON.parse(JSON.stringify(old))).examDates,{fire:'2026-11-27',vwl:'2026-12-02'});
  const s=blankState();s.examDates.fire='2026-11-30';assert.equal(validateImport(structuredClone(s)).examDates.fire,'2026-11-30');
  for(const change of [x=>x.examDates='2026-11-27',x=>x.examDates.fire='27.11.2026',x=>x.examDates.unknown='2026-11-27',x=>x.examDates.ti='2026-11-20']){const bad=blankState();change(bad);assert.throws(()=>validateImport(bad));}
});
