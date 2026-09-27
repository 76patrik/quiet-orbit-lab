# Ausbau: Übungstiefe und Probeklausuren

## Arbeitsauftrag vom 26.09.2026

Mehr Übungs- und Verständnisfragen in allen Themen, mehrere unterschiedliche Probeklausuren und ein spielerischer, wirksamer Lernablauf. Alle Änderungen laufen über einen eigenen PR. Zwischenstände werden regelmäßig auf den PR-Branch gepusht.

## Geplante Lieferpakete

1. **Aufgabenbank:** zusätzliche Verständnisfragen, Fehlerdiagnosen und berechenbare Varianten für jede Woche-1-Lektion; Themenübungen für die späteren Vorlesungskapitel. Filter nach Thema, Schwierigkeit und Aufgabentyp. Neue Varianten zuerst, Fehler gezielt wiederholen.
2. **Lernschleife:** Einstieg → Anwenden → Transfer. Seit 27.09.2026 ohne Sicherheitseinschätzung: direkte Prüfung, konkrete gestufte Hilfen und gezielte Fehlerwiederholung (siehe `TRAINING.md`). Themenmissionen und eigene Aufgabenrunden ergänzen XP und Pokale.
3. **Klausurraum:** drei unterschiedliche vollständige Probeklausuren sowie kurze Grundlagenchecks. 60-Punkte-Verteilung orientiert an der Altklausur, eigene neue Aufgaben statt Kopien. Offene Begründungen erhalten explizite Bewertungsraster; Selbstbewertung und automatisch geprüfte Punkte bleiben unterscheidbar.
4. **Robustheit:** laufende Klausuren automatisch lokal sichern und nach Neuladen fortsetzen. Zeitrahmen optional; 75 Minuten sind nur ein vorläufiger Trainingswert. Export/Import alter Lernstände muss erhalten bleiben.
5. **Abnahme:** mathematische Berechnungen gegen unabhängige Beispiele prüfen; Speicherung, Prüfungsauswertung, Hinweise und Navigation testen. PR-Beschreibung nach jedem Paket aktualisieren.

## Fachliche Prüfpunkte aus den Unterlagen

- Die Altklausur fordert bei Kurzfragen Begründungen. Reines Ankreuzen ist deshalb kein vollständiger Klausurnachweis.
- Potenzmengenkonstruktion und Minimierung brauchen dokumentierte Zwischenschritte.
- CYK benötigt alle Zerlegungen und eine Prüfung des Startsymbols; CNF-Konventionen einschließlich ε sind anzugeben.
- Vertex Cover deckt Kanten, nicht bloß benachbarte Knoten. Das fehlerhafte Lösungsblatt wird nicht übernommen.
- P, NP und NP-Vollständigkeit beziehen sich auf Entscheidungsprobleme. Eine einfache Spezialinstanz ändert nicht die allgemeine Problemklasse.
- Reduktionen haben eine Richtung. Der Nachweis der Schwere führt vom bekannten schweren zum neuen Problem.
- Eine Semi-Entscheidung darf bei Nichtzugehörigkeit laufen; ein Entscheider muss auf jeder Eingabe halten.
- Die Chomsky-Hierarchie ist keine pauschale Laufzeittabelle. Für feste kontextfreie Grammatiken gilt der übliche CYK-Zeitbedarf O(n³).

## Stand

- [x] Ausgangsstand, Altklausur und Aufgabenblatt gesichtet.
- [x] Erweiterung und Prüfkriterien dokumentiert.
- [ ] Aufgabenbank und Lernmechanik umgesetzt.
- [ ] Klausurraum mit verschiedenen Aufgaben und Bewertungsrastern umgesetzt.
- [ ] Regressionen, Build und Oberfläche geprüft.

## Wiederaufnahme

Repository: `76patrik/quiet-orbit-lab`. Branch: `feat/practice-and-exams`.
Der PR ist während der Arbeit ein Entwurf. Kein automatischer Merge in die veröffentlichte Hauptversion.
