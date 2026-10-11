# Kapitelbreite auf Laptop-Bildschirmen

11.10.2026, Nachbesserung auf Basis des gemergten PR #17.

Im Browser bei 1366 × 768 war die Reiterleiste nach rechts abgeschnitten. Ihre späteren Wochen lagen im horizontalen Scrollbereich. Die Kapitel selbst waren außerdem auf 980 px begrenzt und nutzten den verfügbaren Inhaltsbereich nicht vollständig.

Die Reiter brechen auf Desktop/Laptop nun um; die beiden Sammlungen und die Wochen sind vollständig erreichbar. Kapitel nutzen die verfügbare Inhaltsbreite. Die Inhaltsfläche ist ausdrücklich auf 100 % ihres Containers begrenzt. Breite Fachgrafiken und Tabellen behalten ihre eigenen Scrollbereiche. Offline-Cache auf Version 24 angehoben.

## Prüfung

- Echter Headless-Chromium-Browser: alle 30 Aufgaben-/Altklausurkapitel bei 1440, 1366, 1280, 1024, 820 und 390 px Breite, jeweils mit geschlossenen und vollständig geöffneten Lösungswegen: 360 Zustände erfolgreich.
- Geprüft: keine horizontale Verbreiterung der Seite, Karten und Abschluss-/Weiterbuttons innerhalb des Bildschirms, auf Desktop sämtliche Reiter innerhalb des Bildschirms. Mobile Reiter bleiben seitlich scrollbar.
- Vorher-/Nachher-Screenshot bei 1366 × 768 visuell geprüft.
- 131 Funktionstests erfolgreich; Build und git diff --check erfolgreich.

Reproduzierbarer Browsertest: `node scripts/check-chapter-layout.mjs` mit installiertem Playwright/Chromium. Alternativ Pfade über `PLAYWRIGHT_MODULE` und `BROWSER_EXECUTABLE` angeben. Diese Prüfung betrifft Kapitel und deren Navigation, nicht sämtliche anderen App-Ansichten oder jedes physische Gerät.
