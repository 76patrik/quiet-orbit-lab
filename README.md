# Orbit · Lernstudio

Ein persönliches Lernstudio für die Klausurvorbereitung in mehreren Fächern: erst verstehen, dann selbst anwenden, danach gezielt wiederholen.

## Fächer

| Fach | Prüfung | Stand |
|---|---|---|
| Theoretische Informatik | 20.11.2026 | Wochen 1–2 ausgearbeitet, Wochen 3–9 im Lernplan |
| Finanzierung und Rechnungswesen | 27.11.2026 | Angelegt, Lernmaterialien folgen |
| Mikro- und Makroökonomik | 02.12.2026 | Angelegt, Lernmaterialien folgen |

Die Seite **Fächer** zeigt alle Prüfungen mit Countdown. Sidebar und Kopfzeile zeigen die nächste Prüfung. Die Termine lassen sich in den Einstellungen ändern. Für Fächer ohne Unterlagen gibt es noch keine Lektionen oder Aufgaben.

## Spielen

Die Seite **Spielen** macht aus dem Wiederholen ein Spiel, ohne den Lernnachweis zu verwässern:

- **Rang und Level:** alle 150 XP ein Level, alle zwei Level ein neuer Rang (Startrampe → Umlaufbahn → Mondlandung → … → Sternenwanderer).
- **Tagesmissionen:** drei wechselnde Missionen pro Tag, z. B. Fünferkette, 10 Karteikarten, Blitzrunde, Boss herausfordern. Je 15 XP.
- **Karteikarten:** 121 Karten aus den Lektionstexten und den späteren Themen. Selbst erklären, umdrehen, ehrlich einschätzen. Leitner-Fächer mit 1, 3, 7, 14 und 30 Tagen. Tastatur: Leertaste zum Umdrehen, 1–3 zum Bewerten.
- **Blitzrunde:** 60 Sekunden, so viele richtige Antworten wie möglich, mit Rekord. Gefragt werden Woche 1 und Themen, die du schon geübt hast.
- **Bosskämpfe:** Jede Einheit von Woche 1 und 2 hat einen Boss – insgesamt acht. Bis zu zehn Aufgaben, drei Leben, keine Hinweise. Erster Sieg: 75 XP.
- **Im Quiz:** Antwortketten, XP-Anzeige pro Antwort und Konfetti bei Pokalen oder Level-Aufstieg. Bei „Bewegung reduzieren“ gibt es keine Animationen.

Boss- und Quizantworten zählen wie normale Aufgaben. Karteikarten und Blitzrunden sind Trainingsspiele: Sie bringen Missionsfortschritt, gelten aber nicht als Kompetenznachweis.

## Theoretische Informatik: Was bereits funktioniert

- **Woche 1:** 19 erklärte Lektionen, 62 Übungsaufgaben und ein separater Check mit 10 Fragen.
- **Woche 2:** sechs interaktive Lektionen in drei Einheiten mit 93 Aufgaben, ein 29-seitiges Lernskript mit 10 Kapiteln in der App und als PDF, zwei Automatenlabore und ein 40-Punkte-Wochencheck.
- **Fünf Lernlabore:** Sprachoperationen, RegEx, DEA-Läufe, eigene Automaten und Komplexitätswachstum.
- **Echte Aufgaben:** Mengen eingeben, RegEx konstruieren und vollständige Übergangstabellen erstellen. RegEx und DEAs werden auf vollständige Sprachgleichheit geprüft; bei Fehlern gibt es ein kürzestes Gegenbeispiel.
- **Lernfortschritt:** Tagesziele, XP, Levels, 19 Pokale, Lernserie, Fehlerprotokoll, Kompetenzstatus und echte Statistiken.
- **Wiederholungen:** 1, 3, 7 und 14 Tage; falsche Antworten werden erneut fällig. Hinweise zählen nicht als selbstständiger Nachweis.
- **Neun-Wochen-Plan:** 21.09.–20.11.2026. Wochen 1–2 sind ausgearbeitet; die weiteren Wochen enthalten Themenübersichten und bestehende Trainingsaufgaben.
- **Mobil und offline:** responsive Oberfläche, Startbildschirm-App, Offline-Cache nach erstem vollständigem Laden.
- **Lokaler Lernstand:** Export/Import als JSON. Kein Konto, kein Tracking und keine automatische Synchronisierung zwischen Geräten.

