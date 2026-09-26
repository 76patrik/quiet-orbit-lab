# Orbit · Lernstudio

Ein persönliches Lernstudio für die Klausurvorbereitung in mehreren Fächern: erst verstehen, dann selbst anwenden, danach gezielt wiederholen.

## Fächer

| Fach | Prüfung | Stand |
|---|---|---|
| Theoretische Informatik | 20.11.2026 | Woche 1 interaktiv, Wochen 2–9 geplant |
| Finanzierung und Rechnungswesen | 27.11.2026 | Angelegt, Lernmaterialien folgen |
| Mikro- und Makroökonomik | 02.12.2026 | Angelegt, Lernmaterialien folgen |

Die Seite **Fächer** zeigt alle Prüfungen mit Countdown. Sidebar und Kopfzeile zeigen die nächste Prüfung. Die Termine lassen sich in den Einstellungen ändern. Für Fächer ohne Unterlagen gibt es noch keine Lektionen oder Aufgaben.

## Spielen

Die Seite **Spielen** macht aus dem Wiederholen ein Spiel, ohne den Lernnachweis zu verwässern:

- **Rang und Level:** alle 150 XP ein Level, alle zwei Level ein neuer Rang (Startrampe → Umlaufbahn → Mondlandung → … → Sternenwanderer).
- **Tagesmissionen:** drei wechselnde Missionen pro Tag, z. B. Fünferkette, 10 Karteikarten, Blitzrunde, Boss herausfordern. Je 15 XP.
- **Karteikarten:** 76 Karten aus den Lektionstexten. Selbst erklären, umdrehen, ehrlich einschätzen. Leitner-Fächer mit 1, 3, 7, 14 und 30 Tagen. Tastatur: Leertaste zum Umdrehen, 1–3 zum Bewerten.
- **Blitzrunde:** 60 Sekunden, so viele richtige Antworten wie möglich, mit Rekord.
- **Bosskämpfe:** Jede Einheit von Woche 1 hat einen Boss. Bis zu zehn Aufgaben, drei Leben, keine Hinweise. Erster Sieg: 75 XP.
- **Im Quiz:** Antwortketten, XP-Anzeige pro Antwort und Konfetti bei Pokalen oder Level-Aufstieg. Bei „Bewegung reduzieren“ gibt es keine Animationen.

Boss- und Quizantworten zählen wie normale Aufgaben. Karteikarten und Blitzrunden sind Trainingsspiele: Sie bringen Missionsfortschritt, gelten aber nicht als Kompetenznachweis.

## Theoretische Informatik: Was bereits funktioniert

- **Woche 1:** 19 erklärte Lektionen, 62 Übungsaufgaben und ein separater Check mit 10 Fragen.
- **Fünf Lernlabore:** Sprachoperationen, RegEx, DEA-Läufe, eigene Automaten und Komplexitätswachstum.
- **Echte Aufgaben:** Mengen eingeben, RegEx konstruieren und vollständige Übergangstabellen erstellen. RegEx und DEAs werden auf vollständige Sprachgleichheit geprüft; bei Fehlern gibt es ein kürzestes Gegenbeispiel.
- **Lernfortschritt:** Tagesziele, XP, Levels, 14 Pokale, Lernserie, Fehlerprotokoll, Kompetenzstatus und echte Statistiken.
- **Wiederholungen:** 1, 3, 7 und 14 Tage; falsche Antworten werden erneut fällig. Hinweise zählen nicht als selbstständiger Nachweis.
- **Neun-Wochen-Plan:** 21.09.–20.11.2026. Wochen 2–9 sind ausdrücklich als Planung markiert; interaktive Inhalte folgen.
- **Mobil und offline:** responsive Oberfläche, Startbildschirm-App, Offline-Cache nach erstem vollständigem Laden.
- **Lokaler Lernstand:** Export/Import als JSON. Kein Konto, kein Tracking und keine automatische Synchronisierung zwischen Geräten.

Die Original-PDFs sind nicht im öffentlichen Repository. Die App enthält neu formulierte Lerntexte und Quellenstellen aus dem bereitgestellten Woche-1-Skript und Masterplan.

## Öffentlich auf GitHub Pages

1. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
2. Unter **Actions → Testen und GitHub Pages veröffentlichen** den Workflow ausführen bzw. einen fehlgeschlagenen Lauf erneut starten.
3. Die veröffentlichte URL erscheint im erfolgreichen Deployment. Für dieses Repository lautet die vorgesehene Adresse `https://76patrik.github.io/quiet-orbit-lab/`.

Der Workflow testet zuerst die Lernlogik, baut nur die öffentlichen App-Dateien nach `dist/` und veröffentlicht dieses Verzeichnis. GitHub Pages muss einmal in den Repository-Einstellungen aktiviert sein. Für GitLab Pages oder andere statische Hosts kann ebenfalls `dist/` verwendet werden; eine GitLab-Veröffentlichung ist nicht eingerichtet.

Auf dem iPhone: die veröffentlichte Seite in Safari öffnen → Teilen → **Zum Home-Bildschirm**. Am PC und Handy sind die Lernstände zunächst getrennt; über **Einstellungen → Fortschritt exportieren / Sicherung importieren** überträgst du sie.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer. Die App braucht keine installierten npm-Pakete, API-Schlüssel oder laufenden Backend-Dienst.

```sh
npm run dev
```

Dann `http://localhost:4173` öffnen. Alternativ lässt sich dort der GitHub-Unterpfad `http://localhost:4173/quiet-orbit-lab/` prüfen.

```sh
npm test
npm run build
node scripts/serve.mjs --dist
```

## Was ein Erfolg bedeutet

Eine Lektion ist bei mindestens 80 % korrekten Antworten ohne Hinweise abgeschlossen. „Sicher“ verlangt zwei verschiedene Aufgaben an verschiedenen Tagen ohne Hilfe und ohne offene Fehler. Der Wochenpokal verlangt mindestens 8/10 im Check und die beiden Pflichtautomaten ohne Vorlage. Wiederholte identische Aufgaben sind kein unabhängiger Klausurnachweis.

Freitext-Begründungen werden privat als Notizen gespeichert. Die App bewertet sie nicht automatisch. Handschriftliche Lösungswege bleiben Teil des Lernplans. Die Zeit- und Prozentziele sind Trainingsannahmen, keine verbindlichen Prüfungsregeln.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `src/subjects.js` | Fächer, Prüfungstermine und Countdowns |
| `src/games.js` | Ränge, Tagesmissionen, Karteikarten, Bosskämpfe, Blitzrunde |
| `src/curriculum.js` | TI: Lerntexte, Aufgaben, Wochenplan und Pokalkriterien |
| `src/engine.js` | Mengenoperationen, Thompson-NEA, Sprachgleichheit, DEA-Läufe, Zahlenbewertung |
| `src/progress.js` | Wiederholung, XP, Kompetenzstatus, validierte Sicherungen |
| `src/app.js` | Oberfläche und Interaktionen |
| `styles.css` | Desktop- und Smartphone-Layout |
| `sw.js` | Offline-Cache innerhalb des App-Pfads |
| `docs/PLANUNG.md` | Didaktik, Erweiterungsplan und Abnahmekriterien |
| `docs/INHALTE.md` | Inhaltsformat, Aufgabentypen und benötigte Unterlagen für neue Fächer |

Tests prüfen besonders ε/∅, Quotienten, RegEx-Vorrang, vollständige Sprachgleichheit, Automaten gegen unabhängige Sprachdefinitionen, Wiederholungstermine, Pokalbedingungen und fehlerhafte Sicherungen.
