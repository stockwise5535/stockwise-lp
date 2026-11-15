import {cp,mkdir,rm,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('dist/',root);
const video=await stat(new URL('assets/demo.mov',root)).then(s=>s.size>0).catch(()=>false);
if(process.argv.includes('--require-video')&&!video)throw Error('Original assets/demo.mov required; do not deploy the media-excluded ZIP');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const path of ['index.html','en','ja','zh-cn','zh-tw','assets','favicon.svg','vercel.json'])await cp(new URL(path,root),new URL(path,out),{recursive:true,filter:p=>!p.includes('.backup-')});
console.log(JSON.stringify({staticBuild:'passed',videoIncluded:video,fullReleaseReady:video,notice:video?'Original video retained':'Source ZIP excluded demo.mov; apply patch to original Mac folder to retain video'}));
