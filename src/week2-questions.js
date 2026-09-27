import {epsilonClosure,nfaStep,determinize,minimize} from './algorithms.js';
import {exercise6Nfa,suffixNfa,exercise7Dfa,nfaLabel} from './week2-models.js';
const items=[];
function add(id,lesson,type,prompt,answer,explanation,hints,{level=2,kind='calculate',...rest}={}){
 items.push({id:`wk2-${id}`,lesson,type,prompt,answer,explanation,hints,hint:hints[0],level,kind,family:`wk2-${id}`,...rest});
}
function choice(id,lesson,prompt,options,explanation,hints,extra={}){
 add(id,lesson,'choice',prompt,0,explanation,hints,{kind:'concept',options,...extra});
}
const examples=[
 ['suffix',suffixNfa,'NEA: Start p, F={r}. p:0→{p,q},1→{p}; q:1→{r}; r hat keine Übergänge. Alle übrigen Übergänge leer.', ['','0','01','001','010','101','111','0101']],
 ['original6',exercise6Nfa,'Aufgabe 6: Start q0, F={q2}; q0:ε→{q2},4→{q1}; q1:2→{q2}; q2:0→{q0,q2}. Übrige Übergänge leer.', ['','0','4','42','420','042','424','42042']]
];
for(const [tag,nfa,description,words] of examples){
 for(const [i,word] of words.entries()){
  let states=epsilonClosure(nfa,[nfa.start]);const trace=[nfaLabel(states)];
  for(const char of word){states=nfaStep(nfa,states,char);trace.push(nfaLabel(states));}
  add(`${tag}-word-${i}`,'nea','set',`${description} Welche Zustandsmenge ist nach ${word||'ε'} möglich?`,states,
   `Mengenfolge: ${trace.join(' → ')}. ${states.some(s=>nfa.accept.includes(s))?'Mindestens ein Endzustand ist enthalten.':'Kein Endzustand ist enthalten.'}`,
   [`Beginne bei der ε-Hülle des Starts ${nfa.start}. Lies ${word?`die ${word.length} Zeichen von ${word} einzeln`:'kein Zeichen; nur die Start-Hülle ist gefragt'}.`, `Vereinige je Zeichen alle Nachfolger und ergänze die ε-Hülle. Der erste Zustand ist ${trace[0]}.`],
   {symbols:[...nfa.states,...nfa.alphabet,'ε','∅','{','}',',']});
 }
 const rows=determinize(nfa);
 add(`${tag}-reachable`,'nea','number',`${description} Wie viele erreichbare Zustandsmengen liefert die Potenzmengenkonstruktion (vor Minimierung)?`,rows.length,
  `Erreichbar sind ${rows.map(r=>nfaLabel(r.states)).join(', ')}. Alle Zeichenübergänge aus diesen Mengen bleiben in der Liste.`,
  ['Starte mit der ε-Hülle und führe eine Liste noch unbearbeiteter Mengen.','Prüfe jede gefundene Menge für alle Alphabetzeichen. Neue Mengen kommen als neue Zeile hinzu.'],{level:3});
}
for(const [i,states] of [['q0'],['q1'],['q2'],[],['q0','q1']].entries()){
 add(`closure-${i}`,'nea','set',`Aufgabe 6: Der einzige ε-Pfeil führt von q0 nach q2. Bestimme E(${nfaLabel(states)}).`,epsilonClosure(exercise6Nfa,states),
  `Alle Ausgangszustände bleiben enthalten. Nur wenn q0 dabei ist, kommt q2 hinzu: ${nfaLabel(epsilonClosure(exercise6Nfa,states))}.`,
  ['ε-Hülle bedeutet null oder mehr ε-Schritte.','Prüfe, ob q0 in deiner Ausgangsmenge liegt. Von q2 führt kein ε-Pfeil zurück.'],{symbols:['q0','q1','q2','∅','{','}',',']});
}
choice('nea-accept','nea','Eine erreichte DEA-Menge ist {q0,q2}; F des NEA ist {q2}. Was gilt?',
 ['Sie ist akzeptierend, weil q2 enthalten ist.','Sie lehnt ab, weil q0 nicht akzeptiert.','Sie ist nicht deterministisch und darf kein DEA-Zustand sein.'],
 'Eine Zustandsmenge ist ein einzelner DEA-Zustand. Schon ein NEA-Endzustand in der Menge genügt.',
 ['Akzeptanz eines NEA ist eine Existenzfrage.','Prüfe, ob T∩F leer oder nicht leer ist.']);
