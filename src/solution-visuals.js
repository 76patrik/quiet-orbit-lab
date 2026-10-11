// SVG- und HTML-Bausteine für die Lösungswege. Jede Grafik bekommt eine Textalternative;
// Farbe ist nie die einzige Information (Gruppen tragen zusätzlich Nummern/Beschriftungen).
import {BLANK,configLabel} from './solution-models.js';

export const TONES=['lime','purple','sky','peach','pink','mint','sand'];
let uid=0;
const fmt=n=>Number(n).toFixed(1).replace(/\.0$/,'');

// Allgemeiner Diagramm-Renderer für Automaten, Turingmaschinen, Graphen und Begriffskarten.
// spec: {nodes:[{id,label,x,y,accept,start,shape:'circle'|'box',w,h,tone,sub}], edges:[{from,to,label,bend,loop,tone,dashed,dir}],
//        directed=true, width, height, title, desc, highlight:{nodes:[], edges:['from>to']}, r=26}
export function diagramSvg(spec,esc){
 const id=`wtd${++uid}`,r=spec.r||26,directed=spec.directed!==false;
 const pos=Object.fromEntries(spec.nodes.map(n=>[n.id,n]));
 const hiNodes=new Set(spec.highlight?.nodes||[]),hiEdges=new Set(spec.highlight?.edges||[]);
 const dimOthers=!!spec.highlight?.dim;
 const edgeKey=e=>`${e.from}>${e.to}`;
 const reach=(n,dx,dy)=>{ // Abstand vom Mittelpunkt bis zum Rand in Richtung (dx,dy)
  if(n.shape==='box'){const w=(n.w||120)/2,h=(n.h||46)/2;const t=Math.min(Math.abs(dx)>1e-9?w/Math.abs(dx):Infinity,Math.abs(dy)>1e-9?h/Math.abs(dy):Infinity);return t+(directed?4:0);}
  return (n.r||r)+(directed?3:0);
 };
 const lines=label=>String(label??'').split('\n');
 const box=[Infinity,Infinity,-Infinity,-Infinity],grow=(x,y,w=0,h=0)=>{box[0]=Math.min(box[0],x-w);box[1]=Math.min(box[1],y-h);box[2]=Math.max(box[2],x+w);box[3]=Math.max(box[3],y+h);};
 const growLabel=(x,y,label)=>{const ls=lines(label);grow(x,y,Math.max(...ls.map(l=>[...l].length))*4.6+6,ls.length*9+4);};
 const labelSvg=(x,y,label,cls)=>{const ls=lines(label);return `<text class="${cls}" x="${fmt(x)}" y="${fmt(y-(ls.length-1)*8.5)}">${ls.map((l,i)=>`<tspan x="${fmt(x)}" dy="${i?17:0}">${esc(l)}</tspan>`).join('')}</text>`;};
 const edges=spec.edges.map(e=>{
  const a=pos[e.from],b=pos[e.to];if(!a||!b)throw new Error(`Kante ${e.from}→${e.to} ohne Knoten`);
  const on=hiEdges.has(edgeKey(e))||(!directed&&hiEdges.has(`${e.to}>${e.from}`));
  const cls=`wt-edge${on?' is-on':''}${dimOthers&&!on?' is-dim':''}${e.tone?' tone-'+e.tone:''}${e.dashed?' is-dashed':''}`;
  const marker=directed?` marker-end="url(#${id}-${on?'on':'off'})"`:'';
  let d,lx,ly;
  if(e.from===e.to){
   const dir=e.loop||'top',v={top:[0,-1],bottom:[0,1],left:[-1,0],right:[1,0]}[dir],[ux,uy]=v,[px,py]=[-uy,ux],rr=a.r||r;
   const sx=a.x+ux*rr*0.7+px*rr*0.7,sy=a.y+uy*rr*0.7+py*rr*0.7,ex=a.x+ux*rr*0.7-px*rr*0.7,ey=a.y+uy*rr*0.7-py*rr*0.7;
   const c1x=a.x+ux*rr*2.6+px*rr*1.1,c1y=a.y+uy*rr*2.6+py*rr*1.1,c2x=a.x+ux*rr*2.6-px*rr*1.1,c2y=a.y+uy*rr*2.6-py*rr*1.1;
   d=`M ${fmt(sx)} ${fmt(sy)} C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(ex)} ${fmt(ey)}`;grow((c1x+c2x)/2*0.75+a.x*0.25,(c1y+c2y)/2*0.75+a.y*0.25,8,8);
   const ls=lines(e.label),nl=ls.length,half=Math.max(...ls.map(l=>[...l].length))*4.4,dist=rr*2.15+8;
   if(dir==='top'||dir==='bottom'){lx=a.x;ly=a.y+uy*(dist+nl*8.5);}else{lx=a.x+ux*(dist+half);ly=a.y;}
  }else{
   const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,bend=e.bend||0;
   const cx=(a.x+b.x)/2+nx*bend,cy=(a.y+b.y)/2+ny*bend;
   const s1x=cx-a.x,s1y=cy-a.y,s1=Math.hypot(s1x,s1y),e1x=b.x-cx,e1y=b.y-cy,e1=Math.hypot(e1x,e1y);
   const ra=reach(a,s1x/s1,s1y/s1)-(directed?3:0),rb=reach(b,e1x/e1,e1y/e1);
   const sx=a.x+s1x/s1*ra,sy=a.y+s1y/s1*ra,ex=b.x-e1x/e1*rb,ey=b.y-e1y/e1*rb;
   d=`M ${fmt(sx)} ${fmt(sy)} Q ${fmt(cx)} ${fmt(cy)}, ${fmt(ex)} ${fmt(ey)}`;grow((sx+2*cx+ex)/4,(sy+2*cy+ey)/4,4,4);
   const off=e.labelOffset??12;lx=(sx+2*cx+ex)/4+nx*off*(bend<0?-1:1)+(e.lx||0);ly=(sy+2*cy+ey)/4+ny*off*(bend<0?-1:1)+(e.ly||0);
   if(!bend&&!e.labelOffset){lx=(sx+ex)/2+nx*off+(e.lx||0);ly=(sy+ey)/2+ny*off+(e.ly||0);}
  }
  if(e.label!==undefined&&e.label!=='')growLabel(lx,ly,e.label);
  return `<g class="${cls}"><title>${esc(`${e.from} ${directed?'→':'—'} ${e.to}${e.label?`: ${String(e.label).replace(/\n/g,'; ')}`:''}`)}</title><path d="${d}"${marker}/>${e.label!==undefined&&e.label!==''?labelSvg(lx,ly,e.label,'wt-edge-label'):''}</g>`;
 }).join('');
 const nodes=spec.nodes.map(n=>{
  if(n.shape==='box')grow(n.x,n.y,(n.w||120)/2,(n.h||46)/2);else grow(n.x,n.y,(n.r||r)+2,(n.r||r)+2);
  if(n.start){const [ux,uy]={left:[-1,0],top:[0,-1],right:[1,0],bottom:[0,1],topleft:[-.7,-.7]}[n.start===true?'left':n.start];grow(n.x+ux*((n.r||r)+36),n.y+uy*((n.r||r)+36));}
  const on=hiNodes.has(n.id),cls=`wt-node${on?' is-on':''}${dimOthers&&!on?' is-dim':''}${n.tone?' tone-'+n.tone:''}${n.shape==='box'?' is-box':''}`,label=n.label??n.id;
  let shape;
  if(n.shape==='box'){const w=n.w||120,h=n.h||46;shape=`<rect x="${fmt(n.x-w/2)}" y="${fmt(n.y-h/2)}" width="${w}" height="${h}" rx="12"/>`;}
  else shape=`<circle cx="${n.x}" cy="${n.y}" r="${n.r||r}"/>${n.accept?`<circle class="wt-ring" cx="${n.x}" cy="${n.y}" r="${(n.r||r)-5}"/>`:''}`;
  const ls=lines(label),fs=n.shape==='box'?14:Math.min(15,58/Math.max(...ls.map(l=>[...l].length)));
  const text=`<text x="${n.x}" y="${fmt(n.y-(ls.length-1)*8+(n.sub?-6:0))}" style="font-size:${fmt(Math.max(fs,10))}px">${ls.map((l,i)=>`<tspan x="${n.x}" dy="${i?17:0}">${esc(l)}</tspan>`).join('')}</text>${n.sub?`<text class="wt-node-sub" x="${n.x}" y="${fmt(n.y+12+(ls.length-1)*8)}">${esc(n.sub)}</text>`:''}`;
  const start=n.start?(()=>{const [ux,uy]={left:[-1,0],top:[0,-1],right:[1,0],bottom:[0,1],topleft:[-.7,-.7]}[n.start===true?'left':n.start];const rr=n.r||r;return `<path class="wt-start" d="M ${fmt(n.x+ux*(rr+34))} ${fmt(n.y+uy*(rr+34))} L ${fmt(n.x+ux*(rr+4))} ${fmt(n.y+uy*(rr+4))}" marker-end="url(#${id}-off)"/>`;})():'';
  return `<g class="${cls}">${start}${shape}${text}</g>`;
 }).join('');
 const pad=10,vx=Math.floor(box[0]-pad),vy=Math.floor(box[1]-pad),w=Math.ceil(box[2]-box[0]+2*pad),h=Math.ceil(box[3]-box[1]+2*pad);
 return `<figure class="wt-figure"><div class="wt-scroll" tabindex="0" role="region" aria-label="${esc(spec.title||'Grafik')} – bei Bedarf seitlich scrollen"><svg class="wt-svg" viewBox="${vx} ${vy} ${w} ${h}" style="--w:${w}px" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(spec.title||'Grafik')}</title><desc id="${id}-d">${esc(spec.desc||describe(spec,directed))}</desc><defs>${['off','on'].map(k=>`<marker id="${id}-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="wt-arrow ${k}" d="M0 0L10 5L0 10z"/></marker>`).join('')}</defs>${edges}${nodes}</svg></div>${spec.caption?`<figcaption>${esc(spec.caption)}</figcaption>`:''}</figure>`;
}
function describe(spec,directed){
 const n=spec.nodes.map(x=>`${String(x.label??x.id).replace(/\n/g,' ')}${x.accept?' (Endzustand)':''}${x.start?' (Start)':''}`).join(', ');
 const e=spec.edges.map(x=>`${x.from}${directed?'→':'—'}${x.to}${x.label?` [${String(x.label).replace(/\n/g,'; ')}]`:''}`).join(', ');
 return `Knoten: ${n}. ${directed?'Pfeile':'Kanten'}: ${e}.`;
}

