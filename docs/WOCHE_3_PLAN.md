# Woche 3: Grenzen, Syntaxbäume und CNF

Stand: 07.10.2026. Umgesetzt als vollständiger interaktiver Wochenkurs mit vier Lektionen, 41 neuen Kurzaufgaben, vier Eigenaufträgen, Schrittgrafiken, 29-seitigem PDF-Skript und digitalem Wochencheck. Der konkrete Ablauf ist unter Woche 3 sichtbar. Grundlage: `LERNPFAD_REGELN.md`.

## Zeit und Reihenfolge

05.–11.10., 480 Minuten: Mo 75 Grenzen, Di 75 Pumping, Mi frei/Puffer, Do 75 Syntaxbäume, Fr 75 CNF, Sa zweimal 75 Übung und Wochencheck, So 30 Wiederholung. Bei späterem Start die Reihenfolge verschieben; keine bereits absolvierte Einheit voraussetzen. Pausen zusätzlich. Wiederholung nach 1/3/7/14 Tagen innerhalb der Lernzeit.

## Quellenprüfung (PDF-Seiten)

- Masterplan_Theoretische_Informatik_20-11-2026(1).pdf: S. 2–4, 5–8. Aufgaben 9, 11, 15, 17; zwei CNF-Umformungen als Nachweis.
- TGI_02_02_RegulaereSprachen.pdf: S. 70–81, Grenzen und Pumping.
- TGI_03_KontextfreieSprachen.pdf: S. 7–10 Grammatik, 12–15 Syntaxbaum/Mehrdeutigkeit, 17–33 CNF. Aufgedruckte Foliennummern entsprechen hier den PDF-Seiten.
- Aufgaben (1).pdf: S. 9, 11, 15, 17. Aufgabe 15 umfasst auch CYK/NPDA/DPDA: diese Woche Überblick, nächste Woche Verfahren.
- Aufgaben_Loesungen.pdf: S. 11 (A9), 13 (A11), 17 (A15), 19–21 (A17).
- Altklausur.pdf: Aufgabe 5b, PDF-S. 10: Syntaxbaumformat. Aufgabe 17 überschneidet sich damit; für den unabhängigen Check neue Wörter verwenden. Keine Prognose der Klausuraufgaben.
- Prüfungsmitteilung im Masterplan S. 8: Anwendung, CNF und anschauliche Grenzen regulärer Sprachen priorisieren; Pumping als kurze formale Ergänzung.

## Fachliche Korrekturen

**Aufgabe 11b, Lösungs-PDF S. 13:** L2 ist regulär. Vier Zustände (Parität von a, Parität von b), Start (gerade, gerade), einzig akzeptierend (gerade, ungerade). a kippt die erste, b die zweite Parität; c ist eine Schleife. ε wird abgelehnt. Der behauptete Pumping-Widerspruch gilt nicht für jede erlaubte Zerlegung: ein gerades Pumpstück aus a erhält die Parität. Aufgabe 9: Ein DEA kann begrenzt und modulo zählen; „kann nicht zählen“ ist zu pauschal.

**CNF, Folie/PDF-S. 33:** S′ → S ist noch eine Kettenregel. Für strenge CNF kopiert man die Nicht-Kettenregeln von S zu S′, entfernt S′ → S und behält S′ → ε genau dann, wenn die ursprüngliche Sprache ε enthält. S′ darf nie rechts vorkommen. CNF impliziert keine Eindeutigkeit.

## Spezifikation der späteren Lektionen

| Einheit | Wissen frei abrufen | Selbst rechnen | Begründen | Geplante Grafik |
|---|---|---|---|---|
| Grenzen | endlicher Speicher, modulo vs. unbeschränkter Vergleich | Paritäts-DEA für A11b | warum 0ⁿ1ⁿ nicht mit endlich vielen Zuständen geht | vier Paritätszustände; unterscheidbare Präfixe |
| Pumping | Quantoren und drei Bedingungen | Widerspruch für aⁿbⁿ, dann A11a | jede erlaubte Zerlegung statt einer gewählten | Wortbalken x/y/z mit markierter Pumpzone |
| Syntaxbäume | Terminal, Variable, Ableitung, Mehrdeutigkeit | Baum und zwei Linksableitungen | gleiches Wort, unterschiedliche Baumstruktur | zwei nebeneinander stehende Bäume, Blätter ablesen |
| CNF | A→BC, A→a, ε-Ausnahme | zwei vollständige Umformungen | jede Phase erhält die Sprache inkl. ε | Regeltabelle vor/nach jedem Schritt; binärer Baum |

Vorwissen: `#lesson/parity`, `#lesson/grammar`, `#lesson/empty`; Übungsräume: `#topic/pumping`, `#topic/cnf`; anschließend `#path/4`.

### Beispiele und neue Varianten

