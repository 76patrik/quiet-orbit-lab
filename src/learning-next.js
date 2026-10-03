import {lessons,lessonsOfWeek,weeks} from './curriculum.js';
export function nextLearningStep(state,{lessonId,week}={}){
 const current=lessons.find(l=>l.id===lessonId);const n=week||current?.week;
 if(!n||!weeks.some(w=>w.n===n))return null;
 const pool=lessonsOfWeek(n),index=current?pool.indexOf(current):-1;
 const next=pool.slice(index+1).find(l=>!state.completed[l.id]);
 if(next)return {href:'#lesson/'+next.id,label:'Nächste Lektion: '+next.title};
 const remaining=pool.find(l=>!state.completed[l.id]&&l.id!==lessonId);
 if(remaining)return {href:'#lesson/'+remaining.id,label:'Noch offene Lektion: '+remaining.title};
 const nextWeek=weeks.find(w=>w.n===n+1);
 if(nextWeek){const first=lessonsOfWeek(nextWeek.n).find(l=>!state.completed[l.id]);return {href:first?'#lesson/'+first.id:'#path/'+nextWeek.n,label:`Weiter mit Woche ${nextWeek.n}: ${first?.title||nextWeek.title}`};}
 return {href:'#exams',label:'Lernpfad durchlaufen · Probeklausuren öffnen'};
}
export function nextLearningLink(state,options,esc){const next=nextLearningStep(state,options);return next?`<a class="btn learning-next" href="${next.href}">${esc(next.label)} →</a>`:'';}
