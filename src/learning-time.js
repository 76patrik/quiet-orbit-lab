// Planning estimates, not measured personal learning speeds.
const intensive=new Set(['dfa','parity','alternate','complement','hierarchy','nea','epsilon','determinize','minimize','regular-grammar','kleene']);
export function lessonTime(lesson){const intro=lesson.minutes,extra=intensive.has(lesson.id)?[25,45]:[15,30];return {intro,min:intro+extra[0],max:intro+extra[1]};}
export const lessonTimeLabel=l=>{const t=lessonTime(l);return `ca. ${t.min}–${t.max} Min. mit Übungen (Schätzung)`;};
export function createActivityClock(now){return {last:now,elapsed:0,active:false};}
export function tickActivityClock(clock,now,active){if(clock.active)clock.elapsed+=Math.max(0,now-clock.last);clock.last=now;clock.active=active;return Math.min(86400,Math.round(clock.elapsed/1000));}
