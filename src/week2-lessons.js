import {week2ChapterById} from './week2-content.js';

// Reuse the checked script explanations, while giving each procedure its own lesson.
const paragraph=(chapter,page,index)=>week2ChapterById[chapter].pages[page].blocks.filter(b=>b.type==='p')[index].text;
const section=(title,chapter,page,...indices)=>[title,indices.map(i=>paragraph(chapter,page,i)).join(' ')];
const lesson=(id,title,minutes,chapters,intro,sections,example,trap,reflection,labExample)=>({
 id,title,week:2,minutes,chapters,intro,sections,example,trap,reflection,labExample,
 source:`Skript W2 · Kapitel ${chapters.map(id=>week2ChapterById[id].title.split(' · ')[0]).join(', ')}`,
 labHref:labExample?'#week2-lab':undefined
});

export const week2Lessons=[
 lesson('nea','NEA: alle möglichen Läufe verfolgen',15,['grundlagen','nea'],
  'Ein NEA verfolgt mehrere Möglichkeiten zugleich. Du lernst zuerst, was ein Zustand speichert und wann ein vollständiges Wort akzeptiert wird.',
  [section('Ein Zustand ist eine Erinnerung','grundlagen',0,0,1),
   section('Kein, ein oder mehrere Nachfolger','nea',0,0,1),
   section('Ein erfolgreicher Lauf genügt','nea',0,2),
   section('Nach dem letzten Zeichen entscheiden','nea',1,1)],
  ['001 und 0010 vergleichen','NEA für die Endung 01: p:0→{p,q},1→{p}; q:1→{r}; r ohne Übergänge; Start p, F={r}. Für 001 entstehen {p} → {p,q} → {p,q} → {p,r}: angenommen. Die zusätzliche 0 ergibt {p,q}: 0010 wird abgelehnt.'],
  'Ein Endzustand unterwegs genügt nicht. Ein akzeptierender Lauf muss sämtliche Zeichen des Wortes lesen; ein steckengebliebener Zweig fällt weg.',
  'Warum kann derselbe NEA für dasselbe Wort einen akzeptierenden und einen ablehnenden Lauf besitzen und trotzdem eindeutig über die Zugehörigkeit entscheiden?', 'suffix'),
 lesson('epsilon','ε-Hüllen Schritt für Schritt berechnen',15,['epsilon'],
  'ε-Übergänge verbrauchen kein Zeichen. Ergänze alle damit erreichbaren Zustände, bevor du startest und nachdem du ein Zeichen gelesen hast.',
  [section('Null oder mehr ε-Schritte','epsilon',0,0),
   section('Auch ε-Kreise vollständig erfassen','epsilon',0,1),
   section('Die Originalaufgabe richtig lesen','epsilon',1,0,1)],
  ['Startmenge und das Wort 42','Aufgabe 6: q0 ist Start, q2 akzeptiert; q0:ε→q2,4→q1; q1:2→q2; q2:0→{q0,q2}. E({q0})={q0,q2}. Bei 4 folgt {q1}, bei 2 folgt {q2}. Damit akzeptieren ε und 42. Ein weiterer 4-Schritt führt nach ∅.'],
  'Alle Ausgangszustände gehören zu ihrer ε-Hülle. Zeichenpfeile gehören nicht zur Hüllenberechnung; ein bereits besuchter Zustand muss in einem ε-Kreis nicht erneut bearbeitet werden.',
  'Wie würdest du bei einem ε-Kreis verhindern, dass deine Rechnung endlos weiterläuft? Erkläre auch den Unterschied zwischen E(∅) und E({q0}).', 'original6'),
 lesson('determinize','Aus dem NEA einen DEA konstruieren',20,['grundlagen','potenzmenge'],
  'Eine ganze Menge möglicher NEA-Zustände wird zu einem einzigen DEA-Zustand. Daraus entsteht systematisch eine vollständige Übergangstabelle.',
  [section('Die Potenzmenge zählt Möglichkeiten','grundlagen',1,0,1),
   section('Eine Menge als ein Zustand','potenzmenge',0,0,1),
   ['Vom Start aus alle Zeilen bearbeiten','Starte bei der ε-Hülle des Starts. Vereinige für jedes Zeichen die Nachfolger aller Zustände der aktuellen Menge und bilde danach wieder die ε-Hülle. Jede neue Menge erhält eine Zeile. Wiederhole, bis jede erreichbare Menge für jedes Zeichen bearbeitet ist. Markiere genau die Mengen mit mindestens einem NEA-Endzustand.'],
   section('Leere Mengen und fehlende Übergänge','potenzmenge',2,0,1)],
  ['Höchstens acht, tatsächlich drei','Für den NEA mit Start p, F={r}, p:0→{p,q},1→{p}, q:1→{r}, Rest leer sind nur A={p}, B={p,q}, C={p,r} erreichbar. A:(B,A), B:(B,C), C:(B,A) für (0,1). Nur C akzeptiert. Die übrigen fünf Teilmengen werden nicht erreicht.'],
  '2ⁿ ist eine Obergrenze. Die leere Menge muss aufgenommen werden, wenn sie erreicht wird; dann führt sie bei jedem Zeichen zu sich selbst.',
  'Begründe, warum genau die Mengen mit einem NEA-Endzustand akzeptieren. Warum darfst du eine erreichbare leere Menge nicht einfach weglassen?', 'original6'),
 lesson('minimize','Gleichwertige DEA-Zustände zusammenfassen',20,['minimierung'],
  'Zustände sind gleichwertig, wenn kein mögliches Restwort sie unterscheidet. Mit immer feineren Gruppen findest du einen minimalen DEA.',
  [section('Gleiches Verhalten für jede Fortsetzung','minimierung',0,0,1),
   section('Zuerst Erreichbarkeit prüfen','minimierung',0,2),
   ['Die Partition schrittweise verfeinern','Trenne Endzustände und Nichtendzustände. Notiere für jeden Zustand seine Zielgruppen bei allen Alphabetzeichen. Zustände desselben Blocks mit unterschiedlichen Zielsignaturen müssen getrennt werden. Wiederhole mit der neuen Partition, bis kein Block mehr zerfällt.'],
   section('Warum Stabilität entscheidet','minimierung',1,1)],
  ['Originalaufgabe 7','Die acht erreichbaren Zustände zerfallen in {q1}, {q2,q5}, {q3,q4}, {q6,q7} und {q8}. Nur {q8} akzeptiert. Das Restwort a trennt {q6,q7} sofort von {q1}: q6 erreicht q8, q1 nur q2. ε trennt jede nicht akzeptierende Klasse von {q8}.'],
  'Gleicher Akzeptanzstatus allein genügt nicht. Ein unerreichbarer Zustand darf weg; ein erreichbarer Fangzustand bleibt für einen vollständigen DEA erforderlich.',
  'Warum reicht eine einzige Verfeinerungsrunde im Allgemeinen nicht? Erkläre, wie ein unterscheidendes Restwort eine behauptete Äquivalenz widerlegt.', 'minimize'),
 lesson('regular-grammar','Grammatik, RegEx und Automat verbinden',20,['grammatik'],
  'Ein Automat liest Wörter, eine Grammatik erzeugt sie. Du übersetzt Zustände und Übergänge in rechtslineare Regeln und prüfst beide Sprachbedingungen.',
  [section('Variablen und Terminale unterscheiden','grammatik',0,0,1),
   ['Übergänge werden Produktionsregeln','Für jeden Automatenzustand gibt es eine Variable. Aus q —a→ r wird Vq→aVr. Die Startvariable gehört zum Startzustand; jeder Endzustand erhält eine ε-Regel. In umgekehrter Richtung ergibt A→aB einen a-Pfeil von A nach B; A→a führt zu einem neuen akzeptierenden Abschlusszustand.'],
   section('Eine Sprache mit zwei Bedingungen','grammatik',2,0,1),
   section('Die Grammatik in beiden Richtungen prüfen','grammatik',2,2,3)],
  ['Ein gültiges Wort bis zum Ende ableiten','Für „beginnt mit a und enthält b“: S→aA; A→aA|bB; B→aB|bB|ε. Das Wort aba entsteht durch S⇒aA⇒abB⇒abaB⇒aba. Der RegEx aa*b(a∪b)* erzwingt dieselben Bedingungen.'],
  'In der bereitgestellten Lösung zu 8d führt B→aA zurück in die Phase „b fehlt noch“. Dadurch fehlt das gültige Wort aba. Hier ist B→aB korrekt.',
  'Welche Bedeutung hat jede deiner Variablen? Warum darf erst nach dem verpflichtenden b eine ε-Regel die Ableitung beenden?'),
 lesson('kleene','Kleene und Komplement begründen',20,['kleene'],
  'Verbinde die Verfahren: RegEx, NEA und DEA beschreiben dieselben regulären Sprachen. Für eine Äquivalenz brauchst du beide allgemeinen Richtungen.',
  [section('Zwei Richtungen, eine Sprachklasse','kleene',0,0,1),
   section('RegEx aus Grundbausteinen zusammensetzen','kleene',0,2),
   section('Bei Verkettung beide Teile lesen','kleene',1,0,1),
   section('Wege zusammenfassen und komplementieren','kleene',2,0,2,3)],
  ['Warum Endzustände im NEA nicht einfach umdrehen?','NEA über {0}: Start s, F={f}, δ(s,0)={s,f}, Rest leer. Vorher akzeptiert 0 über s→f, nach dem Wechsel auf F={s} über s→s. Das Wort wird weiterhin angenommen. Erst determinisieren und vervollständigen, danach die Endzustände des DEA invertieren.'],
  'Ein Beispiel ersetzt keine allgemeine Konstruktion. Ein NEA ist möglicherweise kompakter als sein DEA, erkennt dadurch aber keine größere Sprachklasse.',
  'Erkläre die beiden Richtungen des Satzes von Kleene ohne Vorlage und nenne für jede Richtung ein Übersetzungsverfahren.')
];

