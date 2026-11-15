import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function preflight({project,videoBytes,manifest,current}) {
  if(project.projectName!=='stockwise-homepage')throw Error('STOP: linked project is not stockwise-homepage');
  if(!(videoBytes>0))throw Error('STOP: original assets/demo.mov is missing; no deployment');
  for(const item of manifest.files){const actual=current[item.path];if(actual===item.sha256)continue;
    if(actual!==item.originalSha256)throw Error('STOP: local file differs from reviewed source: '+item.path);}
}
export async function main(revision){
  if(!/^[a-f0-9]{40}$/.test(revision||''))throw Error('Full reviewed Git commit required');
  const root=process.cwd();
  const project=JSON.parse(await fs.readFile(path.join(root,'.vercel/project.json'),'utf8'));
  const videoBytes=(await fs.stat(path.join(root,'assets/demo.mov'))).size;
  const base=`https://raw.githubusercontent.com/stockwise5535/stockwise-lp/${revision}/`;
  async function download(name){const r=await fetch(base+name);if(!r.ok)throw Error('Download failed: '+name);return Buffer.from(await r.arrayBuffer());}
  const manifest=JSON.parse((await download('release-manifest.json')).toString());
  if(manifest.targetProject!=='stockwise-homepage')throw Error('Wrong release manifest');
  const current={},staged=[];
  for(const item of manifest.files){current[item.path]=await fs.readFile(path.join(root,item.path)).then(sha).catch(e=>{if(e.code==='ENOENT')return null;throw e;});const bytes=await download(item.path);if(sha(bytes)!==item.sha256)throw Error('Integrity mismatch: '+item.path);staged.push({item,bytes});}
  const routing=await fs.readFile(path.join(root,'vercel.json'));
  if(sha(routing)!==manifest.routingSha256)throw Error('STOP: routing config differs; not overwritten');
  preflight({project,videoBytes,manifest,current});
  const backup=await fs.mkdtemp(path.join(path.dirname(root),'.stockwise-homepage-brand-backup-'));
  for(const {item}of staged){if(current[item.path]!==null){await fs.mkdir(path.dirname(path.join(backup,item.path)),{recursive:true});await fs.copyFile(path.join(root,item.path),path.join(backup,item.path));}}
  for(const {item,bytes}of staged){const dest=path.join(root,item.path);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes);if(sha(await fs.readFile(dest))!==item.sha256)throw Error('Write verification failed; no deploy');}
  if((await fs.stat(path.join(root,'assets/demo.mov'))).size!==videoBytes)throw Error('Original video changed; no deploy');
  console.log('Brand changes verified; existing video and routing retained. Backup: '+backup);
  const result=spawnSync('npx',['--yes','vercel','--prod','--yes'],{cwd:root,stdio:'inherit'});
  if(result.error||result.status!==0)throw Error('Deployment did not report success. No automatic retry.');
  for(const route of ['/en/','/ja/']){const r=await fetch('https://stockwise-homepage.vercel.app'+route,{cache:'no-store'});const html=await r.text();if(!r.ok||!html.includes('/assets/stockwise-logo.png')||html.includes('MIERUKA'))throw Error('Live alias verification failed: '+route);console.log('VERIFIED '+route+': Stockwise branding published');}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv[2]).catch(e=>{console.error(e.message);process.exitCode=1;});
