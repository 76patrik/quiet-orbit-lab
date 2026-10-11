// Baut Diagramm-Spezifikationen direkt aus den geprüften Modellen. So können Grafik und Lösung
// nicht auseinanderlaufen: Jede gezeichnete Kante stammt aus der Übergangsfunktion.
import {BLANK} from './solution-models.js';

const group=(pairs)=>{const m=new Map();for(const [from,to,label] of pairs){const k=`${from}>${to}`;if(!m.has(k))m.set(k,{from,to,labels:[]});m.get(k).labels.push(label);}return [...m.values()];};

function build(pairs,layout,{accept=[],start,title,caption,highlight,tones={},labels={},joiner=', ',r}={}){
 const edges=group(pairs).map(({from,to,labels:ls})=>({from,to,label:ls.join(joiner),bend:layout.bends?.[`${from}>${to}`],loop:layout.loops?.[from],lx:layout.shift?.[`${from}>${to}`]?.[0],ly:layout.shift?.[`${from}>${to}`]?.[1],labelOffset:layout.offset?.[`${from}>${to}`]}));
 const nodes=Object.entries(layout.pos).map(([id,[x,y]])=>({id,x,y,label:labels[id]??id,accept:accept.includes(id),start:id===start?(layout.startDir||true):false,tone:tones[id]}));
 return {type:'diagram',width:layout.width,height:layout.height,nodes,edges,title,caption,highlight,r};
}

// DEA (fehlende Übergänge bleiben ungezeichnet = Fangzustand).
export function dfaDiagram(dfa,layout,opts={}){
 const pairs=[];for(const s of dfa.states)for(const c of dfa.alphabet){const t=dfa.transitions[s]?.[c];if(t&&layout.pos[t]&&layout.pos[s]&&!layout.skip?.includes(`${s}>${t}`))pairs.push([s,t,c]);}
 return build(pairs,layout,{accept:dfa.accept,start:dfa.start,...opts});
}
// NEA mit Mengen-Nachfolgern und ε ('').
export function nfaDiagram(nfa,layout,opts={}){
 const pairs=[];for(const s of nfa.states)for(const c of ['',...nfa.alphabet])for(const t of nfa.transitions[s]?.[c]||[])pairs.push([s,t,c===''?'ε':c]);
 return build(pairs,layout,{accept:nfa.accept,start:nfa.start,...opts});
}
// Turingmaschine: Beschriftung „gelesen | geschrieben | Richtung“, mehrere Regeln untereinander.
export function tmDiagram(tm,layout,opts={}){
 const pairs=[];for(const [s,row] of Object.entries(tm.delta))for(const [read,[write,move,t]] of Object.entries(row))pairs.push([s,t,`${read==='*'?'*':read}|${write}|${move}`]);
 return build(pairs,layout,{accept:tm.accept,start:tm.start,joiner:'\n',...opts});
}
// Ungerichteter Graph mit optional markierten Knoten und Kanten.
export function graphDiagram(graph,layout,{highlightNodes=[],highlightEdges=[],tones={},title,caption,dim=false}={}){
 return {type:'diagram',directed:false,width:layout.width,height:layout.height,r:layout.r||20,title,caption,
  nodes:graph.vertices.map(v=>({id:v,x:layout.pos[v][0],y:layout.pos[v][1],tone:tones[v]})),
  edges:graph.edges.map(([a,b])=>({from:a,to:b,bend:layout.bends?.[`${a}>${b}`]})),
  highlight:{nodes:highlightNodes,edges:highlightEdges.map(([a,b])=>`${a}>${b}`),dim}};
}
// Begriffskarte aus Kästen.
export function conceptMap({width,height,boxes,links,title,caption}){
 return {type:'diagram',width,height,title,caption,r:26,
  nodes:boxes.map(([id,x,y,w,label,sub,tone])=>({id,x,y,w,h:sub?62:46,label,sub,shape:'box',tone})),
  edges:links.map(([from,to,label,bend,lx,ly])=>({from,to,label,bend,lx,ly,labelOffset:14}))};
}
export const cycleEdges=cycle=>cycle.map((v,i)=>[v,cycle[(i+1)%cycle.length]]);
export {BLANK};
