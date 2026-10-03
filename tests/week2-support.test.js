import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {week2Support,week2Prerequisites,week2Sources} from '../src/week2-learning-support.js';
import {nfaExamples,nfaTrace,renderNfaFeedback,stepNfaFeedback} from '../src/nfa-feedback.js';
import {learningWorkshop,handleLearningAction,captureLearningInput,clearLearningSessions} from '../src/learning-workshop.js';
import {lessonById,lessonsOfWeek} from '../src/curriculum.js';
import {blankState} from '../src/progress.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
test('all six lessons have earlier prerequisites and precise source references',()=>{for(const l of lessonsOfWeek(2)){const c=week2Support[l.id];assert.ok(c);for(const id of c.pre)assert.ok(lessonById[id]);assert.match(week2Prerequisites(l.id,esc,id=>lessonById[id].title),/#lesson\//);assert.match(week2Sources(l.id,esc),/PDF-Seiten/);for(const mode of ['recall','reason','method'])assert.equal(c.hints[mode].length,2);}});
test('exact NEA models produce the promised intermediate sets and accept only complete words',()=>{
 assert.deepEqual(nfaTrace(nfaExamples['nea-solo']).map(r=>r.states),[['s'],['f','s'],['s'],['f','s']]);
 assert.deepEqual(nfaTrace(nfaExamples['epsilon-solo']).map(r=>r.states),[['p','q','r'],['f'],[]]);
 assert.deepEqual(nfaTrace(nfaExamples['epsilon-guided'])[0].states,['s','u','v']);
 const m=nfaExamples['nea-solo'].machine;
 for(let n=0;n<64;n++){const word=n===0?'':n.toString(2).slice(1),last=nfaTrace({machine:m,word}).at(-1);assert.equal(last.states.includes('f'),word.endsWith('0'));}
 for(const key of Object.keys(nfaExamples)){const doc=new JSDOM(renderNfaFeedback(key,esc)).window.document;assert.equal(doc.querySelectorAll('svg').length,1);assert.equal(doc.querySelectorAll('table').length,2);assert.equal(doc.querySelectorAll('table:first-of-type tbody tr').length>0,true);}
});
test('hints stay partial, preserve input, and cannot be laundered through level changes',()=>{
 clearLearningSessions();const dom=new JSDOM('<main></main>'),old=globalThis.document;globalThis.document=dom.window.document;
 try{const state=blankState(),render=()=>document.querySelector('main').innerHTML=learningWorkshop('nea','method',state,esc),click=(action,extra='')=>handleLearningAction(document.querySelector(`[data-action="${action}"]${extra}`),{state,esc,persist:()=>true,render});render();
 assert.equal(document.querySelector('.nfa-feedback'),null);const input=document.querySelector('#learn-answer');input.value='Meine eigene Antwort';captureLearningInput(input);click('learn-hint');assert.equal(document.querySelector('#learn-answer').value,'Meine eigene Antwort');assert.equal(document.querySelector('.learn-solution'),null);assert.doesNotMatch(document.querySelector('[aria-label="Aufgedeckte Hinweise"]').textContent,/\{s,f\}/);click('learn-hint');assert.ok(document.querySelector('[data-action="learn-hint"]').disabled);
 click('learn-level','[data-level="guided"]');click('learn-level','[data-level="solo"]');const answer=document.querySelector('#learn-answer');answer.value='weiß ich nicht';captureLearningInput(answer);click('learn-compare');assert.ok(document.querySelector('.nfa-feedback'));stepNfaFeedback(document.querySelector('.nfa-feedback [data-step="3"]'),esc);assert.match(document.querySelector('.nfa-feedback [role="status"]').textContent,/010/);click('learn-save');assert.equal(state.learning['nea:method'].assisted,true);assert.deepEqual(state.completed,{});
 }finally{globalThis.document=old;dom.window.close();clearLearningSessions();}
});
