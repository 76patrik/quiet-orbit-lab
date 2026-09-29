import {runDfa,setLabel,wordLabel} from './engine.js';
import {dfaFeedbackFor} from './dfa-feedback.js';

const key=(s,c)=>JSON.stringify([s,c]);
// IDs are encoded, not just sanitized: q/a and q-a must stay distinct in result lists.
const safeId=value=>[...String(value)].map(c=>c.codePointAt(0).toString(16)).join('-');

function diagram(machine,esc,id,current,active){
  const count=machine.states.length,radius=count<3?0:Math.max(110,count*25),width=machine.width||(count<3?430:radius*2+210),height=machine.height||(count<3?230:radius*2+190);
  const positions=machine.positions||Object.fromEntries(machine.states.map((s,i)=>{
    if(count===1)return [s,[width/2,height/2]];
    if(count===2)return [s,[120+i*190,height/2]];
    const angle=Math.PI+i*2*Math.PI/count;return [s,[width/2+radius*Math.cos(angle),height/2+radius*Math.sin(angle)]];
  }));
  const grouped=new Map();
  for(const s of machine.states)for(const c of machine.alphabet){
    const t=machine.transitions[s][c];
    if(machine.omitSinkEdges===t)continue;
    const pair=JSON.stringify([s,t]);
    if(!grouped.has(pair))grouped.set(pair,{s,t,chars:[]});
    grouped.get(pair).chars.push(c);
  }
  const point=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`;
  const edges=[...grouped.values()].map(({s,t,chars})=>{
    const [x,y]=positions[s],[tx,ty]=positions[t],highlight=chars.some(c=>active===key(s,c));
    let d,lx,ly;
    if(s===t){
      const angle=count<=2?-Math.PI/2:Math.atan2(y-height/2,x-width/2),ux=Math.cos(angle),uy=Math.sin(angle),vx=-uy,vy=ux;
      d=`M ${point(x+ux*21+vx*20,y+uy*21+vy*20)} C ${point(x+ux*89+vx*48,y+uy*89+vy*48)}, ${point(x+ux*89-vx*48,y+uy*89-vy*48)}, ${point(x+ux*25-vx*20,y+uy*25-vy*20)}`;
      lx=x+ux*77;ly=y+uy*77;
    }else{
      const dx=tx-x,dy=ty-y,len=Math.hypot(dx,dy),bend=grouped.has(JSON.stringify([t,s]))?38:12,nx=-dy/len,ny=dx/len;
      const cx=(x+tx)/2+nx*bend,cy=(y+ty)/2+ny*bend,sl=Math.hypot(cx-x,cy-y),tl=Math.hypot(tx-cx,ty-cy);
      const sx=x+(cx-x)/sl*30,sy=y+(cy-y)/sl*30,ex=tx-(tx-cx)/tl*34,ey=ty-(ty-cy)/tl*34;
      d=`M ${point(sx,sy)} Q ${point(cx,cy)}, ${point(ex,ey)}`;
      lx=(sx+2*cx+ex)/4+nx*12;ly=(sy+2*cy+ey)/4+ny*12;
    }
    return `<g class="dfa-edge${highlight?' is-active':''}" data-from="${esc(s)}" data-to="${esc(t)}"><title>${esc(`${s}: ${chars.join(', ')} → ${t}`)}</title><path d="${d}" marker-end="url(#${id}-${highlight?'active-':''}arrow)"/><text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" dy=".35em">${esc(chars.join(', '))}</text></g>`;
  }).join('');
  const [sx,sy]=positions[machine.start];
  return `<div class="dfa-diagram-scroll" tabindex="0" role="region" aria-label="DEA-Grafik, bei Bedarf seitlich scrollen"><svg class="dfa-diagram" viewBox="0 0 ${width} ${height}" style="width:${width}px" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">DEA: ${esc(machine.name||'Aufgabenautomat')}</title><desc id="${id}-desc">Start ${esc(machine.start)}. Endzustände ${esc(setLabel(machine.accept))}. Pfeile tragen die gelesenen Zeichen. Alle Übergänge stehen auch in der Tabelle.${current?` Aktuell: ${esc(current)}.`:''}${machine.omitSinkEdges?` Nicht gezeichnete Übergänge führen nach ${esc(machine.omitSinkEdges)}.`:''}</desc><defs>${['','active-'].map(variant=>`<marker id="${id}-${variant}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="${variant?'dfa-arrow-active':'dfa-arrow'}" d="M 0 0 L 10 5 L 0 10 z"/></marker>`).join('')}</defs>${edges}<path class="dfa-start" d="M ${sx-68} ${sy} H ${sx-32}" marker-end="url(#${id}-arrow)"/><text class="dfa-start-label" x="${sx-64}" y="${sy-12}">Start</text>${machine.states.map(s=>{const [x,y]=positions[s];return `<g class="dfa-node${s===current?' is-current':''}" data-state="${esc(s)}"><circle cx="${x}" cy="${y}" r="28"/>${machine.accept.includes(s)?`<circle class="dfa-accept-ring" cx="${x}" cy="${y}" r="22"/>`:''}<text x="${x}" y="${y}" dy=".35em">${esc(s)}</text></g>`;}).join('')}</svg></div>`;
}

