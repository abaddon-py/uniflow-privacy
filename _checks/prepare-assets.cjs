// Lossless UI source provenance; only proportional resizing/encoding for web delivery.
const sharp=require('C:/Users/Renat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base='C:/Users/Renat/Documents/Codex';
const raw=base+'/release-artifacts/store-assets/google-play/build23-production/de/raw';
const out=path.resolve(__dirname,'../uniflowstudy/assets');
const files={'home.jpg':raw+'/home-light.jpg','study.jpg':raw+'/study-light.jpg','learning.png':raw+'/learning-light.png','focus.png':raw+'/focus-light-recapture.png','finance.jpg':raw+'/finance-light.jpg','icon.png':base+'/social/instagram/launch/v2/concepts/profile-icon-original.png'};
(async()=>{
 const manifest=[];
 for(const [name,source] of Object.entries(files)){
  const image=sharp(source).resize({width:name==='icon.png'?256:640,withoutEnlargement:true});
  const buffer=await (name.endsWith('.jpg')?image.jpeg({quality:88,mozjpeg:true}):image.png({compressionLevel:9})).toBuffer();
  fs.writeFileSync(path.join(out,name),buffer);
  manifest.push({name,sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),outputSHA256:crypto.createHash('sha256').update(buffer).digest('hex'),bytes:buffer.length,sourceCommit:'9598381e6e3a117562b6e165774f4da2e729e93f',method:'Existing approved asset, proportional downscale only; no UI edits'});
 }
 fs.writeFileSync(path.join(__dirname,'asset-provenance.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(manifest.map(x=>({name:x.name,bytes:x.bytes})));
})();
