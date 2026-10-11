// Übungsaufgaben mit Lösungen (Aufgaben_Loesungen.pdf, 26 PDF-Seiten): jede Aufgabe als eigener Lernpfad.
// Aufgabentexte sinngemäß, Grafiken aus den geprüften Modellen neu gezeichnet. Fehler der Vorlage sind markiert.
import {sheet4Dfa,alternatingDfa,sheet6Nfa,sheet7Dfa,sheet8Dfa,sheet22Dfa,sheet16Grammar,sheet23Grammar,zeroEraserTm,shiftZeroTm,eszettTm,sheet19Graph,runTm,configLabel,wordPartition,wordsUpTo,runDfaPartial,rightQuotient,degree} from './solution-models.js';
import {cyk,determinize} from './algorithms.js';
import {dfaDiagram,nfaDiagram,tmDiagram,graphDiagram,conceptMap,cycleEdges} from './solution-diagrams.js';

const L=(id,label)=>[`#lesson/${id}`,label],T=(id,label)=>[`#topic/${id}`,label];
const tones4=['lime','purple','sky','peach','pink','mint','sand'];
const tonesBy=groups=>Object.fromEntries(groups.flatMap((g,i)=>g.map(s=>[s,tones4[i%tones4.length]])));

// ---------- Layouts (orientieren sich an den Originalgrafiken) ----------
const lay4={width:470,height:410,pos:{err:[235,55],q0:[75,175],q1:[395,175],q2:[75,345],q3:[395,345]},loops:{err:'top'},startDir:'topleft'};
const lay4a={width:540,height:340,pos:{q0:[70,170],q1:[200,70],q2:[440,70],err:[320,170],q3:[200,270],q4:[440,270]},bends:{'q2>q1':30,'q4>q3':30},skip:['err>err'],startDir:'topleft'};
const lay6={width:560,height:240,pos:{q0:[80,130],q1:[280,130],q2:[480,130]},bends:{'q0>q2':-80,'q2>q0':-80},loops:{q2:'right'},startDir:'topleft'};
const det6={states:['A','B','C','X'],alphabet:['0','2','4'],start:'A',accept:['A','C'],transitions:{A:{0:'A',2:'X',4:'B'},B:{0:'X',2:'C',4:'X'},C:{0:'A',2:'X',4:'X'},X:{0:'X',2:'X',4:'X'}}};
const lay6d={width:620,height:350,r:34,pos:{A:[95,120],B:[310,120],C:[525,120],X:[310,275]},bends:{'C>A':80},loops:{A:'bottom',X:'bottom'},startDir:'top'};
const lab6d={A:'{q0,q2}',B:'{q1}',C:'{q2}',X:'∅'};
const lay7={width:720,height:350,pos:{q1:[50,175],q2:[190,80],q4:[360,80],q3:[190,270],q5:[360,270],q6:[495,175],q7:[640,80],q8:[640,270]},bends:{'q4>q2':45,'q5>q3':-45},loops:{q7:'top',q8:'bottom'}};
const lay8={width:560,height:270,pos:{q0:[70,95],q1:[280,95],q2:[490,95],err:[70,220]},loops:{q1:'top',q2:'top',err:'right'}};
const lay22={width:660,height:440,pos:{q0:[220,100],q1:[390,100],q2:[570,100],q3:[40,240],q4:[210,240],q5:[390,240],q6:[570,240]},bends:{'q2>q0':60,'q3>q6':230,'q5>q3':-50},loops:{q2:'right',q5:'bottom'}};
const min22={states:['A','B','C','D','E'],alphabet:['a','b'],start:'A',accept:['C','D'],transitions:{A:{a:'B',b:'D'},B:{a:'E',b:'C'},C:{a:'A',b:'C'},D:{a:'C',b:'E'},E:{a:'E',b:'A'}}};
const lay22m={width:480,height:440,pos:{A:[80,220],B:[230,140],C:[390,60],E:[230,300],D:[390,380]},bends:{'C>A':80,'A>D':80},loops:{C:'right',E:'right'}};
const lab22m={A:'[q0,q3]',B:'[q1,q6]',C:'[q2]',D:'[q4]',E:'[q5]'};
const tmLay={width:640,height:470,pos:{q0:[100,120],q2:[320,120],q4:[540,120],q1:[100,360],q3:[320,360],q5:[540,360]},loops:{q0:'top',q2:'top',q4:'top',q3:'bottom'},bends:{'q5>q2':40}};
const shiftLay={width:700,height:420,pos:{s:[70,200],q1:[230,200],q2:[380,140],q3:[560,140],q4:[380,260],q5:[560,260],q6:[230,370],q7:[70,370]},bends:{'q3>q1':160,'q5>q1':-160}};
const eszLay={width:600,height:340,pos:{q0:[180,140],q1:[450,140],q2:[360,260],q3:[60,270]},loops:{q0:'top',q1:'top',q2:'bottom'}};
const g19Lay={width:600,height:500,r:19,pos:{v1:[391,32],v2:[218,70],v3:[461,109],v4:[153,157],v5:[561,219],v6:[35,278],v7:[218,270],v8:[399,275],v9:[97,355],v10:[283,368],v11:[490,350],v12:[133,453],v13:[366,472]}};
const prime={states:['q0'],alphabet:['0','1'],start:'q0',accept:['q0'],transitions:{q0:{0:'q0',1:'q0'}}};
const parity={states:['GG','GU','UG','UU'],alphabet:['a','b','c'],start:'GG',accept:['GU'],transitions:{GG:{a:'UG',b:'GU',c:'GG'},GU:{a:'UU',b:'GG',c:'GU'},UG:{a:'GG',b:'UU',c:'UG'},UU:{a:'GU',b:'UG',c:'UU'}}};
const parityLay={width:520,height:380,r:34,pos:{GG:[110,100],GU:[400,100],UG:[110,280],UU:[400,280]},bends:{'GG>GU':22,'GU>GG':22,'GG>UG':22,'UG>GG':22,'GU>UU':22,'UU>GU':22,'UG>UU':22,'UU>UG':22},loops:{GG:'top',GU:'top',UG:'bottom',UU:'bottom'}};
const parityLab={GG:'a g\nb g',GU:'a g\nb u',UG:'a u\nb g',UU:'a u\nb u'};

// ---------- Rechnungen ----------
const det6rows=determinize(sheet6Nfa);
const w7=[0,1,2].map(k=>wordPartition(sheet7Dfa,wordsUpTo(['a','b'],k)));
const w22=[0,1,2].map(k=>wordPartition(sheet22Dfa,wordsUpTo(['a','b'],k)));
const run7=runDfaPartial(sheet7Dfa,'abba');
const trace12=runTm(zeroEraserTm,'01101');
const shiftRun=runTm(shiftZeroTm,'01101');
const eszRun=runTm(eszettTm,'maß');
const c16=cyk(sheet16Grammar,'addd'),c23=cyk(sheet23Grammar,'aadea');
const quot=rightQuotient(['00','01','001'],['','0','1']);
const hamilton19=['v1','v2','v12','v13','v3','v5','v4','v7','v11','v6','v9','v10','v8'];
const clique19=['v2','v3','v10','v13'],vc19=['v2','v3','v4','v8','v9','v11','v13'];
const coloring19={v1:1,v2:2,v3:1,v4:2,v5:3,v6:1,v7:1,v8:2,v9:3,v10:4,v11:4,v12:1,v13:3};
const spanning19=[['v1','v2'],['v1','v4'],['v1','v8'],['v2','v3'],['v2','v10'],['v2','v12'],['v2','v13'],['v4','v5'],['v4','v6'],['v4','v7'],['v4','v9'],['v8','v11']];

const Z=(...digits)=>digits.length===1?{label:'Z',children:[{label:digits[0]}]}:{label:'Z',children:[{label:digits[0]},Z(...digits.slice(1))]};
const num=(...d)=>({label:'S',children:[Z(...d)]});
const op=(l,o,r)=>({label:'S',children:[l,{label:o},r]});
const tree17a=op(num('2','1','1'),'−',op(num('4','2'),'+',op(num('1','0'),'∗',num('4'))));
const tree17b=op(num('2','1','1'),'−',op(op(num('4','2'),'+',num('1','0')),'∗',num('4')));
const regexTree={label:'∪',children:[{label:'·',children:[{label:'*',children:[{label:'∪',children:[{label:'0'},{label:'1'}]}]},{label:'0'}]},{label:'1'}]};

const npda={type:'diagram',width:640,height:260,r:30,title:'NPDA für aⁿb²ⁿ',nodes:[{id:'p',x:110,y:140,start:true},{id:'q',x:350,y:140},{id:'f',x:560,y:140,accept:true}],
 edges:[{from:'p',to:'p',loop:'top',label:'a, # / 11#\na, 1 / 111'},{from:'p',to:'q',label:'b, 1 / ε'},{from:'q',to:'q',loop:'top',label:'b, 1 / ε'},{from:'q',to:'f',label:'ε, # / ε'}]};
const npdaFrames=[{label:'Start',stack:['#']},{label:'a',stack:['1','1','#']},{label:'aa',stack:['1','1','1','1','#']},{label:'aab',stack:['1','1','1','#']},{label:'aabbb',stack:['1','#']},{label:'aabbbb',stack:['#']},{label:'ε-Schritt',stack:[]}];

const mapGrund=conceptMap({width:800,height:560,title:'Begriffslandkarte Grundlagen',boxes:[['Automat',110,90,150,'Automat'],['L',400,90,190,'Formale Sprache L','Menge von Wörtern','lime'],['G',690,90,150,'Grammatik'],['Ops',110,250,170,'Operationen','∪ ∩ · * ᶜ \\'],['Sigma*',400,250,200,'Kleenescher\nAbschluss Σ*','alle Wörter über Σ'],['Sigma',400,420,190,'Alphabet Σ','endliche Zeichenmenge'],['w',690,420,170,'Wort w','endliche Zeichenfolge'],['eps',690,520,150,'ε','leeres Wort']],
 links:[['Automat','L','erkennt'],['G','L','erzeugt'],['L','Ops','darauf definiert',0,-20,0],['L','Sigma*','Teilmenge von',0,30,0],['Sigma*','Sigma','gebildet über'],['Sigma*','w','enthält'],['w','Sigma','Zeichen aus'],['eps','w','ist ein']]});
const mapRegular=conceptMap({width:800,height:430,title:'Begriffslandkarte reguläre Sprachen',boxes:[['Kleene',400,55,170,'Satz von Kleene',null,'purple'],['DEA',110,200,140,'DEA'],['L',400,200,190,'Reguläre Sprache L',null,'lime'],['G',690,200,180,'Reguläre\nGrammatik G'],['NEA',110,360,140,'NEA'],['R',400,360,190,'Regulärer\nAusdruck']],
 links:[['Kleene','L','DEA, NEA, RegEx:\ngleich mächtig'],['DEA','L','erkennt'],['NEA','DEA','Potenzmengen-\nkonstruktion'],['G','L','erzeugt'],['R','L','beschreibt']]});
const mapTm=conceptMap({width:820,height:560,title:'Begriffslandkarte Turingmaschinen',boxes:[['TM',120,310,160,'Turingmaschine',null,'lime'],['Algo',120,150,180,'Algorithmus /\nFunktion'],['ber',420,150,170,'berechenbar'],['Church',700,45,180,'Churchsche These',null,'purple'],['int',700,150,180,'intuitiv\nberechenbar'],['Spr',420,310,150,'Sprache'],['ent',420,450,180,'entscheidbar','TM hält immer'],['semi',720,450,190,'semi-entscheidbar','hält (nur) für w ∈ L'],['Konf',120,480,170,'Konfiguration','Zustand + Band + Kopf']],
 links:[['TM','Algo','berechnet'],['Algo','ber','ist'],['ber','int','gleich?'],['Church','int','sagt: ja, gleich'],['TM','Spr','akzeptiert'],['Spr','ent','kann sein'],['Spr','semi','kann sein'],['ent','semi','⊆'],['TM','Konf','durchläuft']]});
