// Tagesplan: beantwortet „Was ist heute dran?“ aus Kalender, Lernstand und Prüfungsterminen.
// Reine Funktionen ohne Speicherzugriff, damit sie sich einzeln testen lassen.
import { weeks, lessons, units, allTopics, questionById } from './curriculum.js';
import { cardsDue } from './games.js';
import { examSchedule } from './subjects.js';

const lessonIds = lessons.map(l=>l.id);

// Aktuelle Woche des TI-Plans: vor dem Start Woche 1, nach dem Ende null (Plan abgeschlossen).
export function currentWeek(day) {
  if (day < weeks[0].start) return weeks[0];
  return weeks.find(w=>w.start<=day&&day<=w.end) || null;
}
export const topicsOfWeek = n => allTopics.filter(t=>t.week===n);
const practicedTopics = state => new Set(Object.keys(state.results).map(id=>questionById[id]?.lesson).filter(Boolean));
const dueCount = (state, day) => Object.entries(state.results).filter(([id,r])=>questionById[id]&&r.due<=day).length;

// Planstand: Welche Themen sollten bis heute begonnen sein und welche fehlen noch?
// Woche 1 verteilt die 19 Lektionen gleichmäßig auf die sieben Tage.
export function schedule(state, day) {
  const week = currentWeek(day), practiced = practicedTopics(state);
  const n = week ? week.n : weeks.length + 1;
  let expected = [];
  if (n === 1) {
    const elapsed = Math.max(1, Math.min(7, Math.round((Date.parse(day+'T12:00:00Z')-Date.parse(weeks[0].start+'T12:00:00Z'))/86400000)+1));
    expected = lessonIds.slice(0, Math.ceil(lessonIds.length*elapsed/7));
  } else {
    expected = [...lessonIds, ...allTopics.filter(t=>t.week>1&&t.week<n).map(t=>t.id)];
  }
  const missing = expected.filter(id=>lessonIds.includes(id)?!state.completed[id]:!practiced.has(id));
  return {week, expected:expected.length, missing, onTrack:missing.length===0};
}

// Höchstens vier Schritte in fester Reihenfolge: erst Fälliges sichern, dann Neues lernen,
// dann festigen, dann das Wochenziel. Jeder Schritt hat ein Ziel (href) oder eine Aktion.
export function todayPlan(state, day) {
  const steps = [], a = state.activity[day] || {unique:[]}, due = dueCount(state, day), plan = schedule(state, day);
  const reviewedToday = Object.keys(state.awards).some(k=>k.startsWith(`review:${day}:`));
  if (due) steps.push({id:'review',title:`${due} fällige Wiederholung${due===1?'':'en'}`,detail:'Zuerst sichern, was du schon kannst. Das geht am schnellsten.',minutes:Math.min(20,Math.ceil(due*1.5)),action:'review',done:false});
  else if (reviewedToday) steps.push({id:'review',title:'Wiederholungen erledigt',detail:'Für heute ist nichts mehr fällig.',minutes:0,href:'#review',done:true});

  const nextLesson = lessonIds.find(id=>!state.completed[id]);
  const completedToday = Object.values(state.completed).includes(day);
  if (nextLesson) {
    const l = lessons.find(x=>x.id===nextLesson);
    steps.push({id:'learn',title:`Lektion: ${l.title}`,detail:`Lesen, Beispiel nachvollziehen und sieben verschiedene Aufgaben ohne Hilfe lösen.${plan.week&&plan.week.n>1?' Woche 1 ist noch offen, sie ist die Grundlage für alles Weitere.':''}`,minutes:l.minutes+5,href:`#lesson/${l.id}`,done:false});
  } else if (plan.week) {
    const practiced = practicedTopics(state), open = [...topicsOfWeek(plan.week.n), ...allTopics.filter(t=>t.week>1&&t.week<plan.week.n)].find(t=>!practiced.has(t.id));
    if (open) steps.push({id:'learn',title:`Thema: ${open.title}`,detail:`Kurzüberblick lesen, dann das Thementraining starten (Woche ${open.week}).`,minutes:20,href:`#topic/${open.id}`,done:false});
  }
  if (completedToday && !steps.some(s=>s.id==='learn'&&!s.done)) steps.push({id:'learn',title:'Neue Lektion abgeschlossen',detail:'Stark. Morgen geht es mit dem nächsten Baustein weiter.',minutes:0,href:'#path',done:true});

  const openErrors = Object.values(state.errors).filter(e=>!e.resolved).length, cards = cardsDue(state, day);
  const bossReady = units.find(u=>u.lessons.every(id=>state.completed[id])&&!state.bosses[u.id]);
  if (openErrors) steps.push({id:'fix',title:`${openErrors} offene${openErrors===1?'r':''} Fehler nacharbeiten`,detail:'Notiere die Ursache und löse die Aufgabe später noch einmal ohne Hilfe.',minutes:10,href:'#review',done:false});
  else if (bossReady) steps.push({id:'boss',title:`Bosskampf: ${bossReady.boss}`,detail:`Alle Lektionen von „${bossReady.title}“ sind geschafft. Zeig es ohne Hinweise.`,minutes:10,action:'start-boss',actionId:bossReady.id,done:false});
  else if (cards) steps.push({id:'cards',title:`${cards} Karteikarte${cards===1?'':'n'} fällig`,detail:'Erst selbst erklären, dann umdrehen.',minutes:Math.min(15,cards),action:'start-cards',done:(a.cards||0)>=cards});
  else steps.push({id:'daily',title:'Tagesrunde',detail:'Fünf gemischte Aufgaben aus deinen bisherigen Themen.',minutes:10,action:'daily',done:a.unique.length>=state.goal});

  if (plan.week?.n === 1) {
    const best = Math.max(0,...state.checks.map(c=>c.score)), builders = ['ends1','alternate'].filter(id=>state.builders[id]).length;
    const done = best>=8 && builders===2;
    steps.push({id:'week',title:'Wochenziel: Wochencheck',detail:done?'8/10 und beide Pflicht-DEAs geschafft.':`Bisher ${best}/10 im Check und ${builders}/2 Pflicht-DEAs. Ziel: 8/10 und beide DEAs ohne Vorlage.`,minutes:20,href:'#check',done});
  } else if (plan.week) {
    steps.push({id:'week',title:`Wochenziel Woche ${plan.week.n}`,detail:plan.week.goal,minutes:0,href:plan.week.n===2?'#week2':'#path',done:false,info:true});
  }
  return {week:plan.week, schedule:plan, steps, minutes:steps.filter(s=>!s.done).reduce((n,s)=>n+s.minutes,0)};
}

// Hinweise zu Prüfungen in den nächsten drei Wochen, für die noch Material fehlt oder die anstehen.
export function examNotices(state, day) {
  return examSchedule(state, day).filter(e=>e.days>=0&&e.days<=21).map(e=>({...e,text:e.status==='pending'?`${e.title} in ${e.days} Tagen – Lernmaterialien fehlen noch.`:`${e.title} in ${e.days} Tagen.`}));
}
