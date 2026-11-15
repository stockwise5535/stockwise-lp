import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(x).digest('hex'),read=p=>readFile(new URL('../'+p,import.meta.url)),baseline=JSON.parse(await read('tests/fixtures/source-baseline.json'));
for(const [page,expected]of Object.entries(baseline.pages)) test(page+': exact original body except approved name/logo changes',async()=>{
 const html=(await read(page)).toString();assert.equal(/MIERUKA|在庫\s*wise/i.test(html),false);assert.equal(html.includes('StockWise'),false);
 assert.equal(hash(html.split('<body>')[1]),expected.bodyHash,'Unrelated content, links, scripts or video changed');
 assert.match(html,/<title>Stockwise/);assert.match(html,/<img src="\/assets\/stockwise-logo.png" alt="Stockwise"/);
 assert.match(html,/href="\/favicon.svg"/);assert.match(html,/property="og:image"/);assert.match(html,/name="twitter:card" content="summary_large_image"/);
});
test('existing routing, video poster and article artwork unchanged',async()=>{assert.equal(hash(await read('vercel.json')),baseline.routingHash);assert.equal(hash(await read('assets/video-poster.png')),baseline.posterHash);assert.equal(hash(await read('assets/note-insight.png')),baseline.insightHash);});
test('social image is a real 1200 x 630 PNG',async()=>{const png=await read('assets/social-preview.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);});
