const $=s=>document.querySelector(s),K='forgefit.v1';
const td=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let S=JSON.parse(localStorage.getItem(K)||'null')||{p:{},m:{},goals:[],eq:{},days:4,plan:null,start:Date.now(),logs:{},set:{timer:true,sound:true,vibe:true,notif:false,unit:'kg'},ln:''};
const save=()=>localStorage.setItem(K,JSON.stringify(S));
let tab='dash',sel=null;
const MEAS=['neck','shoulders','chest','biceps','forearms','waist','hips','thighs','calves'];
const GOALS=[['belly','Burn Belly Fat'],['shoulders','Build Broader Shoulders'],['chest','Bigger Chest'],['back','Wider Back'],['arms','Bigger Arms'],['legs','Leg Strength'],['calves','Calf Growth']];
const EQ=[['barbell','Barbell','bar'],['dumbbells','Dumbbells','db'],['bench','Bench','bench'],['cable','Cable Crossover','cable'],['smith','Smith Machine','mach'],['latpd','Lat Pulldown','cable'],['legpress','Leg Press','mach'],['treadmill','Treadmill','tread'],['pecdeck','Pec Deck','mach'],['pullup','Pull-up Bar','pull']];
const IC={bar:'<path d="M4 32h56M12 20v24M18 14v36M46 14v36M52 20v24"/>',db:'<path d="M22 32h20M14 22v20M22 18v28M42 18v28M50 22v20"/>',bench:'<path d="M8 28h48M14 28v18M50 28v18M8 46h14M42 46h14"/>',cable:'<path d="M12 8v48M12 10h30l8 8M50 18v14"/><rect x="46" y="32" width="8" height="10"/>',mach:'<rect x="10" y="10" width="44" height="44" rx="4"/><path d="M20 20h24M20 32h24M20 44h24"/>',tread:'<path d="M8 46h48M12 46l8-14h28M44 32V14M36 14h16"/>',pull:'<path d="M8 12h48M14 12v40M50 12v40"/>'};
const svg=t=>`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${IC[t]}</svg>`;
// id,name,group,muscles,equip(+ = all needed, bw = none),focus tags,steps(|),mistakes
const EX=[
['dbbench','Dumbbell Bench Press','push','Chest, front delts, triceps','dumbbells+bench','chest','Lie on bench, feet flat, shoulder blades pinched back.|Dumbbells over chest, lower slowly to chest level.|Press up without clanging bells.','Flared 90° elbows, bouncing, over-arching. Start light after layoff; ask for a spotter.'],
['bbbench','Barbell Bench Press','push','Chest, triceps','barbell+bench','chest','Grip just wider than shoulders, unrack over chest.|Lower to mid-chest, forearms vertical.|Drive up, keep glutes on bench.','Bouncing off chest, wrist bend, no safeties/spotter. Use safety pins.'],
['pushup','Push-up','push','Chest, triceps, core','bw','chest','Hands under shoulders, body straight.|Lower chest to near floor, elbows ~45°.|Press up. Knees down if needed.','Sagging hips, flared elbows, half reps.'],
['dbpress','Dumbbell Shoulder Press','push','Shoulders, triceps','dumbbells','shoulders','Sit or stand, bells at shoulder height.|Press overhead until arms near straight.|Lower under control.','Back arching, shrugging, heavy ego load. Brace abs.'],
['pecdeck','Pec Deck Fly','push','Chest','pecdeck','chest','Adjust seat so handles at chest height.|Chest up, arms slightly bent, bring handles together.|Return slowly, stop at stretch.','Shoulders rolling forward, too much weight, jerking.'],
['latraise','Dumbbell Lateral Raise','push','Side delts','dumbbells','shoulders','Light bells at sides, slight elbow bend.|Raise to shoulder height, lead with elbows.|Lower slowly.','Swinging torso, shrugging, going above shoulder.'],
['pushdown','Cable Triceps Pushdown','push','Triceps','cable','arms','Elbows pinned to sides.|Push bar down until arms straight.|Return to 90° slowly.','Elbows drifting, leaning over bar.'],
['latpd','Lat Pulldown','pull','Lats, biceps','latpd','back','Thighs locked under pad, grip wide.|Pull bar to upper chest, elbows down.|Control bar up.','Pulling behind neck, leaning back far, momentum.'],
['pullup','Pull-up / Assisted Pull-up','pull','Lats, biceps','pullup','back,arms','Hang with shoulders packed.|Pull chest to bar.|Lower fully, controlled.','Kipping, half reps. Use band/assist after layoff.'],
['dbrow','One-Arm Dumbbell Row','pull','Lats, mid back, biceps','dumbbells','back','Hand and knee on support, flat back.|Pull bell to hip, elbow close.|Lower to full stretch.','Twisting torso, rounding back, jerking.'],
['bbrow','Barbell Row','pull','Back, biceps','barbell','back','Hinge at hips, flat back, bar below knees.|Pull bar to lower ribs.|Lower under control.','Rounded lower back, standing up each rep. Go light first.'],
['cablerow','Seated Cable Row','pull','Mid back, lats','cable','back','Sit tall, knees soft.|Pull handle to belly, squeeze blades.|Return slowly.','Rocking, shrugging, rounded back.'],
['dbcurl','Dumbbell Curl','pull','Biceps, forearms','dumbbells','arms','Stand tall, elbows at sides.|Curl up, palms to shoulders.|Lower slowly.','Swinging, elbows drifting forward.'],
['superman','Prone Y/T Raise','pull','Rear delts, lower back','bw','back','Lie face down, arms in Y.|Lift arms and chest slightly, squeeze blades.|Hold 1s, lower.','Neck cranking, lifting too high.'],
['legpress','Leg Press','legs','Quads, glutes','legpress','legs','Feet shoulder-width mid-platform, back flat.|Lower until knees ~90°.|Press without locking knees.','Locked knees, butt lifting off pad, too deep.'],
['bbsquat','Barbell Back Squat','legs','Quads, glutes','barbell','legs','Bar on upper back, feet shoulder-width.|Sit down and back, knees track toes.|Drive up through mid-foot.','Knees caving, rounded back. Use safety pins; go light first.'],
['smithsq','Smith Machine Squat','legs','Quads, glutes','smith','legs','Feet slightly forward of bar.|Descend to parallel.|Drive up.','Feet too far back, bouncing out of bottom.'],
['goblet','Goblet Squat','legs','Quads, glutes, core','dumbbells','legs','Hold bell at chest.|Squat deep, elbows inside knees.|Stand up tall.','Heels lifting, chest dropping.'],
['bwsquat','Bodyweight Squat','legs','Quads, glutes','bw','legs','Feet shoulder-width.|Sit hips back and down.|Stand, squeeze glutes.','Knees caving, heels up.'],
['dbrdl','Dumbbell Romanian Deadlift','legs','Hamstrings, glutes','dumbbells','legs','Bells at thighs, soft knees.|Push hips back, bells slide down legs.|Stand by driving hips forward.','Rounding back, squatting it. Stop at hamstring stretch.'],
['lunge','Walking Lunge','legs','Quads, glutes','bw','legs','Step long, back knee toward floor.|Front knee over ankle.|Push through front heel into next step.','Short steps, knee caving, torso leaning.'],
['calf','Standing Calf Raise','legs','Calves','bw','calves','Balls of feet on edge or floor.|Rise high, pause 1s.|Lower to full stretch.','Bouncing, short range.'],
['plank','Plank (reps = seconds)','core','Abs, core','bw','belly','Elbows under shoulders.|Body straight, squeeze glutes and abs.|Hold, breathe.','Sagging hips, hips too high.'],
['deadbug','Dead Bug','core','Deep abs','bw','belly','Lie on back, arms up, knees 90°.|Lower opposite arm and leg, back flat.|Alternate.','Back arching off floor, rushing.'],
['tread','Treadmill Incline Walk (reps = minutes)','cardio','Cardio, fat burn','treadmill','belly','Set 3-6% incline, brisk walk.|Keep posture tall, no handrail lean.|Easy pace, can talk.','Gripping rails, too fast too soon.']];
const have=e=>e.split('+').every(x=>x=='bw'||S.eq[x]);
const weeks=()=>Math.floor((Date.now()-S.start)/6048e5),found=()=>weeks()<2;
const DT={full:[['push',1],['pull',1],['legs',2],['core',1]],upper:[['push',2],['pull',2]],lower:[['legs',4],['core',1]],push:[['push',4]],pull:[['pull',4]],legs:[['legs',3],['core',1]]};
const SP={2:['full','full'],3:['full','full','full'],4:['upper','lower','upper','lower'],5:['push','pull','legs','upper','lower'],6:['push','pull','legs','push','pull','legs']};
const DAYS={2:[1,4],3:[1,3,5],4:[1,2,4,5],5:[1,2,3,5,6],6:[1,2,3,4,5,6]};
const NM={full:'Full Body',upper:'Upper',lower:'Lower',push:'Push',pull:'Pull',legs:'Legs'};
function analyze(){const{gender,height:h,weight:w}=S.p,m=S.m,r={flags:[],ratios:[]},fl=(t,x)=>r.flags.push([t,x]);
 if(h&&w){const q=(h/100)**2;r.bmi=w/q;r.lo=18.5*q;r.hi=24.9*q}
 if(h&&m.waist){const x=m.waist/h;r.ratios.push(['Waist-to-Height',x.toFixed(2),'under 0.50']);if(x>=.5)fl('belly','Waist-to-height ≥ 0.50: central fat. Core + cardio prioritised.')}
 if(m.waist&&m.chest){const x=m.waist/m.chest;r.ratios.push(['Waist-to-Chest',x.toFixed(2),'about 0.75-0.80']);if(x>.85)fl('belly','Waist large vs chest.')}
 if(m.waist&&m.hips){const x=m.waist/m.hips;r.ratios.push(['Waist-to-Hip',x.toFixed(2),gender=='female'?'under 0.85':'under 0.90'])}
 if(m.waist&&m.shoulders){const x=m.shoulders/m.waist;r.ratios.push(['Golden Ratio (shoulders÷waist)',x.toFixed(2),'target 1.62']);if(x<1.45)fl('shoulders','Shoulders narrow vs waist: extra delt/back volume.')}
 if(m.biceps&&m.calves&&m.calves<m.biceps*.92)fl('calves','Calves lag behind biceps.');
 if(m.waist&&m.thighs&&m.thighs<m.waist*.58)fl('legs','Thighs small vs waist: leg focus.');
 if(m.biceps&&m.forearms&&m.forearms<m.biceps*.75)fl('arms','Forearms lag behind biceps.');
 return r}