const mapCf=conceptMap({width:820,height:470,title:'Begriffslandkarte kontextfreie Sprachen',boxes:[['CYK',120,60,170,'CYK-Algorithmus'],['CNF',430,60,200,'Chomsky-Normalform'],['NPDA',120,230,140,'NPDA'],['CFL',430,230,220,'Kontextfreie Sprache\n/ Grammatik',null,'lime'],['ein',740,230,130,'eindeutig'],['DPDA',120,400,140,'DPDA'],['Baum',430,400,170,'Syntaxbaum']],
 links:[['CYK','CNF','braucht'],['CYK','CFL','löst Wortproblem\nin O(n³)'],['CFL','CNF','umformbar in'],['NPDA','CFL','erkennt genau'],['NPDA','DPDA','echt mächtiger als'],['Baum','CFL','zeigt Ableitung'],['Baum','ein','genau einer\npro Wort ⇒'],['CFL','ein','kann\nsein']]});
const concat={type:'diagram',width:420,height:420,title:'NEA für L₁ · L₂',r:28,nodes:[{id:'s1',label:'s₁',x:210,y:50,start:'left'},{id:'F1',label:'F₁',x:210,y:160,shape:'box',w:200,h:46,sub:'alte Endzustände von 𝒜₁'},{id:'s2',label:'s₂',x:210,y:270},{id:'F2',label:'F₂',x:210,y:375,shape:'box',w:200,h:46,sub:'einzige Endzustände',tone:'lime'}],
 edges:[{from:'s1',to:'F1',label:'δ₁',dashed:true},{from:'F1',to:'s2',label:'ε'},{from:'s2',to:'F2',label:'δ₂',dashed:true}]};

