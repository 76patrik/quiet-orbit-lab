// Lernpfad-Reiter „Aufgaben“ und „Altklausur“: Übersicht wie eine Lernwoche, jede Aufgabe als eigene Seite.
// Lesen, Schritte und eingeblendete Lösungen vergeben bewusst keine XP und keine Aufgabenhaken.
import {visualView} from './solution-visuals.js';
import {walkthroughSets,taskById} from './walkthroughs.js';

const ui={reveal:{},step:{},note:{},all:{}};
export function resetWalkthroughs(){for(const k of Object.keys(ui))ui[k]={};}

const safe=key=>[...String(key)].map(c=>/[a-z0-9]/i.test(c)?c:'-').join('');
// Kleine, sichere Auszeichnung: **fett**, `Formel`, Zeilenumbruch. Alles andere wird escaped.
export function rich(text,esc){
 return esc(text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/\n/g,'<br>');
}
const paras=(list,esc)=>(Array.isArray(list)?list:[list]).filter(Boolean).map(p=>`<p>${rich(p,esc)}</p>`).join('');

export function pathTabsExtra(active){
 return walkthroughSets.map(s=>`<a href="#path/${s.key}" class="wt-tab${active===s.key?' active':''}"${active===s.key?' aria-current="page"':''}>${s.tab}</a>`).join('');
}

function taskTile(task,esc,icon){
 const parts=task.parts.length,warn=task.parts.some(p=>p.warning)||task.warning;
 return `<a href="#path/${task.set}/${task.id}" class="lesson-tile wt-tile-link"><span class="lesson-num">${esc(task.n)}</span><div><h3>${esc(task.title)}</h3><p>${esc(task.topics.join(' · '))}</p><p class="wt-tile-meta">${parts} ${parts===1?'Teil':'Teile'}${task.points?` · ${esc(task.points)}`:''}${warn?' · <span class="wt-flag">⚠ Musterlösung korrigiert</span>':''}</p></div>${icon('chevron')}</a>`;
}

export function walkthroughOverview(setKey,{esc,icon,head,tabs}){
 const set=walkthroughSets.find(s=>s.key===setKey);
 const total=set.units.reduce((n,u)=>n+u.tasks.length,0),fixes=set.units.flatMap(u=>u.tasks).filter(t=>t.warning||t.parts.some(p=>p.warning)).length;
 return `${head('THEORETISCHE INFORMATIK · '+set.eyebrow,set.heading,set.lead)}
 ${tabs}
 <section class="card week-intro wt-intro"><div><span class="pill">${total} AUFGABEN · SCHRITT FÜR SCHRITT</span><h2 style="margin-top:15px">${esc(set.introTitle)}</h2>${paras(set.intro,esc)}
 <ol class="wt-howto"><li><strong>Aufgabe ansehen</strong><span>Grafik und Vorgaben genau lesen.</span></li><li><strong>Wissen klären</strong><span>„Das brauchst du“ vorher wiederholen.</span></li><li><strong>Selbst versuchen</strong><span>Idee notieren – oder ehrlich „weiß ich nicht“.</span></li><li><strong>Schritt für Schritt</strong><span>Weiter/Zurück, bis zur Musterlösung.</span></li></ol>
 ${fixes?`<div class="wt-warning" style="margin-top:18px"><strong>⚠ ${fixes} ${fixes===1?'Aufgabe enthält':'Aufgaben enthalten'} Fehler in der Original-Musterlösung.</strong>Die Stellen sind in der jeweiligen Aufgabe markiert und fachlich korrigiert. Lerne die korrigierte Fassung; im Zweifel bei der Lehrperson nachfragen.</div>`:''}
 </div><span class="week-number" aria-hidden="true">${set.badge}</span></section>
 ${set.units.map((u,i)=>`<section class="card unit"><div class="unit-head">${icon(u.icon||'book')}<div><h2>${String(i+1).padStart(2,'0')} · ${esc(u.title)}</h2><p>${esc(u.subtitle)}</p></div><span class="pill gray">${u.tasks.length} ${u.tasks.length===1?'Aufgabe':'Aufgaben'}</span></div><div class="lesson-grid">${u.tasks.map(t=>taskTile(t,esc,icon)).join('')}</div></section>`).join('')}
 <p class="help" style="margin-top:20px">${esc(set.footnote)}</p>`;
}

function backgroundCard(task,esc,icon){
 if(!task.background?.length)return '';
 return `<section class="card wt-section"><div class="card-title"><h2>Das brauchst du</h2>${icon('book')}</div><p class="small muted">Hintergrundwissen für diese Aufgabe. Wenn ein Begriff wackelt: erst hier festigen, dann rechnen.</p><div class="wt-know">${task.background.map(b=>`<div class="wt-know-item"><h3>${esc(b.term)}</h3>${paras(b.text,esc)}${b.link?`<a class="wt-link" href="${esc(b.link[0])}">${esc(b.link[1])} ${icon('chevron')}</a>`:''}</div>`).join('')}</div></section>`;
}

