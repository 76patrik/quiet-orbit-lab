import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {allQuestions,questionById} from '../src/curriculum.js';
import {exams,examById} from '../src/exams.js';
import {validateDfa,runDfa,binaryWords} from '../src/engine.js';
import {dfaFeedbackFor} from '../src/dfa-feedback.js';
import {questionDfaFeedback,renderDfaFeedback} from '../src/dfa-view.js';
import {attemptView} from '../src/exam-view.js';
import {createAttempt,setExamAnswer,submitAttempt} from '../src/exam-engine.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const documentFor=html=>new JSDOM(html).window.document;
const helpers={esc,head:()=>'',icon:()=>'',time:()=>''};

test('all DEA lessons have complete models; concrete runs keep the exact task and answer',()=>{
  for(const q of allQuestions){
    const spec=dfaFeedbackFor(q);
    if(['dfa','parity','alternate','complement','minimize'].includes(q.lesson))assert.ok(spec,q.id);
    if(!spec)continue;
    validateDfa(spec.machine);
    if(spec.word!==undefined){
      const run=runDfa(spec.machine,spec.word);
      if(q.id.startsWith('variant-run-'))assert.equal(run.accepted,q.answer===0,q.id);
    }
  }
  assert.deepEqual(runDfa(dfaFeedbackFor(questionById.d3).machine,'101').trace,['A','A','B','A']);
  const keyword=dfaFeedbackFor(questionById.al3).machine;
  for(const word of ['do','double','catch','case'])assert.ok(runDfa(keyword,word).accepted,word);
  for(const word of ['','d','dou','doublee','casea','catchdo'])assert.equal(runDfa(keyword,word).accepted,false,word);
  assert.deepEqual(dfaFeedbackFor(questionById.cp1).machine.accept,['q2','q3','err']);
  assert.deepEqual(dfaFeedbackFor(questionById['extra-dfa-2']).machine.alphabet,['a','b','c']);
  assert.equal(dfaFeedbackFor(questionById.a1),null);
});

test('the same consumed symbol is highlighted in graph and table, including epsilon',()=>{
  const spec=dfaFeedbackFor(questionById.d3),doc=documentFor(renderDfaFeedback(spec,esc,{step:2}));
  assert.equal(doc.querySelector('.dfa-node.is-current').dataset.state,'B');
  assert.equal(doc.querySelector('.dfa-edge.is-active').dataset.from,'A');
  assert.equal(doc.querySelector('.dfa-edge.is-active').dataset.to,'B');
  assert.equal(doc.querySelector('.dfa-active-cell').textContent,'B');
  assert.match(doc.querySelector('.dfa-run-status').textContent,/2 von 3/);
  assert.equal(doc.querySelector('.dfa-feedback').closest('details'),null);
  assert.equal(doc.querySelectorAll('.dfa-transition-table tbody tr').length,2);
  assert.equal(doc.querySelectorAll('.dfa-accept-ring').length,1);
  const epsilon=documentFor(questionDfaFeedback(questionById['variant-run-parity-eps'],esc));
  assert.equal(epsilon.querySelectorAll('[data-step]').length,1);
  assert.equal(epsilon.querySelector('.dfa-edge.is-active'),null);
  assert.equal(epsilon.querySelector('.dfa-active-cell'),null);
  assert.match(epsilon.querySelector('.dfa-run-status').textContent,/ε wird akzeptiert/);
});

test('multiple panels have unique SVG references and escape state labels',()=>{
  const html=['d3','cp1','p2'].map(id=>questionDfaFeedback(questionById[id],esc,'result')).join(''),doc=documentFor(html);
  const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  for(const path of doc.querySelectorAll('[marker-end]'))assert.ok(doc.getElementById(path.getAttribute('marker-end').slice(5,-1)));
  const name='<img src=x onerror=alert(1)>',spec={machine:{states:[name],alphabet:['0'],start:name,accept:[],transitions:{[name]:{0:name}}}};
  const escaped=documentFor(renderDfaFeedback(spec,esc));assert.equal(escaped.querySelector('img'),null);assert.ok(escaped.body.textContent.includes(name));
});

test('exams reveal the correct model only after submission, outside closed solutions',()=>{
  for(const exam of exams)for(const q of exam.questions){const spec=dfaFeedbackFor({...q,lesson:q.topic});if(spec)validateDfa(spec.machine);}
  const a=createAttempt('mini-1');a.index=4;setExamAnswer(a,'run','A');
  assert.equal(documentFor(attemptView(a,helpers)).querySelector('[data-dfa-feedback]'),null);
  submitAttempt(a);
  const panel=documentFor(attemptView(a,helpers)).querySelector('[data-dfa-feedback]');
  assert.ok(panel);assert.equal(panel.closest('details'),null);
  assert.match(panel.textContent,/1100 wird akzeptiert/);
  const predicates=[w=>[...w].filter(c=>c==='0').length%3===0,w=>[...w].filter(c=>c==='1').length<=2,w=>!w.includes('010')];
  ['full-a','full-b','full-c'].forEach((id,i)=>{
    const model=examById[id].questions.find(q=>q.id==='reg-dfa').dfaFeedback.machine;
    for(const w of binaryWords(5))assert.equal(runDfa(model,w).accepted,predicates[i](w),`${id}: ${w}`);
  });
});
