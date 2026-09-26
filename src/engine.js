// Pure learning algorithms; shared by the UI and the independent correctness tests.
export const wordLabel = w => w === '' ? 'ε' : w;
export const ordered = set => [...new Set(set)].sort((a,b) => a.length-b.length || a.localeCompare(b));
export const setLabel = set => set.length ? `{ ${ordered(set).map(wordLabel).join(', ')} }` : '∅';
export function parseSet(input) {
  let raw = input.trim();
  if (['∅','{}','{ }','empty'].includes(raw)) return [];
  if (!raw) throw new Error('Gib eine Menge ein. Für die leere Menge schreibe ∅, für das leere Wort ε.');
  if (raw.startsWith('{') && raw.endsWith('}')) raw = raw.slice(1,-1).trim();
  if (/[{}]/.test(raw)) throw new Error('Nutze eine einfache Menge von Wörtern, z. B. {ε, 0, 01}.');
  const values = raw.split(/[,;\n]/).map(s=>s.trim());
  if (values.some(s=>!s || /\s/.test(s))) throw new Error('Trenne Wörter mit Kommas. Leerzeichen innerhalb eines Wortes sind hier nicht erlaubt.');
  if (values.length>50 || values.some(w=>w.length>50)) throw new Error('Bitte höchstens 50 Wörter mit je 50 Zeichen verwenden.');
  if (values.includes('∅')) throw new Error('∅ ist eine leere Menge, kein Wort. Schreibe ∅ allein oder verwende ε für das leere Wort.');
  return ordered(values.map(w => ['ε','eps','epsilon'].includes(w) ? '' : w));
}
export const equalSets = (a,b) => JSON.stringify(ordered(a)) === JSON.stringify(ordered(b));
export function languageOperation(a,b,op) {
  switch(op) {
    case 'union': return ordered([...a,...b]);
    case 'intersection': return ordered(a.filter(w=>b.includes(w)));
    case 'difference': return ordered(a.filter(w=>!b.includes(w)));
    case 'concat': return ordered(a.flatMap(x=>b.map(y=>x+y)));
    case 'quotient': return ordered(a.flatMap(x=>b.filter(y=>x.endsWith(y)).map(y=>y ? x.slice(0,-y.length) : x)));
    default: throw new Error('Unbekannte Operation.');
  }
}
export function binaryWords(max=5) {
  let level=['']; const out=[''];
  for(let i=0;i<max;i++){level=level.flatMap(w=>[w+'0',w+'1']);out.push(...level);}
  return out;
}
export function runDfa(dfa,word) {
  let state = dfa.start; const trace=[state];
  for(const c of word) {
    if(!dfa.alphabet.includes(c)) throw new Error(`Das Zeichen „${c}“ liegt nicht im Alphabet.`);
    const next=dfa.transitions[state]?.[c];
    if(next===undefined || !dfa.states.includes(next)) throw new Error(`Übergang für ${state} und ${c} fehlt.`);
    state=next; trace.push(state);
  }
  return {state,trace,accepted:dfa.accept.includes(state)};
}
export function validateDfa(dfa) {
  if(!dfa.states.includes(dfa.start) || dfa.accept.some(s=>!dfa.states.includes(s))) throw new Error('Start- oder Endzustand ungültig.');
  for(const s of dfa.states) for(const c of dfa.alphabet) if(!dfa.states.includes(dfa.transitions[s]?.[c])) throw new Error(`Übergang für ${s} und ${c} fehlt.`);
}
// Exact equivalence through the reachable product, yielding a shortest counterexample.
export function compareDfa(a,b) {
  validateDfa(a);validateDfa(b);
  if(!equalSets(a.alphabet,b.alphabet)) throw new Error('Die Alphabete müssen gleich sein.');
  const queue=[[a.start,b.start,'']],seen=new Set();
  for(let i=0;i<queue.length;i++){
    const [x,y,w]=queue[i],key=JSON.stringify([x,y]);if(seen.has(key)) continue;seen.add(key);
    if(a.accept.includes(x)!==b.accept.includes(y)) return {equal:false,word:w,expected:b.accept.includes(y),actual:a.accept.includes(x)};
    for(const c of a.alphabet) queue.push([a.transitions[x][c],b.transitions[y][c],w+c]);
  }
  return {equal:true};
}