const focus=()=>[...new Set([...S.goals,...analyze().flags.map(f=>f[0])])];
function build(){const F=focus(),used={},d=S.days;
 S.plan=SP[d].map((t,i)=>{const ex=[];
  DT[t].forEach(([g,n])=>{EX.filter(e=>e[2]==g&&have(e[4])&&!ex.includes(e[0])).map(e=>[e,e[5].split(',').filter(x=>F.includes(x)).length*3-(used[e[0]]||0)+Math.random()*.5]).sort((a,b)=>b[1]-a[1]).slice(0,n).forEach(([e])=>{ex.push(e[0]);used[e[0]]=(used[e[0]]||0)+1})});
  if(F.includes('belly')&&S.eq.treadmill&&i%2==0)ex.push('tread');
  return{name:`Day ${i+1} · ${NM[t]}`,ex}});
 S.start=Date.now();save()}
const todayIdx=()=>S.plan?DAYS[S.days].indexOf(new Date().getDay()||7):-1;
const g=p=>p.split('.').reduce((o,k)=>o&&o[k],S);
const fld=(p,l,t='number')=>`<label class="f">${l}<input data-p="${p}" type="${t}" step="any" inputmode="decimal" value="${g(p)??''}"></label>`;
const sw=(p,l)=>`<div class="card eq"><b>${l}</b><input class="sw" type="checkbox" data-p="${p}" ${g(p)?'checked':''}></div>`;
function anHTML(){const a=analyze();let h='<h2>Analysis</h2>';
 if(a.bmi)h+=`<div class="card grid"><div class="stat"><b>${a.bmi.toFixed(1)}</b><span>BMI</span></div><div class="stat"><b>${a.lo.toFixed(0)}–${a.hi.toFixed(0)}kg</b><span>Healthy weight range</span></div></div>`;
 h+=a.ratios.map(r=>`<div class="card row"><span>${r[0]}</span><b style="text-align:right">${r[1]} <span class=m>${r[2]}</span></b></div>`).join('');
 h+=a.flags.length?a.flags.map(f=>`<div class="warn">⚠ ${f[1]}</div>`).join(''):'<p class=m>Enter measurements to see lagging areas. Flags auto-prioritise exercises.</p>';return h}
