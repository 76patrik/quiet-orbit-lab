import {parseSet,setLabel,wordLabel,formatNumber,machines,runDfa} from './engine.js';

const firstSteps={
 m1:'Trenne die allgemeine Aufgabe „Sortieren“ von genau dieser Liste und von einem Verfahren wie Bubblesort.',
 m2:'Könnte ein formal korrekt geschriebenes Kennzeichen trotzdem noch nie vergeben worden sein?',
 m3:'Suche nach einer Beziehung zwischen Eingabegröße und benötigten Ressourcen.',
 c1:'Ersetze in 4n + 2 das n durch 100. Multipliziere zuerst, addiere dann 2.',
 c2:'Setze 10n anstelle von n ein. Die Klammer wird als Ganzes quadriert.',
 c3:'Zähle die geschriebenen Stellen von 1000. Gesucht ist nicht der Dezimalwert.',
 c4:'Zähle einen Übergang je gelesenem Zeichen. Überlege separat, was der Automat dabei speichern muss.',
 no1:'10 ist ein Wort, {10} eine Menge. Für ∈ und ⊆ brauchst du links unterschiedliche Arten von Objekten.',
 no2:'Streiche die zweite 0. Eine Menge zählt verschiedene Elemente.',
 no3:'„Genau dann, wenn“ verbindet eine Hinrichtung mit einer Rückrichtung.',
 a1:'Schreibe zuerst alle zweistelligen Wörter mit erster Stelle 0 auf, dann die mit erster Stelle 1.',
 a2:'Zeichne vier freie Stellen. Jede Stelle lässt unabhängig a oder b zu.',
 a3:'Jeder durch · getrennte Eintrag ist hier genau ein Symbol, auch wenn er aus mehreren Buchstaben besteht.',
 a4:'Entscheide für 0 und für 1 unabhängig: in der Teilmenge enthalten oder nicht? Auch die Auswahl ohne Elemente gehört dazu.',
 e1:'Die äußeren Mengenklammern enthalten einen Eintrag. Unterscheide die Anzahl der Wörter von der Länge dieses Eintrags.',
 e2:'Hänge an a und an bb jeweils null Zeichen an. Verändert sich dadurch eines der Wörter?',
 e3:'Für ein Ergebnis müsstest du auch aus dem rechten Faktor ein Wort wählen. Ist dort überhaupt eines vorhanden?',
 e4:'Zähle tatsächliche Zeichen: Die Ziffer 0 ist selbst ein Zeichen; ε bezeichnet die Folge ohne Zeichen.',
 la1:'Die Sprache ist ausdrücklich aufgezählt. Vergleiche 010 mit jedem vollständigen Eintrag.',
 la2:'Prüfe zwei Bedingungen getrennt: gleiche Anzahl und zuerst alle Nullen, danach alle Einsen.',
 la3:'u darf beliebig lang sein. Nach dem vorgeschriebenen a steht durch v genau noch ein Zeichen.',
 s4:'Prüfe zusätzlich zum letzten Zeichen das Wort ε: Hat es überhaupt ein letztes Zeichen?',
 co2:'Hier steht B links. Beginne also jedes Paar mit a aus B und hänge danach ein vollständiges Wort aus A an.',
 co3:'Vergleiche die Anzahl möglicher Wortpaare mit der Anzahl verschiedener Ergebnisse. Können zwei Paare dasselbe Wort bilden?',
 cl1:'Schreibe die nullte Potenz separat auf. Für den Stern ist auch die Verkettung von null Faktoren erlaubt.',
 cl2:'L² bedeutet L · L. Verwende die Paare a·a, a·bb, bb·a und bb·bb.',
 cl3:'Wortlängen addieren sich beim Verketten. Wann kann eine Summe nichtnegativer Längen null sein?',
 re1:'Bei 01* wird nur die 1 wiederholt. Bei (01)* wird der vollständige Zweierblock wiederholt.',
 re2:'Markiere zuerst die äußerste Vereinigung. Links davon steht (0∪1)*0, rechts das einzelne Wort 1.',
 re3:'Trenne die beiden Alternativen 0*1 und ε. In der ersten darf der 0-Block auch leer sein.',
 rc1:'Schreibe den verpflichtenden Schluss 01 zuerst hin. Davor ist jede Folge von 0 und 1 erlaubt.',
 rc2:'Platziere genau zwei feste Einsen. Überlege, welche Zeichen vor, zwischen und nach ihnen noch erlaubt sind.',
 rc3:'Welche Symbole bleiben von {0,1}, wenn keine 1 vorkommen darf? Auch null Wiederholungen sind erlaubt.',
 rc4:'Baue drei einzelne Positionen mit jeweils der Wahl 0 oder 1. Ein Stern würde zusätzliche Längen zulassen.',
 d1:'Verarbeite auch den Rest nach dem ersten Zeichen. Könnte er wieder aus dem Endzustand herausführen?',
 d2:'Bei ε wird kein Pfeil durchlaufen. Welcher Zustand bleibt nach der vollständigen Eingabe übrig?',
 d3:'Schreibe den Lauf zeichenweise auf: Start A, erste 1 führt nach A. Lies nun 0 und dann 1.',
 p1:'Die Zustände merken gerade oder ungerade viele Einsen. Welche Eingabe verändert genau diese Anzahl?',
 p2:'Zähle die Einsen in ε und prüfe, ob diese Anzahl durch 2 teilbar ist.',
 p3:'Unterscheide exakte Anzahl und Rest bei Division durch 2. Welche Information benötigt die Annahmebedingung?',
 al1:'Prüfe jedes benachbarte Zeichenpaar der drei Wörter. Ein einziges gleiches Paar reicht als Verstoß.',
 al2:'Nimm 11 und hänge 0 an. Ist das ursprüngliche Teilwort 11 dadurch verschwunden?',
 al3:'Nach do kann die Eingabe enden oder mit u weitergehen. Prüfe beide vollständigen Wörter getrennt.',
 cp1:'Gehe Q Eintrag für Eintrag durch und streiche genau die Einträge aus F. Vergiss err nicht.',
 cp2:'Was geschieht bei einem Wort, für das ein Pfeil fehlt? Dieses Wort muss auch im Komplement vollständig verarbeitet werden.',
 cp3:'Bei ε bleibt der Startzustand aktiv. Sein Akzeptanzstatus wird bei der Komplementbildung umgedreht.',
 g1:'Streiche Kandidaten, die noch die Variable S enthalten. Ein fertiges Wort besteht nur aus Terminalzeichen.',
 g2:'Wende zunächst zweimal S→0S an. Welche Abschlussregel entfernt danach die letzte Variable?',
 g3:'Kann ein Symbol gleichzeitig eine ersetzbare Variable und ein fertiges Terminal sein?',
 h1:'Für beliebig tiefe Klammerung reicht ein fester endlicher Zustandsspeicher nicht. Welches Modell hat einen Keller?',
 h2:'Die Hierarchie hat mehrere Stufen oberhalb regulärer Sprachen. „Nicht auf Stufe 3“ legt noch keine einzelne höhere Stufe fest.',
 h3:'Denke an ineinander liegende Mengen. Liegt ein Element der inneren Menge auch in der äußeren?',
 t1:'Schreibe jedes Wort als Verkettung von Zeichen. Verbinde die endlich vielen Möglichkeiten als Alternativen.',
 t2:'Teste die Binärkodierung einer Nichtprimzahl. Ein exakter Prüfer muss auch falsche positive Ergebnisse ausschließen.',
 t3:'Übersetze „in A und in B“ in „nicht außerhalb von A oder außerhalb von B“. Welche Formel entspricht dem?'
};