// Thompson NFA, not JavaScript's backtracking RegExp. Supported: literals, ε, ∅, |/∪, concatenation, *, +.
export function compileRegex(expression, alphabet=['0','1']) {
  const src=expression.replace(/\s/g,'').replaceAll('∪','|').replaceAll('⁺','+');
  if(!src || src.length>120) throw new Error('Gib einen Ausdruck mit 1 bis 120 Zeichen ein. Nutze ε für das leere Wort.');
  let pos=0;const edges=[];
  const state=()=>{edges.push([]);return edges.length-1;};
  const edge=(from,to,symbol=null)=>edges[from].push({to,symbol});
  function atom(){
    let f;const c=src[pos++];
    if(c==='('){f=union();if(src[pos++]!==')') throw new Error('Eine schließende Klammer fehlt.');}
    else if(alphabet.includes(c) || c==='ε' || c==='∅') { const s=state(),e=state();if(c!=='∅') edge(s,e,c==='ε'?null:c);f=[s,e]; }
    else throw new Error(`Unerwartetes Zeichen „${c || 'Ende'}“. Erlaubt sind ${alphabet.join(', ')}, ε, ∅, (), ∪, |, *, + und ·.`);
    while(src[pos]==='*' || src[pos]==='+') {const op=src[pos++],s=state(),e=state();edge(s,f[0]);edge(f[1],f[0]);edge(f[1],e);if(op==='*') edge(s,e);f=[s,e];}
    return f;
  }
  function concat(){
    let f=atom();
    while(pos<src.length && !['|',')'].includes(src[pos])) {if(src[pos]==='·') pos++;const g=atom();edge(f[1],g[0]);f=[f[0],g[1]];}
    return f;
  }
  function union(){let f=concat();while(src[pos]==='|'){pos++;const g=concat(),s=state(),e=state();edge(s,f[0]);edge(s,g[0]);edge(f[1],e);edge(g[1],e);f=[s,e];}return f;}
  const [start,end]=union();if(pos!==src.length) throw new Error('Eine Klammer oder ein Operator steht an der falschen Stelle.');
  const closure=values=>{const result=new Set(values),todo=[...values];for(let i=0;i<todo.length;i++)for(const e of edges[todo[i]])if(e.symbol===null&&!result.has(e.to)){result.add(e.to);todo.push(e.to);}return [...result].sort((a,b)=>a-b);};
  const initial=closure([start]);
  const move=(values,c)=>closure(values.flatMap(s=>edges[s].filter(e=>e.symbol===c).map(e=>e.to)));
  const accepts=values=>values.includes(end);
  return {initial,move,accepts,alphabet,test(word){let cur=initial;for(const c of word){if(!alphabet.includes(c)) return false;cur=move(cur,c);}return accepts(cur);}};
}
export function compareRegex(left,right,alphabet=['0','1']) {
  const a=compileRegex(left,alphabet),b=compileRegex(right,alphabet),queue=[[a.initial,b.initial,'']],seen=new Set();
  for(let i=0;i<queue.length;i++) {
    const [x,y,w]=queue[i],key=JSON.stringify([x,y]);if(seen.has(key))continue;seen.add(key);
    if(seen.size>6000) throw new Error('Dieser Vergleich ist zu groß. Bitte vereinfache deinen Ausdruck.');
    if(a.accepts(x)!==b.accepts(y)) return {equal:false,word:w,expected:b.accepts(y),actual:a.accepts(x)};
    for(const c of alphabet) queue.push([a.move(x,c),b.move(y,c),w+c]);
  }
  return {equal:true};
}
export function grade(question,value) {
  if(question.type==='choice') return Number(value)===question.answer;
  if(question.type==='set') return equalSets(parseSet(value),question.answer);
  if(question.type==='regex') return compareRegex(value,question.answer).equal;
  return String(value).trim().toLowerCase().replace(/\s/g,'') === String(question.answer).toLowerCase().replace(/\s/g,'');
}

export const machines = {
  ends1:{name:'Endet auf 1',description:'Alle Binärwörter mit letzter 1.',states:['A','B'],alphabet:['0','1'],start:'A',accept:['B'],transitions:{A:{0:'A',1:'B'},B:{0:'A',1:'B'}},meanings:{A:'Anfang oder zuletzt 0',B:'Zuletzt 1'}},
  parity:{name:'Gerade Anzahl Einsen',description:'Null Einsen zählt als gerade.',states:['G','U'],alphabet:['0','1'],start:'G',accept:['G'],transitions:{G:{0:'G',1:'U'},U:{0:'U',1:'G'}},meanings:{G:'Gerade viele Einsen',U:'Ungerade viele Einsen'}},
  alternate:{name:'Keine gleichen Nachbarn',description:'Kein 00 und kein 11 – auch ε ist erlaubt.',states:['S','A','B','X'],alphabet:['0','1'],start:'S',accept:['S','A','B'],transitions:{S:{0:'A',1:'B'},A:{0:'X',1:'B'},B:{0:'A',1:'X'},X:{0:'X',1:'X'}},meanings:{S:'Noch kein Zeichen',A:'Gültig, zuletzt 0',B:'Gültig, zuletzt 1',X:'Verstoß gefunden'}},
  contains1:{name:'Mindestens eine 1',description:'Eine 1 gesehen? Dann bleibt das Wort gültig.',states:['N','J'],alphabet:['0','1'],start:'N',accept:['J'],transitions:{N:{0:'N',1:'J'},J:{0:'J',1:'J'}},meanings:{N:'Noch keine 1',J:'Mindestens eine 1'}},
  penultimate:{name:'Vorletztes Zeichen 1',description:'Wörter brauchen mindestens zwei Zeichen.',states:['q0','q1','q2','q3'],alphabet:['0','1'],start:'q0',accept:['q2','q3'],transitions:{q0:{0:'q0',1:'q1'},q1:{0:'q2',1:'q3'},q2:{0:'q0',1:'q1'},q3:{0:'q2',1:'q3'}},meanings:{q0:'00, Anfang oder 0',q1:'01 oder 1',q2:'10',q3:'11'}},
  exercise4c:{name:'Aufgabe 4c',description:'Der vollständige Automat aus dem Skript, S. 27.',states:['q0','q1','q2','q3','err'],alphabet:['0','1'],start:'q0',accept:['q0','q1'],transitions:{q0:{0:'err',1:'q1'},q1:{0:'err',1:'q3'},q2:{0:'q1',1:'q0'},q3:{0:'q0',1:'q2'},err:{0:'err',1:'err'}},meanings:{q0:'Start, akzeptierend',q1:'Akzeptierend',q2:'Nicht akzeptierend',q3:'Nicht akzeptierend',err:'Fehlerzustand'}}
};
