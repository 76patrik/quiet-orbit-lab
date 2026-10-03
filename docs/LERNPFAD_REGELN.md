# Verbindliche Regeln für alle Lernpfade und zukünftigen Wochen

Stand: 03.10.2026. Vom Nutzer beauftragte Grundlage für weitere Arbeit an Orbit. Vor jeder neuen Woche und jeder Überarbeitung von Lernpfaden lesen. `AGENTS.md` verweist ausdrücklich hierher.

## 1. Ziel und Zielgruppe

Die App bereitet einen Einsteiger auf die Klausur Theoretische Informatik vor. Er muss Begriffe verstehen, benötigtes Faktenwissen ohne Vorlage abrufen, vollständige Verfahren rechnen und kurze korrekte Begründungen formulieren können. Reines Lesen, Klicken oder Wiedererkennen genügt nicht als Kompetenznachweis.

Deutsch, einfache Sätze, fachlich präzise Begriffe. Fachwörter beim ersten Gebrauch erklären. Vom konkreten Beispiel zur allgemeinen Regel führen. Keine unnötigen Metaphern, keine erfundenen Prüfungsversprechen.

## 2. Quellen und Klausurnähe

1. Zuerst die Prüfungsmitteilung, den Masterplan, die relevanten Vorlesungsfolien, Aufgaben mit Lösungen und die Altklausur prüfen.
2. Quellen mit Dateiname und überprüfter PDF-Seite oder Foliennummer dokumentieren; PDF-Seite und aufgedruckte Foliennummer unterscheiden.
3. Altklausur als Aufgabenformat und Anforderungsniveau verwenden. Keine Garantie gleicher Aufgaben, Punkte, Prüfungsdauer oder zugelassener Hilfsmittel behaupten.
4. Eigenständige Übungsvarianten schreiben. Nicht nur Zustandsnamen oder Zahlen einer bereits gelösten Aufgabe austauschen: Bedingungen, Randfälle, Gegenbeispiele und Lösungsentscheidungen variieren.
5. Jede Aufgabe selbst lösen. Fachliche Modelle und Begründungen prüfen; Tests dürfen nicht bloß denselben möglicherweise falschen Lösungstext vergleichen.
6. Fehler und Widersprüche in Musterlösungen sichtbar kennzeichnen. Fachlich falsche Angaben nicht ungeprüft als verbindliches Auswendigwissen übernehmen.
7. Bekannte Abweichung: TGI_01_Einfuehrung, Folie 42, nennt beim Typ-1-Wortproblem NP-vollständig. Das allgemeine Wortproblem kontextsensitiver Grammatiken ist PSPACE-vollständig. Lernmaterial muss die Abweichung samt Fachquelle und offener Frage zur erwarteten Klausurformulierung kenntlich machen. Fachquelle: https://clinjournal.org/CLIN_proceedings/II/aarts.pdf (Einleitung).
8. Die Original-PDFs nicht in das öffentliche Repo kopieren. Eigene Texte, Beispiele und Grafiken erstellen.

## 3. Verbindlicher Aufbau einer Lektion

Jede Lektion und jeder eigenständige Themenüberblick enthält:

1. **Voraussetzungen:** benötigtes Vorwissen mit Link zum passenden früheren Thema.
2. **Drei Lernziele:** Was muss ich wissen? Was muss ich rechnen/konstruieren? Was muss ich begründen?
3. **Anschaulicher Einstieg:** konkretes kleines Beispiel mit erklärter Grafik.
4. **Begriffe und Regeln:** Notation, Voraussetzungen, Randfälle und typische Verwechslungen.
5. **Einmal gemeinsam durchrechnen:** vollständiger nachvollziehbarer Lösungsweg, passende Tabelle und Grafik.
6. **Mit abnehmender Hilfe üben:** zuerst mehrere Schritte vorgegeben, danach nur Startschritt, schließlich eine neue vollständige Aufgabe ohne Hilfe.
7. **Wissen frei abrufen:** ohne Multiple-Choice-Vorgaben; Definitionen, Zuordnungen und Regeln reproduzieren.
8. **Begründung schreiben:** eigene Antwort vor dem Öffnen der Lösung, anschließend konkretes Bewertungsraster.
9. **Fehlerdiagnose:** Fehlerart, persönliche Korrekturregel, erneuter Abruf.
10. **Nächster Schritt:** eindeutiger Button zur nächsten offenen Lektion; nach Wochenabschluss in die nächste Woche, nach dem letzten Planabschnitt zur Simulation.

Nicht jedes Thema benötigt gleich viel Text. Jede Stufe muss fachlich sinnvoll ausgefüllt sein. Generische Platzhalter wie „lies die Definition noch einmal“ ersetzen keine passende Erklärung.

## 4. Wissen, das abrufbar sein muss

