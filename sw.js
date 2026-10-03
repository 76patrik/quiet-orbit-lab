const CACHE='orbit-static-v19';
const FILES=['./src/nfa-feedback.js','./src/week2-learning-support.js','./src/learning-method-models.js','./src/learning-time.js','./src/learning-contracts.js','./src/learning-evidence.js','./src/learning-workshop.js','./src/learning-next.js','./src/learning-visuals.js','./src/dfa-feedback.js','./src/dfa-view.js','./assets/Lernskript_Woche_1_Theoretische_Informatik.pdf','./src/path-view.js','./src/week2-lessons.js','./src/week2-content.js','./src/week2-models.js','./src/week2-questions.js','./src/week2-exam.js','./src/week2-view.js','./assets/Lernskript_Woche_2_Theoretische_Informatik.pdf','./','./index.html','./styles.css','./src/app.js','./src/curriculum.js','./src/engine.js','./src/progress.js','./src/subjects.js','./src/games.js','./src/guide.js','./src/explain.js','./src/lesson-guides.js','./src/lesson-guide-view.js','./src/topics.js','./src/algorithms.js','./src/practice-bank.js','./src/practice.js','./src/practice-view.js','./src/training-hints.js','./src/training-view.js','./src/exams.js','./src/exam-engine.js','./src/exam-view.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('orbit-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Network first keeps online lessons up to date. Cached application files enable offline navigation.
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok&&FILES.some(p=>new URL(p,self.registration.scope).href===url.href)){
      const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));
    }
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
