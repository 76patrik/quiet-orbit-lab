# Lern- und Umsetzungsplanung

## Fächer und Prüfungstermine

Orbit ist ein Lernstudio für mehrere Fächer. Das Orbit-Prinzip (verstehen → nachvollziehen → anwenden → korrigieren → abrufen) gilt für jedes Fach. Theoretische Informatik ist das erste Fach mit fertigen Inhalten.

| Fach | Prüfung | Stand |
|---|---|---|
| Theoretische Informatik | 20.11.2026 | Woche 1 interaktiv, Wochen 2–9 geplant |
| Finanzierung und Rechnungswesen | 27.11.2026 | Angelegt, Lernmaterialien folgen |
| Mikro- und Makroökonomik | 02.12.2026 | Angelegt, Lernmaterialien folgen |

Für Fächer ohne Lernmaterialien erfindet die App keine Lektionen, Aufgaben oder Wochenpläne. Sie zeigt nur den Prüfungstermin und den Countdown. Inhalte kommen erst dazu, wenn die Unterlagen vorliegen. Die Prüfungstermine lassen sich in den Einstellungen ändern. Welche Unterlagen helfen und wie ein Fach aufgebaut ist, steht in `docs/INHALTE.md`.

### Vorschlag: drei Prüfungen in zwölf Tagen

Zwischen der ersten und der letzten Prüfung liegen nur zwölf Tage. Finanzierung/Rechnungswesen und Mikro-/Makroökonomik sollten deshalb nicht erst nach dem 20.11. beginnen. Ein Vorschlag, den die Unterlagen noch bestätigen müssen:

| Zeitraum | Schwerpunkt | Nebenbei |
|---|---|---|
| bis 08.11. | TI nach Neun-Wochen-Plan | FiRe und VWL je zwei kurze Einheiten pro Woche, sobald Material da ist |
| 09.–20.11. | TI-Endspurt und Simulationen | täglich Karteikarten FiRe/VWL |
| 21.–27.11. | Finanzierung und Rechnungswesen | VWL-Karteikarten |
| 28.11.–02.12. | Mikro- und Makroökonomik | kurze FiRe-Wiederholung nur bei Bedarf |

## Spielmodi und Fairness

Spielerische Elemente sollen Abrufen üben, nicht Punkte verteilen:

- **Tagesmissionen:** drei pro Tag, aus sechs Missionen per Datum ausgewählt und auf allen Geräten gleich. Jede Mission gibt einmal 15 XP.
- **Karteikarten:** aus den eigenen Lektionstexten, mit Selbsteinschätzung. Deshalb kein Kompetenznachweis und keine Aufgaben-XP.
- **Blitzrunde:** 60 Sekunden, nur Auswahl- und Zahlenaufgaben. Verändert keine Wiederholungstermine, zählt nur für Rekord und Mission.
- **Bosskampf:** bis zu zehn Aufgaben einer Einheit, drei Leben, keine Hinweise. Antworten zählen normal und planen Wiederholungen. Nur der erste Sieg gibt 75 XP.
- **Feedback:** Antwortketten, XP pro Antwort, Konfetti nur bei Pokal oder Level-Aufstieg, nie bei reduzierter Bewegung.


## Theoretische Informatik: Ziel und Umfang der ersten Version

Die App ergänzt das 42-seitige Woche-1-Skript und den Masterplan mit aktiver Anwendung. Woche 1 ist vollständig erschlossen; die übrigen acht Wochen sind als transparente Roadmap vorhanden. Keine gesperrten oder scheinbar bereits fertigen Folgelektionen.

## Lernschleife

1. **Verstehen:** kurze Erklärung vom Grundbegriff aus, mit Fachnotation und Bedeutung in Alltagssprache.
2. **Nachvollziehen:** ein gelöstes Beispiel und eine typische Stolperstelle.
3. **Selbst erklären:** lokale Notiz zu einer offenen Begründungsfrage.
4. **Anwenden:** Auswahl, Menge, Zahl oder RegEx eingeben; Zustände und Übergänge konstruieren.
5. **Korrigieren:** inhaltliche Erklärung, Gegenbeispiele und eigene Fehlerursache.
6. **Abrufen:** Wiederholungen nach 1, 3, 7 und 14 Tagen, mit Datum in Europe/Berlin.

## Woche 1: Zuordnung zum Skript

| Abschnitt | Lektionen | Nachweis / Werkzeug |
|---|---|---|
| S. 3–9 | Motivation, Komplexität, Notation, Alphabet, Leere | Anwendungsfragen, Mengeneingabe, Wachstumsregler |
| S. 10–14 und 31 | Sprache, Mengenoperationen, Konkatenation, Abschluss, Rechtsquotient | Eigene Berechnungen, Operationenlabor mit Herleitung |
| S. 17–20, 28 | RegEx lesen und bauen | Vollständiger Sprachvergleich, Gegenbeispiele |
| S. 21–27, 32 | DEA, Parität, Alternation, Komplement | Schrittweise Simulation, vier Konstruktionsaufgaben |
| S. 15–16, 28–33 | Grammatik, Hierarchie, Transfer | Begründen, Fehlannahmen erkennen, private Notizen |
| S. 34–40 | Vertiefung und Wochencheck | 62 Aufgaben, separater Check, zwei Pflicht-DEAs |