choice('nea-size','nea','Ein NEA hat 4 Zustände. Welche Aussage zur Potenzmengenkonstruktion stimmt?',
 ['Höchstens 16 Teilmengen; erreichbar können weniger sein.','Genau 16 erreichbare Zustände, immer.','Höchstens 4 Zustände.'],
 '2⁴=16 mögliche Teilmengen; die Erreichbarkeit hängt von den Übergängen ab.',
 ['Jeder Zustand kann unabhängig enthalten sein oder nicht.','Die Zahl möglicher Teilmengen ist eine Obergrenze.']);
const minTable='Start q1, F={q8}. Übergänge (a,b): q1:(q2,q3); q2:(q6,q4); q3:(q5,q6); q4:(q2,q6); q5:(q6,q3); q6:(q8,q7); q7:(q8,q7); q8:(q8,q8).';
const groups=minimize(exercise7Dfa).groups;
for(const state of exercise7Dfa.states){
 const answer=groups.find(g=>g.includes(state));
 add(`class-${state}`,'minimize','set',`${minTable} Welche Zustände gehören nach vollständiger Minimierung zur Äquivalenzklasse von ${state} (einschließlich ${state})?`,answer,
  `Stabile Klassen: ${groups.map(nfaLabel).join(' | ')}. Die gesuchte Klasse ist ${nfaLabel(answer)}.`,
  ['Trenne End- und Nichtendzustände, dann prüfe die Zielgruppen für a und b.','q6 und q7 erreichen bei a sofort q8. Verwende diese neue Gruppe in der nächsten Runde.'],
  {level:3,symbols:[...exercise7Dfa.states,'{','}',',']});
}
for(const [id,prompt,options,why,hints] of [
 ['min-epsilon','Welches Restwort trennt q8 in Aufgabe 7 sofort von jedem anderen Zustand?',['ε','a','b'],'q8 ist akzeptierend, die übrigen nicht. Bereits ohne Zeichen unterscheiden sich die Entscheidungen.',['Prüfe zuerst den aktuellen Akzeptanzstatus.','Ein Wort mit Länge null lässt den Zustand unverändert.']],
 ['min-witness','A={q1} und B={q2,q5} aus Aufgabe 7: Welches Restwort trennt sie?',['aa','ε','b'],'Aus A führt aa nach D={q6,q7} und lehnt ab; aus B führt aa nach E={q8} und akzeptiert.',['Verfolge jedes vorgeschlagene Wort von beiden Klassen.','Nur unterschiedliche Endentscheidungen zählen, nicht verschiedene Namen.']],
 ['min-round','Warum ist nach P0={q8}|{q1,…,q7} noch eine weitere Runde nötig?',['Nichtendzustände können unterschiedlich schnell q8 erreichen.','Alle Nichtendzustände sind immer gleichwertig.','Die Gruppennamen sind zu lang.'],'q6 erreicht mit a den Endzustand; q1 erreicht mit a nur q2. a trennt sie.',['Vergleiche die a-Nachfolger.','Ein Zeuge darf auch aus nur einem Zeichen bestehen.']],
 ['min-unreachable','Ein Zustand U besitzt nur Schleifen und keinen Weg vom Start zu ihm. Was darfst du tun?',['U vor der Minimierung entfernen.','U automatisch zum Start machen.','Alle Zustände ohne Annahme entfernen.'],'U wird durch kein Eingabewort erreicht. Ein erreichbarer Fangzustand ist dagegen für einen vollständigen DEA nötig.',['Unterscheide unerreichbar und nicht akzeptierend.','Entscheidend sind Wege vom Start, nicht nur ausgehende Pfeile.']],
 ['min-signature','Zwei Zustände eines Blocks führen bei a in dieselbe Klasse, bei b in verschiedene bereits unterscheidbare Klassen. Was folgt?',['Der Block muss aufgeteilt werden.','Beide Zustände sind äquivalent.','Nur die Pfeilbeschriftung muss geändert werden.'],'b plus ein Zeuge für die Nachfolgerklassen trennt die Ausgangszustände.',['Vergleiche für jedes Zeichen die Zielklassen.','Ein einziger nachgewiesener Unterschied genügt.']],
 ['min-stable','Wann endet die Partitionsverfeinerung?',['Wenn unter allen Alphabetzeichen kein Block mehr zerfällt.','Nach genau zwei Runden.','Sobald alle Gruppen zwei Zustände enthalten.'],'Stabilität und Erreichbarkeit ergeben den minimalen vollständigen DEA.',['Betrachte die neue Partition im Vergleich zur alten.','Gibt es innerhalb eines Blocks noch verschiedene Zielsignaturen?']]
])choice(id,'minimize',prompt,options,why,hints,{kind:id==='min-unreachable'?'debug':'concept'});
const grammarConcepts=[
 ['rule','Welche Regel ist rechtslinear in der Form dieser Woche?',['A→0B','A→BC','A→0B1'],'Rechts steht ein Terminal gefolgt von einer Variable.',['Zähle die Variablen rechts.','Steht die einzige Variable ganz am Ende?']],
 ['stop','Ein DEA-Zustand C akzeptiert. Welche zusätzliche Grammatikregel gehört zu C?',['C→ε','S→C','C→CC'],'Die ε-Regel beendet genau dort eine Ableitung, wo ein Lauf akzeptieren darf.',['Wie wird aus einer Satzform mit Variable ein fertiges Wort?','Ein akzeptierender Zustand darf ohne weiteres Zeichen beenden.']],
 ['transition','DEA-Übergang B —1→ C. Welche Regel bildet ihn ab?',['B→1C','C→1B','B→C1'],'Ein gelesener Buchstabe wird zum erzeugten Terminal, der Zielzustand zur folgenden Variable.',['Links steht der Ausgangszustand.','Rechts stehen Zeichen und Zielvariable in dieser Reihenfolge.']],
 ['epsilon','S→0S | 1A; A→0A | 1A | ε. Gehört ε zur Sprache?',['Nein, zuerst muss S→1A erfolgen.','Ja, weil irgendwo eine ε-Regel existiert.','Ja, jede reguläre Grammatik erzeugt ε.'],'Die Endregel ist nur in A erreichbar; auf dem Weg dorthin wird eine 1 erzeugt.',['Beginne tatsächlich bei S.','Kannst du die ε-Regel erreichen, ohne ein Terminal zu schreiben?']],
 ['original8','Aufgabe 8: Beginnt mit a und enthält b. Welche Ergänzung für B ist korrekt, wenn S→aA und A→aA|bB gelten?',['B→aB | bB | ε','B→aA | bB | ε','B→bB'],'Nachdem beide Bedingungen erfüllt sind, muss jeder weitere Buchstabe erlaubt bleiben. B→aA würde beispielsweise aba verwerfen.',['Prüfe ein gültiges Wort, das auf a endet.','B steht für bereits erfüllte Bedingungen; ein a hebt sie nicht auf.']],
 ['terminal','Was bedeutet die abkürzende Regel A→a beim Übersetzen zum NEA?',['a-Pfeil zu einem neuen akzeptierenden Abschlusszustand.','a-Pfeil zurück zum Start, der nicht akzeptiert.','ε-Pfeil zu A.'],'Die Ableitung endet unmittelbar nach a. Ein neuer Endzustand ohne ausgehende Zeichenpfeile bildet das ab.',['Nach dem Terminal bleibt keine Variable übrig.','Der entsprechende Lauf muss nach a akzeptieren können.']],
 ['language','S→bA; A→bA|aB; B→aB|bB|ε. Was wird erzeugt?',['Wörter mit erstem b und mindestens einem a.','Alle Wörter mit letztem a.','Genau Wörter mit gleich vielen a und b.'],'Der erste Schritt erzwingt b, der Wechsel A→aB mindestens ein a, danach ist alles erlaubt.',['Lies die drei Phasen S, A und B.','Nur B darf die Ableitung beenden.']],
 ['notregular','Welche Regel verletzt die rechtslineare Form?',['A→aAb','A→aB','A→ε'],'Nach der Variablen A steht noch ein Terminal b. Das ist eine kontextfreie, aber nicht rechtslineare Regelform.',['Prüfe die Position der Variablen.','Regelform und Sprachklasse einer ganzen Grammatik sind verschiedene Aussagen.']]
];
for(const [id,prompt,options,why,hints] of grammarConcepts)choice(`grammar-${id}`,'regular-grammar',prompt,options,why,hints,{kind:id==='original8'?'debug':'concept'});
for(const [i,[prompt,answer,why]] of [
 ['RegEx über {a,b}: Beginnt mit a und enthält mindestens ein b.','aa*b(a|b)*','Vor dem ersten b stehen mindestens ein a und eventuell weitere a; danach ist alles erlaubt.'],
 ['RegEx über {a,b}: Beginnt mit b und enthält mindestens ein a.','bb*a(a|b)*','Die Rollen der beiden Zeichen sind gegenüber Aufgabe 8 vertauscht.'],
 ['RegEx über {0,1}: S→0A; A→0A|1B; B→0B|1B|ε.','00*1(0|1)*','Die Grammatik erzwingt erste 0 und mindestens eine spätere 1.'],
 ['RegEx über {0,1}: A→0B|1A; B→0B|1C; C→0B|1A|ε; Start A.','(0|1)*01','Dies ist die Grammatik des DEA für die Endung 01.']
].entries()) add(`grammar-regex-${i}`,'regular-grammar','regex',prompt,answer,why,
 ['Überlege, welches Zeichen oder Teilwort verpflichtend ist.','Prüfe ε, das kürzeste gültige Wort und ein Wort, das nur eine Bedingung erfüllt.'],
 {kind:'construct',level:3,alphabet:i<2?['a','b']:['0','1'],symbols:[...(i<2?['a','b']:['0','1']),'ε','∅','∪','(',')','*','+']});
