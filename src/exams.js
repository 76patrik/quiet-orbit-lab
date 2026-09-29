import {ends0Dfa,modulo3Dfa} from './dfa-feedback.js';
import {week2Exam} from './week2-exam.js';
import {cyk,cnfExamples,ruleText,nfaStep,determinize,graphSolutions,incrementTrace,incrementRules,minimize} from './algorithms.js';
import {setLabel,machines} from './engine.js';
const auto=(id,topic,section,points,type,prompt,answer,solution,options)=>({id,topic,section,points,type,prompt,answer,solution,options});
const open=(id,topic,section,prompt,rubric,solution,materials)=>({id,topic,section,type:'open',prompt,rubric:rubric.map(([points,text])=>({points,text})),points:rubric.reduce((s,[p])=>s+p,0),solution,materials});
const shortRows=[
 [
 ['empty','Ist ∅* leer? Entscheide und begründe.','Nein. Auch null Wiederholungen gehören zur Sternhülle und ergeben ε; daher ∅*={ε}.'],
 ['complement','Darfst du einen unvollständigen DEA direkt durch Endzustandswechsel komplementieren?','Nein. Fehlende Übergänge müssen erst durch einen Fangzustand ergänzt werden, damit jedes Wort vollständig verarbeitet wird.'],
 ['stack','Sind alle kontextfreien Sprachen unter Komplement abgeschlossen?','Nein. Würden CFL unter Komplement abschließen, ergäbe De Morgan mit der Vereinigung auch Abschluss unter Schnitt; dieser gilt nicht allgemein.'],
 ['np','Bedeutet ein schnell prüfbares Zertifikat auch, dass man es schnell findet?','Nein. Polynomiale Prüfung einer vorgeschlagenen Lösung liefert allein keinen polynomialen Suchalgorithmus.'],
 ['decidable','Fällt „das Programm hat fünf Zustände“ unter Rice?','Nein. Dies ist eine syntaktische Eigenschaft des endlichen Programmcodes, nicht der berechneten partiellen Funktion.'],
 ['transfer','Ist jede endliche Sprache regulär?','Ja. Man kann die endlich vielen Wörter als reguläre Ausdrücke verketten und vereinigen; für die leere Sprache verwendet man ∅.'],
 ['nea','Ein NEA hat für w zwei Läufe: einer akzeptiert, einer lehnt ab. Akzeptiert er w?','Ja. Ein akzeptierender vollständiger Lauf genügt.'],
 ['reduction','A≤ₚB und B∈P. Muss A∈P gelten?','Ja. Übersetze A polynomial in B und führe dann den polynomialen B-Entscheider aus.']
 ],
 [
 ['closure','Gilt L⁺=L* für L={ε,01}? Begründe.','Ja. ε liegt bereits in L⁺, und L*=L⁺∪{ε}.'],
 ['minimize','Reicht gleicher Akzeptanzstatus, um zwei DEA-Zustände zu verschmelzen?','Nein. Es muss für jedes Restwort dieselbe Annahmeentscheidung entstehen; Übergänge können die Zustände noch unterscheiden.'],
 ['stack','Ist der Schnitt einer CFL mit einer regulären Sprache stets kontextfrei?','Ja. Ein Kellerautomat kann zusätzlich den endlichen Zustand des DEA im Produktzustand mitführen.'],
 ['np','Bedeutet NP „nicht polynomial“?','Nein. NP steht für nichtdeterministische Polynomialzeit; Ja-Zertifikate sind polynomial prüfbar und P ist in NP enthalten.'],
 ['decidable','Sind viele haltende Testläufe ein Beweis, dass ein Programm immer hält?','Nein. Endlich viele Eingaben decken eine unbeschränkte Eingabemenge nicht ab; es fehlt ein allgemeiner Terminierungsbeweis.'],
 ['pumping','Du findest eine schlecht pumpbare Zerlegung. Ist die Sprache damit nicht regulär?','Nein. Man muss für das passend gewählte Wort jede erlaubte Zerlegung widerlegen, nicht nur eine.'],
 ['grammar','Beweisen zwei Ableitungsreihenfolgen für ein Wort die Mehrdeutigkeit einer Grammatik?','Nicht allein. Sie können denselben Syntaxbaum ergeben. Nötig sind verschiedene Syntaxbäume oder verschiedene Linksableitungen.'],
 ['reduction','Genügt B≤ₚSAT, um B als NP-schwer zu bezeichnen?','Nein. Diese Richtung gibt eine obere Schwierigkeitsschranke. Für Schwere braucht man die Reduktion eines bekannten schweren Problems auf B.']
 ],
 [
 ['empty','Ist die Sprache {ε} gleich der leeren Sprache?','Nein. {ε} enthält ein Wort der Länge null, ∅ enthält kein Wort.'],
 ['regex','Beweisen gleiche Ergebnisse bis Wortlänge 20 die Gleichheit beliebiger RegEx?','Nein. Ein Unterschied kann erst bei einem längeren Wort auftreten; man braucht einen vollständigen Sprachvergleich oder Beweis.'],
 ['tm','Eine NTM und eine DTM können dasselbe berechnen. Folgt daraus dieselbe Laufzeit?','Nein. Die deterministische Simulation der Verzweigungen kann viel mehr Zeit benötigen; Berechenbarkeit und Effizienz sind getrennt.'],
 ['np','Macht eine einfache Lösung für vollständige Graphen das allgemeine Hamiltonkreisproblem leicht?','Nein. Vollständige Graphen bilden eine eingeschränkte Instanzfamilie; der allgemeine Fall erlaubt beliebige Graphen.'],
 ['decidable','L und sein Komplement sind semi-entscheidbar. Ist L entscheidbar?','Ja. Beide Semi-Entscheider fair abwechselnd simulieren. Genau der zur richtigen Seite akzeptiert irgendwann und liefert die Antwort.'],
 ['cyk','Eine oberste CYK-Zelle enthält A, aber nicht S. Wird das Wort angenommen?','Nein. Das Startsymbol S muss das ganze Wort ableiten können. Eine andere Variable allein genügt nicht.'],
 ['complement','Kann das Komplement einer unendlichen regulären Sprache endlich sein?','Ja. Zum Beispiel hat Σ* das leere Komplement. Abgeschlossenheit sagt nichts über die Mächtigkeit.'],
 ['reduction','Ein Problem ist NP-schwer. Ist es automatisch NP-vollständig?','Nein. Für NP-Vollständigkeit muss es zusätzlich in NP liegen, also passende polynomiale Ja-Zertifikate besitzen.']
 ]
];
const graphVariants=[
 {vertices:['a','b','c','d','e'],edges:[['a','b'],['a','c'],['b','c'],['c','d'],['d','e'],['e','a']]},
 {vertices:['u','v','w','x','y','z'],edges:[['u','v'],['u','w'],['v','w'],['w','x'],['x','y'],['y','z'],['z','w']]},
 {vertices:['p','q','r','s','t'],edges:[['p','q'],['p','r'],['p','s'],['q','r'],['q','s'],['r','s'],['s','t']]}
];
const regexVariants=[
 ['Enthält genau zwei Nullen.','1*01*01*','Die zwei ausgeschriebenen Nullen sind Pflicht. Alle übrigen Positionen enthalten nur Einsen.'],
 ['Endet auf 001.','(0|1)*001','Der Anfang ist beliebig, die letzten drei Zeichen sind fest.'],
 ['Enthält mindestens ein 10 als zusammenhängendes Teilwort.','(0|1)*10(0|1)*','Vor und nach dem Pflichtblock 10 dürfen beliebige Binärwörter stehen.']
];
const dfaVariants=[
 {title:'Die Anzahl der Nullen ist durch 3 teilbar (ε eingeschlossen).',states:['r0','r1','r2'],start:'r0',accept:['r0'],rows:[['r0','r1','r0'],['r1','r2','r1'],['r2','r0','r2']],idea:'ri bedeutet: Anzahl gelesener Nullen hat Rest i modulo 3. 0 schaltet zyklisch, 1 lässt den Rest unverändert.'},
 {title:'Es kommen höchstens zwei Einsen vor.',states:['q0','q1','q2','X'],start:'q0',accept:['q0','q1','q2'],rows:[['q0','q0','q1'],['q1','q1','q2'],['q2','q2','X'],['X','X','X']],idea:'q0, q1, q2 zählen die Einsen bis zwei. X merkt mindestens drei Einsen. Nullen ändern die Anzahl nicht.'},
 {title:'Es kommt kein Teilwort 010 vor.',states:['S','A','B','X'],start:'S',accept:['S','A','B'],rows:[['S','A','S'],['A','A','B'],['B','X','S'],['X','X','X']],idea:'S: kein relevanter Suffix, A: Suffix 0, B: Suffix 01, X: 010 bereits gesehen. Nach einem Verstoß bleibt X erhalten.'}
];
const hierarchyTasks=[
 {prompt:'Fülle für Typ 3, 2, 1 und 0 jeweils Regelbeschränkung, erkennendes Maschinenmodell und ein Sprachbeispiel aus. Nenne die Inklusionsrichtung. Nutze bei Typ 1 die übliche ε-Ausnahme.',solution:'Typ 3: rechtslineare Regeln, endlicher Automat, z. B. 0*. Typ 2: eine Variable links, NPDA, z. B. {aⁿbⁿ}. Typ 1: nicht verkürzende Regeln (ε-Ausnahme), linear beschränkte NTM, z. B. {aⁿbⁿcⁿ}. Typ 0: links mindestens eine Variable, sonst uneingeschränkt, TM/Semi-Entscheider, z. B. Haltesprache. REG ⊊ CFL ⊊ CSL ⊊ RE.',rubric:[[2,'Typ 3: 1 P für Regel und Modell; 1 P für Beispiel und Position in der Kette.'],[2,'Typ 2: 1 P für Regel und NPDA; 1 P für passendes Beispiel und Inklusion.'],[2,'Typ 1: 1 P für nicht verkürzende Regeln und LBA; 1 P für Beispiel samt ε-Konvention.'],[2,'Typ 0: 1 P für allgemeine Regeln und TM; 1 P für RE-Beispiel und korrekte Inklusionskette.']]},
 {prompt:'Ordne die Sprachen (i) Binärwörter mit gerader Anzahl Nullen, (ii) {0ⁿ1ⁿ:n≥0}, (iii) {aⁿbⁿcⁿ:n≥0}, (iv) HALT={<M,w>:M hält auf w} jeweils der kleinsten Chomsky-Klasse zu. Begründe mit Modell oder bekanntem Trennungssatz; lange Trennungsbeweise sind nicht verlangt.',solution:'(i) Typ 3, zwei Paritätszustände. (ii) Typ 2, Keller gleicht die Blöcke ab; nicht regulär (Pumping). (iii) Typ 1, linear beschränkte Maschine kann die drei Blöcke markieren; nicht kontextfrei. (iv) Typ 0/RE: Simulation semi-entscheidet Halten; unentscheidbar, daher nicht Typ 1.',rubric:[[2,'(i) Typ 3 (1 P) und Paritäts-DEA (1 P).'],[2,'(ii) Typ 2 (1 P), NPDA und Nichtregularität nachvollziehbar benannt (1 P).'],[2,'(iii) Typ 1 (1 P), LBA und Nichtkontextfreiheit benannt (1 P).'],[2,'(iv) Typ 0 (1 P), Semi-Entscheidung plus Unentscheidbarkeit als Abgrenzung (1 P).']]},
 {prompt:'Ein Kommilitone ordnet zu: REG↔NPDA, CFL↔DEA, CSL↔LBA, RE↔immer haltende TM. Korrigiere alle vier Zeilen, nenne je ein Beispiel und erkläre, welche Haltegarantie die letzte Zeile tatsächlich hat.',solution:'REG↔DEA/NEA, z. B. (01)*. CFL↔NPDA, z. B. Klammerwörter. CSL↔linear beschränkte NTM, z. B. {aⁿbⁿcⁿ}. RE↔TM als Semi-Entscheider, z. B. HALT. Bei Mitgliedern akzeptiert die Maschine nach endlich vielen Schritten; bei Nichtmitgliedern darf sie endlos laufen. Nicht jede RE-Sprache ist entscheidbar.',rubric:[[2,'REG mit endlichem Automaten korrigiert (1 P), Beispiel (1 P).'],[2,'CFL mit NPDA korrigiert (1 P), Beispiel (1 P).'],[2,'CSL-Modell präzisiert (1 P), Beispiel (1 P).'],[2,'RE als Semi-Entscheidung erklärt (1 P), Beispiel und fehlende totale Haltegarantie (1 P).']]}
];
export const examSections=['Kurzfragen','Chomsky-Hierarchie','NP & Graphen','Reguläre Sprachen','Turingmaschinen','Kontextfreie Sprachen'];
function fullExam(index){
 const tag=['A','B','C'][index],id=`full-${tag.toLowerCase()}`,qs=[];
 shortRows[index].forEach(([topic,prompt,solution],i)=>qs.push(open(`short-${i+1}`,topic,examSections[0],prompt,[[1,'1 Punkt nur, wenn Entscheidung UND tragende Begründung stimmen. Sonst 0.']],solution)));
 const h=hierarchyTasks[index];
 qs.push(auto('hierarchy-choice','hierarchy',examSections[1],2,'choice',[
  'Welche Aussage über die Chomsky-Sprachklassen stimmt?',
  'Welche Kombination aus Sprachklasse und Modell ist korrekt?',
  'Welche Aussage über Typ 0 trifft zu?'
 ][index],0,[
  'Reguläre Sprachen sind kontextfrei; die Inklusion ist echt.',
  'Nichtdeterministische Kellerautomaten charakterisieren CFL. DTM und NTM sind bei Berechenbarkeit gleich mächtig.',
  'Typ-0-Sprachen sind rekursiv aufzählbar; ein Semi-Entscheider muss nicht auf Nein-Eingaben halten.'
 ][index],[
  ['Jede reguläre Sprache ist kontextfrei.','Jede kontextfreie Sprache ist regulär.','Jede Typ-0-Sprache ist entscheidbar.'],
  ['CFL und nichtdeterministische Kellerautomaten.','REG und ausschließlich linear beschränkte Automaten.','Typ 1 und beliebige unentscheidbare Sprachen.'],
  ['Semi-entscheidbar, aber nicht zwingend entscheidbar.','Immer endlich.','Immer durch DEA erkennbar.']
 ][index]));
 qs.push(open('hierarchy-map','hierarchy',examSections[1],h.prompt,h.rubric,h.solution));
 const graph=graphVariants[index],g=graphSolutions(graph.vertices,graph.edges),graphText=`V=${setLabel(graph.vertices)}, E={${graph.edges.map(e=>e.join('–')).join(', ')}}. Ungerichteter einfacher Graph.`;
 for(const [kind,prompt,value,solutions] of [['clique','Wie groß ist eine größte Clique?',g.omega,g.cliques],['cover','Wie groß ist ein kleinstes Vertex Cover?',g.tau,g.covers]]){
  const q=auto(`np-${kind}`,'np',examSections[2],2,'number',`${graphText} ${prompt}`,value,`${value}. Optimale Mengen: ${solutions.map(setLabel).join(' oder ')}. Prüfe bei Clique alle Paarverbindungen, bei Vertex Cover alle Kanten.`);q.materials={graph};qs.push(q);
 }
 qs.push(open('np-proof','np',examSections[2],[
  'Formuliere CLIQUE als Entscheidungsproblem und zeige mit Zertifikat und Prüfer die Zugehörigkeit zu NP. Erkläre kurz, warum eine kleine Zeichnung keine Aussage über die allgemeine Laufzeitklasse beweist.',
  'Formuliere VERTEX COVER als Entscheidungsproblem und beschreibe ein polynomial prüfbares Ja-Zertifikat. Grenze die Prüfung einer Auswahl von der Suche nach der kleinsten Auswahl ab.',
  'Formuliere HAMILTONKREIS als Entscheidungsproblem. Beschreibe ein Zertifikat und dessen polynomialen Prüfer. Warum bleibt der vollständige Graph ein leichter Spezialfall?'
 ][index],[[1,'Entscheidungsfrage korrekt mit benötigtem Parameter formuliert.'],[1,'Geeignetes Zertifikat und vollständig beschriebene Bedingungen.'],[1,'Polynomiale Prüflaufzeit und Abgrenzung Prüfung/Suche bzw. Spezialfall.']],[
  'CLIQUE: Gibt es in G eine Clique mit mindestens k Knoten? Zertifikat: k verschiedene Knoten. Prüfe Zugehörigkeit und jede Paarverbindung, O(k²) Adjazenzabfragen. Eine einzelne kleine Instanz belegt keine allgemeine polynomiale Lösbarkeit.',
  'VERTEX COVER: Gibt es eine Knotenauswahl der Größe höchstens k, die jede Kante berührt? Zertifikat: diese Knoten. Markiere sie und prüfe alle Kanten, O(|V|+|E|). Die Prüfung einer vorgeschlagenen Auswahl löst noch nicht die Optimierung.',
  'HAMILTONKREIS: Gibt es einen Kreis, der jeden Knoten genau einmal besucht? Zertifikat: Knotenreihenfolge. Prüfe Vollständigkeit, Einmaligkeit, alle Nachbarschaftskanten und die Schlusskante in Polynomialzeit. In einem vollständigen Graphen mit mindestens drei Knoten funktioniert jede Reihenfolge; andere Graphen können fehlende Kanten haben.'
 ][index]));
 // Distinct automaton tasks: subset construction, minimization, epsilon subset construction.
 if(index===0){
  const nfa={states:['s','p','f'],alphabet:['0','1'],start:'s',accept:['f'],transitions:{s:{0:['s'],1:['s','p']},p:{0:['f'],1:[]},f:{0:[],1:[]}}};
  const subset=nfaStep(nfa,nfaStep(nfa,['s'],'1'),'0'),rows=determinize(nfa);
  qs.push(auto('reg-algorithm','nea',examSections[3],4,'set','NEA ohne ε: Start s, F={f}; s:0→{s},1→{s,p}; p:0→{f},1→∅; f:0→∅,1→∅. Welche Zustandsmenge ist nach 10 aktiv? Notiere die Zwischenschritte.',subset,`Nach 1: {s,p}; nach 10: ${setLabel(subset)}. Erreichbare DEA-Zustände: ${rows.map(r=>setLabel(r.states)).join(', ')}. Die automatische Wertung prüft die Endmenge; kontrolliere deine Zwischenschritte selbst.`));
 }else if(index===1){
  const dfa={states:['a','b','c','d','u'],alphabet:['0','1'],start:'a',accept:['c','d'],transitions:{a:{0:'b',1:'c'},b:{0:'a',1:'d'},c:{0:'b',1:'c'},d:{0:'a',1:'d'},u:{0:'u',1:'u'}}};const m=minimize(dfa);
  qs.push(auto('reg-algorithm','minimize',examSections[3],4,'number','Vollständiger DEA, Start a, F={c,d}. Übergänge (0,1): a→(b,c), b→(a,d), c→(b,c), d→(a,d), u→(u,u). Wie viele Zustände hat der minimale erreichbare DEA? Notiere die Klassen.',m.groups.length,`u ist unerreichbar. Klassen: ${m.groups.map(setLabel).join(', ')}. Die Klassen sind stabil und durch ε getrennt. Die Zahl wird automatisch gewertet; gleiche die Klassen zusätzlich ab.`));
  qs.at(-1).dfaFeedback={machine:dfa,title:'Der DEA aus dieser Aufgabe'};
 }else{
  const nfa={states:['s','a','b','f'],alphabet:['0','1'],start:'s',accept:['f'],transitions:{s:{'':['a']},a:{0:['a'],1:['b']},b:{'':['f'],0:['b']},f:{}}};
  const result=nfaStep(nfa,nfaStep(nfa,['s'],'1'),'0');
  qs.push(auto('reg-algorithm','nea',examSections[3],4,'set','ε-NEA: Start s, F={f}; s:ε→{a}; a:0→{a},1→{b}; b:ε→{f},0→{b}; f: keine Übergänge. Nicht genannte Übergänge sind leer. Welche Zustandsmenge ist nach 10 einschließlich ε-Hüllen aktiv?',result,`Start-Hülle {s,a}. Nach 1: {b,f}. Nach 10 wieder ${setLabel(result)}, da b bei 0 in b bleibt und von dort f per ε erreichbar ist.`));
 }
 const [regexPrompt,regex,why]=regexVariants[index];
 qs.push(auto('reg-regex','construct',examSections[3],3,'regex',`Gib einen regulären Ausdruck über {0,1} an: ${regexPrompt}`,regex,`${regex}. ${why} Gleichwertige Ausdrücke werden vollständig auf Sprachgleichheit geprüft.`));
 const d=dfaVariants[index];
 qs.push(open('reg-dfa','dfa',examSections[3],`Konstruiere einen vollständigen DEA über {0,1}: ${d.title} Gib Zustandsbedeutungen, Start, Endzustände und alle Übergänge an; prüfe mindestens drei passende Randfälle. Du darfst eine Tabelle in das Textfeld schreiben.`,[[2,'Sinnvolle Zustandsbedeutungen (1 P) und Start samt Endzuständen (1 P).'],[3,'Vollständige, korrekte Übergänge: 3 P vollständig; 2 P ein lokaler Fehler; 1 P tragfähige Grundidee; 0 P sonst.'],[1,'Drei begründete Randfälle, darunter ε und ein knapp ungültiges Wort, sofern eines existiert.']],`${d.idea} Start ${d.start}, F=${setLabel(d.accept)}. Übergänge (0,1): ${d.rows.map(([s,a,b])=>`${s}→(${a},${b})`).join('; ')}. Andere Zustandsnamen und äquivalente Konstruktionen sind richtig.`));
 qs.at(-1).dfaFeedback={machine:{...d,name:d.title,alphabet:['0','1'],transitions:Object.fromEntries(d.rows.map(([s,a,b])=>[s,{0:a,1:b}]))},title:'Eine korrekte DEA-Konstruktion',note:d.idea};
 qs.push(auto('reg-reason','transfer',examSections[3],2,'choice',[
  'Welche Aussage beweist die Nichtgleichheit zweier regulärer Sprachen?',
  'Wie erkennst du die Sprache eines vollständigen komplementierten DEA?',
  'Welcher Beweisansatz zeigt den Abschluss regulärer Sprachen unter Schnitt?'
 ][index],0,[
  'Ein Gegenbeispiel liegt in genau einer der beiden Sprachen und widerlegt Gleichheit.',
  'Der identische Lauf endet genau dann im neuen F, wenn er vorher außerhalb F endete.',
  'Das Produkt verfolgt beide Zustände. Ein Paar akzeptiert genau dann, wenn beide Komponenten akzeptieren.'
 ][index],[['Ein Wort liegt in genau einer Sprache.','Ein Wort liegt in beiden.','Die RegEx sehen unterschiedlich aus.'],['Gleiche Läufe; Endzustände sind Q∖F.','Pfeile werden rückwärts gelesen.','Alle Wörter werden umgedreht.'],['Produktautomat mit beiden Endzustandsbedingungen.','Alle Übergänge löschen.','Beide Zustandsmengen ungeordnet vereinigen.']][index]));
 const input=['10011','1101','11101'][index],tm=incrementTrace(input);
 qs.push(auto('tm-output','tm',examSections[4],2,'text',`${incrementRules} Eingabe ${input}. Welches Binärwort steht beim Halt auf dem Band (ohne □)?`,tm.output,`${input}+1=${tm.output}. Der Übertrag beginnt rechts und läuft nach links.`));
 const configs=tm.rows.map((r,i)=>{const pos=r.head-r.offset;return `${i}: ${r.cells.slice(0,pos)} [${r.state}] ${r.cells.slice(pos)}`;}).join('\n');
 qs.push(open('tm-trace','tm',examSections[4],`Für dieselbe Maschine (${incrementRules}) und Eingabe ${input}: Schreibe alle Konfigurationen bis zum Halt auf. Das Zustandszeichen steht direkt vor der gelesenen Zelle. Begründe den linken Blank-Fall.`,[[2,'Rechtslauf samt Schritt auf das End-Blank korrekt (2 P; ein lokaler Fehler: 1 P).'],[2,'Übertrag: Zustand, Schreiboperation und Kopfposition in allen restlichen Schritten korrekt (2 P; ein lokaler Fehler: 1 P).'],[1,'Linkes Blank bei Überlauf wird zur zusätzlichen führenden 1; Halt korrekt erklärt.']],`${configs}\n[R] scannt rechts, [C] verarbeitet den Übertrag, [H] hält. Bei ausschließlich Einsen wird links außerhalb der ursprünglichen Eingabe eine führende 1 geschrieben.`));
 qs.push(open('tm-principle','tm',examSections[4],[
  'Erkläre, wie eine DTM die akzeptierenden Berechnungen einer NTM systematisch finden kann und warum ein endloser Zweig dabei nicht alles blockieren darf.',
  'Unterscheide Erkennen/Semi-Entscheiden, Entscheiden und Berechnen einer Funktion durch eine TM. Welche Halteforderungen gelten?',
  'Erkläre den Unterschied zwischen gleicher Berechenbarkeit und gleicher Effizienz von DTM und NTM. Verbinde dies mit der Bedeutung von P und NP.'
 ][index],[[1,'Die erste zentrale Unterscheidung bzw. das Simulationsprinzip korrekt.'],[1,'Halten, Verzweigung bzw. Ressourcenbedarf korrekt erläutert.'],[1,'Ein konkretes Beispiel oder eine nachvollziehbare Konsequenz ergänzt.']],[
  'Die DTM kann den Berechnungsbaum in zunehmender Tiefe durchsuchen (oder Zweige fair verzahnen). Kein einzelner endloser Zweig darf alle anderen verhindern. Ein existierender endlicher akzeptierender Lauf wird schließlich erreicht. Die Simulation garantiert keine polynomiale Zeit.',
  'Ein Erkenner akzeptiert Mitglieder irgendwann, darf auf Nichtmitgliedern laufen. Ein Entscheider hält immer mit korrekter Ja/Nein-Antwort. Eine TM für eine partielle Funktion hält auf ihrem Definitionsbereich mit dem Funktionswert; außerhalb darf sie undefiniert bleiben. Die universelle Simulation liefert etwa einen Halteproblem-Erkenner, keinen totalen Entscheider.',
  'DTM und NTM haben dieselbe Berechenbarkeit. Das systematische Erkunden nichtdeterministischer Verzweigungen kann aber erheblich mehr Zeit kosten. P ist deterministische, NP nichtdeterministische Polynomialzeit (äquivalent polynomiale Ja-Zertifikatsprüfung). Gleiche Berechenbarkeit liefert keinen Beweis für P=NP.'
 ][index]));
 const rules=cnfExamples[index],word=['aaabbb','babaab','abaaba'][index],parsed=cyk(rules,word),grammar=ruleText(rules);
 qs.push(auto('cf-top','cyk',examSections[5],2,'set',`CNF mit Start S: ${grammar}. Wort ${word}: Gib alle Variablen in der obersten CYK-Zelle an.`,parsed.top,`Oberste Zelle ${setLabel(parsed.top)}. ${parsed.accepted?'S liegt darin: Das Wort gehört zur Sprache.':'S fehlt: Das Wort liegt nicht in der Sprache.'}`));
 const rows=parsed.table.map((row,i)=>`Länge ${i+1}: ${row.slice(0,word.length-i).map(setLabel).join(' / ')}`).join('\n');
 qs.push(open('cf-table','cyk',examSections[5],`CNF mit Start S: ${grammar}. Wort ${word}. Erstelle die vollständige CYK-Tabelle und begründe für die oberste Zelle eine verwendete Regel und Trennstelle. Erläutere das Annahmekriterium.`,[[1,'Zeile für einzelne Terminale vollständig korrekt.'],[2,'Alle restlichen Zwischenzellen: 2 P vollständig korrekt, 1 P bei höchstens zwei falschen Zellen, sonst 0 P.'],[1,'Oberste Zelle mit mindestens einer passenden Regel und Trennstelle nachvollziehbar hergeleitet.'],[1,'Annahme genau über S in der obersten Zelle korrekt begründet.']],`${rows}\n${index===0?'Oben verwendet man S→AC, Trennung a | aabbb; C→SB nutzt das innere aabb und das letzte b.':index===1?'Oben ist S→SS mit Trennung ba | baab möglich; beide Teilwörter sind durch S ableitbar.':'Oben verwendet man S→AT, Trennung a | baaba; T→SA nutzt das innere baab und das letzte a.'}\nS steht in der obersten Zelle, also wird das Wort angenommen.`));
 const expression=['a+a*a','a*a+a','a+a+a'][index];
 qs.push(open('cf-ambiguity','cnf',examSections[5],`Grammatik E→E+E | E*E | a. Zeige anhand von ${expression} zwei unterschiedliche Syntaxstrukturen (vollständige Klammerung genügt). Erkläre, warum das Mehrdeutigkeit belegt.`,[[1,'Erste durch die Grammatik erzeugbare vollständige Klammerung.'],[1,'Zweite verschiedene, ebenfalls erzeugbare Struktur für dasselbe Wort.'],[1,'Mehrdeutigkeit über zwei Syntaxbäume desselben Terminalwortes erklärt.']],[
  '(a+a)*a und a+(a*a). Beide ergeben ohne Klammern dasselbe Wort a+a*a, besitzen aber unterschiedliche Wurzeloperatoren.',
  '(a*a)+a und a*(a+a). Beide ergeben ohne Klammern a*a+a, aber die Operatorstruktur unterscheidet sich.',
  '(a+a)+a und a+(a+a). Auch bei gleichen Operatoren ergeben Links- und Rechtsgruppierung verschiedene Bäume.'
 ][index]));
 return {id,title:`Probeklausur ${tag}`,subtitle:['Vom Fundament zur Anwendung','Darstellungen wechseln & begründen','Transfer & typische Denkfehler'][index],kind:'full',suggestedMinutes:75,questions:qs,points:60,description:'Alle Kapitel · eigene Aufgaben, an der 60-Punkte-Verteilung der Altklausur orientiert. Die 75 Minuten sind ein frei wählbarer Trainingswert, keine bestätigte Prüfungsdauer.'};
}
function miniExam(i){
 const rows=[
  [auto('count','alphabet','Grundlagen',2,'number','Σ={a,b,c,d}. Wie viele Wörter haben genau Länge 3?',64,'Vier Möglichkeiten je Stelle: 4³=64.'),auto('set','concat','Sprachen',2,'set','A={ε,1}, B={0,10}. Berechne A·B.',['0','10','110'],'ε·0=0; ε·10=10; 1·0=10; 1·10=110. Doppelte Wörter nur einmal.'),auto('epsilon','empty','Grundlagen',1,'choice','Welche Sprache ist ∅*?',0,'Null Wiederholungen erzeugen ε.',['{ε}','∅','{0}']),auto('regex','construct','RegEx',2,'regex','RegEx über {0,1}: Beginnt mit 11.','11(0|1)*','Zwei Pflicht-Einsen, danach beliebige Binärwörter.'),auto('run','dfa','Automaten',3,'text','Start A, F={B}; A:0→B,1→A; B:0→B,1→A. In welchem Zustand endet 1100?', 'B','A→A→A→B→B. Nach der ganzen Eingabe akzeptiert B.'),open('explain','sets','Begründen','Warum ist das Komplement von {1} über {0,1}* nicht bloß {0}? Nenne zwei fehlende Wörter.',[[1,'Grundmenge aller endlichen Binärwörter erklärt.'],[1,'Zwei passende andere Wörter, z. B. ε und 00.']],'Das Komplement enthält alle Binärwörter außer 1. Auch ε, 00, 01, 10 und viele weitere liegen darin.')],
  [auto('count','complexity','Grundlagen',2,'number','T(n)=n³. n wächst um Faktor 6. Um welchen Faktor wächst T?',216,'6³=216.'),auto('set','quotient','Sprachen',2,'set','A={100,10,0}, B={0}. Berechne den Rechtsquotienten A/B.',['10','1',''],'Ein abschließendes 0 entfernen: 100→10, 10→1, 0→ε.'),auto('epsilon','closure','Grundlagen',1,'choice','Für L={ε} gilt …',0,'Jedes positive Produkt besteht weiterhin aus ε.',['L⁺=L*={ε}','L⁺=∅','L*={0}']),auto('regex','construct','RegEx',2,'regex','RegEx über {0,1}: Genau eine Null.','1*01*','Die Null ist Pflicht, links und rechts stehen nur Einsen.'),auto('run','parity','Automaten',3,'text','Restautomat für Anzahl Einsen modulo 3: Start r0; 0 bleibt; 1 schaltet r0→r1→r2→r0. Endzustand nach 110101?', 'r1','Das Wort enthält vier Einsen. 4 modulo 3 ist 1.'),open('explain','dfa','Begründen','Warum entscheidet ein früherer Besuch eines Endzustands allein noch nicht die Annahme? Gib ein mögliches Gegenbeispiel.',[[1,'Annahme erst nach der gesamten Eingabe erklärt.'],[1,'Konkreter Lauf, der F besucht und außerhalb endet.']],'Beispiel: Start A, F={B}, bei 1 nach B, bei 0 nach A. Das Wort 10 besucht B, endet aber in A und wird abgelehnt.')],
  [auto('count','alphabet','Grundlagen',2,'number','Wie viele verschiedene Binärwörter haben Länge höchstens 3?',15,'1+2+4+8=15; ε zählt mit.'),auto('set','sets','Sprachen',2,'set','A={ε,01,10,11}, B={ε,10,00}. Berechne A∖B.',['01','11'],'ε und 10 sind auch in B und werden entfernt.'),auto('epsilon','empty','Grundlagen',1,'choice','Welche Gleichung gilt für jede Sprache L?',0,'ε verändert ein verkettetes Wort nicht.',['L·{ε}=L','L·∅=L','L∪∅=∅']),auto('regex','construct','RegEx',2,'regex','RegEx über {0,1}: Genau die drei Wörter ε, 01 und 101.','ε|01|101','Eine endliche Vereinigung der gewünschten Wörter erzeugt genau diese Sprache.'),auto('run','alternate','Automaten',3,'choice','Welche Eingabe verletzt „keine gleichen Nachbarn“?',0,'101101 enthält 11 in der Mitte.',['101101','010101','ε']),open('explain','transfer','Begründen','Jemand testet seine RegEx nur mit gültigen Wörtern. Welche Fehlerart übersieht er? Beschreibe ein Beispiel.',[[1,'Falsche positive Ergebnisse erkannt: unzulässige Wörter werden ebenfalls erzeugt.'],[1,'Konkretes Beispiel mit Ziel, falscher RegEx und Gegenwort.']],'Ziel: genau eine Eins. Falsche RegEx (0|1)* akzeptiert alle gültigen Beispiele, aber auch 11 oder ε. Deshalb müssen beide Inklusionsrichtungen geprüft werden.')]
 ][i];
 const runModels=[{machine:ends0Dfa,word:'1100'},{machine:modulo3Dfa,word:'110101',note:'Gefragt ist nur der erreichte Zustand. Zur Illustration ist r0 als akzeptierend markiert; diese Wahl ändert den Lauf nicht.'},{machine:machines.alternate,word:'101101'}];
 rows.find(q=>q.id==='run').dfaFeedback={...runModels[i],title:'Der DEA aus dieser Aufgabe'};
 return {id:`mini-${i+1}`,title:`Grundlagencheck ${i+1}`,subtitle:['Wörter, Mengen & erste Automaten','Operationen & Zustandswissen','Gemischter Transfer'][i],kind:'mini',suggestedMinutes:20,questions:rows,points:12,description:'Nur Grundlagen aus Woche 1 · sechs Aufgaben mit eigener Begründung. 20 Minuten als optionaler Trainingswert.'};
}
export const exams=[week2Exam,...Array.from({length:3},(_,i)=>miniExam(i)),...Array.from({length:3},(_,i)=>fullExam(i))];
export const examById=Object.fromEntries(exams.map(e=>[e.id,e]));
