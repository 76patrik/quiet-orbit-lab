import {questions,allTopics} from './curriculum.js';
import {today} from './progress.js';
export function questionStatus(state,qid){
 const result=state?.results[qid];
 if(!result)return 'new';
 if(state.errors[qid]&&!state.errors[qid].resolved)return 'open';
 return result.successes.length?'solved':'open';
}
export function filterQuestions({topic='all',week='all',level='all',kind='all',status='all',search='',day=today()}={},pool=questions,state){
 const query=search.trim().toLocaleLowerCase('de');
 return pool.filter(q=>(topic==='all'||q.lesson===topic)&&(week==='all'||allTopics.find(t=>t.id===q.lesson)?.week===Number(week))&&(level==='all'||q.level===Number(level))&&(kind==='all'||q.kind===kind)
  &&(!query||`${q.id} ${q.prompt} ${allTopics.find(t=>t.id===q.lesson)?.title}`.toLocaleLowerCase('de').includes(query))
  &&(status==='all'||status==='due'&&state?.results[q.id]?.due<=day||status==='open'&&questionStatus(state,q.id)!=='solved'||status===questionStatus(state,q.id)));
}
export const practiceCount=(count,available)=>count==='all'?available:Math.min(available,Math.max(1,Math.floor(Number(count)||10)));
export function selectPractice(state,options={},pool=questions,random=Math.random){
 const day=options.day||today(),filtered=filterQuestions(options,pool,state),count=practiceCount(options.count,filtered.length);
 const ranked=filtered.map(q=>{
  const r=state.results[q.id],error=state.errors[q.id],sureWrong=state.confidence[q.id]?.last==='sure'&&!state.confidence[q.id]?.lastCorrect;
  const priority=error&&!error.resolved?(sureWrong?0:1):r&&r.due<=day?2:!r?3:!r.successes.length?4:5;
  return {q,priority,tie:random()};
 }).sort((a,b)=>a.priority-b.priority||a.tie-b.tie);
 const selected=[],families=new Set(),topicCounts={};
 // Within each priority, balance topics and avoid repetitive numeric variants when possible.
 for(const priority of [0,1,2,3,4,5]){
  const remaining=ranked.filter(r=>r.priority===priority);
  while(remaining.length&&selected.length<count){
   remaining.sort((a,b)=>(topicCounts[a.q.lesson]||0)-(topicCounts[b.q.lesson]||0)||a.tie-b.tie);
   const index=remaining.findIndex(r=>!families.has(r.q.family||r.q.id));if(index<0)break;
   const [{q}]=remaining.splice(index,1);selected.push(q);families.add(q.family||q.id);topicCounts[q.lesson]=(topicCounts[q.lesson]||0)+1;
  }
 }
 for(const {q} of ranked)if(selected.length<count&&!selected.some(x=>x.id===q.id))selected.push(q);
 return selected;
}
export const missions=[
 {id:'foundations',title:'Grundlagenpilot',text:'8 verschiedene Grundlagenaufgaben lösen.',topics:['notation','alphabet','empty','languages'],target:8},
 {id:'algebra',title:'Sprachlabor',text:'12 verschiedene Aufgaben zu Sprachoperationen lösen.',topics:['sets','concat','closure','quotient'],target:12},
 {id:'machines',title:'Automatencrew',text:'12 verschiedene Automaten- und RegEx-Aufgaben lösen.',topics:['regex','construct','dfa','parity','alternate','complement'],target:12},
 {id:'beyond',title:'Neue Galaxien',text:'12 Aufgaben zu NEA, Minimierung oder Pumping lösen.',topics:['nea','minimize','pumping'],target:12},
 {id:'parser',title:'Parserwerkstatt',text:'12 Aufgaben zu Grammatiken, CYK oder Kellerautomaten lösen.',topics:['grammar','cnf','cyk','stack'],target:12},
 {id:'limits',title:'Grenzen erkunden',text:'12 Aufgaben zu TM, NP, Reduktionen oder Entscheidbarkeit lösen.',topics:['tm','np','reduction','decidable'],target:12}
];
export const missionProgress=(state,mission)=>questions.filter(q=>mission.topics.includes(q.lesson)&&state.results[q.id]?.successes.length).length;
export const confidenceStats=state=>Object.values(state.confidence).reduce((a,c)=>({sure:a.sure+c.sure,wrongSure:a.wrongSure+c.wrongSure}),{sure:0,wrongSure:0});