const V={
dash(){const a=analyze(),di=todayIdx(),w=weeks(),n=Object.keys(S.logs).filter(k=>Object.values(S.logs[k]).some(s=>s.some(x=>x&&x.d))).length;
 return`<h1>ForgeFit</h1><div class=card><b>Week ${w+1}</b> · ${w<2?'Foundation & Re-conditioning':'Main Phase'}<p>${S.plan?(di>=0?`Today: <b>${S.plan[di].name}</b>`:'Rest day. Recover.'):'No routine yet.'}</p>${S.plan&&di>=0?`<button data-a=go data-d=${di}>Start workout</button>`:`<button data-t=rout>${S.plan?'View routine':'Build routine'}</button>`}</div>
 <div class="card grid"><div class=stat><b>${n}</b><span>Sessions logged</span></div><div class=stat><b>${a.bmi?a.bmi.toFixed(1):'–'}</b><span>BMI</span></div></div>
 <h2>Focus areas</h2>${focus().map(f=>`<span class="chip on">${(GOALS.find(x=>x[0]==f)||[0,f])[1]}</span>`).join('')||'<p class=m>Set goals in Measurements.</p>'}`},
meas(){return`<h1>Measurements</h1><h2>Basics</h2><div class=grid>${fld('p.age','Age')}<label class=f>Gender<select data-p=p.gender><option value="">–</option>${['male','female'].map(x=>`<option ${S.p.gender==x?'selected':''}>${x}</option>`).join('')}</select></label>${fld('p.height','Height (cm)')}${fld('p.weight','Weight (kg)')}</div>
 <h2>Body (cm)</h2><div class=grid>${MEAS.map(k=>fld('m.'+k,k[0].toUpperCase()+k.slice(1))).join('')}</div>
 <h2>Goals</h2>${GOALS.map(([k,l])=>`<span class="chip ${S.goals.includes(k)?'on':''}" data-a=goal data-k=${k}>${l}</span>`).join('')}<div id=an>${anHTML()}</div>`},
equip(){return`<h1>Equipment</h1><p class=m>Toggle what your gym has. Routine uses only available gear.</p>${EQ.map(([id,n,i])=>`<div class=card><div class=eq>${svg(i)}<b>${n}</b><input class=sw type=checkbox data-q=${id} ${S.eq[id]?'checked':''}></div><details><summary>Exercises using it</summary><p>${EX.filter(e=>e[4].includes(id)).map(e=>e[1]).join(', ')}</p></details></div>`).join('')}`},
rout(){let h='<h1>Routine</h1><div class=card><div class=row><label class=f>Days / week<select data-p=days data-n=1>'+[2,3,4,5,6].map(x=>`<option ${S.days==x?'selected':''}>${x}</option>`).join('')+`</select></label><button data-a=gen>${S.plan?'Rebuild':'Generate'}</button></div><p class=m>Weeks 1–2 = Foundation: 2 sets, light, stop 3–4 reps short of failure. Then 3 sets.</p></div>`;
 if(!S.plan)return h;const di=sel??Math.max(0,todayIdx()),key=td()+':'+di;
 h+=S.plan.map((d,i)=>`<span class="chip ${i==di?'on':''}" data-a=day data-d=${i}>${d.name}</span>`).join('');
 const n=found()?2:3;
 return h+(S.plan[di].ex.length?'':'<p class=m>No available exercises. Mark equipment.</p>')+S.plan[di].ex.map(id=>{const e=EX.find(x=>x[0]==id),L=(S.logs[key]||{})[id]||[];
  return`<div class=card><b>${e[1]}</b><div class=m>${e[3]} · ${found()?'2×12 light':'3×8–12'}</div><details><summary>Form guide & safety</summary><ol>${e[6].split('|').map(s=>`<li>${s}</li>`).join('')}</ol><p>⚠ ${e[7]}</p></details>`+
  Array.from({length:n},(_,i)=>{const s=L[i]||{},b=`data-l="${key}|${id}|${i}|`;return`<div class=set><label class=chk><input type=checkbox ${b}d" ${s.d?'checked':''}>${i+1}</label><input type=number inputmode=decimal placeholder="${S.set.unit}" ${b}w" value="${s.w??''}"><input type=number inputmode=numeric placeholder=reps ${b}r" value="${s.r??''}"></div>`}).join('')+'</div>'}).join('')},
set(){return`<h1>Settings</h1>${sw('set.timer','Rest timer')}${sw('set.sound','Timer sound')}${sw('set.vibe','Timer vibration')}<div class="card row"><span>Weight unit</span><select data-p=set.unit><option ${S.set.unit=='kg'?'selected':''}>kg</option><option ${S.set.unit=='lbs'?'selected':''}>lbs</option></select></div>
 <div class=card><b>Daily 4:30 PM reminder</b><p class=m>Fires only while app is open or installed and running. Status: ${'Notification' in window?Notification.permission:'unsupported'}</p><button data-a=notif>Enable reminders</button></div>
 <h2>Backup</h2><div class=row><button data-a=exp>Export Backup JSON</button><button class=ghost data-a=imp>Import Backup JSON</button></div><h2>Danger</h2><button class=red data-a=reset>Erase all data</button>`}};
