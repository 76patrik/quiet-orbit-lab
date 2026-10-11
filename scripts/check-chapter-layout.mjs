// Optional real-browser regression: install Playwright, or provide PLAYWRIGHT_MODULE
// and BROWSER_EXECUTABLE for an existing Chromium installation.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {taskById} from '../src/walkthroughs.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const port=process.env.LAYOUT_PORT||'4179';
const server=spawn(process.execPath,['scripts/serve.mjs'],{
 cwd:fileURLToPath(new URL('..',import.meta.url)),env:{...process.env,PORT:port},stdio:['ignore','pipe','inherit']
});
let browser;
try{
 await once(server.stdout,'data');
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage();
 let checks=0;
 for(const width of [1440,1366,1280,1024,820,390]){
  await page.setViewportSize({width,height:768});
  for(const task of Object.values(taskById)){
   await page.goto(`http://localhost:${port}/#path/${task.set}/${task.id}`);
   await page.locator('.wt-task').waitFor();
   await page.emulateMedia({reducedMotion:'reduce'});
   for(const mode of ['closed','expanded']){
    if(mode==='expanded'){
     await page.locator('[data-action="wt-reveal"]:not([data-unsure])').evaluateAll(nodes=>nodes.forEach(n=>n.click()));
     await page.locator('[data-action="wt-all"]').evaluateAll(nodes=>nodes.forEach(n=>n.click()));
    }
    const result=await page.evaluate(()=>{
     const outside=e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5;};
     return {
      width:innerWidth,scroll:document.documentElement.scrollWidth,
      clippedCards:[...document.querySelectorAll('.wt-task,.wt-task>.card,.wt-completion .btn,.wt-pager .btn')].filter(outside).map(e=>e.className),
      clippedTabs:innerWidth>720?[...document.querySelectorAll('.week-tabs button,.week-tabs a')].filter(outside).map(e=>e.textContent):[]
     };
    });
    const label=`${task.id} ${width}px ${mode}`;
    assert.ok(result.scroll<=width+1,`${label}: page overflows ${result.scroll-width}px`);
    assert.deepEqual(result.clippedCards,[],`${label}: clipped chapter`);
    assert.deepEqual(result.clippedTabs,[],`${label}: clipped desktop tabs`);
    checks++;
   }
  }
  console.log(`All task and past-exam chapters fit at ${width}px.`);
 }
 console.log(`${checks} chapter states checked in Chromium.`);
}finally{await browser?.close();server.kill();}