export const sheetUnits=[
 {title:'Grundlagen und Sprachen',subtitle:'Begriffe, Rechtsquotient, reguläre Ausdrücke',icon:'book',tasks:[
 {id:'au-1',n:'1',title:'Begriffslandkarte Grundlagen',topics:['Alphabet','Wort','Σ*','Sprache','Automat'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 1',
  prompt:['Fasse das Grundlagenkapitel in einem Schaubild zusammen. Mindestens: Alphabet, Wort, Kleenescher Abschluss, formale Sprache, Automat.'],
  background:[{term:'Alphabet Σ',text:'Endliche, nichtleere Menge von Zeichen, z. B. {0,1}.',link:L('alphabet','Alphabet, Wort und Wortlänge')},{term:'Σ*',text:'Menge **aller** endlichen Wörter über Σ, inklusive ε.',link:L('closure','Stern und Plus')},{term:'Formale Sprache',text:'Irgendeine Teilmenge L ⊆ Σ*.',link:L('languages','Eine Sprache ist eine Wortmenge')}],
  parts:[{label:'',q:'Baue das Schaubild.',steps:[
   {t:'Von unten anfangen: die Bausteine',x:['Alphabet Σ → daraus werden Wörter. ε ist auch ein Wort (Länge 0).'],v:{type:'chain',items:[['Σ = {0,1}','Alphabet'],['0110','Wort'],['ε','leeres Wort']]}},
   {t:'Alle Wörter zusammen: Σ*',x:['Σ* sammelt sämtliche Wörter. Eine Sprache wählt daraus eine Teilmenge aus.']},
   {t:'Wer beschreibt Sprachen?',x:['Automaten **erkennen** (akzeptieren) Wörter, Grammatiken **erzeugen** sie. Auf Sprachen gibt es Operationen wie ∪, ·, *, Komplement und Rechtsquotient.']},
   {t:'Verbindungen beschriften',x:['Jeder Pfeil braucht ein Verb – das ist der eigentliche Lerninhalt eines Schaubilds.'],v:mapGrund}],
   answer:{x:'Ein mögliches Schaubild:',v:mapGrund},
   warning:'Im Original-Schaubild steht unter „Formale Sprache L“ der Zusatz „alle mögl. Wörter“. Das gilt nur für Σ*. Eine Sprache ist eine **Teilmenge** von Σ* – sie kann auch ∅ oder {ε} sein.'}],
  tips:['Schaubilder bringen in der Klausur Punkte, wenn **jede Kante ein Verb** trägt („erkennt“, „erzeugt“, „Teilmenge von“).','Zeichne ε, ∅ und {ε} einmal nebeneinander – das ist der häufigste Notationsfehler.']},

 {id:'au-2',n:'2',title:'Rechtsquotient von Sprachen',topics:['Sprachoperationen','Rechtsquotient'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 2',
  prompt:['Für Sprachen L₁, L₂ ist `L₁ \\ L₂ := {w ∈ Σ* : ∃ z ∈ L₂ mit w·z ∈ L₁}`.','a) In eigenen Worten beschreiben. b) Für `L₁ = {00, 01, 001}` und `L₂ = {ε, 0, 1}` explizit angeben. c) Zwei nichtleere Sprachen L′, L″ mit `L′ \\ L″ = ∅` angeben.'],
  background:[{term:'Rechtsquotient',text:'„Schneide von einem Wort aus L₁ hinten ein Wort aus L₂ ab – was übrig bleibt, ist im Quotienten.“',link:L('quotient','Rechtsquotient: Suffix entfernen')},{term:'ε als Suffix',text:'ε lässt sich von **jedem** Wort abschneiden. Ist ε ∈ L₂, dann gilt L₁ ⊆ L₁ \\ L₂.'}],
  warning:'Das Blatt nennt die Operation „Durchschnitt“. Gemeint ist der **Rechtsquotient** (der Durchschnitt wäre L₁ ∩ L₂).',
  parts:[
   {label:'a)',q:'Beschreibe `L₁ \\ L₂` in eigenen Worten.',steps:[{t:'Definition laut vorlesen',x:['„w ist drin, wenn man **hinten** ein z aus L₂ anhängen kann und dann in L₁ landet.“']},{t:'Umgekehrt gedacht',x:['Nimm ein Wort aus L₁ und streiche ein **Suffix** aus L₂ weg.']}],
    answer:{x:'In L₁ \\ L₂ liegen alle Wörter w, die durch Anhängen eines Wortes aus L₂ zu einem Wort aus L₁ werden – anders gesagt: Wörter aus L₁, von denen man hinten ein Wort aus L₂ entfernt.'}},
   {label:'b)',q:'Berechne `{00, 01, 001} \\ {ε, 0, 1}`.',steps:[
    {t:'z = ε: nichts abschneiden',x:['00, 01, 001 bleiben stehen.'],v:{type:'table',caption:'Alle Paare (x ∈ L₁, z ∈ L₂)',head:['x','z = ε','z = 0','z = 1'],rows:[['00','00','0','—'],['01','01','—','0'],['001','001','—','00']],highlight:[[0,1],[1,1],[2,1]]}},
    {t:'z = 0 und z = 1',x:['00 endet auf 0 → Rest **0**. 01 endet auf 1 → Rest **0**. 001 endet auf 1 → Rest **00**. „—“: Das Wort endet nicht auf z.'],v:{type:'table',caption:'Alle Paare (x ∈ L₁, z ∈ L₂)',head:['x','z = ε','z = 0','z = 1'],rows:[['00','00','0','—'],['01','01','—','0'],['001','001','—','00']],highlight:[[0,2],[1,3],[2,3]]}},
    {t:'Menge bilden, Doppelte weg',x:['0 und 00 kommen doppelt vor – in einer Menge zählt jedes Wort einmal.']}],
    answer:{x:`L₁ \\ L₂ = {${quot.join(', ')}}`}},
   {label:'c)',q:'Finde nichtleere L′, L″ mit `L′ \\ L″ = ∅`.',steps:[{t:'Kein Wort darf passen',x:['Kein Wort aus L′ darf auf ein Wort aus L″ enden. Also darf ε **nicht** in L″ sein.']},{t:'Kleinstes Beispiel',x:['L′ = {0}, L″ = {1}: 0 endet nicht auf 1.']}],
    answer:{x:'Zum Beispiel `L′ = {0}`, `L″ = {1}`: Von 0 kann man hinten keine 1 entfernen, also ist das Ergebnis ∅.'}}],
  tips:['Tabelle „x gegen z“ anlegen – so vergisst du keine Kombination.','Falle: ε ∈ L₂ übersehen. Dann gehören alle Wörter aus L₁ automatisch dazu.']},

 {id:'au-3',n:'3',title:'Reguläre Ausdrücke und Abschluss',topics:['RegEx','Abschlusseigenschaften','De Morgan'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 2–3',
  prompt:['L enthält endlich viele (endliche) Wörter. a) Zeige: L ist regulär. b) Beschreibe `L̃ = ({0} ∪ {1})* · {0} ∪ {1}`. c) Ist L̃ regulär (RegEx angeben)? Ist es eine formale Sprache? d) Zeige: L₁, L₂ regulär ⇒ L₁ ∩ L₂ regulär (Hinweis: De Morgan).'],
  background:[{term:'Regulärer Ausdruck (induktiv)',text:'Basis: ∅, ε, einzelne Zeichen. Aufbau: Vereinigung, Verkettung, Stern. Alles, was so entsteht, ist regulär.',link:L('regex','RegEx lesen')},{term:'Vorrang',text:'Stern vor Verkettung vor Vereinigung – wie „hoch“ vor „mal“ vor „plus“.'},{term:'De Morgan',text:'`A ∩ B = (Aᶜ ∪ Bᶜ)ᶜ`'}],
  parts:[
   {label:'a)',q:'Endliche Sprachen sind regulär.',steps:[{t:'Wörter aufzählen',x:['L = {w₁, …, wₙ}. Jedes einzelne Wort ist eine Verkettung einzelner Zeichen → regulärer Ausdruck rᵢ.']},{t:'Vereinigen',x:['`r₁ ∪ r₂ ∪ … ∪ rₙ` ist ein regulärer Ausdruck für L. Für L = ∅ nimm den Ausdruck ∅.']}],
    answer:{x:'Sei L = {w₁, …, wₙ}. Für jedes Wort ist die Zeichenverkettung rᵢ ein regulärer Ausdruck, also ist r₁ ∪ … ∪ rₙ (bzw. ∅ für n = 0) ein regulärer Ausdruck für L. Damit ist L regulär.'}},
   {label:'b)',q:'Beschreibe `({0} ∪ {1})* · {0} ∪ {1}`.',steps:[{t:'Klammern nach Vorrang setzen',x:['Verkettung bindet stärker als ∪: `[ ({0}∪{1})* · {0} ] ∪ {1}`.'],v:{type:'tree',root:regexTree,title:'Aufbau des Ausdrucks'}},{t:'Teile lesen',x:['Linker Teil: beliebiges 01-Wort, dann eine 0 → alle Wörter, die **auf 0 enden**. Rechter Teil: das Wort 1.']}],
    answer:{x:'L̃ besteht aus allen 01-Wörtern, die mit 0 enden, und zusätzlich dem Wort 1.'},tip:'Nicht verwechseln mit `({0}∪{1})*·({0}∪{1})` – das wären alle nichtleeren Wörter.'},
   {label:'c)',q:'Ist L̃ regulär? Formale Sprache?',steps:[{t:'Es ist schon ein regulärer Ausdruck',x:['Baue ihn induktiv auf: Zeichen (1) → Vereinigung (2) → Stern (3) → Verkettung (4) → Vereinigung (5). Jeder Schritt erhält Regularität.'],v:{type:'tree',root:regexTree,title:'Induktiver Aufbau'}},{t:'Formale Sprache?',x:['Jede reguläre Sprache ist eine Teilmenge von {0,1}* – also eine formale Sprache.']}],
    answer:{x:'Ja: `(0 ∪ 1)*0 ∪ 1` ist bereits ein regulärer Ausdruck, L̃ ist regulär und damit auch eine formale Sprache.'}},
   {label:'d)',q:'Schnitt regulärer Sprachen ist regulär.',steps:[{t:'De Morgan anwenden',x:['`L₁ ∩ L₂ = (L₁ᶜ ∪ L₂ᶜ)ᶜ`'],v:{type:'chain',items:[['L₁, L₂','regulär'],['L₁ᶜ, L₂ᶜ','Komplement'],['L₁ᶜ ∪ L₂ᶜ','Vereinigung'],['(…)ᶜ = L₁ ∩ L₂','Komplement',true]]}},{t:'Abschlusseigenschaften zitieren',x:['Komplement (Endzustände tauschen) und Vereinigung erhalten Regularität.']}],
    answer:{x:'Mit De Morgan gilt L₁ ∩ L₂ = (L₁ᶜ ∪ L₂ᶜ)ᶜ. Da reguläre Sprachen unter Komplement und Vereinigung abgeschlossen sind, ist auch der Schnitt regulär.'},tip:'Alternative ohne De Morgan: Produktautomat – beide DEAs parallel laufen lassen.'}],
  tips:['„Zeige, dass … regulär ist“: Am schnellsten mit einem regulären Ausdruck oder einem DEA.','Abschlusseigenschaften als Kette hinschreiben – jeder Pfeil = eine zitierte Eigenschaft.']}
 ]},
 {title:'Endliche Automaten',subtitle:'Konstruieren, Komplement, Potenzmenge, Minimierung',icon:'nodes',tasks:[
 {id:'au-4',n:'4',title:'DEA konstruieren und Komplement',topics:['DEA','Komplement','Kleene'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 3–5',
  prompt:['Gib je einen DEA (Q, Σ, s, F formal, δ als Bild) an: a) alle 01-Wörter ohne zwei gleiche Zeichen hintereinander; b) hält bei einer binär kodierten Primzahl im Endzustand.','Gegeben ist außerdem der DEA unten mit F = {q0, q1}. c) Gib einen DEA für das Komplement Lᶜ an. d) Wie würde man den Satz von Kleene beweisen?'],
  given:dfaDiagram(sheet4Dfa,lay4,{title:'Gegebener DEA (Teil c)',caption:'err ist ein Fangzustand (Schleife mit 0,1 ergänzt).'}),
  background:[{term:'DEA vollständig',text:'Für jeden Zustand und jedes Zeichen genau ein Übergang. Fehlende Übergänge → Fangzustand.',link:L('dfa','Ein DEA liest Zeichen für Zeichen')},{term:'Was merkt sich ein Zustand?',text:'Frage dich: Welche Information über das bisher Gelesene brauche ich, um weiterzuentscheiden? Genau dafür je ein Zustand.',link:L('parity','Was muss ein Zustand wissen?')},{term:'Komplementautomat',text:'Gleicher DEA, F ersetzen durch Q ∖ F. Funktioniert nur, wenn δ vollständig ist.',link:L('complement','Komplementautomat')}],
  parts:[
   {label:'a)',q:'DEA für „nie zwei gleiche Zeichen hintereinander“.',steps:[{t:'Was muss der Automat wissen?',x:['Nur das **zuletzt gelesene Zeichen**. Dazu: Start (noch nichts gelesen) und Fehler.']},{t:'Übergänge',x:['Nach 1 darf nur 0 kommen, nach 0 nur 1. Ein gleiches Zeichen → err (Fangzustand).','Die Lösung nutzt zwei getrennte Ketten (Start mit 1 bzw. mit 0). Das ist korrekt, aber nicht minimal.'],v:dfaDiagram(alternatingDfa,lay4a,{title:'DEA der Musterlösung',caption:'err-Schleife mit 0,1 nicht gezeichnet.'})},{t:'ε nicht vergessen',x:['Das leere Wort hat keine zwei gleichen Zeichen → **q0 ist Endzustand**.'],tip:'Prüfe einen DEA immer mit ε, einem einzelnen Zeichen und einem Gegenbeispiel (z. B. 0110).'}],
    answer:{x:'𝒜 = ({q0,…,q4,err}, {0,1}, δ, q0, F = {q0,q1,q2,q3,q4}) mit δ wie im Bild. Minimal ginge es mit 4 Zuständen: Start, „zuletzt 0“, „zuletzt 1“, err.',v:dfaDiagram(alternatingDfa,lay4a,{title:'Lösung a'})}},
   {label:'b)',q:'DEA, der bei Primzahlen (binär) im Endzustand hält.',steps:[{t:'Fangfrage erkennen',x:['Die Sprache der Primzahlen ist **nicht regulär** – kein DEA erkennt **genau** die Primzahlen.']},{t:'Wortlaut nutzen',x:['Verlangt ist nur: Bei einer Primzahl im Endzustand halten. Ein DEA, der **alles** akzeptiert, erfüllt das.'],v:dfaDiagram(prime,{width:260,height:170,pos:{q0:[130,110]},loops:{q0:'top'}},{title:'Akzeptiert alles'})}],
    answer:{x:'𝒜 = ({q0}, {0,1}, δ, q0, {q0}) mit δ(q0,0) = δ(q0,1) = q0. Er akzeptiert jedes Wort, also insbesondere jede Primzahl. Genau die Primzahlen erkennt kein DEA.'}},
   {label:'c)',q:'DEA für das Komplement Lᶜ.',steps:[{t:'Vollständigkeit prüfen',x:['Jeder Zustand braucht 0- und 1-Übergang. err muss eine Schleife haben – sonst fehlen Wörter im Komplement.']},{t:'Endzustände tauschen',x:['F = {q0, q1} → Fᶜ = {q2, q3, err}.'],v:{type:'group',row:true,items:[{label:'vorher',...dfaDiagram(sheet4Dfa,lay4,{title:'L'})},{label:'nachher',...dfaDiagram({...sheet4Dfa,accept:['q2','q3','err']},lay4,{title:'Lᶜ'})}]}}],
    answer:{x:'𝒜ᶜ = (Q, Σ, δ, q0, Q ∖ F) = gleicher Automat mit F = {q2, q3, err}. Er akzeptiert genau die Wörter, die 𝒜 ablehnt.',v:dfaDiagram({...sheet4Dfa,accept:['q2','q3','err']},lay4,{title:'Komplementautomat'})}},
   {label:'d)',q:'Wie beweist man den Satz von Kleene?',steps:[{t:'Zwei Richtungen',x:['„Genau die“ = **beide** Inklusionen zeigen.'],v:{type:'tiles',items:[['1. regulär ⇒ DEA','RegEx → NEA (Thompson) → DEA (Potenzmenge)','lime'],['2. DEA ⇒ regulär','aus dem DEA einen RegEx bauen (Zustandselimination)','purple']]}}],
    answer:{x:'Zu zeigen: (1) Zu jeder regulären Sprache gibt es einen DEA – z. B. RegEx induktiv in NEA übersetzen und per Potenzmengenkonstruktion determinisieren. (2) Jede DEA-Sprache ist regulär – aus dem DEA einen regulären Ausdruck konstruieren.'}}],
  tips:['Komplement immer erst **vervollständigen**, dann F tauschen.','Bei „Fangfragen“ den Wortlaut genau lesen: „hält bei Primzahl im Endzustand“ ≠ „erkennt genau die Primzahlen“.']},

 {id:'au-5',n:'5',title:'Begriffslandkarte reguläre Sprachen',topics:['Kleene','DEA','NEA','Grammatik','RegEx'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 5',
  prompt:['Fasse „Reguläre Sprachen“ in einem Schaubild zusammen: reguläre Sprache, regulärer Ausdruck, Satz von Kleene, DEA, NEA, reguläre Grammatik.'],
  background:[{term:'Vier Darstellungen',text:'DEA, NEA, RegEx und reguläre Grammatik beschreiben dieselbe Klasse.',link:L('regular-grammar','Grammatik, RegEx und Automat')}],
  parts:[{label:'',q:'Baue das Schaubild.',steps:[{t:'In die Mitte: die Sprache',x:['Alle anderen Begriffe sind **Beschreibungen** der regulären Sprache.']},{t:'Übersetzungen als Pfeile',x:['NEA → DEA: Potenzmengenkonstruktion. RegEx → NEA: Thompson/induktiver Aufbau. Grammatik ↔ Automat: Zustand = Variable.']},{t:'Kleene darüber',x:['Kleene ist das „Klebeband“: Er sagt, dass alle Darstellungen gleich mächtig sind.'],v:mapRegular}],
   answer:{x:'Ein mögliches Schaubild:',v:mapRegular}}],
  tips:['Zu jedem Pfeil das **Verfahren** nennen können – genau das wird in Klausuren gern als Kurzfrage gestellt.']},

 {id:'au-6',n:'6',title:'Potenzmengenkonstruktion',topics:['NEA','ε-Hülle','Potenzmenge','Kleene-Beweis'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 6–8',
  prompt:['a) Gib δ für den Kleene-Beweisfall „NEA für L₁ · L₂“ an. Für den NEA unten: b) Wo steckt der Nichtdeterminismus? c) Bestimme per Potenzmengenkonstruktion einen äquivalenten DEA (alte Klausuraufgabe).'],
  given:nfaDiagram(sheet6Nfa,lay6,{title:'NEA aus Aufgabe 6'}),givenNote:'Σ = {0, 2, 4}, Start q0, F = {q2}. Auf dem Blatt heißen die Teile d), e), f).',
  background:[{term:'ε-Hülle',text:'E(M) = alle Zustände, die von M aus nur über ε-Kanten erreichbar sind (inklusive M).',link:L('epsilon','ε-Hüllen')},{term:'Potenzmengenkonstruktion',text:'DEA-Zustand = Menge von NEA-Zuständen. Start: E({s}). Übergang: Δ(M, x) = E(alle x-Nachfolger aus M). Endzustand: Menge enthält ein q ∈ F.',link:L('determinize','Aus dem NEA einen DEA konstruieren')}],
  parts:[
   {label:'a)',q:'Übergangsfunktion des NEA für L₁ · L₂.',steps:[{t:'Idee',x:['Erst 𝒜₁ durchlaufen. Sobald man in einem Endzustand von 𝒜₁ ist, per ε in den Start von 𝒜₂ springen. Nur F₂ akzeptiert.'],v:concat},{t:'Formal',x:['Für q ∈ Q₁, x ∈ Σ: δ(q, x) = δ₁(q, x). Für q ∈ Q₂: δ(q, x) = δ₂(q, x).','ε: δ(q, ε) = δ₁(q, ε) ∪ {s₂}, falls q ∈ F₁; sonst δ₁(q, ε). Für q ∈ Q₂: δ(q, ε) = δ₂(q, ε).']}],
    answer:{x:'Start s₁, Endzustände F₂, δ = δ₁ ∪ δ₂ plus zusätzliche ε-Übergänge von jedem f ∈ F₁ nach s₂.',v:concat}},
   {label:'b)',q:'Wo steckt der Nichtdeterminismus?',steps:[{t:'Nach Mehrdeutigkeiten suchen',x:['ε-Kante q0 → q2 (Wechsel ohne Lesen) und q2 hat beim Lesen von 0 **zwei** Ziele (q0 und q2).'],v:nfaDiagram(sheet6Nfa,lay6,{highlight:{edges:['q0>q2','q2>q0','q2>q2']},title:'Nichtdeterministische Stellen'})}],
    answer:{x:'(1) Der ε-Übergang q0 → q2. (2) In q2 führt das Zeichen 0 sowohl nach q0 als auch nach q2.'}},
   {label:'c)',q:'Potenzmengenkonstruktion.',steps:[
    {t:'Startzustand = ε-Hülle',x:['E({q0}) = {q0, q2}. Da q2 ∈ F: Endzustand.']},
    {t:'Von {q0, q2} aus',x:['0: q2 → {q0, q2}, Hülle {q0, q2}. 2: nichts → ∅. 4: q0 → q1 → {q1}.'],v:{type:'table',caption:'Zeile 1',head:['Menge','0','2','4'],rows:[['→* {q0,q2}','{q0,q2}','∅','{q1}']]}},
    {t:'Von {q1} aus',x:['Nur 2 geht: q1 → q2, Hülle **{q2}** (von q2 gibt es kein ε). 0 und 4: ∅.'],v:{type:'table',caption:'Zeile 2',head:['Menge','0','2','4'],rows:[['→* {q0,q2}','{q0,q2}','∅','{q1}'],['{q1}','∅','{q2}','∅']],highlight:[[1,2]]},tip:'Hülle **nach** dem Lesen bilden – aber nur von den erreichten Zuständen, nicht vom Start.'},
    {t:'Von {q2} und ∅',x:['{q2}: 0 → {q0, q2}, 2 und 4 → ∅. Endzustand (enthält q2). ∅ ist ein Fangzustand.'],v:{type:'table',caption:'Vollständige Tabelle',head:['Menge','0','2','4'],rows:det6rows.map(r=>[`${r.states.length?`{${r.states.join(',')}}`:'∅'}${r.accept?' *':''}`,...['0','2','4'].map(c=>r.next[c].length?`{${r.next[c].join(',')}}`:'∅')])}},
    {t:'DEA zeichnen',x:['Vier Zustände: {q0,q2} (Start, End), {q1}, {q2} (End), ∅.'],v:dfaDiagram(det6,lay6d,{labels:lab6d,title:'DEA nach Potenzmengenkonstruktion'})}],
    answer:{x:['DEA mit Zuständen {q0,q2} (Start, End), {q1}, {q2} (End), ∅. Sprache: `(0 ∪ 420)*(ε ∪ 42)` – jede 4 wird direkt von einer 2 gefolgt, und nach einer 2 kommt nie direkt eine 4.'],v:dfaDiagram(det6,lay6d,{labels:lab6d,title:'Lösung c'})},
    warning:'Die Original-Lösung führt {q1} mit 2 zurück nach {q0, q2}. Richtig ist **{q2}**: Von q2 gibt es keine ε-Kante zu q0. Der Unterschied ist echt: Das Wort 4242 würde der Original-DEA akzeptieren, der NEA nicht. Außerdem fehlen dort der Zustand ∅ und die Übergänge dorthin.'}],
  tips:['Tabelle zeilenweise abarbeiten: Jede neue Menge kommt als neue Zeile dazu, bis nichts Neues mehr entsteht.','∅ als Zustand nicht vergessen – sonst ist der DEA nicht vollständig.','Gegenprobe: Ein kurzes Wort (z. B. 4242) im NEA und im DEA laufen lassen.']},

 {id:'au-7',n:'7',title:'Minimierung von Automaten',topics:['DEA-Lauf','Minimierung','Komplement'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 7–8',
  prompt:['Gegeben ist der Automat unten (Start q1, F = {q8}). a) Zustandsfolge für `abba`, gehört es zu L? b) Minimiere den Automaten (Hinweis: 5 Zustände). c) Zeige mit Kleene: L regulär ⇒ Lᶜ regulär.'],
  given:dfaDiagram(sheet7Dfa,lay7,{title:'Automat aus Aufgabe 7'}),
  givenNote:'Das Blatt nennt ihn NEA, aber jeder Zustand hat genau einen a- und einen b-Nachfolger – es ist ein DEA.',
  background:[{term:'Lauf eines DEA',text:'Zeichen für Zeichen dem Pfeil folgen. Akzeptiert, wenn der letzte Zustand in F liegt.',link:L('dfa','DEA-Lauf')},{term:'Wortmethode',text:'ε trennt F von Q∖F. Dann Wörter der Länge 1, 2, … testen.',link:L('minimize','Minimierung')}],
  parts:[
   {label:'a)',q:'Zustandsfolge für abba.',steps:[{t:'Zeichen für Zeichen',x:[`${run7.trace.join(' → ')}`],v:dfaDiagram(sheet7Dfa,lay7,{highlight:{edges:['q1>q2','q2>q4','q4>q6','q6>q8'],nodes:run7.trace},title:'Lauf von abba'})}],
    answer:{x:'q1 →a q2 →b q4 →b q6 →a q8. Da q8 ∈ F, ist abba ∈ L(𝒜).'}},
   {label:'b)',q:'Minimiere den Automaten.',steps:[
    {t:'ε trennt den Endzustand',x:['{q1,…,q7} gegen {q8}.'],v:{type:'partition',rounds:[{label:'ε',groups:w7[0]}],current:0}},
    {t:'a trennt q6, q7',x:['q6 →a q8 und q7 →a q8 landen in F, alle anderen nicht.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:w7[0]},{label:'a (b trennt nichts)',groups:w7[1]}],current:1},dfaDiagram(sheet7Dfa,lay7,{tones:tonesBy(w7[1]),title:'Nach Länge 1'})]}},
    {t:'aa und ba trennen den Rest',x:['aa: q2 → q6 → q8 ✓ und q5 → q6 → q8 ✓, aber q1, q3, q4 nicht → {q2,q5} | {q1,q3,q4}.','ba: q3 → q6 → q8 ✓, q4 → q6 → q8 ✓, aber q1 → q3 → q5 ✗ → q1 allein.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:w7[0]},{label:'a',groups:w7[1]},{label:'aa, ba',groups:w7[2]}],current:2},dfaDiagram(sheet7Dfa,lay7,{tones:tonesBy(w7[2]),title:'Fünf Klassen'})]},tip:'Der Hinweis „5 Zustände“ erlaubt dir, hier aufzuhören. Ohne Hinweis: Nachfolger-Blöcke prüfen.'}],
    answer:{x:'Klassen: {q1}, {q2, q5}, {q3, q4}, {q6, q7}, {q8} – der Minimalautomat hat 5 Zustände.',v:{type:'partition',rounds:[{label:'ε',groups:w7[0]},{label:'a',groups:w7[1]},{label:'aa, ba',groups:w7[2]}]}}},
   {label:'c)',q:'L regulär ⇒ Lᶜ regulär (mit Kleene).',steps:[{t:'Kette bilden',x:['L regulär → (Kleene) DEA für L → Komplementautomat → (Kleene) Lᶜ regulär.'],v:{type:'chain',items:[['L regulär'],['DEA 𝒜','Kleene'],['𝒜ᶜ: F ↦ Q∖F'],['Lᶜ regulär','Kleene',true]]}}],
    answer:{x:'Nach Kleene gibt es einen DEA für L. Tauscht man End- und Nicht-Endzustände, entsteht ein DEA für Lᶜ. Wieder nach Kleene ist Lᶜ regulär.'}}],
  tips:['Bei der Wortmethode Zwischenergebnisse **pro Wort** notieren – Teilpunkte!','Gegenprobe: In einem Block müssen alle Zustände mit a (und mit b) in denselben Block gehen.']},

 {id:'au-8',n:'8',title:'Äquivalenz der Darstellungen',topics:['RegEx','NEA/DEA','Reguläre Grammatik'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 9',
  prompt:['Σ = {a, b}, `L = {a·w : w ∈ Σ*} ∩ {w·b·v : w, v ∈ Σ*}`. a) Beschreibe L, kürzestes Wort? Zeige, dass L regulär ist durch b) RegEx, c) DEA/NEA, d) reguläre Grammatik.'],
  background:[{term:'Schnitt = beide Bedingungen',text:'Ein Wort muss **beide** Mengenbeschreibungen erfüllen.',link:L('sets','Vereinigung, Schnitt und Komplement')},{term:'Grammatik aus Automat',text:'Zustand ↦ Variable, Übergang p →x q ↦ P → xQ, Endzustand ↦ P → ε.',link:L('regular-grammar','Grammatik, RegEx und Automat')}],
  parts:[
   {label:'a)',q:'Beschreibung und kürzestes Wort.',steps:[{t:'Bedingungen einzeln lesen',x:['Linke Menge: beginnt mit a. Rechte Menge: enthält irgendwo ein b.']},{t:'Kürzestes Wort',x:['Mindestens ein a am Anfang und ein b: **ab**.']}],
    answer:{x:'L = alle Wörter, die mit a beginnen und (mindestens) ein b enthalten. Kürzestes Wort: ab.'}},
   {label:'b)',q:'Regulärer Ausdruck.',steps:[{t:'Struktur übersetzen',x:['a, dann beliebig, dann b, dann beliebig: `a(a|b)*b(a|b)*`.'],tip:'Schöner und eindeutiger: `aa*b(a|b)*` – erst alle a bis zum ersten b.'}],
    answer:{x:'`a · (a ∪ b)* · b · (a ∪ b)*`'}},
   {label:'c)',q:'DEA oder NEA.',steps:[{t:'Zustände = Fortschritt',x:['q0: noch nichts. q1: a gelesen, noch kein b. q2: Bedingung erfüllt. err: begann mit b.'],v:dfaDiagram(sheet8Dfa,lay8,{title:'DEA für L'})}],
    answer:{x:'𝒜 = ({q0,q1,q2,err}, {a,b}, δ, q0, {q2}) mit δ wie im Bild.',v:dfaDiagram(sheet8Dfa,lay8,{title:'Lösung c'})},
    warning:'Im Original-Bild fehlen an den Schleifen von q1 und q2 die Beschriftungen und err hat keine Übergänge. Richtig: q1 –a→ q1, q2 –a,b→ q2, err –a,b→ err.'},
   {label:'d)',q:'Reguläre Grammatik.',steps:[{t:'Aus dem DEA ablesen',x:['S = q0, A = q1, B = q2. err braucht keine Variable (dort wird nichts erzeugt).'],v:{type:'table',caption:'Grammatik',head:['Variable','Regeln'],rows:[['S','S → aA'],['A','A → aA | bB'],['B','B → aB | bB | ε']]}}],
    answer:{x:'G = ({a,b}, {S,A,B}, S, R) mit S → aA, A → aA | bB, B → aB | bB | ε.'},
    warning:'In der Original-Lösung steht `B → aA | bB | ε`. Damit fehlen Wörter: `aba` beginnt mit a und enthält b, ist aber nicht ableitbar (S ⇒ aA ⇒ abB ⇒ abaA, und A braucht wieder ein b). Richtig: `B → aB | bB | ε` – nach dem ersten b ist alles erlaubt.'}],
  tips:['Erst den DEA, dann Grammatik **ablesen** – so passen beide garantiert zusammen.','Bei Schnitten: jede Bedingung als eigene „Checkliste“ im Zustand mitführen.']},

 {id:'au-22m',n:'22 (DEA)',title:'Minimierung DEA',topics:['Minimierung','Äquivalenzklassen'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 24',
  prompt:['Bestimme die Äquivalenzklassen des DEA unten (Start q0, F = {q2, q4}) und zeichne den Minimalautomaten. Hinweis: Wörter der Länge 3 trennen nichts mehr.'],
  given:dfaDiagram(sheet22Dfa,lay22,{title:'DEA aus Aufgabe 22'}),
  givenNote:'δ: q0: a→q1, b→q4 · q1: a→q5, b→q2 · q2: a→q0, b→q2 · q3: a→q6, b→q4 · q4: a→q2, b→q5 · q5: a→q5, b→q3 · q6: a→q5, b→q2.',
  background:[{term:'Erreichbarkeit',text:'q3 wird über q5 –b→ q3 erreicht, q6 über q3 –a→ q6. Alles bleibt.'},{term:'Wortmethode',text:'Pro Testwort eine Zeile mit der Partition.',link:L('minimize','Minimierung')}],
  parts:[{label:'',q:'Äquivalenzklassen und Minimalautomat.',steps:[
   {t:'ε',x:['F = {q2, q4} gegen den Rest.'],v:{type:'partition',rounds:[{label:'ε',groups:w22[0]}],current:0}},
   {t:'a und b',x:['a: In F gilt q4 →a q2 ∈ F, aber q2 →a q0 ∉ F → q2 und q4 trennen sich. Bei den Nicht-Endzuständen führt a überall aus F heraus – keine Trennung.','b: q0, q1, q3, q6 landen mit b in F (q4 bzw. q2), nur q5 →b q3 nicht → **q5 allein**.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:w22[0]},{label:'a, b',groups:w22[1]}],current:1},dfaDiagram(sheet22Dfa,lay22,{tones:tonesBy(w22[1]),title:'Nach Länge 1'})]}},
   {t:'ab, ba, bb',x:['ab: q0 → q1 → q2 ∈ F, q3 → q6 → q2 ∈ F, aber q1 → q5 → q3 ∉ F und q6 → q5 → q3 ∉ F → {q0, q3} | {q1, q6}.'],v:{type:'group',items:[{type:'partition',rounds:[{label:'ε',groups:w22[0]},{label:'a, b',groups:w22[1]},{label:'ab (ba, bb bestätigen)',groups:w22[2]}],current:2},dfaDiagram(sheet22Dfa,lay22,{tones:tonesBy(w22[2]),title:'Fünf Klassen'})]}},
   {t:'Minimalautomat',x:['Fünf Zustände, Übergänge von einem Vertreter ablesen.'],v:dfaDiagram(min22,lay22m,{labels:lab22m,title:'Minimalautomat',r:34})}],
   answer:{x:'Klassen: [q0] = {q0, q3}, [q1] = {q1, q6}, [q2] = {q2}, [q4] = {q4}, [q5] = {q5}.',v:dfaDiagram(min22,lay22m,{labels:lab22m,title:'Minimalautomat',r:34})}}],
  tips:['q3 und q6 sehen auf den ersten Blick unerreichbar aus – **immer** Erreichbarkeit vom Start nachrechnen.']}
 ]},
 {title:'Grenzen regulärer Sprachen',subtitle:'Zählen und Pumping-Lemma',icon:'flag',tasks:[
 {id:'au-9',n:'9',title:'Grenzen regulärer Sprachen',topics:['Pumping','DEA kann nicht zählen'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 10',
  prompt:['Versuche zu zeigen, dass `L = {0ⁱ1ⁱ : i ∈ ℕ}` regulär ist. Beschreibe dein Vorgehen und die Schwierigkeit.'],
  background:[{term:'Endlich viele Zustände',text:'Ein DEA mit n Zuständen kann höchstens n verschiedene „Erinnerungen“ unterscheiden.',link:T('pumping','Pumping & Grenzen')}],
  parts:[{label:'',q:'Vorgehen und Schwierigkeit.',steps:[{t:'Versuch: DEA bauen',x:['Erst 0en lesen, dann gleich viele 1en. Dafür muss der Automat sich die **Anzahl** der 0en merken.']},{t:'Schubfachprinzip',x:['Hat der DEA n Zustände, landen zwei der Wörter 0⁰, 0¹, …, 0ⁿ im **selben** Zustand. Dann verhält er sich auf 1ⁱ für beide gleich – akzeptiert also ein falsches Wort.'],v:{type:'chain',items:[['0ⁱ','→ Zustand q'],['0ʲ','→ auch q!'],['0ʲ1ⁱ','wird akzeptiert ✗',true]]}}],
   answer:{x:'Man müsste die Anzahl der gelesenen 0en speichern, um gleich viele 1en zu prüfen. Ein DEA hat nur endlich viele Zustände und kann nicht beliebig weit zählen – L ist nicht regulär (Beweis mit Pumping-Lemma).'}}],
  tips:['Merksatz: „DEAs können nicht zählen“ – aber „gerade/ungerade“ (modulo) können sie!']},

 {id:'au-11',n:'11',title:'Pumping-Lemma',topics:['Pumping-Lemma','Paritäts-DEA'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 13',
  prompt:['Σ = {a,b,c}. `L₁ = {w : |w|ₐ + |w|_b = |w|_c}`, `L₂ = {w ∈ Σ⁺ : |w|ₐ gerade, |w|_b ungerade}`. Zeige oder widerlege jeweils: Die Sprache ist regulär.'],
  background:[{term:'Pumping-Lemma',text:'L regulär ⇒ ∃ n: jedes w ∈ L mit |w| ≥ n zerfällt in uvx mit |uv| ≤ n, |v| ≥ 1 und u vⁱ x ∈ L für **alle** i ≥ 0.',link:T('pumping','Pumping & Grenzen')},{term:'Beweisrichtung',text:'Für „nicht regulär“: ein Wort wählen und für **jede** erlaubte Zerlegung ein i finden, das aus L herausführt.'}],
  parts:[
   {label:'a)',q:'L₁ regulär?',steps:[{t:'Wort geschickt wählen',x:['w = aⁿ bⁿ c²ⁿ. Es liegt in L₁ (n + n = 2n) und ist lang genug.']},{t:'Zerlegung festnageln',x:['|uv| ≤ n ⇒ u und v bestehen nur aus a. v = aᵏ mit k ≥ 1.'],v:{type:'chain',joiner:'',items:[['aᵏ…','u v (nur a)',true],['a…a','x beginnt'],['bⁿ',''],['c²ⁿ','']]}},{t:'Pumpen',x:['i = 0: aⁿ⁻ᵏ bⁿ c²ⁿ hat (n−k) + n < 2n → nicht in L₁. Widerspruch.']}],
    answer:{x:'L₁ ist **nicht regulär**: Für w = aⁿbⁿc²ⁿ besteht v nur aus a; u v⁰ x hat weniger a, also |w|ₐ + |w|_b ≠ |w|_c.'}},
   {label:'b)',q:'L₂ regulär?',steps:[{t:'Zuerst: Kann ein DEA das?',x:['Er muss sich nur **Parität** merken: a gerade/ungerade × b gerade/ungerade = 4 Zustände. c ändert nichts.'],v:dfaDiagram(parity,parityLay,{labels:parityLab,title:'Paritäts-DEA für L₂'})},{t:'Σ⁺ prüfen',x:['|w|_b ungerade ⇒ mindestens ein b ⇒ w ≠ ε. Die Σ⁺-Bedingung ist automatisch erfüllt.']}],
    answer:{x:'L₂ ist **regulär**. DEA mit 4 Zuständen (Parität von a und b), Start „a g, b g“, Endzustand „a gerade, b ungerade“; c-Übergänge bleiben im Zustand.',v:dfaDiagram(parity,parityLay,{labels:parityLab,title:'Lösung b'})},
    warning:'Die Original-Lösung behauptet „nicht regulär“ mit Pumping auf a²ⁿb²ⁿ⁻¹. Der Beweis ist ungültig: Für die Zerlegung mit v = aa bleibt die Parität beim Pumpen erhalten – man findet **nicht für jede** Zerlegung einen Widerspruch. Tatsächlich ist L₂ regulär (siehe DEA).'}],
  tips:['Vor jedem Pumping-Beweis 10 Sekunden überlegen: Reicht **endlich viel** Gedächtnis (z. B. Parität, Rest modulo k)? Dann ist die Sprache regulär.','Pumping-Lemma-Beweis: Wort mit n wählen, Zerlegung allgemein lassen, |uv| ≤ n ausnutzen, konkretes i angeben.']}
 ]},
 {title:'Turingmaschinen und Berechenbarkeit',subtitle:'Konfigurationen, Konstruktion, Halteproblem',icon:'code',tasks:[
 {id:'au-10',n:'10',title:'Begriffslandkarte Turingmaschinen',topics:['TM','Entscheidbarkeit','Church'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 11–12',
  prompt:['Schaubild zu Turingmaschinen und Komplexität mit: Turingmaschine, Konfiguration, Algorithmus/Funktion, Akzeptieren, entscheidbar, semi-entscheidbar, berechenbar, Churchsche These.'],
  background:[{term:'Entscheidbar',text:'Eine TM hält auf **jeder** Eingabe und antwortet ja/nein.',link:T('decidable','Entscheidbarkeit')},{term:'Semi-entscheidbar',text:'Eine TM hält und sagt „ja“ für w ∈ L; für w ∉ L darf sie ewig laufen.'},{term:'Churchsche These',text:'Alles intuitiv Berechenbare ist Turing-berechenbar (nicht beweisbar, da „intuitiv“ kein mathematischer Begriff ist).'}],
  parts:[{label:'',q:'Baue das Schaubild.',steps:[{t:'Zwei Rollen der TM',x:['Sie **berechnet Funktionen** und **akzeptiert Sprachen**.']},{t:'Sprachen einteilen',x:['entscheidbar ⊂ semi-entscheidbar. Unterschied: Hält die TM immer?']},{t:'Church dazu',x:['Verbindet „Turing-berechenbar“ mit „intuitiv berechenbar“.'],v:mapTm}],
   answer:{x:'Ein mögliches Schaubild:',v:mapTm}}],
  tips:['Häufige Kurzfrage: „Ist jede entscheidbare Sprache semi-entscheidbar?“ – Ja. Umgekehrt nein (Halteproblem).']},

 {id:'au-12',n:'12',title:'Umgang mit Turingmaschinen',topics:['Konfigurationen','TM beschreiben'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 14',
  prompt:['Für die TM unten: a) die ersten 6 Konfigurationen für `01101`. b) Beschreibe, was die TM tut, und annotiere den Graphen.'],
  given:tmDiagram(zeroEraserTm,tmLay,{title:'Turingmaschine aus Aufgabe 12'}),givenNote:'Dieselbe Maschine wie in der Altklausur, Aufgabe 5.',
  background:[{term:'Konfiguration',text:'`u(q)v`: links vom Kopf u, Kopf auf dem ersten Zeichen von v.',link:T('tm','Turingmaschinen')},{term:'Kopf links vom Wort',text:'Geht die TM links aus dem Wort, steht der Kopf auf einem Blank: `(q4)⊔00101`.'}],
  parts:[
   {label:'a)',q:'Erste 6 Konfigurationen für 01101.',steps:trace12.configs.slice(0,6).map((c,i)=>({t:`Konfiguration ${i+1}: ${configLabel(c)}`,short:`K${i+1}`,x:i?[(()=>{const p=trace12.configs[i-1],r=p.cells[p.head],[w,m]=zeroEraserTm.delta[p.state][r];return `In ${p.state} lies ${r} → schreibe ${w}, gehe ${m}, neuer Zustand ${c.state}.`;})()]:['Start: Kopf auf dem ersten Zeichen, Zustand q0.'],v:{type:'tape',configs:trace12.configs,index:i}})),
    answer:{x:'Die ersten 6 Konfigurationen:',v:{type:'configs',configs:trace12.configs.slice(0,6)}},
    warning:'Die Original-Lösung (`00(q4)101`, `001(q5)01`, `0011(q6)1`, …) passt nicht zur abgebildeten Maschine: Es gibt keinen Zustand q6, und nach `0(q2)1101` schreibt die TM 0 und geht nach **links**. Die Lösung gehört offenbar zu einer anderen Maschine. Die korrekte Folge steht oben.'},
   {label:'b)',q:'Was tut die TM?',steps:[{t:'Ganz laufen lassen',x:[`Nach ${trace12.configs.length} Konfigurationen steht nur noch 111 auf dem Band.`],v:{type:'configs',configs:trace12.configs}},{t:'Zustände annotieren',x:['q0: führende 1en überspringen · q2: über 0en laufen, nächste 1 löschen (→0) · q4/q5: zurück zur ersten 0, dort 1 schreiben · q3: am Ende alle 0en löschen · q1: fertig.']}],
    answer:{x:'Die TM löscht alle 0en und schreibt die 1en lückenlos hintereinander (01101 → 111).'}}],
  tips:['Konfigurationen mit einem Lineal-Finger auf dem Schmierblatt nachfahren: Kopfposition markieren, Zeichen ersetzen, Finger bewegen.']},

 {id:'au-13',n:'13',title:'Turingmaschinen aufstellen',topics:['TM konstruieren','TM für reguläre Sprachen'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 15',
  prompt:['a) Konstruiere eine TM über {a, …, z, ß} (Wort ≤ 15 Zeichen), die jedes ß durch s ersetzt und hinter das Wort die Anzahl der ß schreibt (Kodierung frei). b) Zeige: Zu jeder regulären Sprache gibt es eine TM, die sie erkennt (Skizze + Beweis).'],
  given:tmDiagram(eszettTm,eszLay,{title:'TM der Musterlösung'}),givenNote:'`*` steht für jedes Zeichen außer ⊔; in q0 gilt die Schleife für alle Zeichen außer ß (auch für #).',
  background:[{term:'Unärkodierung',text:'Zahl k als k Striche – hier k-mal #. Am einfachsten zu schreiben.'},{term:'Hin-und-her-Muster',text:'Viele TMs: etwas suchen → ans Ende laufen → markieren → zurück an den Anfang → wiederholen.'}],
  parts:[
   {label:'a)',q:'TM für ß → s plus Zähler.',steps:[
    {t:'Plan',x:['q0 sucht das nächste ß und ersetzt es durch s. q1 läuft ans Ende und schreibt #. q2 läuft zurück an den Anfang. Kein ß mehr → q3 (fertig).']},
    {t:'Probelauf mit „maß“',x:['Erstes ß gefunden → s, dann ans Ende.'],v:{type:'tape',configs:eszRun.configs,index:3}},
    {t:'Strich schreiben und zurück',x:['Am Ende wird # geschrieben, q2 läuft zurück.'],v:{type:'tape',configs:eszRun.configs,index:5}},
    {t:'Ende',x:[`Nach ${eszRun.configs.length} Konfigurationen: „mas#“ – ein ß, ein Strich.`],v:{type:'group',items:[{type:'tape',configs:eszRun.configs,index:eszRun.configs.length-1},{type:'configs',configs:eszRun.configs}]}}],
    answer:{x:'Q = {q0,q1,q2,q3}, Σ = {a,…,z,ß}, Γ = Σ ∪ {⊔,#}, s = q0, F = {q3}, δ wie im Graphen. Die Anzahl der # hinter dem Wort ist die Anzahl der ß.',v:tmDiagram(eszettTm,eszLay,{title:'Lösung a'})}},
   {label:'b)',q:'Reguläre Sprache ⇒ TM.',steps:[{t:'Beweisidee',x:['Nach Kleene gibt es einen DEA. Eine TM kann einen DEA **simulieren**.']},{t:'Konstruktion',x:['Gleiche Zustände; Übergang `p →x q` wird `x|x|R` (Zeichen unverändert, nach rechts). Bei ⊔ in einem Endzustand → akzeptieren.']}],
    answer:{x:'Zu L regulär gibt es (Kleene) einen DEA. Die TM übernimmt dessen Zustände, jeder Übergang liest das Zeichen, schreibt es unverändert zurück und geht nach rechts. Liest sie ⊔ in einem DEA-Endzustand, akzeptiert sie. Damit erkennt die TM genau L.'}}],
  tips:['TM-Konstruktion: zuerst den **Plan in Worten**, dann Zustände benennen, dann erst Kanten zeichnen.','Endbedingung nicht vergessen: Was passiert, wenn kein ß mehr da ist?']},

 {id:'au-14',n:'14',title:'Barbier-Paradoxon und Halteproblem',topics:['Halteproblem','Diagonalisierung'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 16',
  prompt:['Der Barbier rasiert genau die, die sich nicht selbst rasieren. Rasiert er sich selbst? Welche Parallelen gibt es zum Halteproblem?'],
  background:[{term:'Halteproblem',text:'HALT = {(M, w) : M hält auf w} ist nicht entscheidbar.',link:T('decidable','Entscheidbarkeit')},{term:'Beweistechnik',text:'Annahme: Entscheider H existiert. Baue TEST(M): Wenn H(M, M) „hält“ sagt, laufe ewig; sonst halte. Frage: Was macht TEST(TEST)?'}],
  parts:[{label:'',q:'Parallelen zum Halteproblem.',steps:[{t:'Das Paradox',x:['Rasiert er sich → er gehört zu denen, die sich selbst rasieren → er darf sich nicht rasieren. Und umgekehrt.']},{t:'TEST auf sich selbst',x:['TEST(TEST) hält ⇔ H sagt „hält nicht“ ⇔ TEST(TEST) hält nicht. Widerspruch – also kann H nicht existieren.'],v:{type:'chain',joiner:'⇒',items:[['H existiert','Annahme'],['TEST baut auf H'],['TEST(TEST)','Selbstbezug'],['hält ⇔ hält nicht','Widerspruch',true]]}}],
   answer:{x:'Beide Widersprüche entstehen durch **Selbstreferenz**: Der Barbier wird auf sich selbst angewandt, beim Halteproblem die Maschine TEST auf ihre eigene Beschreibung. „Rasiert er sich?“ entspricht „Hält TEST(TEST)?“ – jede Antwort führt zum Gegenteil. Deshalb ist HALT unentscheidbar.'}}],
  tips:['In der Klausur die vier Schritte nennen: Annahme → Konstruktion TEST → Selbstanwendung → Widerspruch.']},

 {id:'au-22t',n:'22 (TM)',title:'Caesar-Chiffre und Turingmaschine',topics:['Berechenbarkeit','Konfigurationen','Sprache einer TM'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 25–26',
  prompt:['a) Ist die Caesar-Chiffre mit Schlüssel 5 Turing-berechenbar? (4 P.) b) Mit beliebigem Schlüssel? (2 P.) c) Für die TM unten: i) Berechnung von `01101` mit allen Konfigurationen (4 P.), ii) welche Sprache erkennt sie, mit Begründung (4 P.)?'],
  given:tmDiagram(shiftZeroTm,shiftLay,{title:'Turingmaschine aus Aufgabe 22c'}),givenNote:'Q = {s, q1, …, q7}, Γ = {0, 1, ⊔, X}, F = {q7}.',
  background:[{term:'Turing-berechenbar',text:'Es gibt eine TM, die bei jeder Eingabe hält und das Ergebnis aufs Band schreibt.',link:T('tm','Turingmaschinen')},{term:'Endliche Tabelle',text:'Eine feste Buchstabenzuordnung (A→F, …) passt in endlich viele Übergänge.'}],
  parts:[
   {label:'a)',q:'Caesar mit Schlüssel 5.',points:'4 Punkte',steps:[{t:'TM beschreiben',x:['Ein Zustand läuft von links nach rechts, ersetzt jedes Zeichen x durch x+5 (A→F, B→G, …, Z→E) und hält beim ersten ⊔.']}],
    answer:{x:'Ja. Eine TM läuft einmal über das Wort, ersetzt jedes Zeichen gemäß A→F, B→G, … (26 Übergänge) und hält beim Blank. Sie hält immer – also berechenbar.'}},
   {label:'b)',q:'Caesar mit beliebigem Schlüssel.',points:'2 Punkte',steps:[{t:'Schlüssel aufs Band',x:['Eingabe „k#wort“. Die TM liest k und verzweigt in einen von 26 Teilautomaten wie in a).']}],
    answer:{x:'Ja. Schlüssel vor das Wort schreiben (z. B. k#w). Abhängig von k wechselt die TM in einen der 26 Zustandsblöcke, die wie in a) verschieben.'}},
   {label:'c) i.',q:'Berechnung von 01101.',points:'4 Punkte',steps:[
    {t:'Start: erste 0 wird X',x:['s liest 0, schreibt X (Platzhalter für die 0), geht nach rechts.'],v:{type:'tape',configs:shiftRun.configs,index:1}},
    {t:'Schleife q1 → q2 → q3 (Zeichen war 1)',x:['q1 liest 1 → schreibt 0, geht links. q2 auf X → schreibt 1, rechts. q3 auf 0 → schreibt X. **Die 1 ist nach links gerutscht, X nach rechts.**'],v:{type:'group',items:[{type:'tape',configs:shiftRun.configs,index:4},tmDiagram(shiftZeroTm,shiftLay,{highlight:{edges:['q1>q2','q2>q3','q3>q1']}})]}},
    {t:'Noch einmal mit 1',x:['Gleiches Muster.'],v:{type:'tape',configs:shiftRun.configs,index:7}},
    {t:'Schleife q1 → q4 → q5 (Zeichen war 0)',x:['q1 liest 0 → 0, links. q4 auf X → schreibt 0, rechts. q5 auf 0 → X.'],v:{type:'group',items:[{type:'tape',configs:shiftRun.configs,index:10},tmDiagram(shiftZeroTm,shiftLay,{highlight:{edges:['q1>q4','q4>q5','q5>q1']}})]}},
    {t:'Letzte 1, dann Ende',x:['Nach der letzten 1 liest q1 ein ⊔ → links, q6 ersetzt X durch 0 → q7 akzeptiert.'],v:{type:'group',items:[{type:'tape',configs:shiftRun.configs,index:shiftRun.configs.length-1},{type:'configs',configs:shiftRun.configs}]}}],
    answer:{x:`${shiftRun.configs.length} Konfigurationen, Ergebnis 11010:`,v:{type:'configs',configs:shiftRun.configs}}},
   {label:'c) ii.',q:'Welche Sprache erkennt die TM?',points:'4 Punkte',steps:[{t:'Wann geht es los?',x:['s hat nur einen Übergang für 0. Beginnt das Wort mit 1 (oder ist leer), gibt es keinen Übergang → nicht akzeptiert.']},{t:'Was passiert danach?',x:['Die Schleifen schieben X Schritt für Schritt nach rechts, egal ob 0 oder 1 folgt. Am Ende wird X wieder zu 0 → akzeptiert. Effekt: Die führende 0 wandert ans Ende.']}],
    answer:{x:'L(ℳ) = {0w : w ∈ {0,1}*} – alle Wörter, die mit 0 beginnen. Die TM schiebt die erste 0 (als X markiert) ans Wortende und akzeptiert dort.'},
    warning:'In der Lösung steht „in der zweiten [Schleife] die 0 durch eine 0“ – gemeint ist: Die Schleife q1→q4→q5 tauscht X mit einer folgenden 0.'}],
  tips:['Bei langen TM-Läufen nach **Schleifen** suchen und eine Runde komplett verstehen – der Rest wiederholt sich.','„Welche Sprache?“: Prüfe zuerst, bei welcher Eingabe die TM **gar nicht startet** (fehlende Übergänge).']}
 ]},
 {title:'Kontextfreie Sprachen',subtitle:'CNF, CYK, Mehrdeutigkeit, Kellerautomaten',icon:'layers',tasks:[
 {id:'au-15',n:'15',title:'Begriffslandkarte kontextfreie Sprachen',topics:['CNF','CYK','NPDA/DPDA','Syntaxbaum'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 16–17',
  prompt:['Schaubild zu kontextfreien Sprachen mit: kontextfreie Sprachen/Grammatiken, Syntaxbäume, eindeutig, Chomsky-Normalform, CYK, NPDA, DPDA.'],
  background:[{term:'Eindeutig',text:'Eine **Grammatik** ist eindeutig, wenn jedes Wort genau einen Syntaxbaum hat.',link:T('cnf','Grammatiken, CNF & Syntaxbäume')}],
  parts:[{label:'',q:'Baue das Schaubild.',steps:[{t:'Zentrum: kontextfreie Sprache',x:['Grammatik erzeugt, NPDA erkennt.']},{t:'Werkzeuge',x:['CNF als Normalform, CYK nutzt CNF, Syntaxbaum zeigt Ableitungen.'],v:mapCf}],
   answer:{x:'Ein mögliches Schaubild:',v:mapCf},
   warning:'Im Original zeigt ein Pfeil „Kontextfr. Sprache → ist → eindeutig“. Eindeutigkeit ist eine Eigenschaft der **Grammatik** (bzw. „inhärent mehrdeutige“ Sprachen haben keine eindeutige Grammatik). Nicht jede kontextfreie Sprache ist eindeutig.'}],
  tips:['NPDA ≠ DPDA merken: Palindrome brauchen Nichtdeterminismus.']},

 {id:'au-16',n:'16',title:'Chomsky-Normalform und CYK',topics:['CYK','CNF','Ableitung'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 18',
  prompt:['Grammatik über {a,b,c,d}: `S → Zₐ S | Zₐ C | S Zₐ | d | Z_d E | c | Z_c F`, `D → d | Z_d E`, `C → d | Z_d E | c`, `Zₐ → a`, `Z_c → c`, `Z_d → d`, `E → DD`, `F → S Z_d`. Liegt `addd` in L(G)?'],
  background:[{term:'CYK',text:'Zeile k enthält Variablen für Teilwörter der Länge k. Für jede Teilung: Paare (B, C) mit Regel A → BC suchen.',link:T('cyk','CYK & Ableitungen')}],
  warning:'Auf dem Blatt steht V = {S, A, B, C, D}; benutzt werden aber S, C, D, E, F, Zₐ, Z_c, Z_d.',
  parts:[{label:'',q:'CYK für addd.',steps:[
   {t:'Zeile 1',x:['a: Zₐ. d: S, D, C, Z_d (alle haben eine Regel → d).'],v:{type:'cyk',word:'addd',table:c16.table,shown:4,start:'S'}},
   {t:'Zeile 2',x:['ad: Zₐ · {S,C} → `S → ZₐS`, `S → ZₐC` → **S**. dd: {…}·{…}: `E → DD`, `F → S Z_d` → **E, F**.'],v:{type:'cyk',word:'addd',table:c16.table,shown:7,focus:[2,0],parts:[[1,0],[1,1]],start:'S'}},
   {t:'Zeile 3',x:['add: ad|d = S · Z_d → `F → S Z_d` → **F**. ddd: d|dd = Z_d · E → `S, D, C → Z_d E` → **S, D, C**.'],v:{type:'cyk',word:'addd',table:c16.table,shown:9,focus:[3,1],parts:[[1,1],[2,2]],start:'S'}},
   {t:'Zeile 4',x:['a|ddd = Zₐ · {S, C} → **S**. S steht oben → Wort liegt in L(G).'],v:{type:'cyk',word:'addd',table:c16.table,shown:10,focus:[4,0],parts:[[1,0],[3,1]],start:'S'}},
   {t:'Ableitung',x:['Rückwärts: S → ZₐS, dann S → Z_d E, E → DD.'],v:{type:'chain',items:[['S'],['ZₐS'],['aS'],['aZ_dE'],['adE'],['adDD'],['addD'],['addd',null,true]]}}],
   answer:{x:'S ∈ V(1,4) → **addd ∈ L(G)**. Ableitung: S ⇒ ZₐS ⇒ aS ⇒ aZ_dE ⇒ adE ⇒ adDD ⇒ addD ⇒ addd.',v:{type:'cyk',word:'addd',table:c16.table,start:'S'}}}],
  tips:['Bei vielen Variablen pro Zelle: Erst alle rechten Seiten der Form „XY“ auflisten, dann Zellenpaare dagegen prüfen.']},

 {id:'au-17',n:'17',title:'Eindeutige und mehrdeutige Grammatiken',topics:['Syntaxbaum','Mehrdeutigkeit'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 19–20',
  prompt:['`S → S+S | S−S | S∗S | Z`, `Z → 0 | … | 9 | 0Z | … | 9Z`. a) Syntaxbaum für `211 − 42 + 10 ∗ 4`. b) Ist die Grammatik eindeutig?'],
  background:[{term:'Mehrdeutig',text:'Ein Wort mit **zwei verschiedenen** Syntaxbäumen genügt als Beweis.'}],
  parts:[
   {label:'a)',q:'Ein Syntaxbaum.',steps:[{t:'Klammerung wählen',x:['211 − (42 + (10 ∗ 4))'],v:{type:'tree',root:tree17a,title:'Syntaxbaum 1'}}],answer:{x:'Siehe Baum (Klammerung 211 − (42 + (10 ∗ 4))).',v:{type:'tree',root:tree17a,title:'Syntaxbaum 1'}}},
   {label:'b)',q:'Eindeutig oder mehrdeutig?',steps:[{t:'Zweite Klammerung',x:['211 − ((42 + 10) ∗ 4) ergibt einen anderen Baum für dasselbe Wort.'],v:{type:'tree',root:tree17b,title:'Syntaxbaum 2'}},{t:'Schluss',x:['Zwei verschiedene Bäume → Grammatik mehrdeutig.']}],
    answer:{x:'Die Grammatik ist **mehrdeutig**: Das Wort hat (mindestens) zwei verschiedene Syntaxbäume.',v:{type:'group',row:true,items:[{type:'tree',root:tree17a,title:'Baum 1',label:'Baum 1'},{type:'tree',root:tree17b,title:'Baum 2',label:'Baum 2'}]}},
    warning:['Im zweiten Original-Baum hängt die 4 direkt als `Z` unter `S → S ∗ Z`. Diese Regel gibt es nicht – richtig ist `S → S ∗ S` und darunter `S → Z`.','Die Lösung schließt „die **Sprache** ist nicht eindeutig“. Korrekt: Die **Grammatik** ist mehrdeutig. Die Sprache hat durchaus eine eindeutige Grammatik (mit Vorrangregeln).']}],
  tips:['Mehrdeutigkeit zeigen = zwei Bäume zeichnen. Eindeutigkeit zeigen ist viel schwerer – kommt selten dran.']},

 {id:'au-18',n:'18',title:'Kontextfreie Sprachen und Kellerautomaten',topics:['Abschluss','NPDA','Keller'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 20–21',
  prompt:['a) Zeige an einem Beispiel, dass der Schnitt zweier kontextfreier Sprachen nicht kontextfrei sein muss. b) Gib einen NPDA für `{aⁿ b²ⁿ : n ≥ 1}` an.'],
  background:[{term:'Abschluss kontextfrei',text:'∪, ·, * ja; ∩ und Komplement nein.',link:T('stack','Kellerautomaten & Abschlüsse')},{term:'Kellerprinzip',text:'Last in, first out. Ablegen beim „Zählen“, Abbauen beim „Vergleichen“.'}],
  warning:'Auf dem Blatt steht „Komplement zweier kontextfreier Sprachen“. Gemeint ist der **Schnitt** – so löst es auch die Musterlösung.',
  parts:[
   {label:'a)',q:'Schnitt nicht kontextfrei.',steps:[{t:'Zwei kontextfreie Sprachen bauen',x:['L₁ = {aⁱbⁱcʲ} (a und b gleich viele), L₂ = {aʲbⁱcⁱ} (b und c gleich viele). Beide kontextfrei (Verkettung kontextfreier/regulärer Teile).']},{t:'Schneiden',x:['L₁ ∩ L₂ = {aⁱbⁱcⁱ} – das klassische nicht kontextfreie Beispiel.'],v:{type:'tiles',items:[['L₁ = aⁱbⁱ · c*','kontextfrei','lime'],['L₂ = a* · bⁱcⁱ','kontextfrei','lime'],['L₁ ∩ L₂ = aⁱbⁱcⁱ','nicht kontextfrei','peach']]}}],
    answer:{x:'L₁ = {aⁱbⁱ}·{c}* und L₂ = {a}*·{bⁱcⁱ} sind kontextfrei, aber L₁ ∩ L₂ = {aⁱbⁱcⁱ : i ≥ 0} nicht.'}},
   {label:'b)',q:'NPDA für aⁿb²ⁿ.',steps:[{t:'Pro a zwei Marken',x:['In p wird für jedes a **zweimal** 1 abgelegt.'],v:npda},{t:'Pro b eine Marke',x:['Beim ersten b nach q wechseln; jedes b nimmt eine 1 vom Keller.'],v:{type:'stack',frames:npdaFrames}},{t:'Akzeptieren',x:['Liegt nur noch # oben, mit ε nach f und Keller leeren. Für n ≥ 1: Ohne a liegt keine 1 auf dem Keller – das erste b blockiert.']}],
    answer:{x:'NPDA mit Zuständen p, q, f, Kellerboden #: in p für jedes a „11“ ablegen; beim b nach q, jedes b entfernt eine 1; bei # per ε nach f (Keller leer). So werden genau doppelt so viele b wie a akzeptiert.',v:npda}}],
  tips:['NPDA-Konstruktion: Keller als „Zähler“ denken. Verhältnis k:1 → k Symbole pro Zeichen ablegen.']}
 ]},
 {title:'Komplexität',subtitle:'Graphprobleme und NP-vollständige Modelle',icon:'target',tasks:[
 {id:'au-19',n:'19',title:'Graphenprobleme',topics:['Clique','Vertex Cover','Hamilton','Euler','Färbung','Spannbaum'],source:'Aufgaben_Loesungen.pdf, PDF-Seiten 21–22',
  prompt:['Gib im Graphen (falls möglich) an und sage, ob das Problem NP-vollständig ist: Knoten mit maximalem Grad, größte Clique, minimales Vertex Cover, Hamilton-Kreis, Euler-Kreis, chromatische Zahl, minimaler Spannbaum.'],
  given:graphDiagram(sheet19Graph,g19Lay,{title:'Graph aus Aufgabe 19',caption:'13 Knoten, 25 Kanten.'}),
  background:[{term:'In P',text:'Maximalgrad, Euler-Kreis (alle Grade gerade), minimaler Spannbaum (Kruskal/Prim).',link:T('np','P, NP & Graphprobleme')},{term:'NP-vollständig (Entscheidungsversion)',text:'Clique, Vertex Cover, Hamilton-Kreis, k-Färbbarkeit (k ≥ 3).'}],
  warning:'Die Musterlösung enthält nur die ersten drei Punkte – zwei davon falsch (siehe unten). Die übrigen Lösungen sind eigenständig berechnet und per Programm geprüft.',
  parts:[{label:'',q:'Alle sieben Größen bestimmen.',steps:[
   {t:'Maximaler Grad (P)',x:[`v4 hat Grad ${degree(sheet19Graph,'v4')} (Nachbarn v1, v3, v5, v6, v7, v9, v12). Zählen geht in linearer Zeit.`],v:graphDiagram(sheet19Graph,g19Lay,{highlightNodes:['v4'],highlightEdges:sheet19Graph.edges.filter(e=>e.includes('v4')),dim:true,title:'Grad von v4'})},
   {t:'Größte Clique (NP-vollständig)',x:['v2, v3, v10, v13 sind **paarweise** verbunden (6 Kanten) → Clique der Größe 4. Eine 5er-Clique gibt es nicht.'],v:graphDiagram(sheet19Graph,g19Lay,{highlightNodes:clique19,highlightEdges:[['v2','v3'],['v2','v10'],['v2','v13'],['v3','v10'],['v3','v13'],['v10','v13']],dim:true,title:'Clique {v2, v3, v10, v13}'})},
   {t:'Minimales Vertex Cover (NP-vollständig)',x:['Jede der 25 Kanten muss einen markierten Endpunkt haben. Die 4-Clique braucht allein 3 Knoten. Ein Programm findet: minimal 7, genau {v2, v3, v4, v8, v9, v11, v13}.'],v:graphDiagram(sheet19Graph,g19Lay,{highlightNodes:vc19,title:'Vertex Cover (7 Knoten)'})},
   {t:'Hamilton-Kreis (NP-vollständig)',x:['v1 – v2 – v12 – v13 – v3 – v5 – v4 – v7 – v11 – v6 – v9 – v10 – v8 – v1.'],v:graphDiagram(sheet19Graph,g19Lay,{highlightNodes:hamilton19,highlightEdges:cycleEdges(hamilton19),title:'Hamilton-Kreis'}),tip:'v7 hat Grad 2 → die Kanten v4–v7 und v7–v11 müssen im Kreis liegen.'},
   {t:'Euler-Kreis (in P)',x:['Ein Euler-Kreis braucht **alle Grade gerade**. Hier haben 10 Knoten ungeraden Grad (z. B. v1: 3) → **kein** Euler-Kreis.']},
   {t:'Chromatische Zahl (NP-vollständig)',x:['Die 4-Clique braucht 4 Farben → χ ≥ 4. Eine Färbung mit 4 Farben existiert → χ = 4.'],v:{type:'group',items:[graphDiagram(sheet19Graph,g19Lay,{tones:Object.fromEntries(Object.entries(coloring19).map(([v,c])=>[v,['lime','purple','sky','peach'][c-1]])),title:'4-Färbung'}),{type:'table',caption:'Färbung (Farbe = Nummer)',head:['Farbe','Knoten'],rows:[1,2,3,4].map(c=>[String(c),Object.keys(coloring19).filter(v=>coloring19[v]===c).join(', ')])}]}},
   {t:'Minimaler Spannbaum (in P)',x:['Der Graph ist ungewichtet: Jeder Spannbaum hat 13 − 1 = 12 Kanten und ist minimal. Z. B. per Breitensuche ab v1.'],v:graphDiagram(sheet19Graph,g19Lay,{highlightEdges:spanning19,title:'Ein Spannbaum (12 Kanten)'})}],
   answer:{x:['Max. Grad: v4 (7) – P','Größte Clique: {v2, v3, v10, v13} (4) – NP-vollständig','Min. Vertex Cover: {v2, v3, v4, v8, v9, v11, v13} (7) – NP-vollständig','Hamilton-Kreis: v1, v2, v12, v13, v3, v5, v4, v7, v11, v6, v9, v10, v8 – NP-vollständig','Euler-Kreis: existiert nicht (ungerade Grade) – P','Chromatische Zahl: 4 – NP-vollständig','Min. Spannbaum: jeder Spannbaum mit 12 Kanten – P']},
   warning:['Clique: Die Lösung sagt „eine Clique der Größe 4 gibt es nicht“. Doch: {v2, v3, v10, v13} – alle sechs Kanten sind im Bild vorhanden.','Vertex Cover: {v2, v4, v8} ist eine **dominierende Menge**, kein Vertex Cover (z. B. die Kante v5–v11 ist nicht abgedeckt). Das minimale Vertex Cover hat 7 Knoten.']}],
  tips:['Kleine Grade zuerst: Knoten mit Grad 2 bestimmen den Hamilton-Kreis lokal.','Clique-Größe ist eine **untere Schranke** für die chromatische Zahl.','„In P“ vs. „NP-vollständig“ als Tabelle lernen – das ist reine Abrufleistung.']},

 {id:'au-20',n:'20',title:'Steinerbaum, Knapsack, Integer Programming',topics:['Spezialfälle in P','Integer Programming'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 22',
  prompt:['a) Gib Instanzen von Steinerbaum, Knapsack und Partition an, die eine DTM in Polynomialzeit löst. b) Begründe kurz. c) Formuliere eine Investitionsrechnung (ganze Fabriken, Umsatz, mehrere Kostenarten mit Budgets, Gewinn maximieren) als Integer-Programm. d) Gib eine Instanz an, deren Optimum nicht trivial ist und mindestens zwei Investments enthält.'],
  background:[{term:'Spezialfälle',text:'NP-vollständig heißt nur: **im allgemeinen Fall** vermutlich nicht effizient. Besondere Instanzen können leicht sein.',link:T('reduction','Reduktionen & NP-Vollständigkeit')},{term:'0-1-Variable',text:'xᵢ ∈ {0,1}: Investment i wird gemacht (1) oder nicht (0).'}],
  warning:'Für diese Aufgabe enthält die Vorlage **keine** Musterlösung. Die Lösung hier ist eigenständig erstellt – andere sinnvolle Beispiele sind genauso richtig.',
  parts:[
   {label:'a/b)',q:'Leichte Instanzen und Begründung.',points:'2 + 2 Punkte',steps:[{t:'Steinerbaum',x:['Alle Knoten sind Terminale → Steinerbaum = **minimaler Spannbaum** (Kruskal, polynomiell). Oder nur 2 Terminale → **kürzester Weg** (Dijkstra).']},{t:'Knapsack',x:['Alle Gegenstände gleich schwer → sortiere nach Wert und nimm die ⌊Kapazität/Gewicht⌋ wertvollsten (O(n log n)).']},{t:'Partition',x:['Alle Gegenstände gleich groß → teilbar genau dann, wenn ihre Anzahl gerade ist (O(n)).']}],
    answer:{x:'Steinerbaum mit allen Knoten als Terminale (= MST), Knapsack mit gleichen Gewichten (Greedy nach Wert), Partition mit lauter gleichen Zahlen (Anzahl gerade?). Jeweils beschreibt der Algorithmus eine DTM mit polynomieller Laufzeit.'}},
   {label:'c)',q:'Integer-Programm für die Investitionsrechnung.',steps:[{t:'Variablen',x:['xᵢ ∈ {0,1} für Standort i = 1…n.']},{t:'Ziel und Nebenbedingungen',x:['Uᵢ = Umsatz, kᵢⱼ = Kosten von i in Kostenart j, Bⱼ = Budget von j.','max Σᵢ (Uᵢ − Σⱼ kᵢⱼ) · xᵢ unter Σᵢ kᵢⱼ · xᵢ ≤ Bⱼ für alle j.']}],
    answer:{x:'max Σᵢ (Uᵢ − Σⱼ kᵢⱼ)·xᵢ  s. t.  Σᵢ kᵢⱼ·xᵢ ≤ Bⱼ (j = Personal, Kredit, Bau),  xᵢ ∈ {0,1}.'}},
   {label:'d)',q:'Instanz mit nicht trivialem Optimum (≥ 2 Investments).',steps:[{t:'Zahlen wählen',x:['Budgets: Personal 10, Kredit 8, Bau 12.'],v:{type:'table',caption:'Standorte',head:['Standort','Umsatz','Personal','Kredit','Bau','Gewinn'],rows:[['A','20','4','3','5','8'],['B','15','5','4','6','0'],['C','12','3','2','4','3']]}},{t:'Alle Kombinationen prüfen',x:['A+B+C: Personal 12 > 10 ✗. A+B: Gewinn 8. **A+C: Gewinn 11** ✓. B+C: 3.']}],
    answer:{x:'Optimum: A und C (Gewinn 11). Nicht alle Investments sind möglich (Personalbudget), mindestens eines ist möglich, und das Optimum enthält zwei.'}}],
  tips:['„Spezialfall in P“: Suche eine Einschränkung, die die **Wahl** überflüssig macht (alle gleich, alles erlaubt, sehr wenige Terminale).']},

 {id:'au-21',n:'21',title:'Ein weiteres NP-vollständiges Problem',topics:['NP-Vollständigkeit','Reduktion','Modellierung'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 23',
  prompt:['Beschreibe ein NP-vollständiges Problem, das nicht in der Vorlesung vorkam: a) allgemein (Eingabe, Lösung), b) kleines Beispiel, c) Anwendungen, d) von welchem Problem reduziert wird, e) eine Zusatzinfo.'],
  background:[{term:'Reduktion',text:'A ≤ₚ B: Jede A-Instanz lässt sich in Polynomialzeit in eine B-Instanz übersetzen. Für „B ist NP-schwer“ reduziert man ein bekanntes Problem **auf** B.',link:T('reduction','Reduktionen')}],
  warning:'Offene Aufgabe ohne Musterlösung. Hier ein ausgearbeitetes Beispiel (Set Cover). Prüfe, dass dein Problem nicht schon in deiner Vorlesung vorkam.',
  parts:[{label:'',q:'Beispiel: Set Cover (Mengenüberdeckung).',steps:[
   {t:'a) Problem',x:['Eingabe: Grundmenge U, Teilmengen S₁, …, Sₘ ⊆ U, Zahl k. Frage: Gibt es höchstens k Teilmengen, deren Vereinigung U ist?']},
   {t:'b) Beispiel',x:['U = {1,…,5}, S₁ = {1,2,3}, S₂ = {2,4}, S₃ = {3,4}, S₄ = {4,5}, k = 2 → S₁ ∪ S₄ = U ✓.'],v:{type:'tiles',items:[['S₁ = {1,2,3}','gewählt','lime'],['S₂ = {2,4}',''],['S₃ = {3,4}',''],['S₄ = {4,5}','gewählt','lime']]}},
   {t:'c) Anwendungen',x:['Standorte für Feuerwachen/Funkmasten, sodass jeder Ort versorgt ist; Testfälle auswählen, die alle Anforderungen abdecken.']},
   {t:'d) Reduktion',x:['Vertex Cover ≤ₚ Set Cover: U = Kanten, für jeden Knoten v die Menge seiner Kanten.']},
   {t:'e) Zusatzinfo',x:['In NP: Zertifikat = die k Mengen, Überdeckung in Polynomialzeit prüfbar. Der Greedy-Algorithmus (immer die Menge mit den meisten neuen Elementen) liefert höchstens ln|U|-mal so viele Mengen wie optimal.']}],
   answer:{x:'Set Cover: Eingabe (U, S₁…Sₘ, k); Ja, wenn ≤ k Mengen U überdecken. NP-vollständig per Reduktion von Vertex Cover; in NP, weil eine Auswahl schnell geprüft wird.'}}],
  tips:['Gliederung a–e als Schablone nutzen – damit ist auch jedes Vorlesungsproblem in 5 Minuten wiederholt.']},

 {id:'au-23',n:'23',title:'CYK-Algorithmus',topics:['CYK','Wortproblem'],source:'Aufgaben_Loesungen.pdf, PDF-Seite 26',
  prompt:['G über {a,b,c,d,e}: `S → DE`, `A → AA | CC | e`, `C → CD | a`, `D → DD | d`, `E → e`. Liegt `aadea` in L(G)?'],
  background:[{term:'CYK',text:'Wort liegt in L(G) ⇔ S in der obersten Zelle.',link:T('cyk','CYK & Ableitungen')}],
  parts:[{label:'',q:'CYK für aadea.',steps:[
   {t:'Zeile 1',x:['a: C. d: D. e: A, E.'],v:{type:'cyk',word:'aadea',table:c23.table,shown:5}},
   {t:'Zeile 2',x:['aa: C·C → `A → CC` → **A**. ad: C·D → `C → CD` → **C**. de: D·{A,E} → `S → DE` → **S**. ea: nichts.'],v:{type:'cyk',word:'aadea',table:c23.table,shown:9,focus:[2,2],parts:[[1,2],[1,3]]}},
   {t:'Zeile 3',x:['aad: a|ad = C·C → **A**. ade, dea: keine passende Teilung.'],v:{type:'cyk',word:'aadea',table:c23.table,shown:12,focus:[3,0],parts:[[1,0],[2,1]]}},
   {t:'Zeile 4',x:['aade: aad|e = A·{A,E} → `A → AA` → **A**. adea: nichts.'],v:{type:'cyk',word:'aadea',table:c23.table,shown:14,focus:[4,0],parts:[[3,0],[1,3]]}},
   {t:'Zeile 5',x:['aade|a = A·C, aad|ea = A·∅ … keine Regel. Oberste Zelle **leer** → nicht in L(G).'],v:{type:'cyk',word:'aadea',table:c23.table,shown:15,focus:[5,0]}}],
   answer:{x:'V(1,5) = ∅, S fehlt → **aadea ∉ L(G)**. (Schon an der Grammatik sichtbar: S erzeugt nur Wörter, die auf e enden.)',v:{type:'cyk',word:'aadea',table:c23.table}}}],
  tips:['Schnelltest vor dem CYK: Welche Endzeichen/Anfangszeichen kann S überhaupt erzeugen? Hier muss jedes Wort auf e enden – aadea endet auf a.']}
 ]}
];