export const week2Units=[
 {id:'w2-laeufe',week:2,boss:'Der Pfadfinder',title:'Möglichkeiten verfolgen',subtitle:'NEA-Läufe und ε-Hüllen',icon:'nodes',lessons:['nea','epsilon']},
 {id:'w2-zustaende',week:2,boss:'Der Zustandsformer',title:'Automaten umformen',subtitle:'Determinisieren und minimieren',icon:'layers',lessons:['determinize','minimize']},
 {id:'w2-sprachen',week:2,boss:'Der Sprachverbinder',title:'Darstellungen verbinden',subtitle:'Reguläre Grammatiken und Kleene',icon:'code',lessons:['regular-grammar','kleene']}
];

// Keep question IDs and the original four-topic badge: only the lesson grouping changes.
export const week2TopicGroup=id=>['epsilon','determinize'].includes(id)?'nea':id;
export function assignWeek2Lesson(q){
 if(q.lesson!=='nea')return q;
 const epsilon=q.id.startsWith('wk2-closure-')||q.id.startsWith('wk2-original6-word-')||['extra-nea-5','extra-nea-6'].includes(q.id);
 const run=q.id.startsWith('wk2-suffix-word-')||['extra-nea-1','extra-nea-8'].includes(q.id);
 return {...q,lesson:epsilon?'epsilon':run?'nea':'determinize'};
}
