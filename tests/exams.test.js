import test from 'node:test';
import assert from 'node:assert/strict';
import {exams,examById,examSections} from '../src/exams.js';
import {createAttempt,setExamAnswer,submitAttempt,rateCriterion,remainingSeconds,examReport,validateExamAttempts,correctAnswer} from '../src/exam-engine.js';
import {blankState,validateImport,updateBadges} from '../src/progress.js';
import {setLabel} from '../src/engine.js';
const fill=(a)=>{for(const q of examById[a.examId].questions)setExamAnswer(a,q.id,q.type==='open'?'Mein Lösungsweg':q.type==='set'?setLabel(q.answer):String(q.answer));};
test('seven distinct exam variants have consistent points and complete rubrics',()=>{
 assert.equal(exams.length,7);assert.equal(new Set(exams.map(e=>e.id)).size,7);
 for(const e of exams){assert.equal(new Set(e.questions.map(q=>q.id)).size,e.questions.length);assert.equal(e.questions.reduce((s,q)=>s+q.points,0),e.points);for(const q of e.questions){assert.ok(q.solution);if(q.type==='open')assert.equal(q.rubric.reduce((s,r)=>s+r.points,0),q.points);}
  if(e.kind==='full')assert.deepEqual(examSections.map(s=>e.questions.filter(q=>q.section===s).reduce((n,q)=>n+q.points,0)),[8,10,7,15,10,10]);
 }
 const signatures=exams.filter(e=>e.kind==='full').map(e=>e.questions.map(q=>q.prompt).join('\n'));assert.equal(new Set(signatures).size,3);
});
test('answers persist on each change, submission locks answers and reports never expose early solutions',()=>{
 const a=createAttempt('mini-1',{now:1000});setExamAnswer(a,'count','64');a.index=2;a.flags=['set'];
 const restored=validateExamAttempts(JSON.parse(JSON.stringify([a])))[0];assert.equal(restored.answers.count,'64');assert.equal(restored.index,2);assert.deepEqual(restored.flags,['set']);
 assert.throws(()=>examReport(a));assert.throws(()=>rateCriterion(a,'explain',0,1));submitAttempt(a,21000);assert.equal(submitAttempt(a,22000),false);assert.throws(()=>setExamAnswer(a,'count','0'));
 assert.equal(examReport(a).autoPoints,2);assert.equal(examReport(a).total,2);
});
test('automatic and self-rated marks are separate; no blank answer earns points',()=>{
 for(const e of exams){
  const a=createAttempt(e.id,{now:1000});fill(a);submitAttempt(a,2000);const first=examReport(a);assert.equal(first.autoPoints,first.autoMax);assert.equal(first.selfPoints,0);assert.equal(first.pendingPoints,first.selfMax);assert.equal(first.complete,false);
  for(const q of e.questions.filter(q=>q.type==='open'))q.rubric.forEach((r,i)=>rateCriterion(a,q.id,i,r.points));
  const final=examReport(a);assert.equal(final.total,e.points);assert.equal(final.complete,true);assert.equal(validateExamAttempts([a])[0].ratings[e.questions.find(q=>q.type==='open').id][0],e.questions.find(q=>q.type==='open').rubric[0].points);
 }
 const a=createAttempt('mini-1');submitAttempt(a);assert.equal(examReport(a).total,0);assert.throws(()=>rateCriterion(a,'explain',0,1));
});
test('invalid syntax grades as an error after submission; empty epsilon sets stay distinct',()=>{
 const a=createAttempt('mini-1');setExamAnswer(a,'regex','(0|');setExamAnswer(a,'set','∅');submitAttempt(a);const r=examReport(a);assert.equal(r.autoPoints,0);assert.ok(r.items.find(q=>q.id==='regex').error);
});
test('optional timer survives reload and counts elapsed wall time; expiry never fabricates submission',()=>{
 const a=createAttempt('full-a',{minutes:75,now:1000000});assert.equal(remainingSeconds(a,1000000+60*1000),4440);assert.equal(remainingSeconds(a,1000000+5000*1000),0);assert.equal(a.submittedAt,null);assert.equal(remainingSeconds(createAttempt('mini-1',{minutes:0})),null);
});
test('repeated exam variants are labelled and older backups gain an empty history',()=>{
 const first=createAttempt('full-a');submitAttempt(first);const repeat=createAttempt('full-a',{previous:[first]});assert.equal(repeat.knownVariant,true);assert.equal(createAttempt('full-b',{previous:[first]}).knownVariant,false);
 const old=blankState();delete old.examAttempts;assert.deepEqual(validateImport(old).examAttempts,[]);
});
test('backup validation rejects fake ratings, unknown IDs, excessive points and duplicate attempts',()=>{
 const a=createAttempt('mini-1');assert.throws(()=>validateExamAttempts([a,a]));a.answers.unknown='x';assert.throws(()=>validateExamAttempts([a]));delete a.answers.unknown;
 a.answers.explain='My answer';a.ratings.explain=[1,1];assert.throws(()=>validateExamAttempts([a]));submitAttempt(a);a.ratings.explain=[2,1];assert.throws(()=>validateExamAttempts([a]));a.ratings.explain=[null,1];assert.equal(validateExamAttempts([a])[0].ratings.explain[0],null);
 a.answers.epsilon='50';assert.throws(()=>validateExamAttempts([a]));
});
test('reflection badge requires the whole rubric, not the first rated answer',()=>{
 const s=blankState(),a=createAttempt('full-a');s.examAttempts.push(a);fill(a);submitAttempt(a);const opens=examById[a.examId].questions.filter(q=>q.type==='open');rateCriterion(a,opens[0].id,0,1);updateBadges(s);assert.ok(!s.badges.includes('exam-reflection'));
 for(const q of opens)q.rubric.forEach((r,i)=>rateCriterion(a,q.id,i,r.points));updateBadges(s);assert.ok(s.badges.includes('exam-reflection'));
});
test('exam answer keys match independent worked cases',()=>{
 const answer=(eid,qid)=>examById[eid].questions.find(q=>q.id===qid).answer;
 assert.equal(answer('full-a','tm-output'),'10100');assert.equal(answer('full-b','tm-output'),'1110');assert.equal(answer('full-c','tm-output'),'11110');
 assert.deepEqual(answer('full-a','reg-algorithm'),['f','s']);assert.equal(answer('full-b','reg-algorithm'),2);assert.deepEqual(answer('full-c','reg-algorithm'),['b','f']);
 for(const id of ['full-a','full-b','full-c'])assert.ok(answer(id,'cf-top').includes('S'));
 assert.equal(answer('mini-2','run'),'r1');
});
