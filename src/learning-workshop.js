import {renderNfaFeedback} from './nfa-feedback.js';
import {week2Support,workshopHints} from './week2-learning-support.js';
import {methodMachines} from './learning-method-models.js';
import {lessonDfaFeedback} from './dfa-feedback.js';
import {renderDfaFeedback} from './dfa-view.js';
import {learningContracts,learningModes,errorKinds,chomskyColumns,chomskyRows,chomskySourceNote} from './learning-contracts.js';
import {evidenceStatus,dueLearning,recordLearning} from './learning-evidence.js';
import {topicById,lessonById} from './curriculum.js';
import {today} from './progress.js';
const sessions=new Map();
const back=id=>`#${lessonById[id]?'lesson':'topic'}/${id}`;
const session=(id,mode)=>{const key=id+':'+mode;if(!sessions.has(key)||sessions.get(key).day!==today())sessions.set(key,{day:today(),forcedAssisted:false,hintCount:0,level:'solo',answer:'',checked:false,saved:false,seen:false,assisted:false,marks:[],error:'',note:'',tableMode:'study',row:0,round:0,cells:{}});return sessions.get(key);};
export function learningTargets(id,esc){const c=learningContracts[id];if(!c)return '';return `<div class="learn-targets"><div><strong>Wissen</strong><span>${esc(c.recall[0])}</span></div><div><strong>Anwenden</strong><span>${esc(c.method.prompt)}</span></div><div><strong>Begründen</strong><span>${esc(c.reason.prompt)}</span></div></div>`;}
export function learningPathPanel(id,state,esc){if(!learningContracts[id])return '';return `<section class="card learning-path-panel"><div class="eyebrow">DEIN WEG ZUM KLAUSURFORMAT</div><h2>Jetzt selbst abrufen</h2><p class="help">Die Erklärung bleibt hier. Im Übungsraum löst du ohne sichtbare Musterlösung und vergleichst anschließend anhand eines Rasters.</p><div class="learn-modes">${Object.entries(learningModes).map(([mode,label],i)=>{const status=evidenceStatus(state,id,mode,today());return `<a class="learn-mode" href="#learn/${id}/${mode}"><span>${i+1} · ${label}</span><strong>${id==='hierarchy'&&mode==='recall'?'Chomsky-Tabelle rekonstruieren':mode==='recall'?esc(learningContracts[id].recall[0]):mode==='method'?'Mit Starthilfe → ohne Hilfe':'Eigene Klausurantwort'}</strong><small class="${status.className}">${status.label}</small></a>`;}).join('')}</div><p class="help">Diese drei Nachweise beruhen auf deiner ausdrücklich markierten Selbstbewertung. Der bisherige Lektionshaken zählt separat automatisch geprüfte Aufgaben. Einmal gelöst ist noch kein Beleg für langfristige Klausursicherheit.</p><a class="btn secondary" href="#learn-review">Abrufwissen & Fehler wiederholen →</a></section>`;}
const modeTabs=(id,mode)=>`<nav class="inline-actions" aria-label="Lernformat">${Object.entries(learningModes).map(([key,label])=>`<a class="btn ${mode===key?'':'secondary'}" href="#learn/${id}/${key}" ${mode===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav>`;
function taskFor(id,mode,s){const c=learningContracts[id];
 if(mode==='recall')return {prompt:`Erkläre ohne Vorlage: ${c.recall[0]}. Schreibe die zentralen Begriffe, Bedingungen und Zusammenhänge auf.`,solution:c.recall[1],criteria:week2Support[id]?.recall||[`Alle fachlichen Kernaussagen enthalten: ${c.recall[1]}`,'Begriffe, Symbole und Voraussetzungen richtig verwendet; keine widersprechende Aussage.']};
 if(mode==='reason')return {prompt:c.reason.prompt,solution:c.reason.solution,criteria:week2Support[id]?.reason||[`Fachlicher Kern getroffen: ${c.reason.solution}`,'Die Schlussfolgerung ist durch eine Regel, ein Modell, einen Beweisgedanken oder ein Gegenbeispiel begründet.','Die Antwort beantwortet die konkrete Frage ohne fachlichen Widerspruch; notwendige Bedingungen sind genannt.']};
 const task=s.level==='solo'?c.method:c.guided;
 return {prompt:task.prompt,solution:task.steps.join('\n'),criteria:task.steps};
}
function feedbackControls(s,criteria,esc){return `<section class="learn-comparison"><h2>Deine Antwort am Raster prüfen</h2><p class="help">Kein automatisches Freitexturteil: Markiere nur, was schon in deiner abgegebenen Antwort stand. Nachträgliche Ergänzungen zählen für den nächsten Versuch.</p>${criteria.map((text,i)=>`<label class="learn-criterion"><input type="checkbox" data-learn-mark="${i}" ${s.marks[i]?'checked':''} ${s.saved?'disabled':''}><span>${esc(text)}</span></label>`).join('')}<label class="field">Was war schwierig?<select id="learn-error" ${s.saved?'disabled':''}><option value="">Kein Fehler / noch nicht zugeordnet</option>${Object.entries(errorKinds).map(([key,label])=>`<option value="${key}" ${s.error===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="field">Eine Regel für den nächsten Versuch<textarea id="learn-note" maxlength="1000" ${s.saved?'readonly':''} placeholder="Zum Beispiel: ε-Hülle auch nach dem Zeichen bilden.">${esc(s.note)}</textarea></label><button class="btn" data-action="learn-save" ${s.saved?'disabled':''}>Selbstbewertung speichern</button>${s.saved?'<p class="learn-save-status" role="status">Selbstbewertung gespeichert. Keine XP oder automatischen Aufgabenhaken vergeben.</p>':''}</section>`;}
export function learningWorkshop(id,mode,state,esc){
 if(!Object.hasOwn(learningContracts,id)||!Object.hasOwn(learningModes,mode))return '<section class="card"><h1>Lernformat nicht gefunden</h1><a href="#path" class="btn">Zum Lernpfad</a></section>';
 const s=session(id,mode),task=taskFor(id,mode,s),record=state.learning?.[`${id}:${mode}`];
 const diagrams=mode==='method'?(s.level==='solo'?(methodMachines[id]?[{machine:methodMachines[id],title:'DEA zur Vergleichslösung',note:'Vollständiger Automat der eigenständigen Aufgabe.'}]:[]):lessonDfaFeedback[id]||[]):[];
 const header=`<a class="back-link" href="${back(id)}">← Zur Erklärung</a><header class="page-head"><div><div class="eyebrow">${esc(topicById[id].title)}</div><h1>${learningModes[mode]}</h1><p>Erst deine Antwort festhalten, danach die Lösung vergleichen.</p></div></header>${modeTabs(id,mode)}`;
 if(id==='hierarchy'&&mode==='recall')return header+chomskyWorkshop(s,state,esc);
 const shown=mode==='method'?(s.level==='guided'?Math.max(1,learningContracts[id].guided.steps.length-1):s.level==='faded'?1:0):0;
 return `${header}<section class="card learn-workshop" data-learn-id="${id}" data-learn-mode="${mode}">
 ${mode==='method'?`<div class="learn-levels" role="group" aria-label="Unterstützung wählen">${[['guided','1 · Mit Starthilfe'],['faded','2 · Schritte ergänzen'],['solo','3 · Neue Aufgabe allein']].map(([key,label])=>`<button class="btn ${s.level===key?'':'secondary'}" data-action="learn-level" data-level="${key}" aria-pressed="${s.level===key}">${label}</button>`).join('')}</div><p class="help">Stufe 1 und 2 verwenden das gemeinsame Beispiel und zählen als unterstützt. Stufe 3 enthält eine andere, vollständige Aufgabe.</p>`:''}
 <h2>${mode==='reason'?'Entscheidung und Begründung':mode==='method'?'Dein Arbeitsauftrag':'Das musst du abrufen können'}</h2><p class="learn-prompt">${esc(task.prompt)}</p>
 ${shown?`<div class="learn-scaffold"><strong>Diese Schritte sind vorgegeben:</strong><ol>${learningContracts[id].guided.steps.slice(0,shown).map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p>Ergänze die restlichen Schritte und begründe sie.</p></div>`:''}
 ${mode==='method'?'<p class="help">Zeichnungen kannst du auf Papier anfertigen. Halte unten Tabelle, Zwischenstände und Begründung fest, bevor du vergleichst.</p>':''}
 ${s.hintCount?`<aside class="learn-scaffold" aria-label="Aufgedeckte Hinweise"><strong>Hinweise</strong><ol>${workshopHints(id,mode).slice(0,s.hintCount).map(h=>`<li>${esc(h)}</li>`).join('')}</ol></aside>`:''}
 <label class="field">Deine Antwort<textarea id="learn-answer" maxlength="12000" rows="8" ${s.checked?'readonly':''} placeholder="Ohne nachzuschauen in eigenen Worten antworten …">${esc(s.answer)}</textarea></label>
 ${!s.checked?`<label class="learn-criterion"><input type="checkbox" id="learn-assisted" ${s.assisted?'checked':''}>Ich habe dabei nachgeschaut oder zusätzliche Hilfe benutzt.</label><div class="inline-actions"><button class="btn" data-action="learn-compare">Antwort abgeben & vergleichen</button><button class="btn ghost" data-action="learn-hint" ${s.hintCount>=workshopHints(id,mode).length?'disabled':''}>Hinweis ${Math.min(s.hintCount+1,workshopHints(id,mode).length)} von ${workshopHints(id,mode).length}</button></div>${s.assisted?'<p class="help">Mit Hilfe: Dieser Versuch zählt als Übung, nicht als selbstständiger Abruf.</p>':''}`:`<section class="learn-solution"><h3>Vergleichslösung</h3><p>${esc(task.solution).replaceAll('\n','<br>')}</p></section>${diagrams.map((spec,i)=>renderDfaFeedback(spec,esc,{id:`workshop-${id}-${i}`,step:0})).join('')}${mode==='method'?renderNfaFeedback(`${id}-${s.level==='solo'?'solo':'guided'}`,esc):''}${feedbackControls(s,task.criteria,esc)}`}
 <p id="learn-status" role="status"></p><button class="btn secondary" data-action="learn-reset">Neuer Versuch</button>
 ${record&&s.checked?`<details class="solution-reveal"><summary>Letzte gespeicherte Selbstbewertung</summary><p>${record.score}/${record.max} Kriterien · ${record.assisted?'mit Unterstützung':'ohne angegebene Hilfe'} · ${esc(record.day)}. Wiederholung: ${esc(record.due)}.</p><p class="learn-old-answer">${esc(record.answer)}</p><p>${esc(record.note)}</p></details>`:''}
 </section>`;
}
function tableSelection(s){
 if(s.tableMode==='all')return Array.from({length:20},(_,i)=>i);
 if(s.tableMode==='row')return Array.from({length:5},(_,i)=>s.row*5+i);
 return Array.from({length:5},(_,i)=>(s.round*7+i*3)%20);
}
function chomskyWorkshop(s,state,esc){const selected=tableSelection(s),study=s.tableMode==='study';
 return `<section class="card learn-workshop" data-learn-id="hierarchy" data-learn-mode="recall"><h2>Chomsky-Tabelle aus dem Gedächtnis</h2><div class="learn-levels">${[['study','1 · Anschauen'],['cells','2 · Einzelne Lücken'],['row','3 · Ganze Zeile'],['all','4 · Leere Tabelle']].map(([key,label])=>`<button class="btn ${s.tableMode===key?'':'secondary'}" data-action="learn-table-mode" data-level="${key}" aria-pressed="${s.tableMode===key}">${label}</button>`).join('')}</div>
 <p class="help">Die Formulierungen dürfen sinngemäß sein. Nach Abgabe vergleichst du jede ausgefüllte Zelle selbst. Nur die vollständig leere Tabelle zählt für den Nachweis „Wissen abrufen“ der Hierarchie.</p>
 ${s.tableMode==='row'?`<label class="field">Zeile<select id="learn-table-row">${chomskyRows.map((r,i)=>`<option value="${i}" ${s.row===i?'selected':''}>Typ ${r[0]}</option>`).join('')}</select></label>`:''}
 <div class="table-scroll chomsky-table" tabindex="0" role="region" aria-label="Chomsky-Hierarchie mit Eingabefeldern"><table><caption>Typ, Regeln, Modell, Wortproblem und Beispiel</caption><thead><tr><th scope="col">Typ</th>${chomskyColumns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${chomskyRows.map((row,r)=>`<tr><th scope="row">${row[0]}</th>${row.slice(1).map((value,c)=>{const k=r*5+c,hidden=!study&&selected.includes(k);return `<td>${hidden?`<label><span class="sr-only">Typ ${row[0]}: ${chomskyColumns[c]}</span><textarea data-chomsky-cell="${k}" maxlength="500" rows="4" ${s.checked?'readonly':''}>${esc(s.cells[k]||'')}</textarea></label>${s.checked?`<p class="chomsky-expected">${esc(value)}</p><label class="learn-criterion"><input type="checkbox" data-learn-mark="${k}" ${s.marks[k]?'checked':''} ${s.saved?'disabled':''}>Inhaltlich richtig</label>`:''}`:esc(value)}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div>
 <p class="help">Inklusion: Typ 3 ⊊ Typ 2 ⊊ Typ 1 ⊊ Typ 0. Die Beispiele beziehen sich auf die jeweils kleinste Klasse. Bei Typ 1 gilt die genannte ε-Konvention.</p>
 <details class="solution-reveal"><summary>Quellenhinweis zur Typ-1-Komplexität</summary><p>${esc(chomskySourceNote)}</p><a href="https://clinjournal.org/CLIN_proceedings/II/aarts.pdf" target="_blank" rel="noopener">Fachquelle öffnen</a></details>
 ${study?'<p class="help">Das Anschauen vergibt keinen Nachweis. Wechsle anschließend zu den Lücken.</p>':!s.checked?`<label class="learn-criterion"><input type="checkbox" id="learn-assisted" ${s.assisted?'checked':''}>Ich habe während der Eingabe nachgeschaut.</label><button class="btn" data-action="learn-compare">Tabelle abgeben & vergleichen</button>`:`<p class="help">Markiere jede beantwortete Zelle, die vor dem Aufdecken inhaltlich richtig war. Es gibt keine automatische Freitextbewertung.</p><label class="field">Fehlerart<select id="learn-error"><option value="">Kein Fehler / nicht zugeordnet</option>${Object.entries(errorKinds).map(([k,v])=>`<option value="${k}" ${s.error===k?'selected':''}>${v}</option>`).join('')}</select></label><label class="field">Merksatz<textarea id="learn-note" maxlength="1000">${esc(s.note)}</textarea></label><button class="btn" data-action="learn-save" ${s.saved?'disabled':''}>Selbstbewertung speichern</button>${s.saved?'<p class="learn-save-status" role="status">Selbstbewertung gespeichert.</p>':''}`}
 <p id="learn-status" role="status"></p>${!study?'<button class="btn secondary" data-action="learn-reset">Neue Runde</button>':''}
 ${state.learning?.['hierarchy:table-all']?`<p class="help">Letzte ganze Tabelle: ${state.learning['hierarchy:table-all'].score}/20 Zellen nach Selbstbewertung.</p>`:''}</section>`;
}
export function learningReview(state,esc){const due=dueLearning(state,today());return `<a class="back-link" href="#path">← Zum Lernpfad</a><header class="page-head"><div><div class="eyebrow">ABRUFEN · RECHNEN · BEGRÜNDEN</div><h1>Deine Lernpfad-Wiederholungen</h1><p>${due.length} Selbstbewertungen sind heute zur Wiederholung fällig.</p></div></header>${due.length?due.map(([key,v])=>{const[id,mode]=key.split(':');return `<section class="card learn-review-card"><h2>${esc(topicById[id].title)} · ${mode.startsWith('table-')?'Chomsky-Tabelle':learningModes[mode]}</h2><p>${v.score}/${v.max} Kriterien · ${v.assisted?'mit Hilfe':'ohne angegebene Hilfe'} · ${esc(v.error?errorKinds[v.error]:'Fehlerart noch nicht zugeordnet')}</p><p>${esc(v.note)}</p><a class="btn" href="#learn/${id}/${mode.startsWith('table-')?'recall':mode}">Erneut bearbeiten →</a></section>`;}).join(''):'<section class="card"><p>Heute keine fällige Lernpfad-Selbstbewertung. Starte mit deinem nächsten Thema oder der Chomsky-Tabelle.</p><a class="btn" href="#learn/hierarchy/recall">Chomsky-Tabelle üben</a></section>'}<section class="card"><h2>Alle Themen gezielt abrufen</h2><div class="inline-actions">${Object.keys(learningContracts).map(id=>`<a class="btn secondary" href="#learn/${id}/recall">${esc(topicById[id].title)}</a>`).join('')}</div></section>`;}

export function captureLearningInput(target){const root=target.closest('[data-learn-id]');if(!root)return;const s=session(root.dataset.learnId,root.dataset.learnMode);
 if(target.id==='learn-answer'&&!s.checked)s.answer=target.value;
 if(target.dataset.chomskyCell!==undefined&&!s.checked)s.cells[target.dataset.chomskyCell]=target.value;
 if(target.dataset.learnMark!==undefined&&!s.saved&&s.checked)s.marks[Number(target.dataset.learnMark)]=target.checked;
 if(target.id==='learn-assisted'&&!s.checked)s.assisted=target.checked;
 if(target.id==='learn-error'&&!s.saved)s.error=target.value;
 if(target.id==='learn-note'&&!s.saved)s.note=target.value;
}
export function handleLearningAction(button,{state,esc,persist,render}){
 const root=button.closest('[data-learn-id]');if(!root)return false;
 const id=root.dataset.learnId,mode=root.dataset.learnMode,s=session(id,mode),isTable=id==='hierarchy'&&mode==='recall',action=button.dataset.action;
 const status=text=>{root.querySelector('#learn-status').textContent=text;};
 if(action==='learn-compare'){
  if(isTable){if(!tableSelection(s).every(k=>s.cells[k]?.trim())){status('Bitte fülle jede offene Zelle aus. Bei Unsicherheit kannst du „weiß ich nicht“ schreiben.');return true;}}
  else if(!s.answer.trim()){status('Bitte halte zuerst deine eigene Antwort fest.');return true;}
  s.checked=true;s.seen=true;s.marks=[];
 }else if(action==='learn-hint'){
  s.assisted=true;s.forcedAssisted=true;s.hintCount=Math.min(s.hintCount+1,workshopHints(id,mode).length);
 }else if(action==='learn-level'){
  const next=button.dataset.level;if(!['solo','guided','faded'].includes(next)||mode!=='method')return true;
  // Guided and independent tasks differ. Returning to the same revealed independent task stays assisted.
  if(s.level==='solo'&&(s.seen||s.forcedAssisted||s.assisted))s.soloSeen=true;
  Object.assign(s,{level:next,hintCount:0,answer:'',checked:false,saved:false,seen:false,marks:[],assisted:next==='solo'?!!s.soloSeen:true,forcedAssisted:next==='solo'?!!s.soloSeen:true});
 }else if(action==='learn-table-mode'){
  if(!['study','cells','row','all'].includes(button.dataset.level))return true;
  Object.assign(s,{tableMode:button.dataset.level,cells:{},checked:false,saved:false,marks:[],assisted:!!s.seen,forcedAssisted:s.seen||s.forcedAssisted});
 }else if(action==='learn-reset'){
  Object.assign(s,{answer:'',cells:{},checked:false,saved:false,marks:[],round:s.round+1,assisted:s.seen||s.assisted,forcedAssisted:s.seen||s.forcedAssisted});
 }else if(action==='learn-save'){
  if(!s.checked||s.saved)return true;
  const selected=isTable?tableSelection(s):taskFor(id,mode,s).criteria.map((_,i)=>i),score=selected.filter(k=>s.marks[k]).length;
  const key=`${id}:${isTable?'table-'+s.tableMode:mode}`;
  const answer=isTable?selected.map(k=>`Typ ${chomskyRows[Math.floor(k/5)][0]} · ${chomskyColumns[k%5]}: ${s.cells[k]}`).join('\n'):s.answer;
  recordLearning(state,key,{score,max:selected.length,assisted:s.assisted||s.forcedAssisted||(!isTable&&mode==='method'&&s.level!=='solo'),answer,error:s.error,note:s.note,day:today()});
  if(!persist()){status('Speichern fehlgeschlagen. Bitte sichere deinen Stand in den Einstellungen.');return true;}
  s.saved=true;
 }else return false;
 render();const panel=document.querySelector('[data-learn-id]');const focus=panel?.querySelector(action==='learn-compare'?'.learn-comparison h2, .chomsky-expected':action==='learn-save'?'.learn-save-status':'#learn-answer, [data-chomsky-cell]');
 if(focus){focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});}
 return true;
}
export function changeLearningRow(target,render){if(target.id!=='learn-table-row')return false;const s=session('hierarchy','recall');s.row=Number(target.value);Object.assign(s,{cells:{},checked:false,saved:false,marks:[],assisted:s.seen||s.assisted,forcedAssisted:s.seen||s.forcedAssisted});render();return true;}

export const clearLearningSessions=()=>sessions.clear();
