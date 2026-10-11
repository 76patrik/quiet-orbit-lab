// Altklausur Theoretische Informatik mit Lösung: jede Aufgabe als eigener Lernpfad.
// Quelle: Altklausur_Loesung.pdf (10 PDF-Seiten). Aufgabentexte sinngemäß, Lösungswege eigenständig erklärt,
// alle Rechnungen mit den Modellen aus solution-models.js nachgeprüft (siehe tests/walkthroughs.test.js).
import {examMinDfa,examHashDfa,examCykGrammar,zeroEraserTm,examGraph,runTm,configLabel,wordPartition,wordsUpTo,product} from './solution-models.js';
import {minimize,cyk} from './algorithms.js';
import {dfaDiagram,tmDiagram,graphDiagram,cycleEdges} from './solution-diagrams.js';

const L=(id,label)=>[`#lesson/${id}`,label],T=(id,label)=>[`#topic/${id}`,label];

// ---------- Aufgabe 3: Graph ----------
const gLayout={width:600,height:520,r:22,pos:{a:[40,320],b:[165,195],c:[360,295],d:[485,105],e:[210,95],f:[555,395],g:[285,480]},bends:{'a>d':-190}};
const clique=['a','b','c','g'],cliqueEdges=[['a','b'],['a','c'],['a','g'],['b','c'],['b','g'],['c','g']];
const hamilton=['a','g','c','f','d','e','b'];
const vcCorrect=['a','b','c','d'];

// ---------- Aufgabe 4a: Minimierung ----------
const minLayout={width:560,height:380,pos:{q0:[70,80],q2:[280,80],q4:[490,80],q1:[70,270],q3:[280,270],q5:[490,270]},bends:{'q0>q3':14,'q3>q0':14,'q5>q1':-120},loops:{q2:'top'},offset:{'q5>q1':-14}};
const minResult=minimize(examMinDfa);
const words1=wordPartition(examMinDfa,wordsUpTo(['a','b'],1)),words2=wordPartition(examMinDfa,wordsUpTo(['a','b'],2));
const tonesBy=groups=>Object.fromEntries(groups.flatMap((g,i)=>g.map(s=>[s,['lime','purple','sky','peach'][i%4]])));
const minDfa={states:['Q0','Q3','Q4','Q5'],alphabet:['a','b'],start:'Q0',accept:['Q4'],transitions:{Q0:{a:'Q3',b:'Q0'},Q3:{a:'Q5',b:'Q0'},Q4:{a:'Q3',b:'Q0'},Q5:{a:'Q4',b:'Q4'}}};
const minDfaLayout={width:560,height:330,pos:{Q0:[80,80],Q4:[480,80],Q3:[260,250],Q5:[470,250]},loops:{Q0:'top'},bends:{'Q0>Q3':16,'Q3>Q0':16}};
const minLabels={Q0:'[q0,q2]',Q3:'[q3]',Q4:'[q1,q4]',Q5:'[q5]'};

// ---------- Aufgabe 4b ----------
const hashLayout={width:690,height:170,pos:{s:[50,110],qa:[160,110],qy:[270,110],qb:[380,110],qz:[490,110],qc:[610,110]},loops:{qa:'top',qb:'top',qc:'top'}};

// ---------- Aufgabe 5: Turingmaschine ----------
const tmLayout={width:640,height:470,pos:{q0:[100,120],q2:[320,120],q4:[540,120],q1:[100,360],q3:[320,360],q5:[540,360]},loops:{q0:'top',q2:'top',q4:'top',q3:'bottom'},bends:{'q5>q2':40}};
const tmRun=runTm(zeroEraserTm,'10100110');
const first8=tmRun.configs.slice(0,8);
const tmStep=(i,text,tip)=>{const from=tmRun.configs[i-1],to=tmRun.configs[i],read=from.cells[from.head],[write,move]=zeroEraserTm.delta[from.state][read];
 return {t:`Konfiguration ${i+1}: ${configLabel(to)}`,short:`K${i+1}`,x:[`In **${from.state}** steht der Kopf auf **${read}**. Regel: \`${read}|${write}|${move}\` → schreibe ${write}, gehe ${move==='R'?'nach rechts':move==='L'?'nach links':'nicht weiter'}, neuer Zustand **${to.state}**.`,text].filter(Boolean),
  v:{type:'group',items:[{type:'tape',configs:tmRun.configs,index:i,title:'Band'},tmDiagram(zeroEraserTm,tmLayout,{title:'Turingmaschine',highlight:{edges:[`${from.state}>${to.state}`],nodes:[to.state]}})]},tip};};

// ---------- Aufgabe 6: CYK ----------
const word6='bbaab',cyk6=cyk(examCykGrammar,word6).table;
const cyk6v=(shown,focus,parts)=>({type:'cyk',word:word6,table:cyk6,shown,focus,parts,title:'CYK für bbaab'});
const tree6={label:'S',children:[{label:'S',children:[{label:'Z',children:[{label:'2'},{label:'Z',children:[{label:'1'},{label:'Z',children:[{label:'1'}]}]}]}]},{label:'−'},{label:'S',children:[{label:'S',children:[{label:'Z',children:[{label:'4'},{label:'Z',children:[{label:'2'}]}]}]},{label:'+'},{label:'S',children:[{label:'S',children:[{label:'Z',children:[{label:'1'},{label:'Z',children:[{label:'0'}]}]}]},{label:'∗'},{label:'S',children:[{label:'Z',children:[{label:'4'}]}]}]}]}]};

const chomskyHead=['Typ','Grammatik / Regeln','Sprachklasse / Automat','Wortproblem','Beispiel'];
const chomskyRows=[
 ['0','keine Einschränkung','semi-entscheidbar · Turingmaschine','nicht entscheidbar','Halteproblem / universelle Sprache'],
 ['1 kontextsensitiv','l → r mit |l| ≤ |r| (Ausnahme S → ε, dann S nie rechts)','NTM mit linearem Platz (LBA)','entscheidbar; Folie/Lösung: NP-vollständig*','{aⁱbⁱcⁱ : i ∈ ℕ}'],
 ['2 kontextfrei','A → v, A Variable, v ∈ (V ∪ Σ)*','nichtdeterministischer Kellerautomat','polynomiell, CYK O(n³)','{aⁱbⁱ : i ∈ ℕ}'],
 ['3 regulär','A → ε oder A → aB (bzw. A → a)','DEA / NEA','linear','{aⁱ : i ∈ ℕ}']
];

