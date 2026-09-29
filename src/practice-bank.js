import {languageOperation,setLabel,wordLabel,binaryWords,compileRegex,runDfa,machines} from './engine.js';
import {cyk,cnfExamples,ruleText,nfaStep,graphSolutions,incrementTrace,incrementRules} from './algorithms.js';
// Correct choices use semantic indices, never screen positions; the UI shuffles each question.
const concepts={
 motivation:[
 ['Warum gehört ein Scanner für Schlüsselwörter zur Theorie formaler Sprachen?','Er entscheidet, ob eine Zeichenfolge zu einer beschriebenen Wortmenge gehört.','Er löst dadurch jedes Programmierproblem.','Er benötigt zwingend eine Turingmaschine mit unendlicher Laufzeit.','Die Menge erlaubter Schlüsselwörter ist eine Sprache; Zugehörigkeit ist ein Wortproblem.'],
 ['Eine Eingabe wird schnell verarbeitet. Was weißt du dadurch über alle Eingaben?','Noch keine allgemeine Laufzeitschranke.','Alle Eingaben sind schnell.','Das Problem liegt nicht in NP.','Eine einzelne Messung beweist keine Schranke für jede Eingabelänge.',3,'debug'],
 ['Welcher Schritt macht aus „gute Passwörter“ eine formale Sprache?','Erlaubte Zeichen und genaue Bedingungen festlegen.','Einige Beispiele sammeln und die restlichen ignorieren.','Nur die Schriftart festlegen.','Alphabet und eindeutig überprüfbare Bedingungen legen die Wortmenge fest.'],
 ['Was unterscheidet „berechenbar“ von „praktisch schnell“?','Ein korrektes Verfahren kann existieren und trotzdem sehr lange brauchen.','Berechenbar bedeutet immer O(n).','Ein langsames Verfahren ist per Definition unberechenbar.','Existenz eines Algorithmus und sein Ressourcenbedarf sind getrennte Fragen.',2],
 ['Ein Prüfer akzeptiert alle gültigen Wörter, aber auch einige ungültige. Was fehlt?','Die Richtung: Jedes akzeptierte Wort muss gültig sein.','Nur mehr Speicher.','Nichts, gültige Wörter werden ja erkannt.','Exakte Erkennung fordert beide Richtungen der Sprachgleichheit.',3,'debug']
 ],
 complexity:[
 ['Zwei n-malige Schleifen laufen nacheinander. Welche Größenordnung haben ihre insgesamt 2n Schritte?','O(n)','O(n²)','O(2ⁿ)','Nacheinander addieren sich Laufzeiten. Ein konstanter Faktor 2 ändert die Ordnung nicht.',2],
 ['Eine innere Schleife läuft genau fünfmal pro äußerem Schritt, die äußere n-mal. Gesamt?','O(n)','O(n²)','O(5ⁿ)','5n ist linear. Verschachtelung allein beweist kein Quadrat.',2,'debug'],
 ['Was misst die Eingabelänge einer Binärzahl mit Wert N ungefähr?','log₂(N) Bits','N² Bits','Immer ein Bit','Der Wert wächst exponentiell in der Anzahl der Bits. Aufwand polynomial in N ist nicht zwingend polynomial in der Bitlänge.',3],
 ['Was folgt aus T(n)=O(n²) allein?','Eine asymptotische obere Schranke.','Eine exakte Schrittzahl n².','Dass keine lineare obere Schranke möglich ist.','O bezeichnet eine obere Schranke; auch lineare Funktionen sind O(n²).',2],
 ['Ein Scanner merkt nur eine feste Anzahl Zustände und liest n Zeichen. Zusatzspeicher?','O(1), wenn die Eingabe nicht mitgezählt wird.','Zwingend O(n²).','Immer exponentiell.','Die gespeicherte Zustandsinformation wächst nicht mit der Wortlänge. Zeit und Platz getrennt betrachten.',2]
 ],
 notation:[
 ['L={01,10}. Welche Aussage ist korrekt?','{01} ⊆ L','{01} ∈ L','0 ∈ L','Elemente von L sind Wörter; {01} ist eine Menge mit einem dieser Wörter.'],
 ['Was widerlegt „Für alle w∈L gilt P(w)“?','Ein einziges w∈L mit ¬P(w).','Ein w außerhalb L.','Ein Beispiel mit P(w).','Ein Gegenbeispiel muss in der quantifizierten Grundmenge liegen.',2],
 ['Was beweist „Es gibt w∈L mit P(w)“?','Ein konkretes passendes Wort und die Prüfung von P.','Hundert unpassende Wörter.','Die Prüfung aller Wörter außerhalb L.','Eine Existenzaussage lässt sich durch einen Zeugen belegen.'],
 ['A⊆B und B⊆A. Was folgt?','A=B','A und B müssen leer sein.','A hat genau ein Element mehr.','Gleichheit von Mengen ist gegenseitige Inklusion.',2],
 ['Eine Behauptung lautet P⇔Q. Ein Beweis zeigt nur P⇒Q. Was fehlt?','Q⇒P','P⇒P','Q⇒Q','Eine Äquivalenz braucht beide Implikationen. Aussagen der Form P⇒P oder Q⇒Q liefern die fehlende Richtung nicht.',3,'debug']
 ],
 alphabet:[
 ['Σ={a,b,c}. Wie viele Wörter enthält Σ⁰?','Genau eines: ε','Keines','Drei','Eine Folge aus null Zeichen ist eindeutig: das leere Wort.'],
 ['Σ={ab,c}; ab gilt als einzelnes Token. Welche Länge hat die Tokenfolge ab·c·ab?','3','5','6','Wortlänge zählt Symbole des festgelegten Alphabets, nicht ihre Druckbuchstaben.',2],
 ['Kann ein Wort aus Σ* unendlich lang sein?','Nein, jedes einzelne Wort ist endlich.','Ja, weil Σ* unendlich ist.','Nur bei zwei Symbolen.','Unendlich viele endliche Wörter sind keine unendlich langen Wörter.'],
 ['Σ=∅ nach der Konvention des W1-Skripts. Was ist Σ*?','{ε}','∅','{∅}','Auch ohne verfügbare Zeichen existiert die leere Folge.',2],
 ['Warum ist P(Σ) nicht dasselbe wie Σ*?','P(Σ) enthält Teilmengen, Σ* enthält geordnete Wörter mit Wiederholungen.','In Mengen zählt die Reihenfolge stärker.','In Wörtern darf kein Symbol wiederholt werden.','Zum Beispiel ist aa ein Wort über {a,b}, aber keine Teilmenge davon.',3]
 ],
 empty:[
 ['Was ist {ε}·{ε}?','{ε}','∅','{ε,ε} mit zwei Elementen','εε=ε. Eine Menge zählt gleiche Ergebnisse nur einmal.'],
 ['Was ist ∅*?','{ε}','∅','Alle Binärwörter','Die nullte Potenz jeder Sprache ist {ε}; positive Potenzen von ∅ sind leer.',2],
 ['Was ist ∅⁺?','∅','{ε}','{0}','Das Plus vereinigt ausschließlich positive Potenzen. Ohne Wörter entsteht nichts.',2],
 ['Ein Schüler sagt: „ε ist eine Sprache mit null Wörtern.“ Was stimmt?','ε ist ein Wort der Länge null; ∅ ist die Sprache ohne Wörter.','ε und ∅ sind zwei Namen derselben Sprache.','ε hat die Länge eins.','Wort und Wortmenge sind verschiedene Objekttypen.',1,'debug'],
 ['Kann eine Sprache mit genau einem Wort unendliche Wortlänge enthalten?','Nein, formale Wörter sind endlich.','Ja, wenn das Wort ε heißt.','Ja, weil einelementige Mengen unendlich sind.','Die Anzahl der Wörter und ihre Längen sind getrennte Größen; alle Wörter hier sind endlich.',3]
 ],
 languages:[
 ['L={aⁿbⁿ:n≥0}. Welches Wort liegt nicht in L?','abab','aabb','ε','Gleiche Anzahlen genügen nicht: Alle a müssen vor den b stehen.',2,'debug'],
 ['Die Sprache hat eine endliche Beschreibung. Was folgt über ihre Größe?','Sie kann endlich oder unendlich sein.','Sie ist zwingend endlich.','Sie enthält nur ε.','Zum Beispiel beschreibt a* mit zwei Zeichen unendlich viele Wörter.'],
 ['L enthält alle Binärwörter mit mindestens einer 1. Gehört ε dazu?','Nein','Ja, weil ε in jeder Sprache liegt.','Ja, weil ε eine Eins enthält.','ε liegt in Σ*, aber nicht automatisch in jeder Teilmenge davon.'],
 ['Was ist eine Instanz des Wortproblems bei festem L?','Ein Wort w mit der Frage w∈L?','Die Berechnung des größten Wortes.','Das Sortieren aller unendlich vielen Wörter.','Das Wortproblem fragt nach einer einzelnen Zugehörigkeitsentscheidung.'],
 ['L₁={01,10}, L₂={w: |w|=2 über {0,1}}. Beziehung?','L₁ ist eine echte Teilmenge von L₂.','L₁=L₂','L₂ ist eine echte Teilmenge von L₁.','L₂ enthält zusätzlich 00 und 11.',2]
 ],
 sets:[
 ['A∩∅ = ?','∅','A','{ε}','Es gibt kein gemeinsames Element mit einer leeren Menge.'],
 ['A∖B und B∖A sind allgemein …','verschieden.','immer gleich.','beide gleich A∪B.','Zum Beispiel A={0}, B={1}: Die Differenzen sind {0} und {1}.',2],
 ['Wann darfst du (Lᶜ)ᶜ=L verwenden?','Wenn beide Komplemente dieselbe Grundmenge verwenden.','Nur für endliche Sprachen.','Nur für nichtreguläre Sprachen.','Ein Komplement ist immer relativ zu einer festgelegten Grundmenge.',2],
 ['Eine Lösung nennt {0} als Komplement von {1} über {0,1}*. Was fehlt?','Unter anderem ε, 00 und 10.','Nichts.','Nur das Wort 1.','Die Grundmenge enthält Wörter aller endlichen Längen, nicht nur einzelne Zeichen.',2,'debug'],
 ['Ist (A∪B)∖B = A immer richtig?','Nein, es ist A∖B.','Ja, Vereinigung und Differenz heben sich immer auf.','Nur wenn A=B, sonst nie.','Elemente, die auch in B liegen, werden entfernt. Für A=B≠∅ ist links ∅.',3,'debug']
 ],
 concat:[
 ['A={a}, B={b}. Warum ist A·B≠B·A?','ab und ba sind verschiedene Wörter.','Mengen besitzen eine feste Reihenfolge.','Verkettung sortiert die Zeichen.','Die Reihenfolge innerhalb eines Wortes zählt, obwohl Mengen ungeordnet sind.'],
 ['Warum kann |A·B| kleiner als |A||B| sein?','Verschiedene Wortpaare können dasselbe Ergebnis ergeben.','Ein Wort darf nie zweimal gewählt werden.','ε wird immer entfernt.','Bei A=B={ε,a} erzeugen (ε,a) und (a,ε) dasselbe Wort a.',2],
 ['Welche Beziehung gilt immer?','A·(B∪C)=(A·B)∪(A·C)','A·(B∩C)=(A·B)∩(A·C) ohne weitere Voraussetzungen','A·B=B·A','Für die Vereinigung kann das rechte Wort aus B oder aus C gewählt werden. Bei Schnitt kann eine unterschiedliche Zerlegung die Gleichheit verhindern.',3],
 ['Was ist {a}·∅·{b}?','∅','{ab}','{a,b}','Für das mittlere Wort existiert keine Auswahl, daher auch kein vollständiges Tupel.'],
 ['A={a,aa}, B={a,aa}. Wie entsteht aaa?','Aus a·aa und aa·a.','Nur aus aa·aa.','Gar nicht.','Zwei verschiedene Paare ergeben dasselbe Wort. In der Ergebnismenge steht aaa einmal.',2]
 ],
 closure:[
 ['Wann gilt L⁺=L*?','Genau dann, wenn ε∈L.','Immer','Genau dann, wenn L leer ist.','L*=L⁺∪{ε}. Ein positives Produkt enthält ε nur, wenn alle beteiligten Wörter leer sein können.',3],
 ['Ist L⊆L* immer wahr?','Ja, L¹ ist in der Vereinigung enthalten.','Nein, bei endlichen Sprachen nie.','Nur wenn ε∈L.','Die Sternhülle enthält jede nichtnegative Potenz, insbesondere die erste.'],
 ['Ein Schüler entfernt ε aus L* und nennt das immer L⁺. Gegenbeispiel?','L={ε}','L={0}','L={01}','Bei L={ε} sind L* und L⁺ gleich {ε}; das Entfernen liefert fälschlich ∅.',3,'debug'],
 ['L={00}. Welches Wort liegt in L*?','0000','0','000','Jeder Block trägt zwei Nullen bei. Zulässig sind gerade Längen einschließlich null.',2],
 ['Warum ist (L*)*=L*?','Eine Verkettung von Verkettungen ist wieder eine Verkettung aus L.','Weil jeder Stern seine Sprache leert.','Weil L* immer nur ein Wort hat.','Man kann die inneren Blockfolgen hintereinander abflachen; ε ist bereits enthalten.',3]
 ],
 quotient:[
 ['A/B wird hier als Rechtsquotient definiert. Welche Bedingung gilt für u?','Es gibt v∈B mit uv∈A.','Für alle v∈B gilt vu∈A.','u muss in A und B liegen.','Entfernt wird ein vollständiges passendes Suffix aus B; ein passendes v genügt.'],
 ['Was ist A/{ε}?','A','∅','{ε}','uε=u. Es wird kein Zeichen entfernt.'],
 ['Was ist A/∅?','∅','A','Σ*','Es gibt kein v∈∅, das die Existenzbedingung erfüllt.'],
 ['A={ab}, B={a}. Ein Schüler antwortet {b} für A/B. Fehler?','Er hat ein Präfix statt eines Suffixes entfernt.','Er hätte nur die Klammern weglassen sollen.','Kein Fehler.','ab endet nicht auf a. Der Rechtsquotient ist hier leer.',2,'debug'],
 ['Wann liegt ε in A/B?','Wenn A∩B nicht leer ist.','Nur wenn A leer ist.','Immer wenn ε∈B, unabhängig von A.','Für u=ε lautet uv=v. Es muss ein Wort zugleich in A und B geben.',3]
 ],
 regex:[
 ['Wie wird 0∪10* geklammert?','0 ∪ (1(0*))','(0∪1)0*','(0∪10)*','Stern bindet stärker als Verkettung, Verkettung stärker als Vereinigung.'],
 ['Welcher Ausdruck beschreibt genau {ε,0}?','ε∪0','0*','0⁺','0* erlaubt zusätzlich 00, 000 und weitere Wörter.',2],
 ['Ein Test prüft alle Wörter bis Länge 8 erfolgreich. Ist die RegEx-Gleichheit bewiesen?','Nein, ein längeres Gegenbeispiel ist möglich.','Ja, acht reicht für jeden Ausdruck.','Nur wenn ε fehlt.','Endliche Stichproben ersetzen keinen vollständigen Äquivalenztest.',3,'debug'],
 ['Was beschreibt (∅)*?','{ε}','∅','Σ*','Der Stern erlaubt null Wiederholungen.'],
 ['Welche Umformung ist allgemein korrekt?','(R∪S)T = RT∪ST','(RS)* = R*S*','R∪S = RS','Die Verkettung verteilt sich über die Vereinigung; Stern trennt dagegen keine beliebigen Blöcke.',3]
 ],
 construct:[
 ['Eine RegEx für „enthält 01“ braucht um 01 herum …','beliebige Binärwörter auf beiden Seiten.','nur Nullen links und rechts.','zwingend eine weitere 01.','(0|1)*01(0|1)* erlaubt jedes Präfix und Suffix.',2],
 ['Warum ist (0|1)*1(0|1)* ungeeignet für „genau eine 1“?','Die freien Bereiche können weitere Einsen erzeugen.','Es erzeugt keine Eins.','Es akzeptiert ε.','Für genau eine Eins dürfen die übrigen Bereiche nur Nullen enthalten: 0*10*.',2,'debug'],
 ['„Höchstens zwei Einsen“ enthält welchen Randfall?','ε','Nur Wörter der Länge mindestens zwei.','Keine Wörter ohne Eins.','Null Einsen sind höchstens zwei Einsen.'],
 ['Was ist beim Nachweis L(R)=L zu zeigen?','Jedes erzeugte Wort ist erlaubt und jedes erlaubte Wort wird erzeugt.','Nur drei positive Beispiele.','Nur dass R sehr kurz ist.','Beide Inklusionen verhindern falsche positive und falsche negative Ergebnisse.',3],
 ['„Beginnt auf 0 und endet auf 1“: Was ist das kürzeste Wort?','01','ε','1','Die beiden Pflichtzeichen unterscheiden sich und brauchen zwei Positionen.',2]
 ],
 dfa:[
 ['Darf ein akzeptierender DEA-Zustand ausgehende Übergänge besitzen?','Ja, bei einem vollständigen DEA sogar für jedes Symbol.','Nein, er hält sofort beim Betreten.','Nur bei ε.','Akzeptiert wird nach Verarbeitung des ganzen Wortes.'],
 ['Wie viele ausgehende Übergänge pro Zustand hat ein vollständiger DEA über {a,b,c}?','Drei, genau einen je Symbol.','Beliebig viele pro Symbol.','Genau einen insgesamt.','Deterministisch und vollständig bedeutet eine eindeutig bestimmte Folgeposition für jedes Eingabezeichen.',2],
 ['Was bedeutet δ*(q,ε)?','q','Immer der Startzustand.','Immer ein Endzustand.','Ohne gelesene Zeichen ändert sich der aktuelle Zustand nicht.'],
 ['Ein Lauf besucht F und endet außerhalb F. Ergebnis?','Ablehnen','Akzeptieren','Unentscheidbar','Ein früherer Besuch eines Endzustands genügt nicht.',2,'debug'],
 ['Welche Zustandsinformation braucht ein DEA für „letztes Zeichen 0“?','Ob das aktuelle Präfix auf 0 endet.','Das gesamte Wort.','Die exakte Anzahl aller Zeichen.','Die gewünschte Eigenschaft hängt nur von endlicher relevanter Information ab.',3]
 ],
 parity:[
 ['Sprache: ungerade viele Einsen. Ist der Start akzeptierend?','Nein, null ist gerade.','Ja, weil noch kein Fehler vorliegt.','Das hängt vom ersten Zeichen ab.','Akzeptanz von ε ist bereits durch den Startzustand festgelegt.'],
 ['Was passiert bei zwei aufeinanderfolgenden Einsen im Paritätsautomaten?','Man kehrt zum vorherigen Paritätszustand zurück.','Man bleibt immer ungerade.','Man benötigt einen dritten Zustand.','Zweimal umschalten stellt die ursprüngliche Parität wieder her.',2],
 ['Kann ein Zwei-Zustands-Paritätsautomat auch „genau zwei Einsen“ erkennen?','Nicht derselbe Automat; er akzeptiert auch vier, sechs usw.','Ja, gerade bedeutet zwei.','Ja, wenn genug Nullen vorkommen.','Restklasse und exakte Anzahl sind verschiedene Bedingungen.',3,'debug'],
 ['Wie viele Restklassen gibt es für die Anzahl Einsen modulo 3?','3','2','Unendlich viele','Die Zustände können für die Reste 0, 1 und 2 stehen.',2],
 ['Ein 0-Übergang schaltet im Automaten für gerade viele Einsen um. Warum ist das falsch?','Eine Null verändert die Anzahl der Einsen nicht.','Eine Null muss immer abgelehnt werden.','Nullen sind nicht im Alphabet.','Zustandsübergänge müssen zur erklärten Zustandsbedeutung passen.',2,'debug']
 ],
 alternate:[
 ['Die Sprache vermeidet 00 und 11. Gehört das einzelne Wort 0 hinein?','Ja','Nein, es endet noch nicht auf 1.','Nur bei gerader Wortlänge.','In einem einstelligen Wort gibt es keine zwei gleichen Nachbarn.'],
 ['Warum ist ein eigener Startzustand beim üblichen Vier-Zustands-DEA für alternierende Wörter nützlich?','Vor dem ersten Zeichen gibt es noch kein letztes Zeichen.','Er speichert bereits das vollständige Wort.','Er ersetzt den Fehlerzustand.','Vom Start sind 0 und 1 zulässig; nach einer 0 dagegen keine weitere 0.',2],
 ['Welches Suffix trennt die Situationen „zuletzt 0“ und „zuletzt 1“?','0','ε','Kein Suffix kann das.','Nach letzter 0 erzeugt 0 einen Fehler; nach letzter 1 bleibt es zulässig.',3],
 ['Darf ein bereits gesehenes 11 durch Anhängen von 0 wieder gültig werden?','Nein, das verbotene Teilwort bleibt enthalten.','Ja, das letzte Paar ist dann 10.','Ja, jedes Wort kann repariert werden.','Die Bedingung gilt für alle benachbarten Zeichen, nicht nur für das letzte Paar.',2,'debug'],
 ['Was ändert sich bei „nichtleere alternierende Wörter“ am üblichen Automaten?','Der Startzustand darf nicht akzeptieren.','Der Fehlerzustand muss akzeptieren.','Alle Übergänge werden umgedreht.','Der Start steht nur für ε; alle nichtleeren gültigen Präfixe enden in den anderen gültigen Zuständen.',3]
 ],
 complement:[
 ['Ein DEA ist unvollständig. Wie vervollständigst du ihn?','Fehlende Übergänge in einen neuen nicht akzeptierenden Fangzustand mit Schleifen führen.','Fehlende Pfeile einfach weglassen.','Alle alten Zustände akzeptierend machen.','Erst vollständige Verarbeitung jedes Wortes erlaubt Komplementbildung durch Vertauschen von F.',2],
 ['L=Σ*. Was ist Lᶜ relativ zu Σ*?','∅','{ε}','Σ*','Kein Wort der Grundmenge liegt außerhalb von Σ*.'],
 ['Warum scheitert bloßes Endzustandsumdrehen bei einem NEA?','Ein Wort kann zugleich einen akzeptierenden und einen nicht akzeptierenden Lauf haben.','NEAs besitzen keine Zustände.','Komplement ist für reguläre Sprachen nicht definiert.','Existenz eines nicht akzeptierenden Laufs ist nicht gleich Fehlen eines akzeptierenden Laufs.',3],
 ['Was bleibt bei der Komplementbildung eines vollständigen DEA gleich?','Start, Alphabet und Übergänge.','Nur die Endzustände.','Gar nichts.','Allein F wird zu Q∖F.'],
 ['Der alte Fangzustand war nicht akzeptierend. Was gilt im Komplement?','Er akzeptiert jetzt alle dort endenden Läufe.','Er wird entfernt.','Seine Schleifen werden gelöscht.','Auch im Fangzustand endende Wörter gehören genau zu einer der beiden Sprachen.',2]
 ],
 grammar:[
 ['S→aS|b. Wie viele Anwendungen von S→aS erzeugen aaab?','3','4','1','Drei Regeln fügen je ein a hinzu, dann beendet S→b die Ableitung.',2],
 ['Warum ist aSb noch kein fertiges Wort, wenn S eine Variable ist?','Es enthält noch ein Nichtterminal.','Es ist zu lang.','Wörter dürfen keine b enthalten.','Fertige Wörter bestehen ausschließlich aus Terminalen.'],
 ['S→aSb|ε. Was erzeugt die Grammatik?','{aⁿbⁿ:n≥0}','Alle Wörter mit gleich vielen a und b in beliebiger Reihenfolge.','Nur {ε,ab}','Jeder rekursive Schritt fügt außen ein a und ein b hinzu. Die Reihenfolge ist fest.',2],
 ['Ein Schüler verwechselt V und Σ. Welche Trennung ist nötig?','Nichtterminale und Terminale sind disjunkt.','Jedes Zeichen gehört zu beiden.','V enthält ausschließlich fertige Wörter.','Variablen werden ersetzt, Terminale bilden die erzeugten Wörter.',1,'debug'],
 ['Warum beweisen zwei verschiedene Ableitungsreihenfolgen nicht automatisch Mehrdeutigkeit?','Sie können denselben Syntaxbaum beschreiben.','Jede Grammatik ist eindeutig.','Ableitungen sind keine Beweise.','Mehrdeutigkeit erfordert für ein Wort verschiedene Syntaxbäume, äquivalent verschiedene Linksableitungen.',3]
 ],
 hierarchy:[
 ['Welche Inklusionsrichtung stimmt?','REG ⊊ CFL ⊊ CSL ⊊ RE','RE ⊊ REG','CFL ⊊ REG','Die Chomsky-Sprachklassen werden schrittweise mächtiger. ε-Konventionen müssen konsistent sein.',2],
 ['L ist kontextfrei. Ist L dadurch automatisch nicht regulär?','Nein, jede reguläre Sprache ist auch kontextfrei.','Ja','Nur wenn ε enthalten ist.','Sprachklassen sind geschachtelt; „kontextfrei“ heißt nicht „ausschließlich kontextfrei“.'],
 ['Welches Modell passt zu Typ 1?','Linear beschränkte nichtdeterministische Turingmaschine.','Nur ein endlicher Automat.','Ausschließlich ein deterministischer Kellerautomat.','Kontextsensitive Sprachen werden durch linear beschränkte Automaten charakterisiert.',2],
 ['Jede Typ-0-Sprache ist entscheidbar. Stimmt das?','Nein, Typ 0 umfasst rekursiv aufzählbare, auch unentscheidbare Sprachen.','Ja, jede Grammatik hält sofort.','Ja, weil Typ 0 kleiner als Typ 3 ist.','Eine Typ-0-Grammatik liefert Semi-Entscheidbarkeit, nicht immer einen Entscheider.',3,'debug'],
 ['Für {aⁿbⁿcⁿ:n≥0} reicht im Allgemeinen ein einzelner Kellerautomat?','Nein; die Sprache ist nicht kontextfrei.','Ja, jede Zählaufgabe braucht nur einen Keller.','Ja, weil drei Terminale endlich sind.','Ein endliches Alphabet begrenzt nicht die Schwierigkeit der Abhängigkeiten zwischen Zeichenblöcken.',3]
 ],
 transfer:[
 ['Ein unbekanntes Wort endet auf 01. Wie kannst du eine falsche RegEx dafür widerlegen?','Ein Wort mit unterschiedlicher Zugehörigkeit finden.','Nur ihre Textlänge vergleichen.','Beide Ausdrücke müssen gleich aussehen.','Ein Gegenbeispiel widerlegt Gleichheit, auch wenn viele andere Wörter übereinstimmen.',2],
 ['Was zeigt eine korrekte Übersetzung RegEx→DEA grundsätzlich?','Dieselbe Sprache lässt sich unterschiedlich darstellen.','Der DEA muss genauso viele Zustände wie Zeichen im Ausdruck haben.','Die Sprache muss endlich sein.','Der Satz von Kleene verbindet reguläre Ausdrücke mit endlichen Automaten.'],
 ['Ein Beispiel klappt nur für Wortlänge≤5. Was fehlt für eine allgemeine Lösung?','Ein Argument für beliebige endliche Längen.','Ein größeres Bildschirmfoto.','Nichts, Aufgaben haben immer kurze Wörter.','Ein endlicher Testbereich kann systematische Fehler außerhalb des Bereichs übersehen.',3,'debug'],
 ['Wie weist man zwei Sprachen als verschieden nach?','Ein Wort nennen, das in genau einer liegt.','Beide Beschreibungen unterschiedlich formatieren.','Ein Wort nennen, das in beiden liegt.','Ungleichheit verlangt ein Element der symmetrischen Differenz.',2],
 ['Warum lohnt es sich, eine Zustandsbedeutung in Worten aufzuschreiben?','Jeder Übergang lässt sich damit auf Konsistenz prüfen.','Es ersetzt jeden Korrektheitsbeweis vollständig.','Dadurch wird der Automat immer kleiner.','Eine Invariante verbindet das gelesene Präfix mit der gespeicherten Information.',3]
 ],
 nea:[
 ['Ein Wort besitzt einen akzeptierenden und einen ablehnenden NEA-Lauf. Ergebnis?','Akzeptiert','Abgelehnt','Unentschieden','Ein akzeptierender vollständiger Lauf genügt.'],
 ['Wie viele Teilmengen besitzt eine n-elementige Zustandsmenge?','2ⁿ','n²','n!','Jeder Zustand kann unabhängig enthalten sein oder fehlen. Nicht alle Teilmengen müssen erreichbar sein.',2],
 ['Was bedeutet der DEA-Zustand ∅ bei der Potenzmengenkonstruktion?','Kein NEA-Lauf ist nach diesem Präfix mehr möglich.','Das leere Wort wurde akzeptiert.','Alle NEA-Zustände sind aktiv.','Ohne aktive Zustände bleibt jeder weitere Übergang in ∅.'],
 ['Wann akzeptiert eine Teilmenge T?','Wenn T mindestens einen alten Endzustand enthält.','Nur wenn alle Zustände in T Endzustände sind.','Genau dann, wenn T leer ist.','Akzeptanz ist existenziell über die möglichen Läufe.',2],
 ['Verbraucht ein ε-Übergang ein Eingabezeichen?','Nein','Ja, das Zeichen ε muss in der Eingabe stehen.','Nur beim Start.','ε-Schritte verändern die möglichen Zustände ohne Verbrauch von Eingabe.'],
 ['Eine ε-Hülle wurde nur um einen einzigen Schritt erweitert. Was kann fehlen?','Weitere über ε-Ketten erreichbare Zustände.','Nur unerreichbare Endzustände.','Nichts, ε-Ketten sind verboten.','Die Hülle umfasst beliebig viele, auch null ε-Schritte. Zyklen werden durch besuchte Zustände beendet.',2,'debug'],
 ['Was ist der Startzustand des Potenzmengen-DEA bei ε-NEAs?','Die ε-Hülle der Startzustandsmenge.','Immer die leere Menge.','Nur die alten Endzustände.','Vor dem ersten Zeichen können bereits beliebig viele ε-Schritte erfolgen.',2],
 ['Besitzen NEAs mehr Ausdrucksstärke als DEAs?','Nein, beide erkennen genau reguläre Sprachen.','Ja, sie erkennen alle kontextfreien Sprachen.','Ja, sie lösen das Halteproblem.','Nichtdeterminismus kann die Beschreibung verkürzen, ändert aber diese Sprachklasse nicht.',3]
 ],
 minimize:[
 ['Welches Wort unterscheidet einen Endzustand von einem Nichtendzustand sofort?','ε','Immer 000','Keines','Ohne weitere Zeichen entscheidet der aktuelle Akzeptanzstatus.'],
 ['Wann sind zwei DEA-Zustände äquivalent?','Wenn jedes Restwort aus beiden dieselbe Annahme ergibt.','Wenn ihre Namen gleich lang sind.','Wenn beide irgendeine Schleife besitzen.','Gleichwertig heißt gleiche Restsprache.'],
 ['Warum darf ein unerreichbarer Zustand entfernt werden?','Kein Eingabewort erreicht ihn vom Start.','Weil er nie Endzustand sein kann.','Weil jeder DEA alle Zustände erreicht.','Sein Verhalten beeinflusst die erkannte Sprache vom Start aus nicht.',2],
 ['Zwei Nichtendzustände gehen bei 1 in unterschiedliche bisherige Klassen. Was tun?','Ihre Klasse weiter aufteilen.','Sie zwingend zusammenlegen.','Den Übergang entfernen.','Das Zeichen 1 plus ein unterscheidendes Restwort trennt sie.',2],
 ['Wann endet die Partitionsverfeinerung?','Wenn kein Block weiter aufgeteilt wird.','Nach genau einem Durchlauf.','Sobald alle Zustände Endzustände sind.','Eine stabile Partition respektiert Annahme und alle Übergänge.'],
 ['Ein DEA hat sechs gezeichnete Zustände. Ist sein minimaler DEA sechsstellig?','Nicht unbedingt: Unerreichbarkeit und Äquivalenz können die Zahl reduzieren.','Immer','Nie','Die Zeichnung ist kein Minimalitätsnachweis.',2,'debug'],
 ['Minimaler vollständiger DEA für Σ* über nichtleerem Alphabet: Anzahl Zustände?','1','0','2','Ein akzeptierender Startzustand mit Schleifen auf allen Zeichen genügt.',2],
 ['Ein Suffix z trennt p und q. Können sie trotzdem verschmolzen werden?','Nein, das würde eine Wortentscheidung ändern.','Ja, wenn z länger als zwei ist.','Ja, wenn p und q beide nicht akzeptieren.','Auch lange Restwörter sind für Äquivalenz relevant.',3]
 ],
 pumping:[
 ['Was muss bei einer Pumping-Zerlegung w=xyz gelten?','|xy|≤p und |y|≥1','|y|=0','|x|=|z|','Die Schleife liegt innerhalb der ersten p Zeichen und muss nichtleer sein.'],
 ['Wer wählt im Nichtregularitätsbeweis die konkrete Zerlegung?','Der Beweis muss alle zulässigen Zerlegungen abdecken.','Du darfst nur eine bequeme wählen.','Die Wortlänge wählt automatisch y=w.','Die Regularitätsannahme verspricht eine Zerlegung; man muss jede Möglichkeit widerlegen.',3],
 ['Warum wählt man für {aⁿbⁿ} häufig aᵖbᵖ?','y liegt dann ganz im a-Block.','Das Wort ist nicht in der Sprache.','y muss dann alle b enthalten.','|xy|≤p beschränkt den pumpbaren Teil auf die ersten p a.',2],
 ['Was verändert Pumpen mit i=0?','Der Teil y wird entfernt.','Das ganze Wort wird gelöscht.','y wird verdoppelt.','xy⁰z=xz, da y⁰=ε.'],
 ['Was folgt, wenn ein bestimmtes Wort gut pumpbar ist?','Noch keine Regularität der ganzen Sprache.','Die Sprache ist bewiesen regulär.','Die Sprache ist endlich.','Eine notwendige globale Eigenschaft kann nicht durch ein Einzelbeispiel bewiesen werden.',3,'debug'],
 ['Wie zeigt man Regularität oft einfacher?','Einen passenden endlichen Automaten oder regulären Ausdruck angeben.','Das Pumping-Lemma rückwärts anwenden.','Ein langes Wort testen.','Konstruktive Charakterisierungen liefern einen positiven Nachweis.',2],
 ['Darf der gewählte Widerspruchsexponent i von der Zerlegung abhängen?','Ja','Nein, er muss immer p sein.','Nein, er muss vor w gewählt werden.','Zu jeder zulässigen Zerlegung genügt ein Exponent, der aus der Sprache herausführt.',3],
 ['Warum muss das Widerspruchswort selbst in L liegen?','Nur für ausreichend lange Wörter aus L verspricht das Lemma eine pumpbare Zerlegung.','Weil außerhalb L nur ε existiert.','Das ist nicht nötig.','Ein Wort außerhalb L aktiviert die Aussage des Lemmas nicht.',2,'debug']
 ],
 cnf:[
 ['Welche Regel hat strenge CNF-Form?','A→BC','A→B','A→aB','Zwei Variablen oder genau ein Terminal sind erlaubt.'],
 ['Warum ist A→BCD keine CNF-Regel?','Drei Variablen stehen rechts statt zwei.','C ist alphabetisch zu weit hinten.','Keine Terminale stehen rechts.','Mit einer neuen Variablen X: A→BX, X→CD.',2],
 ['Warum ersetzt man in A→aB das a durch eine Hilfsvariable?','Rechte Seiten der Länge zwei müssen aus Variablen bestehen.','Terminale sind in jeder Grammatik verboten.','Dadurch muss die Sprache leer werden.','A→TB und T→a erfüllen die benötigten Formen.',2],
 ['Was ist eine Kettenregel?','A→B mit zwei Nichtterminalen A und B.','A→a mit Terminal a.','A→BC mit zwei rechten Variablen.','Die alleinige Weitergabe an eine Variable ist keine strenge CNF-Form.'],
 ['Welche ε-Ausnahme verwenden wir?','S₀→ε ist erlaubt, wenn S₀ rechts nie vorkommt.','Jede Variable darf ε erzeugen.','ε ist immer ein Terminal.','Die Ausnahme erhält die leere Eingabe, ohne beliebige ε-Regeln zuzulassen.',2],
 ['Eine Grammatik ist mehrdeutig, wenn …','ein Wort zwei verschiedene Syntaxbäume besitzt.','es zwei verschiedene Wörter gibt.','es zwei Regeln insgesamt gibt.','Mehrdeutigkeit betrifft mehrere Strukturen für dasselbe Wort.',2],
 ['E→E+E|E*E|a. Warum ist a+a*a mehrdeutig?','Beide Gruppierungen (a+a)*a und a+(a*a) sind ableitbar.','Jedes a ist ein anderes Terminal.','Der Stern bindet in jeder Grammatik automatisch stärker.','Operatorpräzedenz muss durch Grammatikstruktur oder zusätzliche Regeln festgelegt werden.',3,'debug'],
 ['Wie vermeidest du neue Variablenkollisionen bei CNF-Umformungen?','Für jede Hilfsvariable einen frischen Namen wählen.','Immer S überschreiben.','Alle Variablen in a umbenennen.','Eine bereits belegte Variable kann zusätzliche unerwünschte Ableitungen erlauben.',2]
 ],
 cyk:[
 ['Was enthält eine CYK-Zelle für ein Teilwort?','Alle Variablen, die dieses Teilwort ableiten können.','Nur das erste Terminal.','Alle Wörter der Sprache.','Die Zelle beschreibt Ableitbarkeit für genau dieses zusammenhängende Teilwort.'],
 ['Woran erkennst du die Annahme des vollständigen Wortes?','S liegt in der obersten Zelle.','Irgendeine Zelle ist gefüllt.','Unten stehen nur Terminale.','Die oberste Zelle gehört zum gesamten Eingabewort.'],
 ['Wie viele Trennstellen hat ein Teilwort der Länge 4?','3','4','2','Es kann nach 1, 2 oder 3 Zeichen geteilt werden.',2],
 ['Warum ist nur die mittlere Zerlegung zu prüfen falsch?','Eine Ableitung kann jede erlaubte Trennstelle benutzen.','Die Mitte ist nie erlaubt.','CYK benötigt gar keine Zerlegung.','Alle Positionen und passenden Regelpaare müssen betrachtet werden.',2,'debug'],
 ['Laufzeit von CYK bei fester Grammatik und Wortlänge n?','O(n³)','O(log n)','Immer O(2ⁿ)','O(n²) Teilwörter mal O(n) Zerlegungen. Variable Grammatikgröße kommt als weiterer Faktor hinzu.',2],
 ['S→AB, A→a, B→b. Gehört ba zur Sprache?','Nein','Ja, Mengen sind ungeordnet.','Ja, S steht oben automatisch.','Die Reihenfolge A dann B erzeugt ab. CYK darf Nachbarteile nicht vertauschen.',2],
 ['Wie lässt sich aus einer erfolgreichen Tabelle ein Syntaxbaum rekonstruieren?','Eine passende Regel und Trennstelle je gewählter Variable zurückverfolgen.','Nur die Variablennamen sortieren.','Jede gefüllte Zelle an jede andere hängen.','Zeugen für die Tabellenbeiträge liefern die rekursive Struktur.',3],
 ['Ein leeres Wort wird in Standard-CYK für n≥1 nicht abgedeckt. Was tun?','Die erlaubte ε-Startregel gesondert prüfen.','ε als gewöhnliches Zeichen anhängen.','ε grundsätzlich akzeptieren.','Die CNF-Ausnahme bestimmt, ob ε zur Sprache gehört.',3]
 ],
 stack:[
 ['Welches Speicherprinzip hat ein Keller?','Last in, first out','First in, first out','Beliebiger Direktzugriff auf jede Zelle','Nur das oberste Element wird direkt gelesen oder entfernt.'],
 ['Welche Sprache erkennt das klassische Auflegen für a und Entfernen für b mit Phasenwechsel?','{aⁿbⁿ:n≥0}, mit passender ε-Behandlung.','Alle Wörter in beliebiger Reihenfolge mit beliebigen Anzahlen.','Nur reguläre Sprachen.','Der Keller gleicht die Anzahlen ab; Zustände sichern die Reihenfolge.',2],
 ['Sind deterministische und nichtdeterministische Kellerautomaten gleich mächtig?','Nein, die deterministische Klasse ist echt kleiner.','Ja, wie bei endlichen Automaten.','Beide erkennen nur endliche Sprachen.','Nichtdeterminismus erweitert hier die erkannte Sprachklasse.',2],
 ['CFL sind unter welcher Operation allgemein abgeschlossen?','Vereinigung','Komplement','Schnitt zweier beliebiger CFL','Vereinigung, Konkatenation und Stern erhalten Kontextfreiheit.'],
 ['Was gilt für CFL L und reguläres R?','L∩R ist kontextfrei.','L∩R ist zwingend endlich.','L∩R ist nie kontextfrei.','Ein Kellerautomat kann zusätzlich den endlichen Zustand des DEA mitführen.',3],
 ['Für aⁿb²ⁿ soll pro a nur ein Marker gelegt und pro b einer entfernt werden. Fehler?','Man muss zwei Marker pro a legen oder passend in Zweiergruppen abbauen.','Marker sind generell ungeeignet.','Die Sprache ist endlich.','Die gespeicherte Menge muss das Verhältnis 1:2 abbilden.',2,'debug'],
 ['Nach Beginn der b-Phase ist bei aⁿbⁿ ein a erlaubt?','Nein','Ja, wenn noch Marker übrig sind.','Ja, wenn n gerade ist.','Die Phasenbedingung ist zusätzlich zur Anzahlbedingung nötig.',2],
 ['Warum folgt aus Nichtabgeschlossenheit unter Schnitt nicht, dass jeder CFL-Schnitt nicht kontextfrei ist?','Es gibt Gegenbeispiele zur allgemeinen Regel, aber auch viele kontextfreie Einzelfälle.','Jeder Schnitt ist leer.','CFL sind doch unter allen Schnitten abgeschlossen.','„Nicht allgemein abgeschlossen“ ist keine Aussage über jedes einzelne Paar.',3]
 ],
 tm:[
 ['In u q a v steht der Kopf wo?','Auf a','Auf dem letzten Zeichen von u','Außerhalb des Bandes','Das Zustandszeichen steht unmittelbar vor dem gelesenen Symbol.'],
 ['Was legt eine TM-Übergangsregel fest?','Neuen Zustand, geschriebenes Zeichen und Kopfbewegung.','Nur die nächste Eingabe.','Die Antwort für alle zukünftigen Schritte.','Ein Schritt ist lokal und hängt vom aktuellen Zustand und gelesenen Zeichen ab.'],
 ['Eine NTM hat einen akzeptierenden und einen endlosen Zweig. Wird die Eingabe akzeptiert?','Ja','Nein','Nur wenn alle Zweige halten.','Akzeptanz verlangt die Existenz eines akzeptierenden endlichen Laufs.',2],
 ['Was garantiert die Simulation einer NTM durch eine DTM?','Dieselbe Berechenbarkeit, nicht automatisch gleiche Laufzeit.','Immer lineare Laufzeit.','Dass P=NP bewiesen ist.','Systematisches Durchsuchen der Verzweigungen kann erheblich mehr Zeit beanspruchen.',3],
 ['Warum ist Tiefensuche in nur einem endlosen NTM-Zweig problematisch?','Sie kann einen akzeptierenden anderen Zweig für immer verpassen.','Eine NTM besitzt keine Zweige.','Jeder andere Zweig lehnt dann zwingend ab.','Breitensuche oder faire verzahnte Simulation vermeidet das Verhungern anderer Zweige.',3,'debug'],
 ['Eine TM hält bei fünf Beispielwörtern. Was folgt für alle Wörter?','Keine allgemeine Haltegarantie.','Sie ist ein Entscheider.','Ihre Sprache ist endlich.','Beispiele ersetzen keinen Terminierungsbeweis.',2],
 ['Eine Bandzelle enthält □. Ist damit automatisch das Programm beendet?','Nein, die Übergangsregel bestimmt das weitere Verhalten.','Ja, immer.','Nur wenn links eine 1 steht.','Blank ist ein Bandsymbol. Der Halt ist gesondert definiert.'],
 ['Warum benötigt Binärinkrement bei 111 einen besonderen linken Randfall?','Der Übertrag erzeugt eine zusätzliche führende 1.','Das Wort ist keine Binärzahl.','Man muss alle Zeichen löschen.','111+1=1000. Der Übertrag läuft über alle Einsen hinaus.',2]
 ],
 np:[
 ['Was bedeutet NP?','Nichtdeterministische Polynomialzeit.','Nicht polynomial.','Nicht programmierbar.','Äquivalent lassen sich Ja-Zertifikate deterministisch polynomial prüfen.'],
 ['Ist P⊆NP?','Ja','Nein','Nur für Graphen','Ein polynomialer Entscheider kann als Prüfer ohne hilfreiches Zertifikat dienen.'],
 ['Was zertifiziert eine Clique der Größe mindestens k?','k Knoten mit allen paarweisen Kanten.','k beliebige Kanten.','Ein einzelner Knoten mit hohem Grad.','Der Prüfer kontrolliert die Auswahl und höchstens k(k−1)/2 Paare.',2],
 ['Was muss ein Vertex Cover überdecken?','Jede Kante durch mindestens einen ausgewählten Endpunkt.','Nur alle ausgewählten Knoten.','Jeden Knoten durch einen Nachbarn.','Vertex Cover ist keine dominierende Menge.',2,'debug'],
 ['Welche Form ist ein Entscheidungsproblem?','Gibt es ein Vertex Cover mit höchstens k Knoten?','Finde das kleinste Vertex Cover.','Gib alle Vertex Cover aus.','Ein Schwellenwert verwandelt die Optimierungsaufgabe in eine Ja/Nein-Frage.',2],
 ['Ein vollständiger Graph mit n≥3 hat einen Hamiltonkreis. Was folgt?','Diese Spezialinstanzen sind leicht; das allgemeine Problem wird dadurch nicht leicht.','Hamiltonkreis ist damit allgemein in P bewiesen.','Hamiltonkreis liegt nicht in NP.','Jede Reihenfolge der Knoten schließt sich im vollständigen Graphen zum Kreis.',3],
 ['Worin unterscheiden sich „maximal“ und „größt“ bei Cliquen?','Maximal: nicht erweiterbar. Größt: global größte Anzahl Knoten.','Sie sind stets dasselbe.','Maximal heißt kleinste Anzahl.','Eine lokal nicht erweiterbare Clique kann kleiner als eine andere Clique sein.',3],
 ['Reicht ein polynomialer Prüfer allein für NP-Vollständigkeit?','Nein, NP-Schwere muss zusätzlich gezeigt werden.','Ja','Nur bei 0-1-Eingaben.','Zugehörigkeit zu NP und NP-Schwere sind zwei getrennte Nachweise.',2]
 ],
 reduction:[
 ['A≤ₚB und B∈P. Was folgt?','A∈P','A ist unentscheidbar.','B ist NP-vollständig.','Erst übersetzen, dann B entscheiden: Beide Schritte brauchen polynomial viel Zeit.',2],
 ['Du willst B als NP-schwer zeigen. Welche Richtung brauchst du?','Bekannt schweres A ≤ₚ B','B ≤ₚ leichtes A reicht immer.','Nur B ≤ₚ B','Ein B-Löser soll das bekannte schwere A lösen können.',2],
 ['Was muss die Abbildung f einer Entscheidungsreduktion erhalten?','x∈A genau dann, wenn f(x)∈B.','Nur die Länge der Zeichenfolge.','Nur Nein-Instanzen, Ja-Instanzen dürfen wechseln.','Beide Richtungen sind notwendig, damit die Antwort nutzbar ist.'],
 ['CLIQUE auf INDEPENDENT SET: Welche Transformation passt?','Komplementgraph bilden, k beibehalten.','Graph unverändert lassen und k verdoppeln.','Alle Knoten löschen.','Kanten innerhalb der Clique werden im Komplement zu Nichtkanten.',2],
 ['U unabhängige Menge in G. Welche Menge ist ein Vertex Cover?','V∖U','Immer U selbst.','Immer ∅','Keine Kante kann beide Endpunkte in U haben; daher berührt jede V∖U.',2],
 ['Eine Reduktion erzeugt exponentiell viele Ausgabeknoten. Problem?','Sie ist so keine polynomiale explizite Transformation.','Keines, Hauptsache korrekt.','Nur die Knotennamen sind relevant.','Auch Ausgabegröße und Konstruktionszeit gehören zum Reduktionsbeweis.',3,'debug'],
 ['B ist NP-schwer, aber B∈NP wurde nicht gezeigt. Darf man NP-vollständig behaupten?','Nein','Ja, beide Wörter bedeuten dasselbe.','Nur wenn B ein Graphproblem ist.','NP-Vollständigkeit verlangt zusätzlich Zugehörigkeit zu NP.'],
 ['Falls ein NP-vollständiges Problem in P liegt, folgt …','P=NP','P≠NP','Nur dieses eine Problem ist leicht.','Alle NP-Probleme reduzieren sich polynomial auf dieses Problem.',3]
 ],
 decidable:[
 ['Ein Entscheider muss …','auf jeder Eingabe halten und korrekt Ja oder Nein liefern.','nur auf Ja-Eingaben halten.','immer eine Sprache aufzählen.','Totales Halten trennt Entscheider von bloßen Semi-Entscheidern.'],
 ['Ein Semi-Entscheider darf bei einer Nein-Eingabe …','ablehnen oder endlos laufen.','fälschlich akzeptieren.','nur nach genau zwei Schritten halten.','Mitglieder müssen irgendwann akzeptiert werden, Nichtmitglieder niemals.'],
 ['L und Lᶜ sind semi-entscheidbar. Was folgt?','L ist entscheidbar.','L ist zwingend endlich.','L ist unentscheidbar.','Beide Simulationen fair verzahnen; genau eine akzeptiert irgendwann.',3],
 ['Welche Frage ist syntaktisch und fällt nicht unter Rice?','Hat der gegebene Programmtext genau zehn Zustände?','Berechnet das Programm überall die Nullfunktion?','Ist seine berechnete partielle Funktion irgendwo definiert?','Rice betrifft nichttriviale semantische Funktionseigenschaften, keine bloße Textstruktur.',2],
 ['Warum darf Rice nicht ohne Prüfung auf jede Programmeigenschaft angewendet werden?','Semantik und Nichttrivialität sind Voraussetzungen.','Rice gilt nur für reguläre Ausdrücke.','Alle Programmeigenschaften sind entscheidbar.','Manche syntaktischen Eigenschaften sind direkt durch Lesen des Textes entscheidbar.',3,'debug'],
 ['Ist das Halteproblem für beliebige Programme durch viele erfolgreiche Tests gelöst?','Nein','Ja, ab einer Million Tests.','Ja, wenn alle Tests klein sind.','Ein Algorithmus für alle möglichen Eingaben ist erforderlich, kein endlicher Testkatalog.',2],
 ['Was bedeutet unentscheidbar für einzelne konkrete Instanzen?','Manche Instanzen können trotzdem leicht gelöst werden.','Keine einzige Instanz darf lösbar sein.','Jede Instanz braucht unendlich viele Schritte.','Unentscheidbarkeit betrifft das Fehlen eines korrekten totalen allgemeinen Verfahrens.',2],
 ['Wie ist RE zur Entscheidbarkeit einzuordnen?','Jede entscheidbare Sprache ist RE, aber nicht jede RE-Sprache entscheidbar.','Beide Klassen sind gleich.','Keine entscheidbare Sprache ist RE.','Ein Entscheider liefert insbesondere einen Semi-Entscheider. Das Halteproblem zeigt die echte Erweiterung.',3]
 ]
};
const hints={
 motivation:'Trenne einzelne Beispiele, allgemeine Aussagen und genaue Erkennung.',complexity:'Zähle tatsächlich ausgeführte Schritte und beachte die Größe der Kodierung.',notation:'Übersetze Quantoren und unterscheide Elemente von Mengen.',alphabet:'Zähle Symbole gemäß dem ausdrücklich festgelegten Alphabet.',empty:'Unterscheide Wortlänge, Anzahl der Wörter und null Wiederholungen.',languages:'Prüfe sowohl die Reihenfolge als auch die Anzahl und den Fall ε.',sets:'Überlege für ein einzelnes Wort, welche Zugehörigkeitsbedingungen gelten.',concat:'Wähle je ein Wort aus jeder Sprache. Reihenfolge beachten, doppelte Ergebnisse streichen.',closure:'Schreibe die Potenzen L⁰, L¹ und L² getrennt auf.',quotient:'Suche ein ganzes passendes Endstück, nicht irgendeinen Teil des Wortes.',regex:'Kläre Klammerung und die Bedeutung von null Wiederholungen.',construct:'Trenne Pflichtzeichen und freie Bereiche und teste ε.',dfa:'Prüfe den Zustand nach der gesamten Eingabe.',parity:'Notiere, welche Information der Zustand speichern soll.',alternate:'Überlege, ob ein früherer Regelverstoß durch ein Suffix verschwinden kann.',complement:'Beachte Vollständigkeit, Grundalphabet und das Akzeptanzkriterium.',grammar:'Unterscheide Zwischenform und fertiges Terminalwort.',hierarchy:'Sprachklassen sind ineinander enthalten; ein Modell liefert eine Charakterisierung.',transfer:'Vergleiche beide Richtungen und suche ein kurzes Gegenbeispiel.',nea:'Verfolge alle möglichen Zustände einschließlich der ε-Hülle.',minimize:'Suche ein Restwort, das zu unterschiedlichen Annahmeentscheidungen führt.',pumping:'Schreibe die Quantoren in ihrer Reihenfolge auf.',cnf:'Prüfe Anzahl und Art der Symbole auf jeder rechten Seite.',cyk:'Betrachte alle Zerlegungen; die Reihenfolge der Teilwörter bleibt erhalten.',stack:'Trenne gespeicherte Anzahl, Eingabephase und Annahmebedingung.',tm:'Notiere Band, Zustand und Kopfposition vor dem nächsten Schritt.',np:'Trenne Entscheidung, Zertifikatsprüfung und Optimierung.',reduction:'Welche Problemlösung könnte mit der Übersetzung welche andere ersetzen?',decidable:'Prüfe Halten auf Ja- und Nein-Eingaben getrennt.'
};
export const extraQuestions=Object.entries(concepts).flatMap(([lesson,rows])=>rows.map(([prompt,answer,b,c,explanation,level=1,kind='concept'],i)=>({id:`extra-${lesson}-${i+1}`,lesson,prompt,options:[answer,b,c],answer:0,explanation,type:'choice',level,kind,hint:hints[lesson],family:`concept-${lesson}-${i+1}`})));
const add=(id,lesson,type,prompt,answer,explanation,level=2,kind='calculate',family=id)=>extraQuestions.push({id,lesson,type,prompt,answer,explanation,level,kind,family,hint:hints[lesson]});
// Deterministic, versioned IDs keep saved progress stable across visits and devices.
for(const [index,[a,b]] of [ [['','0'],['1','01']], [['0','00','1'],['','0']], [['','01','10'],['0','1']], [['a','ab','aba'],['b','ba']], [['','a','aa'],['','a']], [['0','10','110'],['0','10']], [['','1','11'],['1','11']], [['ab','abb','b'],['b','bb']], [['00','01','10'],['0','1']], [['','a','ba'],['a','ba']], [['001','01','1'],['1']], [['','01'],['','10']] ].entries()){
  for(const [op,symbol,lesson] of [['union','∪','sets'],['intersection','∩','sets'],['difference','∖','sets'],['concat','·','concat'],['quotient','/','quotient']]){
    const answer=languageOperation(a,b,op),why=op==='concat'?a.flatMap(x=>b.map(y=>`${wordLabel(x)}·${wordLabel(y)}=${wordLabel(x+y)}`)).join('; '):op==='quotient'?a.flatMap(x=>b.filter(y=>x.endsWith(y)).map(y=>`${wordLabel(x)} ohne ${wordLabel(y)} ergibt ${wordLabel(y?x.slice(0,-y.length):x)}`)).join('; ')||'Kein Wort aus A hat ein Suffix aus B.':op==='union'?'Alle vorhandenen Wörter aus A oder B aufnehmen.':op==='intersection'?'Nur die Wörter aufnehmen, die in beiden Mengen vorkommen.':'Nur Wörter aus A aufnehmen, die nicht in B liegen.';
    add(`variant-${op}-${index+1}`,lesson,'set',`A=${setLabel(a)}, B=${setLabel(b)}. Berechne A ${symbol} B.${op==='quotient'?' / ist der Rechtsquotient.':''}`,answer,`${why} Ergebnis: ${setLabel(answer)}.`,index>6?3:2,'calculate',op);
  }
}
for(let k=2;k<=4;k++)for(let length=0;length<=4;length++)add(`variant-words-${k}-${length}`,'alphabet','number',`Ein Alphabet enthält ${k} verschiedene Symbole. Wie viele Wörter haben genau Länge ${length}?`,k**length,`Für jede Position ${k} Möglichkeiten: ${k}^${length}=${k**length}. Bei Länge null gibt es ε.`,length>2?2:1,'calculate','word-count');
for(let factor=2;factor<=5;factor++)for(let power=1;power<=3;power++)add(`variant-growth-${factor}-${power}`,'complexity','number',`T(n)=n^${power}. Die Eingabelänge wird ${factor}-mal so groß. Um welchen Faktor steigt T?`,factor**power,`(${factor}n)^${power}/n^${power}=${factor}^${power}=${factor**power}.`,2,'calculate','growth-factor');
for(const block of ['0','01','10','001'])for(let p=0;p<=3;p++)add(`variant-power-${block}-${p}`,'empty','text',`Schreibe das Wort (${block})^${p}. Für das leere Wort gib ε ein.`,block.repeat(p)||'ε',`${p} vollständige Wiederholungen ergeben ${wordLabel(block.repeat(p))}. Die nullte Potenz ist ε.`,1,'calculate','word-power');
for(const [id,m] of Object.entries(machines).filter(([id])=>['ends1','parity','alternate','contains1'].includes(id)))for(const w of ['','0','1','010','101','0011','10110','01010']){
 const run=runDfa(m,w),lesson=id==='parity'?'parity':id==='alternate'?'alternate':'dfa';
 extraQuestions.push({id:`variant-run-${id}-${w||'eps'}`,lesson,type:'choice',prompt:`DEA „${m.name}“: Start ${m.start}, F=${setLabel(m.accept)}. ${m.states.map(s=>`${s}: 0→${m.transitions[s][0]}, 1→${m.transitions[s][1]}`).join('; ')}. Wird ${wordLabel(w)} akzeptiert?`,options:['Ja','Nein'],answer:run.accepted?0:1,explanation:`Lauf: ${run.trace.join(' → ')}. Der letzte Zustand ${run.state} ${run.accepted?'liegt':'liegt nicht'} in F.`,hint:hints[lesson],level:w.length>3?2:1,kind:'calculate',family:`run-${id}`,dfaFeedback:{machine:m,word:w,title:'Der DEA aus dieser Aufgabe'}});
}
for(const [i,expression] of ['0*','(01)*','0|10*','(0|1)*01','0*10*','(0|1)(0|1)','(00|11)*','0*(10*10*)*'].entries()){
 const matcher=compileRegex(expression),answer=binaryWords(3).filter(w=>matcher.test(w));
 add(`variant-regex-list-${i}`,'regex','set',`Welche Wörter mit Länge höchstens 3 liegen in L(${expression}) über {0,1}? Liste alle auf, auch ε, falls passend.`,answer,`Für jede Länge von 0 bis 3 prüfen und ganze Blöcke beachten. Es bleiben ${setLabel(answer)}.`,2,'calculate',`regex-list-${i}`);
}
for(const [i,[prompt,target]] of [['Endet auf 10','(0|1)*10'],['Beginnt mit 01','01(0|1)*'],['Enthält mindestens eine 0','(0|1)*0(0|1)*'],['Enthält genau drei Einsen','0*10*10*10*'],['Hat Länge genau 4','(0|1)(0|1)(0|1)(0|1)'],['Besteht aus beliebig vielen vollständigen 10-Blöcken','(10)*'],['Hat höchstens zwei Einsen','0*(ε|10*|10*10*)'],['Beginnt mit 0 und endet mit 1','0(0|1)*1'],['Enthält 11 als Teilwort','(0|1)*11(0|1)*'],['Hat ungerade viele Einsen','0*10*(10*10*)*'],['Enthält keine 0','1*'],['Ist ε oder beginnt mit 1','ε|1(0|1)*']].entries())add(`variant-build-regex-${i}`,'construct','regex',`Konstruiere eine RegEx über {0,1}: ${prompt}.`,target,`Ein möglicher Ausdruck ist ${target}. Andere Ausdrücke mit genau derselben Sprache gelten ebenfalls.`,i>5?3:2,'construct',`regex-build-${i}`);
for(const [i,rules] of cnfExamples.entries())for(const word of ['ab','ba','aabb','abab','abba','baab']){
 const result=cyk(rules,word);
 add(`variant-cyk-${i}-${word}`,'cyk','set',`CNF: ${ruleText(rules)}. Welche Variablen stehen in der obersten CYK-Zelle für ${word}?`,result.top,`Zeilen nach Teilwortlänge: ${result.table.map((row,j)=>`${j+1}: ${row.slice(0,word.length-j).map(setLabel).join(' / ')}`).join('; ')}. ${result.accepted?'S ist enthalten, das Wort gehört dazu.':'S fehlt, das Wort wird abgelehnt.'}`,3,'calculate',`cyk-${i}`);
}
const nfa={start:'p',accept:['r'],alphabet:['0','1'],transitions:{p:{0:['p','q'],1:['p']},q:{0:[],1:['r']},r:{0:[],1:[]}}};
for(const [i,states] of [[],['p'],['q'],['r'],['p','q'],['p','r'],['q','r'],['p','q','r']].entries())for(const symbol of ['0','1']){
 const answer=nfaStep(nfa,states,symbol);
 add(`variant-subset-${i}-${symbol}`,'nea','set',`NEA ohne ε: p:0→{p,q},1→{p}; q:0→∅,1→{r}; r:0→∅,1→∅. Welche Zustandsmenge folgt aus ${setLabel(states)} bei ${symbol}?`,answer,`${states.length?states.map(s=>`δ(${s},${symbol})=${setLabel(nfa.transitions[s][symbol])}`).join('; '):'Keine aktiven Zustände.'} Die Vereinigung ist ${setLabel(answer)}.`,2,'calculate','subset-step');
}
for(const word of ['0','1','10','11','101','110','111','1001','1011','1111']){
 const result=incrementTrace(word);
 add(`variant-tm-${word}`,'tm','text',`Binärinkrementierer: ${incrementRules} Eingabe ${word}. Welches Binärwort steht beim Halt auf dem Band (ohne □)?`,result.output,`${word}+1=${result.output}. Nach dem Rechtslauf werden abschließende Einsen zu Nullen, dann wird die erste 0 bzw. das linke Blank zur 1. Insgesamt ${result.rows.length-1} Schritte.`,2,'calculate','tm-increment');
}
const graphs=[[['a','b','c','d'],[['a','b'],['b','c'],['c','d']]], [['a','b','c','d'],[['a','b'],['b','c'],['a','c'],['c','d']]], [['a','b','c','d','e'],[['a','b'],['b','c'],['c','d'],['d','e'],['e','a']]], [['a','b','c','d'],[['a','b'],['a','c'],['a','d']]], [['a','b','c','d'],[['a','b'],['a','c'],['a','d'],['b','c'],['b','d'],['c','d']]], [['a','b','c','d'],[]]];
for(const [i,[vertices,edges]] of graphs.entries()){
 const solved=graphSolutions(vertices,edges),prefix=`Ungerichteter einfacher Graph V=${setLabel(vertices)}, E={${edges.map(e=>e.join('–')).join(', ')}}.`;
 add(`variant-clique-${i}`,'np','number',`${prefix} Wie groß ist eine größte Clique?`,solved.omega,`Größte Cliquen: ${solved.cliques.map(setLabel).join(' oder ')}. Alle Knotenpaare darin sind verbunden; keine größere Teilmenge erfüllt das.`,2,'calculate','clique-size');
 add(`variant-cover-${i}`,'np','number',`${prefix} Wie groß ist ein kleinstes Vertex Cover?`,solved.tau,`Kleinste Überdeckungen: ${solved.covers.map(setLabel).join(' oder ')}. Jede Kante berührt die Auswahl; keine kleinere Teilmenge genügt.`,3,'calculate','cover-size');
}
