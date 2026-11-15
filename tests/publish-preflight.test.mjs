import test from 'node:test';import assert from 'node:assert/strict';import{preflight}from'../scripts/publish-from-original.mjs';
const state=()=>({project:{projectName:'stockwise-homepage'},videoBytes:2000,manifest:{files:[{path:'ja/index.html',sha256:'new',originalSha256:'old'},{path:'favicon.svg',sha256:'icon',originalSha256:null}]},current:{'ja/index.html':'old','favicon.svg':null}});
test('only original reviewed files or exact replay accepted',()=>{const x=state();assert.doesNotThrow(()=>preflight(x));x.current['ja/index.html']='new';x.current['favicon.svg']='icon';assert.doesNotThrow(()=>preflight(x));});
test('wrong project, missing video or manual edits stop before writes/deploy',()=>{for(const mutate of[x=>x.project.projectName='stockwise-lp',x=>x.videoBytes=0,x=>x.current['ja/index.html']='manual edit',x=>x.current['favicon.svg']='existing unrelated icon']){const x=state();mutate(x);assert.throws(()=>preflight(x),/STOP/);}});
test('CLI entry works through a symlink, including macOS /tmp resolution',async()=>{
 const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path'),{spawnSync}=await import('node:child_process'),{fileURLToPath}=await import('node:url');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'homepage-entry-'));
 try{const link=path.join(dir,'publish.mjs');await fs.symlink(fileURLToPath(new URL('../scripts/publish-from-original.mjs',import.meta.url)),link);const r=spawnSync(process.execPath,[link,'invalid-revision'],{encoding:'utf8'});assert.equal(r.status,1);assert.match(r.stderr,/Full reviewed Git commit required/);}finally{await fs.rm(dir,{recursive:true,force:true});}
});