export function answerText(q){
 return q.type==='choice'?q.options[q.answer]:q.type==='set'?setLabel(q.answer):q.type==='number'?formatNumber(q.answer,q.unit):String(q.answer);
}

// Stages use this exercise's operands or reasoning, never a single topic-wide fallback.
export function hintsFor(q){
 if(q.hints?.length)return [...q.hints.map((text,i)=>({title:i?'Nächster Rechenschritt':'Ansatz für diese Aufgabe',text})),{title:'Lösungsweg & Ergebnis',text:`${q.explanation}\nErgebnis: ${answerText(q)}`}];
 let steps=[];
 const pair=q.prompt.match(/A\s*=\s*(\{[^}]*\}|∅),\s*B\s*=\s*(\{[^}]*\}|∅)/);
 if(pair&&q.type==='set'&&!firstSteps[q.id]){
  const a=parseSet(pair[1]),b=parseSet(pair[2]);
  if(q.lesson==='concat')steps=[`Bilde ${a.length} × ${b.length} Wortpaare. Lies jeweils erst ein ganzes Wort aus A, dann eines aus B.`,a.length&&b.length?`Beginne mit ${wordLabel(a[0])} · ${wordLabel(b[0])} = ${wordLabel(a[0]+b[0])}. Ergänze die restlichen Paare und streiche gleiche Ergebnisse.`:'Ein Faktor enthält kein Wort. Es lässt sich kein Paar bilden.'];
  else if(q.lesson==='quotient')steps=[`Gehe die Endstücke ${setLabel(b)} für jedes Wort aus A einzeln durch. Schneide nur vollständig passende Suffixe ab.`,a.length&&b.length?`Erster Test: Endet ${wordLabel(a[0])} auf ${wordLabel(b[0])}? ${a[0].endsWith(b[0])?`Ja: übrig bleibt ${wordLabel(b[0]?a[0].slice(0,-b[0].length):a[0])}.`:'Nein: Dieses Paar liefert keinen Rest.'} Prüfe danach alle weiteren Paare.`:'Ohne Wortpaare kann kein Rest entstehen.'];
  else {
   const op=q.prompt.includes('∩')?'intersection':q.prompt.includes('∖')?'difference':'union';
   const w=a[0]??b[0];
   steps=[op==='intersection'?`Gesucht sind gemeinsame Wörter von ${setLabel(a)} und ${setLabel(b)}. Prüfe jedes Wort aus A auch in B.`:op==='difference'?`Gehe nur von ${setLabel(a)} aus und entferne die Wörter, die auch in ${setLabel(b)} stehen.`:`Sammle Wörter aus ${setLabel(a)} und aus ${setLabel(b)}. Gleiche Einträge zählen einmal.`,w===undefined?'Beide Ausgangsmengen sind leer. Es gibt kein Wort aufzunehmen.':`Prüfe zuerst ${wordLabel(w)}: in A ${a.includes(w)?'ja':'nein'}, in B ${b.includes(w)?'ja':'nein'}. ${op==='intersection'?'Für den Schnitt brauchst du zweimal ja.':op==='difference'?'Für A∖B brauchst du ja in A und nein in B.':'Für die Vereinigung reicht mindestens einmal ja.'}`];
  }
 }else if(q.id.startsWith('variant-words-')){
  const [,k,n]=q.id.match(/words-(\d+)-(\d+)/);
  steps=[`Du hast ${n} Positionen und je ${k} mögliche Symbole. Verwende die Produktregel.`,Number(n)===0?'Für null Positionen gibt es genau die leere Folge. Die nullte Potenz ist 1.':`Setze |Σ|=${k} und n=${n} in |Σⁿ|=|Σ|ⁿ ein. Rechne also ${k}^${n}.`];
 }else if(q.id.startsWith('variant-growth-')){
  const [,factor,power]=q.id.match(/growth-(\d+)-(\d+)/);
  steps=[`Ersetze n durch ${factor}n, ohne den Exponenten ${power} zu ändern.`,`Teile (${factor}n)^${power} durch n^${power}. Der gesuchte Wachstumsfaktor ist ${factor}^${power}.`];
 }else if(q.id.startsWith('variant-power-')){
  const [,block,n]=q.id.match(/power-(\d+)-(\d+)/);
  steps=[`Der vollständige Block ${block} wird ${n}-mal hintereinander geschrieben. Das ist keine Multiplikation von Zahlen.`,Number(n)===0?'Null Blöcke ergeben ein Wort ohne Zeichen. Verwende dafür ε.':`Schreibe ${Array(Number(n)).fill(block).join(' · ')} und entferne anschließend die Trennpunkte.`];
 }else if(q.id.startsWith('variant-run-')){
  const [,id,word]=q.id.match(/run-(ends1|parity|alternate|contains1)-(.*)/),m=machines[id],w=word==='eps'?'':word;
  steps=[`Beginne in ${m.start} und lies ${wordLabel(w)} von links nach rechts. Prüfe F erst nach der gesamten Eingabe.`,w?`Nach dem ersten Zeichen ${w[0]} bist du in ${runDfa(m,w[0]).state}. Verarbeite jetzt den Rest ${wordLabel(w.slice(1))}; F = ${setLabel(m.accept)}.`:`Bei ε gibt es keinen Übergang. Prüfe, ob ${m.start} in F = ${setLabel(m.accept)} liegt.`];
 }else if(q.id.startsWith('variant-subset-')){
  const [,raw,symbol]=q.prompt.match(/folgt aus (.+) bei ([01])\?/),states=parseSet(raw);
  steps=[`Lies für jeden Zustand aus ${setLabel(states)} den Übergang bei ${symbol}. Vereinige die Zielmengen.`,states.length?`Beginne bei ${states[0]}. In der angegebenen Tabelle brauchst du nur dessen ${symbol}-Spalte; danach folgen die anderen aktiven Zustände. Eine leere Zielmenge fügt nichts hinzu.`:'Die Ausgangsmenge enthält keinen Zustand. Ohne aktiven Lauf kann auch kein Nachfolgezustand erreicht werden.'];
 }else if(q.id.startsWith('variant-cyk-')){
  const word=q.id.split('-').at(-1);
  steps=[`Fülle zuerst die ${word.length} Basiszellen für ${[...word].join(', ')} mit passenden Terminalregeln.`,`Für die oberste Zelle zu ${word} prüfst du die Zerlegungen ${Array.from({length:word.length-1},(_,i)=>word.slice(0,i+1)+' | '+word.slice(i+1)).join('; ')}. Suche jeweils Regeln A→BC mit B links und C rechts und vereinige alle Treffer.`];
 }else if(q.id.startsWith('variant-tm-')){
  const word=q.id.slice('variant-tm-'.length);
  steps=[`Gehe bei ${word} erst bis zum rechten Blank. Beginne den Übertrag dann beim letzten Bit.`,word.endsWith('0')?'Das letzte Bit ist 0. Die Übertragsregel kann es direkt auf 1 setzen und halten.':'Solange der Übertrag Einsen trifft, werden sie zu Nullen. Suche links die erste 0 oder das Blank; dort wird die neue 1 geschrieben.'];
 }else if(q.id.startsWith('variant-regex-list-')){
  steps=[`Untersuche den konkreten Ausdruck aus der Aufgabe nach Wortlängen: erst ε, dann 0 und 1, danach Länge 2 und 3.`,`Prüfliste: ${setLabel(['','0','1','00','01','10','11','000','001','010','011','100','101','110','111'])}. Nimm nur Wörter auf, die vollständig zum Ausdruck passen; * wiederholt den unmittelbar vorherigen Baustein.`];
 }else if(q.type==='regex'){
  steps=[firstSteps[q.id]||regexApproach(q.prompt),`Teste deinen Entwurf mit ε und den kürzesten passenden und unpassenden Wörtern. Ein freier Binärbereich (0|1)* erlaubt auch weitere Einsen und Nullen; bei exakten Anzahlen darf er diese nicht unbemerkt hinzufügen.`];
 }else if(q.id.startsWith('variant-clique-')||q.id.startsWith('variant-cover-')){
  steps=q.id.startsWith('variant-clique-')?['Verwende die Knoten und Kanten aus dieser Aufgabe. Bei einer Clique muss jedes Paar gewählter Knoten eine Kante besitzen.','Teste erst Dreiergruppen. Eine Dreierclique braucht alle drei möglichen Kanten; prüfe anschließend, ob eine größere Gruppe möglich ist. Gesucht ist die größte Anzahl, nicht nur eine nicht erweiterbare Gruppe.']:['Gehe jede angegebene Kante durch: Mindestens einer ihrer Endpunkte muss in deiner Auswahl liegen.','Teste Auswahlen nach Größe: erst die leere Menge, dann einzelne Knoten, dann Paare. Die erste Größe mit vollständiger Kantenabdeckung ist minimal.'];
 }else {
  // Existing explanations are authored for the individual conceptual question.
  // They are useful reasoning assistance; the selected option is only named in the solution stage.
  steps=[firstSteps[q.id]||q.explanation];
 }
 return [...steps.map((text,i)=>({title:i?'Nächster Rechenschritt':'Ansatz für diese Aufgabe',text})),{title:'Lösungsweg & Ergebnis',text:`${q.explanation}\nErgebnis: ${answerText(q)}`}];
}
function regexApproach(prompt){
 if(/genau drei Einsen/.test(prompt))return 'Platziere drei verpflichtende Einsen und fülle die Zwischenräume ausschließlich mit Nullen.';
 if(/höchstens zwei Einsen/.test(prompt))return 'Unterscheide die drei Fälle: keine Eins, genau eine Eins, genau zwei Einsen. Verbinde sie mit einer Vereinigung.';
 if(/ungerade/.test(prompt))return 'Beginne mit einer Pflicht-Eins. Weitere Einsen dürfen nur paarweise dazukommen; dazwischen sind beliebig viele Nullen erlaubt.';
 if(/Länge genau 4/.test(prompt))return 'Zeichne vier Positionen. Jede Position erlaubt genau ein Symbol, 0 oder 1. Verwende keinen Stern für die Länge.';
 if(/10-Blöcken/.test(prompt))return 'Setze den vollständigen Block 10 in Klammern, bevor du die Wiederholung hinzufügst. Null Blöcke müssen möglich sein.';
 if(/keine 0/.test(prompt))return 'Nach Ausschluss der 0 bleibt nur die 1 übrig. Auch das leere Wort erfüllt die Bedingung.';
 if(/ε oder/.test(prompt))return 'Baue eine Alternative für ε und eine für Wörter mit fester erster 1 und beliebigem Rest.';
 if(/Beginnt mit 0 und endet mit 1/.test(prompt))return 'Reserviere getrennte Positionen für die erste 0 und die letzte 1. Dazwischen darf eine beliebige Binärfolge stehen.';
 if(/Beginnt mit 01/.test(prompt))return 'Schreibe zuerst den Pflichtanfang 01, danach einen beliebigen Binärrest.';
 if(/Endet auf 10/.test(prompt))return 'Schreibe einen beliebigen Binäranfang und anschließend das feste Ende 10.';
 if(/mindestens eine 0/.test(prompt))return 'Platziere eine verpflichtende 0. Vor und nach ihr dürfen beliebige Binärwörter stehen.';
 return 'Platziere den verpflichtenden Block 11. Vor und nach diesem Block ist jede Binärfolge erlaubt.';
}

export function inputSymbols(q){
 if(q.type==='choice'||q.type==='number')return [];
 if(q.symbols)return q.symbols;
 if(q.type==='regex')return ['0','1','ε','∅','∪','(',')','*','+'];
 if(q.type==='set')return ['0','1',...(q.lesson==='cyk'?['S','A','B','C']:q.lesson==='nea'?['p','q','r']:['a','b']),'ε','∅','{','}',','];
 return ['0','1','a','b','ε'];
}