function stepBody(step,esc){
 return `<h3 class="wt-step-title" tabindex="-1">${rich(step.t,esc)}</h3>${paras(step.x,esc)}${step.v?`<div class="wt-visual">${visualView(step.v,esc)}</div>`:''}${step.tip?`<div class="wt-tip"><strong>Trick</strong>${rich(step.tip,esc)}</div>`:''}`;
}

export function partView(task,index,esc){
 const part=task.parts[index],key=`${task.id}:${index}`,dom=`wt-part-${safe(key)}`;
 const steps=[...part.steps,{t:'Ergebnis & Musterlösung',final:true}],n=steps.length;
 const revealed=!!ui.reveal[key],cur=Math.min(ui.step[key]||0,n-1),all=!!ui.all[key];
 const headline=`<div class="wt-part-head"><span class="wt-part-label">${esc(part.label)}</span><div><h2>${rich(part.q,esc)}</h2>${part.points?`<span class="pill gray">${esc(part.points)}</span>`:''}</div></div>`;
 const final=`<div class="wt-answer"><div class="wt-answer-head">✓ Musterlösung${part.warning?' (korrigiert)':''}</div>${paras(part.answer.x,esc)}${part.answer.v?`<div class="wt-visual">${visualView(part.answer.v,esc)}</div>`:''}</div>${part.warning?`<div class="wt-warning"><strong>⚠ Achtung: Fehler in der Original-Musterlösung</strong>${paras(part.warning,esc)}</div>`:''}${part.points&&part.grading?`<div class="wt-grading"><strong>So gibt es die Punkte</strong>${paras(part.grading,esc)}</div>`:''}`;
 if(!revealed){
  return `<section class="card wt-part" id="${dom}">${headline}<div class="wt-attempt"><label class="field" for="${dom}-note">Erst selbst versuchen: Deine Idee oder dein Ergebnis <small class="muted">(optional, nur für dich, wird nicht gespeichert)</small><textarea id="${dom}-note" rows="3" placeholder="z. B. erster Schritt, Zwischenergebnis oder Frage"></textarea></label><div class="inline-actions"><button class="btn" data-action="wt-reveal" data-key="${esc(key)}">Lösungsweg starten</button><button class="btn ghost" data-action="wt-reveal" data-key="${esc(key)}" data-unsure="1">Weiß ich nicht – zeig es mir</button></div><p class="help">${n-1} Schritte bis zur Musterlösung. Lesen und Lösung ansehen zählen nicht als selbstständig gelöst.</p></div></section>`;
 }
 const note=ui.note[key];
 const nav=`<ol class="wt-stepnav" aria-label="Schritte von Teil ${esc(part.label)}">${steps.map((s,i)=>`<li><button data-action="wt-step" data-key="${esc(key)}" data-step="${i}" aria-pressed="${!all&&i===cur}" class="${i<cur&&!all?'is-done':''}${s.final?' is-final':''}"><span>${s.final?'✓':i+1}</span><small>${rich(s.short||s.t,esc)}</small></button></li>`).join('')}</ol>`;
 const body=all?steps.map((s,i)=>`<div class="wt-step wt-step-all"><div class="wt-step-count">${s.final?'Ergebnis':`Schritt ${i+1} von ${n-1}`}</div>${s.final?final:stepBody(s,esc)}</div>`).join(''):`<div class="wt-step" aria-live="polite"><div class="wt-step-count">${steps[cur].final?'Ergebnis':`Schritt ${cur+1} von ${n-1}`}</div>${steps[cur].final?final:stepBody(steps[cur],esc)}</div>`;
 const controls=all?`<div class="wt-controls"><button class="btn secondary" data-action="wt-all" data-key="${esc(key)}">Schrittweise ansehen</button></div>`:`<div class="wt-controls"><button class="btn secondary" data-action="wt-step" data-key="${esc(key)}" data-step="${cur-1}" ${cur===0?'disabled':''}>← Zurück</button><button class="btn" data-action="wt-step" data-key="${esc(key)}" data-step="${cur+1}" ${cur===n-1?'disabled':''}>${cur===n-2?'Zur Musterlösung':'Weiter'} →</button><button class="btn ghost" data-action="wt-step" data-key="${esc(key)}" data-step="0" ${cur===0?'disabled':''}>Neustart</button><button class="btn ghost" data-action="wt-all" data-key="${esc(key)}">Alle Schritte untereinander</button></div>`;
 return `<section class="card wt-part is-open" id="${dom}">${headline}${note!==undefined?`<div class="wt-mynote"><strong>${note?'Deine Idee':'Du hast „weiß ich nicht“ gewählt.'}</strong>${note?`<p>${esc(note)}</p>`:'<p>Völlig in Ordnung – geh die Schritte langsam durch und versuch danach die Aufgabe noch einmal ohne Hilfe.</p>'}</div>`:''}${nav}${body}${controls}</section>`;
}