Die Vorschau endlicher Wörter in einem Labor ersetzt keinen mathematischen Beweis. Der RegEx-Prüfer konstruiert Thompson-NEAs, verfolgt ε-Abschlüsse und untersucht das erreichbare Produkt der Zustandsmengen. Der DEA-Prüfer untersucht das Produkt der Zustände. Beide Verfahren sind für die jeweils unterstützten Eingaben vollständig; der RegEx-Vergleich besitzt eine explizite Ressourcenbegrenzung und meldet dann eine Grenze statt eines falschen Urteils.

## Fortschritt ohne Scheinsicherheit

- Abschluss: mindestens 80 % der Lektionsfragen ohne eingeblendete Hilfe.
- Kompetenz „sicher“: zwei unterschiedliche Aufgaben an unterschiedlichen Tagen, keine offenen Fehler im Thema.
- XP werden pro erstmaligem Ergebnis vergeben; fällige Wiederholungen höchstens einmal täglich pro Aufgabe.
- Freie Laborversuche haben keine beliebig vervielfachbaren Punkte.
- Wochenpokal: 8/10 im Check plus beide Pflicht-DEAs ohne Zustands-Hinweis.
- Keine fiktiven Nutzer, Ranglisten, vorgefüllten Erfolge oder erfundenen Statistiken.
- Offene Begründungen werden nicht durch Stichwortsuche als „richtig“ bewertet.

## Weitere Wochen

| Woche | Geplante Interaktionen | Fachlicher Fokus |
|---|---|---|
| 2 | NEA-Zustandsmengen wählen; Potenzmengen-Tabelle ausfüllen; Partitionen verfeinern | NEA → DEA, Minimierung, reguläre Grammatik, Kleene |
| 3 | Ableitungsschritte wählen; Syntaxbäume aufbauen; CNF-Regeln bearbeiten | Grenzen, Pumping, Mehrdeutigkeit, CNF |
| 4 | CYK-Dreieck ausfüllen und Zerlegungen begründen; Stack simulieren | CYK, Parserbezug, Kellerautomaten |
| 5 | Band und Kopf schrittweise bewegen; Konfigurationen eingeben | TM-Entwurf, DTM/NTM, P/NP-Einstieg |
| 6 | Graphen modellieren; Zertifikate prüfen; Reduktionsrichtung wählen | Clique, Vertex Cover, Färbung, TSP, Knapsack |
| 7 | Entscheidbarkeitsaussagen begründen; Hierarchie zuordnen | Halteproblem, Rice, Simulation 1 am 07.11. |
| 8 | Aufgabenmix anhand individueller Fehlermuster | Simulation 2 am 14.11., Ziel 75 % |
| 9 | Neue Varianten und fokussierte Lückenbearbeitung | Simulation 3 am 17.11., zwei Nachweise mit 80 % |

## Technische Entscheidungen

Statische ES-Module ohne Abhängigkeiten oder Backend: auf GitHub Pages günstig betreibbar, offline nutzbar und leicht erweiterbar. Hash-Routen vermeiden 404 beim direkten Öffnen auf Unterpfaden. Alle Assets sind relativ adressiert. Persönliche Antworten liegen nur in localStorage, Sicherungen werden strikt validiert und erst nach einer sichtbaren Vorschau übernommen. Importierte Texte werden für HTML maskiert. Keine Originaldateien, Kontaktdaten oder personenbezogene Profilinhalte werden veröffentlicht.

Cloud-Synchronisation ist eine mögliche spätere Erweiterung mit Anmeldung und privaten Datensätzen; sie ist in dieser Version nicht implementiert. Die App behauptet keine geräteübergreifende Synchronisation.

## Abnahmekriterien

- Vollständige Beispiele und Erklärungen für alle W1-Bausteine.
- Jede Lektion hat mindestens drei bewertbare Aufgaben.
- Fachliche Randfälle werden gegen unabhängige Definitionen geprüft.
- Ungültige RegEx, unvollständige DEAs und fehlerhafte Importe werden verständlich abgefangen.
- Fortschritt beginnt bei null und übersteht Neuladen.
- Hinweisgestützte Antworten verleihen keinen unabhängigen Kompetenznachweis.
- Der Wochencheck verrät vor Abschluss keine Lösungen.
- Touch-Bedienung, klar beschriftete Eingaben und Tastaturfokus; reduzierte Bewegung wird respektiert.
- Pages-Build enthält nur öffentliche App-Dateien.

## Inhaltliche Grenzen

Eine App allein ersetzt keine handschriftlichen Rechenwege und keine neuen Klausurvarianten. Der Wochencheck verwendet feste Fragen und dient daher nach dem ersten Durchlauf besonders der Wiederholung. Die endgültige Klausurdauer, erlaubte Hilfsmittel und der tatsächliche Umfang sind in den bereitgestellten Unterlagen nicht bestätigt.
