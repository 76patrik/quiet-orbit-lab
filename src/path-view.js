import {lessonTimeLabel} from './learning-time.js';
import {nextLearningLink} from './learning-next.js';
import {weekVisualView} from './learning-visuals.js';
import {weeks,lessonsOfWeek,unitsOfWeek,lessonById,lessonNumber,allTopics} from './curriculum.js';
import {mastery} from './progress.js';
import {pathTabsExtra} from './walkthrough-view.js';

// Wochen-Reiter plus die Reiter „Aufgaben“ und „Altklausur“. active=null markiert die gewählte Woche.
export function pathTabs(week,active){
 return `<div class="week-tabs" role="group" aria-label="Lernwoche oder Aufgabensammlung auswählen">${pathTabsExtra(active)}<span class="wt-tab-sep" aria-hidden="true"></span>${weeks.map(w=>{const on=!active&&w.n===week;return `<button data-action="week" data-week="${w.n}" class="${on?'active':''}" aria-pressed="${on}">Woche ${String(w.n).padStart(2,'0')}${w.n>2?' · Plan':''}</button>`;}).join('')}</div>`;
}

// Both interactive weeks deliberately use exactly the same cards and lesson tiles.
export function pathView(week,{state,esc,icon,head,dateShort}){
 const w=weeks[week-1],lessons=lessonsOfWeek(week),units=unitsOfWeek(week);
 const completed=lessons.filter(l=>state.completed[l.id]).length;
 const topics=allTopics.filter(t=>t.week===week);
 const pdfPath=`./assets/Lernskript_Woche_${week}_Theoretische_Informatik.pdf`;
 const unitCards=units.map((u,index)=>`<section class="card unit">
  <div class="unit-head">${icon(u.icon)}<div><h2>${String(index+1).padStart(2,'0')} · ${esc(u.title)}</h2><p>${esc(u.subtitle)}</p></div><span class="pill gray">${u.lessons.filter(id=>state.completed[id]).length}/${u.lessons.length}</span></div>
  <div class="lesson-grid">${u.lessons.map(id=>{const l=lessonById[id],m=mastery(state,id);return `<a href="#lesson/${id}" class="lesson-tile">
   <span class="lesson-num ${state.completed[id]?'current':''}">${state.completed[id]?icon('check'):String(lessonNumber(id)).padStart(2,'0')}</span><div><h3>${esc(l.title)}</h3><p><span class="state-dot ${m}"></span>${m==='safe'?'Sicher':m==='learning'?'Im Aufbau':'Noch offen'} · ${lessonTimeLabel(l)}</p>${state.completed[id]?'<span class="tiny">✓ Abgeschlossen</span>':''}</div></a>`;}).join('')}</div>
 </section>`).join('');
 return `${head('THEORETISCHE INFORMATIK · DEINE ROUTE BIS ZUR KLAUSUR','Dein Lernpfad','Neun Wochen, ein klares Ziel. Du bestimmst das Tempo.')}
 ${pathTabs(week,null)}
 <section class="card week-intro"><div><span class="pill ${lessons.length?'':'gray'}">${lessons.length?'INTERAKTIV VERFÜGBAR':w.n<=7?'ERKLÄRUNGEN & PRÜFUNGSÜBUNGEN':'WIEDERHOLUNG & SIMULATION'}</span><h2 style="margin-top:15px">${esc(w.title)}</h2><p>${esc(w.subtitle)}</p><div class="week-meta"><span>${dateShort(w.start)} – ${dateShort(w.end)}2026</span><span>ca. ${w.hours} Stunden</span><span>${lessons.length?`${completed}/${lessons.length} Lektionen abgeschlossen`:'Lernziel aus deinem Masterplan'}</span></div></div><span class="week-number" aria-hidden="true">${String(w.n).padStart(2,'0')}</span></section>
 ${lessons.length&&completed===lessons.length?`<section class="card"><h2>Woche ${week} abgeschlossen</h2>${nextLearningLink(state,{week},esc)}</section>`:''}${weekVisualView(week,esc)}
 ${lessons.length?`${unitCards}<section class="card"><div class="card-title"><h2>Dein Wochenabschluss</h2>${icon('flag')}</div><p class="small muted">${esc(w.goal)} Für die Übungen und handschriftlichen Lösungswege sind weitere Arbeitsblöcke vorgesehen.</p><div class="inline-actions" style="margin-top:20px">${week===1?`<a href="#check" class="btn">Wochencheck öffnen ${icon('arrow')}</a>`:`<button class="btn" data-action="exam-start" data-id="week2-check">Wochencheck öffnen ${icon('arrow')}</button>`}<a href="#stats" class="btn ghost">Kompetenzen ansehen</a></div></section>
 <section class="card" style="margin-top:24px"><div class="card-title"><h2>Zum Nachschlagen und Ausprobieren</h2>${icon('book')}</div><p class="small muted">Das vollständige Skript ergänzt deine Lektionen mit allen Originalaufgaben, Tabellen, schriftlichen Übungen und Vergleichslösungen.</p>${week===1?'<p class="help">Dein 42-seitiges Lernskript öffnet sich als PDF in einem neuen Tab.</p>':''}<div class="inline-actions"><a class="btn secondary" href="${week===1?pdfPath:'#week2/overview'}"${week===1?' target="_blank" rel="noopener"':''}>Skript öffnen</a><a class="btn secondary" href="${week===1?'#lab':'#week2-lab'}">${week===1?'Lernlabore':'Automatenlabore'}</a><a class="btn ghost" href="${pdfPath}" download>PDF herunterladen</a></div></section>`:
 `<section class="card planned"><div class="card-title"><h2>Das ist für Woche ${w.n} vorgesehen</h2>${icon('calendar')}</div><ol class="next-week-list">${w.topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${topics.length?`<p class="small" style="margin-top:14px"><strong>Schon zum Üben bereit:</strong></p><div class="inline-actions" style="margin-top:8px">${topics.map(t=>`<a class="btn secondary" href="#topic/${t.id}">${esc(t.title)} ${icon('chevron')}</a>`).join('')}</div>`:''}<div class="separator"></div><p class="small"><strong>Deine Aufgaben:</strong> ${esc(w.tasks)}</p><p class="small muted"><strong>Nachweis am Wochenende:</strong> ${esc(w.goal)}</p><div class="callout" style="margin-top:22px"><strong>Direkt ins Thementraining.</strong>Die Themen enthalten Lösungsrezepte, durchgerechnete Beispiele und Verständnischecks. Bearbeite danach die passenden Aufgaben und dokumentiere deinen eigenen Lösungsweg.</div><div class="inline-actions" style="margin-top:18px"><a href="#practice" class="btn">Trainingsarena öffnen →</a><a href="#exams" class="btn secondary">Probeklausuren</a></div><a href="#path/1" class="btn secondary" style="margin-top:20px">Zur interaktiven Woche 1 ${icon('arrow')}</a></section>`}
 <div class="inline-actions"><a class="btn secondary" href="#learn-review">Abrufwissen & Begründungen</a>${nextLearningLink(state,{week},esc)}</div><p class="help" style="margin-top:20px">„Abgeschlossen“: 7 verschiedene Aufgaben einer Lektion ohne Hinweis richtig gelöst – auch über mehrere Runden. „Sicher“: zwei unterschiedliche Aufgaben an unterschiedlichen Tagen ohne Hilfe, ohne offene Fehler. Prozentziele sind eigene Trainingsziele.</p>`;
}