const TABS=[['dash','Home','📊'],['meas','Body','📏'],['equip','Gear','🏋️'],['rout','Routine','📅'],['set','Settings','⚙️']];
function render(){$('#app').innerHTML=V[tab]();$('#nav').innerHTML=TABS.map(([k,l,i])=>`<button data-t=${k} class="${k==tab?'on':''}"><i>${i}</i>${l}</button>`).join('')}
let tI;function ring(){if(S.set.sound)try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();o.stop(c.currentTime+.5)}catch(e){}if(S.set.vibe&&navigator.vibrate)navigator.vibrate([250,120,250])}
function timer(s){if(!S.set.timer)return;clearInterval(tI);let n=s;const t=$('#timer');t.hidden=false;t.innerHTML=`<div class=box><div>Rest</div><div class=big>${n}</div><div class=row><button data-a=t60>60s</button><button data-a=t90>90s</button><button class=ghost data-a=tx>Skip</button></div></div>`;
 tI=setInterval(()=>{n--;if(n<=0){clearInterval(tI);t.hidden=true;ring()}else t.querySelector('.big').textContent=n},1e3)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-t],[data-a]');if(!el)return;const d=el.dataset;
 if(d.t){tab=d.t;return render()}
 const A={go(){tab='rout';sel=+d.d;render()},gen(){build();sel=null;render()},day(){sel=+d.d;render()},
 goal(){S.goals=S.goals.includes(d.k)?S.goals.filter(x=>x!=d.k):[...S.goals,d.k];save();el.classList.toggle('on');$('#an').innerHTML=anHTML()},
 t60(){timer(60)},t90(){timer(90)},tx(){clearInterval(tI);$('#timer').hidden=true},
 notif(){if(!('Notification'in window))return alert('Not supported');Notification.requestPermission().then(p=>{S.set.notif=p=='granted';save();render()})},
 exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'}));a.download='forgefit-backup-'+td()+'.json';a.click()},
 imp(){$('#file').click()},reset(){if(confirm('Erase ALL data? Cannot undo.')){localStorage.removeItem(K);location.reload()}}};A[d.a]&&A[d.a]()});
