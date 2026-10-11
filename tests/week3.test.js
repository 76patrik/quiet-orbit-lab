import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {week3Lessons,week3Guides,week3Methods} from '../src/week3-content.js';
import {week3Questions} from '../src/week3-questions.js';
import {week3Exam} from '../src/week3-exam.js';
import {syntaxTrees,treeWord} from '../src/week3-visuals.js';
import {remedialFeedback} from '../src/remediation.js';
import {week2Questions} from '../src/week2-questions.js';
import {schedule} from '../src/guide.js';
import {blankState,recordAnswer,validateImport} from '../src/progress.js';
import {nextLearningStep} from '../src/learning-next.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Parse the actual displayed comparison grammars, then enumerate derivable words
// by monotone fixed point. This checker also supports the original ε/unit rules.
function parseRules(text){return Object.fromEntries([...text.matchAll(/\b(S0|S|A|B|C|D|T)→([^;:.]+)/g)].map(([,v,body])=>[v,body.split('|').map(s=>s.trim()==='ε'?[]:s.trim().match(/S0|[A-Zab]/g))]));}
function language(rules,start,max=8){const values=Object.fromEntries(Object.keys(rules).map(v=>[v,new Set()]));let changed=true;while(changed){changed=false;for(const [v,rs] of Object.entries(rules))for(const rhs of rs){let words=[''];for(const s of rhs)words=words.flatMap(a=>[...(values[s]||[s])].filter(b=>a.length+b.length<=max).map(b=>a+b));for(const w of words)if(!values[v].has(w)){values[v].add(w);changed=true;}}}return [...values[start]].sort();}
function assertCnf(rules,start){for(const [a,rs] of Object.entries(rules))for(const r of rs){assert.ok(r.length===0?a===start:r.length===1?/^[ab]$/.test(r[0]):r.length===2&&r.every(v=>rules[v]),`${a}→${r}`);if(r.length===0)for(const group of Object.values(rules))for(const rhs of group)assert.ok(!rhs.includes(start));}}

test('displayed CNF grammars preserve bounded languages and satisfy strict forms',()=>{
 const cases=[
 [week3Guides.cnf.worked.steps[4],'S→aSb|ε.','S0'],
 [week3Methods.cnf.steps[3],'S→aSbb|ε.','S0'],
 [week3Exam.questions.find(q=>q.id==='cnf-one').solution,'S→A|b; A→aAb|ε.','S0'],
 [week3Exam.questions.find(q=>q.id==='cnf-two').solution,'S→aSbb|abb.','S']
 ];
 for(const [shown,original,start] of cases){const rules=parseRules(shown);assert.ok(Object.keys(rules).length>=4);assertCnf(rules,start);assert.deepEqual(language(rules,start),language(parseRules(original),'S'));}
});
test('syntax trees really use the rules and yield identical words with different roots',()=>{
 const valid=t=>{if(!t.children){assert.ok(['a','+','*'].includes(t.label));return;}assert.equal(t.label,'E');const rhs=t.children.map(c=>c.label).join('');assert.ok(['a','E+E','E*E'].includes(rhs));t.children.forEach(valid);};
 for(const [id,trees] of Object.entries(syntaxTrees)){trees.forEach(valid);assert.equal(treeWord(trees[0]),id==='guided'?'a+a*a':'a*a+a');assert.equal(treeWord(trees[0]),treeWord(trees[1]));assert.notEqual(trees[0].children[1].label,trees[1].children[1].label);}
});
test('every new lesson can complete independently and old evidence survives import',()=>{
 const s=blankState();recordAnswer(s,'m1',true,{day:'2026-10-05'});
 for(const l of week3Lessons){const pool=week3Questions.filter(q=>q.lesson===l.id);assert.ok(pool.length>=10);for(const q of pool.slice(0,7))recordAnswer(s,q.id,true,{day:'2026-10-06'});assert.ok(s.completed[l.id]);}
 assert.deepEqual(validateImport(JSON.parse(JSON.stringify(s))).results.m1,s.results.m1);
 assert.equal(nextLearningStep(s,{lessonId:'cnf'}).href,'#path/4');
 const plan=schedule(blankState(),'2026-10-12');assert.equal(plan.expected,29);assert.equal(new Set(plan.missing).size,plan.missing.length);
});
test('wrong set feedback distinguishes missing and extra states and explains each contribution',()=>{
 const q=week2Questions.find(q=>q.id==='wk2-suffix-word-3');const html=remedialFeedback(q,'{p,q}',esc);
 assert.match(html,/fehlen: \{\s*r\s*\}/);assert.match(html,/richtig: \{\s*q\s*\}/);assert.match(html,/Beiträge/);assert.ok(q.nfaFeedback);
 assert.ok(!remedialFeedback(q,'<img src=x>',esc).includes('<img'));
});
test('offline course includes the script and all new modules',async()=>{
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const f of ['week3-content','week3-questions','week3-visuals','week3-exam','week3-view','remediation']){assert.ok(sw.includes(`./src/${f}.js`));await access(new URL(`../src/${f}.js`,import.meta.url));}
 await access(new URL('../assets/Lernskript_Woche_3_Theoretische_Informatik.pdf',import.meta.url));
 assert.equal(week3Exam.questions.reduce((s,q)=>s+q.points,0),20);
});
