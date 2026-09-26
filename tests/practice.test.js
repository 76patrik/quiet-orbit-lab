import test from 'node:test';
import assert from 'node:assert/strict';
import {allQuestions,questions,allTopics} from '../src/curriculum.js';
import {grade,compileRegex,binaryWords} from '../src/engine.js';
import {epsilonClosure,nfaStep,determinize,minimize,cyk,cnfExamples,graphSolutions,incrementTrace} from '../src/algorithms.js';
import {blankState,recordAnswer,validateImport,dueQuestions} from '../src/progress.js';
import {selectPractice,filterQuestions} from '../src/practice.js';
test('all topics have at least eight distinct exercises; saved IDs are unique',()=>{
 assert.equal(new Set(allQuestions.map(q=>q.id)).size,allQuestions.length);
 for(const t of allTopics)assert.ok(questions.filter(q=>q.lesson===t.id).length>=8,t.id);
 for(const q of questions){assert.ok(allTopics.some(t=>t.id===q.lesson),q.id);assert.ok([1,2,3].includes(q.level));assert.ok(q.hint&&q.explanation&&!q.explanation.includes('undefined'),q.id);if(q.type==='choice')assert.ok(q.answer>=0&&q.answer<q.options.length);}
});
test('epsilon cycles terminate and the empty subset remains a sink',()=>{
 const n={start:'a',accept:['c'],alphabet:['0'],transitions:{a:{'':['b']},b:{'':['a'],0:['c']},c:{}}};
 assert.deepEqual(epsilonClosure(n,['a']),['a','b']);assert.deepEqual(nfaStep(n,['a'],'0'),['c']);
 assert.deepEqual(determinize(n).map(r=>[r.states,r.accept]),[[['a','b'],false],[['c'],true],[[],false]]);
});
test('minimization removes unreachable states and separates distinguishable suffixes',()=>{
 const d={states:['a','b','c','d','x'],start:'a',accept:['c','d','x'],alphabet:['0','1'],transitions:{a:{0:'b',1:'c'},b:{0:'a',1:'d'},c:{0:'b',1:'c'},d:{0:'a',1:'d'},x:{0:'x',1:'x'}}};
 const m=minimize(d);assert.deepEqual(m.unreachable,['x']);assert.deepEqual(m.groups.map(g=>g.join('')).sort(),['ab','cd']);
});
test('CYK matches independently defined languages on all words through length six',()=>{
 const ab=binaryWords(6).map(w=>w.replaceAll('0','a').replaceAll('1','b'));
 for(const w of ab){
  const halves=w.length/2;
  assert.equal(cyk(cnfExamples[0],w).accepted,w.length>0&&Number.isInteger(halves)&&w==='a'.repeat(halves)+'b'.repeat(halves),w);
  assert.equal(cyk(cnfExamples[1],w).accepted,w.length>0&&[...w].filter(c=>c==='a').length===[...w].filter(c=>c==='b').length,w);
  assert.equal(cyk(cnfExamples[2],w).accepted,w.length>0&&w.length%2===0&&w===[...w].reverse().join(''),w);
 }
 assert.deepEqual(cyk(cnfExamples[0],'aabb').table[1].slice(0,3),[[],['S'],[]]);
});
test('graph answers include genuine edge covers and global clique optima',()=>{
 const triangle=graphSolutions(['a','b','c','d'],[['a','b'],['a','c'],['b','c'],['c','d']]);assert.equal(triangle.omega,3);assert.equal(triangle.tau,2);assert.ok(triangle.covers.some(c=>c.join('')==='ac'));
 const cycle=graphSolutions(['a','b','c','d','e'],[['a','b'],['b','c'],['c','d'],['d','e'],['e','a']]);assert.equal(cycle.omega,2);assert.equal(cycle.tau,3);
});
test('TM increment agrees with arithmetic including overflow and preserves intermediate head states',()=>{
 for(let n=0;n<128;n++)assert.equal(incrementTrace(n.toString(2)).output,(n+1).toString(2));
 const {rows}=incrementTrace('11');assert.deepEqual(rows.map(r=>r.state),['R','R','R','C','C','C','H']);assert.equal(rows.at(-1).head,-1);
});
test('constructed regex variants agree with independent predicates',()=>{
 const predicates=[w=>w.endsWith('10'),w=>w.startsWith('01'),w=>w.includes('0'),w=>[...w].filter(c=>c==='1').length===3,w=>w.length===4,w=>/^(10)*$/.test(w),w=>[...w].filter(c=>c==='1').length<=2,w=>w.startsWith('0')&&w.endsWith('1'),w=>w.includes('11'),w=>[...w].filter(c=>c==='1').length%2===1,w=>!w.includes('0'),w=>!w||w.startsWith('1')];
 predicates.forEach((predicate,i)=>{const q=questions.find(q=>q.id===`variant-build-regex-${i}`),r=compileRegex(q.answer);for(const w of binaryWords(6))assert.equal(r.test(w),predicate(w),`${i}: ${w}`);});
});
test('adaptive selection prioritizes confident errors, filters and avoids repeating a family',()=>{
 const s=blankState();recordAnswer(s,'m1',false,{confidence:'sure'});recordAnswer(s,'m2',false,{confidence:'guess'});
 const selected=selectPractice(s,{count:10},questions,()=>.5);assert.equal(selected[0].id,'m1');assert.equal(selected[1].id,'m2');assert.equal(new Set(selected.map(q=>q.family)).size,10);
 assert.ok(filterQuestions({topic:'cyk',level:3,kind:'calculate'}).every(q=>q.lesson==='cyk'&&q.level===3&&q.kind==='calculate'));
 assert.deepEqual(selectPractice(s,{topic:'no-such-topic'}),[]);
});
test('old backups migrate, confidence survives export, repaired same-day answers move out of due queue',()=>{
 const s=blankState();delete s.confidence;assert.deepEqual(validateImport(s).confidence,{});
 const fresh=blankState();const day='2026-09-26';recordAnswer(fresh,'m1',true,{day,confidence:'sure'});recordAnswer(fresh,'m1',false,{day,confidence:'sure'});assert.equal(dueQuestions(fresh,day).length,1);recordAnswer(fresh,'m1',true,{day,confidence:'unsure'});assert.equal(dueQuestions(fresh,day).length,0);assert.equal(validateImport(fresh).confidence.m1.wrongSure,1);
 fresh.confidence.m1.wrongSure=100;assert.throws(()=>validateImport(fresh));
});
