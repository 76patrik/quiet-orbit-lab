import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {questions,questionById,week1Lessons,week1Units,lessonsOfWeek,unitsOfWeek,achievements} from '../src/curriculum.js';
import {week2TopicGroup} from '../src/week2-lessons.js';
import {blankState,recordAnswer,validateImport,lessonProgress,updateBadges,completeLesson} from '../src/progress.js';
import {cardById,bossPool,blitzPool} from '../src/games.js';

test('week-two lesson grouping preserves all 93 exercises and the original four badge topics',()=>{
 const lessons=lessonsOfWeek(2),pools=lessons.map(l=>questions.filter(q=>q.lesson===l.id));
 assert.equal(lessons.length,6);assert.equal(unitsOfWeek(2).length,3);
 assert.equal(pools.flat().length,93);assert.equal(new Set(pools.flat().map(q=>q.id)).size,93);
 for(const pool of pools)assert.ok(pool.length>=8);
 assert.equal(questionById['wk2-suffix-word-3'].lesson,'nea');
 assert.equal(questionById['wk2-closure-0'].lesson,'epsilon');
 assert.equal(questionById['variant-subset-4-0'].lesson,'determinize');
 assert.equal(pools.flat().filter(q=>week2TopicGroup(q.lesson)==='nea').length,49);
 for(const u of unitsOfWeek(2))assert.deepEqual(new Set(bossPool(u.id).map(q=>q.lesson)),new Set(u.lessons));
 assert.ok(blitzPool().every(q=>week1Lessons.some(l=>l.id===q.lesson)));
});

test('old week-two evidence, cards and reading marks survive the new lesson grouping',()=>{
 const old=blankState(),day='2026-09-28';
 const closure=questions.filter(q=>q.lesson==='epsilon').slice(0,7);
 for(const q of closure)recordAnswer(old,q.id,true,{day});
 // The previous release saved these same question IDs, but had no week-two lessons.
 delete old.completed.epsilon;delete old.awards['lesson:epsilon'];
 old.week2={read:['epsilon','potenzmenge'],lastChapter:'epsilon'};
 for(const id of ['nea:idea','nea:steps','nea:trap','minimize:idea','regular-grammar:steps','kleene:trap']){
  assert.ok(cardById[id]);old.cards[id]={box:2,due:'2026-10-01',first:day,seen:3};
 }
 const copy=validateImport(JSON.parse(JSON.stringify(old)));
 assert.deepEqual(copy.results,old.results);assert.deepEqual(copy.cards,old.cards);assert.deepEqual(copy.week2,old.week2);
 assert.equal(copy.completed.epsilon,day);assert.deepEqual(copy.awards['lesson:epsilon'],{xp:25,date:day});
 assert.deepEqual(validateImport(copy),copy,'migration cannot duplicate completion rewards');
 const mixed=blankState();
 for(const id of ['wk2-suffix-word-0','wk2-closure-0','wk2-closure-1','wk2-closure-2','wk2-suffix-reachable','wk2-original6-reachable','wk2-nea-size'])recordAnswer(mixed,id,true,{day});
 const legacyBadge=achievements.find(a=>a.id==='week2-skills');
 for(const topic of ['minimize','regular-grammar','kleene'])for(const q of questions.filter(q=>q.lesson===topic).slice(0,7))recordAnswer(mixed,q.id,true,{day});
 assert.ok(legacyBadge.rule(mixed),'old badge still aggregates all NEA-related evidence');
 assert.equal(mixed.completed.nea,undefined);assert.equal(mixed.completed.epsilon,undefined);
});

test('all six lesson checkmarks need seven independent answers and stay separate from week one',()=>{
 const s=blankState(),day='2026-09-28';s.week2.read=['grundlagen','nea','epsilon','potenzmenge','minimierung','grammatik','kleene'];
 updateBadges(s,day);assert.deepEqual(s.completed,{});
 for(const l of lessonsOfWeek(2)){
  const pool=questions.filter(q=>q.lesson===l.id);
  for(const q of pool.slice(0,6))recordAnswer(s,q.id,true,{day});
  recordAnswer(s,pool[6].id,true,{assisted:true,day});assert.equal(s.completed[l.id],undefined);
  recordAnswer(s,pool[6].id,true,{day});assert.equal(s.completed[l.id],day);
  recordAnswer(s,pool[0].id,true,{day});assert.equal(s.awards['lesson:'+l.id].xp,25);
  assert.equal(lessonProgress(s,l.id).remaining,0);
 }
 assert.equal(Object.keys(s.completed).length,6);assert.ok(!s.badges.includes('all'));
 assert.equal(week1Lessons.filter(l=>s.completed[l.id]).length,0);
 assert.deepEqual(validateImport(JSON.parse(JSON.stringify(s))),s);
 for(const l of week1Lessons)completeLesson(s,l.id,day);
 assert.ok(s.badges.includes('all'),'the original 19-lesson milestone still works with week-two completions');
 s.bosses=Object.fromEntries(week1Units.map(u=>[u.id,day]));updateBadges(s,day);
 assert.ok(s.badges.includes('bossall'),'the five original bosses keep their milestone');
});

test('shared path and new lesson definitions are available in the offline app',async()=>{
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const file of ['src/path-view.js','src/week2-lessons.js','assets/Lernskript_Woche_1_Theoretische_Informatik.pdf','assets/Lernskript_Woche_2_Theoretische_Informatik.pdf']){
  assert.ok(sw.includes(`'./${file}'`));await access(new URL('../'+file,import.meta.url));
 }
});
