import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root = new URL('../',import.meta.url), read = p => readFile(new URL(p,root));
for(const [locale,page] of [['en','index.html'],['ja','ja/index.html']]) {
 test(`${locale}: customer-facing identity, metadata and destinations`,async()=>{
  const html=(await read(page)).toString();
  assert.equal(/MIERUKA|在庫\s*wise/i.test(html),false);
  assert.equal(html.includes("StockWise"),false);
  assert.match(html,new RegExp(`<html lang="${locale}">`));
  assert.match(html,/<title>Stockwise — /);
  assert.equal((html.match(/src="\/assets\/stockwise-logo.png"/g)||[]).length,3);
  assert.match(html,/<header class="logo-row">/);assert.match(html,/<footer class="bottom-strip"/);
  assert.match(html,/<link rel="icon" href="\/favicon.svg"/);
  for(const property of ['og:title','og:site_name','og:image','og:image:alt']) assert.match(html,new RegExp(`property="${property}" content="[^\"]*Stockwise|property="${property}" content="https://stockwise-homepage\\.vercel\\.app/assets/social-preview\\.png"`));
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
  assert.match(html,/href="https:\/\/stockwise-app-1qz9.vercel.app"/);
  assert.doesNotMatch(html,/<script\b/i); // No new tracking or external execution.
 });
}
test('favicon and social preview use the same V3 logo, not the old app icon',async()=>{
 const logo=await read('assets/stockwise-logo.png');
 assert.equal(createHash('sha256').update(logo).digest('hex'),'ca2c4062eb34b20213caf9e2ef5fc24d298d31ae8cda3416ea8c279895a17abd');
 for(const path of ['favicon.svg','assets/social-preview.svg']) assert.ok((await read(path)).toString().includes(logo.toString('base64')));
 const png=await read('assets/social-preview.png');assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});
