import {examById} from './exams.js';
import {grade,setLabel} from './engine.js';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
export const hasAnswer=v=>typeof v==='string'&&v.trim().length>0;
export function createAttempt(examId,{minutes=0,now=Date.now(),previous=[]}={}){
 if(!Object.hasOwn(examById,examId))throw new Error('Unbekannte Klausur.');
 if(!Number.isInteger(minutes)||minutes<0||minutes>240)throw new Error('Ungültige Trainingsdauer.');
 return {id:`attempt-${now}-${Math.random().toString(36).slice(2,10)}`,revision:1,examId,index:0,startedAt:now,limitSeconds:minutes*60,answers:{},ratings:{},flags:[],submittedAt:null,knownVariant:previous.some(a=>a.examId===examId&&a.submittedAt!==null)};
}
export function remainingSeconds(attempt,now=Date.now()){
 return attempt.limitSeconds?Math.max(0,attempt.limitSeconds-Math.floor(Math.max(0,now-attempt.startedAt)/1000)):null;
}
export function setExamAnswer(attempt,id,value){
 if(attempt.submittedAt!==null)throw new Error('Abgegebene Antworten bleiben unverändert.');
 const q=examById[attempt.examId].questions.find(q=>q.id===id);
 if(!q||typeof value!=='string'||value.length>4000)throw new Error('Ungültige Antwort.');
 attempt.answers[id]=value;
}
export function submitAttempt(attempt,now=Date.now()){
 if(attempt.submittedAt!==null)return false;
 attempt.submittedAt=Math.max(now,attempt.startedAt);return true;
}
export function rateCriterion(attempt,qid,index,value){
 const q=examById[attempt.examId]?.questions.find(q=>q.id===qid);
 if(attempt.submittedAt===null||q?.type!=='open'||!hasAnswer(attempt.answers[qid])||!q.rubric[index]||!Number.isInteger(value)||value<0||value>q.rubric[index].points)throw new Error('Ungültige Selbstbewertung.');
 attempt.ratings[qid]??=q.rubric.map(()=>null);attempt.ratings[qid][index]=value;
}
export function examReport(attempt){
 if(attempt.submittedAt===null)throw new Error('Lösungen gibt es erst nach der Abgabe.');
 const exam=examById[attempt.examId];let autoPoints=0,autoMax=0,selfPoints=0,selfMax=0,pendingPoints=0;
 const items=exam.questions.map(q=>{
  const value=attempt.answers[q.id]||'';let points=0,pending=0,error='';
  if(q.type==='open'){
   selfMax+=q.points;
   if(hasAnswer(value))q.rubric.forEach((r,i)=>{const v=attempt.ratings[q.id]?.[i];if(v===null||v===undefined)pending+=r.points;else points+=v;});
   selfPoints+=points;pendingPoints+=pending;
  }else{
   autoMax+=q.points;
   try{if(hasAnswer(value)&&grade(q,value))points=q.points;}catch(e){error=e.message;}
   autoPoints+=points;
  }
  return {id:q.id,topic:q.topic,section:q.section,points,max:q.points,pending,value,error,automatic:q.type!=='open'};
 });
 const sections=[...new Set(exam.questions.map(q=>q.section))].map(section=>{
  const rows=items.filter(q=>q.section===section);return {title:section,points:rows.reduce((s,q)=>s+q.points,0),max:rows.reduce((s,q)=>s+q.max,0),pending:rows.reduce((s,q)=>s+q.pending,0),topics:[...new Set(rows.filter(q=>q.points<q.max&&!q.pending).map(q=>q.topic))]};
 });
 return {autoPoints,autoMax,selfPoints,selfMax,pendingPoints,total:autoPoints+selfPoints,max:exam.points,items,sections,complete:pendingPoints===0};
}
export const correctAnswer=q=>q.type==='choice'?q.options[q.answer]:q.type==='set'?setLabel(q.answer):String(q.answer??'');
export function validateExamAttempts(data){
 if(data===undefined)return [];
 const fail=()=>{throw new Error('Die Sicherung enthält einen ungültigen Klausurstand. Dein bisheriger Stand bleibt erhalten.');};
 if(!Array.isArray(data)||data.length>100)fail();const ids=new Set();
 return data.map(a=>{
  if(!object(a)||typeof a.id!=='string'||!/^attempt-[0-9]+-[a-z0-9]{1,16}$/.test(a.id)||ids.has(a.id)||a.revision!==1||!Object.hasOwn(examById,a.examId))fail();ids.add(a.id);
  const exam=examById[a.examId],qids=new Set(exam.questions.map(q=>q.id)),integer=(v,max)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
  if(!integer(a.index,exam.questions.length-1)||!integer(a.startedAt,8640000000000000)||!integer(a.limitSeconds,14400)||a.limitSeconds%60!==0||typeof a.knownVariant!=='boolean'||(a.submittedAt!==null&&(!integer(a.submittedAt,8640000000000000)||a.submittedAt<a.startedAt))||!object(a.answers)||!object(a.ratings)||!Array.isArray(a.flags)||a.flags.some(id=>!qids.has(id)))fail();
  const copy={id:a.id,revision:1,examId:a.examId,index:a.index,startedAt:a.startedAt,limitSeconds:a.limitSeconds,knownVariant:a.knownVariant,submittedAt:a.submittedAt,answers:{},ratings:{},flags:[...new Set(a.flags)]};
  for(const [id,v] of Object.entries(a.answers)){if(!qids.has(id)||typeof v!=='string'||v.length>4000)fail();const q=exam.questions.find(q=>q.id===id);if(q.type==='choice'&&v!==''&&!q.options.some((_,i)=>String(i)===v))fail();copy.answers[id]=v;}
  for(const [id,ratings] of Object.entries(a.ratings)){
   const q=exam.questions.find(q=>q.id===id);
   if(a.submittedAt===null||q?.type!=='open'||!hasAnswer(copy.answers[id])||!Array.isArray(ratings)||ratings.length!==q.rubric.length||ratings.some((v,i)=>v!==null&&!integer(v,q.rubric[i].points)))fail();copy.ratings[id]=[...ratings];
  }
  return copy;
 });
}