const kleeneConcepts=[
 ['directions','Was musst du für „RegEx und DEA beschreiben genau dieselben Sprachen“ zeigen?',['RegEx→DEA und DEA→RegEx für beliebige Eingaben.','Nur einen Beispielautomaten zeichnen.','Nur die Richtung DEA→NEA.'],'Eine Äquivalenz verlangt beide allgemeinen Richtungen.',['Übersetze „genau dann, wenn“.','Ein einzelnes Beispiel zeigt keine allgemeine Aussage.']],
 ['concat-final','Bei der Verkettung zweier ε-NEAs mit disjunkten Zuständen ist die neue Endmenge …',['F2','F1∪F2','nur der neue Start'],'Der zweite Teil muss vollständig gelesen werden. Ein leeres Wort aus L2 wird durch dessen ε-Wege behandelt.',['Ist allein ein erfolgreicher erster Teil bereits ausreichend?','Prüfe L1={0} und L2={1}.']],
 ['concat-eps','Wie ergänzt du bei Verkettung die ε-Übergänge aus einem Zustand q∈F1?',['Alte ε-Nachfolger vereinigt mit {s2}.','Alte ε-Nachfolger löschen und nur s1 einsetzen.','Einen echten Buchstaben ε anhängen.'],'Bestehende Wege bleiben erhalten; zusätzlich darf der zweite Teil beginnen.',['Welche alten Läufe müssen weiter möglich bleiben?','Die Konstruktion ergänzt einen Übergang, statt alte Wege zu überschreiben.']],
 ['star','Warum ist beim Stern ein neuer akzeptierender Start hilfreich?',['Er erlaubt null Wiederholungen, also ε.','Er zwingt zu mindestens einer Wiederholung.','Er entfernt alle alten Endzustände.'],'L* enthält immer ε; eine leere Folge von Blöcken muss akzeptiert werden.',['Was ist L⁰?','Überlege auch L=∅.']],
 ['union','Welches Prinzip konstruiert einen NEA für L1∪L2?',['Neuer Start mit ε-Pfeilen zu beiden Starts.','Jeder Endzustand von Teil 1 wird nicht akzeptierend und führt in Teil 2.','Alle Pfeile werden umgedreht.'],'Ein vollständiger Lauf in einem der beiden Teile genügt für die Vereinigung.',['Vereinigung bedeutet eine von zwei Möglichkeiten.','Beide Teile dürfen ihre bisherigen Endzustände behalten.']],
 ['complement','Du willst das Komplement eines ε-NEA bilden. Welcher Weg ist zuverlässig?',['Determinisieren, vervollständigen, Endzustände umdrehen.','Sofort alle Endzustände umdrehen.','Alle ε-Pfeile löschen und sonst nichts ändern.'],'Nur beim vollständigen DEA besitzt jedes Wort genau eine vollständige Entscheidung.',['Mehrere NEA-Läufe können sich in der Annahme unterscheiden.','Zuerst muss die Existenzfrage in einen eindeutigen DEA-Lauf übersetzt werden.']],
 ['strength','Ein NEA braucht weniger Zustände als sein DEA. Was folgt?',['Eine kompaktere Darstellung, keine größere Sprachklasse.','Der NEA erkennt mehr als reguläre Sprachen.','Der DEA kann dieselbe Sprache nicht erkennen.'],'Potenzmengenkonstruktion erhält die Sprache und kann die Zustandszahl stark erhöhen.',['Trenne Ausdrucksstärke und Darstellungsgröße.','Zu jedem NEA existiert ein äquivalenter DEA.']],
 ['eliminate','Direkter Weg i→j: 0; i→k:1; k-Schleife:0; k→j:1. Welcher RegEx entsteht beim Entfernen von k?',['0 ∪ 10*1','01*0','0 ∪ 101'],'Direkt 0 oder 1 hinein, beliebig viele 0 in der Schleife, 1 hinaus.',['Zerlege in direkten Weg und Umweg.','Die Schleife darf nullmal, einmal oder öfter laufen.']],
 ['empty-edge','Was beschreibt ∅ als Kantenbeschriftung beim Zusammenfassen von Wegen?',['Es gibt keinen solchen Weg.','Ein Übergang ohne Zeichenverbrauch.','Jedes Wort ist möglich.'],'ε steht für einen Weg ohne Zeichenverbrauch; ∅ steht für keine Möglichkeit.',['Vergleiche leeres Wort und leere Sprache.','Ein Weg ohne Zeichen ist trotzdem ein vorhandener Weg.']],
 ['all-paths','Ein NEA nimmt 0 sowohl über einen akzeptierenden als auch einen ablehnenden Lauf. Nach F↦Q∖F gilt …',['0 wird weiterhin angenommen; das war keine Komplementbildung.','0 wird zwingend abgelehnt.','Alle Läufe verschwinden.'],'Der vorher ablehnende vollständige Lauf wird akzeptierend. Existenz ist nicht durch Markierungswechsel negiert.',['Betrachte beide Läufe getrennt.','Welcher Lauf akzeptiert nach dem Wechsel?']]
];
for(const [id,prompt,options,why,hints] of kleeneConcepts)choice(`kleene-${id}`,'kleene',prompt,options,why,hints,{level:2,kind:['complement','all-paths'].includes(id)?'debug':'concept'});
export const week2Questions=items;