// Turingband mit Kopf. configs: Liste aus runTm, index: aktuelle Konfiguration.
export function tapeView({configs,index=0,title='Band'},esc){
 const c=configs[Math.min(index,configs.length-1)];
 const cells=c.cells.map((s,i)=>`<span class="wt-cell${i===c.head?' is-head':''}${s===BLANK?' is-blank':''}" ${i===c.head?'aria-current="true"':''}>${esc(s)}</span>`).join('');
 return `<div class="wt-tape" role="group" aria-label="${esc(`${title}: Konfiguration ${index+1} von ${configs.length}: ${configLabel(c)}`)}"><div class="wt-tape-state">Zustand <strong>${esc(c.state)}</strong> · Konfiguration ${index+1}/${configs.length}</div><div class="wt-tape-cells" aria-hidden="true">${cells}</div><code class="wt-config">${esc(configLabel(c))}</code></div>`;
}
export function configList(configs,esc,{upto=configs.length,mark=-1,numbered=true}={}){
 return `<ol class="wt-configs">${configs.slice(0,upto).map((c,i)=>`<li class="${i===mark?'is-on':''}">${numbered?`<span>${i+1}</span>`:''}<code>${esc(configLabel(c))}</code></li>`).join('')}</ol>`;
}

// CYK-Tabelle: Zeile = Teilwortlänge, Spalte = Startposition. Zellen außerhalb von "shown" bleiben leer.
export function cykView({word,table,shown=Infinity,focus=null,parts=[],start='S',title='CYK-Tabelle'},esc){
 const n=word.length;let count=0;
 const rows=[];
 for(let len=1;len<=n;len++){
  const cells=[];
  for(let i=0;i<n;i++){
   if(i>n-len){cells.push('<td class="wt-cyk-off" aria-hidden="true"></td>');continue;}
   count++;const visible=count<=shown,vals=table[len-1][i];
   const isFocus=focus&&focus[0]===len&&focus[1]===i,isPart=parts.some(p=>p[0]===len&&p[1]===i);
   const top=len===n&&vals.includes(start);
   cells.push(`<td class="${isFocus?'is-focus ':''}${isPart?'is-part ':''}${top&&visible?'is-start':''}" title="V(${i+1},${i+len}) – Teilwort ${esc(word.slice(i,i+len))}">${visible?(vals.length?esc(vals.join(', ')):'<span class="wt-empty">∅</span>'):'<span class="wt-pending">?</span>'}<small>${esc(word.slice(i,i+len))}</small></td>`);
  }
  rows.push(`<tr><th scope="row">Länge ${len}</th>${cells.join('')}</tr>`);
 }
 return `<div class="wt-scroll wt-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="wt-cyk"><caption>${esc(title)}: Spalte = Startposition, Zeile = Länge des Teilworts</caption><thead><tr><th scope="col">Länge \\ Start</th>${[...word].map((c,i)=>`<th scope="col">${i+1}: <strong>${esc(c)}</strong></th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

// Partitionen (Minimierung): jede Runde eine Zeile mit nummerierten Blöcken.
export function partitionView({rounds,current=rounds.length-1},esc){
 return `<div class="wt-partition">${rounds.map((r,ri)=>`<div class="wt-round${ri===current?' is-on':''}${ri>current?' is-future':''}"><div class="wt-round-label">${esc(r.label)}</div><div class="wt-blocks">${ri>current?'<span class="wt-pending">noch offen</span>':r.groups.map((g,gi)=>`<span class="wt-block tone-${TONES[gi%TONES.length]}${r.changed?.includes(gi)?' is-new':''}"><b>${gi+1}</b>{${esc(g.join(', '))}}</span>`).join('')}</div>${r.note&&ri<=current?`<p>${esc(r.note)}</p>`:''}</div>`).join('')}</div>`;
}

// Baum mit automatischer Anordnung: Blätter gleichmäßig, Eltern mittig über den Kindern.
export function treeSvg({root,title='Syntaxbaum',caption='',highlight=[]},esc){
 let leaf=0;const nodes=[],edges=[];const hi=new Set(highlight);
 (function place(n,depth,path){
  n._d=depth;n._p=path;
  if(!n.children?.length){n._x=leaf++;}
  else{n.children.forEach((c,i)=>place(c,depth+1,path+'.'+i));n._x=(n.children[0]._x+n.children[n.children.length-1]._x)/2;}
  nodes.push(n);n.children?.forEach(c=>edges.push([n,c]));
 })(root,0,'0');
 const depth=Math.max(...nodes.map(n=>n._d)),W=Math.max(320,leaf*46+40),H=depth*62+70,X=n=>30+n._x*46,Y=n=>32+n._d*62;
 return `<figure class="wt-figure"><div class="wt-scroll" tabindex="0" role="region" aria-label="${esc(title)}"><svg class="wt-svg wt-tree" viewBox="0 0 ${W} ${H}" style="--w:${W}px" role="img" aria-label="${esc(title)}">${edges.map(([a,b])=>`<line class="${hi.has(b._p)?'is-on':''}" x1="${X(a)}" y1="${Y(a)+14}" x2="${X(b)}" y2="${Y(b)-14}"/>`).join('')}${nodes.map(n=>n.children?.length?`<g class="wt-tnode${hi.has(n._p)?' is-on':''}"><circle cx="${X(n)}" cy="${Y(n)}" r="15"/><text x="${X(n)}" y="${Y(n)}">${esc(n.label)}</text></g>`:`<text class="wt-tleaf${hi.has(n._p)?' is-on':''}" x="${X(n)}" y="${Y(n)}">${esc(n.label)}</text>`).join('')}</svg></div>${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;
}

export function tableView({caption,head,rows,rowHead=true,highlight=[]},esc){
 const hi=new Set(highlight.map(([r,c])=>`${r}:${c}`));
 return `<div class="wt-scroll wt-table-wrap" tabindex="0" role="region" aria-label="${esc(caption||'Tabelle')}"><table class="wt-table">${caption?`<caption>${esc(caption)}</caption>`:''}<thead><tr>${head.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r,ri)=>`<tr>${r.map((c,ci)=>ci===0&&rowHead?`<th scope="row"${hi.has(`${ri}:${ci}`)?' class="is-on"':''}>${esc(c)}</th>`:`<td${hi.has(`${ri}:${ci}`)?' class="is-on"':''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// Kurze Kacheln, Ketten und Stapel.
export const tilesView=({items},esc)=>`<div class="wt-tiles">${items.map(([a,b,tone])=>`<div class="wt-tile${tone?' tone-'+tone:''}"><strong>${esc(a)}</strong>${b?`<span>${esc(b)}</span>`:''}</div>`).join('')}</div>`;
export const chainView=({items,joiner='→'},esc)=>`<div class="wt-chain">${items.map((x,i)=>{const [a,b,on]=Array.isArray(x)?x:[x];return `${i?`<span class="wt-chain-arrow" aria-hidden="true">${esc(joiner)}</span>`:''}<span class="wt-chain-item${on?' is-on':''}">${esc(a)}${b?`<small>${esc(b)}</small>`:''}</span>`;}).join('')}</div>`;
export const stackView=({frames},esc)=>`<div class="wt-stacks">${frames.map(f=>`<div class="wt-stackcol"><div class="wt-stack" aria-label="${esc(`Keller nach ${f.label}: oben ${f.stack[0]??'leer'}`)}">${f.stack.length?f.stack.map((s,i)=>`<span class="${i===0?'is-top':''}">${esc(s)}</span>`).join(''):'<span class="is-empty">leer</span>'}</div><small>${esc(f.label)}</small></div>`).join('')}</div>`;

export function visualView(v,esc){
 if(!v)return '';
 switch(v.type){
  case 'diagram':return diagramSvg(v,esc);
  case 'tape':return tapeView(v,esc);
  case 'configs':return configList(v.configs,esc,v);
  case 'cyk':return cykView(v,esc);
  case 'partition':return partitionView(v,esc);
  case 'tree':return treeSvg(v,esc);
  case 'table':return tableView(v,esc);
  case 'tiles':return tilesView(v,esc);
  case 'chain':return chainView(v,esc);
  case 'stack':return stackView(v,esc);
  case 'group':return `<div class="wt-vgroup${v.row?' is-row':''}">${v.items.map(x=>`<div>${x.label?`<div class="wt-vlabel">${esc(x.label)}</div>`:''}${visualView(x,esc)}</div>`).join('')}</div>`;
  default:throw new Error('Unbekannte Grafik: '+v.type);
 }
}
