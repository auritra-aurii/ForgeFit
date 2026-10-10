const $=s=>document.querySelector(s),K='forgefit.v1';
const td=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let S=JSON.parse(localStorage.getItem(K)||'null')||{p:{},m:{},goals:[],eq:{},days:4,plan:null,start:Date.now(),logs:{},set:{timer:true,sound:true,vibe:true,notif:false,unit:'kg'},ln:''};
const save=()=>localStorage.setItem(K,JSON.stringify(S));
let tab='dash',sel=null;
const MEAS=['neck','shoulders','chest','biceps','forearms','waist','hips','thighs','calves'];
const GOALS=[['belly','Burn Belly Fat'],['shoulders','Build Broader Shoulders'],['chest','Bigger Chest'],['back','Wider Back'],['arms','Bigger Arms'],['legs','Leg Strength'],['calves','Calf Growth']];
const EQ=[['barbell','Barbell','bar'],['dumbbells','Dumbbells','db'],['bench','Bench','bench'],['cable','Cable Crossover','cable'],['smith','Smith Machine','mach'],['latpd','Lat Pulldown','cable'],['legpress','Leg Press','mach'],['treadmill','Treadmill','tread'],['pecdeck','Pec Deck','mach'],['pullup','Pull-up Bar','pull']];
const IC={
barbell:'<path d="M4 36h88"/><rect class="p" x="10" y="12" width="8" height="48" rx="2"/><rect class="p" x="20" y="20" width="7" height="32" rx="2"/><rect class="p" x="78" y="12" width="8" height="48" rx="2"/><rect class="p" x="69" y="20" width="7" height="32" rx="2"/><path class="a" d="M30 36h36"/>',
dumbbells:'<path d="M19 22h58M19 50h58"/><rect class="p" x="10" y="12" width="9" height="20" rx="2"/><rect class="p" x="77" y="12" width="9" height="20" rx="2"/><rect class="p" x="10" y="40" width="9" height="20" rx="2"/><rect class="p" x="77" y="40" width="9" height="20" rx="2"/><path class="a" d="M40 22h16M40 50h16"/>',
bench:'<rect class="p" x="12" y="26" width="72" height="12" rx="5"/><path d="M26 38v22M70 38v22M16 60h20M60 60h20"/><path class="a" d="M20 32h56"/>',
cable:'<path d="M20 8v56M76 8v56M20 8h56M12 64h16M68 64h16"/><circle cx="20" cy="14" r="4"/><circle cx="76" cy="14" r="4"/><path class="a" d="M20 18l14 26M76 18L62 44"/><circle class="a" cx="34" cy="46" r="3"/><circle class="a" cx="62" cy="46" r="3"/><rect class="p" x="5" y="24" width="10" height="34"/><rect class="p" x="81" y="24" width="10" height="34"/>',
smith:'<path d="M18 6v60M78 6v60M10 66h16M70 66h16M18 50h8M70 50h8"/><path d="M24 12v48M72 12v48" stroke-dasharray="3 3"/><path class="a" d="M10 36h76"/><rect class="p" x="5" y="28" width="6" height="16" rx="1"/><rect class="p" x="85" y="28" width="6" height="16" rx="1"/>',
latpd:'<path d="M16 6v60M8 66h24M16 8h48"/><circle cx="64" cy="10" r="4"/><path d="M64 14v16"/><path class="a" d="M46 30h36M46 26v8M82 26v8"/><rect class="p" x="4" y="22" width="8" height="36"/><rect class="p" x="46" y="56" width="24" height="6" rx="2"/><path d="M46 46h24M58 62v4M48 66h20"/>',
legpress:'<path d="M8 64h80M14 60L66 26"/><path class="a" d="M62 12l16 26"/><rect class="p" x="14" y="44" width="20" height="8" rx="3" transform="rotate(-32 24 48)"/><path d="M20 62v-6M60 64l8-12"/><rect class="p" x="76" y="44" width="10" height="18" rx="2"/>',
treadmill:'<rect class="p" x="6" y="52" width="68" height="9" rx="4"/><path d="M12 61l-3 5M68 61l3 5M70 52l8-34M78 18L58 26"/><rect x="62" y="6" width="24" height="12" rx="3"/><path class="a" d="M16 56h50" stroke-dasharray="4 4"/>',
pecdeck:'<rect class="p" x="34" y="44" width="28" height="8" rx="3"/><rect class="p" x="40" y="10" width="16" height="34" rx="6"/><path d="M48 52v14M36 66h24"/><path class="a" d="M42 24H22l-8 18M54 24h20l8 18"/><rect class="p" x="8" y="42" width="10" height="6" rx="2"/><rect class="p" x="78" y="42" width="10" height="6" rx="2"/>',
pullup:'<path d="M12 8v58M84 8v58M6 66h14M76 66h14M12 24l10-10M84 24L74 14"/><path class="a" d="M12 14h72"/>'};
const DESC={barbell:'Long steel bar, round plates on both ends',dumbbells:'Short hand-held bars on a rack, weight in kg',bench:'Padded flat or adjustable seat',cable:'Two tall stacks, high pulleys, handles on cables',smith:'Barbell fixed on vertical rails with hook-turn catches',latpd:'High pulley, wide bar, thigh pad + seat',legpress:'Angled sled, seat, big foot platform',treadmill:'Moving belt, console, handrails',pecdeck:'Seated machine, two swing arms at chest height',pullup:'Fixed high bar or assisted pull-up machine'};
const svg=t=>`<svg viewBox="0 0 96 72" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${IC[t]}</svg>`;
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
// id: [machine setup, breathing, primary muscles, secondary muscles]
const G={
dbbench:['Bench flat. Light bells on thighs, lie back, kick bells up to chest.','In lowering, out pressing.','Chest','Front delts, triceps'],
bbbench:['Set safety pins just above chest. Eyes under bar, feet planted. Use spotter.','In down, out up. Brace core.','Chest','Front delts, triceps'],
pushup:['Hands slightly wider than shoulders, on floor or raised bench (easier).','In down, out up.','Chest','Triceps, front delts, core'],
dbpress:['Bench back upright (or stand). Bells at shoulder height, palms forward.','Out pressing, in lowering.','Front & side delts','Triceps, upper chest, core'],
pecdeck:['Seat so handles sit at mid-chest. Move arm-start pin so arms begin slightly behind body line. Light pin.','Out as arms close, in as they open.','Chest','Front delts'],
latraise:['Light bells (2–5 kg), slight forward lean.','Out raising, in lowering.','Side delts','Traps, front delts'],
pushdown:['High pulley, rope or short bar. Light pin, step back so cable clear.','Out pushing, in returning.','Triceps','Forearms, core'],
latpd:['Adjust thigh pad snug on thighs. Light pin. Stand, grab wide bar, sit down.','Out pulling down, in returning up.','Lats','Biceps, rear delts, mid back'],
pullup:['Use assist machine (set heavy assist) or resistance band.','Out pulling up, in lowering.','Lats','Biceps, forearms, core'],
dbrow:['Bench beside you. One hand + knee on bench, bell on floor.','Out pulling, in lowering.','Lats, mid back','Biceps, rear delts'],
bbrow:['Bar on floor or low rack. Light plates only. Hinge, grip just outside knees.','Out pulling, in lowering. Brace first.','Mid back, lats','Biceps, spinal erectors, rear delts'],
cablerow:['Low pulley, close-grip handle. Feet on plate, knees soft. Light pin.','Out pulling, in returning.','Mid back, lats','Biceps, rear delts'],
dbcurl:['Light bells, feet hip-width.','Out lifting, in lowering.','Biceps','Forearms, brachialis'],
superman:['Mat on floor, forehead toward floor.','Out lifting, in lowering.','Rear delts, lower back','Glutes, traps'],
legpress:['Seat back so knees ~90° at bottom. Feet mid-platform, shoulder-width. Set safety stops. Light pin.','In lowering, out pressing.','Quads, glutes','Hamstrings, calves'],
bbsquat:['Rack bar at upper-chest height, safety bars just below squat depth. Unrack, step back 2 steps.','Big breath + brace before descent, out at top.','Quads, glutes','Hamstrings, core, lower back'],
smithsq:['Bar at upper-chest height. Feet slightly forward of bar. Set safety catches, rotate wrists to unhook.','In down, out up.','Quads, glutes','Hamstrings, core'],
goblet:['Hold one bell vertical at chest.','In down, out up.','Quads, glutes','Core, upper back'],
bwsquat:['Optional: bench behind you as depth target.','In down, out up.','Quads, glutes','Hamstrings, core'],
dbrdl:['Bells in front of thighs, feet hip-width.','In lowering, out standing.','Hamstrings, glutes','Lower back, forearms'],
lunge:['Clear 5 m of floor. Hold rack/wall if balance shaky.','In stepping, out rising.','Quads, glutes','Hamstrings, calves, core'],
calf:['Edge of step or flat floor. Hold wall.','Out rising, in lowering.','Calves (gastrocnemius)','Soleus, ankle stabilisers'],
plank:['Mat on floor.','Steady breaths, never hold.','Abs','Shoulders, glutes'],
deadbug:['Mat. Lower back pressed flat.','Out as limbs lower, in on return.','Deep abs','Hip flexors'],
tread:['Clip safety key to clothes. Start 3–5 km/h, incline 3–6%.','Easy conversational breathing.','Cardiovascular system','Calves, glutes, hamstrings']};
const SAFE={push:'After 1.5 years off: tendons/joints lag muscle. Shoulder blades down and back. Stop 3–4 reps short of failure for 2 weeks. DOMS 48h is normal, sharp joint pain is not: stop.',pull:'After 1.5 years off: elbows and shoulders need time. Smooth reps, no yanking. Stop 3–4 reps short of failure. Sharp pain = stop.',legs:'After 1.5 years off: knees and lower back need time. Knees follow toes, back neutral. Light load, stop 3–4 reps short of failure. Expect heavy DOMS in 48h.',core:'Keep neck relaxed, lower back neutral. Stop if lower back hurts.',cardio:'Easy pace first week. Stop on dizziness, chest pain, shin pain.'};
const guide=e=>{const q=G[e[0]]||['','','',''],T=['Setup','Steps','Muscles','Safety'];
return`<details class=guide><summary>Guide: setup · steps · muscles · safety</summary><div class=tabs>${T.map((t,i)=>`<button class="ghost ${i?'':'on'}" data-a=gt data-s=${i}>${t}</button>`).join('')}</div><div class="gp on" data-s=0><p>${q[0]}</p></div><div class=gp data-s=1><ol>${e[6].split('|').map(s=>`<li>${s}</li>`).join('')}</ol><p><b>Breathing:</b> ${q[1]}</p></div><div class=gp data-s=2><p><b>Primary:</b> ${q[2]}</p><p><b>Secondary:</b> ${q[3]}</p></div><div class=gp data-s=3><p>⚠ ${e[7]}</p><p>${SAFE[e[2]]}</p></div></details>`};
const cap=k=>k[0].toUpperCase()+k.slice(1);
const RNG={neck:[.215,.245],shoulders:[.62,.70],chest:[.53,.60],biceps:[.19,.23],forearms:[.15,.17],waist:[.40,.50],hips:[.52,.57],thighs:[.30,.36],calves:[.20,.23]};
const FEM={neck:.85,shoulders:.9,chest:.9,biceps:.85,forearms:.88,waist:.9,hips:1.05,thighs:1.05,calves:.95};
const TAG={shoulders:'shoulders',chest:'chest',biceps:'arms',forearms:'arms',thighs:'legs',calves:'calves',waist:'belly'};
function stat(k){const h=S.p.height,v=S.m[k];if(!h||!v)return null;const f=S.p.gender=='female'?FEM[k]:1,lo=RNG[k][0]*h*f,hi=RNG[k][1]*h*f;return{v,lo,hi,s:v<lo?-1:v>hi?1:0}}
const isBad=(k,s)=>k=='waist'?s.s>0:s.s<0;
function badge(k){const s=stat(k);if(!s)return'<span class=m>add height + value</span>';
 const bad=isBad(k,s),t=bad?'Priority':s.s?(s.s<0?'Below range':'Above range'):'On target',c=bad?'bad':s.s?'up':'ok',a=s.lo*.85,R=s.hi*1.15-a,pc=x=>Math.max(0,Math.min(100,(x-a)/R*100));
 return`<span class="bdg ${c}">${t}</span><span class=m>${s.lo.toFixed(0)}–${s.hi.toFixed(0)} cm</span><div class=mt><i style="left:${pc(s.lo)}%;width:${pc(s.hi)-pc(s.lo)}%"></i><b style="left:${pc(s.v)}%"></b></div>`}