Verbindliches Kernwissen je Thema ausdrücklich benennen. Beispiele: Zeichen und Mengenoperationen; ε/∅/{ε}; DEA-Tupel und Annahme; NEA-Existenzbedingung; ε-Hülle; Zustandsäquivalenz; Kleene; Chomsky-Hierarchie; CNF-Regeln samt ε-Ausnahme; CYK-Annahme; Kellerprinzip; TM-Konfiguration; P/NP; Reduktionsrichtung; Entscheider/Semi-Entscheider; Voraussetzungen von Rice.

Die Chomsky-Tabelle enthält Typ, Sprachklasse, Regelbeschränkung, Automatenmodell, Wortproblem und ein trennendes Beispiel. Lernstufen: ansehen → einzelne wechselnde Lücken → ganze Zeile → leere Tabelle. Fachliche Bedingungen müssen exakt sein; gleichbedeutende Formulierungen zulassen. Nicht auf blindes Wort-für-Wort-Matching verlassen.

## 5. Aufgaben, Lösungen und Begründungen

- Aufgaben sind vollständig und unabhängig lesbar: Alphabet, Start-/Endzustände, Übergänge, Grammatikregeln, Wort und gewünschte Ausgabe angeben. Kein isoliertes „derselbe Automat“ ohne Darstellung.
- Zwischenstände und Randfälle verlangen: insbesondere ε, ∅, minimale Länge, Fangzustände, fehlende Übergänge, Reihenfolge, unerreichbare Zustände, nicht erfüllte Pflichtbedingungen.
- Entscheidungsfrage, Rechenverfahren, Konstruktion und Begründung unterscheiden.
- Gegenbeispiele und Fehlerkorrekturen einbauen. Eine richtige Endzahl ersetzt nicht den geforderten Lösungsweg.
- Hinweise gestuft und auf die Aufgabe bezogen geben. Hinweisnutzung als Unterstützung erfassen.
- Aufdecken erst nach eigener Eingabe; Unsicherheit darf als „weiß ich nicht“ eingetragen werden. Nicht bereits vor der Antwort die Bewertungskriterien mit der gesamten Lösung anzeigen.
- Automatisch prüfen, wenn eine verlässliche mathematische Prüfung möglich ist. Offene Konstruktionen/Begründungen nur mit explizitem Selbstbewertungsraster beurteilen, solange keine echte fachliche Prüfung implementiert ist. Kein vorgetäuschtes automatisches Freitexturteil.
- Bereits vorhandene Prüfungen und Probeklausuren ergänzen den Lernpfad. Ganze Verfahren sollen auch innerhalb des Lernpfads vorkommen.

## 6. Grafiken und Tabellen

- Jede Grafik erklärt einen konkreten Zusammenhang oder Rechenschritt; keine dekorative Ersatzgrafik.
- Diagramm, Tabelle, Wortlauf und Lösung müssen exakt dieselben Modelle, Zustandsnamen und Aufgabenbedingungen verwenden.
- DEA-Aufgaben zeigen nach richtigen UND falschen Antworten Grafik und vollständige Übergangstabelle. Auch gemeinsame Beispiele enthalten beides. Eine Prüfung zeigt Lösungen erst nach Abgabe.
- Keine fachlich ähnlichen, aber abweichenden Beispielautomaten als Lösung einer anderen Aufgabe anzeigen.
- Schrittsteuerung mit Weiter, Zurück, direkter Auswahl und Neustart. Aktuellen Zustand/Schritt beschriften; Farbe nie als einzige Information.
- SVG/HTML/CSS für präzise Diagramme verwenden. Keine KI-Bitmap für exakte Automaten, Tabellen oder wissenschaftliche Aussagen.
- Geeignete Darstellungen: Wortbäume, Venn-Bereiche, RegEx-Blöcke, Zustandsgraphen, Mengenläufe, Partitionen, Syntaxbäume, CYK-Dreiecke, Keller, TM-Bänder, Reduktionsgraphen.
- Pro Bild überschaubare Informationsmenge. Erklärung direkt am Bild. Große Tabellen/Graphen in einem eigenen scrollbar beschrifteten Bereich, nicht die ganze Seite horizontal verbreitern.

## 7. Fortschritt, Wiederholung und Fehler

- Automatische Aufgabenergebnisse, Lesen, unterstützte Übung und Selbstbewertung getrennt speichern und anzeigen.
- Vorhandene Haken/XP/IDs und alte Sicherungen erhalten. Verbesserte Nachweise ergänzen alte Ergebnisse; sie nicht stillschweigend löschen oder rückwirkend abwerten.
- Für Wissen, Anwenden und Begründen getrennte Nachweise. Einmaliger Erfolg ist keine garantierte Klausursicherheit.
- Lesen, Grafikschritte und Lösungseinblendungen vergeben keine XP oder selbstständigen Aufgabenhaken.
- Fehler und unterstützte Versuche werden erneut fällig. Erfolgreicher Abruf wird an späteren Tagen wiederholt; mehrere Wiederholungen am selben Tag zählen nicht als zeitlich verteilte Nachweise.
- Direkt nach einer eingeblendeten Lösung wiederholen ist Übung mit Vorlage im Gedächtnis und darf nicht als neuer unabhängiger Erfolg erscheinen.
- Fehlerarten: Begriff vergessen, Notation/ε verwechselt, falsches Verfahren, Rechenschritt, unvollständige Begründung, Zeitproblem. Persönlichen Merksatz und nächste passende Übung anbieten.
- Speicherfehler sichtbar melden. Import streng validieren; alte Sicherungen ohne neue Felder funktionieren weiterhin. Datenlöschung und Import müssen auch flüchtige Übungssitzungen zurücksetzen.

