// Independently authored teaching examples. Viewing steps never awards progress.
const frame=(label,note,kind,data)=>({label,note,kind,data});
const flow=(label,note,...data)=>frame(label,note,'flow',data);
const tiles=(label,note,...data)=>frame(label,note,'tiles',data);
const visual=(title,question,...frames)=>({title,question,frames});
export const learningVisuals={
 motivation:visual('Aus einer Regel wird eine Entscheidung','Was muss der Prüfer über jede Eingabe herausfinden?',
  flow('Die Frage','Erlaubt sind genau drei Binärzeichen. Die Regel ist das Problem; 010 ist eine Instanz.',['010','konkrete Eingabe'],['Prüfer','Nur 0/1 und Länge 3?'],['Ja','010 gehört zur Sprache']),
  tiles('Randfälle','Die Syntax sagt nichts darüber aus, ob eine Kennung tatsächlich vergeben ist.',['010','✓ drei Binärzeichen'],['01','✗ zu kurz'],['01a','✗ fremdes Zeichen'])),
 complexity:visual('Schleifendurchläufe sichtbar zählen','Wie viele Felder kommen in jeder Zeile hinzu?',
  frame('n = 4','Für i=1,2,3,4 läuft die innere Schleife jeweils i-mal: insgesamt 10 Durchläufe.','triangle',[1,2,3,4]),
  frame('n = 6','Jetzt sind es 21 Durchläufe. Allgemein n(n+1)/2: quadratisches Wachstum, keine Aussage über quadratischen Speicher.','triangle',[1,2,3,4,5,6])),
 notation:visual('Eine Definition filtert Wörter','L={w ∈ {a,b}* : |w|=2 und w beginnt mit a}. Welche Wörter bleiben?',
  tiles('Länge 2','Jede Stelle kann a oder b sein. Wiederholung und Reihenfolge zählen.',['aa','Kandidat'],['ab','Kandidat'],['ba','Kandidat'],['bb','Kandidat']),
  tiles('Anfang a','Nur die erste Stelle wird zusätzlich eingeschränkt.',['aa','✓ in L'],['ab','✓ in L'],['ba','✗ beginnt mit b'],['bb','✗ beginnt mit b']),
  tiles('Wort oder Menge?','Die geschweiften Klammern verändern die Art des Objekts.',['ab ∈ L','Ein Wort ist Element.'],['{ab} ⊆ L','Eine Menge ist Teilmenge.'])),
 alphabet:visual('Ein Wort entsteht Stelle für Stelle','Wie viele Wörter über {a,b} haben höchstens zwei Zeichen?',
  frame('Verzweigungen','Jede Stelle hat zwei Möglichkeiten. Die Blätter sind aa, ab, ba und bb.','wordtree',null),
  tiles('Alle Längen zählen','Das leere Wort zählt genau einmal. Insgesamt 1+2+4=7.',['Länge 0','ε'],['Länge 1','a · b'],['Länge 2','aa · ab · ba · bb'])),
 empty:visual('Nichts ist nicht immer dasselbe','Zählst du Zeichen in einem Wort oder Wörter in einer Menge?',
  tiles('Drei Objekte','Die Rahmen zeigen hier die Art des Objekts; ε ist kein Alphabetzeichen.',['ε','Leeres Wort · 0 Zeichen'],['∅','Leere Sprache · 0 Wörter'],['{ε}','Sprache · 1 Wort']),
  flow('Verkettung mit ε','An a wird nichts angehängt. Das Ergebnis bleibt a.',['a','linkes Wort'],['ε','rechtes Wort'],['a','Ergebnis']),
  tiles('Verkettung mit ∅','Ohne rechtes Wort gibt es kein Paar. Null Wiederholungen sind beim Stern trotzdem erlaubt.',['{a,bb} · ∅ = ∅','Kein Paar wählbar'],['∅* = {ε}','Null Faktoren ergeben ε'])),
 languages:visual('Eine Sprache legt Form und Anzahl fest','L={aⁱbʲ : i≥1, j≥2}. Müssen i und j gleich sein?',
  frame('aabbb zerlegen','Der a-Block kommt vor dem b-Block. Beide Mindestlängen sind erfüllt; die Anzahlen dürfen verschieden sein.','blocks',[['aa','i=2 ≥ 1'],['bbb','j=3 ≥ 2']]),
  tiles('Gegenbeispiele','Prüfe immer die ganze Definition, nicht nur die vorkommenden Buchstaben.',['abb','✓ passende Blöcke'],['ab','✗ nur ein b'],['baba','✗ falsche Blockfolge'])),
 sets:visual('Wörter nach Zugehörigkeit sortieren','A={ε,a,ab}, B={a,b}. In welchem Bereich liegt jedes Wort?',
  frame('Drei Bereiche','Jedes Wort erscheint genau einmal. Der mittlere Bereich gehört zu beiden Sprachen.','venn',['ε, ab','a','b']),
  tiles('Operation auswählen','Vereinigung nimmt alle drei Bereiche; Schnitt nur die Mitte; A∖B nur den linken Bereich.',['A ∪ B','{ε,a,ab,b}'],['A ∩ B','{a}'],['A ∖ B','{ε,ab}'])),
 concat:visual('Jedes linke Wort mit jedem rechten verbinden','A={ε,a}, B={b,ab}. Wie viele verschiedene Ergebnisse bleiben?',
  frame('Alle vier Paare','Erst links, dann rechts schreiben. ε fügt keine Zeichen hinzu.','matrix',{headers:['·','b','ab'],rows:[['ε','b','ab'],['a','ab','aab']]}),
  tiles('Doppelte entfernen','Vier Paare ergeben nur drei Wörter: ab entsteht zweimal. Mengen zählen es einmal.',['A · B','{b,ab,aab}'],['|A · B| = 3','nicht 2 · 2 = 4'])),
 closure:visual('Wörter als ganze Bausteine wiederholen','L={a,bb}. Der Block bb darf beim Zusammensetzen nicht halbiert werden.',
  tiles('Anzahl der Blöcke','L⁰ enthält ε, obwohl ε nicht in L liegt.',['L⁰','{ε}'],['L¹','{a,bb}'],['L²','{aa,abb,bba,bbbb}']),
  frame('abb zusammensetzen','Ein a-Block und ein bb-Block ergeben abb. Zwei Faktoren, aber drei Zeichen.','blocks',[['a','1. Wort aus L'],['bb','2. Wort aus L']]),
  tiles('Stern und Plus','Für dieses L gilt: ε gehört nur zum Stern. Wenn ε bereits in L läge, wäre es auch in L⁺.',['L* = L⁰ ∪ L¹ ∪ …','null oder mehr Faktoren'],['L⁺ = L¹ ∪ L² ∪ …','eins oder mehr Faktoren'])),
 quotient:visual('Nur das rechte Endstück entfernen','A={ab,abb,b}, B={ε,b}. Welche Reste w erfüllen wz∈A?',
  frame('Suffix b','Die zweite farbige Gruppe ist das entfernte Suffix. Aus abb bleibt ab.','blocks',[['ab','Rest w'],['b','Suffix z']]),
  frame('Alle Paare prüfen','ε als Suffix entfernt nichts. b vollständig zu entfernen ergibt das leere Wort ε.','matrix',{headers:['x ∈ A','z=ε','z=b'],rows:[['ab','ab','a'],['abb','abb','ab'],['b','b','ε']]}),
  tiles('Reste sammeln','Doppelte Reste nur einmal zählen. Ein Präfix darf nicht als Suffix entfernt werden.',['A / B','{ε,a,b,ab,abb}'],['ab mit Suffix a','✗ endet nicht auf a'])),
 regex:visual('Klammern bestimmen die Reichweite','Vergleiche (a|b)*a|b mit (a|b)*(a|b).',
  frame('r: äußerste Alternative','Der letzte senkrechte Strich trennt zwei komplette Alternativen.','blocks',[['(a|b)*a','beliebiger Anfang, dann a'],['| b','ODER nur das Wort b']]),
  frame('s: zwei verkettete Teile','Die letzte Klammer erzwingt genau ein weiteres Zeichen. Insgesamt entsteht jedes nichtleere Wort.','blocks',[['(a|b)*','0 oder mehr Zeichen'],['(a|b)','genau 1 Zeichen']]),
  tiles('Gegenwort bb','Ein einziges Gegenwort widerlegt die Gleichheit beider Sprachen.',['bb ∉ L(r)','Weder Ende a noch nur b'],['bb ∈ L(s)','Anfang b + Schluss b'])),
 construct:visual('Genau zwei Einsen sichtbar einbauen','Wo dürfen Nullen stehen, ohne eine zusätzliche Eins zu erlauben?',
  frame('Pflicht und freie Blöcke','Nur die zwei ausgeschriebenen Einsen dürfen 1 erzeugen. Jeder Stern gilt ausschließlich für seine 0.','blocks',[['0*','freie Nullen'],['1','Pflicht'],['0*','freie Nullen'],['1','Pflicht'],['0*','freie Nullen']]),
  frame('001010 zerlegen','Die drei Nullblöcke haben hier Länge 2, 1 und 1. Auch leere Nullblöcke sind erlaubt: 11 passt.','blocks',[['00','0*'],['1','1'],['0','0*'],['1','1'],['0','0*']]),
  tiles('Randfälle','Zähle die Einsen; prüfe nicht nur, ob irgendwo 11 vorkommt.',['11 und 101','✓ genau zwei Einsen'],['ε, 1 und 111','✗ falsche Anzahl'])),
 dfa:visual('Ein Zustand speichert die letzte Information','Für „endet auf 0“: Was muss nach jedem Zeichen noch bekannt sein?',
  tiles('Zustandsbedeutung','N ist Start. Nur Z ist Endzustand. Darunter kannst du den vollständigen DEA schrittweise verfolgen.',['N','Leer oder zuletzt 1'],['Z','Zuletzt 0 · akzeptierend']),
  flow('Wort 01','Z wurde besucht, aber nach dem letzten Zeichen steht der Lauf in N. Erst dort entscheidet sich die Annahme.',['N','Start'],['Z','nach 0'],['N','nach 01 · abgelehnt'])),
 parity:visual('Reste laufen im Kreis','Gezählt werden Einsen modulo 3. Was macht eine 0?',
  frame('Die Restklassen','Jede 1 schaltet einen Rest weiter. Nach r2 folgt r0. Eine 0 lässt jeden Zustand unverändert.','cycle',['r0','r1','r2']),
  tiles('Warum ε passt','Null ist durch 3 teilbar. Der Startzustand r0 ist deshalb zugleich Endzustand.',['ε','0 Einsen → r0 ✓'],['10101','3 Einsen → r0 ✓'],['11','2 Einsen → r2 ✗'])),
 alternate:visual('Nur den letzten Buchstaben merken','Gesucht sind Wörter ohne 00 und ohne 11; ε ist erlaubt.',
  tiles('Vier Erinnerungen','S, Z und E akzeptieren. Nach einer verbotenen Wiederholung führt nichts mehr aus X heraus.',['S','noch nichts gelesen'],['Z','zuletzt 0'],['E','zuletzt 1'],['X','00 oder 11 gefunden']),
  flow('0110 scheitert','Die zweite 1 erzeugt 11. Das letzte 0 kann diesen Fehler nicht rückgängig machen.',['S','ε'],['Z','0'],['E','01'],['X','011 und 0110 ✗'])),
 complement:visual('Dieselben Läufe, umgedrehte Entscheidung','Erst den partiellen DEA vervollständigen, dann die Endzustände tauschen.',
  flow('Voraussetzungen','Ein vollständiger DEA hat für jedes Wort genau einen vollständigen Lauf.',['Fehlende Übergänge','nach Fangzustand X'],['Alle Übergänge','bleiben erhalten'],['F → Q∖F','nur Endmarkierung tauschen']),
  frame('Entscheidungen vergleichen','Original: nichtleere Nullwörter. Das Komplement ist relativ zu {0,1}*.','matrix',{headers:['Wort','Original','Komplement'],rows:[['ε','nein (S)','ja (S)'],['1','nein (X)','ja (X)'],['00','ja (A)','nein (A)']]})),
 grammar:visual('Ableitung und Wort wachsen gemeinsam','S→0S | 1F, F→ε erzeugt genau 0*1.',
  flow('Zwei Nullen','Die Variable ist die noch offene Aufgabe, die Nullen sind schon fest.',['S','Start'],['0S','S→0S'],['00S','S→0S']),
  flow('Beenden','1F erzwingt die einzige Eins. Erst F darf verschwinden.',['00S','offene Variable S'],['001F','S→1F'],['001','F→ε'])),
 hierarchy:visual('Sprachklassen liegen ineinander','Wo liegt L={aⁿbⁿ:n≥0}? Welcher Speicher reicht?',
  frame('Die Hierarchie','Jeder innere Bereich ist echt in den äußeren enthalten. Die Modelle beziehen sich auf die jeweilige ganze Sprachklasse.','hierarchy',null),
  tiles('aⁿbⁿ einordnen','S→aSb | ε erzeugt passende Paare. Die unbeschränkte Gleichheit der Anzahlen ist nicht mit endlich vielen Zuständen prüfbar.',['Kontextfrei','Keller / Grammatik reichen'],['Nicht regulär','Kein DEA für alle n'])),
 transfer:visual('Ein Protokoll in Phasen zerlegen','Die Eingabe beginnt mit #, danach folgt mindestens ein Binärzeichen.',
  flow('Prüfen','Jede Phase erzwingt eine andere Bedingung. Ein weiteres # führt zum Fangzustand.',['S','noch kein Zeichen'],['H','# gelesen'],['B','mindestens ein Bit']),
  frame('Homomorphismus','h(#)=ε, h(0)=0, h(1)=1. Zeichenweise anwenden und die Bilder verketten.','blocks',[['# → ε','Kennzeichen entfernen'],['0 → 0','behalten'],['1 → 1','behalten']]),
  tiles('Bildsprache','Aus #(0|1)(0|1)* wird (0|1)(0|1)*. Das Pflichtbit bleibt erhalten.',['#01 → 01','✓ nichtleer'],['# → ε','# war keine gültige Eingabe'])),
 nea:visual('Mehrere Möglichkeiten gemeinsam verfolgen','Start p, F={r}: p liest 0 nach p und q, 1 nach p; q liest 1 nach r.',
  frame('NEA lesen','Ein Kreis mit doppeltem Rand akzeptiert. Nicht eingezeichnete Übergänge fehlen.','nfa',null),
  flow('001 akzeptiert','Bei jeder 0 bleiben p und q möglich. Beim letzten Zeichen erreicht q den Endzustand r.',['{p}','ε'],['{p,q}','0'],['{p,q}','00'],['{p,r}','001 ✓']),
  flow('Eine weitere 0','r hat keinen 0-Nachfolger. Deshalb verschwindet r aus der Menge; 0010 wird abgelehnt.',['{p,r}','nach 001'],['{p,q}','nach 0010 ✗'])),
 epsilon:visual('ε-Hülle ohne Zeichenverbrauch','ε-Pfeile: s→u, u→v, v→u. Nur v→f liest eine 0.',
  frame('Pfeile unterscheiden','Die ε-Pfeile kosten kein Eingabezeichen. Der mit 0 markierte Pfeil gehört nicht zur Hülle.','epsilon',null),
  flow('Hülle erweitern','Jeder neu gefundene Zustand wird einmal bearbeitet. Der Kreis u↔v erzeugt keine neuen Zustände mehr.',['{s}','Start einschließen'],['{s,u}','s→u'],['{s,u,v}','u→v; fertig']),
  tiles('Erst jetzt 0 lesen','f ist kein ε-Nachfolger. Es wird erst mit einem Eingabezeichen erreicht.',['E({s})={s,u,v}','Kein Zeichen gelesen'],['Nach 0: {f}','Ein Zeichen gelesen'])),
 determinize:visual('Eine Zustandsmenge wird ein DEA-Zustand','Start s, F={f}: s liest 0 nach s,p und 1 nach s; p liest 1 nach f.',
  tiles('Mengen benennen','Die Namen A, B und C stehen jeweils für eine ganze Menge möglicher NEA-Zustände.',['A={s}','Start'],['B={s,p}','nach 0'],['C={s,f}','akzeptierend']),
  frame('Alle Zeichen verfolgen','Vereinige immer die Beiträge aller Zustände. Nicht einzeln einen günstigen Pfad auswählen.','matrix',{headers:['DEA','0','1'],rows:[['→ A={s}','B','A'],['B={s,p}','B','C'],['* C={s,f}','B','A']]})),
 minimize:visual('Gleiches Zukunftsverhalten zusammenfassen','A→(B,C), B→(D,C), C→(B,C), D→(D,C); nur D akzeptiert.',
  tiles('P₀: Annahme trennen','D unterscheidet sich durch das Restwort ε von allen anderen.',['{A,B,C}','nicht akzeptierend'],['{D}','akzeptierend']),
  tiles('P₁: Zeichen 0 prüfen','B erreicht mit 0 den Endzustand D. A und C erreichen B. Also muss B getrennt werden.',['{A,C}','0 → {B}'],['{B}','0 → {D}'],['{D}','0 → {D}']),
  tiles('Stabiler Quotient','A und C haben identische Zielklassen und dürfen verschmelzen. B und D bleiben wegen ihres Akzeptanzstatus getrennt.',['{A,C}','0 → {B}; 1 → {A,C}'],['{B}','0 → {D}; 1 → {A,C}'],['{D} · Endzustand','0 → {D}; 1 → {A,C}'])),
 'regular-grammar':visual('Pflichtbedingungen werden Grammatikphasen','Über {a,b}: zuerst a, irgendwann mindestens ein b.',
  flow('Drei Phasen','Eine ε-Regel gibt es nur in B. So kann keine Pflichtbedingung übersprungen werden.',['S','S→aA'],['A','A→aA | bB'],['B','B→aB | bB | ε']),
  flow('aba ableiten','Nach dem ersten b bleibt jedes weitere Zeichen in Phase B.',['S','Start'],['aA','a erzwingen'],['abB','b erfüllen'],['abaB ⇒ aba','a lesen; beenden'])),
 kleene:visual('Dieselbe Sprache in mehreren Darstellungen','Welche Konstruktion verbindet RegEx, NEA und DEA?',
  flow('Vorwärts','Der strukturelle Aufbau erzeugt einen ε-NEA. Zustandsmengen beseitigen danach den Nichtdeterminismus.',['RegEx','Grundbausteine, |, ·, *'],['ε-NEA','Konstruktionen'],['DEA','Potenzmenge']),
  flow('Rückwärts','Wege werden beim Entfernen von Zuständen zu Ausdrücken zusammengefasst.',['DEA','beschriftete Wege'],['RegEx','Zustandselimination']),
  frame('Verkettung 0 · 1','Der alte Endzustand nach 0 darf nicht mehr akzeptieren. Der ε-Pfeil liest nichts.','concat-nfa',null)),
 pumping:visual('Warum 0ⁿ1ⁿ nicht regulär ist','Für jede angenommene Pumpinglänge p: w=0ᵖ1ᵖ. Wo kann y liegen?',
  frame('Beliebige erlaubte Zerlegung','|xy|≤p und |y|≥1 erzwingen y=0ᵏ mit 1≤k≤p. Wir dürfen k nicht selbst festlegen.','blocks',[['x','nur Nullen'],['y = 0ᵏ','mindestens eine Null'],['z','restliche Nullen + p Einsen']]),
  frame('Mit i=0 pumpen','Entferne y. Für jedes erlaubte k bleiben p−k Nullen und p Einsen: ungleich, also nicht in L.','blocks',[['0ᵖ⁻ᵏ','weniger als p Nullen'],['1ᵖ','weiterhin p Einsen']]),
  tiles('Widerspruch','Die Zerlegung war beliebig. Damit scheitert die notwendige Pumping-Eigenschaft für jede mögliche Zerlegung.',['Annahme: L regulär','würde passende Zerlegung garantieren'],['Keine Zerlegung funktioniert','also L nicht regulär'])),
 cnf:visual('Eine lange Regel binär aufteilen','Beispielgrammatik S→aSb | ab. Sie erzeugt aⁿbⁿ für n≥1.',
  flow('Terminale auslagern','In längeren rechten Seiten werden a und b durch A und B ersetzt.',['S→aSb | ab','Ausgangsregeln'],['S→ASB | AB','A→a, B→b']),
  flow('Drei Variablen zerlegen','C fasst den rechten Teil SB zusammen. Jede Regel hat jetzt zwei Variablen oder ein Terminal rechts.',['S→ASB','drei Variablen'],['S→AC; C→SB','je zwei Variablen']),
  frame('Syntaxbaum für aabb','Regeln: S→AC | AB; C→SB; A→a; B→b. Die Blätter von links nach rechts ergeben aabb.','parse-tree',null)),
 cyk:visual('CYK baut aus kleinen Teilwörtern auf','Grammatik S→AB, A→a, B→b. Gehört ab dazu?',
  frame('Zeichen eintragen','A erzeugt a, B erzeugt b. Die obere Zelle ist noch nicht berechnet.','cyk',['{A}','{B}','?','a','b']),
  frame('Teilwörter kombinieren','Die einzige Zerlegung ist a | b. Weil S→AB gilt, kommt S in die obere Zelle: ab wird akzeptiert.','cyk',['{A}','{B}','{S}','a','b']),
  frame('Reihenfolge testen','Für ba stehen unten B und A. Eine Regel mit rechter Seite BA fehlt; oben bleibt ∅.','cyk',['{B}','{A}','∅','b','a'])),
 stack:visual('Ein Keller zählt offene Verpflichtungen','Für aⁿb²ⁿ mit n≥1: pro a zwei Marker hinein, pro b einen hinaus.',
  frame('aa gelesen','Vier Marker stehen für vier noch benötigte b. ⊥ markiert den Kellerboden; oben liegt das zuletzt abgelegte X.','stack',['X','X','X','X','⊥']),
  frame('aabb gelesen','Zwei b entfernen zwei Marker. Noch zwei b fehlen. Seit dem ersten b sind keine a mehr erlaubt.','stack',['X','X','⊥']),
  frame('aabbbb gelesen','Nur der Boden bleibt. Die Eingabe ist vollständig gelesen und mindestens ein a wurde gelesen: akzeptiert. ε ist hier nicht erlaubt.','stack',['⊥'])),
 tm:visual('Lesen, schreiben, bewegen','Ein Ausschnitt aus dem Binärinkrementierer: 1011 + 1. Der Kopf steht schon auf dem letzten Bit.',
  frame('Übertrag starten','Zustand q: Beim Lesen von 1 schreibe 0, gehe links und bleibe in q.','tape',{cells:['□','1','0','1','1','□'],head:4,state:'q'}),
  frame('Erste 1 wird 0','δ(q,1)=(q,0,L). Der Kopf steht nun auf der vorletzten 1.','tape',{cells:['□','1','0','1','0','□'],head:3,state:'q'}),
  frame('Noch eine 1 wird 0','Dieselbe Regel setzt auch diese 1 auf 0 und bewegt den Kopf links auf die 0.','tape',{cells:['□','1','0','0','0','□'],head:2,state:'q'}),
  frame('Übertrag beendet','δ(q,0)=(h,1,N): 0 wird 1, der Kopf bleibt stehen, Zustand h hält. Ergebnis: 1100.','tape',{cells:['□','1','1','0','0','□'],head:2,state:'h'})),
 np:visual('Ein Ja-Zertifikat prüfen','CLIQUE mit k=3: Sind alle Paare der ausgewählten Knoten verbunden?',
  frame('Graph und Auswahl','Die ausgewählten Knoten A, B und C sind markiert. D ist nicht ausgewählt.','graph',false),
  frame('Drei Paare prüfen','AB, AC und BC existieren: {A,B,C} ist eine Clique der Größe 3. Ein Prüfer testet k(k−1)/2 Paare.','graph',true),
  tiles('Finden und Prüfen trennen','NP beschreibt polynomial prüfbare Ja-Zertifikate. Daraus folgt kein bekannter polynomialer Suchalgorithmus für alle Instanzen.',['Zertifikat','Liste der ausgewählten Knoten'],['Prüfung','Größe und alle Paarverbindungen'])),
 reduction:visual('Die Reduktion zeigt zum Zielproblem','Um B als NP-schwer nachzuweisen, reduziere ein bekanntes NP-schweres A auf B.',
  flow('Algorithmus weiterverwenden','Ein schneller B-Löser würde über den Übersetzer auch A schnell lösen.',['A-Instanz x','bekanntes schweres Problem'],['f(x): B-Instanz','polynomial übersetzen'],['B-Löser','Antwort gilt auch für x']),
  frame('CLIQUE → INDEPENDENT SET','Komplementgraph: Genau fehlende Kanten werden Kanten. k bleibt gleich. A,B,C sind links eine Clique und rechts unabhängig.','complement-graph',null),
  tiles('Beide Richtungen','Eine Reduktion erhält Ja und Nein. Für NP-Vollständigkeit von B muss zusätzlich B∈NP gelten.',['x ∈ A ⇔ f(x) ∈ B','Äquivalenz beweisen'],['A ≤ₚ B','richtige Richtung für Schwere von B'])),
 decidable:visual('Halten ist eine zusätzliche Garantie','Wie verhalten sich Entscheider und Semi-Entscheider bei Ja- und Nein-Eingaben?',
  frame('Ausgänge vergleichen','Ein Semi-Entscheider muss Ja-Eingaben nach endlich vielen Schritten akzeptieren. Nur bei Nein darf er endlos laufen.','matrix',{headers:['Eingabe','Entscheider','Semi-Entscheider'],rows:[['w ∈ L','hält: Ja','hält: Ja'],['w ∉ L','hält: Nein','Nein oder Endlosschleife']]}),
  flow('Zwei Semi-Entscheider','Existieren Semi-Entscheider für L und sein Komplement, simuliere beide abwechselnd. Genau einer akzeptiert irgendwann.',['w','in beide Simulationen'],['L / Komplement','je einen Schritt abwechseln'],['Entscheidung','welcher akzeptiert?']),
  tiles('Rice anwenden','Rice betrifft nichttriviale semantische Eigenschaften partiell berechenbarer Funktionen. Keine pauschale Aussage über jeden Programmtext.',['≤ 10 Zustände?','syntaktisch · kein Rice-Fall'],['Überall Nullfunktion?','semantisch und nichttrivial · unentscheidbar']))
};

