import {learningContracts,learningModes,errorKinds} from './learning-contracts.js';
const modes=[...Object.keys(learningModes),'table-cells','table-row','table-all'];
const validDay=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
const add=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export function validLearningKey(key){const [id,mode,...extra]=key.split(':');return !extra.length&&Object.hasOwn(learningContracts,id)&&modes.includes(mode)&&(!mode.startsWith('table-')||id==='hierarchy');}
export function validateLearning(value={}){
 const fail=()=>{throw new Error('Ungültige Lernpfad-Nachweise. Der bisherige Lernstand bleibt erhalten.');};
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>110)fail();
 const out={};for(const [key,v]of Object.entries(value)){
  if(!validLearningKey(key)||!v||typeof v!=='object'||Array.isArray(v))fail();
  if(!Number.isInteger(v.attempts)||v.attempts<1||v.attempts>100000||!Number.isInteger(v.score)||!Number.isInteger(v.max)||v.max<1||v.max>20||v.score<0||v.score>v.max||typeof v.assisted!=='boolean'||!validDay(v.day)||!validDay(v.due)||!Array.isArray(v.days)||v.days.length>10000||!v.days.every(validDay)||typeof v.answer!=='string'||v.answer.length>12000||typeof v.note!=='string'||v.note.length>1000||!(v.error===''||Object.hasOwn(errorKinds,v.error)))fail();
  if(v.days.some(d=>d>v.day)||v.due<v.day)fail();
  out[key]={attempts:v.attempts,score:v.score,max:v.max,assisted:v.assisted,day:v.day,due:v.due,days:[...new Set(v.days)].sort(),answer:v.answer,note:v.note,error:v.error};
 }return out;
}
export function recordLearning(state,key,{score,max,assisted,answer,error='',note='',day}){
 if(!validLearningKey(key)||!validDay(day))throw new Error('Unbekannter Lernpfad-Nachweis.');
 const old=state.learning?.[key],days=old?.days.slice()||[];
 // A later failed/assisted attempt makes this skill due again without deleting its history.
 const pass=score===max&&!assisted;
 if(pass&&!days.includes(day))days.push(day);
 const n=pass?[1,3,7,14][Math.min(days.length-1,3)]:0;
 const next={attempts:(old?.attempts||0)+1,score,max,assisted,day,due:add(day,n),days,answer,note,error};
 const checked=validateLearning({[key]:next});state.learning??={};state.learning[key]=checked[key];return checked[key];
}
export function evidenceStatus(state,id,mode,day){
 const key=id==='hierarchy'&&mode==='recall'?'hierarchy:table-all':`${id}:${mode}`,v=state.learning?.[key];
 if(!v)return {label:'Noch offen',className:'open'};
 if(v.assisted||v.score<v.max)return {label:'Erneut üben',className:'open'};
 if(v.due<=day)return {label:'Wiederholung fällig',className:'due'};
 return {label:v.days.length>=2?'An mehreren Tagen abgerufen':'Einmal selbst eingeschätzt',className:'done'};
}
export const dueLearning=(state,day)=>Object.entries(state.learning||{}).filter(([,v])=>v.due<=day).sort((a,b)=>a[1].due.localeCompare(b[1].due));
