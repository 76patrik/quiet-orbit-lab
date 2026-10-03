import {lessonGuides} from './lesson-guides.js';
import {lessonDfaFeedback} from './dfa-feedback.js';
import {renderDfaFeedback} from './dfa-view.js';

export function learningGoal(id,esc){
 const g=lessonGuides[id];
 return g?`<section class="learning-goal"><div class="eyebrow">DAS KANNST DU DANACH</div><p>${esc(g.goal)}</p><button class="btn ghost" data-action="method-scroll">Zum Lösungsweg ↓</button></section>`:'';
}

export function lessonGuideView(id,esc){
 const g=lessonGuides[id];if(!g)return '';
 const automata=lessonDfaFeedback[id]||[],table=automata.length?null:g.worked.table;
 return `<section class="reading-section lesson-method" id="lesson-method">
 <div class="eyebrow">VOM VERSTEHEN ZUM LÖSEN</div><h2>Dein Lösungsrezept</h2>
 <ol class="method-recipe">${g.recipe.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 <div class="worked-example"><h3>Einmal gemeinsam durchrechnen</h3><p>${esc(g.worked.prompt)}</p>
 ${automata.map((spec,i)=>renderDfaFeedback(spec,esc,{id:`lesson-${id}-${i}`,step:0})).join('')}
 <details class="solution-reveal"><summary>Lösungsweg Schritt für Schritt aufdecken</summary>
 <ol class="worked-steps">${g.worked.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 ${table?`<div class="table-scroll"><table><caption>Ergebnis zum Beispiel</caption><thead><tr>${table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}
 </details></div>
 <div class="recall-check"><h3>Stopp: Kannst du das erklären?</h3><p>${esc(g.check)}</p><p class="help">Antworte zuerst laut oder auf Papier. Vergleiche erst danach.</p>
 <details class="solution-reveal"><summary>Begründung vergleichen</summary><p>${esc(g.answer)}</p></details></div>
 <a class="btn secondary" href="#practice/${id}">Eine neue Variante selbst lösen →</a>
 </section>`;
}
