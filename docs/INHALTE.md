# Inhalte hinzufügen

Diese Anleitung beschreibt, wie ein Fach in Orbit Inhalte bekommt und welche Unterlagen dafür hilfreich sind. Bisher hat nur Theoretische Informatik Inhalte (`src/curriculum.js`). Finanzierung und Rechnungswesen sowie Mikro- und Makroökonomik sind in `src/subjects.js` angelegt und warten auf Material.

## Welche Unterlagen helfen

Je vollständiger die Unterlagen, desto besser passen Aufgaben und Bosskämpfe zur echten Klausur.

| Unterlage | Wofür Orbit sie nutzt |
|---|---|
| Skript oder Vorlesungsfolien | Lektionen, Beispiele, Stolperstellen, Karteikarten |
| Übungsblätter mit Lösungen | Rechenaufgaben, Toleranzen, typische Fehler |
| Altklausuren oder Probeklausur | Gewichtung der Themen, Bosskämpfe, Klausursimulation |
| Formelsammlung (falls erlaubt) | Hinweise und Karteikarten |
| Klausurinfos: Dauer, Hilfsmittel, Punkte | Zeitdruck in Simulationen, realistische Ziele |
| Themenliste oder Modulbeschreibung | Wochenplan bis zum Prüfungstermin |

Die Original-PDFs kommen nicht ins öffentliche Repository. Die App enthält neu formulierte Lerntexte mit Quellenangaben (z. B. „Skript · S. 12“).

## Aufbau eines Fachs

Ein Fach besteht aus denselben Bausteinen wie Theoretische Informatik:

- **Wochen** (`weeks`): Zeitplan bis zur Prüfung mit Zielen und Aufgaben aus dem Plan.
- **Einheiten** (`units`): Themenblöcke mit `id`, `title`, `subtitle`, `icon`, einem Boss-Namen (`boss`) und der Liste ihrer Lektionen.
- **Lektionen** (`lessons`): `id`, `title`, `minutes`, `source`, Einleitung, Abschnitte `[Überschrift, Text]`, ein gelöstes Beispiel, eine Stolperstelle und eine Frage zum Selbst-Erklären.
- **Aufgaben** (`questions`): mindestens drei pro Lektion, jeweils mit Erklärung und Hinweis.
- **Wochencheck** (`checkQuestions`): feste Fragen, Lösungen erst am Ende.

Aus den Lektionen entstehen automatisch **Karteikarten** (ein Abschnitt = eine Karte, dazu die Stolperstelle). Jede Einheit wird zu einem **Bosskampf** mit bis zu zehn Aufgaben und drei Leben.

## Aufgabentypen

| Typ | Eingabe | Bewertung |
|---|---|---|
| `choice` | eine Antwort wählen | Index der richtigen Option |
| `number` | Zahl eintippen | numerisch; `tolerance` (absolut) und `unit` optional; versteht `1.234,56`, `1234.56`, `12 %`, `300 €` |
| `set` | endliche Menge von Wörtern | Mengengleichheit (TI) |
| `regex` | regulärer Ausdruck | vollständige Sprachgleichheit (TI) |

Beispiel für eine Rechenaufgabe mit Rundung:

```js
{id:'fi-kw1', lesson:'kapitalwert', type:'number', unit:'€', tolerance:0.5,
 prompt:'Berechne den Kapitalwert bei i = 8 % für die Zahlungsreihe −1.000; 400; 400; 400.',
 answer:30.84,
 explanation:'…',
 hint:'Diskontiere jede Zahlung mit (1 + i)^−t und addiere.'}
```

Ein Punkt vor genau drei Ziffern gilt als Tausenderpunkt (`1.250` = 1250). Für Dezimalstellen deshalb das Komma nutzen.

## Mögliche fachspezifische Labore

Diese Labore wären mit den Unterlagen sinnvoll. Sie sind noch nicht gebaut und sollen sich an den tatsächlichen Klausurinhalten ausrichten.

**Finanzierung und Rechnungswesen**

- Buchungssatz-Trainer: Geschäftsvorfall lesen, Soll- und Habenkonten mit Beträgen wählen, Prüfung auf ausgeglichene Buchung.
- Bilanz-Sortierer: Posten Aktiva/Passiva und Anlage-/Umlaufvermögen zuordnen.
- Investitionsrechner: Zahlungsreihe eingeben, Kapitalwert, Annuität und internen Zins Schritt für Schritt nachrechnen.

**Mikro- und Makroökonomik**

- Marktdiagramm: Angebot und Nachfrage verschieben, neues Gleichgewicht vorhersagen, Steuer- oder Höchstpreiseffekte sehen.
- Elastizitätsrechner: Preis- und Mengenänderung eingeben, Elastizität berechnen und einordnen.
- Makro-Schieberegler (z. B. AS-AD oder IS-LM, je nach Vorlesung): Politikmaßnahme wählen, Richtung der Effekte vorhersagen.

## Checkliste für ein neues Fach

1. Inhalte als Datei neben `src/curriculum.js` anlegen und das Fach in `src/subjects.js` auf `status:'active'` setzen.
2. Aufgaben-IDs fachweit eindeutig halten (z. B. Präfix `fi-`, `vwl-`), damit Sicherungen gültig bleiben.
3. Jede Lektion: mindestens drei bewertbare Aufgaben, jede Einheit mindestens fünf (für den Bosskampf).
4. Rechenaufgaben gegen die Musterlösung prüfen und eine sinnvolle `tolerance` setzen.
5. Tests für neue Aufgabentypen und für den Import älterer Sicherungen ergänzen.
6. Neue Dateien in `sw.js` eintragen und den Cache-Namen erhöhen.
