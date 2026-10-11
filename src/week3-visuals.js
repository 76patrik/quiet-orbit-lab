const frame=(label,note,kind,data)=>({label,note,kind,data});
const table=(label,note,rows)=>frame(label,note,'matrix',{headers:['Schritt / Variable','Ergebnis / Regel'],rows});
const tiles=(label,note,data)=>frame(label,note,'tiles',data);
const leaf=()=>({label:'E',children:[{label:'a'}]});
const op=(symbol,left,right)=>({label:'E',children:[left,{label:symbol},right]});
export const syntaxTrees={
 guided:[op('+',leaf(),op('*',leaf(),leaf())),op('*',op('+',leaf(),leaf()),leaf())],
 solo:[op('+',op('*',leaf(),leaf()),leaf()),op('*',leaf(),op('+',leaf(),leaf()))]
};
export function treeWord(node){return node.children?node.children.map(treeWord).join(''):node.label;}
export function syntaxTreeSvg(tree,esc){
 const points=[],edges=[];let next=0,maxDepth=0;
 function place(node,depth){maxDepth=Math.max(maxDepth,depth);const children=(node.children||[]).map(n=>place(n,depth+1));const x=children.length?children.reduce((s,p)=>s+p.x,0)/children.length:35+(next++)*80;const point={x,y:35+depth*70,label:node.label};points.push(point);children.forEach(c=>edges.push([point,c]));return point;}
 place(tree,0);const width=Math.max(320,next*80),height=80+maxDepth*70;
 return `<div class="lv-svg-scroll" role="region" tabindex="0" aria-label="Syntaxbaum, Blattwort ${esc(treeWord(tree))}"><svg class="w3-tree" viewBox="0 0 ${width} ${height}" role="img" aria-label="Syntaxbaum für ${esc(treeWord(tree))}">${edges.map(([p,c])=>`<line x1="${p.x}" y1="${p.y+15}" x2="${c.x}" y2="${c.y-15}" stroke="currentColor"/>`).join('')}${points.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="17" fill="var(--bg,#1b202a)" stroke="currentColor"/><text x="${p.x}" y="${p.y+5}" text-anchor="middle" fill="currentColor">${esc(p.label)}</text>`).join('')}</svg></div>`;
}
const cnfFrames=solo=>{
 const original=solo?'aSbb':'aSb',base=solo?'abb':'ab',long=solo?'ASBB':'ASB',short=solo?'ABB':'AB',last=solo?'AC | AD':'AC | AB';
 return [
 table('Start und ε sichern','Das neue Startsymbol S0 taucht niemals rechts auf. ε gehört zur ursprünglichen Sprache.',[['Original',`S → ${original} | ε`],['Neu','S0 → S | ε'],['Nullable','S kann ε erzeugen']]),
 table('ε in S entfernen','Das innere S darf entfallen. Ergänze die Variante ohne S, bevor du S→ε löschst.',[['S',`${original} | ${base}`],['S0','S | ε']]),
 table('Kettenregel entfernen','S0 übernimmt alle Nicht-Kettenregeln von S. Das ε bleibt zusätzlich an S0.',[['S0',`${original} | ${base} | ε`],['S',`${original} | ${base}`]]),
 table('Terminale auslagern','Nur längere rechte Seiten ändern: Terminale werden durch die neuen Variablen A und B ersetzt.',[['A','a'],['B','b'],['S0',`${long} | ${short} | ε`],['S',`${long} | ${short}`]]),
 table('Lange Regeln zerlegen','Jede rechte Seite enthält nun zwei Variablen oder ein Terminal; ε ist nur am neuen Start erlaubt.',[['S0',`${last} | ε`],['S',last],['C',solo?'SD':'SB'],...(solo?[['D','BB']]:[]),['A','a'],['B','b']]),
 tiles('Sprache kontrollieren','Die Konstruktion erhält die Sprache: ein a wird mit der passenden Zahl b ergänzt. Kurze Beispiele ergänzen die Begründung.',[['ε','nur S0→ε'],[solo?'abb':'ab','kleinstes nichtleeres Wort'],[solo?'aabbbb':'aabb','ein rekursiver Schritt'],[solo?'aⁿb²ⁿ':'aⁿbⁿ','allgemeine Form, n≥0']])
 ];
};
const syntaxFrames=solo=>[frame('Erster Baum','Lies zuerst die Wurzelregel, dann das Blattwort von links nach rechts.','w3tree',syntaxTrees[solo?'solo':'guided'][0]),frame('Zweiter Baum','Dasselbe Wort, aber eine andere Wurzelregel: Das belegt Mehrdeutigkeit dieser Grammatik.','w3tree',syntaxTrees[solo?'solo':'guided'][1]),table('Bäume vergleichen','Die erklärenden Klammern gehören nicht zum Terminalalphabet.',[['Blattwort',solo?'a*a+a':'a+a*a'],['Struktur 1',solo?'(a*a)+a':'a+(a*a)'],['Struktur 2',solo?'a*(a+a)':'(a+a)*a'],['Schluss','Zwei verschiedene Bäume, dasselbe Wort']])];
export const week3Visuals={
 limits:{title:'Welche Erinnerung braucht die Sprache?',question:'Vergleiche gerade viele a mit gleich langen a/b-Blöcken.',frames:[table('Zwei Restfälle reichen','Start und Endzustand G. a kippt die Parität, b verändert sie nicht.',[['G','a→U, b→G; akzeptierend'],['U','a→G, b→U; ablehnend']]),table('Präfixe unterscheiden','Für aⁿbⁿ trennt dieselbe Fortsetzung bb die Präfixe aa und aaa.',[['aa + bb','aabb: angenommen'],['aaa + bb','aaabb: abgelehnt']]),tiles('Beliebig viele Erinnerungen','Das Argument funktioniert für jede Zahl i, nicht nur bis drei.',[['aⁱ','mit bⁱ angenommen'],['aʲ, j≠i','mit bⁱ abgelehnt'],['Folgerung','unendlich viele unterscheidbare Präfixe']])]},
 pumping:{title:'Die Pumpzone liegt nur im ersten Block',question:'L={aⁿbⁿ:n≥0}; p wird vorgegeben. Wähle w=aᵖbᵖ.',frames:[tiles('Wortwahl','w liegt in L und hat Länge 2p≥p.',[['aᵖ','erste p Zeichen'],['bᵖ','zweiter Block']]),tiles('Beliebige Zerlegung','|xy|≤p und |y|≥1 erzwingen y=aᵏ mit 1≤k≤p.',[['x','nur a oder ε'],['y=aᵏ','nichtleer; nur a'],['z','restliche a und alle b']]),tiles('i=0 entfernt y','Die b-Zahl bleibt p; die a-Zahl sinkt auf p−k. Das verletzt Gleichheit für jedes k≥1.',[['a^(p−k)','weniger als p'],['bᵖ','unverändert p'],['Widerspruch','für jede erlaubte Zerlegung']])]},
 syntax:{title:'Zwei Syntaxbäume zum selben Wort',question:'Σ={a,+,*}, V={E}, Start E; E→E+E|E*E|a. Wort a+a*a.',frames:syntaxFrames(false)},
 cnf:{title:'Eine vollständige CNF-Umformung',question:'Σ={a,b}, Start S; S→aSb|ε. Wir erhalten genau aⁿbⁿ, n≥0.',frames:cnfFrames(false)},
 'limits-solo':{title:'Der Paritäts-DEA mit vier Zuständen',question:'Über {a,b,c}: gerade a-Anzahl, ungerade b-Anzahl.',frames:[table('Zustandsbedeutung','Erste Komponente zählt a, zweite b. G=gerade, U=ungerade.',[['Start','GG'],['Endmenge','{GU}']]),table('Alle Übergänge','Spaltenreihenfolge (a,b,c); c lässt den Zustand unverändert.',[['GG','UG, GU, GG'],['GU','UU, GG, GU'],['UG','GG, UU, UG'],['UU','GU, UG, UU']])]},
 'pumping-solo':{title:'Neue Pumping-Variante: doppelt so viele b',question:'L={aⁿb²ⁿ:n≥0}.',frames:[tiles('Zeugenwort','Nach vorgegebenem p wähle aᵖb²ᵖ.',[['aᵖ','p a'],['b²ᵖ','2p b']]),tiles('Abpumpen','Jedes erlaubte y=aᵏ liegt im a-Block. Nach i=0 stimmen die Anzahlen nicht mehr.',[['a^(p−k)','p−k a'],['b²ᵖ','2p statt 2(p−k) b'],['k≥1','Widerspruch']])]},
 'syntax-solo':{title:'Vergleichsbäume für a*a+a',question:'E→E+E|E*E|a, Start E.',frames:syntaxFrames(true)},
 'cnf-solo':{title:'CNF für aⁿb²ⁿ',question:'Σ={a,b}, Start S; S→aSbb|ε.',frames:cnfFrames(true)}
};
