// Vertiefende Erklärung direkt in der Aufgabe: der passendste Abschnitt aus der Lektion
// (bzw. Grundidee und Vorgehen eines späteren Themas), dazu Beispiel und Stolperstelle.
import { topicById } from './curriculum.js';

// Wortstämme (erste sechs Zeichen), damit „vollständige“ und „vollständig“ zusammenpassen.
const words = text => new Set((String(text).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}εσδ∅]{4,}/gu) || []).map(w => w.slice(0, 6)));
const overlap = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n; };

export function explainFor(question) {
  const topic = topicById[question.lesson];
  if (!topic) return null;
  const asked = words(`${question.prompt} ${question.explanation || ''}`);
  let blocks, more = [];
  if (topic.sections) {
    const ranked = topic.sections.map(([title, text], i) => ({title, text, i, score: overlap(asked, words(`${title} ${text}`))}))
      .sort((a, b) => b.score - a.score || a.i - b.i);
    blocks = [{title: ranked[0].title, text: ranked[0].text}];
    more = ranked.slice(1).sort((a, b) => a.i - b.i).map(({title, text}) => ({title, text}));
  } else {
    blocks = [{title: 'Grundidee', text: topic.intro}, {title: 'Vorgehen', text: topic.steps.map((s, i) => `${i + 1}. ${s}`).join(' ')}];
  }
  const example = Array.isArray(topic.example) ? {title: `Beispiel: ${topic.example[0]}`, text: topic.example[1]} : {title: 'Beispiel', text: topic.example};
  return {topic: topic.title, source: topic.source, blocks: [...blocks, example, {title: 'Genau hinschauen', text: topic.trap}], more};
}
