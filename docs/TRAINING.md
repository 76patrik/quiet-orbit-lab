# Trainingsarena – Überarbeitung vom 27.09.2026

## Anlass

Die Auswahl begrenzte Runden unabhängig vom sichtbaren Aufgabenbestand. Die Prüfung stand hinter Hilfetext und Sicherheitseinschätzung. Viele Hinweise waren für ein ganzes Thema identisch. Der Lektionshaken wurde nur beim letzten Klick eines Lektionschecks gesetzt; gleichwertige Arbeit in anderen Runden blieb dafür unberücksichtigt.

## Verhalten

1. **Vollständige Auswahl:** 5/10/20/40/alle, stets begrenzt nur durch die tatsächlichen Filtertreffer. Alle Aufgaben stehen in der eigenen Auswahl zur Verfügung. Filter, sichtbare Anzahl und gestartete Runde verwenden dieselbe Auswahlfunktion. Themenlinks öffnen sämtliche Aufgaben des Themas und setzen vorherige Einschränkungen zurück.
2. **Gezieltes Üben:** Suche, Statusfilter (offen, neu, gelöst, fällig), Checkboxen, alle markieren, Auswahl leeren und Einzelstart. Änderungen an Filtern leeren die individuelle Auswahl; der aktuelle Zustand ist beschriftet. Scrolling und Fokus in der Aufgabenliste bleiben beim Markieren erhalten.
3. **Eingabe:** Aufgabenspezifische Zeichentasten: über `{0,1}` nur 0/1, über `{a,b}` nur a/b; RegEx zusätzlich mit beiden Vereinigungsschreibweisen `∪` und `|`, Klammern, Stern, Plus und ε/∅. Bei Zustandsmengen erscheinen stattdessen die passenden Zustandsnamen. Rückschritt und Leeren bleiben verfügbar. Einfügen ersetzt eine Markierung und beachtet die maximale Eingabelänge. Enter prüft die Antwort. Die Hauptaktion steht direkt nach Eingabe/Zeichentasten und vor Hinweisen oder Erklärungen. Mobil werden die Aktionen oberhalb der Navigation angeordnet.
4. **Hilfen:** Operandenbezogene Schritte für Sprachoperationen, Wortanzahl, Potenzen, Automatenläufe, NEA, CYK, TM und RegEx. Bei Verständnisfragen wird die aufgabenspezifische Regel erklärt. Der letzte Schritt ist ausdrücklich als Lösungsweg mit Ergebnis bezeichnet. Der Entwurf bleibt beim Öffnen erhalten. Hinweise bleiben im Wochencheck und Bosskampf deaktiviert.
5. **Fortschritt:** Jede Antwort wird sofort gespeichert. Ein Aufgabenhaken bedeutet mindestens eine selbstständig richtige Lösung. Ein neuer Fehler kann zusätzlich eine Wiederholung erforderlich machen. Lektionshaken entstehen nach sieben verschiedenen selbstständig gelösten Aufgaben, entsprechend dem früheren Ziel von mindestens 80 % in acht Aufgaben, jetzt rundenübergreifend. Wiederholung derselben Aufgabe oder gestützte Antworten zählen nicht als weitere unabhängige Aufgabe. „Sicher“ behält seine strengere Regel über mehrere Tage. Erreichte Lektionshaken werden nicht entfernt.
6. **Migration:** Bestehende Nachweise ergänzen fehlende Lektionshaken samt einmaliger Belohnung beim Laden/Importieren. Das Datum stammt aus den tatsächlichen Lösungsdaten. Alte Felder für Sicherheitseinschätzungen bleiben zur Sicherungskompatibilität lesbar, werden in der Oberfläche nicht mehr erfragt.
7. **Weiterlernen:** Die Ergebnisansicht startet auf Wunsch nur falsche und unterstützte Aufgaben erneut. Verlassen zur Arena bietet eine Fortsetzung der laufenden Runde im selben Seitenaufruf. Ein Neuladen startet keine laufende Runde neu; bereits gespeicherte Antworten bleiben erhalten.

## Prüfung

- Regressionsfälle für alle 45 Mengenaufgaben, individuelle Auswahl, Nulltreffer und konsistente Statusfilter.
- Alle 448 Trainingsaufgaben besitzen mindestens zwei verwendbare Hilfestufen; Ergebnisse werden gegen die vorhandene Bewertungslogik geprüft. Beispiele prüfen Reihenfolge B·A, ε-Suffixe, leere Teilmengen und sämtliche CYK-Trennstellen.
- DOM-Interaktionstests laden den tatsächlichen App-Controller: Auswahl starten, Symboltasten und Cursor, Enter, doppelte Eingabe, Entwurf bei Hinweisen, Wiederholen, Lektionshaken vor dem Abschlussklick, ungültige Eingaben, Speicherung und Lernpfad.
- Bestehende Tests für Mathematik, Sicherungen, XP, Wiederholungen, Spiele und Klausuren bleiben erhalten. Build und Offline-Dateiliste schließen die neuen Module ein.
- Die DOM-Tests prüfen keine Pixelgeometrie. Eine visuelle Smartphone-Prüfung ist in dieser Umgebung nicht erfolgt, da die Browserumgebung den lokalen Vorschau-Server nicht erreicht. Die responsive Anordnung muss zusätzlich auf einem Smartphone beurteilt werden.

Die produktive Veröffentlichung erfolgt erst nach dem Merge des Draft-PRs über den bestehenden GitHub-Pages-Workflow. Es gibt weiterhin keine automatische Synchronisation zwischen Geräten.
