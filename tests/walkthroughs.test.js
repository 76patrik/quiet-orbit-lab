import test from 'node:test';
import assert from 'node:assert/strict';
import {minimize,cyk,determinize,epsilonClosure,nfaStep,graphSolutions} from '../src/algorithms.js';
import * as M from '../src/solution-models.js';
import {walkthroughSets,taskById} from '../src/walkthroughs.js';
import {visualView} from '../src/solution-visuals.js';
import {walkthroughOverview,walkthroughTask,partView,handleWalkthroughAction,resetWalkthroughs,rich} from '../src/walkthrough-view.js';
import {lessonById,topicById} from '../src/curriculum.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const helpers={esc,icon:n=>`<i data-icon="${n}"></i>`,head:(a,b,c)=>`<h1>${b}</h1><p>${c}</p>`,tabs:'<nav class="tabs"></nav>'};
const words=(alphabet,max)=>M.wordsUpTo(alphabet,max);
const acceptsNfa=(nfa,word)=>{let s=epsilonClosure(nfa,[nfa.start]);for(const c of word)s=nfaStep(nfa,s,c);return s.some(q=>nfa.accept.includes(q));};
const count=(w,c)=>[...w].filter(x=>x===c).length;
const allTasks=walkthroughSets.flatMap(s=>s.units.flatMap(u=>u.tasks));

test('both tabs cover every exercise and every exam task exactly once',()=>{
 const sheet=walkthroughSets.find(s=>s.key==='aufgaben').units.flatMap(u=>u.tasks).map(t=>t.n);
 assert.deepEqual([...sheet].sort(),['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22 (DEA)','22 (TM)','23'].sort());
 const exam=walkthroughSets.find(s=>s.key==='altklausur').units.flatMap(u=>u.tasks);
 assert.deepEqual(exam.map(t=>t.n),['1','2','3','4','5','6']);
 // Punkte der Altklausur: 8 + 10 + 7 + 15 + 10 + 10 = 60
 assert.equal(exam.reduce((sum,t)=>sum+Number(t.points.match(/\d+/)[0]),0),60);
 assert.equal(Object.keys(taskById).length,allTasks.length);
});

test('every task is complete: prompt, knowledge, steps, answer and working links',()=>{
 for(const t of allTasks){
  assert.ok(t.prompt?.length,`${t.id} prompt`);assert.ok(t.background?.length,`${t.id} background`);assert.ok(t.parts.length,`${t.id} parts`);
  for(const p of t.parts){assert.ok(p.steps.length>=1,`${t.id} ${p.label} steps`);assert.ok(p.answer?.x,`${t.id} ${p.label} answer`);for(const s of p.steps)assert.ok(s.t&&s.x,`${t.id} step text`);}
  for(const b of t.background)if(b.link){const [href]=b.link,[kind,id]=href.slice(1).split('/');assert.ok(kind==='lesson'?lessonById[id]:topicById[id],`${t.id}: Link ${href} existiert`);}
 }
});

test('all visuals render to markup with text alternatives, nothing undefined',()=>{
 const all=[];
 for(const t of allTasks){if(t.given)all.push(t.given);for(const p of t.parts){for(const s of p.steps)if(s.v)all.push(s.v);if(p.answer.v)all.push(p.answer.v);}}
 assert.ok(all.length>120);
 for(const v of all){const html=visualView(v,esc);assert.ok(html.length>20);assert.doesNotMatch(html,/undefined|NaN/);if(v.type==='diagram')assert.match(html,/<desc id=/);}
});

