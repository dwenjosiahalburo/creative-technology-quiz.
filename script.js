const S=[
{n:"Computer Basics",i:"💻",q:[
["Which of the following is considered the brain of the computer?",["Monitor","Keyboard","CPU","Mouse"],2],
["Which of the following is an example of computer hardware?",["Microsoft Word","Keyboard","Google Chrome","Windows"],1],
["What is the main purpose of an operating system?",["To create websites","To manage computer hardware and software","To edit pictures","To browse the internet"],1]]},
{n:"Electronics Essentials",i:"💡",q:[
["What does LED stand for?",["Light Energy Device","Low Electric Diode","Light Emitting Diode","Light Electronic Display"],2],
["What is the main function of an LED?",["To produce sound","To emit light","To measure temperature","To control movement"],1],
["What is the main function of an electric motor?",["To convert electrical energy into mechanical motion","To store electricity","To measure distance","To produce light"],0],
["What is the purpose of a resistor in an electrical circuit?",["To increase brightness automatically","To limit the flow of electric current","To store electrical energy","To produce sound"],1]]},
{n:"Arduino & Sensors",i:"🤖",q:[
["What is an Arduino?",["A type of computer virus","A microcontroller development board","A computer monitor","A type of electric motor"],1],
["What is the function of a sensor?",["To detect changes in the environment","To store files","To display pictures","To produce electricity"],0],
["What does a soil moisture sensor measure?",["Air temperature","Amount of light","Moisture level in soil","Water pressure"],2],
["What is the function of a relay module?",["To control an electrical device using a control signal","To measure distance","To produce light","To store information"],0],
["What is the purpose of a servo motor?",["To produce heat","To move to a controlled angular position","To measure humidity","To generate sound"],1]]},
{n:"Web Development",i:"🌐",q:[
["What does HTML stand for?",["HyperText Markup Language","High Technology Modern Language","Hyper Transfer Machine Language","Hyperlink Text Management"],0],
["Which HTML tag is used to create a paragraph?",["<h1>","<br>","<p>","<img>"],2],
["Which HTML tag creates the largest heading?",["<h6>","<h1>","<p>","<head>"],1],
["What is the purpose of CSS in web development?",["To structure webpage content","To style and design webpages","To store information","To calculate numbers"],1],
["Which CSS property changes the background color?",["font-size","text-align","background-color","margin"],2],
["What is JavaScript mainly used for?",["Adding interactivity to webpages","Creating computer hardware","Changing monitor resolution","Connecting electrical wires"],0]]},
{n:"Logic & Building",i:"🧩",q:[
["What is an algorithm?",["A computer virus","A step-by-step set of instructions to solve a problem","A type of keyboard","A programming error"],1],
["What is the purpose of a breadboard?",["To permanently store data","To build and test electronic circuits without soldering","To produce electricity","To control a computer screen"],1]]}
];
const Q=[];S.forEach((s,si)=>s.q.forEach(x=>Q.push({s:si,q:x[0],o:x[1],a:x[2]})));
const L="ABCD",SH=["🤖","💡","⚙️","💻"],T=20,$=id=>document.getElementById(id);
const show=id=>["start","banner","game","result"].forEach(x=>$(x).classList.toggle("hide",x!==id));
let cur,ans,pts,tmr,t0,lock,name;

/* background elements */
const sy=["</>","{ }","⚙","💡","01","⚡","#","🔌",";","📡","10","🤖","🔋","💾","🖥","🔧","🧲","⌨","🖱","📟","🔬","<p>","CSS","JS","LED","1101","( )","=>","🌱","⚙","💡","⚡"];
$("bg").innerHTML=sy.map((c,i)=>`<span style="left:${(i*37+5)%94}%;top:${(i*53+7)%92}%;animation-delay:-${(i*1.7)%9}s;font-size:${22+(i*7)%20}px"></span>`).join("");
[...$("bg").children].forEach((e,i)=>e.textContent=sy[i]);
$("secList").innerHTML=S.map((s,i)=>`<div>${s.i} ${s.n}<small>${s.q.length} questions</small></div>`).join("");