export const examUnits=[
 {title:'Wissen und Einordnung',subtitle:'Kurzfragen, Chomsky-Hierarchie, NP',icon:'layers',tasks:[
 {id:'ak-1',n:'1',title:'Kurzfragen mit Begründung',points:'8 Punkte',topics:['Kleene','Abschluss','Kellerautomaten','NP','Rice'],source:'Altklausur_Loesung.pdf, PDF-Seite 1',
  prompt:['Acht Aussagen bzw. Fragen zu allen Kapiteln. Je 1 Punkt – **nur mit kurzer Begründung**. Ein „wahr“ ohne Grund bringt 0 Punkte.'],
  background:[
   {term:'Satz von Kleene',text:'Regulärer Ausdruck, NEA und DEA beschreiben genau dieselbe Sprachklasse: die regulären Sprachen.',link:L('kleene','Lektion Kleene')},
   {term:'Abschlusseigenschaften',text:['Regulär: abgeschlossen unter ∪, ∩, Komplement, ·, *.','Kontextfrei: ∪, ·, * ja – **∩ und Komplement nein**.'],link:L('complement','Komplementautomat')},
   {term:'Chomsky-Hierarchie',text:'Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0. Jede reguläre Sprache ist also auch kontextfrei.',link:L('hierarchy','Lektion Chomsky')},
   {term:'Satz von Rice',text:'Jede nichttriviale Eigenschaft der **berechneten Funktion** einer TM ist unentscheidbar.',link:T('decidable','Entscheidbarkeit & Rice')}],
  parts:[
   {label:'a)',q:'Was besagt der Satz von Kleene?',points:'1 Punkt',steps:[
    {t:'Die zwei Seiten benennen',x:['Kleene verbindet eine **Beschreibung** (regulärer Ausdruck) mit einer **Maschine** (endlicher Automat).']},
    {t:'„Genau“ ist das wichtige Wort',x:['Es gilt in beide Richtungen: Jede reguläre Sprache hat einen DEA, und jeder DEA erkennt eine reguläre Sprache.'],v:{type:'chain',joiner:'⇄',items:[['Regulärer Ausdruck'],['NEA'],['DEA']]}}],
    answer:{x:'Die regulären Sprachen sind **genau** die Sprachen, die von einem DEA (gleichwertig: NEA) akzeptiert werden.'}},
   {label:'b)',q:'Sei `L = {a·w·b : w ∈ {a,b}*}`. Dann ist `Lᶜ` kontextfrei.',points:'1 Punkt',steps:[
    {t:'Was ist L?',x:['Alle Wörter, die mit **a beginnen** und mit **b enden**. Regulärer Ausdruck: `a(a|b)*b`. Also ist L regulär.']},
    {t:'Komplement einer regulären Sprache',x:['Reguläre Sprachen sind unter Komplement abgeschlossen (Endzustände tauschen). Also ist Lᶜ regulär.']},
    {t:'Hierarchie nutzen',x:['Regulär ⊂ kontextfrei. Damit ist Lᶜ auch kontextfrei.'],tip:'Bei „ist … kontextfrei?“ zuerst prüfen, ob die Sprache sogar regulär ist – dann bist du sofort fertig.'}],
    answer:{x:'**Wahr.** L ist regulär (`a(a|b)*b`), das Komplement einer regulären Sprache ist regulär, und jede reguläre Sprache ist kontextfrei.'}},
   {label:'c)',q:'Deterministische und nichtdeterministische Kellerautomaten sind gleich mächtig.',points:'1 Punkt',steps:[
    {t:'Antwort festlegen',x:['**Falsch.** Anders als bei DEA/NEA gibt es hier einen echten Unterschied: DPDA erkennen eine echte Teilklasse der kontextfreien Sprachen.']},
    {t:'Passendes Gegenbeispiel wählen',x:['Klassiker: Palindrome gerader Länge `{w wᴿ : w ∈ {a,b}*}`. Ein NPDA **rät** die Wortmitte; ein deterministischer Automat weiß nie, wann er vom Ablegen zum Abbauen wechseln muss.'],v:{type:'tiles',items:[['NPDA','rät die Mitte: ab|ba ✓','lime'],['DPDA','muss sich sofort festlegen ✗','peach']]}}],
    answer:{x:'**Falsch.** NPDA sind mächtiger. Beispiel: `{w wᴿ}` ist kontextfrei, wird aber von keinem DPDA erkannt.'},
    warning:'Die Original-Lösung nennt als Grund „korrekte Klammerausdrücke“. Diese Sprache (Dyck-Sprache) **kann** ein deterministischer Kellerautomat erkennen: bei „(“ ablegen, bei „)“ abbauen, am Ende Keller leer. Das Urteil „falsch“ stimmt, die Begründung nicht – nimm in der Klausur die Palindrome.'},
   {label:'d)',q:'0-1-Integer-Programming ist komplexitätstheoretisch einfacher als SAT.',points:'1 Punkt',steps:[
    {t:'Beide Probleme einordnen',x:['SAT ist NP-vollständig (Cook). 0-1-IP ist in der Vorlesung ebenfalls NP-vollständig.']},
    {t:'Was heißt „gleich schwer“?',x:['NP-vollständige Probleme lassen sich in Polynomialzeit **gegenseitig** aufeinander reduzieren. Keines ist „einfacher“.'],tip:'Richtung merken: Für „X ist NP-schwer“ reduziert man ein **bekanntes** NP-schweres Problem **auf X**, also SAT ≤ₚ 0-1-IP.'}],
    answer:{x:'**Falsch.** Beide sind NP-vollständig und damit (bis auf Polynomialzeit-Reduktionen) gleich schwer.'}},
   {label:'e)',q:'Man kann entscheiden, ob eine beliebige (berechenbare) Funktion eine Nullstelle besitzt.',points:'1 Punkt',steps:[
    {t:'Ist das eine Eigenschaft der berechneten Funktion?',x:['Ja: „hat eine Nullstelle“ hängt nur davon ab, **was** die TM berechnet, nicht wie.']},
    {t:'Ist sie nichttrivial?',x:['Manche Funktionen haben eine Nullstelle (f(x)=x), andere nicht (f(x)=1). → Rice ist anwendbar.']}],
    answer:{x:'**Falsch.** Nach dem Satz von Rice ist jede nichttriviale semantische Eigenschaft unentscheidbar.'}},
   {label:'f)',q:'Man kann entscheiden, ob `f(x) = 2x²` eine Nullstelle besitzt.',points:'1 Punkt',steps:[
    {t:'Unterschied zu e) sehen',x:['Hier ist die Funktion **fest**. Rice spricht über alle Programme als Eingabe, nicht über eine einzelne Funktion.']},
    {t:'Direkt beantworten',x:['f(0)=0. Eine TM, die einfach „ja“ ausgibt, entscheidet die Frage. Alternativ: Nullstellen quadratischer Funktionen sind mit der Mitternachtsformel berechenbar.']}],
    answer:{x:'**Ja (wahr).** Die Frage betrifft eine konkrete Funktion; x=0 ist Nullstelle, eine TM kann das berechnen bzw. konstant „ja“ ausgeben.'}},
   {label:'g)',q:'Die Sprache der korrekten Klammerausdrücke ist regulär.',points:'1 Punkt',steps:[
    {t:'Was müsste ein DEA können?',x:['Er müsste sich die Anzahl offener Klammern merken – beliebig viele. Ein DEA hat aber nur endlich viele Zustände.']},
    {t:'Begründung formulieren',x:['Formal: Pumping-Lemma mit `(ⁿ )ⁿ`. Aufpumpen im vorderen Teil erzeugt mehr „(“ als „)“.'],tip:'Merksatz der Vorlesung: „DEAs können nicht zählen.“ In der Klausur kurz mit Pumping-Lemma untermauern.'}],
    answer:{x:'**Falsch.** Endliche Automaten können die unbeschränkte Klammertiefe nicht zählen (Pumping-Lemma mit `(ⁿ)ⁿ`). Die Sprache ist kontextfrei, nicht regulär.'}},
   {label:'h)',q:'`L₁ = {00, 01, 10, 11}`, `L₂ = {0, 1}`. Gib `L₁ · L₂` explizit an.',points:'1 Punkt',steps:[
    {t:'Jedes Wort links mit jedem rechts verketten',x:['4 Wörter · 2 Wörter = höchstens 8 Ergebnisse. Reihenfolge: erst Wort aus L₁, dann aus L₂.'],v:{type:'table',caption:'Verkettungstabelle',head:['L₁ \\ L₂','0','1'],rows:[['00','000','001'],['01','010','011'],['10','100','101'],['11','110','111']]}},
    {t:'Doppelte entfernen',x:['Alle 8 sind verschieden – es sind genau alle Binärwörter der Länge 3.']}],
    answer:{x:`L = {${product(['00','01','10','11'],['0','1']).join(', ')}}`}}
  ],
  tips:['Immer zuerst **wahr/falsch** hinschreiben, dann **einen** passenden Satz Begründung (Satzname + Kernidee).','Typische Begründungsbausteine: „laut Kleene“, „abgeschlossen unter …“, „Chomsky: Typ 3 ⊂ Typ 2“, „Rice“, „Pumping-Lemma“, „beide NP-vollständig“.','Bei Fragen zu **einer festen** Funktion/Instanz greift Rice nicht – das ist eine beliebte Falle (e vs. f).']},

 {id:'ak-2',n:'2',title:'Chomsky-Hierarchie',points:'10 Punkte',topics:['Chomsky-Hierarchie','Grammatiken','Automatenmodelle'],source:'Altklausur_Loesung.pdf, PDF-Seite 2',
  prompt:['a) Erkläre, was die Chomsky-Hierarchie ist. b) Vervollständige die Tabelle mit Typ, Regeltypen, Sprachklasse/Automat, Komplexität des Wortproblems und einem Beispiel. In der Lösung gibt es **0,5 Punkte pro Feld**.'],
  background:[
   {term:'Grammatik',text:'Γ = (Σ, V, S, R): Terminale, Variablen, Startsymbol, Regeln. Je strenger die Regelform, desto kleiner die Sprachklasse.',link:L('grammar','Grammatiken')},
   {term:'Wortproblem',text:'Frage: „Liegt w in L(G)?“ Wie schwer das ist, hängt vom Typ ab.'},
   {term:'Echte Hierarchie',text:'Jede Stufe enthält Sprachen, die die nächst kleinere nicht hat: aⁱbⁱ ist kontextfrei, aber nicht regulär; aⁱbⁱcⁱ ist kontextsensitiv, aber nicht kontextfrei.',link:L('hierarchy','Lektion Chomsky-Hierarchie')}],
  parts:[
   {label:'a)',q:'Erläutere, worum es sich bei der Chomsky-Hierarchie handelt.',points:'2 Punkte',steps:[
    {t:'Was wird geordnet?',x:['**Formale Sprachen** bzw. Grammatiken – nach der Form ihrer Regeln.']},
    {t:'Wie ist die Ordnung?',x:['Strengere Regeln → weniger ausdrucksstark. Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0.'],v:{type:'chain',joiner:'⊂',items:[['Typ 3','regulär'],['Typ 2','kontextfrei'],['Typ 1','kontextsensitiv'],['Typ 0','rekursiv aufzählbar']]}},
    {t:'Das Wort „echt“ nicht vergessen',x:['Die Inklusionen sind **echt**: Jede höhere Stufe kann wirklich mehr.']}],
    answer:{x:'Die Chomsky-Hierarchie ordnet formale Sprachen (1) nach den Einschränkungen ihrer Grammatikregeln: je strenger die Regeln, desto weniger mächtig die Sprachklasse (1). Die Hierarchie ist echt: Typ 3 ⊊ Typ 2 ⊊ Typ 1 ⊊ Typ 0.'},
    grading:'Lösung vergibt je 1 Punkt für „Hierarchie formaler Sprachen“, „Einschränkung/Mächtigkeit“ und „echt“ (max. 2).'},
   {label:'b)',q:'Vervollständige die Tabelle der Chomsky-Hierarchie.',points:'8 Punkte',steps:[
    {t:'Zeile für Zeile von unten aufbauen',x:['Starte mit dem, was du am besten kennst: **Typ 3** – DEA, lineare Zeit, `aⁱ`.'],v:{type:'table',caption:'Typ 3 zuerst',head:chomskyHead,rows:[chomskyRows[3]],highlight:[[0,1],[0,2],[0,3],[0,4]]}},
    {t:'Typ 2: Kellerautomat und CYK',x:['Eine Variable links, beliebiges Wort rechts. Automat: **nichtdeterministischer** Kellerautomat. Wortproblem: mit CYK in Polynomialzeit (O(n³)).'],v:{type:'table',caption:'Typ 2 dazu',head:chomskyHead,rows:[chomskyRows[2],chomskyRows[3]],highlight:[[0,1],[0,2],[0,3],[0,4]]}},
    {t:'Typ 1: nicht schrumpfende Regeln',x:['Linke Seite darf Kontext enthalten, aber `|l| ≤ |r|`. Automat: NTM mit linear beschränktem Platz. Beispiel `aⁱbⁱcⁱ`.'],v:{type:'table',caption:'Typ 1 dazu',head:chomskyHead,rows:chomskyRows.slice(1),highlight:[[0,1],[0,2],[0,3],[0,4]]}},
    {t:'Typ 0: keine Einschränkung',x:['Turingmaschinen, semi-entscheidbar. Das Wortproblem ist **nicht entscheidbar**.'],v:{type:'table',caption:'Vollständige Tabelle',head:chomskyHead,rows:chomskyRows,highlight:[[0,1],[0,2],[0,3],[0,4]]}}],
    answer:{x:['Die vollständige Tabelle siehe unten. * Zum Wortproblem bei Typ 1 siehe Hinweis.'],v:{type:'table',caption:'Chomsky-Hierarchie',head:chomskyHead,rows:chomskyRows}},
    grading:'0,5 Punkte pro korrekt ausgefülltem Feld (16 Felder = 8 Punkte).',
    warning:'Die Musterlösung (wie Folie 42 der Einführung) trägt beim Typ-1-Wortproblem „NP-vollständig“ ein. Fachlich ist das **allgemeine** Wortproblem kontextsensitiver Grammatiken **PSPACE-vollständig** (Aarts, Einleitung). Was in der Klausur erwartet wird, bitte mit der Lehrperson klären – sicher richtig ist „entscheidbar, aber exponentiell aufwendig“.'}
  ],
  tips:['Lerne die Tabelle als **4×5-Raster** und schreibe sie einmal pro Woche leer aus dem Kopf.','Eselsbrücke Automaten: **3 → DEA, 2 → Keller, 1 → linear beschränkte TM, 0 → TM**.','Beispiele merken als Treppe: `aⁱ`, `aⁱbⁱ`, `aⁱbⁱcⁱ`, Halteproblem – jedes ist das „Trennbeispiel“ zur Stufe darunter.']},

 {id:'ak-3',n:'3',title:'NP-vollständige Probleme',points:'7 Punkte',topics:['NP','Clique','Vertex Cover','Hamilton-Kreis'],source:'Altklausur_Loesung.pdf, PDF-Seiten 3–4',
  prompt:['a) Erkläre die Klasse NP. b) Beschreibe Clique, Vertex Cover und Hamilton-Kreis und gib im Graphen eine maximale Clique, ein minimales Vertex Cover und einen Hamilton-Kreis an. c) In welcher Klasse liegt das Hamilton-Kreis-Problem auf **vollständigen** Graphen?'],
  given:graphDiagram(examGraph,gLayout,{title:'Graph der Aufgabe 3',caption:'7 Knoten, 12 Kanten. Die Kante a–d ist als Bogen gezeichnet.'}),
  background:[
   {term:'NP',text:'Entscheidungsprobleme, die eine **nichtdeterministische** TM in **polynomieller Zeit** löst. Gleichwertig: Eine geratene Lösung (Zertifikat) lässt sich in Polynomialzeit prüfen.',link:T('np','P, NP & Graphprobleme')},
   {term:'Clique',text:'Knotenmenge, in der **jedes Paar** durch eine Kante verbunden ist.'},
   {term:'Vertex Cover (Knotenüberdeckung)',text:'Knotenmenge, sodass **jede Kante** mindestens einen Endpunkt in der Menge hat.'},
   {term:'Hamilton-Kreis',text:'Kreis, der **jeden Knoten genau einmal** besucht und zum Start zurückkehrt.'}],
  parts:[
   {label:'a)',q:'Erkläre, was die Problemklasse NP ist.',points:'1 Punkt',steps:[
    {t:'Zwei Schlüsselbegriffe',x:['Die Punkte gibt es für **nichtdeterministische TM** (0,5) und **polynomielle Zeit** (0,5).']},
    {t:'Anschaulich',x:['„Lösung raten, schnell prüfen“: Für eine Clique der Größe k kann man eine Knotenmenge raten und in O(k²) alle Kanten prüfen.']}],
    answer:{x:'NP enthält alle Entscheidungsprobleme, die von einer nichtdeterministischen Turingmaschine in polynomieller Zeit entschieden werden können.'}},
   {label:'b)',q:'Beschreibe die drei Probleme und gib je eine Lösung im Graphen an.',points:'4,5 Punkte',steps:[
    {t:'Maximale Clique suchen',x:['Suche Knoten mit hohem Grad, die „Dreiecke“ bilden: a, b, c, g. Prüfe alle 6 Paare: a–b, a–c, a–g, b–c, b–g, c–g sind Kanten. ✓','Eine 5er-Clique gibt es nicht: d, e, f fehlen jeweils Kanten zu mindestens einem dieser Knoten.'],v:graphDiagram(examGraph,gLayout,{highlightNodes:clique,highlightEdges:cliqueEdges,dim:true,title:'Clique {a, b, c, g}'}),tip:'Clique-Check: Für k Knoten müssen k(k−1)/2 Kanten da sein – bei 4 Knoten also 6.'},
    {t:'Minimales Vertex Cover',x:['Jede Kante braucht einen markierten Endpunkt. Die Clique {a,b,c,g} zwingt schon **3** Knoten daraus (sonst bleibt eine Clique-Kante frei). Die Kanten e–d, d–f und c–f bzw. d–a brauchen zusätzlich d.','Ergebnis: `{a, b, c, d}` (oder `{b, c, d, g}`), Größe 4. Kleiner geht es nicht.'],v:graphDiagram(examGraph,gLayout,{highlightNodes:vcCorrect,highlightEdges:[],title:'Vertex Cover {a, b, c, d}',caption:'Jede der 12 Kanten berührt mindestens einen markierten Knoten.'})},
    {t:'Hamilton-Kreis',x:['Starte bei einem Knoten mit kleinem Grad – f hat nur c und d als Nachbarn, also muss der Kreis **c–f–d** enthalten. Ebenso e: **b–e–d**.','Damit: … c – f – d – e – b … und schließen über a und g: `a → g → c → f → d → e → b → a`.'],v:graphDiagram(examGraph,gLayout,{highlightNodes:hamilton,highlightEdges:cycleEdges(hamilton),title:'Hamilton-Kreis a, g, c, f, d, e, b'}),tip:'Knoten vom Grad 2 legen beide Kanten fest – damit anfangen spart Zeit.'}],
    answer:{x:['**Clique:** Knotenmenge, die paarweise verbunden ist; maximal: {a, b, c, g}.','**Vertex Cover:** Knotenmenge, die jede Kante berührt; minimal (Größe 4): {a, b, c, d}.','**Hamilton-Kreis:** besucht jeden Knoten genau einmal: a, g, c, f, d, e, b, a.']},
    grading:'Je 1 Punkt Beschreibung + 0,5 Punkte korrekte Lösung im Graphen.',
    warning:['Die Original-Lösung definiert Vertex Cover als „jeder Knoten außerhalb ist mit einem Knoten der Menge verbunden“ und gibt {b, d} an. Das ist die Definition einer **dominierenden Menge** – {b, d} ist tatsächlich eine. Als Vertex Cover ist {b, d} falsch: z. B. die Kante a–c berührt weder b noch d.','Außerdem sind in der Lösung die Farben vertauscht: Im Bild ist die Clique rot und der Hamilton-Kreis blau, im Text umgekehrt.','Klausurtipp: Standarddefinition (jede Kante abgedeckt) schreiben. Falls die Vorlesung die andere Definition verwendet, beim Dozenten nachfragen.']},
   {label:'c)',q:'In welcher Klasse liegt das Hamilton-Kreis-Problem für vollständige Graphen?',points:'1,5 Punkte',steps:[
    {t:'Was ist besonders?',x:['Im vollständigen Graphen ist **jedes** Knotenpaar verbunden. Man muss also nichts suchen.']},
    {t:'Algorithmus angeben',x:['Gib die Knoten in beliebiger Reihenfolge aus: `v₁, v₂, …, vₙ, v₁`. Jede Kante existiert. Das geht in linearer Zeit (für n ≥ 3).'],v:{type:'chain',items:[['v₁'],['v₂'],['…'],['vₙ'],['v₁','zurück']]}}],
    answer:{x:'Das Problem liegt in **P** (0,5): Für n ≥ 3 ist `v₁, …, vₙ, v₁` immer ein Hamilton-Kreis, eine deterministische TM gibt ihn in Linearzeit aus (1).'}}
  ],
  tips:['NP-vollständig heißt **nicht** „jede Instanz ist schwer“. Spezialfälle (vollständiger Graph, Baum, …) können in P liegen.','Beim Graphen immer **mit Häkchen** auf dem Schmierblatt jede Kante abhaken – so überprüfst du Clique und Vertex Cover sicher.','Zusammenhang merken: `C` ist Clique in G ⇔ `V∖C` ist Vertex Cover im Komplementgraphen.']}
 ]},
 {title:'Automaten rechnen',subtitle:'Minimierung, Konstruktion, Turingmaschine',icon:'nodes',tasks:[
 {id:'ak-4',n:'4',title:'Reguläre Sprachen',points:'15 Punkte',topics:['Minimierung','DEA','Grammatik','RegEx'],source:'Altklausur_Loesung.pdf, PDF-Seiten 5–6',
  prompt:['a) Minimiere den DEA `𝒜 = (Q={q0,…,q5}, Σ={a,b}, s=q0, F={q1,q4}, δ)` nachvollziehbar und gib δ des minimierten Automaten an. Hinweis: Wörter der Länge 3 müssen nicht geprüft werden.','b) Zeige, dass die Sprache „mindestens ein a, dann #, mindestens ein b, dann #, mindestens ein c“ regulär ist – mit DEA, regulärer Grammatik und regulärem Ausdruck.','c) Hashtag-Parser: Wie prüft man, ob ein Wort ein Hashtag ist, mit welcher Komplexität – und geht das auch, wenn man das # entfernen will?'],
  given:dfaDiagram(examMinDfa,minLayout,{title:'DEA aus Aufgabe 4a'}),
  givenNote:'Übergänge als Tabelle: q0: a→q3, b→q2 · q1: a→q3, b→q0 · q2: a→q3, b→q2 · q3: a→q5, b→q0 · q4: a→q3, b→q2 · q5: a→q1, b→q4.',
  background:[
   {term:'Äquivalente Zustände',text:'p und q sind gleichwertig, wenn **jedes** Wort w von p und q aus entweder beide Male in F oder beide Male außerhalb endet.',link:L('minimize','Lektion Minimierung')},
   {term:'Wortmethode',text:'Starte mit {F, Q∖F} (Wort ε). Teste dann Wörter steigender Länge: a, b, aa, ab, … Trennt ein Wort zwei Zustände, kommen sie in verschiedene Blöcke.'},
   {term:'Drei Darstellungen regulärer Sprachen',text:'DEA, reguläre Grammatik (A → aB, A → a), regulärer Ausdruck. Kleene: alle gleich mächtig.',link:L('regular-grammar','Grammatik, RegEx und Automat')}],
  parts:[
   {label:'a)',q:'Minimiere den Automaten und gib die Übergangsfunktion an.',points:'6 Punkte',steps:[
    {t:'Erreichbarkeit prüfen',x:['Von q0 erreicht man q3, q2; von q3 dann q5; von q5 dann q1 und q4. **Alle 6 Zustände sind erreichbar** – nichts wird gestrichen.'],tip:'Unerreichbare Zustände zuerst streichen. Das kostet 10 Sekunden und verhindert falsche Klassen.'},
    {t:'Wort ε: Endzustände trennen',x:['ε trennt F = {q1, q4} von allen anderen.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:[['q0','q2','q3','q5'],['q1','q4']]}],current:0},dfaDiagram(examMinDfa,minLayout,{tones:tonesBy([['q0','q2','q3','q5'],['q1','q4']]),title:'Zwei Blöcke nach ε'})]}},
    {t:'Wort a: q5 fällt heraus',x:['Lies von jedem Zustand **a** und schau, ob du in F landest:','q0→q3, q2→q3, q3→q5 (alle **nicht** in F) – aber **q5 →a q1 ∈ F**. Also trennt a den Zustand q5 ab.','In F: q1→q3, q4→q3 – beide gleich, bleiben zusammen.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:[['q0','q2','q3','q5'],['q1','q4']]},{label:'a',groups:words1,changed:[2]}],current:1},dfaDiagram(examMinDfa,minLayout,{tones:tonesBy(words1),highlight:{edges:['q5>q1'],nodes:['q5']},title:'a trennt q5'})]}},
    {t:'Wort b: nichts Neues',x:['q0→q2, q2→q2, q3→q0, q5→q4 ∈ F. q5 ist schon allein. Für {q0, q2, q3} landet b überall außerhalb von F → **keine neue Trennung**.']},
    {t:'Wort aa: q3 fällt heraus',x:['q3 →a q5 →a q1 ∈ F, aber q0 →a q3 →a q5 ∉ F und q2 →a q3 →a q5 ∉ F. **aa trennt q3** von q0 und q2.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:[['q0','q2','q3','q5'],['q1','q4']]},{label:'a',groups:words1},{label:'aa',groups:words2,changed:[2]}],current:2},dfaDiagram(examMinDfa,minLayout,{tones:tonesBy(words2),highlight:{edges:['q3>q5','q5>q1'],nodes:['q3']},title:'aa trennt q3'})]}},
    {t:'ab, ba, bb: stabil – fertig',x:['Die restlichen Wörter der Länge 2 trennen nichts mehr. Laut Hinweis brauchst du Länge 3 nicht. Kontrolle: q0 und q2 haben **dieselben** Nachfolgerblöcke (a→[q3], b→[q0,q2]), ebenso q1 und q4 (a→[q3], b→[q0,q2]).'],v:{type:'partition',rounds:[{label:'ε',groups:[['q0','q2','q3','q5'],['q1','q4']]},{label:'a, b',groups:words1},{label:'aa, ab, ba, bb',groups:words2}],current:2},tip:'Gegenprobe ohne Wörter: Für jeden Block prüfen, ob alle Zustände mit a und mit b in **denselben Block** gehen. Wenn ja: stabil.'},
    {t:'Minimalautomat zeichnen',x:['Blöcke werden Zustände: [q0,q2], [q3], [q5], [q1,q4]. Start = Block von q0, Endzustand = Block mit F.','Übergänge von einem Vertreter ablesen, z. B. [q5] mit a: q5→q1 ∈ [q1,q4].'],v:dfaDiagram(minDfa,minDfaLayout,{labels:minLabels,title:'Minimalautomat',r:36})}],
    answer:{x:['Äquivalenzklassen: **[q0] = {q0, q2}**, **[q3] = {q3}**, **[q5] = {q5}**, **[q4] = {q1, q4}**.','𝒜min: Q = {[q0], [q3], [q4], [q5]}, s = [q0], F = {[q4]}.','δ: [q0]: a→[q3], b→[q0] · [q3]: a→[q5], b→[q0] · [q5]: a→[q4], b→[q4] · [q4]: a→[q3], b→[q0].'],v:{type:'table',caption:'δ des Minimalautomaten',head:['Zustand','a','b'],rows:[['→ [q0] = {q0,q2}','[q3]','[q0]'],['[q3]','[q5]','[q0]'],['[q5]','[q4]','[q4]'],['* [q4] = {q1,q4}','[q3]','[q0]']]}},
    grading:'Je 0,5 Punkte pro Zeile (Start, ε, a, b, aa, ab, ba, bb) = 4, dazu 2 Punkte für den Minimalautomaten.',
    rounds:minResult.rounds},
   {label:'b)',q:'Zeige, dass `{aⁱ # bʲ # cᵏ : i, j, k ≥ 1}` regulär ist (DEA, Grammatik, RegEx).',points:'6 Punkte',steps:[
    {t:'Regulärer Ausdruck zuerst',x:['„mindestens eins“ = Plus. Dazwischen die festen Trennzeichen: `a⁺ # b⁺ # c⁺` (gleich `aa*#bb*#cc*`).'],tip:'Mit dem RegEx ist die Regularität eigentlich schon gezeigt – die anderen Darstellungen fragt die Aufgabe trotzdem ab.'},
    {t:'DEA: ein Zustand pro Abschnitt',x:['s → (a) → qa, qa hat eine a-Schleife. # führt nach qy („warte auf erstes b“), b nach qb mit b-Schleife, # nach qz, c nach qc mit c-Schleife. Nur qc ist Endzustand.','Alle fehlenden Übergänge gehen in einen Fangzustand (nicht gezeichnet).'],v:dfaDiagram(examHashDfa,hashLayout,{title:'DEA für a⁺#b⁺#c⁺'})},
    {t:'Grammatik direkt aus dem DEA',x:['Jeder Zustand wird Variable, jeder Übergang `p →x q` wird Regel `P → xQ`. Endzustand: zusätzlich `C → c` (oder C → ε).'],v:{type:'table',caption:'Reguläre Grammatik',head:['Variable','Regeln','Bedeutung'],rows:[['S','S → aA','erstes a'],['A','A → aA | #Y','weitere a oder erstes #'],['Y','Y → bB','erstes b'],['B','B → bB | #Z','weitere b oder zweites #'],['Z','Z → cC','erstes c'],['C','C → cC | c','weitere c, Ende']]}}],
    answer:{x:['**RegEx:** `a⁺ · # · b⁺ · # · c⁺`','**Grammatik:** Γ = ({a,b,c,#}, {S,A,Y,B,Z,C}, S, R) mit S → aA, A → aA | #Y, Y → bB, B → bB | #Z, Z → cC, C → cC | c.','**DEA:** Q = {s, qa, qy, qb, qz, qc} (+ Fangzustand), F = {qc}, Übergänge wie im Bild.']},
    grading:'Je 2 Punkte für RegEx, Grammatik und DEA.',
    warning:'In der Original-Lösung steht `A → a | #Y`. Damit wäre nach dem ersten a nur noch **ein** weiteres a möglich – und das Wort würde ohne # enden. Richtig ist `A → aA | #Y` (passend zur a-Schleife in qa).'},
   {label:'c)',q:'Hashtag-Prüfung: Verfahren, Komplexität, und klappt das auch beim Entfernen des #?',points:'3 Punkte',steps:[
    {t:'Sprache erkennen',x:['Hashtag = `#` gefolgt von mindestens einem Zeichen aus {a–z, A–Z, 0–9}: `# · (a|…|z|A|…|Z|0|…|9)⁺`. Das ist ein regulärer Ausdruck → **die Sprache ist regulär** (0,5).']},
    {t:'Kleene anwenden',x:['Nach dem **Satz von Kleene** (1) gibt es einen DEA dafür. Ein DEA liest jedes Zeichen genau einmal → Wortproblem in **Linearzeit** O(n) (0,5).'],v:{type:'chain',items:[['start'],['nach #','# gelesen'],['ok','≥1 Zeichen ✓',true]]}},
    {t:'Ausgabe verändern?',x:['Ein DEA antwortet nur „ja/nein“ und **kann das Band nicht verändern** (1). Zum Entfernen des # braucht man ein Modell mit Ausgabe, z. B. eine Turingmaschine.']}],
    answer:{x:'Die Hashtag-Sprache ist regulär (`#·(a…z|A…Z|0…9)⁺`), also gibt es nach Kleene einen DEA, der das Wortproblem in Linearzeit löst. Zum Entfernen des # reicht ein DEA nicht, da er die Eingabe nicht verändern kann – man braucht z. B. eine Turingmaschine.'}}
  ],
  tips:['Minimierung: Schreibe für jedes Testwort eine **eigene Zeile** mit der kompletten Partition – genau dafür gibt es die Teilpunkte.','Beim Minimalautomaten immer Start (Block mit q0) und Endzustände (Blöcke aus F) markieren.','DEA → Grammatik ist mechanisch: `p →x q` ⇒ `P → xQ`; Endzustand ⇒ `P → ε` oder letzte Regel `P → x`.']},

 {id:'ak-5',n:'5',title:'Turingmaschinen',points:'10 Punkte',topics:['Turingmaschine','Konfiguration','NTM vs. DTM'],source:'Altklausur_Loesung.pdf, PDF-Seiten 7–8',
  prompt:['Gegeben ist eine deterministische TM mit Zuständen q0 (Start), q1 (Endzustand), q2–q5 über Σ = {0,1} und Blank ⊔. Eine Kante `x|y|R` heißt: lies x, schreibe y, gehe nach rechts (L = links, N = stehen bleiben).','a) Gib die ersten 8 Konfigurationen für das Wort `10100110` an. b) Beschreibe, was die TM tut, und annotiere die Zustände. c) Was unterscheidet deterministische und nichtdeterministische TM?'],
  given:tmDiagram(zeroEraserTm,tmLayout,{title:'Turingmaschine aus Aufgabe 5'}),
  background:[
   {term:'Konfiguration',text:'Schnappschuss der TM: Bandinhalt mit Zustand **direkt vor dem Feld unter dem Kopf**. `1(q0)0100110` heißt: Kopf liest die 0 an Position 2, Zustand q0.',link:T('tm','Turingmaschinen & Konfigurationen')},
   {term:'Übergang',text:'δ(q, gelesen) = (q′, geschrieben, Richtung). Pro Schritt genau eine Regel.'},
   {term:'Nichtdeterminismus',text:'Mehrere mögliche Folgezustände; akzeptiert, wenn **ein** Lauf akzeptiert.'}],
  parts:[
   {label:'a)',q:'Die ersten 8 Konfigurationen für `10100110`.',points:'2 Punkte (je 0,25)',steps:[
    {t:'Konfiguration 1: Start',short:'K1',x:['Kopf auf dem ersten Zeichen, Zustand q0: `(q0)10100110`.'],v:{type:'group',items:[{type:'tape',configs:tmRun.configs,index:0},tmDiagram(zeroEraserTm,tmLayout,{highlight:{nodes:['q0']},title:'Start in q0'})]}},
    tmStep(1,'q0 überspringt führende 1en.'),
    tmStep(2,'Erste 0 gefunden: weiter in q2.'),
    tmStep(3,'Die 1 hinter der 0-Lücke wird **gelöscht** (durch 0 ersetzt). Jetzt läuft q4 zurück.','Merke dir, **wo** eine 1 verschwunden ist – sie wird gleich weiter links wieder auftauchen.'),
    tmStep(4,'q4 läuft über 0en nach links.'),
    tmStep(5,'Eine 1 gefunden: einen Schritt zurück nach rechts → q5 steht auf der **ersten 0 der Lücke**.'),
    tmStep(6,'Die erste 0 wird zur 1: Die 1 ist also nach links **aufgerückt**.'),
    tmStep(7,'Achte Konfiguration erreicht – hier kannst du aufhören.')],
    answer:{x:['Die 8 Konfigurationen:'],v:{type:'configs',configs:first8}},
    grading:'0,25 Punkte pro korrekter Konfiguration.'},
   {label:'b)',q:'Beschreibe, was die TM tut, und annotiere die Zustände.',points:'5 Punkte',steps:[
    {t:'Ganzen Lauf ansehen',x:[`Simuliert man bis zum Ende (${tmRun.configs.length} Konfigurationen), steht am Schluss **${tmRun.configs.at(-1).cells.filter(c=>c==='1').join('')}** auf dem Band: alle vier 1en, keine 0 mehr.`],v:{type:'group',items:[{type:'tape',configs:tmRun.configs,index:tmRun.configs.length-1,title:'Endband'},{type:'configs',configs:tmRun.configs,numbered:true}]}},
    {t:'q0 und q2 deuten',x:['**q0**: überspringt die 1en am Anfang (sie stehen schon richtig). Bei Blank: fertig → q1.','**q2**: läuft über 0en. Findet es eine 1, wird sie mit 0 überschrieben und es geht zurück (q4). Bei Blank: Ende erreicht → q3.']},
    {t:'Schleife q4 / q5 deuten',x:['**q4** läuft nach links bis zur letzten 1 (oder zum Bandanfang), **q5** steht dann auf der ersten 0 und macht daraus eine 1. → Jede 1 rutscht in die erste Lücke. So landen alle 1en links, alle 0en rechts.']},
    {t:'q3 deuten',x:['**q3** läuft von rechts nach links und **löscht alle 0en** (schreibt ⊔), bis eine 1 kommt → q1, akzeptieren.']}],
    answer:{x:['Die TM **löscht alle 0en** und schreibt die **1en lückenlos** hintereinander (aus `10100110` wird `1111`).','q0: überspringe führende 1en · q2: suche nach der Lücke die nächste 1, ersetze sie durch 0 · q4/q5: gehe zur ersten 0 und ersetze sie durch 1 (1 rückt auf) · q3: lösche die übrigen 0en am Ende · q1: Endzustand.']},
    grading:'0,5 + 0,5 für die Gesamtbeschreibung, je 1 Punkt für q0, q2 und die q4/q5-Schleife, 1 Punkt für q3.'},
   {label:'c)',q:'Was unterscheidet deterministische und nichtdeterministische TM?',points:'3 Punkte',steps:[
    {t:'Definition',x:['Eine NTM darf in einer Situation **mehrere** Übergänge haben. Modell der Vorlesung: eine DTM mit **Orakel**, das vorab ein Wort (den „Rateweg“) aufs Band schreibt.']},
    {t:'Effizienz',x:['Vermutung: NTM sind **schneller** (P ≠ NP ist offen).']},
    {t:'Mächtigkeit',x:['NTM sind **nicht mächtiger**: Eine DTM kann alle Orakelwörter nacheinander ausprobieren (Breitensuche) – nur dauert das exponentiell lange.']}],
    answer:{x:'Eine NTM ist eine DTM mit Orakel, das vor der Rechnung ein Wort aufs Band schreibt (1). Man vermutet, dass NTM effizienter sind (1). Mächtiger sind sie nicht, denn eine DTM kann eine NTM simulieren, indem sie alle möglichen Orakelwörter ausprobiert (1).'},
    warning:'In der Original-Lösung steht hier „NEA“ und „DEA“. Gemeint sind **NTM** und **DTM**. (Bei endlichen Automaten ist ein NEA übrigens auch nicht effizienter in der Laufzeit – nur ggf. kleiner.)'}
  ],
  tips:['Konfigurationen **immer mit Zustand vor dem gelesenen Zeichen** schreiben und nach jedem Schritt kurz prüfen: Wurde das Zeichen unter dem Kopf ersetzt?','Steht der Kopf links neben dem Wort, schreibe das Blank mit: `(q4)⊔00101`.','Für b): Lass die TM an einem **kurzen** Wort wie `0101` komplett laufen – das Muster erkennst du schneller als bei 8 Zeichen.']}
 ]},
 {title:'Kontextfreie Sprachen',subtitle:'CYK und Syntaxbäume',icon:'code',tasks:[
 {id:'ak-6',n:'6',title:'Kontextfreie Sprachen',points:'10 Punkte',topics:['CYK','Ableitung','Syntaxbaum'],source:'Altklausur_Loesung.pdf, PDF-Seiten 9–10',
  prompt:['Γ₁: `S → S+S | S−S | S∗S | Z` und `Z → 0 | 1 | … | 9 | 0Z | 1Z | … | 9Z`.','Γ₂ über {a,b}: `S → AT | UB | TU`, `T → TA | b`, `U → TU | BT`, `A → a`, `B → b`.','a) Entscheide mit CYK, ob `bbaab ∈ L(Γ₂)`, und gib ggf. eine Ableitung an. b) Gib einen Syntaxbaum für `211 − 42 + 10 ∗ 4` (Γ₁) an.'],
  background:[
   {term:'Chomsky-Normalform',text:'Jede Regel hat die Form `A → BC` oder `A → a`. Γ₂ ist bereits in CNF.',link:T('cnf','Grammatiken, CNF & Syntaxbäume')},
   {term:'CYK-Idee',text:'V(i,j) = alle Variablen, die das Teilwort von Position i bis j erzeugen. Für Länge ≥ 2 jede Teilung in linkes + rechtes Stück testen: Gibt es `A → BC` mit B links, C rechts?',link:T('cyk','CYK & Ableitungen')},
   {term:'Syntaxbaum',text:'Wurzel S, innere Knoten = Variablen, Blätter = Terminale. Von links nach rechts gelesen ergeben die Blätter das Wort.'}],
  parts:[
   {label:'a)',q:'Liegt `bbaab` in L(Γ₂)? (CYK + Ableitung)',points:'7 Punkte',steps:[
    {t:'Zeile 1: einzelne Zeichen',x:['Welche Variable erzeugt direkt das Zeichen? b: `T → b`, `B → b` → {T, B}. a: `A → a` → {A}.'],v:cyk6v(5)},
    {t:'Zeile 2: Paare',x:['bb = {T,B}·{T,B}: `U → BT` passt → **U**. · ba = {T,B}·{A}: `T → TA` → **T**. · aa = {A}·{A}: keine Regel → **∅**. · ab = {A}·{T,B}: `S → AT` → **S**.'],v:cyk6v(9,[2,3],[[1,3],[1,4]]),tip:'Schreib dir alle rechten Seiten als Liste auf: AT, UB, TU, TA, BT. Dann nur noch „passt das Paar?“ nachsehen.'},
    {t:'Zeile 3: drei Zeichen',x:['bba: b|ba = {T,B}·{T} → `U → BT` → **U**; bb|a = {U}·{A} → nichts. · baa: b|aa = ·∅; ba|a = {T}·{A} → `T → TA` → **T**. · aab: alle Teilungen leer → **∅**.'],v:cyk6v(12,[3,0],[[1,0],[2,1]])},
    {t:'Zeile 4: vier Zeichen',x:['bbaa: b|baa = {T,B}·{T} → `U → BT` → **U**. · baab: keine passende Teilung → **∅**.'],v:cyk6v(14,[4,0],[[1,0],[3,1]])},
    {t:'Zeile 5: das ganze Wort',x:['bbaa|b = {U}·{T,B} → `S → UB` → **S**. S steht in der obersten Zelle → **bbaab ∈ L(Γ₂)**.'],v:cyk6v(15,[5,0],[[4,0],[1,4]]),tip:'Nur wenn das **Startsymbol** oben steht, liegt das Wort in der Sprache – andere Variablen dort zählen nicht.'},
    {t:'Ableitung rückwärts aus der Tabelle lesen',x:['Oben: S aus U (bbaa) · B (b). U (bbaa) aus B (b) · T (baa). T (baa) aus T (ba) · A (a). T (ba) aus T (b) · A (a).'],v:{type:'chain',items:[['S'],['UB'],['Ub'],['BTb'],['bTb'],['bTAb'],['bTAAb'],['bbAAb'],['bbaAb'],['bbaab',null,true]]}}],
    answer:{x:['**Ja**, S ∈ V(1,5), also `bbaab ∈ L(Γ₂)`.','Ableitung: S ⇒ UB ⇒ Ub ⇒ BTb ⇒ bTb ⇒ bTAb ⇒ bTAAb ⇒ bbAAb ⇒ bbaAb ⇒ bbaab.'],v:cyk6v(15)},
    grading:'0,5 Punkte pro nicht leerem Feld (12 Felder = 6 Punkte) + 1 Punkt Ableitung.'},
   {label:'b)',q:'Syntaxbaum für `211 − 42 + 10 ∗ 4`.',points:'3 Punkte',steps:[
    {t:'Zahlen als Z-Ketten',x:['Mehrstellige Zahlen entstehen rechtsrekursiv: 211 = `Z → 2Z → 21Z → 211`. Jede Zahl hängt unter `S → Z`.'],v:{type:'tree',root:tree6.children[0],title:'Teilbaum für 211'}},
    {t:'Operatoren verteilen',x:['Wähle eine Klammerung, z. B. `211 − (42 + (10 ∗ 4))`. Jeder Operator wird ein Knoten `S → S op S`.']},
    {t:'Baum zusammensetzen',x:['Oben das erste Minus, rechts darunter Plus, darunter Mal.'],v:{type:'tree',root:tree6,title:'Syntaxbaum 211 − 42 + 10 ∗ 4'}}],
    answer:{x:'Ein möglicher Syntaxbaum (Klammerung 211 − (42 + (10 ∗ 4))):',v:{type:'tree',root:tree6,title:'Syntaxbaum'}},
    grading:'Je 1 Punkt pro Operator-Regel S → S−S, S+S, S∗S inkl. korrekter Auflösung der Z.'}
  ],
  tips:['CYK-Tabelle **zeilenweise** füllen und bei jeder Zelle alle Teilungen aufschreiben – auch die leeren. So findest du Flüchtigkeitsfehler.','Für die Ableitung merkst du dir beim Ausfüllen, **aus welcher Teilung** eine Variable kam. Dann musst du nicht neu suchen.','Γ₁ ist mehrdeutig: Mehrere Syntaxbäume sind richtig. Prüfe nur, dass **jede** Regelanwendung erlaubt ist (S → Z nicht vergessen!).']}
 ]}
];