function picture(f,esc,key){
 const text=(x,y,s,cls='')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="middle">${esc(s)}</text>`;
 const line=(x1,y1,x2,y2,label='')=>`<path d="M${x1},${y1} L${x2},${y2}" class="lv-edge" marker-end="url(#${key}-arrow)"/>${label?text((x1+x2)/2,(y1+y2)/2-10,label):''}`;
 const node=(x,y,s,end=false)=>`<circle cx="${x}" cy="${y}" r="25" class="lv-node"/>${end?`<circle cx="${x}" cy="${y}" r="20" class="lv-inner"/>`:''}${text(x,y+6,s)}`;
 const box=(x,y,w,h,s,cls='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="lv-box ${cls}"/>${text(x+w/2,y+h/2+6,s)}`;
 const svg=(body,height=230)=>`<div class="lv-svg-scroll" tabindex="0" role="region" aria-label="${esc(f.label)} – Grafik"><svg viewBox="0 0 480 ${height}" class="lv-svg" role="img" aria-label="${esc(f.note)}"><defs><marker id="${key}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="currentColor"/></marker></defs>${body}</svg></div>`;
 if(['flow','tiles','blocks'].includes(f.kind))return `<div class="lv-${f.kind}">${f.data.map(([a,b],i)=>`<div class="lv-item"><span class="lv-index">${i+1}</span><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div>`;
 if(f.kind==='matrix')return `<div class="table-scroll" tabindex="0" role="region" aria-label="${esc(f.label)}"><table><caption>${esc(f.label)}</caption><thead><tr>${f.data.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${f.data.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(f.kind==='triangle')return `<div class="lv-triangle" role="img" aria-label="${esc(f.note)}">${f.data.map(n=>`<div><span>i=${n}</span>${Array.from({length:n},()=>'<i aria-hidden="true"></i>').join('')}<strong>${n}</strong></div>`).join('')}</div>`;
 if(f.kind==='venn')return svg(`<ellipse cx="185" cy="120" rx="135" ry="90" class="lv-set"/><ellipse cx="295" cy="120" rx="135" ry="90" class="lv-set second"/>${text(120,65,'A')}${text(360,65,'B')}${text(120,130,f.data[0])}${text(240,130,f.data[1])}${text(360,130,f.data[2])}`);
 if(f.kind==='wordtree')return svg(line(240,35,130,100,'a')+line(240,35,350,100,'b')+line(130,120,65,185,'a')+line(130,120,185,185,'b')+line(350,120,295,185,'a')+line(350,120,415,185,'b')+text(240,25,'ε')+text(130,120,'a')+text(350,120,'b')+['aa','ab','ba','bb'].map((s,i)=>text([65,185,295,415][i],210,s)).join(''));
 if(f.kind==='cycle')return svg(line(118,77,362,77,'1')+line(363,96,260,181,'1')+line(220,181,117,96,'1')+node(90,77,'r0',true)+node(390,77,'r1')+node(240,197,'r2')+text(240,30,'0: Zustand bleibt gleich'),245);
 if(f.kind==='hierarchy')return `<div class="lv-nest">Typ 0 · rekursiv aufzählbar<span>Turingmaschine</span><div>Typ 1 · kontextsensitiv<span>Linear beschränkter Automat</span><div>Typ 2 · kontextfrei<span>Kellerautomat</span><div>Typ 3 · regulär<span>Endlicher Automat</span></div></div></div></div>`;
 if(f.kind==='nfa')return svg(line(20,140,55,140)+line(105,140,215,140,'0')+line(265,140,375,140,'1')+`<path d="M65 116 C0 20 160 20 95 116" class="lv-edge" marker-end="url(#${key}-arrow)"/>`+text(80,42,'0,1')+node(80,140,'p')+node(240,140,'q')+node(400,140,'r',true));
 if(f.kind==='epsilon')return svg(line(10,120,45,120)+line(95,120,160,120,'ε')+`<path d="M203 101 Q245 38 292 101" class="lv-edge" marker-end="url(#${key}-arrow)"/>`+text(248,62,'ε')+`<path d="M293 140 Q247 203 204 140" class="lv-edge" marker-end="url(#${key}-arrow)"/>`+text(248,190,'ε')+line(335,120,395,120,'0')+node(70,120,'s')+node(185,120,'u')+node(310,120,'v')+node(420,120,'f',true));
 if(f.kind==='concat-nfa')return svg(line(10,120,40,120)+line(90,120,160,120,'0')+line(210,120,275,120,'ε')+line(325,120,395,120,'1')+node(65,120,'s₁')+node(185,120,'f₁')+node(300,120,'s₂')+node(420,120,'f₂',true)+text(185,185,'kein Endzustand')+text(420,185,'Endzustand'));
 if(f.kind==='parse-tree')return svg(line(240,25,70,90)+line(240,25,330,90)+line(330,100,240,165)+line(330,100,425,240)+line(240,180,175,240)+line(240,180,300,240)+line(70,108,70,287)+line(175,257,175,287)+line(300,257,300,287)+line(425,257,425,287)+[[240,25,'S'],[70,104,'A'],[330,104,'C'],[240,179,'S'],[175,255,'A'],[300,255,'B'],[425,255,'B'],[70,310,'a'],[175,310,'a'],[300,310,'b'],[425,310,'b']].map(([x,y,s])=>text(x,y,s)).join(''),335);
 if(f.kind==='cyk')return svg(line(130,140,215,90)+line(350,140,265,90)+box(185,25,110,60,f.data[2],'accent')+box(75,140,110,60,f.data[0])+box(295,140,110,60,f.data[1])+text(130,233,f.data[3])+text(350,233,f.data[4])+text(240,275,'Oben: Variablen für das ganze Wort'),300);
 if(f.kind==='stack')return `<div class="lv-stack" role="img" aria-label="${esc(f.note)}"><span>Kellerspitze ↓</span>${f.data.map(s=>`<strong>${esc(s)}</strong>`).join('')}<small>Kellerboden</small></div>`;
 if(f.kind==='tape')return `<div class="lv-tape" role="img" aria-label="${esc(f.note)}">${f.data.cells.map((s,i)=>`<div class="${i===f.data.head?'active':''}"><strong>${esc(s)}</strong><span>${i===f.data.head?'↑ '+esc(f.data.state):'·'}</span></div>`).join('')}</div>`;
 const graph=(offset,complement=false,checked=false)=>{
  const pts=[[70+offset,50],[20+offset,170],[140+offset,170],[180+offset,55]],edges=complement?[[0,3],[1,3]]:[[0,1],[0,2],[1,2],[2,3]];
  return edges.map(([a,b])=>`<path d="M${pts[a]} L${pts[b]}" class="lv-edge ${checked&&a<3&&b<3?'checked':''}"/>`).join('')+pts.map(([x,y],i)=>node(x,y,['A','B','C','D'][i],i<3)).join('');
 };
 if(f.kind==='graph')return svg(graph(120,false,f.data)+text(240,220,'Doppelrand = ausgewählte Knoten'),245);
 if(f.kind==='complement-graph')return svg(graph(25)+graph(275,true)+text(130,220,'G: Clique A,B,C')+text(370,220,'G̅: A,B,C unabhängig'),245);
 return '';
}

export function learningVisualView(id,esc,step=0){
 const v=learningVisuals[id];if(!v)return '';
 const index=Math.max(0,Math.min(step,v.frames.length-1)),f=v.frames[index],key=`lv-${id}-${index}`;
 return `<section class="learning-visual" data-learning-visual="${id}" data-visual-step="${index}" aria-label="${esc(v.title)}"><div class="eyebrow">ANSCHAUEN · SCHRITT FÜR SCHRITT</div><h2>${esc(v.title)}</h2><p>${esc(v.question)}</p><div class="lv-step-buttons" role="group" aria-label="Bildschritt auswählen">${v.frames.map((s,i)=>`<button type="button" data-action="learning-visual-step" data-step="${i}" aria-pressed="${i===index}" aria-label="Schritt ${i+1}: ${esc(s.label)}">${i+1}<span>${esc(s.label)}</span></button>`).join('')}</div><figure><figcaption>Schritt ${index+1} / ${v.frames.length} · ${esc(f.label)}</figcaption>${picture(f,esc,key)}<p class="lv-explanation" role="status" aria-live="polite" aria-atomic="true">${esc(f.note)}</p></figure><div class="inline-actions"><button type="button" class="btn secondary" data-action="learning-visual-step" data-step="${index-1}" data-dir="back" ${index===0?'disabled':''}>← Zurück</button><button type="button" class="btn" data-action="learning-visual-step" data-step="${index+1}" data-dir="next" ${index===v.frames.length-1?'disabled':''}>Weiter →</button><button type="button" class="btn ghost" data-action="learning-visual-step" data-step="0" data-dir="reset">Von vorn</button></div></section>`;
}
export function stepLearningVisual(button,esc){
 const root=button.closest('[data-learning-visual]');if(!root)return;
 const id=root.dataset.learningVisual,step=Number(button.dataset.step),dir=button.dataset.dir;
 if(!Number.isInteger(step))return;
 const holder=root.ownerDocument.createElement('div');holder.innerHTML=learningVisualView(id,esc,step);
 const next=holder.firstElementChild;root.replaceWith(next);
 const focus=dir?next.querySelector(`[data-dir="${dir}"]:not(:disabled)`):next.querySelector(`[data-step="${step}"]:not([data-dir])`);
 (focus||next.querySelector('[aria-pressed="true"]'))?.focus({preventScroll:true});
}

const routes={
 1:[['alphabet','Zeichen & Wörter'],['sets','Sprachen verknüpfen'],['construct','Muster bauen'],['dfa','Automaten verstehen'],['hierarchy','Modelle einordnen']],
 2:[['nea','Mögliche Läufe'],['epsilon','ε ergänzen'],['determinize','Mengen → Zustände'],['minimize','Zustände vereinen'],['kleene','Darstellungen verbinden']],
 3:[['pumping','Grenzen des DEA'],['cnf','Grammatik & Syntaxbaum']],
 4:[['cyk','Wörter mit CYK prüfen'],['stack','Mit Keller speichern']],
 5:[['hierarchy','Sprachklassen'],['tm','Band & Kopf'],['np','Aufwand einordnen']],
 6:[['np','Zertifikate prüfen'],['reduction','Probleme übersetzen']],
 7:[['decidable','Halten & Entscheiden'],['hierarchy','Modelle verbinden']],
 8:[['minimize','Automaten wiederholen'],['cyk','CYK wiederholen'],['tm','TM wiederholen'],['exams','Simulation starten']],
 9:[['review','Fehler wiederholen'],['exams','Letzter Probelauf'],['hierarchy','Überblick festigen']]
};
const later=new Set(['pumping','cnf','cyk','stack','tm','np','reduction','decidable']);
export function weekVisualView(week,esc){
 const route=routes[week];if(!route)return '';
 return `<section class="card lv-week"><div class="eyebrow">DEINE VISUELLE ROUTE</div><h2>So hängen die Themen zusammen</h2><p>Öffne einen Baustein und gehe sein Beispiel Bild für Bild durch.</p><nav aria-label="Visuelle Themenroute Woche ${week}" class="lv-route">${route.map(([id,label],i)=>`<a href="#${['review','exams'].includes(id)?id:(later.has(id)?'topic/':'lesson/')+id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(label)}</strong><span aria-hidden="true">→</span></a>`).join('')}</nav></section>`;
}
