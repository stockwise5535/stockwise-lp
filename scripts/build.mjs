import {cp, mkdir, rm, readFile} from 'node:fs/promises';
// Static production build: ship only the two pages and their public assets.
const root = new URL('../', import.meta.url), out = new URL('dist/', root);
for (const path of ['index.html','ja/index.html','assets/brand.css','assets/stockwise-logo.png','assets/social-preview.png','favicon.svg']) {
  await readFile(new URL(path, root));
}
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
for (const path of ['index.html','ja','assets','favicon.svg']) await cp(new URL(path,root),new URL(path,out),{recursive:true});
console.log('Static production build completed: dist/');