export function renderDfaFeedback(spec,esc,{id='dfa-feedback',step}={}){
  const {machine,word,title='DEA nachvollziehen',note=''}=spec,uid=`dfa-${safeId(id)}`;
  const run=typeof word==='string'?runDfa(machine,word):null,chars=run?[...word]:[];
  const pos=run?Math.max(0,Math.min(chars.length,Number.isFinite(step)?step:chars.length)):null;
  const current=run?run.trace[pos]:null,active=pos>0?key(run.trace[pos-1],chars[pos-1]):null;
  const status=run?pos===chars.length?`Wort vollständig gelesen: ${wordLabel(word)} wird ${run.accepted?'akzeptiert':'abgelehnt'}, weil ${current} ${run.accepted?'in':'nicht in'} F liegt.`:`${pos} von ${chars.length} Zeichen gelesen. Aktueller Zustand: ${current}. Die Annahme wird erst nach dem ganzen Wort entschieden.`:'';
  return `<section class="dfa-feedback" data-dfa-feedback data-dfa-id="${esc(id)}" data-dfa-spec="${esc(JSON.stringify(spec))}" aria-labelledby="${uid}-heading"><h3 id="${uid}-heading">${esc(title)}</h3><p class="help">${esc(machine.name||'Aufgabenautomat')} · Start: ${esc(machine.start)} · F = ${esc(setLabel(machine.accept))}</p>${note?`<p class="dfa-note">${esc(note)}</p>`:''}
  ${run?`<div class="dfa-replay"><p><strong>Wort: ${esc(wordLabel(word))}</strong> · Wähle einen Schritt zum Nachvollziehen.</p><div class="dfa-steps" role="group" aria-label="Schritte des DEA-Laufs">${run.trace.map((s,i)=>`<button type="button" data-action="dfa-feedback-step" data-step="${i}" aria-pressed="${i===pos}" aria-label="Schritt ${i}: ${i?`Zeichen ${esc(chars[i-1])}, `:''}Zustand ${esc(s)}"><small>${i?`${i} · ${esc(chars[i-1])} lesen`:'0 · Start'}</small><strong>${esc(s)}</strong></button>`).join('')}</div><p class="dfa-run-status" role="status">${esc(status)}</p></div>`:''}
  ${diagram(machine,esc,uid,current,active)}
  <p class="help dfa-legend">→ Start · Doppelkreis / * = akzeptierend${run?' · Heller Kreis = aktueller Zustand · Heller Pfeil und Tabellenwert = letzter Schritt':''}.${machine.omitSinkEdges?` Für die Übersicht: Alle nicht gezeichneten Übergänge führen nach ${esc(machine.omitSinkEdges)}; dort bleiben alle Zeichen. Die Tabelle ist vollständig.`:''}</p>
  <div class="table-scroll dfa-transition-table" tabindex="0" role="region" aria-label="Übergangstabelle"><table><caption>Vollständige Übergangstabelle</caption><thead><tr><th scope="col">Zustand</th>${machine.alphabet.map(c=>`<th scope="col">Bei ${esc(c)}</th>`).join('')}${machine.meanings?'<th scope="col">Bedeutung</th>':''}</tr></thead><tbody>${machine.states.map(s=>`<tr class="${s===current?'current-row':''}"><th scope="row">${s===machine.start?'→ ':''}${machine.accept.includes(s)?'* ':''}${esc(s)}</th>${machine.alphabet.map(c=>`<td class="${active===key(s,c)?'dfa-active-cell':''}">${esc(machine.transitions[s][c])}</td>`).join('')}${machine.meanings?`<td>${esc(machine.meanings[s]||'')}</td>`:''}</tr>`).join('')}</tbody></table></div></section>`;
}

export function questionDfaFeedback(question,esc,context='question'){
  const spec=dfaFeedbackFor(question);
  return spec?renderDfaFeedback(spec,esc,{id:`${context}-${question.id}`}):'';
}

export function stepDfaFeedback(button,esc){
  const panel=button.closest('[data-dfa-feedback]'),step=Number(button.dataset.step);
  if(!panel||!Number.isInteger(step))return;
  const spec=JSON.parse(panel.dataset.dfaSpec),id=panel.dataset.dfaId;
  const template=document.createElement('template');template.innerHTML=renderDfaFeedback(spec,esc,{id,step});
  const replacement=template.content.firstElementChild;panel.replaceWith(replacement);
  replacement.querySelector(`[data-step="${step}"]`)?.focus({preventScroll:true});
}