const mf=k=>`<label class="f">${cap(k)}<input data-p="m.${k}" type="number" step="any" inputmode="decimal" value="${S.m[k]??''}"><span class=bd id="bd-${k}">${badge(k)}</span></label>`;
const have=e=>e.split('+').every(x=>x=='bw'||S.eq[x]);
const weeks=()=>Math.floor((Date.now()-S.start)/6048e5),found=()=>weeks()<2;
const DT={full:[['push',1],['pull',1],['legs',2],['core',1]],upper:[['push',2],['pull',2]],lower:[['legs',4],['core',1]],push:[['push',4]],pull:[['pull',4]],legs:[['legs',3],['core',1]]};
const SP={2:['full','full'],3:['full','full','full'],4:['upper','lower','upper','lower'],5:['push','pull','legs','upper','lower'],6:['push','pull','legs','push','pull','legs']};
const DAYS={2:[1,4],3:[1,3,5],4:[1,2,4,5],5:[1,2,3,5,6],6:[1,2,3,4,5,6]};
const NM={full:'Full Body',upper:'Upper',lower:'Lower',push:'Push',pull:'Pull',legs:'Legs'};
function analyze(){const{gender,height:h,weight:w}=S.p,m=S.m,r={flags:[],ratios:[],pri:[]},fl=(t,x)=>r.flags.push([t,x]);
 if(h&&w){const q=(h/100)**2;r.bmi=w/q;r.lo=18.5*q;r.hi=24.9*q}
 if(h&&m.waist){const x=m.waist/h;r.ratios.push(['Waist-to-Height',x.toFixed(2),'under 0.50']);if(x>=.5)fl('belly','Waist-to-height ≥ 0.50: central fat. Core + cardio prioritised.')}
 if(m.waist&&m.chest){const x=m.waist/m.chest;r.ratios.push(['Waist-to-Chest',x.toFixed(2),'about 0.75-0.80']);if(x>.85)fl('belly','Waist large vs chest.')}
 if(m.waist&&m.hips){const x=m.waist/m.hips;r.ratios.push(['Waist-to-Hip',x.toFixed(2),gender=='female'?'under 0.85':'under 0.90'])}
 if(m.waist&&m.shoulders){const x=m.shoulders/m.waist;r.ratios.push(['Golden Ratio (shoulders÷waist)',x.toFixed(2),'target 1.62']);if(x<1.45)fl('shoulders','Shoulders narrow vs waist: extra delt/back volume.')}
 if(m.biceps&&m.calves&&m.calves<m.biceps*.92)fl('calves','Calves lag behind biceps.');
 if(m.waist&&m.thighs&&m.thighs<m.waist*.58)fl('legs','Thighs small vs waist: leg focus.');
 if(m.biceps&&m.forearms&&m.forearms<m.biceps*.75)fl('arms','Forearms lag behind biceps.');
 Object.keys(RNG).forEach(k=>{const s=stat(k);if(s&&isBad(k,s)){r.pri.push(k);if(TAG[k])fl(TAG[k],`${cap(k)} ${s.s>0?'above':'below'} target range (${s.lo.toFixed(0)}–${s.hi.toFixed(0)} cm).`)}});
 return r}
