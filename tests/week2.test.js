import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {epsilonClosure,nfaStep,determinize,minimize} from '../src/algorithms.js';
import {grade,runDfa,compareDfa,compileRegex,binaryWords} from '../src/engine.js';
import {suffixNfa,exercise6Nfa,exercise7Dfa,examDfa,examNfa,exercise8Dfa} from '../src/week2-models.js';
import {week2Questions} from '../src/week2-questions.js';
import {week2Content} from '../src/week2-content.js';
import {questions,achievements} from '../src/curriculum.js';
import {blankState,recordAnswer,validateImport,updateBadges,mastery} from '../src/progress.js';
import {createAttempt,setExamAnswer,submitAttempt,rateCriterion,examReport} from '../src/exam-engine.js';
import {week2Exam} from '../src/week2-exam.js';
import {week2View,week2Ui,setWeek2Word,week2Progress} from '../src/week2-view.js';

const accepts=(nfa,word)=>{
 let active=epsilonClosure(nfa,[nfa.start]);
 for(const symbol of word)active=nfaStep(nfa,active,symbol);
 return active.some(s=>nfa.accept.includes(s));
};
const quotient=(dfa,groups)=>{
 const index=s=>'G'+groups.findIndex(g=>g.includes(s));
 return {states:groups.map((_,i)=>'G'+i),alphabet:dfa.alphabet,start:index(dfa.start),accept:groups.filter(g=>g.some(s=>dfa.accept.includes(s))).map(g=>index(g[0])),transitions:Object.fromEntries(groups.map(g=>[index(g[0]),Object.fromEntries(dfa.alphabet.map(a=>[a,index(dfa.transitions[g[0]][a])]))]))};
};
test('source diagram 6 has the exact four reachable subsets, including epsilon start and trap',()=>{
 assert.deepEqual(determinize(exercise6Nfa).map(r=>[r.states,r.accept,r.next]),[
  [['q0','q2'],true,{'0':['q0','q2'],'2':[],'4':['q1']}],
  [[],false,{'0':[],'2':[],'4':[]}],
  [['q1'],false,{'0':[],'2':['q2'],'4':[]}],
  [['q2'],true,{'0':['q0','q2'],'2':[],'4':[]}]
 ]);
 let words=[''];for(let n=0;n<6;n++)words.push(...words.filter(w=>w.length===n).flatMap(w=>['0','2','4'].map(a=>w+a)));
 for(const word of words)assert.equal(accepts(exercise6Nfa,word),/^(?:0|420)*(?:42)?$/.test(word),word);
 for(const word of binaryWords(7)){
  assert.equal(accepts(suffixNfa,word),word.endsWith('01'),word);
  assert.equal(accepts(examNfa,word),/^0*10[01]*$/.test(word),word);
 }
});
test('the five original classes and new three-state quotient preserve the whole language',()=>{
 const original=minimize(exercise7Dfa);
 assert.deepEqual(original.groups.map(g=>g.join(',')).sort(),['q1','q2,q5','q3,q4','q6,q7','q8']);
 assert.deepEqual(runDfa(exercise7Dfa,'abba').trace,['q1','q2','q4','q6','q8']);
 assert.ok(compareDfa(exercise7Dfa,quotient(exercise7Dfa,original.groups)).equal);
 const variant=minimize(examDfa);assert.deepEqual(variant.unreachable,['U']);
 assert.deepEqual(variant.groups.map(g=>g.join(',')).sort(),['A','B,C','D,E']);
 assert.ok(compareDfa(examDfa,quotient(examDfa,variant.groups)).equal);
 for(const word of binaryWords(7))assert.equal(runDfa(examDfa,word).accepted,word.length>=2&&word.endsWith('1'));
 const small=quotient(exercise7Dfa,[['q1'],['q2','q5'],['q3','q4'],['q6','q7'],['q8']]);
 for(const [a,b,w] of [[0,1,'aa'],[0,2,'ba'],[0,3,'a'],[1,2,'aa'],[1,3,'a'],[2,3,'a'],[0,4,''],[1,4,''],[2,4,''],[3,4,'']]){
  assert.notEqual(runDfa({...small,start:'G'+a},w).accepted,runDfa({...small,start:'G'+b},w).accepted,`${a}/${b}: ${w}`);
 }
});
test('all new answer keys are accepted and ab regex equivalence uses the supplied alphabet',()=>{
 assert.equal(week2Questions.length,61);
 for(const q of week2Questions){
  const value=q.type==='set'?(q.answer.length?'{'+q.answer.join(',')+'}':'∅'):String(q.answer);
  assert.ok(grade(q,value),q.id);assert.equal(q.hints.length,2,q.id);
 }
 const q=week2Questions.find(q=>q.id==='wk2-grammar-regex-0');
 assert.ok(grade(q,'a(a|b)*b(a|b)*'));
 assert.equal(grade(q,'(a|b)*b'),false);
 for(const word of binaryWords(7).map(w=>w.replaceAll('0','a').replaceAll('1','b'))){
  const expected=word.startsWith('a')&&word.includes('b');
  assert.equal(compileRegex(q.answer,['a','b']).test(word),expected,word);
  assert.equal(runDfa(exercise8Dfa,word).accepted,expected,word);
 }
});
test('reader state migrates old backups without changing their existing progress',()=>{
 const s=blankState();recordAnswer(s,'m1',true,{day:'2026-09-27'});delete s.week2;
 const migrated=validateImport(s);assert.deepEqual(migrated.week2,{read:[],lastChapter:null});
 migrated.week2={read:['grundlagen','epsilon'],lastChapter:'epsilon'};
 const restored=validateImport(JSON.parse(JSON.stringify(migrated)));
 assert.deepEqual(restored.week2,migrated.week2);assert.deepEqual(restored.results.m1,migrated.results.m1);
 for(const bad of [{read:['bogus'],lastChapter:null},{read:[],lastChapter:'__proto__'},{read:'epsilon',lastChapter:null}])assert.throws(()=>validateImport({...migrated,week2:bad}));
 const empty=blankState();empty.week2.read=week2Content.chapters.map(c=>c.id);updateBadges(empty);assert.ok(!empty.badges.includes('week2-skills'));
});
test('week-two exercises contribute mastery while the fixed week-one check stays separate',()=>{
 const s=blankState(),pool=week2Questions.filter(q=>q.lesson==='kleene');
 recordAnswer(s,'w1',true,{day:'2026-09-27'});recordAnswer(s,'w3',true,{day:'2026-09-28'});
 assert.equal(mastery(s,'alphabet'),'new');
 recordAnswer(s,pool[0].id,true,{day:'2026-09-27'});assert.equal(mastery(s,'kleene'),'learning');
 recordAnswer(s,pool[1].id,true,{day:'2026-09-28'});assert.equal(mastery(s,'kleene'),'safe');
 recordAnswer(s,pool[2].id,false,{day:'2026-09-28'});assert.equal(mastery(s,'kleene'),'learning');
});
test('week-two skill badge requires independent evidence in all four topics',()=>{
 const s=blankState();
 for(const id of ['nea','minimize','regular-grammar','kleene']){
  const pool=questions.filter(q=>q.lesson===id).slice(0,7);
  for(const q of pool)recordAnswer(s,q.id,true,{assisted:id==='kleene'});
 }
 assert.ok(!s.badges.includes('week2-skills'));
 for(const q of questions.filter(q=>q.lesson==='kleene').slice(0,7))recordAnswer(s,q.id,true);
 assert.ok(s.badges.includes('week2-skills'));assert.equal(week2Progress(s,questions).filter(p=>p.solved>=7).length,4);
 assert.ok(achievements.find(a=>a.id==='week2-skills').rule(s));assert.ok(validateImport(s).badges.includes('week2-skills'));
});
test('weekly check separates automatic and self-rated points and resumes through backups',()=>{
 const a=createAttempt(week2Exam.id,{minutes:60,now:1000});
 for(const q of week2Exam.questions)setExamAnswer(a,q.id,q.type==='open'?'Eigener vollständiger Lösungsweg':q.type==='set'?'{'+q.answer.join(',')+'}':String(q.answer));
 const s=blankState();s.examAttempts=[a];const restored=validateImport(JSON.parse(JSON.stringify(s))).examAttempts[0];
 submitAttempt(restored,11000);assert.equal(examReport(restored).autoPoints,7);assert.equal(examReport(restored).pendingPoints,33);
 for(const q of week2Exam.questions.filter(q=>q.type==='open'))q.rubric.forEach((r,i)=>rateCriterion(restored,q.id,i,r.points));
 assert.equal(examReport(restored).total,40);assert.equal(examReport(restored).complete,true);
 assert.throws(()=>setExamAnswer(restored,'powerset','0'));
});
test('reader paths and offline manifest include the script, labs and real PDF',async()=>{
 const s=blankState(),esc=s=>String(s).replaceAll('<','&lt;');
 for(const c of week2Content.chapters){
  const html=week2View(c.id,{state:s,questions,esc});assert.ok(html.includes(c.title));assert.ok(html.includes(`data-id="${c.id}"`));
 }
 assert.match(week2View('constructor',{state:s,questions,esc}),/Kapitel nicht gefunden/);
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const file of [...sw.matchAll(/'\.\/(src\/week2-[^']+|assets\/Lernskript_Woche_2[^']+)'/g)].map(m=>m[1]))await access(new URL('../'+file,import.meta.url));
 const pdf=await readFile(new URL('../assets/Lernskript_Woche_2_Theoretische_Informatik.pdf',import.meta.url));assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
 week2Ui.example='original6';assert.ok(setWeek2Word('ε'));assert.equal(week2Ui.word,'');assert.equal(setWeek2Word('101'),false);assert.match(week2Ui.error,/0,2,4/);
});
