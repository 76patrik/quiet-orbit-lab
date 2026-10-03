# Woche 2 – Überarbeitung nach Lernpfad-Regeln

Geprüfter Umfang: die sechs Lektionen NEA, ε-Hülle, Potenzmengenkonstruktion, Minimierung, reguläre Grammatik und Kleene. Grundlage: `LERNPFAD_REGELN.md`.

- Jede Lektion enthält Rücksprunglinks zum nötigen Vorwissen und konkrete Fundstellen in den bereitgestellten Originalfolien. Angegeben sind PDF-Seitenpositionen, keine unkontrolliert übernommenen Foliennummern. Originaldateien bleiben außerhalb des Repositories.
- Freier Abruf und Begründung haben pro Thema getrennte fachliche Kriterien. Die Bewertung bleibt ausdrücklich eine Selbstbewertung.
- Zwei Hinweise pro Thema und Übungsformat geben Denkanstöße, ohne die komplette Vergleichslösung vorwegzunehmen. Hinweise bleiben sichtbar, die Eingabe bleibt erhalten. Hilfe zählt auch nach einem Wechsel der Übungsstufe als Unterstützung beim selben eigenständigen Auftrag.
- NEA und ε-Hülle zeigen im gemeinsamen Beispiel sowie nach Abgabe der geführten und eigenständigen Aufgabe den passenden Graphen, die vollständige Übergangstabelle und alle Zwischenmengen. Schrittsteuerung: zurück, weiter, direkte Auswahl, Neustart.
- ε-Aufgaben untersuchen Erreichbarkeit. Da sie keine Endmenge vorgeben, erfindet die Grafik keine akzeptierenden Zustände. ε-Kreise werden mit einer Besuchsmenge beendet.
- Bestehende IDs, XP, Lektionsabschlüsse und Sicherungen bleiben erhalten. Neue Module sind im Offline-Cache; Cache-Version erhöht.

## Prüfung

- `npm test`: alle 19 Testdateien erfolgreich. Neue Tests prüfen Modellläufe, Annahme ganzer Wörter, leere Mengen, Quellen/Vorwissensabdeckung, Aufdeckungszeitpunkt, Hinweisgrenzen und Unterstützung nach Stufenwechsel.
- `npm run build` und `git diff --check`: erfolgreich.
- Chromium 131 / Playwright, mobile Fensterbreite 390 × 844: alle sechs Lektionsseiten und 18 Übungsansichten geöffnet, eigene Antwort, Hinweis und Vergleich betätigt. Kein horizontaler Seitenüberlauf und keine JavaScript-Seitenfehler. Große Graphen scrollen in ihrem eigenen Bereich.
- Screenshots der sechs Lektionen und Übungen erzeugt; Lektionsübersicht sowie NEA-/ε-Graphen visuell geprüft. Dabei dunkle SVG-Textfüllung korrigiert. Das ist eine Prüfung im mobilen Browserfenster, kein Test auf einem physischen Smartphone oder ein vollständiger Screenreader-Audit.

Die Prüfung schließt die konkret gefundenen Lücken von Woche 2. Sie behauptet keine vollständige Regelkonformität aller späteren Wochen.