## 8. Wochenaufbau und Navigation

- Alle vollständigen Wochen verwenden dieselbe grundlegende Navigation und dieselben Lektionsbausteine wie Woche 1 und 2.
- Jede Woche enthält visuelle Themenroute, Lernziele, Voraussetzungen, sinnvolle Reihenfolge, Übungspools, freien Abruf und einen Wochencheck mit nachvollziehbarem Raster.
- Neue Themen enthalten geplante Wiederholung von Vorwissen. Gemischte Aufgaben verlangen zunehmend selbstständige Wahl des Verfahrens.
- Wochenabschluss mit neuer vollständiger Aufgabe und kurzer Begründung. Eigene Prozentziele deutlich als Trainingsziel benennen.
- Nach Lektionsabschluss direkt zur nächsten offenen Lektion verlinken; nach letzter Lektion zur nächsten Woche. Übersicht und Wiederholen bleiben zusätzliche Möglichkeiten.
- Noch nicht vollständig ausgearbeitete Wochen als Plan/Vertiefung kennzeichnen, nicht als fertiges Vollskript ausgeben.
- Skript im Lernpfad direkt öffnen und, wenn vorhanden, als PDF herunterladen können. Spätere Wochen erhalten diese Funktion, sobald ein geprüftes vollständiges Skript vorliegt.

## 9. Gestaltung und Bedienung

Darkmode der App erhalten; ruhige Karten, klare Hierarchie, konsistente Farben und gut lesbare Schrift. Mobil zuerst denken: große Touch-Ziele (mindestens 44 px), kurze Wege, sichtbare primäre Aktion, kein unnötiges Bestätigungsritual. Symboltasten bei geeigneten Eingaben bereitstellen.

Formulare korrekt beschriften; Tabellen mit Zeilen-/Spaltenköpfen; Tastaturbedienung und sichtbarer Fokus; Statusmeldungen für Screenreader. Nutzereingaben vor HTML-Ausgabe escapen. Originalantwort nach Abgabe unverändert zeigen. Bei langen Übungen klar sagen, wann gespeichert wird.

## 10. Umsetzung und Abnahme

- Vor Beginn Repo-Status und vorhandenen Draft-PR prüfen. Kleine nachvollziehbare Zwischencommits; Änderungen zeitnah pushen. Ohne Auftrag nicht mergen.
- Gemeinsame Renderer und Datenmodelle erweitern; keine abweichenden Sonder-Lernpfade pro Woche erzeugen.
- Neue statische Module im Offline-Cache ergänzen und Cache-Version erhöhen.
- Inhalte auf vollständige Themenabdeckung und konkrete fachliche Konsistenz prüfen.
- Relevante Funktionstests für Antwortabgabe, Hint-/Lösungsnutzung, Selbstbewertung, Wiederholung, Import/Export und Übergang zur nächsten Lektion ausführen.
- `npm test`, `npm run build`, `git diff --check`; bei echten Risiken zusätzliche gezielte Tests.
- Grafiken rendern und visuell prüfen. Wenn kein Browser verfügbar ist, diesen Prüfungsumfang ehrlich begrenzen; DOM-Tests sind kein Screenshot- oder Mobilgerätetest.
- PR beschreibt Nutzerproblem, neue Bedienung, Datenkompatibilität, Tests und verbleibende Einschränkungen. Die finale Antwort verlinkt PR und Regeldatei und sagt, ob bereits live oder nur im Draft.

## 11. Vorlage für zukünftige Wochen

Vor dem Bauen ausfüllen:

- Woche / Themen / Quellen und genaue Fundstellen:
- Benötigtes Vorwissen und Rücksprunglinks:
- Abrufwissen, Rechenkompetenz, Begründungskompetenz:
- Visualisierung je Thema und zugrunde liegendes geprüftes Modell:
- Gemeinsames Beispiel und eigenständige neue Variante:
- Hint-Stufen und Bewertungsraster:
- Fehlerfälle und Randfälle:
- Wiederholungsplan und Wochencheck:
- Skript öffnen / PDF-Status:
- Nächste Lektion / Folgewoche:
- Fachliche Prüfung, Funktionsprüfung, visuelle Prüfung:
- Offene Quellenkonflikte oder noch nicht umgesetzte Teile:

Diese Regeldatei bei neuen Nutzerentscheidungen gezielt aktualisieren und im selben PR dokumentieren. Sie beschreibt den Sollstandard; unfertige Teile niemals allein durch eine Dokumentationsbehauptung als implementiert ausgeben.