Die Original-PDFs sind nicht im öffentlichen Repository. Die App enthält neu formulierte Lerntexte mit Quellenstellen aus den bereitgestellten Skripten, Vorlesungsfolien, Aufgaben und dem Masterplan.

## Woche 2: vom NEA zur regulären Grammatik

Öffne **Woche 2** auf der Startseite oder im Lernpfad. Du findest denselben Aufbau wie in Woche 1: Einheiten mit Lektionskarten, Erklärungen, durchgerechneten Beispielen, privaten Notizen und direkten Übungsrunden. Nach sieben verschiedenen, ohne Hilfe gelösten Aufgaben erhält jede Lektion ihren Haken. Ein eigener Zähler zeigt 0–6 Abschlüsse; Dashboard und Statistik zählen insgesamt 25 Lektionen.

Der zusätzliche Skriptleser erklärt NEA, ε-Hülle, Potenzmenge, Minimierung, reguläre Grammatiken und den Satz von Kleene vom Grundbegriff bis zur vollständigen Rechnung. Originalaufgaben 6–8, zehn eigene schriftliche Aufgaben und Vergleichslösungen verbinden den Text mit der Klausurvorbereitung.

- Gelesene Kapitel und die zuletzt besuchte Stelle bleiben lokal gespeichert. Lesen und Laborversuche vergeben keine XP.
- NEA-Läufe und ε-Hüllen lassen sich zeichenweise verfolgen; das zweite Labor zeigt jede Runde der Minimierung einschließlich Erreichbarkeit und Quotient.
- Sechs Lektionen: NEA, ε-Hülle, Potenzmengenkonstruktion, Minimierung, reguläre Grammatiken und Kleene. Die vorhandenen 93 Aufgaben behalten ihre IDs und Lernstände. Der Wochenpokal behält seine vier Themenbereiche; NEA, ε-Hülle und Potenzmenge werden dafür zusammengezählt.
- Der Wochencheck hat optional 60 Minuten. 7 Punkte werden automatisch geprüft, 33 anhand eines Rasters selbst bewertet. Bekannte Varianten gelten als Wiederholung.
- [Skript als PDF](assets/Lernskript_Woche_2_Theoretische_Informatik.pdf) und [Details, Quellenkorrektur und Prüfung](docs/WOCHE_2.md).

## Training gezielt zusammenstellen

- Runden mit 5, 10, 20, 40 oder **allen passenden Aufgaben**. „Alle“ hat keine versteckte Obergrenze; beim Mengentraining werden beispielsweise alle 45 Aufgaben angeboten.
- Thema, Stufe, Aufgabenart und Lernstand filtern; nach Begriff oder Aufgaben-ID suchen. „Aufgaben selbst auswählen“ zeigt sämtliche Treffer mit Checkboxen und einem eigenen Startknopf je Aufgabe.
- 0/1, passende Buchstaben und mathematische Zeichen direkt einfügen; Löschen und Leeren funktionieren an der aktuellen Cursorposition. **Ergebnis prüfen** steht direkt nach der Eingabe. Die Sicherheitseinschätzung entfällt.
- Mehrstufige Hinweise verwenden konkrete Operanden, erste Rechenschritte oder die Begründung der jeweiligen Aufgabe. Der letzte Schritt zeigt den Lösungsweg samt Ergebnis. Hinweise zählen weiterhin als Unterstützung.
- ✓ kennzeichnet selbstständig gelöste Aufgaben. Nach einer Runde lassen sich nur die falschen oder mit Hilfe gelösten Aufgaben erneut üben. Beim Zurückgehen zur Arena lässt sich die aktuelle Runde bis zum Neuladen fortsetzen; geprüfte Antworten bleiben auch nach dem Neuladen erhalten.

Details und Prüfnachweise: [Training überarbeiten](docs/TRAINING.md).

## Öffentlich auf GitHub Pages

1. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
2. Unter **Actions → Testen und GitHub Pages veröffentlichen** den Workflow ausführen bzw. einen fehlgeschlagenen Lauf erneut starten.
3. Die veröffentlichte URL erscheint im erfolgreichen Deployment. Für dieses Repository lautet die vorgesehene Adresse `https://76patrik.github.io/quiet-orbit-lab/`.

