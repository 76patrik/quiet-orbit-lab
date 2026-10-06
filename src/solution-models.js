// Exakte Modelle der Übungs- und Altklausuraufgaben. Grafik, Tabelle, Schrittfolge und Tests
// verwenden dieselben Objekte. Transkribiert aus Aufgaben_Loesungen.pdf und Altklausur_Loesung.pdf
// (Grafiken einzeln geprüft, PDF-Seiten stehen jeweils dabei).

export const BLANK='⊔';

// ---- Endliche Automaten ----
// Altklausur, Aufgabe 4a (PDF-Seite 5).
export const examMinDfa={
 states:['q0','q1','q2','q3','q4','q5'],alphabet:['a','b'],start:'q0',accept:['q1','q4'],
 transitions:{q0:{a:'q3',b:'q2'},q1:{a:'q3',b:'q0'},q2:{a:'q3',b:'q2'},q3:{a:'q5',b:'q0'},q4:{a:'q3',b:'q2'},q5:{a:'q1',b:'q4'}}
};
// Altklausur, Aufgabe 4b (PDF-Seite 6): a⁺ # b⁺ # c⁺, fehlende Übergänge führen in einen Fangzustand.
export const examHashDfa={
 states:['s','qa','qy','qb','qz','qc'],alphabet:['a','b','c','#'],start:'s',accept:['qc'],
 transitions:{s:{a:'qa'},qa:{a:'qa','#':'qy'},qy:{b:'qb'},qb:{b:'qb','#':'qz'},qz:{c:'qc'},qc:{c:'qc'}}
};
// Aufgaben, Aufgabe 4a Lösung (PDF-Seite 4): keine zwei gleichen Zeichen hintereinander.
export const alternatingDfa={
 states:['q0','q1','q2','q3','q4','err'],alphabet:['0','1'],start:'q0',accept:['q0','q1','q2','q3','q4'],
 transitions:{q0:{0:'q3',1:'q1'},q1:{0:'q2',1:'err'},q2:{0:'err',1:'q1'},q3:{0:'err',1:'q4'},q4:{0:'q3',1:'err'},err:{0:'err',1:'err'}}
};
// Aufgaben, Aufgabe 4 Vorgabe für c) (PDF-Seite 4). err ist ein Fangzustand.
export const sheet4Dfa={
 states:['q0','q1','q2','q3','err'],alphabet:['0','1'],start:'q0',accept:['q0','q1'],
 transitions:{q0:{0:'err',1:'q1'},q1:{0:'err',1:'q3'},q2:{0:'q1',1:'q0'},q3:{0:'q0',1:'q2'},err:{0:'err',1:'err'}}
};
// Aufgaben, Aufgabe 6 (PDF-Seite 6). '' steht für ε.
export const sheet6Nfa={
 states:['q0','q1','q2'],alphabet:['0','2','4'],start:'q0',accept:['q2'],
 transitions:{q0:{'':['q2'],4:['q1']},q1:{2:['q2']},q2:{0:['q0','q2']}}
};
// Aufgaben, Aufgabe 7 (PDF-Seite 7). Trotz „NEA“ hat jeder Zustand genau einen a- und b-Nachfolger.
export const sheet7Dfa={
 states:['q1','q2','q3','q4','q5','q6','q7','q8'],alphabet:['a','b'],start:'q1',accept:['q8'],
 transitions:{q1:{a:'q2',b:'q3'},q2:{a:'q6',b:'q4'},q3:{a:'q5',b:'q6'},q4:{a:'q2',b:'q6'},q5:{a:'q6',b:'q3'},q6:{a:'q8',b:'q7'},q7:{a:'q8',b:'q7'},q8:{a:'q8',b:'q8'}}
};
// Aufgaben, Aufgabe 8 Lösung (PDF-Seite 9): beginnt mit a, enthält ein b.
export const sheet8Dfa={
 states:['q0','q1','q2','err'],alphabet:['a','b'],start:'q0',accept:['q2'],
 transitions:{q0:{a:'q1',b:'err'},q1:{a:'q1',b:'q2'},q2:{a:'q2',b:'q2'},err:{a:'err',b:'err'}}
};
// Aufgaben, „Aufgabe 22: Minimierung DEA“ (PDF-Seite 24).
export const sheet22Dfa={
 states:['q0','q1','q2','q3','q4','q5','q6'],alphabet:['a','b'],start:'q0',accept:['q2','q4'],
 transitions:{q0:{a:'q1',b:'q4'},q1:{a:'q5',b:'q2'},q2:{a:'q0',b:'q2'},q3:{a:'q6',b:'q4'},q4:{a:'q2',b:'q5'},q5:{a:'q5',b:'q3'},q6:{a:'q5',b:'q2'}}
};

