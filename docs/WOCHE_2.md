# Woche 2 · Automaten und reguläre Sprachen

Der Masterplan sieht für 28.09.–04.10.2026 acht Stunden vor: NEA und ε-Hülle, Potenzmengenkonstruktion, DEA-Minimierung, reguläre Grammatiken sowie den Satz von Kleene. Die Erweiterung verbindet Erklärungen, vollständige Rechnungen und eigenständige Anwendung.

## Lernweg und Inhalt

| Einstieg | Inhalt |
|---|---|
| `#week2` | Übersicht, Acht-Stunden-Plan, Quellen, Lesefortschritt, vier Trainingsthemen und Wochencheck |
| `#week2/<kapitel>` | Zehn Kapitel mit Definitionen, Beispielen, Stoppfragen, Originalaufgaben, Übungen und verdeckten Vergleichslösungen |
| `#week2-lab` | NEA-Läufe einschließlich ε-Hülle und leeren Nachfolgermengen; vollständige Potenzmengentabelle; Minimierung bis zur stabilen Partition und zum Quotienten |
| Training | 61 neue Aufgaben mit je zwei konkreten Hilfestufen, abschließendem Lösungsweg und passendem Alphabet |
| Klausurtraining | 40-Punkte-Wochencheck mit optional 60 Minuten, fortsetzbaren Eingaben und Selbsteinschätzung nach Abgabe |
| PDF | 29 Seiten aus demselben Inhalt wie der Skriptleser, einschließlich Lernplan, Quellen, Aufgaben und Lösungen |

Die zehn Kapitel behandeln Fundament, Nichtdeterminismus, ε-Hüllen, Potenzmenge, Minimierung, reguläre Grammatiken, Kleene/Komplement, Übungsblätter A/B, Wochencheck und Vergleichslösungen. Die schriftlichen Varianten A1–A5 und B1–B5 ergänzen die kurzen App-Aufgaben.

Der Wochencheck verwendet A1/A3 und B1–B4. Wer die Lösungen bereits gelesen hat, nutzt ihn zur Wiederholung. 7 Punkte sind automatisch prüfbar; die übrigen 33 Punkte erfordern einen eigenen Lösungsweg und werden nach dem sichtbaren Raster selbst eingeschätzt. Zeit und Zielwert sind Trainingsvorgaben.

## Quellen und fachliche Gegenkontrolle

Die Quellenliste im Skript enthält die PDF-Fundstellen der bereitgestellten Vorlesungsunterlagen, des Masterplans und der Aufgaben. Die Originaldateien werden nicht veröffentlicht.

- **Aufgabe 6:** Das Diagramm verwendet das Alphabet `{0,2,4}`. Der ε-Start ergibt `{q0,q2}`; vier Mengen sind erreichbar, darunter `∅`. Die in der Quelle dargestellten Übergänge sind im Modell festgehalten.
- **Aufgabe 7:** Der als NEA bezeichnete Automat ist bereits deterministisch und vollständig. Alle acht Zustände sind erreichbar. Die fünf minimalen Klassen sind `{q1}`, `{q2,q5}`, `{q3,q4}`, `{q6,q7}` und `{q8}`.
- **Aufgabe 8d:** Die bereitgestellte Lösung enthält den Rücksprung `B→aA`. Dadurch lässt sich das gültige Wort `aba` nicht erzeugen. Für „beginnt mit a und enthält mindestens ein b“ lautet die korrigierte Regel `B→aB`; vollständig: `S→aA`, `A→aA|bB`, `B→aB|bB|ε`. Das Skript erklärt die Korrektur mit einer Ableitung.
- **Kleene:** Beide Übersetzungsrichtungen und ihre allgemeinen Konstruktionen werden erklärt. Beispielwörter allein gelten nicht als Äquivalenzbeweis.

## Fortschritt und Offline-Verhalten

Der bestehende Speicher `orbit-progress-v1` bleibt erhalten. Ältere Sicherungen erhalten beim Import nur das optionale Feld `week2` mit leeren Lesemarkierungen; die bisherigen Nachweise werden bewahrt. Lesemarkierungen und Labore vergeben keine XP. Der neue Pokal verlangt in jedem der vier Themen sieben verschiedene, ohne Hilfe gelöste Aufgaben.

Die RegEx-Auswertung berücksichtigt das jeweilige Alphabet, auch `{a,b}`. Neue Aufgaben zählen beim Kompetenzstatus; die festen Woche-1-Checkfragen bleiben davon ausgenommen. Die fünf neuen Module und die PDF stehen im Offline-Manifest, dessen Cache-Version angehoben wurde. Der statische Build kopiert das PDF mit nach `dist/assets/`.

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

Alle 75 Tests und der statische Build bestehen. Die ergänzten Tests prüfen Übergänge gegen unabhängige Sprachbedingungen, sämtliche Original-Minimierungsklassen und unterscheidende Restwörter, exakte Sprachgleichheit der Quotienten, alle 61 Antwortschlüssel, RegEx über `{a,b}`, ältere Sicherungen, Lesefortschritt, Pokalbedingungen und die Punkteverteilung des Wochenchecks. Ein DOM-Test bedient den tatsächlichen App-Controller einschließlich Navigation, Laboren, Zeicheneingabe, Rückmeldung und Speicherung. Die bisherigen Oberflächentests bleiben bestehen.

Alle 29 PDF-Seiten wurden gerendert und visuell kontrolliert, dichte Tabellen zusätzlich in voller Größe. Die Cloud-Browser-Vorschau konnte die lokale App nicht öffnen. Eine echte Sichtprüfung in Desktop-/Mobilbrowsern und das Offline-Verhalten nach Installation sind deshalb noch offene manuelle Prüfungen; DOM-Tests und Manifestkontrolle ersetzen sie nicht.

Der Draft-PR wird durch den vorhandenen GitHub-Workflow getestet und gebaut. Ein PR löst keine Pages-Veröffentlichung aus.
