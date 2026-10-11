# Prüfung: Woche 3, Fehlerhilfen und Kapitelabschluss

11.10.2026 · Branch `codex/woche3-plan-klausurzeichen`.

## Änderungen

- Woche 3: vier vollständige Lektionen, 41 neue Kurzaufgaben, geführte und eigenständige Verfahren, Schrittgrafiken, Syntaxbäume, 20-Punkte-Wochencheck, HTML-Skript und eigenes 29-seitiges PDF. 480-Minuten-Plan und Übergang zu Woche 4.
- Woche 2/3: falsche Antworten zeigen bekannte Abweichungen, konkrete Zwischenstände, Erklärungen und Miniübungen. NEA-Beiträge vor Vereinigung und ε-Hülle werden sichtbar. Unterstützte Nachübungen erzeugen keine unabhängigen Erfolge.
- Klausurzeichen: aufgabengerechte Zeichenleisten, Einfügen am Cursor, Auswahl ersetzen, Löschen und Speicherung. Tastenauswahl verwendet keine Lösungen.
- Aktuellen Hauptbranch mit „Aufgaben“ und „Altklausur“ integriert. Kapitel können manuell abgeschlossen und wieder geöffnet werden. Grüner Haken, Text und Zähler in der Übersicht; Speicherung und Backup bleiben getrennt von Aufgaben-XP und automatisch geprüften Lektionen.
- Laptop-Layout: begrenzte Grid-Spalten, umbrechende Schrittleisten, flexible Wissenskarten, lokale Scrollbereiche für breite Grafiken/Tabellen. Offline-Cache Version 23.

## Ausgeführt

- `npm test`: 131 Tests erfolgreich, 0 fehlgeschlagen.
- `npm run build`: erfolgreich.
- `git diff --check`: erfolgreich.
- JSDOM: alle vier Woche-3-Lektionen und zwölf Übungsräume, Hinweise, Lösungsvergleich, Selbstbewertung, Klausurabgabe, Fehlernacharbeit, beide Kapitelreiter samt Abschluss/Zurücknehmen/Übersicht/Speicherung.
- Import: alte Sicherungen ohne Kapitelfeld bleiben gültig; unbekannte Kapitel und ungültige Datumswerte werden abgelehnt. Bestehende XP und Nachweise unverändert.
- Fachlich: CNF-Regelformen und begrenzter Sprachvergleich gegen Ausgangsgrammatiken, Syntaxbaumregeln und Blattwörter, Fragenbewertung, NEA-Läufe und vorhandene Altklausurmodelle.
- PDF-Seiten gerendert und gesichtet; korrigierte Syntaxbaumdarstellung zusätzlich einzeln geprüft.

Keine Browser-Screenshot- oder physische Geräteprüfung: Chromium war nicht verfügbar, der Browserdownload scheiterte. DOM-Tests prüfen Verhalten, nicht die tatsächliche Darstellung auf einem Laptop. Die responsive CSS-Anpassung ist implementiert, eine visuelle Browserabnahme bleibt offen.

## Veröffentlichung

Nur eigener Anwendungscode, eigene Lerntexte und das selbst erzeugte Skript sind Bestandteil dieses Branches. Keine bereitgestellten Original-PDFs hinzugefügt. Zwischencommits lokal gespeichert; Draft-PR vorgesehen, kein Merge beauftragt. Frühere Push-Versuche wurden von der automatischen Freigabeprüfung blockiert. Der abschließende Push am 11.10. scheiterte an fehlender GitHub-Authentifizierung (`could not read Username`). Der Branch ist nur lokal vorhanden; kein Draft-PR erstellt und nicht live.
