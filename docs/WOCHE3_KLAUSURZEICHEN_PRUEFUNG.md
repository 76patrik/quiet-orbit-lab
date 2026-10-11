# Prüfung: Woche-3-Plan und Klausurzeichen

07.10.2026 · Branch `codex/woche3-plan-klausurzeichen`.

## Änderungen

- Konkreter Woche-3-Plan mit 480 Minuten, Vorwissenslinks, Nachweisen, Quellenkorrekturen, Wiederholung und Übergang zu Woche 4. Status ausdrücklich Planung; vorhandene Themenräume bleiben nutzbar.
- Klausuren: Zeichenleisten für RegEx, Mengen, offene Antworten und kurze Textantworten. Zeichen richten sich nach Aufgabenstellung, Thema und angegebenem Alphabet. Auswahl verwendet keine Antwort, Musterlösung oder Bewertungsrubrik.
- Passende a/b-Beschriftung im Woche-2-RegEx-Feld statt festem 0/1.
- Gemeinsamer Renderer für Training und Klausuren, Einfügen am Cursor, Auswahl ersetzen, Rücktaste, Leeren; bestehende Speicherung und Eingabelimits bleiben wirksam.
- Neue Module im Offline-Cache, Cache-Version 21. Lernstände und Aufgaben-IDs unverändert.

## Ausgeführt

- `npm test`: 107 Tests erfolgreich, 0 fehlgeschlagen (20 Testdateien).
- `npm run build`: erfolgreich.
- `git diff --check`: erfolgreich.
- Neue Regressionen prüfen Alphabete und Mengenelemente aller bestehenden Klausuren, keine Lösungsdaten bei Tastenauswahl, reale App-Ereignisse in JSDOM, Cursor/Auswahl/Löschen, lokale Speicherung, Wiederaufnahme, 4000-Zeichen-Limit, kurze TM-Eingabe sowie sichtbaren Plan und 480-Minuten-Summe.

Keine Browser-Screenshot- oder physische Mobilgeräteprüfung durchgeführt. Vorhandene CSS-Regeln erlauben umbrechende Zeichenleisten und mindestens 44 px große Tasten. Der Testumfang belegt Verhalten im DOM, nicht die visuelle Darstellung auf einem echten Gerät.

## Veröffentlichung

Zwischencommits lokal gespeichert. Der Push wurde durch die automatische Freigabeprüfung blockiert: Sie verlangt eine ausdrückliche Freigabe zur Veröffentlichung der Änderungen einschließlich eigener, aus den bereitgestellten Unterlagen abgeleiteter Lerntexte im öffentlichen Repository `76patrik/quiet-orbit-lab`. Keine Original-PDFs aufgenommen. Neuer Draft-PR daher noch nicht erstellt; nichts gemergt oder live geschaltet.