export function walkthroughTask(setKey,id,{esc,icon,head,tabs}){
 const task=taskById[id];if(!task||task.set!==setKey)return null;
 const set=walkthroughSets.find(s=>s.key===setKey),list=set.units.flatMap(u=>u.tasks),i=list.indexOf(task),prev=list[i-1],next=list[i+1];
 return `<a href="#path/${setKey}" class="back-link">${icon('back')} Zur Übersicht ${esc(set.tab)}</a>
 ${tabs}
 <article class="wt-task">
 <header class="card wt-hero"><div><div class="eyebrow">${esc(set.eyebrowShort)} · AUFGABE ${esc(task.n)}${task.points?` · ${esc(task.points.toUpperCase())}`:''}</div><h1>${esc(task.title)}</h1><div class="wt-chips">${task.topics.map(t=>`<span class="pill purple">${esc(t)}</span>`).join('')}</div><p class="help">Quelle: ${esc(task.source)}. Aufgabentext sinngemäß wiedergegeben, Grafiken neu gezeichnet.</p></div><span class="week-number" aria-hidden="true">${esc(task.n)}</span></header>
 <section class="card wt-section"><div class="card-title"><h2>Worum geht es?</h2>${icon('target')}</div>${paras(task.prompt,esc)}${task.given?`<div class="wt-visual">${visualView(task.given,esc)}</div>`:''}${task.givenNote?`<p class="help">${rich(task.givenNote,esc)}</p>`:''}</section>
 ${backgroundCard(task,esc,icon)}
 ${task.warning?`<div class="wt-warning wt-warning-top"><strong>⚠ Hinweis zur Original-Musterlösung</strong>${paras(task.warning,esc)}</div>`:''}
 ${task.parts.map((_,pi)=>partView(task,pi,esc)).join('')}
 ${task.tips?.length?`<section class="card wt-section wt-tricks"><div class="card-title"><h2>Tipps & Tricks für die Klausur</h2>${icon('spark')}</div><ul>${task.tips.map(t=>`<li>${rich(t,esc)}</li>`).join('')}</ul></section>`:''}
 ${task.mistakes?.length?`<section class="card wt-section"><div class="card-title"><h2>Typische Fehler</h2>${icon('flag')}</div><ul class="wt-mistakes">${task.mistakes.map(t=>`<li>${rich(t,esc)}</li>`).join('')}</ul></section>`:''}
 <nav class="wt-pager" aria-label="Weitere Aufgaben">${prev?`<a class="btn secondary" href="#path/${setKey}/${prev.id}">← Aufgabe ${esc(prev.n)}: ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a class="btn" href="#path/${setKey}/${next.id}">Aufgabe ${esc(next.n)}: ${esc(next.title)} →</a>`:`<a class="btn" href="#path/${setKey}">Zur Übersicht</a>`}</nav>
 </article>`;
}

// Teilaktualisierung: nur der betroffene Aufgabenteil wird neu gezeichnet, die Scrollposition bleibt.
export function handleWalkthroughAction(button,esc,doc=document){
 const key=button.dataset.key,[id,idx]=String(key).split(':'),task=taskById[id],index=Number(idx);
 if(!task||!task.parts[index])return false;
 const total=task.parts[index].steps.length+1,dom=`wt-part-${safe(key)}`;
 const action=button.dataset.action;
 if(action==='wt-reveal'){
  const area=doc.getElementById(`${dom}-note`);
  ui.reveal[key]=true;ui.step[key]=0;ui.note[key]=button.dataset.unsure?'':(area?.value.trim()||undefined);
 }else if(action==='wt-step'){
  ui.all[key]=false;ui.step[key]=Math.max(0,Math.min(total-1,Number(button.dataset.step)||0));
 }else if(action==='wt-all'){ui.all[key]=!ui.all[key];}
 else return false;
 const el=doc.getElementById(dom);
 if(el){el.outerHTML=partView(task,index,esc);
  const fresh=doc.getElementById(dom);
  const focusTarget=action==='wt-step'?fresh.querySelector(`.wt-stepnav [aria-pressed="true"]`):fresh.querySelector('.wt-step-title,.wt-controls .btn');
  focusTarget?.focus({preventScroll:true});
  if(action==='wt-reveal'||action==='wt-all'){const top=fresh.getBoundingClientRect?.().top;if(top!==undefined&&top<0)fresh.scrollIntoView?.({block:'start'});}
 }
 return true;
}
