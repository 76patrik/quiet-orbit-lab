import {validateExamAttempts,examReport} from './exam-engine.js';
import { lessons, questionById, achievements } from './curriculum.js';
import { defaultExamDates } from './subjects.js';
import { questStatus, questById, QUEST_XP, cardById, CARD_INTERVALS, unitById, BOSS_XP } from './games.js';
const KEY='orbit-progress-v1';
export const today=(date=new Date())=>{
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
export const addDays=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export const blankState=()=>({version:1,goal:5,examDate:'2026-11-20',examDates:defaultExamDates(),results:{},completed:{},notes:{},errors:{},builders:{},checks:[],activity:{},awards:{},badges:[],lastLesson:null,focusSeconds:0,cards:{},bosses:{},blitz:[],confidence:{},examAttempts:[]});
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
// Karteikarten: „nochmal“ bleibt heute fällig, „schwer“ kommt morgen, „gewusst“ rückt ein Fach weiter.
export function rateCard(state,id,rating,day=today()){
  if(!cardById[id]||!['again','hard','good'].includes(rating))throw new Error('Unbekannte Karteikarte oder Bewertung.');
  const c=state.cards[id]||{box:0,due:day,first:day,seen:0};c.seen++;
  if(rating==='again'){c.box=0;c.due=day;}else if(rating==='hard')c.due=addDays(day,1);else{c.box=Math.min(CARD_INTERVALS.length-1,c.box+1);c.due=addDays(day,CARD_INTERVALS[c.box]);}
  state.cards[id]=c;const a=touchActivity(state,day);a.cards=(a.cards||0)+1;return updateBadges(state,day);
}
export function recordCombo(state,combo,day=today()){const a=touchActivity(state,day);if(combo>(a.combo||0))a.combo=combo;return updateBadges(state,day);}
export function recordFocus(state,seconds,day=today()){state.focusSeconds+=seconds;const a=touchActivity(state,day);a.focus=(a.focus||0)+seconds;}
export function recordBoss(state,unitId,won,day=today()){
  if(!unitById[unitId])throw new Error('Unbekannter Boss.');
  const a=touchActivity(state,day);a.boss=(a.boss||0)+1;
  if(won){if(!state.bosses[unitId])state.bosses[unitId]=day;award(state,`boss:${unitId}`,BOSS_XP,day);}
  return updateBadges(state,day);
}
// Blitzrunden verändern keine Wiederholungstermine und geben keine Aufgaben-XP; sie zählen als Rekord und Mission.
export function recordBlitz(state,score,answered,day=today()){
  state.blitz.push({date:day,score,answered});if(state.blitz.length>100)state.blitz.splice(0,state.blitz.length-100);
  const a=touchActivity(state,day);a.blitz=(a.blitz||0)+1;return updateBadges(state,day);
}
export const bestBlitz=state=>Math.max(0,...state.blitz.map(b=>b.score));
export function updateBadges(state,day=today()){
  if(state.activity[day])for(const q of questStatus(state,day))if(q.done)award(state,`quest:${day}:${q.id}`,QUEST_XP,day);
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
  // examDates fehlt in Sicherungen vor der Fächerübersicht; dann gelten die Standardtermine.
  if(data.examDates!==undefined){if(!obj(data.examDates))fail();for(const [id,v] of Object.entries(data.examDates)){if(!Object.hasOwn(s.examDates,id)||!validDay(v))fail();s.examDates[id]=v;}}
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
  for(const [day,v] of Object.entries(data.activity)){if(!validDay(day)||!obj(v)||!integer(v.attempts)||!integer(v.correct)||v.correct>v.attempts||!Array.isArray(v.unique)||!v.unique.every(id=>Object.hasOwn(questionById,id)))fail();s.activity[day]={attempts:v.attempts,correct:v.correct,unique:[...new Set(v.unique)]};for(const k of ['combo','cards','blitz','focus','boss'])if(v[k]!==undefined){if(!integer(v[k],100000))fail();s.activity[day][k]=v[k];}}
  for(const [key,v] of Object.entries(data.awards)){
    const validKey=key.startsWith('quest:')?validDay(key.slice(6,16))&&key[16]===':'&&Object.hasOwn(questById,key.slice(17)):key.startsWith('boss:')?Object.hasOwn(unitById,key.slice(5)):key.startsWith('solve:')?Object.hasOwn(questionById,key.slice(6)):key.startsWith('lesson:')?lids.has(key.slice(7)):key.startsWith('builder:')?['ends1','alternate','contains1','parity'].includes(key.slice(8)):key.startsWith('review:')&&validDay(key.slice(7,17))&&Object.hasOwn(questionById,key.slice(18));
    const expected=key.startsWith('quest:')?QUEST_XP:key.startsWith('boss:')?BOSS_XP:key.startsWith('solve:')?10:key.startsWith('lesson:')?25:key.startsWith('builder:')?50:5;
    if(!validKey||!obj(v)||v.xp!==expected||!validDay(v.date))fail();s.awards[key]={xp:v.xp,date:v.date};
  }
  if(data.cards!==undefined){if(!obj(data.cards))fail();for(const [id,v] of Object.entries(data.cards)){if(!Object.hasOwn(cardById,id)||!obj(v)||!integer(v.box,CARD_INTERVALS.length-1)||!validDay(v.due)||!validDay(v.first)||!integer(v.seen))fail();s.cards[id]={box:v.box,due:v.due,first:v.first,seen:v.seen};}}
  if(data.bosses!==undefined){if(!obj(data.bosses))fail();for(const [id,v] of Object.entries(data.bosses)){if(!Object.hasOwn(unitById,id)||!validDay(v))fail();s.bosses[id]=v;}}
  if(data.blitz!==undefined){if(!Array.isArray(data.blitz)||data.blitz.length>100)fail();s.blitz=data.blitz.map(v=>{if(!obj(v)||!validDay(v.date)||!integer(v.score,1000)||!integer(v.answered,1000)||v.score>v.answered)fail();return {date:v.date,score:v.score,answered:v.answered};});}
  if(!Array.isArray(data.badges)||!data.badges.every(id=>achievements.some(a=>a.id===id)))fail();s.badges=[...new Set(data.badges)];
  s.examAttempts=validateExamAttempts(data.examAttempts);
  if(data.confidence!==undefined){if(!obj(data.confidence))fail();for(const [id,v] of Object.entries(data.confidence)){if(!Object.hasOwn(questionById,id)||!obj(v)||!['guess','unsure','sure'].includes(v.last)||typeof v.lastCorrect!=='boolean'||!['guess','unsure','sure','wrongSure'].every(k=>integer(v[k]))||v.wrongSure>v.sure)fail();s.confidence[id]={guess:v.guess,unsure:v.unsure,sure:v.sure,wrongSure:v.wrongSure,last:v.last,lastCorrect:v.lastCorrect};}}
  if(data.lastLesson!==null&&!lids.has(data.lastLesson))fail();s.lastLesson=data.lastLesson;return s;
}
