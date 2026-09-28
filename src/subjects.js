// Orbit ist ein Lernstudio für mehrere Fächer. Fächer ohne Lernmaterialien
// bekommen nur Termin und Countdown, keine erfundenen Lektionen oder Aufgaben.
export const subjects = [
 {id:'ti',title:'Theoretische Informatik',short:'TI',examDate:'2026-11-20',status:'active',
  summary:'Automaten, formale Sprachen, Berechenbarkeit und Komplexität.',
  note:'Woche 1 und 2 sind als interaktiver Lernpfad verfügbar: 25 Lektionen mit Übungen, Abschlusshaken und Wochenchecks. Wochen 3–9 bleiben im Lernplan.'},
 {id:'fire',title:'Finanzierung und Rechnungswesen',short:'FiRe',examDate:'2026-11-27',status:'pending',
  summary:'Lernmaterialien folgen.',
  note:'Das Fach ist angelegt. Lektionen und Aufgaben entstehen erst, wenn deine Unterlagen vorliegen.'},
 {id:'vwl',title:'Mikro- und Makroökonomik',short:'VWL',examDate:'2026-12-02',status:'pending',
  summary:'Lernmaterialien folgen.',
  note:'Das Fach ist angelegt. Lektionen und Aufgaben entstehen erst, wenn deine Unterlagen vorliegen.'}
];
export const subjectById = Object.fromEntries(subjects.map(s=>[s.id,s]));
export const defaultExamDates = () => Object.fromEntries(subjects.filter(s=>s.id!=='ti').map(s=>[s.id,s.examDate]));
// Theoretische Informatik nutzt weiterhin state.examDate, damit ältere Sicherungen gültig bleiben.
export const examDateOf = (state,id) => id==='ti' ? state.examDate : (state.examDates?.[id] || subjectById[id].examDate);
export const daysUntil = (day,from) => Math.round((Date.parse(day+'T12:00:00Z')-Date.parse(from+'T12:00:00Z'))/86400000);
export function examSchedule(state,from) {
  return subjects.map(s=>({...s,examDate:examDateOf(state,s.id),days:daysUntil(examDateOf(state,s.id),from)}))
    .sort((a,b)=>a.examDate.localeCompare(b.examDate)||subjects.indexOf(subjectById[a.id])-subjects.indexOf(subjectById[b.id]));
}
export const nextExam = (state,from) => examSchedule(state,from).find(s=>s.days>=0) || null;
