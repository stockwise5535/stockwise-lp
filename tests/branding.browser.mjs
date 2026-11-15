import{createRequire}from'node:module';import{mkdir}from'node:fs/promises';import assert from'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base='http://127.0.0.1:4181';await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{for(const locale of ['','en','ja','zh-cn','zh-tw'])for(const width of [1440,1024,768,390,375,320]){
 const page=await browser.newPage({viewport:{width,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==base)return route.abort();if(u.pathname.endsWith('/demo.mov'))return route.abort();return route.continue();});
 await page.goto(base+'/'+(locale?locale+'/':''),{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('.brand img').complete&&document.querySelector('.brand img').naturalWidth===584);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${locale||'root'} ${width}: overflow`);
 assert.match(await page.title(),/^Stockwise/);assert.doesNotMatch(await page.locator('body').innerText(),/MIERUKA/);
 for(const selector of ['.brand img','.menu .cta','.lang-select']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.x+b.width<=width,`${locale} ${width}: ${selector}`);}
 assert.equal(await page.locator('video source').count(),2);assert.match(await page.locator('video').getAttribute('poster'),/video-poster.png/);
 assert.equal(await page.locator('.lang-select option').count(),4);
 if(['en','ja'].includes(locale)&&[1440,375].includes(width))await page.screenshot({path:`artifacts/${locale}-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);console.log(`PASS ${locale||'root'} ${width}px`);await page.close();
}}finally{await browser.close();}