test('views render overview, every task page and every step without XP side effects',()=>{
 resetWalkthroughs();
 for(const s of walkthroughSets){const html=walkthroughOverview(s.key,helpers);assert.equal((html.match(/class="lesson-tile wt-tile-link"/g)||[]).length,s.units.reduce((n,u)=>n+u.tasks.length,0));}
 assert.equal(walkthroughTask('aufgaben','ak-1',helpers),null,'Aufgabe gehört zum anderen Reiter');
 assert.equal(walkthroughTask('altklausur','gibt-es-nicht',helpers),null);
 for(const t of allTasks){
  const page=walkthroughTask(t.set,t.id,helpers);
  assert.match(page,/Lösungsweg starten/);assert.doesNotMatch(page,/✓ Musterlösung/,'Lösung erst nach eigener Entscheidung');
  t.parts.forEach((p,i)=>{
   const key=`${t.id}:${i}`,doc={getElementById:id=>id.endsWith('-note')?{value:'  meine Idee  '}:null};
   assert.equal(handleWalkthroughAction({dataset:{action:'wt-reveal',key}},esc,doc),true);
   let html=partView(t,i,esc);assert.match(html,/Schritt 1 von/);assert.match(html,/meine Idee/);
   handleWalkthroughAction({dataset:{action:'wt-step',key,step:'999'}},esc,doc);
   html=partView(t,i,esc);assert.match(html,/✓ Musterlösung/);
   if(p.warning)assert.match(html,/Fehler in der Original-Musterlösung/);
  });
 }
 assert.equal(handleWalkthroughAction({dataset:{action:'wt-step',key:'nope:0',step:'1'}},esc,{getElementById:()=>null}),false);
 resetWalkthroughs();
 assert.match(partView(taskById['ak-4'],0,esc),/Lösungsweg starten/,'Zurücksetzen schließt offene Lösungswege');
});

test('rich text escapes HTML before adding emphasis',()=>{
 assert.equal(rich('<b>x</b> **fett** `a|b`',esc),'&lt;b&gt;x&lt;/b&gt; <strong>fett</strong> <code>a|b</code>');
});

test('Altklausur 4a: minimisation gives the four classes of the model solution',()=>{
 const r=minimize(M.examMinDfa);
 assert.deepEqual(r.unreachable,[]);
 assert.deepEqual(r.groups.map(g=>g.join(',')).sort(),['q0,q2','q1,q4','q3','q5']);
 assert.deepEqual(M.wordPartition(M.examMinDfa,words(['a','b'],1)).map(g=>g.join(',')).sort(),['q0,q2,q3','q1,q4','q5']);
 assert.deepEqual(M.wordPartition(M.examMinDfa,words(['a','b'],3)).map(g=>g.join(',')).sort(),['q0,q2','q1,q4','q3','q5'],'Länge 3 trennt nichts mehr');
});

test('Altklausur 4b: DEA equals a⁺#b⁺#c⁺; corrected grammar rule A → aA is needed',()=>{
 const re=/^a+#b+#c+$/;
 for(const w of words(['a','b','c','#'],7))assert.equal(M.runDfaPartial(M.examHashDfa,w).accepted,re.test(w),w);
});

test('Altklausur 5 / Aufgabe 12: TM traces, including the corrected exercise trace',()=>{
 const run=M.runTm(M.zeroEraserTm,'10100110');
 assert.deepEqual(run.configs.slice(0,8).map(M.configLabel),['(q0)10100110','1(q0)0100110','10(q2)100110','1(q4)0000110','(q4)10000110','1(q5)0000110','11(q2)000110','110(q2)00110']);
 assert.ok(run.accepted);assert.equal(run.configs.at(-1).cells.filter(c=>c!==M.BLANK).join(''),'1111');
 const ex=M.runTm(M.zeroEraserTm,'01101');
 assert.deepEqual(ex.configs.slice(0,6).map(M.configLabel),['(q0)01101','0(q2)1101','(q4)00101','(q4)⊔00101','(q5)00101','1(q2)0101']);
 assert.equal(ex.configs.at(-1).cells.filter(c=>c!==M.BLANK).join(''),'111');
 // Die Maschine löscht für jedes Binärwort alle 0en.
 for(const w of words(['0','1'],6).filter(Boolean)){const r=M.runTm(M.zeroEraserTm,w);assert.ok(r.halted&&r.accepted,w);assert.equal(r.configs.at(-1).cells.filter(c=>c!==M.BLANK).join(''),w.replace(/0/g,''),w);}
});

test('Aufgabe 22c: TM trace matches the model solution and accepts exactly 0Σ*',()=>{
 const r=M.runTm(M.shiftZeroTm,'01101');
 assert.deepEqual(r.configs.map(M.configLabel),['(s)01101','X(q1)1101','(q2)X0101','1(q3)0101','1X(q1)101','1(q2)X001','11(q3)001','11X(q1)01','11(q4)X01','110(q5)01','110X(q1)1','110(q2)X0','1101(q3)0','1101X(q1)⊔','1101(q6)X','11010(q7)⊔']);
 for(const w of words(['0','1'],6))assert.equal(M.runTm(M.shiftZeroTm,w).accepted,w.startsWith('0'),w);
});

