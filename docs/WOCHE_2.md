# Woche 2 · Automaten und reguläre Sprachen

Der Masterplan sieht für 28.09.–04.10.2026 acht Stunden vor: NEA und ε-Hülle, Potenzmengenkonstruktion, DEA-Minimierung, reguläre Grammatiken sowie den Satz von Kleene. Die Erweiterung verbindet Erklärungen, vollständige Rechnungen und eigenständige Anwendung.

## Lernweg und Inhalt

| Einstieg | Inhalt |
|---|---|
| `#path/2` (auch `#week2`) | Derselbe Lernpfad wie Woche 1: drei Einheiten, sechs Lektionskarten, Wochenfortschritt und Check |
| `#lesson/<id>` | Erklären, Beispiel aufdecken, eigene Notiz, acht Aufgaben direkt starten und alle Aufgaben auswählen |
| `#week2/overview` | Ergänzender Skriptleser mit Acht-Stunden-Plan, Quellen, Lesemarkierungen und Wochencheck |
| `#week2/<kapitel>` | Zehn Kapitel mit Definitionen, Beispielen, Stoppfragen, Originalaufgaben, Übungen und verdeckten Vergleichslösungen |
| `#week2-lab` | NEA-Läufe einschließlich ε-Hülle und leeren Nachfolgermengen; vollständige Potenzmengentabelle; Minimierung bis zur stabilen Partition und zum Quotienten |
| Training | 93 Aufgaben insgesamt, davon die 61 eigens für Woche 2 erstellten Aufgaben mit konkreten Hilfestufen, Lösungsweg und passendem Alphabet |
| Klausurtraining | 40-Punkte-Wochencheck mit optional 60 Minuten, fortsetzbaren Eingaben und Selbsteinschätzung nach Abgabe |
| PDF | 29 Seiten aus demselben Inhalt wie der Skriptleser, einschließlich Lernplan, Quellen, Aufgaben und Lösungen |

Woche 1 und 2 verwenden denselben Renderer in `src/path-view.js` sowie dieselben CSS-Klassen `unit`, `lesson-grid` und `lesson-tile`. Die Lektionsseiten verwenden ebenfalls denselben Aufbau. Es gibt keine gesonderte Kartenansicht für Woche 2.

| Einheit | Lektionen | Aufgaben |
|---|---|---|
| Möglichkeiten verfolgen | NEA; ε-Hüllen | 10 + 15 |
| Automaten umformen | Potenzmengenkonstruktion; Minimierung | 24 + 22 |
| Darstellungen verbinden | Reguläre Grammatiken; Kleene | 12 + 10 |

Jede Lektion hat einen Haken nach sieben verschiedenen Aufgaben ohne Hilfe. Jede Einheit hat einen eigenen Bosskampf. Die Wochenauswahl steht im URL-Fragment, sodass `#path/2` auch nach einem Neuladen Woche 2 öffnet. Alte Kapitelverweise bleiben gültig; `#week2` öffnet jetzt direkt den interaktiven Lernpfad.

Die zehn Kapitel behandeln Fundament, Nichtdeterminismus, ε-Hüllen, Potenzmenge, Minimierung, reguläre Grammatiken, Kleene/Komplement, Übungsblätter A/B, Wochencheck und Vergleichslösungen. Die schriftlichen Varianten A1–A5 und B1–B5 ergänzen die kurzen App-Aufgaben.

Der Wochencheck verwendet A1/A3 und B1–B4. Wer die Lösungen bereits gelesen hat, nutzt ihn zur Wiederholung. 7 Punkte sind automatisch prüfbar; die übrigen 33 Punkte erfordern einen eigenen Lösungsweg und werden nach dem sichtbaren Raster selbst eingeschätzt. Zeit und Zielwert sind Trainingsvorgaben.

## Quellen und fachliche Gegenkontrolle

Die Quellenliste im Skript enthält die PDF-Fundstellen der bereitgestellten Vorlesungsunterlagen, des Masterplans und der Aufgaben. Die Originaldateien werden nicht veröffentlicht.

- **Aufgabe 6:** Das Diagramm verwendet das Alphabet `{0,2,4}`. Der ε-Start ergibt `{q0,q2}`; vier Mengen sind erreichbar, darunter `∅`. Die in der Quelle dargestellten Übergänge sind im Modell festgehalten.
- **Aufgabe 7:** Der als NEA bezeichnete Automat ist bereits deterministisch und vollständig. Alle acht Zustände sind erreichbar. Die fünf minimalen Klassen sind `{q1}`, `{q2,q5}`, `{q3,q4}`, `{q6,q7}` und `{q8}`.
- **Aufgabe 8d:** Die bereitgestellte Lösung enthält den Rücksprung `B→aA`. Dadurch lässt sich das gültige Wort `aba` nicht erzeugen. Für „beginnt mit a und enthält mindestens ein b“ lautet die korrigierte Regel `B→aB`; vollständig: `S→aA`, `A→aA|bB`, `B→aB|bB|ε`. Das Skript erklärt die Korrektur mit einer Ableitung.
- **Kleene:** Beide Übersetzungsrichtungen und ihre allgemeinen Konstruktionen werden erklärt. Beispielwörter allein gelten nicht als Äquivalenzbeweis.

