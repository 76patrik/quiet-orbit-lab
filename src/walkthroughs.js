// Zusammenstellung der beiden Lernpfad-Reiter „Aufgaben“ und „Altklausur“.
import {examUnits} from './walkthroughs-exam.js';
import {sheetUnits} from './walkthroughs-sheet.js';

export const walkthroughSets=[
 {key:'aufgaben',tab:'Aufgaben',badge:'Ü',eyebrow:'ÜBUNGSAUFGABEN MIT LÖSUNGSWEG',eyebrowShort:'ÜBUNGSAUFGABEN',heading:'Aufgaben verstehen',lead:'Jede Übungsaufgabe als eigener kleiner Lernpfad – mit Grafik, Hintergrundwissen und Lösungsweg zum Durchklicken.',
  introTitle:'Vom Aufgabenblatt zur Musterlösung',intro:['Hier findest du alle Aufgaben des Übungsblatts, nach Themen sortiert. Jede Aufgabe zeigt dir zuerst, was gegeben ist, dann das nötige Wissen und schließlich den Weg zur Lösung in kleinen Schritten.'],
  footnote:'Quelle: Aufgaben_Loesungen.pdf (Übungsaufgaben mit Musterlösungen). Aufgabentexte sinngemäß, alle Grafiken neu gezeichnet und nachgerechnet. Lesen und Lösungen ansehen vergeben keine XP und keine Lektionshaken.',
  units:sheetUnits},
 {key:'altklausur',tab:'Altklausur',badge:'AK',eyebrow:'ALTKLAUSUR MIT LÖSUNGSWEG',eyebrowShort:'ALTKLAUSUR',heading:'Altklausur Schritt für Schritt',lead:'Alle sechs Klausuraufgaben mit Punkteverteilung, Lösungsweg und Klausurtricks.',
  introTitle:'So sah eine echte Klausur aus',intro:['60 Punkte in sechs Aufgaben: Kurzfragen, Chomsky-Hierarchie, NP, reguläre Sprachen, Turingmaschinen und kontextfreie Sprachen. Die Altklausur zeigt Format und Niveau – sie ist keine Garantie für gleiche Aufgaben, Punkte oder Hilfsmittel.','Tipp: Bearbeite eine Aufgabe zuerst ohne Hilfe auf Papier und vergleiche dann Schritt für Schritt.'],
  footnote:'Quelle: Altklausur_Loesung.pdf. Punkte laut Musterlösung. Aufgabentexte sinngemäß, Grafiken neu gezeichnet und nachgerechnet. Lesen und Lösungen ansehen vergeben keine XP und keine Lektionshaken.',
  units:examUnits}
];
export const taskById={};
for(const set of walkthroughSets)for(const unit of set.units)for(const task of unit.tasks){
 if(taskById[task.id])throw new Error('Doppelte Aufgaben-ID '+task.id);
 task.set=set.key;taskById[task.id]=task;
}
