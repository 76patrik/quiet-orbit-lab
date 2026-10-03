# Lernpfade mit Bildern

Alle 25 vollständigen Lektionen aus Woche 1 und 2 sowie alle acht zusätzlichen Vertiefungsthemen besitzen ein eigenes Lernbild. Jede der neun Wochen verlinkt ihre Themen in einer visuellen Route. Wochen 8 und 9 führen zusätzlich zu Wiederholung und Simulation. Die späteren Wochen bleiben Themenüberblicke und werden dadurch nicht als vollständige neue Skripte ausgegeben.

## Bedienung

- Die Lernbilder stehen direkt nach dem Lernziel, vor den ausführlichen Erklärungen.
- Nummerierte Schritte, Weiter, Zurück und Von vorn wechseln zwischen Bildern mit kurzen Begründungen.
- Tabellen und Diagramme sind beschriftet. Bedeutung wird nicht allein über Farbe vermittelt.
- Auf schmalen Bildschirmen umbrechen Bausteine; größere SVGs sind im eigenen Bereich horizontal scrollbar.
- Die bestehenden DEA-Graphen, vollständigen Übergangstabellen und Wortläufe bleiben in den gemeinsamen Beispielen erhalten.
- Bilder ansehen, Schritte wechseln und zurücksetzen vergeben keine XP, Abschlüsse oder Wissensnachweise. Die Navigation darf wie bisher das zuletzt geöffnete Kapitel speichern.
- Alle Bilder entstehen lokal aus HTML/CSS/SVG und funktionieren mit dem Service-Worker-Cache auch offline.

## Themen und Darstellungen

| Bereich | Lernbilder |
| --- | --- |
| Grundlagen | Eingabe–Prüfer–Antwort, Schleifendreieck, Wortbaum, Mengenfilter, ε/∅/{ε} |
| Sprachen | Venn-Diagramm, Verkettungsmatrix, Wortblöcke, Rechtsquotient mit allen Paaren |
| RegEx | Bindungsbereiche und Pflichtzeichen, zerlegte Beispielwörter, Gegenwörter |
| DEA | Zustandsbedeutungen, Restklassenkreis, Fangzustand, Komplementvergleich |
| Grammatiken | Ableitungsketten und Pflichtphasen, verschachtelte Chomsky-Klassen |
| NEA / ε | Echter NEA-Graph, vollständige Zustandsmengen, ε-Kreis mit getrenntem Zeichenpfeil |
| Umformungen | Potenzmengen-Tabelle, Partitionsverfeinerung, Kleene-Verkettung mit ε-Verbindung |
| Grenzen / CNF | Beliebige Pumping-Zerlegung, Regelaufteilung, Syntaxbaum für aabb |
| CYK / Keller | CYK-Dreieck für ab und Gegenwort ba, Kellerstände für aⁿb²ⁿ |
| Turingmaschine | Band, Kopf und Zustand beim Übertrag von 1011 auf 1100 |
| P / NP | Clique-Zertifikat mit hervorgehobenen Prüfkanten, Komplementgraph und Reduktionsrichtung |
| Entscheidbarkeit | Halteverhalten, abwechselnde Simulation, Rice-Voraussetzungen |

## Fachlicher Abgleich

Die Beispiele sind eigenständig formuliert und stimmen mit den bereits vorhandenen Lösungsrezepten überein. Für den Abgleich wurden die bereitgestellten Vorlesungsunterlagen gelesen:

- TGI_01_Einfuehrung: formale Grundlagen und Sprachhierarchie.
- TGI_02_01_RegulaereSprachen: RegEx, NEA, ε-Hülle und Potenzmenge.
- TGI_02_02_RegulaereSprachen: Minimierung, Grammatiken und Grenzen regulärer Sprachen.
- TGI_03_KontextfreieSprachen: CNF, Syntaxbäume, CYK und Kellerautomaten.
- TGI_04_KontextsensitiveSprachen: Turingmaschinen und Konfigurationen.
- TGI_05_NPVollstaendigeProbleme: Clique, Zertifikate und Reduktionen.
- TGI_06_Entscheidbarkeit: Entscheider, Semi-Entscheider und Rice.

Die Original-PDFs werden nicht in das öffentliche Repository kopiert.

## Validierung

`tests/learning-visuals.test.js` prüft die vollständige Themenabdeckung, gültige Wochenlinks, alle Bildschritte, Tastaturfokus, Wort-/Tabellenbeispiele und den Offline-Eintrag. Der bestehende App-DOM-Test prüft die echte Ereignissteuerung in Lektionen und späteren Themen sowie unveränderte Lerndaten.

Die SVG-Grafiken wurden separat gerendert und visuell auf lesbare Beschriftungen und überlappende Elemente kontrolliert. Ein vollständiger Browser-Screenshot-Test war in dieser Umgebung wegen eines fehlgeschlagenen Chromium-Downloads nicht möglich. Die DOM-Tests ersetzen keinen Test auf einem echten Mobilgerät.