Der Workflow testet zuerst die Lernlogik, baut nur die öffentlichen App-Dateien nach `dist/` und veröffentlicht dieses Verzeichnis. GitHub Pages muss einmal in den Repository-Einstellungen aktiviert sein. Für GitLab Pages oder andere statische Hosts kann ebenfalls `dist/` verwendet werden; eine GitLab-Veröffentlichung ist nicht eingerichtet.

Auf dem iPhone: die veröffentlichte Seite in Safari öffnen → Teilen → **Zum Home-Bildschirm**. Am PC und Handy sind die Lernstände zunächst getrennt; über **Einstellungen → Fortschritt exportieren / Sicherung importieren** überträgst du sie.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer. Die App selbst braucht keine Laufzeitpakete, API-Schlüssel oder laufenden Backend-Dienst. Für die automatisierten Oberflächentests werden die Entwicklungsabhängigkeiten mit `npm ci` installiert.

```sh
npm run dev
```

Dann `http://localhost:4173` öffnen. Alternativ lässt sich dort der GitHub-Unterpfad `http://localhost:4173/quiet-orbit-lab/` prüfen.

```sh
npm ci
npm test
npm run build
node scripts/serve.mjs --dist
```

## Was ein Erfolg bedeutet

Eine Lektion erhält ihren Haken nach sieben verschiedenen, ohne Hilfe richtig gelösten Aufgaben (das bisherige Ziel eines Acht-Aufgaben-Checks). Die Antworten dürfen aus mehreren Runden, der Trainingsarena oder Wiederholungen stammen. Jede geprüfte Antwort und der erreichte Haken werden sofort gespeichert, auch bevor du „Runde abschließen“ drückst. Bereits erreichte Haken bleiben erhalten; ältere Speicherstände mit ausreichenden Nachweisen werden beim Laden ergänzt. „Sicher“ verlangt zwei verschiedene Aufgaben an verschiedenen Tagen ohne Hilfe und ohne offene Fehler. Der Wochenpokal verlangt mindestens 8/10 im Check und die beiden Pflichtautomaten ohne Vorlage. Wiederholte identische Aufgaben sind kein unabhängiger Klausurnachweis.

Freitext-Begründungen werden privat als Notizen gespeichert. Die App bewertet sie nicht automatisch. Handschriftliche Lösungswege bleiben Teil des Lernplans. Die Zeit- und Prozentziele sind Trainingsannahmen, keine verbindlichen Prüfungsregeln.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `src/subjects.js` | Fächer, Prüfungstermine und Countdowns |
| `src/games.js` | Ränge, Tagesmissionen, Karteikarten, Bosskämpfe, Blitzrunde |
| `src/curriculum.js` | TI: Lerntexte, Aufgaben, Wochenplan und Pokalkriterien |
| `src/engine.js` | Mengenoperationen, Thompson-NEA, Sprachgleichheit, DEA-Läufe, Zahlenbewertung |
| `src/progress.js` | Wiederholung, XP, Kompetenzstatus, validierte Sicherungen |
| `src/week2-content.js` | Gemeinsamer vollständiger Lerntext für App und PDF |
| `src/path-view.js` | Gemeinsame Lektionskarten und Wochenübersichten für Woche 1 und 2 |
| `src/week2-lessons.js` | Sechs Lektionen, drei Einheiten und Zuordnung vorhandener Aufgaben |
| `src/week2-view.js` | Skriptleser, Lesefortschritt und Automatenlabore |
| `src/week2-models.js` | Übergänge der Originalaufgaben und eigenen Varianten |
| `src/week2-questions.js`, `src/week2-exam.js` | 61 Übungen und 40-Punkte-Wochencheck |
| `scripts/build-week2-pdf.py` | Druckfassung aus dem gemeinsamen Lerntext erzeugen |
| `src/app.js` | Oberfläche und Interaktionen |
| `styles.css` | Desktop- und Smartphone-Layout |
| `sw.js` | Offline-Cache innerhalb des App-Pfads |
| `docs/PLANUNG.md` | Didaktik, Erweiterungsplan und Abnahmekriterien |
| `docs/INHALTE.md` | Inhaltsformat, Aufgabentypen und benötigte Unterlagen für neue Fächer |

Tests prüfen besonders ε/∅, Quotienten, RegEx-Vorrang, vollständige Sprachgleichheit, Automaten gegen unabhängige Sprachdefinitionen, Wiederholungstermine, Pokalbedingungen und fehlerhafte Sicherungen.