- Gemeinsam Grenzen/Pumping: L={aⁿbⁿ:n≥0}, Wort aᵖbᵖ. Für jede erlaubte Zerlegung liegt y nur im a-Block, |y|>0; i=0 zerstört die Gleichheit. Neue Variante: {aⁿb²ⁿ:n≥0}, Wort aᵖb²ᵖ; gleicher vollständiger Quantorenweg.
- Gemeinsam Baum: E→E+E|E*E|a, Wort a+a*a, Strukturen a+(a*a) und (a+a)*a. Neu: a*a+a sowie drei Summanden. Unterschiedliche Ersetzungsreihenfolge allein ist kein Mehrdeutigkeitsbeweis.
- Gemeinsam CNF: S→aSb|ε. Eine Zielgrammatik: S0→AC|AB|ε; S→AC|AB; C→SB; A→a; B→b. Start S0. Alle Variablen sind S0,S,C,A,B; Terminalalphabet {a,b}. Sprache aⁿbⁿ, n≥0.
- Neue CNF-Variante: S→aSbb|ε. Ziel: S0→AC|AD|ε; S→AC|AD; C→SD; D→BB; A→a; B→b. Start S0. Sprache aⁿb²ⁿ, n≥0.
- Zweite Check-Variante mit Kettenregel: S→A|b; A→aAb|ε. Ziel: S0→TC|TB|b|ε; A→TC|TB; C→AB; T→a; B→b. Start S0. Sprache {aⁿbⁿ:n≥0} ∪ {b}.

Diese Vergleichslösungen stehen nur in der Planungsdokumentation. Im späteren Lernkurs erst nach eigener Eingabe aufdecken. Bei der CNF erst nullable Variablen bestimmen und ε absichern, dann ε-/Kettenregeln entfernen, Terminale auslagern, lange Regeln binarisieren. Andere sprachäquivalente korrekte Reihenfolgen zulassen.

### Abnehmende Hilfe und Nachweise

Je Thema: vollständiges gemeinsames Beispiel → Schritte mit Lücken → nur Startschritt → neue Aufgabe ohne Hilfe. Zwei Hinweise: zuerst Verfahrenswahl, dann nächster lokaler Schritt; keine vollständige Lösung im Hinweis. Wissen, Anwenden, Begründen getrennt erfassen. Freie Beweise, Bäume und Grammatiken ausdrücklich selbst bewerten; kurze Worttests sind keine vollständige Äquivalenzprüfung.

Wochencheck auf Papier: 50 Min. bearbeiten + 25 Min. selbst korrigieren, 20 Punkte:

- Speicherargument 3: unbeschränkter Vergleich, endliche Zustände, Abgrenzung zu modulo je 1.
- Pumping 3: Wortwahl nach p, alle zulässigen Zerlegungen, Pumpfaktor/Widerspruch je 1.
- Baum/Mehrdeutigkeit 4: zwei regelkonforme Bäume je 1, identisches Blattwort 1, Unterschied der Struktur begründet 1.
- Zwei neue kleine CNF-Aufgaben je 5: ε/Start 1, ε- und Kettenelimination 1, Terminalersetzung/Binarisierung 1, vollständige zulässige Zielregeln 1, Spracherhaltung/Randfälle erklärt 1.

Ziel mindestens 16/20 als eigene Trainingsmarke; beide CNF-Aufgaben bearbeiten. Bei Fehlern: Kategorie, persönliche Korrekturregel, neue Variante und späterer Abruf. Lesen vergibt keine XP.

## Umsetzung und Abnahme

Alle vier Lektionen nutzen den gemeinsamen Renderer und die drei Übungsformate Wissen, Anwenden und Begründen. Die Eigenaufträge besitzen unterschiedliche Vergleichsgrafiken; die Lösungen erscheinen im Übungsraum erst nach eigener Antwort. Das PDF und der HTML-Leser sind direkt im Lernpfad erreichbar. Der digitale Wochencheck umfasst 20 Punkte (4 automatisch, 16 Selbstbewertung): Grundlagen 4, Speicherargument 1, Pumping 2, Syntaxbäume 3 und zwei CNF-Umformungen je 5. Er ersetzt das oben ursprünglich vorgeschlagene reine Papierraster; Zeichnungen und längere Rechnungen können weiterhin auf Papier erfolgen.

Fehlerhilfen enthalten gesicherte Abweichungen, konkrete Rechenschritte und eine unterstützte Miniübung. Lernstände und vorhandene IDs bleiben bestehen. Prüfdetails in `WOCHE3_KLAUSURZEICHEN_PRUEFUNG.md`.

PDF reproduzieren: `node scripts/export-week3.mjs`, danach `python3 scripts/build-week3-pdf.py` (ReportLab und DejaVu-Schriften erforderlich).
