# Lernpfad-Reiter „Aufgaben“ und „Altklausur“

Nutzerauftrag (07.10.2026): Unter **Lernpfad** zwei Reiter ergänzen, in denen jede Übungs- und Altklausuraufgabe
anschaulich zeigt, was gegeben ist, wie man Schritt für Schritt zur Musterlösung kommt und welches Hintergrundwissen
hilft. Ergänzung des Nutzers: **pro Aufgabe ein eigener Lernpfad** wie bei den Wochen, mit viel Platz, Tipps und Tricks.

## Aufbau

- Reiter vor den Wochen: `#path/aufgaben` (24 Aufgaben in 6 Themenblöcken) und `#path/altklausur` (6 Aufgaben, 60 Punkte).
- Jede Aufgabe hat eine eigene Seite `#path/<reiter>/<id>`: Worum geht es? (mit Grafik) → Das brauchst du
  (Begriffe + Link zur passenden Lektion/zum Thema) → je Teilaufgabe „Erst selbst versuchen“ (Notiz oder „weiß ich nicht“)
  → Schrittfolge mit Weiter/Zurück/direkter Auswahl/Neustart/„alle Schritte“ → Musterlösung, Punkteraster → Tipps & Tricks.
- Notizen und Schrittstand sind flüchtig (nur bis zum Neuladen) und werden bei Import/Zurücksetzen geleert.
  Lesen und Lösungen ansehen vergeben keine XP, keine Haken und schreiben nichts in den Lernstand.

## Quellen

`Aufgaben_Loesungen.pdf` (26 PDF-Seiten) und `Altklausur_Loesung.pdf` (10 PDF-Seiten). Die PDFs liegen **nicht** im Repo.
Aufgabentexte sind sinngemäß wiedergegeben, alle Grafiken aus Modellen in `src/solution-models.js` neu gezeichnet
(PDF-Seite steht bei jedem Modell und jeder Aufgabe).

## Fachliche Prüfung und markierte Fehler der Vorlagen

Alle Automaten, CYK-Tabellen, TM-Läufe und Graphenaussagen werden in `tests/walkthroughs.test.js` gegen unabhängige
Sprachdefinitionen bzw. vollständige Suche geprüft. Dabei gefundene Fehler der Musterlösungen sind in der App sichtbar
markiert und korrigiert:

| Stelle | Vorlage | Korrektur |
|---|---|---|
| AK 1c | DPDA erkennen keine Klammerausdrücke | Urteil stimmt, Begründung nicht: Dyck-Sprache ist deterministisch; Beispiel `{w wᴿ}` |
| AK 2b | Typ-1-Wortproblem NP-vollständig | bekannte Abweichung, fachlich PSPACE-vollständig (siehe LERNPFAD_REGELN.md) |
| AK 3b | Vertex Cover {b, d} | ist dominierende Menge; minimales Vertex Cover hat 4 Knoten, z. B. {a, b, c, d}; Farben im Text vertauscht |
| AK 4b | `A → a \| #Y` | `A → aA \| #Y` |
| AK 5c | NEA/DEA | gemeint NTM/DTM |
| Ü 6c | {q1} –2→ {q0, q2} | {q1} –2→ {q2}; Zustand ∅ ergänzt (Original akzeptiert 4242) |
| Ü 8d | `B → aA \| bB \| ε` | `B → aB \| bB \| ε` (sonst ist `aba` nicht ableitbar) |
| Ü 11b | L₂ nicht regulär (Pumping) | L₂ ist regulär (Paritäts-DEA), der Pumping-Beweis ist ungültig |
| Ü 12a | Konfigurationen mit q6 | gehören zu einer anderen Maschine; korrekte Folge simuliert |
| Ü 17b | `S → S ∗ Z`, „Sprache mehrdeutig“ | `S → S ∗ S`, `S → Z`; die **Grammatik** ist mehrdeutig |
| Ü 18a | „Komplement“ | gemeint Schnitt |
| Ü 19 | keine 4-Clique; VC {v2, v4, v8} | Clique {v2, v3, v10, v13}; minimales VC mit 7 Knoten; restliche Punkte eigenständig gelöst |
| Ü 20, 21 | keine Musterlösung | eigene, als solche gekennzeichnete Lösung |

## Prüfumfang

- `node --test tests/walkthroughs.test.js`: Modelle, Lösungen, alle Grafiken und alle Schritte aller Aufgaben.
- `tests/walkthroughs-ui.test.js` (jsdom) prüft Reiter, Aufgabenseite, Aufdecken, Schritte und unveränderten Lernstand.
  In der Entwicklungsumgebung war jsdom nicht installierbar (Registry-Sperre); derselbe Ablauf wurde dort per Playwright
  in Chromium geprüft. Die jsdom-Tests laufen im GitHub-Workflow.
- Alle Grafiken in Chromium gerendert und visuell geprüft (Desktop 1280 px); alle 32 Seiten bei 390 px Breite ohne
  horizontales Überlaufen der Seite (breite Diagramme scrollen in ihrem eigenen Bereich). Kein Test auf echten Mobilgeräten.