const focus=()=>[...new Set([...S.goals,...analyze().flags.map(f=>f[0])])];
function build(){const F=focus(),used={},d=S.days;
 S.plan=SP[d].map((t,i)=>{const ex=[];
  DT[t].forEach(([g,n])=>{EX.filter(e=>e[2]==g&&have(e[4])&&!ex.includes(e[0])).map(e=>[e,e[5].split(',').filter(x=>F.includes(x)).length*3-(used[e[0]]||0)+Math.random()*.5]).sort((a,b)=>b[1]-a[1]).slice(0,n).forEach(([e])=>{ex.push(e[0]);used[e[0]]=(used[e[0]]||0)+1})});
  if(F.includes('belly')&&S.eq.treadmill&&i%2==0)ex.push('tread');
  return{name:`Day ${i+1} · ${NM[t]}`,ex}});
 S.start=Date.now();save()}
const todayIdx=()=>S.plan?DAYS[S.plan.length].indexOf(new Date().getDay()||7):-1;
const nextIdx=()=>{const t=new Date().getDay()||7,i=DAYS[S.plan.length].findIndex(x=>x>t);return i<0?0:i};
const prog=di=>{const L=S.logs[td()+':'+di]||{},n=found()?2:3;let t=0,c=0;S.plan[di].ex.forEach(id=>{const a=L[id]||[];t+=Math.max(n,a.length);a.forEach(s=>s&&s.d&&c++)});return[c,t]};
const bar=di=>{const[n,t]=prog(di),p=t?Math.round(n/t*100):0;return`<div class=pbw><div class=pbf style="width:${p}%"></div></div><div class=m>${n}/${t} sets done · ${p}%</div>`};
const g=p=>p.split('.').reduce((o,k)=>o&&o[k],S);
const fld=(p,l,t='number')=>`<label class="f">${l}<input data-p="${p}" type="${t}" step="any" inputmode="decimal" value="${g(p)??''}"></label>`;
const sw=(p,l)=>`<div class="card eq"><b>${l}</b><input class="sw" type="checkbox" data-p="${p}" ${g(p)?'checked':''}></div>`;
function anHTML(){const a=analyze();let h=(a.pri.length?'<h2>Priority areas</h2>'+a.pri.map(k=>`<span class="chip pri">${k}</span>`).join(''):'')+'<h2>Analysis</h2>';
 if(a.bmi)h+=`<div class="card grid"><div class="stat"><b>${a.bmi.toFixed(1)}</b><span>BMI</span></div><div class="stat"><b>${a.lo.toFixed(0)}–${a.hi.toFixed(0)}kg</b><span>Healthy weight range</span></div></div>`;
 h+=a.ratios.map(r=>`<div class="card row"><span>${r[0]}</span><b style="text-align:right">${r[1]} <span class=m>${r[2]}</span></b></div>`).join('');
 h+=a.flags.length?a.flags.map(f=>`<div class="warn">⚠ ${f[1]}</div>`).join(''):'<p class=m>Enter measurements to see lagging areas. Flags auto-prioritise exercises.</p>';return h}
