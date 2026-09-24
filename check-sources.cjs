// Node.js >=22, Java >=21 and curl. No credentials are needed for checking.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const input=process.argv[2]||'book_sources.json',output=process.argv[3]||'check-report.json';
const cache=path.resolve('.legado-check');fs.mkdirSync(cache,{recursive:true});
const jar=path.resolve(process.env.VALIDATOR_JAR||path.join(cache,'validator.jar'));
const expected='4b21d5c8181639a45fa7870f77d2b565a5a0839879c5b72e815686fd7c364a77';
const jarUrl='https://raw.githubusercontent.com/Narylr350/book-source-creator-skill/2be0299af2dd943bf3b7dfea4c79389424e14d3f/legado-book-source-generator/validator/app/legado-source-validator.jar';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function parse(raw){try{return JSON.parse(raw)}catch{let quoted=false,escaped=false,out='';for(const ch of raw){if(quoted&&ch.charCodeAt(0)<32){out+='\\u'+ch.charCodeAt(0).toString(16).padStart(4,'0');continue;}if(ch==='"'&&!escaped)quoted=!quoted;out+=ch;escaped=ch==='\\'&&!escaped;}return JSON.parse(out);}}
async function main(){
if(!fs.existsSync(jar)){let res=await fetch(jarUrl,{signal:AbortSignal.timeout(120000)});if(!res.ok)throw Error('Validator download HTTP '+res.status);fs.writeFileSync(jar,Buffer.from(await res.arrayBuffer()));}
if(crypto.createHash('sha256').update(fs.readFileSync(jar)).digest('hex')!==expected)throw Error('Validator SHA-256 mismatch');
const sources=JSON.parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,''));if(!Array.isArray(sources))throw Error('Expected source array');
fs.writeFileSync(path.join(cache,'.curlrc'),'compressed\nuser-agent = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36"\n');fs.copyFileSync(path.join(cache,'.curlrc'),path.join(cache,'_curlrc'));
let cursor=0,rows=[];
async function worker(slot){while(cursor<sources.length){const s=sources[cursor++],row={name:s.bookSourceName,url:s.bookSourceUrl,checkedAt:new Date().toISOString(),sourceSha256:crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex')};let proc;
try{if(/java\.io|java\.lang|Packages|eval\(|loadLibrary|java\.readFile|java\.write|java\.delete|java\.startBrowser|webView.{0,6}true/.test(JSON.stringify(s)))throw Error('Requires manual script/WebView review');
const port=18900+slot;proc=spawn(process.env.JAVA_BIN||'java',['-Xmx384m','-jar',jar,'--port',String(port)],{cwd:process.env.CURL_BIN_DIR||cache,windowsHide:true,stdio:'ignore',env:{...process.env,CURL_HOME:cache}});proc.on('error',()=>{});
let ready=false;for(let n=0;n<100;n++){await delay(100);try{let r=await fetch('http://127.0.0.1:'+port+'/api/sources');if(r.ok){ready=true;break;}}catch{}}if(!ready)throw Error('Validator startup failed: check Java 21 and port');
const keyword=s.ruleSearch?.checkKeyWord||'我的';row.keyword=keyword;const requestKeyword=process.platform==='win32'&&/method[\s\S]{0,10}post/i.test(s.searchUrl||'')?encodeURIComponent(keyword):keyword;
const r=await fetch('http://127.0.0.1:'+port+'/api/debug/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sourceJson:JSON.stringify(s),sourceUrl:s.bookSourceUrl,keyword:requestKeyword,mode:'http'}),signal:AbortSignal.timeout(65000)});const j=parse(await r.text());row.engineStatus=j.finalStatus;row.phases=j.phases;row.book=j.summary?.firstBook;row.chapterCount=j.summary?.chapterCount;const content=(j.steps||[]).filter(x=>x.phase==='content');row.contentLengths=content.map(x=>x.extracted?.contentLength||0);row.issues=[];row.firstChapterTitles=j.steps?.find(x=>x.phase==='toc')?.extracted?.first5?.map(x=>x.title)||[];
if(j.finalStatus!=='passed'||!['search','detail','toc','content'].every(p=>j.phases?.[p]==='success'))row.issues.push(j.summary?.error||'Engine phases failed');
if(content.length<2||row.contentLengths.some(n=>n<500))row.issues.push('Fewer than two substantial chapter samples');
const preview=j.summary?.contentPreview||'';if((preview.match(/[\u4e00-\u9fff]/g)||[]).length<40||(preview.match(/[?\uFFFD]/g)||[]).length>25)row.issues.push('Garbled or non-Chinese content');
if(row.firstChapterTitles.some(t=>(t.match(/[?\uFFFD]/g)||[]).length>3))row.issues.push('Garbled chapter titles');
let nums=row.firstChapterTitles.slice(0,2).map(t=>Number(t.match(/第\s*(\d+)\s*[章話回]/)?.[1]));if(nums.length===2&&nums.every(Number.isFinite)&&nums[1]<nums[0])row.issues.push('Descending or duplicated latest-chapter block');
row.status=row.issues.length?'needs_review':'passed';
}catch(e){row.status='error';row.issues=[e.message];}finally{if(proc&&proc.pid){proc.kill();await Promise.race([new Promise(r=>proc.exitCode!==null?r():proc.once('exit',r)),delay(3000)]);}}
rows.push(row);fs.writeFileSync(output,JSON.stringify({generatedAt:new Date().toISOString(),scope:'Server engine, two sample chapters; Android and all-book coverage not tested',sources:rows},null,2)+'\n');console.log(rows.length+'/'+sources.length,row.name,row.status);
}}
await Promise.all(Array.from({length:Math.min(4,sources.length)},(_,i)=>worker(i)));if(rows.some(r=>r.status!=='passed'))process.exitCode=2;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