// Fehlende Übergänge zählen als Übergang in einen (nicht gezeichneten) Fangzustand.
export function runDfaPartial(dfa,word){
 let state=dfa.start;const trace=[state];
 for(const c of word){state=state===null?null:dfa.transitions[state]?.[c]??null;trace.push(state);}
 return {trace,accepted:state!==null&&dfa.accept.includes(state)};
}
// Äquivalenzklassen über die Wortmethode der Vorlesung: Zustände bleiben zusammen,
// solange jedes Wort bis zur Länge k beide in F oder beide außerhalb von F führt.
export function wordPartition(dfa,words){
 const ends=s=>words.map(w=>dfa.accept.includes([...w].reduce((q,c)=>dfa.transitions[q][c],s))?1:0).join('');
 const groups=new Map();
 for(const s of dfa.states){const k=ends(s);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(s);}
 return [...groups.values()];
}
export const wordsUpTo=(alphabet,length)=>{
 let level=[''],all=[''];
 for(let i=0;i<length;i++){level=level.flatMap(w=>alphabet.map(c=>w+c));all=all.concat(level);}
 return all;
};

// ---- Grammatiken in Chomsky-Normalform (für cyk aus algorithms.js) ----
// Altklausur, Aufgabe 6a (PDF-Seite 9).
export const examCykGrammar={S:[['A','T'],['U','B'],['T','U']],T:[['T','A'],['b']],U:[['T','U'],['B','T']],A:[['a']],B:[['b']]};
// Aufgaben, Aufgabe 16 (PDF-Seite 18).
export const sheet16Grammar={S:[['Za','S'],['Za','C'],['S','Za'],['d'],['Zd','E'],['c'],['Zc','F']],D:[['d'],['Zd','E']],C:[['d'],['Zd','E'],['c']],Za:[['a']],Zc:[['c']],Zd:[['d']],E:[['D','D']],F:[['S','Zd']]};
// Aufgaben, Aufgabe 23 (PDF-Seite 26).
export const sheet23Grammar={S:[['D','E']],A:[['A','A'],['C','C'],['e']],C:[['C','D'],['a']],D:[['D','D'],['d']],E:[['e']]};

// ---- Turingmaschinen ----
// δ: Zustand → gelesenes Zeichen → [schreiben, Richtung L/R/N, Folgezustand]. '*' = jedes Zeichen außer ⊔.
// Altklausur Aufgabe 5 (PDF-Seite 7) = Aufgaben Aufgabe 12 (PDF-Seite 14), identischer Graph.
export const zeroEraserTm={
 states:['q0','q1','q2','q3','q4','q5'],start:'q0',accept:['q1'],
 delta:{
  q0:{1:['1','R','q0'],0:['0','R','q2'],[BLANK]:[BLANK,'N','q1']},
  q2:{0:['0','R','q2'],1:['0','L','q4'],[BLANK]:[BLANK,'L','q3']},
  q4:{0:['0','L','q4'],[BLANK]:[BLANK,'R','q5'],1:['1','R','q5']},
  q5:{0:['1','R','q2']},
  q3:{0:[BLANK,'L','q3'],[BLANK]:[BLANK,'N','q1'],1:['1','N','q1']}
 }
};
// Aufgaben, „Aufgabe 22: Turingmaschinen“ c) (PDF-Seite 25).
export const shiftZeroTm={
 states:['s','q1','q2','q3','q4','q5','q6','q7'],start:'s',accept:['q7'],
 delta:{
  s:{0:['X','R','q1']},
  q1:{1:['0','L','q2'],0:['0','L','q4'],[BLANK]:[BLANK,'L','q6']},
  q2:{X:['1','R','q3']},q3:{0:['X','R','q1']},
  q4:{X:['0','R','q5']},q5:{0:['X','R','q1']},
  q6:{X:['0','R','q7']}
 }
};
// Aufgaben, Aufgabe 13a Lösung (PDF-Seite 15): ß → s, Anzahl als Strichliste aus # hinten anhängen.
export const eszettTm={
 states:['q0','q1','q2','q3'],start:'q0',accept:['q3'],
 delta:{
  q0:{'ß':['s','R','q1'],'*':['*','R','q0'],[BLANK]:[BLANK,'L','q3']},
  q1:{'*':['*','R','q1'],[BLANK]:['#','L','q2']},
  q2:{'*':['*','L','q2'],[BLANK]:[BLANK,'R','q0']}
 }
};
export function runTm(tm,word,maxSteps=500){
 const tape=new Map([...word].map((c,i)=>[i,c]));let head=0,state=tm.start;const configs=[];
 const snap=()=>{const keys=[...tape.keys()].filter(k=>tape.get(k)!==BLANK);const lo=Math.min(0,head,...keys),hi=Math.max(word.length-1,head,...keys);
  return {state,head:head-lo,cells:Array.from({length:hi-lo+1},(_,i)=>tape.get(lo+i)??BLANK)};};
 configs.push(snap());
 for(let i=0;i<maxSteps;i++){
  if(tm.accept.includes(state))return {configs,halted:true,accepted:true};
  const read=tape.get(head)??BLANK,row=tm.delta[state]||{};
  const rule=row[read]||(read!==BLANK?row['*']:undefined);
  if(!rule)return {configs,halted:true,accepted:false};
  const [write,move,next]=rule;
  tape.set(head,write==='*'?read:write);
  head+=move==='R'?1:move==='L'?-1:0;state=next;configs.push(snap());
 }
 return {configs,halted:false,accepted:false};
}
// Konfiguration in Vorlesungsschreibweise: Band links vom Kopf, (Zustand), Rest. Blanks am Rand entfallen.
export function configLabel({state,head,cells}){
 let lo=0,hi=cells.length-1;
 while(lo<head&&cells[lo]===BLANK)lo++;
 while(hi>head&&cells[hi]===BLANK)hi--;
 const left=cells.slice(lo,head).join(''),right=cells.slice(head,hi+1).join('');
 return `${left}(${state})${right}`;
}

