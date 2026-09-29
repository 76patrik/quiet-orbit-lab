import {machines} from './engine.js';
import {exercise7Dfa,examDfa,suffixDfa} from './week2-models.js';

// Explicit task metadata: never infer a machine by parsing the question text.
export const ends0Dfa = {
  ...machines.ends1, name:'Endet auf 0',
  transitions:{A:{0:'B',1:'A'},B:{0:'B',1:'A'}},
  meanings:{A:'Anfang oder zuletzt 1',B:'Zuletzt 0'}
};
export const modulo3Dfa = {
  name:'Anzahl Einsen modulo 3',states:['r0','r1','r2'],alphabet:['0','1'],start:'r0',accept:['r0'],
  transitions:{r0:{0:'r0',1:'r1'},r1:{0:'r1',1:'r2'},r2:{0:'r2',1:'r0'}},
  meanings:{r0:'Rest 0',r1:'Rest 1',r2:'Rest 2'}
};
const allWords={name:'Alle Wörter über {0,1}',states:['q'],alphabet:['0','1'],start:'q',accept:['q'],transitions:{q:{0:'q',1:'q'}}};
const exercise7View={...exercise7Dfa,width:940,height:580,positions:{q1:[85,280],q2:[250,115],q3:[250,445],q4:[430,115],q5:[430,445],q6:[620,235],q7:[620,440],q8:[825,280]}};
const complement=m=>({...m,name:`Komplement: ${m.name||'DEA'}`,accept:m.states.filter(s=>!m.accept.includes(s)),meaningsLabel:'Bedeutung im Original'});
const example=(machine,word,note='')=>({machine,word,title:'Beispiel zur Regel',note});
const task=(machine,word)=>({machine,word,title:'Der DEA aus dieser Aufgabe'});

// The keyword question needs its actual language, including the accepting prefix "do".
function keywordDfa(){
  const words=['do','double','catch','case'],prefixes=[...new Set(['',...words.flatMap(w=>[...w].map((_,i)=>w.slice(0,i+1)))])];
  const label=p=>p||'S',states=[...prefixes.map(label),'X'],alphabet=[...new Set(words.join(''))].sort();
  const transitions=Object.fromEntries(states.map(s=>[s,Object.fromEntries(alphabet.map(c=>[c,s==='X'?'X':prefixes.includes((s==='S'?'':s)+c)?(s==='S'?'':s)+c:'X']))]));
  const positions={S:[80,210],d:[210,80],do:[340,80],dou:[470,80],doub:[600,80],doubl:[730,80],double:[860,80],c:[210,330],ca:[340,330],cat:[470,260],catc:[600,260],catch:[730,260],cas:[470,410],case:[600,410],X:[860,410]};
  return {name:'Die Wörter do, double, catch und case',states,alphabet,start:'S',accept:words,transitions,positions,omitSinkEdges:'X',width:960,height:520};
}
const keywords=keywordDfa();
const specific={
  d1:example(machines.ends1,'10','Nach der 1 ist B akzeptierend. Die folgende 0 führt zurück nach A: Das ganze Wort wird abgelehnt.'),
  d2:example(machines.parity,''),
  d3:task(ends0Dfa,'101'),
  p1:task(machines.parity,'1'),p2:task(machines.parity,''),p3:task(machines.parity,'1111'),
  al1:task(machines.alternate,'011'),al2:task(machines.alternate,'110'),al3:task(keywords,'double'),
  cp1:{...task(complement(machines.exercise4c)),note:'Die Übergänge stammen aus dem vollständigen Skript-Beispiel Aufgabe 4c. Für die gefragte Endmenge genügt Q ∖ F = {q2, q3, err}; die Pfeile ändern sich nicht.'},
  cp3:example(complement(machines.parity),''),
  w8:example(machines.penultimate,'10'),w10:task(machines.parity,'101'),
  'extra-dfa-2':example({name:'Vollständig über {a,b,c}',states:['q'],alphabet:['a','b','c'],start:'q',accept:['q'],transitions:{q:{a:'q',b:'q',c:'q'}}},'abc'),
  'extra-dfa-3':example(allWords,''),
  'extra-dfa-4':example(machines.ends1,'10'),
  'extra-dfa-5':task(ends0Dfa,'10'),
  'extra-parity-1':task(complement(machines.parity),''),
  'extra-parity-2':task(machines.parity,'11'),
  'extra-parity-3':example(machines.parity,'1111','Dieser Paritätsautomat akzeptiert auch vier Einsen und erkennt daher nicht „genau zwei Einsen“.'),
  'extra-parity-4':example(modulo3Dfa,'111'),
  'extra-parity-5':task(machines.parity,'0'),
  'extra-alternate-1':task(machines.alternate,'0'),
  'extra-alternate-3':{...task(machines.alternate),note:'Vergleiche in der Tabelle die 0-Spalte: Von A (zuletzt 0) geht es nach X, von B (zuletzt 1) nach A.'},
  'extra-alternate-4':task(machines.alternate,'110'),
  'extra-alternate-5':task({...machines.alternate,name:'Nichtleere alternierende Wörter',accept:['A','B']},''),
  'extra-complement-2':example(complement(allWords),''),
  'extra-complement-3':example(complement(machines.ends1),'0','Gezeigt ist die korrekte Komplementbildung an einem vollständigen DEA. Bei einem NEA musst du zuvor determinisieren.'),
  'extra-minimize-3':example(examDfa,undefined,'U hat nur Schleifen und ist vom Start A unerreichbar.'),
  'extra-minimize-6':example(examDfa),
  'extra-minimize-7':example(allWords),
  'wk2-min-unreachable':example(examDfa,undefined,'U hat nur Schleifen und ist vom Start A unerreichbar.'),
  'wk2-min-signature':example({...examDfa,alphabet:['a','b'],transitions:Object.fromEntries(examDfa.states.map(s=>[s,{a:examDfa.transitions[s][0],b:examDfa.transitions[s][1]}]))},undefined,'Beispiel: A und B führen bei a beide nach B. Bei b geht A nach C (nicht akzeptierend), B nach D (akzeptierend). Also müssen A und B getrennt werden.'),
  'wk2-min-witness':{...task(exercise7View),note:'Restwort aa: q1 → q2 → q6 (nicht in F), aber q2 → q6 → q8 (in F). Die Klassen A={q1} und B={q2,q5} sind deshalb verschieden.'},
  'wk2-grammar-stop':example(suffixDfa),
  'wk2-grammar-transition':task(suffixDfa,'01'),
  'wk2-grammar-regex-3':task(suffixDfa,'01')
};

export function dfaFeedbackFor(question){
  if(question.dfaFeedback)return question.dfaFeedback;
  if(specific[question.id])return specific[question.id];
  if(question.id.startsWith('wk2-class-')||question.id.startsWith('wk2-min-'))return task(exercise7View);
  switch(question.lesson){
    case 'dfa':return example(machines.ends1,'10');
    case 'parity':return example(machines.parity,'101');
    case 'alternate':return example(machines.alternate,'011');
    case 'complement':return example(complement(machines.exercise4c),'0','Nur die Endzustände werden vertauscht. Auch der bisherige Fangzustand err akzeptiert im Komplement.');
    case 'minimize':return example(examDfa,undefined,'D und E sind gleichwertig, ebenso B und C. U ist vom Start aus nicht erreichbar.');
    default:return null;
  }
}
