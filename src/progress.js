import {validateExamAttempts,examReport} from './exam-engine.js';
import { lessons, questionById, achievements } from './curriculum.js';
const KEY='orbit-progress-v1';
export const today=(date=new Date())=>{
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
export const addDays=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export const blankState=()=>({version:1,goal:5,examDate:'2026-11-20',results:{},completed:{},notes:{},errors:{},builders:{},checks:[],activity:{},awards:{},badges:[],lastLesson:null,focusSeconds:0,confidence:{},examAttempts:[]});
export function loadState(storage) {
  try {const raw=storage.getItem(KEY);return {state:raw?validateImport(JSON.parse(raw)):blankState(),error:null};}
  catch {return {state:blankState(),error:'Dein Speicherstand konnte nicht gelesen werden. Er wurde nicht überschrieben. Exportiere vorhandene Sicherungen, bevor du neu speicherst.'};}
}
export function saveState(state,storage){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
function award(state,key,xp,day){if(!state.awards[key]) state.awards[key]={xp,date:day};}
export const xpTotal=s=>Object.values(s.awards).reduce((sum,a)=>sum+a.xp,0);
export function streak(state,day=today()) {
  let n=0,cur=state.activity[day]?day:addDays(day,-1);
  while(state.activity[cur]){n++;cur=addDays(cur,-1);}
  return n;
}
export function touchActivity(state,day=today()) {
  if(!state.activity[day]) state.activity[day]={attempts:0,correct:0,unique:[]};
  return state.activity[day];
}
export function dueQuestions(state,day=today()){
  return Object.entries(state.results).filter(([id,r])=>questionById[id]&&r.due<=day).sort((a,b)=>a[1].due.localeCompare(b[1].due)).map(([id])=>questionById[id]);
}
export function recordAnswer(state,qid,correct,{assisted=false,day=today(),review=false,confidence=null}={}) {
  if(!Object.hasOwn(questionById,qid))throw new Error('Unbekannte Aufgabe.');
  if(['guess','unsure','sure'].includes(confidence)){const c=state.confidence[qid]||{guess:0,unsure:0,sure:0,wrongSure:0,last:null,lastCorrect:false};c[confidence]++;if(confidence==='sure'&&!correct)c.wrongSure++;c.last=confidence;c.lastCorrect=correct;state.confidence[qid]=c;}
  const old=state.results[qid]||{attempts:0,correct:0,stage:0,due:day,successes:[],everWrong:false,repaired:false};
  const wasDue=old.attempts>0&&old.due<=day;
  const wrongBefore=old.everWrong;
  old.attempts++;if(correct)old.correct++;else old.everWrong=true;
  if(correct && !assisted){
    if(!old.successes.includes(day)) old.successes.push(day);
    if(wrongBefore)old.repaired=true;
    award(state,`solve:${qid}`,10,day);
    if(review&&wasDue) award(state,`review:${day}:${qid}`,5,day);
    if(old.lastAdvance!==day){const intervals=[1,3,7,14];old.due=addDays(day,intervals[Math.min(old.stage,3)]);old.stage=Math.min(3,old.stage+1);old.lastAdvance=day;}else if(old.due<=day){old.due=addDays(day,1);}
    if(state.errors[qid])state.errors[qid].resolved=true;
  } else {
    old.stage=0;old.due=day;
    state.errors[qid]={...(state.errors[qid]||{note:'',rule:''}),date:day,resolved:false};
  }
  state.results[qid]=old;
  const a=touchActivity(state,day);a.attempts++;if(correct)a.correct++;
  if(correct&&!assisted&&!a.unique.includes(qid))a.unique.push(qid);
  return updateBadges(state,day);
}
export function completeLesson(state,id,day=today()){
  state.completed[id]=day;award(state,`lesson:${id}`,25,day);return updateBadges(state,day);
}
export function completeBuilder(state,id,day=today()){
  state.builders[id]=day;award(state,`builder:${id}`,50,day);touchActivity(state,day);return updateBadges(state,day);
}
export function updateBadges(state,day=today()){
  const newly=achievements.filter(a=>!state.badges.includes(a.id)&&(a.id==='exam-reflection'?state.examAttempts.some(e=>e.examId.startsWith('full-')&&e.submittedAt!==null&&Object.keys(e.ratings).length>0&&examReport(e).complete):a.rule(state,streak(state,day)))).map(a=>a.id);
  state.badges.push(...newly);return newly;
}
export function mastery(state,lessonId) {
  const evidence=Object.entries(state.results).filter(([id,r])=>questionById[id]?.lesson===lessonId && !id.startsWith('w') && r.successes.length);
  const independent=evidence.some(([a,ra])=>evidence.some(([b,rb])=>a!==b&&ra.successes.some(da=>rb.successes.some(db=>da!==db))));
  const unresolved=Object.keys(state.errors).some(id=>questionById[id]?.lesson===lessonId&&!state.errors[id].resolved);
  if(independent&&!unresolved) return 'safe';
  return evidence.length || state.completed[lessonId] ? 'learning' : 'new';
}
export function stats(state) {
  const results=Object.values(state.results);const attempts=results.reduce((x,r)=>x+r.attempts,0),correct=results.reduce((x,r)=>x+r.correct,0);
  return {attempts,correct,accuracy:attempts?Math.round(correct/attempts*100):0,unique:results.filter(r=>r.successes.length).length,xp:xpTotal(state),streak:streak(state),due:dueQuestions(state).length,completed:Object.keys(state.completed).length,safe:lessons.filter(l=>mastery(state,l.id)==='safe').length};
}
function validDay(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;}
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x);}
function integer(n,max=1000000){return Number.isSafeInteger(n)&&n>=0&&n<=max;}
function fail(){throw new Error('Diese Datei ist kein gültiger Orbit-Speicherstand (Version 1). Der aktuelle Fortschritt bleibt erhalten.');}
export function validateImport(data) {
  if(!obj(data)||data.version!==1)fail();const s=blankState();
  if(![5,10,15].includes(data.goal)||!validDay(data.examDate)||!integer(data.focusSeconds,100000000))fail();
  s.goal=data.goal;s.examDate=data.examDate;s.focusSeconds=data.focusSeconds;
  const lids=new Set(lessons.map(l=>l.id));
  for(const key of ['results','completed','notes','errors','builders','activity','awards'])if(!obj(data[key]))fail();
  for(const [id,v] of Object.entries(data.results)){
    if(!Object.hasOwn(questionById,id)||!obj(v)||!integer(v.attempts)||!integer(v.correct)||v.correct>v.attempts||!integer(v.stage,3)||!validDay(v.due)||!Array.isArray(v.successes)||!v.successes.every(validDay)||v.successes.length>10000||typeof v.everWrong!=='boolean'||typeof v.repaired!=='boolean'||(v.lastAdvance&&!validDay(v.lastAdvance)))fail();
    s.results[id]={attempts:v.attempts,correct:v.correct,stage:v.stage,due:v.due,successes:[...new Set(v.successes)],everWrong:v.everWrong,repaired:v.repaired,...(v.lastAdvance?{lastAdvance:v.lastAdvance}:{})};
  }
  for(const [id,v] of Object.entries(data.completed)){if(!lids.has(id)||!validDay(v))fail();s.completed[id]=v;}
  for(const [id,v] of Object.entries(data.notes)){if(!lids.has(id)||typeof v!=='string'||v.length>4000)fail();s.notes[id]=v;}
  for(const [id,v] of Object.entries(data.errors)){if(!Object.hasOwn(questionById,id)||!obj(v)||!validDay(v.date)||typeof v.resolved!=='boolean'||typeof v.note!=='string'||typeof v.rule!=='string'||v.note.length>4000||v.rule.length>4000)fail();s.errors[id]={date:v.date,resolved:v.resolved,note:v.note,rule:v.rule};}
  for(const [id,v] of Object.entries(data.builders)){if(!['ends1','alternate','contains1','parity'].includes(id)||!validDay(v))fail();s.builders[id]=v;}
  if(!Array.isArray(data.checks)||data.checks.length>10000)fail();
  s.checks=data.checks.map(v=>{if(!obj(v)||!validDay(v.date)||!integer(v.score,10)||!integer(v.seconds,86400))fail();return {date:v.date,score:v.score,seconds:v.seconds};});
  for(const [day,v] of Object.entries(data.activity)){if(!validDay(day)||!obj(v)||!integer(v.attempts)||!integer(v.correct)||v.correct>v.attempts||!Array.isArray(v.unique)||!v.unique.every(id=>Object.hasOwn(questionById,id)))fail();s.activity[day]={attempts:v.attempts,correct:v.correct,unique:[...new Set(v.unique)]};}
  for(const [key,v] of Object.entries(data.awards)){
    const validKey=key.startsWith('solve:')?Object.hasOwn(questionById,key.slice(6)):key.startsWith('lesson:')?lids.has(key.slice(7)):key.startsWith('builder:')?['ends1','alternate','contains1','parity'].includes(key.slice(8)):key.startsWith('review:')&&validDay(key.slice(7,17))&&Object.hasOwn(questionById,key.slice(18));
    const expected=key.startsWith('solve:')?10:key.startsWith('lesson:')?25:key.startsWith('builder:')?50:5;
    if(!validKey||!obj(v)||v.xp!==expected||!validDay(v.date))fail();s.awards[key]={xp:v.xp,date:v.date};
  }
  if(!Array.isArray(data.badges)||!data.badges.every(id=>achievements.some(a=>a.id===id)))fail();s.badges=[...new Set(data.badges)];
  s.examAttempts=validateExamAttempts(data.examAttempts);
  if(data.confidence!==undefined){if(!obj(data.confidence))fail();for(const [id,v] of Object.entries(data.confidence)){if(!Object.hasOwn(questionById,id)||!obj(v)||!['guess','unsure','sure'].includes(v.last)||typeof v.lastCorrect!=='boolean'||!['guess','unsure','sure','wrongSure'].every(k=>integer(v[k]))||v.wrongSure>v.sure)fail();s.confidence[id]={guess:v.guess,unsure:v.unsure,sure:v.sure,wrongSure:v.wrongSure,last:v.last,lastCorrect:v.lastCorrect};}}
  if(data.lastLesson!==null&&!lids.has(data.lastLesson))fail();s.lastLesson=data.lastLesson;return s;
}