test('Aufgabe 13: ß becomes s and a tally of # counts them',()=>{
 for(const w of ['maß','fußball','ßß','abc']){const r=M.runTm(M.eszettTm,w);assert.ok(r.accepted,w);assert.equal(r.configs.at(-1).cells.filter(c=>c!==M.BLANK).join(''),w.replace(/ß/g,'s')+'#'.repeat(count(w,'ß')));}
});

test('Altklausur 6 and Aufgaben 16/23: CYK results and derivations',()=>{
 const a=cyk(M.examCykGrammar,'bbaab');assert.ok(a.accepted);
 assert.deepEqual(a.table.map((row,i)=>row.slice(0,5-i).map(c=>c.join(','))),[['B,T','B,T','A','A','B,T'],['U','T','','S'],['U','T',''],['U',''],['S']]);
 assert.equal(a.table.flat().filter((c,i)=>c.length).length,12,'12 nicht leere Felder = 6 Punkte');
 assert.ok(cyk(M.sheet16Grammar,'addd').accepted);
 assert.deepEqual(cyk(M.sheet16Grammar,'addd').table[3][0],['S']);
 assert.equal(cyk(M.sheet23Grammar,'aadea').accepted,false);
 assert.deepEqual(cyk(M.sheet23Grammar,'aadea').table[3][0],['A']);
});

test('Altklausur 3: clique, vertex cover (corrected) and Hamilton cycle',()=>{
 const g=M.examGraph,s=graphSolutions(g.vertices,g.edges);
 assert.equal(s.omega,4);assert.deepEqual(s.cliques,[['a','b','c','g']]);
 assert.equal(s.tau,4);assert.ok(M.isVertexCover(g,['a','b','c','d']));
 assert.equal(M.isVertexCover(g,['b','d']),false,'Original-Lösung ist kein Vertex Cover');
 assert.ok(M.isDominating(g,['b','d']),'…sondern eine dominierende Menge');
 assert.ok(M.isHamiltonCycle(g,['a','g','c','f','d','e','b']));
});

test('Aufgabe 19: all seven graph answers hold',()=>{
 const g=M.sheet19Graph,s=graphSolutions(g.vertices,g.edges);
 assert.equal(M.degree(g,'v4'),7);assert.ok(g.vertices.every(v=>M.degree(g,v)<=7));
 assert.equal(s.omega,4);assert.ok(M.isClique(g,['v2','v3','v10','v13']));
 assert.equal(s.tau,7);assert.deepEqual(s.covers,[['v2','v3','v4','v8','v9','v11','v13']]);
 assert.equal(M.isVertexCover(g,['v2','v4','v8']),false);assert.ok(M.isDominating(g,['v2','v4','v8']));
 assert.ok(M.isHamiltonCycle(g,['v1','v2','v12','v13','v3','v5','v4','v7','v11','v6','v9','v10','v8']));
 assert.ok(g.vertices.some(v=>M.degree(g,v)%2),'kein Euler-Kreis');
 assert.ok(M.properColoring(g,{v1:1,v2:2,v3:1,v4:2,v5:3,v6:1,v7:1,v8:2,v9:3,v10:4,v11:4,v12:1,v13:3}));
 const tree=[['v1','v2'],['v1','v4'],['v1','v8'],['v2','v3'],['v2','v10'],['v2','v12'],['v2','v13'],['v4','v5'],['v4','v6'],['v4','v7'],['v4','v9'],['v8','v11']];
 assert.equal(tree.length,12);assert.ok(tree.every(([a,b])=>M.hasEdge(g,a,b)));
 const seen=new Set(['v1']);let grew=true;while(grew){grew=false;for(const [a,b] of tree)if(seen.has(a)!==seen.has(b)){seen.add(a);seen.add(b);grew=true;}}
 assert.equal(seen.size,13,'Spannbaum verbindet alle Knoten');
});