// ---- Graphen ----
// Altklausur Aufgabe 3b (PDF-Seite 3).
export const examGraph={
 vertices:['a','b','c','d','e','f','g'],
 edges:[['a','b'],['a','c'],['a','g'],['a','d'],['b','c'],['b','g'],['b','e'],['e','d'],['d','c'],['d','f'],['c','f'],['c','g']]
};
// Aufgaben, Aufgabe 19 (PDF-Seite 21).
export const sheet19Graph={
 vertices:['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13'],
 edges:[['v1','v2'],['v1','v4'],['v1','v8'],['v2','v3'],['v2','v10'],['v2','v12'],['v2','v13'],['v3','v4'],['v3','v5'],['v3','v10'],['v3','v13'],
  ['v4','v5'],['v4','v6'],['v4','v7'],['v4','v9'],['v4','v12'],['v5','v11'],['v6','v9'],['v6','v11'],['v7','v11'],['v8','v10'],['v8','v11'],['v9','v10'],['v10','v13'],['v12','v13']]
};
const edgeSet=g=>new Set(g.edges.map(e=>[...e].sort().join(':')));
export const hasEdge=(g,a,b)=>edgeSet(g).has([a,b].sort().join(':'));
export const degree=(g,v)=>g.edges.filter(e=>e.includes(v)).length;
export const isVertexCover=(g,set)=>g.edges.every(([a,b])=>set.includes(a)||set.includes(b));
export const isDominating=(g,set)=>g.vertices.every(v=>set.includes(v)||g.edges.some(([a,b])=>(a===v&&set.includes(b))||(b===v&&set.includes(a))));
export const isClique=(g,set)=>set.every((a,i)=>set.slice(i+1).every(b=>hasEdge(g,a,b)));
export const isHamiltonCycle=(g,cycle)=>cycle.length===g.vertices.length&&new Set(cycle).size===cycle.length&&cycle.every((v,i)=>hasEdge(g,v,cycle[(i+1)%cycle.length]));
export function properColoring(g,colors){return g.edges.every(([a,b])=>colors[a]!==colors[b]);}

// ---- Sprachen ----
// Rechtsquotient L1 \ L2 = {w : ∃z∈L2 mit wz∈L1} (Aufgabenblatt nennt ihn „Durchschnitt“).
export function rightQuotient(l1,l2){
 const out=new Set();
 for(const x of l1)for(const z of l2)if(x.endsWith(z))out.add(x.slice(0,x.length-z.length));
 return [...out].sort((a,b)=>a.length-b.length||a.localeCompare(b));
}
export const product=(a,b)=>[...new Set(a.flatMap(x=>b.map(y=>x+y)))].sort();
