// UI-only assistance: never inspect answer, solution or rubric to choose keys.
export function examSymbols(q){
 if(q.type==='choice'||q.type==='number')return [];
 const prompt=q.prompt||'',topic=q.topic||'';
 const names=[...new Set((prompt.match(/\b(?:[A-Z]|[a-zA-Z]\d+|[a-z])\b/g)||[]))];
 const alphabet=q.alphabet||(/\{\s*a\s*,\s*b\s*\}/.test(prompt)?['a','b']:['0','1']);
 if(q.type==='regex')return [...new Set([...alphabet,'ε','∅','|','∪','(',')','*','+'])];
 const set=['ε','∅','{','}',','];
 if(q.type==='set')return [...new Set([...names,...(topic==='cyk'?[]:alphabet),...set])];
 const groups={
  tm:['0','1','□','ε','→','⊢','(',')',','],
  cnf:['a','b','S','A','B','ε','→','⇒','⇒*','|','(',')','+','*'],
  cyk:['a','b','S','A','B','ε','∅','{','}',',','→','⇒','|','(',')'],
  hierarchy:['Σ','ε','∅','∈','⊆','⊊','⊂','→','↔','{','}',':','ⁿ','≥'],
  np:['∈','⊆','≤','≥','=','{','}',',','(',')'],
  reduction:['≤','≤p','→','↔','∈'],
  complexity:['(',')','ⁿ','²','³','≤','≥','=','·'],
  pumping:['ε','∈','∉','∀','∃','≥','≤','|','ⁿ','ᵖ','(',')','=','≠'],
 };
 const fallback=['ε','∅','Σ','∪','∩','∖','∈','∉','⊆','→','⇒','|','{','}',',','(',')','*','+'];
 return [...new Set([...names,...alphabet,...(groups[topic]||fallback)])];
}
export function symbolKeyboard(target,symbols,esc,editing=false){
 return `<div class="symbol-keyboard" role="group" aria-label="Zeichen einfügen">${symbols.map(s=>`<button type="button" data-action="symbol" data-target="${esc(target)}" data-symbol="${esc(s)}" aria-label="${esc(s)} einfügen">${esc(s)}</button>`).join('')}${editing?`<button type="button" data-action="erase-symbol" data-target="${esc(target)}" aria-label="Zeichen vor dem Cursor oder Auswahl löschen">⌫</button><button type="button" data-action="clear-input" data-target="${esc(target)}">Leeren</button>`:''}</div>`;
}
