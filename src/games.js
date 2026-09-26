// Spielmodi: Ränge, Tagesmissionen, Karteikarten und Bosskämpfe.
// Reine Funktionen ohne Speicherzugriff, damit sie sich einzeln testen lassen.
import { lessons, units, questions } from './curriculum.js';

export const LEVEL_XP = 150;
export const level = xp => 1 + Math.floor(xp / LEVEL_XP);
export const ranks = ['Startrampe','Umlaufbahn','Mondlandung','Marsmission','Asteroidengürtel','Jupiterflug','Saturnring','Sternenwanderer'];
export const rankFor = xp => ranks[Math.min(ranks.length - 1, Math.floor((level(xp) - 1) / 2))];

// Tagesmissionen: drei pro Tag, für alle Geräte am selben Datum gleich.
export const QUEST_XP = 15;
export const questPool = [
 {id:'solve3',title:'Drei neue Treffer',description:'Löse heute 3 verschiedene Aufgaben ohne Hilfe.',target:3,icon:'target',value:a=>a.unique.length},
 {id:'combo5',title:'Fünferkette',description:'Schaffe in einer Runde 5 richtige Antworten in Folge.',target:5,icon:'flame',value:a=>a.combo||0},
 {id:'cards10',title:'Kartenstapel',description:'Gehe 10 Karteikarten durch.',target:10,icon:'layers',value:a=>a.cards||0},
 {id:'blitz',title:'Blitzstart',description:'Spiele eine Blitzrunde.',target:1,icon:'spark',value:a=>a.blitz||0},
 {id:'focus',title:'Tiefer Fokus',description:'Sammle 25 Minuten Fokuszeit.',target:1500,icon:'clock',value:a=>a.focus||0},
 {id:'boss',title:'Mutprobe',description:'Fordere einen Boss heraus.',target:1,icon:'shield',value:a=>a.boss||0}
];
export const questById = Object.fromEntries(questPool.map(q=>[q.id,q]));
export function dailyQuests(day) {
  let h = 2166136261;
  for (const c of day) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const pool = [...questPool], out = [];
  while (out.length < 3) { h = (Math.imul(h, 1103515245) + 12345) >>> 0; out.push(pool.splice(h % pool.length, 1)[0]); }
  return out;
}
export function questStatus(state, day) {
  const a = state.activity[day] || {unique:[]};
  return dailyQuests(day).map(q=>{const value=q.value(a);return {...q,progress:Math.min(q.target,value),done:value>=q.target};});
}

// Karteikarten entstehen aus den Lektionstexten: je Abschnitt eine Karte plus die Stolperstelle.
// Selbsteinschätzung zählt bewusst nicht als unabhängiger Kompetenznachweis.
export const cards = lessons.flatMap(l=>[
  ...l.sections.map(([front,back],i)=>({id:`${l.id}:${i+1}`,lesson:l.id,front,back})),
  {id:`${l.id}:trap`,lesson:l.id,front:'Worauf musst du hier genau achten?',back:l.trap}
]);
export const cardById = Object.fromEntries(cards.map(c=>[c.id,c]));
export const CARD_INTERVALS = [0,1,3,7,14,30];
export const NEW_CARDS_PER_DAY = 10;
export function cardDeck(state, day, limit = 15) {
  const due = cards.filter(c=>state.cards[c.id]&&state.cards[c.id].due<=day).sort((a,b)=>state.cards[a.id].due.localeCompare(state.cards[b.id].due));
  const introduced = Object.values(state.cards).filter(c=>c.first===day).length;
  const fresh = cards.filter(c=>!state.cards[c.id]).slice(0, Math.max(0, NEW_CARDS_PER_DAY - introduced));
  return [...due, ...fresh].slice(0, limit);
}
export const cardsDue = (state, day) => cards.filter(c=>state.cards[c.id]&&state.cards[c.id].due<=day).length;

// Bosskampf: bis zu zehn Aufgaben einer Einheit, drei Leben, keine Hinweise.
export const BOSS_LIVES = 3, BOSS_SIZE = 10, BOSS_XP = 75;
export const unitById = Object.fromEntries(units.map(u=>[u.id,u]));
export const bossPool = unitId => questions.filter(q=>unitById[unitId].lessons.includes(q.lesson));

// Blitzrunde: 60 Sekunden, nur schnell beantwortbare Aufgaben, keine Auswirkung auf Wiederholungen.
export const BLITZ_SECONDS = 60;
export const blitzPool = () => questions.filter(q=>q.type==='choice'||q.type==='number');