const V={
dash(){const a=analyze(),n=Object.keys(S.logs).filter(k=>Object.values(S.logs[k]).some(s=>s.some(x=>x&&x.d))).length,w=weeks(),ti=todayIdx(),di=S.plan?(ti>=0?ti:nextIdx()):-1;
 const c=!S.plan?'<p>No routine yet.</p><button data-t=rout>Build routine</button>':`<b>${ti>=0?'Today':'Rest day · Next up'}: ${S.plan[di].name}</b><div class=m>${S.plan[di].ex.map(id=>EX.find(x=>x[0]==id)[1]).join(' · ')}</div><div id=pb class=pbx>${bar(di)}</div><button data-a=go data-d=${di}>${ti>=0?"Start Today's Workout":'Train Anyway'}</button>`;
 return`<h1>ForgeFit</h1><div class=card><b>Week ${w+1}</b> · ${w<2?'Foundation & Re-conditioning':'Main Phase'}</div><div class=card>${c}</div>
 <div class="card grid"><div class=stat><b>${n}</b><span>Sessions logged</span></div><div class=stat><b>${a.bmi?a.bmi.toFixed(1):'–'}</b><span>BMI</span></div></div>
 <h2>Focus areas</h2>${focus().map(f=>`<span class="chip on">${(GOALS.find(x=>x[0]==f)||[0,f])[1]}</span>`).join('')||'<p class=m>Set goals in Measurements.</p>'}`},
meas(){return`<h1>Measurements</h1><h2>Basics</h2><div class=grid>${fld('p.age','Age')}<label class=f>Gender<select data-p=p.gender><option value="">–</option>${['male','female'].map(x=>`<option ${S.p.gender==x?'selected':''}>${x}</option>`).join('')}</select></label>${fld('p.height','Height (cm)')}${fld('p.weight','Weight (kg)')}</div>
 <h2>Body (cm)</h2><div class=grid>${MEAS.map(mf).join('')}</div>
 <h2>Goals</h2>${GOALS.map(([k,l])=>`<span class="chip ${S.goals.includes(k)?'on':''}" data-a=goal data-k=${k}>${l}</span>`).join('')}<div id=an>${anHTML()}</div>`},
equip(){return`<h1>Equipment</h1><p class=m>Toggle what your gym has. Routine uses only available gear.</p>${EQ.map(([id,n,i])=>`<div class=card><div class=eq>${svg(id)}<div class=ed><b>${n}</b><span class=m>${DESC[id]}</span></div><input class=sw type=checkbox data-q=${id} ${S.eq[id]?'checked':''}></div><details><summary>Exercises using it</summary><p>${EX.filter(e=>e[4].includes(id)).map(e=>e[1]).join(', ')}</p></details></div>`).join('')}`},
rout(){let h='<h1>Routine</h1><div class=card><div class=row><label class=f>Days / week<select data-p=days data-n=1>'+[2,3,4,5,6].map(x=>`<option ${S.days==x?'selected':''}>${x}</option>`).join('')+`</select></label><button data-a=gen>${S.plan?'Rebuild':'Generate'}</button></div><p class=m>Weeks 1–2 = Foundation: 2 sets, light, stop 3–4 reps short of failure. Then 3 sets.</p></div>`;
 if(!S.plan)return h;const di=sel??(todayIdx()>=0?todayIdx():nextIdx()),key=td()+':'+di;
 h+=S.plan.map((d,i)=>`<span class="chip ${i==di?'on':''}" data-a=day data-d=${i}>${d.name}</span>`).join('');
 h+=`<div class=card><div class=m>⏱ <span id=el data-k="${key}">${S.ses&&S.ses.key==key?fmt(Date.now()-S.ses.start):'0:00'}</span> · tick a set to start rest timer</div><div id=pb>${bar(di)}</div></div>`;const n=found()?2:3;
 return h+(S.plan[di].ex.length?'':'<p class=m>No available exercises. Mark equipment.</p>')+S.plan[di].ex.map(id=>exCard(id,key,n)).join('')+`<button class=fin data-a=fin data-d=${di}>Finish Workout</button>`},
set(){return`<h1>Settings</h1>${sw('set.timer','Rest timer')}${sw('set.sound','Timer sound')}${sw('set.vibe','Timer vibration')}<div class="card row"><span>Weight unit</span><select data-p=set.unit><option ${S.set.unit=='kg'?'selected':''}>kg</option><option ${S.set.unit=='lbs'?'selected':''}>lbs</option></select></div>
 <div class=card><b>Daily 4:30 PM reminder</b><p class=m>Fires only while app is open or installed and running. Status: ${'Notification' in window?Notification.permission:'unsupported'}</p><button data-a=notif>Enable reminders</button></div>
 <h2>Backup</h2><div class=row><button data-a=exp>Export Backup JSON</button><button class=ghost data-a=imp>Import Backup JSON</button></div><h2>Danger</h2><button class=red data-a=reset>Erase all data</button>`}};
