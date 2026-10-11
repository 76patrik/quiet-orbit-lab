import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

test('Lernpfad tabs „Aufgaben“ and „Altklausur“ open task pages with step-by-step solutions',async t=>{
 const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://orbit.test/quiet-orbit-lab/#path/2',pretendToBeVisual:true});
 const w=dom.window,old=new Map(),intervals=[];
 for(const [key,value] of Object.entries({window:w,document:w.document,location:w.location,navigator:w.navigator,Event:w.Event,matchMedia:()=>({matches:true})})){
  old.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 }
 w.scrollTo=()=>{};const realInterval=globalThis.setInterval;
 globalThis.setInterval=(...args)=>{const id=realInterval(...args);intervals.push(id);return id;};
 t.after(()=>{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;w.close();for(const [key,d] of old){if(d)Object.defineProperty(globalThis,key,d);else delete globalThis[key];}});
 await import('../src/app.js');
 const doc=w.document,el=s=>{const node=doc.querySelector(s);assert.ok(node,s);return node;};
 const settle=async()=>{await new Promise(r=>setTimeout(r,0));await new Promise(r=>setTimeout(r,0));};
 const click=async s=>{el(s).click();await settle();};
 const go=async hash=>{w.location.hash=hash;await settle();};
 const before=w.localStorage.getItem('orbit-progress-v1');

 // Die Wochenansicht bleibt unverändert, die neuen Reiter stehen davor.
 assert.equal(el('[data-week="2"]').getAttribute('aria-pressed'),'true');
 assert.deepEqual([...doc.querySelectorAll('.week-tabs .wt-tab')].map(a=>a.textContent),['Aufgaben','Altklausur']);
 assert.equal(doc.querySelectorAll('.card.unit .lesson-tile').length,6);

 await click('.week-tabs a[href="#path/altklausur"]');
 assert.equal(w.location.hash,'#path/altklausur');
 assert.match(el('h1').textContent,/Altklausur/);
 assert.equal(el('.wt-tab.active').getAttribute('aria-current'),'page');
 assert.equal(doc.querySelectorAll('[data-week][aria-pressed="true"]').length,0);
 assert.equal(doc.querySelectorAll('.wt-tile-link').length,6);
 assert.match(doc.title,/Altklausur/);

 await click('a[href="#path/altklausur/ak-4"]');
 assert.match(el('h1').textContent,/Reguläre Sprachen/);
 assert.ok(el('.wt-task svg[role="img"] desc').textContent.includes('q0'));
 assert.equal(doc.querySelectorAll('.wt-part').length,3);
 assert.equal(doc.querySelector('.wt-answer'),null,'Lösung bleibt bis zur eigenen Entscheidung verborgen');

 el('#wt-part-ak-4-0-note').value='erst ε, dann a';
 await click('#wt-part-ak-4-0 [data-action="wt-reveal"]');
 assert.match(el('#wt-part-ak-4-0 .wt-mynote').textContent,/erst ε, dann a/);
 assert.match(el('#wt-part-ak-4-0 .wt-step-count').textContent,/Schritt 1 von 7/);
 assert.ok(el('#wt-part-ak-4-0 [data-step="-1"]').disabled,'Zurück ist am Anfang gesperrt');
 await click('#wt-part-ak-4-0 .wt-controls [data-step="1"]');
 assert.match(el('#wt-part-ak-4-0 .wt-step-count').textContent,/Schritt 2 von 7/);
 assert.equal(doc.activeElement.getAttribute('data-step'),'1');
 await click('#wt-part-ak-4-0 .wt-stepnav [data-step="7"]');
 assert.match(el('#wt-part-ak-4-0 .wt-answer').textContent,/\{q0, q2\}/);
 await click('#wt-part-ak-4-0 [data-action="wt-all"]');
 assert.equal(doc.querySelectorAll('#wt-part-ak-4-0 .wt-step-all').length,8);

 // Teil b zeigt die korrigierte Grammatik und die Warnung.
 await click('#wt-part-ak-4-1 [data-action="wt-reveal"][data-unsure]');
 assert.match(el('#wt-part-ak-4-1 .wt-mynote').textContent,/weiß ich nicht/);
 await click('#wt-part-ak-4-1 .wt-stepnav [data-step="3"]');
 assert.match(el('#wt-part-ak-4-1 .wt-warning').textContent,/A → aA \| #Y/);

 await click('a[href="#path/altklausur/ak-5"]');
 assert.match(el('h1').textContent,/Turingmaschinen/);
 await go('#path/aufgaben/au-19');
 assert.match(el('h1').textContent,/Graphenprobleme/);
 assert.ok(el('.wt-warning-top'));
 await go('#path/aufgaben/ak-1');
 assert.match(el('h1').textContent,/Hier ist noch kein Lernpfad/);
 await go('#path/aufgaben');
 assert.equal(doc.querySelectorAll('.wt-tile-link').length,24);

 assert.equal(w.localStorage.getItem('orbit-progress-v1'),before,'Lesen und Lösungswege verändern den Lernstand nicht');
});
