// Small, exact teaching algorithms. Inputs are the finite examples authored in this app.
export const unique=xs=>[...new Set(xs)].sort();
export function epsilonClosure(nfa,states){
  const result=new Set(states),queue=[...states];
  for(let i=0;i<queue.length;i++)for(const t of nfa.transitions[queue[i]]?.['']||[])if(!result.has(t)){result.add(t);queue.push(t);}
  return [...result].sort();
}
export function nfaStep(nfa,states,symbol){return epsilonClosure(nfa,epsilonClosure(nfa,states).flatMap(s=>nfa.transitions[s]?.[symbol]||[]));}
export function determinize(nfa){
  const start=epsilonClosure(nfa,[nfa.start]),queue=[start],seen=new Set([JSON.stringify(start)]),rows=[];
  for(let i=0;i<queue.length;i++){
    const states=queue[i],next={};
    for(const c of nfa.alphabet){next[c]=nfaStep(nfa,states,c);const key=JSON.stringify(next[c]);if(!seen.has(key)){seen.add(key);queue.push(next[c]);}}
    rows.push({states,accept:states.some(s=>nfa.accept.includes(s)),next});
  }
  return rows;
}
export function minimize(dfa){
  const reachable=new Set([dfa.start]),queue=[dfa.start];
  for(let i=0;i<queue.length;i++)for(const c of dfa.alphabet){const t=dfa.transitions[queue[i]][c];if(!reachable.has(t)){reachable.add(t);queue.push(t);}}
  let groups=[[...reachable].filter(s=>dfa.accept.includes(s)),[...reachable].filter(s=>!dfa.accept.includes(s))].filter(g=>g.length);
  const rounds=[groups];
  while(true){
    const bucket=Object.fromEntries(groups.flatMap((g,i)=>g.map(s=>[s,i]))),next=[];
    for(const group of groups){const splits=new Map();for(const s of group){const key=JSON.stringify(dfa.alphabet.map(c=>bucket[dfa.transitions[s][c]]));if(!splits.has(key))splits.set(key,[]);splits.get(key).push(s);}next.push(...splits.values());}
    if(next.length===groups.length)return {groups:next.map(g=>g.sort()),rounds,unreachable:dfa.states.filter(s=>!reachable.has(s))};
    groups=next;rounds.push(groups);
  }
}
// CNF rules: {A: [['B','C'], ['a']]}. No unit rules; epsilon only for start on empty input.
export function cyk(rules,word,start='S'){
  const n=word.length,table=Array.from({length:n},()=>Array.from({length:n},()=>[]));
  if(!n)return {table,top:rules[start]?.some(r=>r.length===0)?[start]:[],accepted:!!rules[start]?.some(r=>r.length===0)};
  for(let i=0;i<n;i++)table[0][i]=Object.entries(rules).filter(([,rs])=>rs.some(r=>r.length===1&&r[0]===word[i])).map(([a])=>a).sort();
  for(let length=2;length<=n;length++)for(let from=0;from<=n-length;from++){
    const cell=[];
    for(let left=1;left<length;left++)for(const [a,rs] of Object.entries(rules))if(rs.some(r=>r.length===2&&table[left-1][from].includes(r[0])&&table[length-left-1][from+left].includes(r[1])))cell.push(a);
    table[length-1][from]=unique(cell);
  }
  const top=table[n-1][0];return {table,top,accepted:top.includes(start)};
}
export function graphSolutions(vertices,edges){
  const edge=new Set(edges.map(([a,b])=>[a,b].sort().join(':'))),subsets=[];
  for(let mask=0;mask<2**vertices.length;mask++)subsets.push(vertices.filter((_,i)=>mask&(1<<i)));
  const cliques=subsets.filter(s=>s.every((a,i)=>s.slice(i+1).every(b=>edge.has([a,b].sort().join(':')))));
  const covers=subsets.filter(s=>edges.every(([a,b])=>s.includes(a)||s.includes(b)));
  const omega=Math.max(...cliques.map(s=>s.length)),tau=Math.min(...covers.map(s=>s.length));
  return {omega,tau,cliques:cliques.filter(s=>s.length===omega),covers:covers.filter(s=>s.length===tau)};
}
export function incrementTrace(word){
  if(!/^[01]+$/.test(word))throw new Error('Ein nichtleeres Binärwort ist nötig.');
  const tape=new Map([...word].map((c,i)=>[i,c]));let head=0,state='R';const rows=[];
  function snap(){const lo=Math.min(0,head,...tape.keys()),hi=Math.max(word.length,head,...tape.keys());return {state,head,cells:Array.from({length:hi-lo+1},(_,i)=>tape.get(lo+i)||'□').join(''),offset:lo};}
  rows.push(snap());
  while(state!=='H'){
    const c=tape.get(head)||'□';
    if(state==='R'){if(c==='□'){state='C';head--;}else head++;}
    else if(c==='1'){tape.set(head,'0');head--;}
    else{tape.set(head,'1');state='H';}
    rows.push(snap());
  }
  const output=[...tape.keys()].sort((a,b)=>a-b).map(i=>tape.get(i)).join('');return {rows,output};
}
export const cnfExamples=[
 {S:[['A','B'],['A','C']],C:[['S','B']],A:[['a']],B:[['b']]},
 {S:[['A','B'],['B','A'],['S','S'],['A','T'],['B','U']],T:[['S','B']],U:[['S','A']],A:[['a']],B:[['b']]},
 {S:[['A','T'],['B','U'],['A','A'],['B','B']],T:[['S','A']],U:[['S','B']],A:[['a']],B:[['b']]}
];
export const ruleText=rules=>Object.entries(rules).map(([a,rs])=>`${a} → ${rs.map(r=>r.join('')||'ε').join(' | ')}`).join('; ');
export const incrementRules='Start R, Kopf auf dem ersten Zeichen. R: 0→(R,0,R), 1→(R,1,R), □→(C,□,L). C: 1→(C,0,L), 0→(H,1,N), □→(H,1,N). H hält. N bedeutet: Kopf bleibt stehen.';
