import test from 'node:test';
import assert from 'node:assert/strict';
import {level,rankFor,dailyQuests,questStatus,questPool,cards,cardDeck,cardsDue,NEW_CARDS_PER_DAY,bossPool,blitzPool,BOSS_XP,QUEST_XP} from '../src/games.js';
import {blankState,rateCard,recordCombo,recordBoss,recordBlitz,recordFocus,recordAnswer,xpTotal,validateImport,bestBlitz} from '../src/progress.js';
import {units,week1Lessons,allTopics,allQuestions} from '../src/curriculum.js';
test('levels and ranks grow with XP',()=>{
  assert.equal(level(0),1);assert.equal(level(149),1);assert.equal(level(150),2);assert.equal(rankFor(0),'Startrampe');assert.equal(rankFor(300),'Umlaufbahn');assert.equal(rankFor(1e6),'Sternenwanderer');
});
test('daily quests are three distinct, deterministic missions',()=>{
  for(let d=1;d<=28;d++){const day=`2026-10-${String(d).padStart(2,'0')}`,a=dailyQuests(day),b=dailyQuests(day);assert.deepEqual(a.map(q=>q.id),b.map(q=>q.id));assert.equal(new Set(a.map(q=>q.id)).size,3);}
  const seen=new Set();for(let d=1;d<=28;d++)dailyQuests(`2026-10-${String(d).padStart(2,'0')}`).forEach(q=>seen.add(q.id));assert.equal(seen.size,questPool.length);
});
test('completed quests award XP once per day and quest',()=>{
  const day='2026-09-28',s=blankState();assert.ok(dailyQuests(day).some(q=>q.id==='combo5'));
  recordCombo(s,4,day);assert.equal(xpTotal(s),0);recordCombo(s,5,day);recordCombo(s,7,day);assert.equal(xpTotal(s),QUEST_XP);
  assert.equal(questStatus(s,day).find(q=>q.id==='combo5').done,true);assert.equal(s.activity[day].combo,7);
});
test('flashcards come from every lesson and follow a Leitner schedule',()=>{
  assert.ok(allTopics.every(t=>cards.some(c=>c.lesson===t.id&&c.id.endsWith(':trap'))));assert.ok(cards.every(c=>c.front&&c.back));assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
  const s=blankState(),day='2026-09-26';const deck=cardDeck(s,day);assert.equal(deck.length,NEW_CARDS_PER_DAY);
  rateCard(s,deck[0].id,'good',day);assert.deepEqual([s.cards[deck[0].id].box,s.cards[deck[0].id].due],[1,'2026-09-27']);
  rateCard(s,deck[1].id,'again',day);assert.equal(s.cards[deck[1].id].due,day);rateCard(s,deck[2].id,'hard',day);assert.equal(s.cards[deck[2].id].due,'2026-09-27');
  assert.equal(cardsDue(s,day),1);assert.equal(cardDeck(s,day).length,1+NEW_CARDS_PER_DAY-3);assert.equal(s.activity[day].cards,3);
  assert.throws(()=>rateCard(s,'nope:1','good',day));assert.throws(()=>rateCard(s,deck[0].id,'perfect',day));
});
test('boss fights use their unit questions and reward the first win once',()=>{
  for(const u of units)assert.ok(bossPool(u.id).length>=5,u.id);
  const s=blankState(),withoutQuests=()=>Object.entries(s.awards).filter(([k])=>!k.startsWith('quest:')).reduce((n,[,a])=>n+a.xp,0);
  recordBoss(s,'muster',false,'2026-09-26');assert.equal(withoutQuests(),0);assert.ok(s.awards['quest:2026-09-26:boss'],'a lost fight still counts as a challenge');assert.equal(s.activity['2026-09-26'].boss,1);
  recordBoss(s,'muster',true,'2026-09-27');recordBoss(s,'muster',true,'2026-09-28');assert.equal(s.bosses.muster,'2026-09-27');assert.ok(s.badges.includes('boss1'));
  assert.equal(withoutQuests(),BOSS_XP);
});
test('blitz rounds keep records without changing review schedules',()=>{
  assert.ok(blitzPool().every(q=>q.type==='choice'||q.type==='number'));
  const fresh=blitzPool(),weekOne=new Set(week1Lessons.map(l=>l.id));assert.ok(fresh.length>0&&fresh.every(q=>weekOne.has(q.lesson)),'no unseen later topics');
  const later=allQuestions.find(q=>!weekOne.has(q.lesson)&&(q.type==='choice'||q.type==='number'));const seen=blankState();recordAnswer(seen,later.id,false,{day:'2026-09-26'});
  assert.ok(blitzPool(seen).some(q=>q.lesson===later.lesson));
  const s=blankState();recordAnswer(s,'m1',true,{day:'2026-09-26'});const before=structuredClone(s.results);
  recordBlitz(s,11,13,'2026-09-26');assert.deepEqual(s.results,before);assert.equal(bestBlitz(s),11);assert.ok(s.badges.includes('blitz10'));
});
test('new game state survives a backup roundtrip and rejects forged values',()=>{
  const s=blankState(),day='2026-09-28';rateCard(s,cards[0].id,'good',day);recordBoss(s,'bausteine',true,day);recordBlitz(s,3,5,day);recordCombo(s,6,day);recordFocus(s,1600,day);
  assert.deepEqual(validateImport(JSON.parse(JSON.stringify(s))),s);
  const old=blankState();delete old.cards;delete old.bosses;delete old.blitz;assert.deepEqual(validateImport(old).cards,{});
  for(const change of [x=>x.cards['nope:1']={box:1,due:day,first:day,seen:1},x=>x.cards[cards[0].id].box=9,x=>x.bosses.unknown=day,x=>x.blitz.push({date:day,score:9,answered:3}),x=>x.awards['boss:bausteine'].xp=500,x=>x.awards[`quest:${day}:unknown`]={xp:15,date:day},x=>x.activity[day].combo=-1]){const bad=structuredClone(s);change(bad);assert.throws(()=>validateImport(bad));}
});
