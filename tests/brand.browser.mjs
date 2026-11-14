import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base=process.env.LP_TEST_URL || 'http://127.0.0.1:4179';
assert.ok(/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base),'Use a local test server');
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 for(const locale of ['en','ja']) {
  for(const width of [1440,1024,768,390,375,320]) {
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+(locale==='ja'?'/ja/':'/'),{waitUntil:'networkidle'});
   await page.locator('header img').waitFor();
   assert.equal(await page.title().then(t=>t.startsWith('Stockwise')),true);
   assert.equal(await page.locator('img[alt="Stockwise"]').count(),3);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${locale} ${width}: document overflow`);
   const hero=await page.locator('header img').boundingBox();assert.ok(hero.width>=180&&hero.height>=35);
   const footer=await page.locator('footer').count();assert.equal(footer,1);
   const cta=page.locator('footer a.bottom-cta');await cta.scrollIntoViewIfNeeded();assert.ok(await cta.isVisible());assert.equal(await cta.getAttribute('href'),'https://stockwise-app-1qz9.vercel.app');
   await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth===584));
   const box=await cta.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width);
   if(width===1440||width===375) {await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`artifacts/${locale}-${width}.png`,fullPage:true});}
   assert.deepEqual(errors,[]);console.log(`PASS ${locale} ${width}px: identity, assets, overflow, footer, CTA`);
   await page.close();
  }
 }
} finally {await browser.close();}
