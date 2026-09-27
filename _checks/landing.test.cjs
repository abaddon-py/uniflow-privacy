const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../uniflowstudy');
const read=name=>fs.existsSync(path.join(root,name))?fs.readFileSync(path.join(root,name),'utf8'):'';
test('Landing provides approved headline and direct destinations',()=>{
 const html=read('index.html');
 for(const text of ['Dein Studium.','Ein Ort.','https://apps.apple.com/de/app/uniflow-study-budget/id6804633193','https://play.google.com/store/apps/details?id=com.renatahmadi.uniflow','https://www.instagram.com/uniflowstudy/','impressum.html','datenschutz.html']) assert.ok(html.includes(text),`Missing ${text}`);
});
test('Website has legal pages, separate app privacy and working email',()=>{
 for(const file of ['impressum.html','datenschutz.html']) assert.ok(read(file).includes('mailto:violetbytesupport@gmail.com'));
 assert.ok(read('datenschutz.html').includes('https://abaddon-py.github.io/uniflow-privacy/'));
 assert.ok(read('datenschutz.html').includes('Art. 6 Abs. 1 lit. f DSGVO'));
});
test('No scripts, remote embeds, fonts or address on marketing page',()=>{
 const html=read('index.html'); assert.ok(html.length>0);
 assert.doesNotMatch(html,/<script|<iframe|Tieckstraße|30625|Renat Ahmadi/i);
 for(const file of ['index.html','impressum.html','datenschutz.html','style.css']) assert.doesNotMatch(read(file),/(?:src=["']https?:|@import|googletagmanager|connect.facebook|pintrk\()/i);
});
test('Five real screenshots and all local references exist',()=>{
 const html=read('index.html'); assert.equal((html.match(/class="app-screen"/g)||[]).length,5);
 for(const file of ['index.html','impressum.html','datenschutz.html']) for(const match of read(file).matchAll(/(?:src|href)="([^"#]+)"/g)) if(!/^(https?:|mailto:)/.test(match[1])) assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);
});
