const {chromium}=require('C:/Users/Renat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const output='C:/Users/Renat/Documents/Codex/qa-exports/uniflow-landing';
fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(file.endsWith(path.sep))file+='index.html';if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(file)]||'text/plain');res.end(fs.readFileSync(file));});
(async()=>{
 await new Promise(resolve=>server.listen(8767,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const reports=[];
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('http://127.0.0.1:8767/uniflowstudy/');await page.evaluate(()=>document.fonts.ready);
  await page.locator('.footer').scrollIntoViewIfNeeded();await page.locator('.top').scrollIntoViewIfNeeded();
  const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,ratio:i.clientWidth/i.clientHeight,natural:i.naturalWidth/i.naturalHeight}))}));
  assert.ok(dimensions.scroll<=width,'horizontal overflow');assert.ok(dimensions.images.every(i=>i.loaded&&Math.abs(i.ratio-i.natural)<.03),'image missing or distorted');
  assert.ok(requests.every(u=>u.startsWith('http://127.0.0.1:8767/')),'external request');
  await page.getByRole('link',{name:'Impressum',exact:true}).click();await page.getByRole('heading',{name:'Impressum',exact:true}).waitFor();
  assert.equal(await page.locator('a[href="mailto:violetbytesupport@gmail.com"]').count(),1);
  await page.getByRole('link',{name:'Datenschutz',exact:true}).click();await page.getByRole('heading',{name:'Website-Datenschutz',exact:true}).waitFor();
  await page.goto('http://127.0.0.1:8767/uniflowstudy/');await page.evaluate(()=>document.fonts.ready);
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
  await page.locator('.top').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`landing-${width}.png`),fullPage:true});
  reports.push({width,overflow:false,images:'PASS',externalRequests:0,legalNavigation:'PASS'});await page.close();
 }
 console.log(JSON.stringify(reports,null,2));fs.writeFileSync(path.join(output,'browser-qa.json'),JSON.stringify(reports,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