function begin(){
  name=($("nick").value.trim()||"Player").slice(0,16);
  cur=0;ans=[];pts=[];lock=true;
  count(3);
}
function count(n){
  show("banner");$("bt").textContent=n;$("bs").textContent="Get ready, "+name+"!";
  const el=$("bt");el.style.animation="none";void el.offsetWidth;el.style.animation="";
  setTimeout(()=>n>1?count(n-1):nextQ(),800);
}
function nextQ(){
  if(cur>=Q.length)return finish();
  if(cur===0||Q[cur].s!==Q[cur-1].s){
    const s=Q[cur].s;show("banner");
    $("bt").textContent=S[s].i+" "+S[s].n;
    $("bs").textContent=`Section ${s+1} of ${S.length} · ${S[s].q.length} questions`;
    const el=$("bt");el.style.animation="none";void el.offsetWidth;el.style.animation="";
    setTimeout(ask,1700);
  }else ask();
}
function ask(){
  const q=Q[cur];show("game");lock=false;
  $("qn").textContent=`Question ${cur+1} / ${Q.length}`;
  $("sc").textContent=`${S[q.s].i} ${S[q.s].n}`;
  $("qtext").textContent=q.q;$("lockmsg").textContent="";
  $("tiles").innerHTML="";
  q.o.forEach((t,i)=>{
    const b=document.createElement("button");b.className="tile t"+i;
    b.innerHTML="<i></i><span></span>";b.firstChild.textContent=SH[i];b.lastChild.textContent=t;
    b.onclick=()=>answer(i,b);$("tiles").appendChild(b);
  });
  t0=performance.now();tick();clearInterval(tmr);tmr=setInterval(tick,100);
}
function tick(){
  const left=Math.max(0,T-(performance.now()-t0)/1000);
  $("tn").textContent=Math.ceil(left);
  $("tbar").style.width=(left/T*100)+"%";
  $("tbar").style.background=left<6?"#e21b3c":left<12?"#f5b800":"#26d07c";
  if(left<=0)answer(-1);
}
function answer(i,btn){
  if(lock)return;lock=true;clearInterval(tmr);
  const el=Math.min(T,(performance.now()-t0)/1000),ok=i===Q[cur].a;
  ans.push(i);pts.push(ok?Math.round((1-(el/T)/2)*1000):0);
  document.querySelectorAll(".tile").forEach(b=>b.disabled=true);
  if(btn)btn.classList.add("sel");
  $("lockmsg").textContent=i<0?"⏰ Time’s up!":"✅ Answer locked in!";
  setTimeout(()=>{cur++;nextQ()},900);
}
async function finish(){
  show("result");
  const total=pts.reduce((a,b)=>a+b,0),cor=ans.filter((a,i)=>a===Q[i].a).length,p=Math.round(cor/Q.length*100);
  let best=0,run=0;ans.forEach((a,i)=>{run=a===Q[i].a?run+1:0;best=Math.max(best,run)});
  const r=p===100?["Tech Genius 🏆","Perfect score! Flawless wiring."]:p>=80?["Circuit Master ⚡","Excellent work, you really know your tech."]:p>=60?["Rising Maker 🔧","Good job! A little more practice and you’ll ace it."]:["Beginner Builder 🌱","Keep experimenting. Check the answers below and play again."];
  $("rank").textContent=r[0];$("rmsg").textContent=`${p}% correct. ${r[1]}`;
  const bots=["Arduino Ace","Pixel Pro","Servo Sam","Byte Bender","Volt Viking"].map(n=>({n,s:Math.round(Q.length*(0.45+Math.random()*0.5)*(620+Math.random()*250))}));
  await submit(total,cor);const all=entries(total,bots);
  const order=[1,0,2].filter(i=>all[i]);
  $("podium").innerHTML=order.map(i=>`<div class="pc p${i+1} ${all[i].me?"me":""}" style="animation-delay:${(2-i)*.3}s"><b class="nm"></b><div class="bl">${i+1}</div></div>`).join("");
  [...$("podium").querySelectorAll(".nm")].forEach((e,k)=>e.textContent=all[order[k]].n+" · "+all[order[k]].s);
  $("stats").innerHTML=`<div class="stat"><b>${total}</b><span>Total points</span></div><div class="stat"><b>${cor}/${Q.length}</b><span>Correct</span></div><div class="stat"><b>${best}</b><span>Best streak 🔥</span></div>`;
  const rows=all.map((x,i)=>({...x,r:i+1})).filter((x,i)=>i<10||x.me);$("lb").innerHTML=rows.map(x=>`<div class="lb ${x.me?"me":""}"><span class="ln"></span><span>${x.s}</span></div>`).join("");
  [...$("lb").querySelectorAll(".ln")].forEach((e,i)=>e.textContent=`${rows[i].r}. ${rows[i].n}`);
  $("bd").innerHTML=S.map((s,si)=>{
    const t=Q.map((x,i)=>i).filter(i=>Q[i].s===si),c=t.filter(i=>ans[i]===Q[i].a).length;
    return `<div class="row"><span>${s.i} ${s.n}</span><div class="pb"><i style="width:${c/t.length*100}%"></i></div><b>${c}/${t.length}</b></div>`}).join("");
  let h="",last=-1;
  Q.forEach((x,i)=>{
    if(x.s!==last){h+=`<div class="sh">${S[x.s].i} ${S[x.s].n}</div>`;last=x.s}
    const ok=ans[i]===x.a;
    h+=`<div class="rev"><h4>${i+1}. <span class="t"></span> ${ok?"✅":"❌"}</h4><p class="${ok?"g":"r"}">Your answer: <span class="y"></span> <b>${ok?"+"+pts[i]:"+0"}</b></p>${ok?"":`<p class="g">Correct answer: <span class="c"></span></p>`}</div>`;
  });
  $("rv").innerHTML=h;
  const rs=$("rv").querySelectorAll(".rev");
  Q.forEach((x,i)=>{const e=rs[i];e.querySelector(".t").textContent=x.q;
    e.querySelector(".y").textContent=ans[i]<0?"No answer (time ran out)":SH[ans[i]]+" "+x.o[ans[i]];
    const c=e.querySelector(".c");if(c)c.textContent=SH[x.a]+" "+x.o[x.a]});
  window.scrollTo(0,0);
}
let av="🤖";
$("avs").innerHTML=["🤖","🦊","🐼","🚀","👾","🦄","🐙","🐱"].map((e,i)=>`<button type="button" class="av${i?"":" on"}">${e}</button>`).join("");
$("avs").onclick=e=>{const b=e.target.closest(".av");if(!b)return;av=b.textContent;$("avs").querySelectorAll(".av").forEach(x=>x.classList.toggle("on",x===b));document.querySelector(".bot").textContent=av};
$("go").onclick=begin;/* shared live leaderboard (falls back to practice mode) */
let db=null,myId=null,canWrite=true,live=false,board=[];
function entries(total,bots){
  let l;
  if(live&&db){l=board.map(x=>({n:(x.av||"")+" "+x.name,s:x.points,me:x.id===myId}));if(!l.some(x=>x.me))l.push({n:av+" "+name,s:total,me:1})}
  else l=[...bots,{n:av+" "+name,s:total,me:1}];
  return l.sort((a,b)=>b.s-a.s);
}
async function submit(total,cor){
  const set=t=>$("lbnote").textContent=t;
  if(!live||!db){set("🧪 Practice mode: the other players are simulated. Open the shared link while signed in to claude.ai to join the live leaderboard.");return}
  if(!canWrite||!myId){set("👀 Live leaderboard (view only): your account can’t post scores, so your result is shown here but not saved.");return}
  const mine=board.find(x=>x.id===myId);
  if(mine&&mine.points>=total){set("🌐 Live leaderboard · your saved best ("+mine.points+") is higher, so it was kept.");return}
  try{
    await Promise.race([db.doc("scores/"+myId).set({name,av,points:total,correct:cor,ts:Date.now()}),new Promise((_,rj)=>setTimeout(()=>rj({code:"timeout"}),5000))]);
    board=board.filter(x=>x.id!==myId).concat({id:myId,name,av,points:total,correct:cor});
    set("🌐 Live leaderboard · your score was saved!");
  }catch(e){if(e&&e.code==="invalid_argument")canWrite=false;set("⚠️ Your score couldn’t be saved right now, so it is shown here only.")}
}
function renderHall(){
  $("hallwrap").classList.toggle("hide",!board.length);
  const top=[...board].sort((a,b)=>b.points-a.points).slice(0,5);
  $("hall").innerHTML=top.map(()=>`<div class="lb"><span></span><span></span></div>`).join("");
  [...$("hall").children].forEach((e,i)=>{e.children[0].textContent=`${i+1}. ${top[i].av} ${top[i].name}`;e.children[1].textContent=top[i].points});
}
/* host panel: live results for everyone who finished (owner/editors only) */
let isAdmin=false,pOpen=false,unlocked=false;
$("adm").onclick=()=>{pOpen=!pOpen;if(!pOpen)unlocked=false;renderAdmin()};
function renderAdmin(){
  if(!live)return;
  $("adm").classList.remove("hide");
  $("adm").textContent=unlocked?`📊 Live results (${board.length})`:"🔒 Host results";
  const p=$("pnl");p.classList.toggle("hide",!pOpen);
  if(!pOpen)return;
  if(!unlocked){
    if(!$("apw")){
      p.innerHTML=`<h3>🔒 Host access</h3><div style="font-size:13px;color:var(--mut)">Enter the password to see the live results.</div><input id="apw" type="password" inputmode="numeric" placeholder="Password" autocomplete="off"><div id="amsg" style="color:var(--bad);font-weight:700;font-size:13px;min-height:18px"></div><div><button class="mini" id="aunlock">Unlock</button><button class="mini" id="aclose2">Close</button></div>`;
      const go=()=>{if($("apw").value==="1234"){unlocked=true;renderAdmin()}else{$("amsg").textContent="Wrong password. Try again.";$("apw").value=""}};
      $("aunlock").onclick=go;
      $("apw").addEventListener("keydown",e=>{if(e.key==="Enter")go()});
      $("aclose2").onclick=()=>{pOpen=false;renderAdmin()};
      $("apw").focus();
    }
    return;
  }
  const list=[...board].sort((a,b)=>b.points-a.points);
  const avg=list.length?Math.round(list.reduce((t,x)=>t+x.points,0)/list.length):0;
  p.innerHTML=`<h3>📊 Live results</h3><div id="astat" style="font-size:13px;color:var(--mut)"></div><div><button class="mini" id="acopy">Copy results</button><button class="mini red" id="areset">Reset all</button><button class="mini" id="aclose">Close</button></div><div id="alist"></div>`;
  $("astat").textContent=`${list.length} player${list.length===1?"":"s"} finished · average ${avg} pts · updates live`;
  if(!list.length){const e=document.createElement("div");e.style.cssText="font-size:14px;color:var(--mut);padding:10px 0";e.textContent="Nobody has finished yet. Scores appear here as soon as players complete the quiz.";$("alist").appendChild(e)}
  list.forEach((x,i)=>{
    const r=document.createElement("div");r.className="ar";
    const a=document.createElement("span");a.textContent=(i+1)+".";
    const n=document.createElement("span");n.className="nm";n.textContent=x.av+" "+x.name;
    const s=document.createElement("span");s.textContent=x.points+" pts";
    const m=document.createElement("small");m.textContent=x.correct+"/"+Q.length+(x.ts?" · "+new Date(x.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"");
    const d=document.createElement("button");d.textContent="🗑";d.title="Remove this player";
    d.onclick=()=>{db.doc("scores/"+x.id).delete().catch(()=>{})};
    r.append(a,n,s,m,d);$("alist").appendChild(r);
  });
  $("aclose").onclick=()=>{pOpen=false;unlocked=false;renderAdmin()};
  $("acopy").onclick=async()=>{
    const txt=list.map((x,i)=>`${i+1}. ${x.name} - ${x.points} pts (${x.correct}/${Q.length})`).join("\n");
    try{await navigator.clipboard.writeText(txt);$("acopy").textContent="Copied ✓"}
    catch(e){const t=document.createElement("textarea");t.value=txt;t.style.cssText="width:100%;height:120px;margin-top:6px";$("alist").before(t);t.select()}
  };
  let armed=false;
  $("areset").onclick=async()=>{
    if(!armed){armed=true;$("areset").textContent="Sure? Click again";setTimeout(()=>{armed=false;const b=$("areset");if(b)b.textContent="Reset all"},3000);return}
    for(const x of list){try{await db.doc("scores/"+x.id).delete()}catch(e){}}
  };
}
(async()=>{
  try{
    const [d,u]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!d)return;
    db=d;
    if(u){myId=await u.id();canWrite=(await u.can("data.write"))!==false;isAdmin=(await u.isOwner())||(await u.canEdit())}
    db.collection("scores").orderBy("points","desc").limit(200).onSnapshot(s=>{
      live=true;
      board=s.docs.map(x=>{const v=x.data()||{};return{id:x.id,name:String(v.name||"Player").slice(0,16),av:String(v.av||"").slice(0,4),points:Number(v.points)||0,correct:Number(v.correct)||0,ts:Number(v.ts)||0}});
      renderHall();renderAdmin();
    },()=>{});
  }catch(e){}
})();
$("again").onclick=()=>show("start");
$("nick").addEventListener("keydown",e=>{if(e.key==="Enter")begin()});