test('Aufgabe 6: corrected subset construction is equivalent to the NFA (original is not)',()=>{
 const rows=determinize(M.sheet6Nfa),label=s=>s.join(',');
 assert.deepEqual(rows.map(r=>label(r.states)),['q0,q2','','q1','q2']);
 assert.deepEqual(rows.find(r=>label(r.states)==='q1').next['2'],['q2']);
 const det={start:'q0,q2',accept:rows.filter(r=>r.accept).map(r=>label(r.states)),transitions:Object.fromEntries(rows.map(r=>[label(r.states),Object.fromEntries(Object.entries(r.next).map(([c,t])=>[c,label(t)]))]))};
 const original={start:'A',accept:['A'],transitions:{A:{0:'A',4:'B'},B:{2:'A'}}};
 const run=(d,w)=>{let s=d.start;for(const c of w){s=d.transitions[s]?.[c];if(s===undefined)return false;}return d.accept.includes(s);};
 for(const w of words(['0','2','4'],6))assert.equal(run(det,w),acceptsNfa(M.sheet6Nfa,w),w);
 assert.equal(acceptsNfa(M.sheet6Nfa,'4242'),false);assert.equal(run(original,'4242'),true,'Original-DEA akzeptiert zu viel');
 assert.equal(/^(0|420)*(42)?$/.test('4242'),false);
 for(const w of words(['0','2','4'],6))assert.equal(acceptsNfa(M.sheet6Nfa,w),/^(0|420)*(42)?$/.test(w),w);
});

test('Aufgaben 4, 7, 8, 11 and 22: automata match their language definitions',()=>{
 for(const w of words(['0','1'],7))assert.equal(M.runDfaPartial(M.alternatingDfa,w).accepted,!/00|11/.test(w),w);
 assert.deepEqual(M.runDfaPartial(M.sheet7Dfa,'abba').trace,['q1','q2','q4','q6','q8']);
 assert.deepEqual(minimize(M.sheet7Dfa).groups.map(g=>g.join(',')).sort(),['q1','q2,q5','q3,q4','q6,q7','q8']);
 for(const w of words(['a','b'],7))assert.equal(M.runDfaPartial(M.sheet8Dfa,w).accepted,w.startsWith('a')&&w.includes('b'),w);
 // Original-Grammatik B → aA | bB | ε erzeugt aba nicht, die korrigierte schon.
 const derivable=(rules,w)=>{const go=(v,rest)=>rules[v].some(r=>r===''?rest==='':rest[0]===r[0]&&go(r.slice(1),rest.slice(1)));return go('S',w);};
 const fixed={S:['aA'],A:['aA','bB'],B:['aB','bB','']},orig={S:['aA'],A:['aA','bB'],B:['aA','bB','']};
 for(const w of words(['a','b'],6))assert.equal(derivable(fixed,w),w.startsWith('a')&&w.includes('b'),w);
 assert.equal(derivable(orig,'aba'),false);
 const parity={states:['GG','GU','UG','UU'],alphabet:['a','b','c'],start:'GG',accept:['GU'],transitions:{GG:{a:'UG',b:'GU',c:'GG'},GU:{a:'UU',b:'GG',c:'GU'},UG:{a:'GG',b:'UU',c:'UG'},UU:{a:'GU',b:'UG',c:'UU'}}};
 for(const w of words(['a','b','c'],6))assert.equal(M.runDfaPartial(parity,w).accepted,w.length>0&&count(w,'a')%2===0&&count(w,'b')%2===1,w);
 const r22=minimize(M.sheet22Dfa);assert.deepEqual(r22.unreachable,[]);
 assert.deepEqual(r22.groups.map(g=>g.join(',')).sort(),['q0,q3','q1,q6','q2','q4','q5']);
 assert.deepEqual(M.wordPartition(M.sheet22Dfa,words(['a','b'],3)).map(g=>g.join(',')).sort(),['q0,q3','q1,q6','q2','q4','q5']);
});

test('Aufgabe 2 and Altklausur 1h: language operations',()=>{
 assert.deepEqual(M.rightQuotient(['00','01','001'],['','0','1']),['0','00','01','001']);
 assert.deepEqual(M.rightQuotient(['0'],['1']),[]);
 assert.deepEqual(M.product(['00','01','10','11'],['0','1']),['000','001','010','011','100','101','110','111']);
});