## Fortschritt und Offline-Verhalten

Der bestehende Speicher `orbit-progress-v1` bleibt erhalten. Ältere Sicherungen erhalten bei Bedarf das optionale Feld `week2` mit leeren Lesemarkierungen. Alle Aufgaben-IDs bleiben erhalten. Vorhandene Antworten werden anhand ihrer aktuellen Lektionszuordnung berücksichtigt; ausreichende Nachweise ergänzen den Lektionshaken und einmalig 25 Abschluss-XP. Bereits gespeicherte Karteikarten, Notizen, Lesemarkierungen und Woche-1-Meilensteine bleiben gültig. Lesemarkierungen und Labore vergeben keine XP. Der Wochenpokal behält seine ursprünglichen vier Themenbereiche. Dafür werden die drei Lektionen NEA, ε-Hülle und Potenzmenge weiterhin zusammengezählt. Ein Lektionshaken prüft jeweils seine eigenen Aufgaben.

Die RegEx-Auswertung berücksichtigt das jeweilige Alphabet, auch `{a,b}`. Neue Aufgaben zählen beim Kompetenzstatus; die festen Woche-1-Checkfragen bleiben davon ausgenommen. Die Module, der gemeinsame Lernpfad und die PDF stehen im Offline-Manifest. Die Cache-Version wurde auf v10 angehoben. Der statische Build kopiert das PDF mit nach `dist/assets/`.

## PDF neu erzeugen

Die App und die Druckfassung lesen `src/week2-content.js`. Änderungen am Lerntext erfordern eine neue PDF im selben Commit. Der Web-Build verwendet die eingecheckte PDF und braucht kein Python.

Voraussetzungen für die Erzeugung: Python 3 mit `reportlab`, Node.js und DejaVu Sans (unter Debian Paket `fonts-dejavu-core`). Für eigene Schriftpfade gibt es `ORBIT_PDF_FONT_DIR`.

```sh
python3 scripts/build-week2-pdf.py
# Optional mit anderem Ausgabeort:
python3 scripts/build-week2-pdf.py /tmp/Lernskript_Woche_2.pdf
```

Jede redaktionell gegliederte Inhaltsseite wird auf eine Druckseite gesetzt. Nach größeren Ergänzungen müssen insbesondere Schriftgröße, Tabellen und Inhaltsverzeichnis erneut visuell geprüft werden.

## Prüfung

```sh
npm ci
npm test
npm run build
```

Alle 80 Tests und der statische Build bestehen. Die ergänzten Tests prüfen Übergänge gegen unabhängige Sprachbedingungen, sämtliche Original-Minimierungsklassen und unterscheidende Restwörter, exakte Sprachgleichheit der Quotienten, alle 61 Antwortschlüssel, RegEx über `{a,b}`, ältere Sicherungen, Lesefortschritt, Pokalbedingungen und die Punkteverteilung des Wochenchecks. Ein DOM-Test bedient den tatsächlichen App-Controller einschließlich Navigation, Laboren, Zeicheneingabe, Rückmeldung und Speicherung. Die bisherigen Oberflächentests bleiben bestehen. Der zusätzliche Lernpfadtest wechselt zwischen Woche 1 und 2, bearbeitet alle sechs neuen Lektionen mit je acht Antworten, kontrolliert die Haken bereits bei der siebten Antwort, speichert private Notizen und öffnet den Wochencheck direkt aus dem Lernpfad. Separate Migrationstests prüfen alte Aufgaben- und Karteikarten-IDs sowie die bisherigen Meilensteine.

Alle 29 PDF-Seiten wurden gerendert und visuell kontrolliert, dichte Tabellen zusätzlich in voller Größe. Die Cloud-Browser-Vorschau konnte die lokale App nicht öffnen. Eine echte Sichtprüfung in Desktop-/Mobilbrowsern und das Offline-Verhalten nach Installation sind deshalb noch offene manuelle Prüfungen; DOM-Tests und Manifestkontrolle ersetzen sie nicht.

Der Draft-PR wird durch den vorhandenen GitHub-Workflow getestet und gebaut. Ein PR löst keine Pages-Veröffentlichung aus.