document.addEventListener('change',e=>{const el=e.target,d=el.dataset,v=el.type=='checkbox'?el.checked:el.type=='number'?(el.value===''?'':+el.value):el.value;
 if(d.p){const a=d.p.split('.');let o=S;while(a.length>1)o=o[a.shift()];o[a[0]]=d.n?+v:v;save();if($('#an'))$('#an').innerHTML=anHTML();if(d.p=='set.unit')render()}
 else if(d.q){S.eq[d.q]=v;save()}
 else if(d.l){const[k,id,i,f]=d.l.split('|');S.logs[k]=S.logs[k]||{};const L=S.logs[k][id]=S.logs[k][id]||[];L[i]=L[i]||{};L[i][f]=v;save();if(f=='d'&&v)timer(S.set.timer?60:0)}
 else if(el.id=='file'){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.p||!o.logs)throw 0;S=o;save();render();alert('Imported')}catch(x){alert('Invalid backup file')}};r.readAsText(el.files[0]);el.value=''}});
setInterval(()=>{const n=new Date();if(S.set.notif&&'Notification'in window&&Notification.permission=='granted'&&n.getHours()*60+n.getMinutes()>=990&&S.ln!=td()){S.ln=td();save();const o={body:'Time to train. Open ForgeFit.',icon:'icon.png'};navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.showNotification('ForgeFit 💪',o)).catch(()=>new Notification('ForgeFit 💪',o))}},3e4);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
render();