const TABS=[['dash','Home','📊'],['meas','Body','📏'],['equip','Gear','🏋️'],['rout','Routine','📅'],['set','Settings','⚙️']];
function render(){$('#app').innerHTML=V[tab]();$('#nav').innerHTML=TABS.map(([k,l,i])=>`<button data-t=${k} class="${k==tab?'on':''}"><i>${i}</i>${l}</button>`).join('');restUI()}
const fmt=ms=>{const s=Math.floor(ms/1e3),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}h ${m}m`:`${m}:${String(s%60).padStart(2,'0')}`};
const MG=[[/spinal|lower back/,'Lower Back'],[/chest/,'Chest'],[/delt/,'Shoulders'],[/tricep/,'Triceps'],[/bicep|brachialis/,'Biceps'],[/lat|trap|back/,'Back'],[/quad/,'Quads'],[/hamstring/,'Hamstrings'],[/glute/,'Glutes'],[/calf|calves|soleus/,'Calves'],[/abs|core|hip flexor/,'Core'],[/forearm/,'Forearms'],[/cardio/,'Cardio']];
const mg=s=>{s=s.toLowerCase();const r=MG.find(x=>x[0].test(s));return r&&r[1]};
function summ(key){const L=S.logs[key]||{};let vol=0,sets=0;const m={};Object.keys(L).forEach(id=>{const q=G[id]||['','','',''];L[id].forEach(s=>{if(!s||!s.d||s.t=='W')return;sets++;vol+=(+s.w||0)*(+s.r||0);new Set((q[2]+','+q[3]).split(',').map(mg).filter(Boolean)).forEach(x=>m[x]=(m[x]||0)+1)})});return{vol,sets,m}}
function prev(id,i,cur){const ks=Object.keys(S.logs).filter(k=>k!=cur).sort().reverse();for(const k of ks){const s=((S.logs[k]||{})[id]||[])[i];if(s&&s.d&&s.w!=null&&s.w!=='')return s}return null}
function exCard(id,key,n){const e=EX.find(x=>x[0]==id),L=(S.logs[key]||{})[id]||[],c=Math.max(n,L.length),u=S.set.unit;
 let r=`<div class=card><b>${e[1]}</b><div class=m>${e[3]} · ${found()?'2×12 light':'3×8–12'}</div>${guide(e)}<div class="set hd"><span>SET</span><span>TYPE</span><span>${u.toUpperCase()}</span><span>REPS</span><span>✓</span></div>`;
 for(let i=0;i<c;i++){const s=L[i]||{},t=s.t||'N',p=prev(id,i,key),b=`${key}|${id}|${i}|`;
  r+=`<div class="set ${s.d?'done':''}"><span class=sn>${i+1}</span><button class="ty ${t}" data-a=ty data-l="${b}t">${t}</button><input type=number inputmode=decimal data-l="${b}w" placeholder="${p?p.w+' '+u:u}" value="${s.w??''}"><input type=number inputmode=numeric data-l="${b}r" placeholder="${p?'× '+p.r:'reps'}" value="${s.r??''}"><input type=checkbox class=ck data-l="${b}d" ${s.d?'checked':''}></div><div class=stp>${[['w',-2.5,'−2.5'],['w',2.5,'+2.5'+u],['w',5,'+5'+u],['r',-1,'−1'],['r',1,'+1 rep']].map(x=>`<button class=ghost data-a=step data-l="${b}${x[0]}" data-v=${x[1]}>${x[2]}</button>`).join('')}</div>`}
 return r+`<button class=ghost data-a=addset data-k="${key}" data-id=${id}>+ Add Set</button></div>`}
let tEnd=0;
function ring(){if(S.set.sound)try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();o.stop(c.currentTime+.5)}catch(e){}if(S.set.vibe&&navigator.vibrate)navigator.vibrate([250,120,250])}
function restUI(){const r=$('#rest'),on=S.set.timer&&S.ses;r.hidden=!on;document.body.classList.toggle('resting',!!on);if(!on)return;r.innerHTML='<div class=rb><b id=rl>Rest</b><div class=rbtn><button class=ghost data-a=tm>−30s</button><button class=ghost data-a=tp>+30s</button><button data-a=t60>60s</button><button data-a=t90>90s</button><button class=red data-a=tx>Skip</button></div></div>'}
function timer(s){if(!S.set.timer)return;tEnd=Date.now()+s*1e3;restUI()}
setInterval(()=>{const l=Math.ceil((tEnd-Date.now())/1e3),e=$('#rl');if(e){if(l>0)e.textContent=l+'s';else{if(tEnd){tEnd=0;ring()}e.textContent='Rest'}}const t=$('#el');if(t&&S.ses&&t.dataset.k==S.ses.key)t.textContent=fmt(Date.now()-S.ses.start)},250);
document.addEventListener('click',e=>{const el=e.target.closest('[data-t],[data-a]');if(!el)return;const d=el.dataset;
 if(d.t){tab=d.t;return render()}
 const A={gt(){const c=el.closest('.guide');c.querySelectorAll('.tabs button,.gp').forEach(x=>x.classList.toggle('on',x.dataset.s==d.s))},go(){tab='rout';sel=+d.d;const k=td()+':'+d.d;if(!S.ses||S.ses.key!=k)S.ses={key:k,start:Date.now()};save();render()},gen(){build();sel=null;render()},day(){sel=+d.d;render()},
 goal(){S.goals=S.goals.includes(d.k)?S.goals.filter(x=>x!=d.k):[...S.goals,d.k];save();el.classList.toggle('on');$('#an').innerHTML=anHTML()},
 t60(){S.set.rest=60;save();timer(60)},t90(){S.set.rest=90;save();timer(90)},tm(){if(tEnd>Date.now())tEnd=Math.max(Date.now()+1e3,tEnd-3e4)},tp(){tEnd=Math.max(Date.now(),tEnd)+3e4},tx(){tEnd=0;restUI()},
ty(){const[k,id,i]=d.l.split('|');S.logs[k]=S.logs[k]||{};const L=S.logs[k][id]=S.logs[k][id]||[];L[i]=L[i]||{};const t={W:'N',N:'F',F:'W'}[L[i].t||'N'];L[i].t=t;save();el.textContent=t;el.className='ty '+t},
step(){const inp=document.querySelector('input[data-l="'+d.l+'"]'),[k,id,i,f]=d.l.split('|'),p=prev(id,+i,k);let c=+inp.value;if(!inp.value&&p)c=+p[f];inp.value=Math.max(0,Math.round((c+ +d.v)*100)/100);inp.dispatchEvent(new Event('change',{bubbles:true}))},
addset(){S.logs[d.k]=S.logs[d.k]||{};const L=S.logs[d.k][d.id]=S.logs[d.k][d.id]||[];L[Math.max(found()?2:3,L.length)]={};save();const y=scrollY;render();scrollTo(0,y)},
fin(){const key=td()+':'+d.d,r=summ(key),dur=S.ses&&S.ses.key==key?Date.now()-S.ses.start:0,e=Object.entries(r.m).sort((a,b)=>b[1]-a[1]),mx=e.length?e[0][1]:1;S.hist=S.hist||[];S.hist.push({date:td(),vol:r.vol,sets:r.sets,dur});S.ses=null;save();tEnd=0;restUI();
 $('#sum').hidden=false;$('#sum').innerHTML=`<div class=box><h2>Workout Complete 🎉</h2><div class=grid><div class=stat><b>${Math.round(r.vol).toLocaleString()}</b><span>Volume (${S.set.unit})</span></div><div class=stat><b>${fmt(dur)}</b><span>Duration</span></div></div><p class=m>${r.sets} working sets (warm-ups excluded)</p><h2>Sets per muscle</h2>${e.map(([k,v])=>`<div class=mb><span>${k}</span><div class=mbt><i style="width:${v/mx*100}%"></i></div><b>${v}</b></div>`).join('')||'<p class=m>No sets completed.</p>'}<button data-a=cs>Done</button></div>`},
cs(){$('#sum').hidden=true;tab='dash';render()},
 notif(){if(!('Notification'in window))return alert('Not supported');Notification.requestPermission().then(p=>{S.set.notif=p=='granted';save();render()})},
 exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'}));a.download='forgefit-backup-'+td()+'.json';a.click()},
 imp(){$('#file').click()},reset(){if(confirm('Erase ALL data? Cannot undo.')){localStorage.removeItem(K);location.reload()}}};A[d.a]&&A[d.a]()});
document.addEventListener('change',e=>{const el=e.target,d=el.dataset,v=el.type=='checkbox'?el.checked:el.type=='number'?(el.value===''?'':+el.value):el.value;
 if(d.p){const a=d.p.split('.');let o=S;while(a.length>1)o=o[a.shift()];o[a[0]]=d.n?+v:v;save();if($('#an'))$('#an').innerHTML=anHTML();if(/^(m\.|p\.(height|gender))/.test(d.p))MEAS.forEach(k=>{const b=$('#bd-'+k);if(b)b.innerHTML=badge(k)});if(d.p=='set.unit')render();if(d.p=='set.timer')restUI()}
 else if(d.q){S.eq[d.q]=v;save()}
 else if(d.l){const[k,id,i,f]=d.l.split('|');S.logs[k]=S.logs[k]||{};const L=S.logs[k][id]=S.logs[k][id]||[];L[i]=L[i]||{};L[i][f]=v;
 if(f=='d'){const row=el.closest('.set');row.classList.toggle('done',v);if(v){if(!S.ses||S.ses.key!=k)S.ses={key:k,start:Date.now()};const p=prev(id,+i,k),wi=row.querySelector('[data-l$="|w"]'),ri=row.querySelector('[data-l$="|r"]');if(p){if(L[i].w==null||L[i].w==='')wi.value=L[i].w=p.w;if(L[i].r==null||L[i].r==='')ri.value=L[i].r=p.r}timer(S.set.rest||60)}restUI()}
 save();if($('#pb'))$('#pb').innerHTML=bar(+k.split(':')[1])}
 else if(el.id=='file'){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.p||!o.logs)throw 0;S=o;save();render();alert('Imported')}catch(x){alert('Invalid backup file')}};r.readAsText(el.files[0]);el.value=''}});
setInterval(()=>{const n=new Date();if(S.set.notif&&'Notification'in window&&Notification.permission=='granted'&&n.getHours()*60+n.getMinutes()>=990&&S.ln!=td()){S.ln=td();save();const o={body:'Time to train. Open ForgeFit.',icon:'icon.png'};navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.showNotification('ForgeFit 💪',o)).catch(()=>new Notification('ForgeFit 💪',o))}},3e4);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
render();
