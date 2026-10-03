import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {lessons,allTopics,lessonById,topicById} from '../src/curriculum.js';
import {learningVisuals,learningVisualView,weekVisualView,stepLearningVisual} from '../src/learning-visuals.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

test('every lesson and later topic has a complete visual with accessible step controls',()=>{
 for(const id of new Set([...lessons,...allTopics].map(t=>t.id))){
  assert.ok(learningVisuals[id],id);
  const v=learningVisuals[id];assert.ok(v.frames.length>=2);
  for(let i=0;i<v.frames.length;i++){
   const dom=new JSDOM(learningVisualView(id,esc,i)),d=dom.window.document;
   assert.equal(d.querySelector('[data-visual-step]').dataset.visualStep,String(i));
   assert.equal(d.querySelectorAll('[aria-pressed=true]').length,1);
   assert.equal(d.querySelector('.lv-explanation').textContent,v.frames[i].note);
   assert.ok(d.querySelector('figure').children.length>=3,id);
   assert.ok(!d.querySelector('script'));
   assert.equal(d.querySelector('[data-dir=back]').disabled,i===0);
   assert.equal(d.querySelector('[data-dir=next]').disabled,i===v.frames.length-1);
   assert.ok(d.querySelectorAll('svg').length===0||d.querySelector('svg').getAttribute('aria-label'));
   dom.window.close();
  }
 }
});

test('all nine weekly maps link to existing topics or existing review/exam routes',()=>{
 for(let week=1;week<=9;week++){
  const dom=new JSDOM(weekVisualView(week,esc)),links=dom.window.document.querySelectorAll('a');
  assert.ok(links.length>=2);
  for(const link of links){const [route,id]=link.getAttribute('href').slice(1).split('/');
   assert.ok(route==='lesson'?lessonById[id]:route==='topic'?topicById[id]:['review','exams'].includes(route),link.href);
  }
  dom.window.close();
 }
});

test('visual controls move, reset and keep keyboard focus inside the selected example',()=>{
 const dom=new JSDOM(learningVisualView('tm',esc));const d=dom.window.document;
 stepLearningVisual(d.querySelector('[data-dir=next]'),esc);
 assert.equal(d.querySelector('[data-visual-step]').dataset.visualStep,'1');
 assert.equal(d.querySelector('.lv-tape .active strong').textContent,'1');
 assert.equal(d.activeElement.dataset.dir,'next');
 stepLearningVisual(d.querySelector('[data-step="3"]:not([data-dir])'),esc);
 assert.match(d.querySelector('.lv-explanation').textContent,/1100/);
 stepLearningVisual(d.querySelector('[data-dir=reset]'),esc);
 assert.equal(d.querySelector('[data-visual-step]').dataset.visualStep,'0');
 assert.equal(d.activeElement.dataset.dir,'reset');dom.window.close();
});

test('teaching examples preserve exact words, counts and reduction direction',()=>{
 const v=learningVisuals;
 assert.deepEqual(v.concat.frames[0].data.rows,[['ε','b','ab'],['a','ab','aab']]);
 assert.deepEqual(v.quotient.frames[1].data.rows,[['ab','ab','a'],['abb','abb','ab'],['b','b','ε']]);
 assert.equal(v.construct.frames[0].data.map(x=>x[0]).join(''),'0*10*10*');
 const tape=v.tm.frames.map(f=>f.data);assert.deepEqual(tape.map(t=>t.head),[4,3,2,2]);
 assert.equal(tape.at(-1).cells.slice(1,-1).join(''),'1100');
 assert.deepEqual(v.cyk.frames[1].data,['{A}','{B}','{S}','a','b']);
 assert.deepEqual(v.cyk.frames[2].data,['{B}','{A}','∅','b','a']);
 assert.deepEqual(v.stack.frames.map(f=>f.data.length-1),[4,2,0]);
 assert.match(v.reduction.frames[2].data[1][0],/A ≤ₚ B/);
});

test('new graphics are cached for offline learning',async()=>{
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 assert.match(sw,/'\.\/src\/learning-visuals\.js'/);
});
