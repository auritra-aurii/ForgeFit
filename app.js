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
IC.rack='<path d="M20 6v60M76 6v60M12 66h16M68 66h16M8 24h80"/><path class="a" d="M20 24h10M76 24h-10"/><path d="M20 50h12M76 50h-12" stroke-dasharray="3 2"/><rect class="p" x="4" y="14" width="6" height="20" rx="2"/><rect class="p" x="86" y="14" width="6" height="20" rx="2"/>';
const ADJ={
legpress:[[20,50,'Backrest / seat: slide so knees reach about 90° at the bottom, then pin it'],[66,24,'Foot platform: feet mid-plate, shoulder-width'],[82,52,'Weight pin / plates: start light'],[10,66,'Safety stop levers: set before rep 1']],
latpd:[[58,58,'Seat height: feet flat on floor'],[58,46,'Thigh pad: lock down snug over thighs (knob or pin)'],[64,30,'Wide bar: grip just wider than shoulders'],[8,40,'Weight pin: light stack']],
pecdeck:[[48,48,'Seat height: handles at mid-chest (pin under seat)'],[48,26,'Backrest: shoulder blades flat'],[18,30,'Arm-start pin: arms begin slightly behind body'],[80,30,'Weight pin: light stack']],
cable:[[20,36,'Cable height notch: low for rows, high for pushdowns'],[34,48,'Attachment: rope, bar or handle clipped on'],[10,40,'Weight pin: light stack']],
smith:[[18,36,'Bar hooks: set bar at upper chest, twist wrists to unhook'],[18,50,'Safety catches: just below your lowest rep'],[86,24,'Plates: add only after bar-only reps feel easy']],
rack:[[24,24,'J-hooks: bar at upper-chest height, same notch both sides'],[24,50,'Safety arms: just below your lowest rep'],[84,24,'Collars + plates: start with empty bar']],
bench:[[48,32,'Pad angle: flat for bench, upright (80–90°) for presses'],[24,58,'Feet planted flat. Keep bench clear of other lifters']],
dumbbells:[[14,22,'Pick bells from rack by number on end plate'],[48,50,'Both bells same weight. Start light']],
treadmill:[[74,12,'Console: speed and incline. Clip safety key to clothes'],[40,57,'Belt: start 3–5 km/h, incline 3–6%']],
pullup:[[48,14,'Bar height / assist pin: more assist weight = easier'],[18,40,'Step platform: step down under control']]};
// spine, shoulders, feet, grip
const POST={dbbench:['Natural arch, glutes on bench','Blades pinched down and back, no shrug','Flat on floor, driving down','Bells over mid-chest, wrists straight, forearms vertical'],bbbench:['Slight natural arch, hips down','Blades pinched, bar over eyes','Flat, knees ~90°, heels under knees','Just outside shoulders, wrists stacked over elbows, thumbs around bar'],pushup:['Straight line head to heels','Hands under shoulders, blades flat','Toes (or knees), hip-width','Slightly wider than shoulders, fingers forward'],dbpress:['Tall, ribs down, glutes squeezed','Blades down, bells just above shoulder','Hip-width, firm','Palms forward, elbows ~75° from torso'],pecdeck:['Back flat on pad, chest up','Shoulders down, not rolling forward','Flat on floor','Handles at chest height, elbows soft'],latraise:['Tall, slight forward lean','Shrug off, lead with elbows','Hip-width','Relaxed grip, pinkies slightly up'],pushdown:['Tall, small forward lean','Shoulders down, elbows pinned to ribs','Hip-width or staggered','Shoulder-width, wrists neutral'],latpd:['Slight lean back (~10°), chest up','Pull blades down, no shrug','Flat, thighs locked under pad','Just wider than shoulders, thumbs wrapped'],pullup:['Slight hollow body','Pack shoulders down before pulling','Legs together','Just wider than shoulders, overhand'],dbrow:['Flat back, parallel to floor','Shoulder away from ear, blade moves back','Free foot planted, hip-width','Neutral grip, bell hangs under shoulder'],bbrow:['Hinged ~45°, flat back','Blades back, neck neutral','Shoulder-width, soft knees','Just outside knees, overhand'],cablerow:['Tall, small lean only','Shoulders down, pull blades together','Flat on plate, knees soft','Close neutral grip, wrists straight'],dbcurl:['Tall, ribs down','Shoulders back, no shrug','Hip-width','Palms up, elbows pinned'],superman:['Neck neutral, eyes down','Arms in Y, blades back','Legs straight','Thumbs up'],legpress:['Whole back and hips on pad','Relaxed, down','Shoulder-width, mid-platform, toes slightly out','Light hold on side handles'],bbsquat:['Neutral spine, chest up','Bar on traps, blades tight','Shoulder-width, toes ~20° out','Just outside shoulders, wrists straight'],smithsq:['Neutral spine, chest up','Bar on traps, blades tight','Slightly ahead of bar, shoulder-width','Just outside shoulders'],goblet:['Tall, chest up','Elbows tucked inside knees','Shoulder-width, toes ~20° out','Bell cupped at chest'],bwsquat:['Neutral spine','Arms forward for balance','Shoulder-width, toes out','No grip: hands clasped in front'],dbrdl:['Flat back, hinge at hips','Shoulders back and down','Hip-width, soft knees','Bells close to thighs'],lunge:['Upright torso','Shoulders level','Long stride, front heel planted','Hands on hips or bells at sides'],calf:['Tall, ribs stacked','Relaxed','Balls of feet, hip-width','Hand on wall for balance'],plank:['Straight line head to heels','Shoulders over elbows','Hip-width','Forearms parallel'],deadbug:['Lower back pressed to floor','Shoulders relaxed','Knees 90° over hips','Arms vertical'],tread:['Tall, slight forward lean','Relaxed, arms swing','Heel-to-toe strides','Light touch on rails only if needed']};
const BR={push:'Exhale dynamically as you press up (1–2s). Inhale slowly over 3 seconds as you lower. Never hold your breath.',pull:'Exhale as you pull (1–2s). Inhale slowly over 3 seconds as you return to the start.',legs:'Inhale and brace your core, then lower over 3 seconds. Exhale forcefully as you drive up past the hardest point.',core:'Steady breathing. Exhale on effort, inhale on return. Never hold your breath.',cardio:'Easy rhythm: in for 3 steps, out for 3 steps. If you cannot talk, slow down.'};
const JNT={push:'Elbows 45–75° from torso, never flared to 90°. Do not slam elbows into lockout.',pull:'Keep elbows close to body, shoulders down. No shrugging or jerking.',legs:'Knees track over toes, never cave inward. Stop at depth where back stays neutral.',core:'Neck neutral, lower back never arching off floor.',cardio:'Soft knees and ankles. Do not death-grip rails.'};
const EGO='If you swing, bounce, arch or shorten the range to finish a rep, drop the load 10–20%. Ego lifting after a long break is the fastest way to get hurt.';
const eqk=e=>{const q=e[4];return q.includes('bench')?'bench':q.includes('barbell')?'rack':q=='bw'?'':q.split('+')[0]};
const adjSvg=k=>{const a=ADJ[k];if(!a)return'<p class=m>No machine. Clear floor space and a mat if needed.</p>';return`<svg class=adj viewBox="0 0 96 72" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${IC[k]}${a.map((c,i)=>`<circle class=pl style="animation-delay:${i*.3}s" cx="${c[0]}" cy="${c[1]}" r="4.5"/><circle class=cl cx="${c[0]}" cy="${c[1]}" r="4.5"/><text class=cn x="${c[0]}" y="${c[1]+2}">${i+1}</text>`).join('')}</svg><ol class=lg>${a.map(c=>`<li>${c[2]}</li>`).join('')}</ol>`};
const guide=e=>{const q=G[e[0]]||['','','',''],p=POST[e[0]]||['','','',''],T=['Adjust','Posture','Move','Breath','Safety','Muscles'];
return`<div class=guide><div class=tabs>${T.map((t,i)=>`<button class="ghost ${i?'':'on'}" data-a=gt data-s=${i}>${t}</button>`).join('')}</div>
<div class="gp on" data-s=0><p>${q[0]}</p>${adjSvg(eqk(e))}</div>
<div class=gp data-s=1>${['Spine','Shoulders','Feet','Grip'].map((l,i)=>`<label class=ckl><input type=checkbox><span><b>${l}:</b> ${p[i]}</span></label>`).join('')}</div>
<div class=gp data-s=2><ol>${e[6].split('|').map(s=>`<li>${s}</li>`).join('')}</ol></div>
<div class=gp data-s=3><p><b>Cadence:</b> ${BR[e[2]]}</p><p><b>This lift:</b> ${q[1]}</p></div>
<div class=gp data-s=4><p>⚠ ${e[7]}</p><p><b>Joint angles:</b> ${JNT[e[2]]}</p><p>${SAFE[e[2]]}</p><p><b>Ego check:</b> ${EGO}</p></div>
<div class=gp data-s=5>${mmap(e)}<p><b>Primary:</b> ${q[2]}</p><p><b>Secondary:</b> ${q[3]}</p></div></div>`};
// animated demos: 4s loop = 1s effort (exhale) + 3s controlled return (inhale)
const dO=(x,y)=>`transform-origin:${x}px ${y}px`;
const dR=(x,y,a,b,i,c='rk')=>`<g class="${c}" style="${dO(x,y)};--a0:${a}deg;--a1:${b}deg">${i}</g>`;
const dT=(a,b,c,d,i)=>`<g class=tk style="--x0:${a}px;--y0:${b}px;--x1:${c}px;--y1:${d}px">${i}</g>`;
const dS=(x,y,a,b,c,d,i)=>`<g class=sk style="${dO(x,y)};--sx0:${a};--sy0:${b};--sx1:${c};--sy1:${d}">${i}</g>`;
const dL=(a,b,c,d,k='')=>`<line class="${k}" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
const dH=(x,y)=>`<circle cx="${x}" cy="${y}" r="6"/>`;
const dB=(x,y,r=4)=>`<circle class=a cx="${x}" cy="${y}" r="${r}"/>`;
const DM={
bench:()=>`<path d="M14 58h84M24 58v28M88 58v28"/>${dH(24,48)}${dL(32,52,76,52)}${dL(76,52,92,60)}${dL(92,60,92,86)}${dS(40,52,1,.2,1,1,dL(40,52,40,20))}${dT(0,26,0,0,dL(26,20,54,20,'a'))}`,
pushup:()=>`${dS(34,84,1,.47,1,1,dL(34,84,34,60))}${dR(100,84,-11,0,dL(100,84,34,60)+dH(26,57))}`,
ohp:()=>`${dH(60,16)}${dL(60,24,60,54)}${dL(60,54,54,86)}${dL(60,54,66,86)}${dS(60,30,1,.29,1,1,dL(60,30,60,2))}${dT(0,20,0,0,dL(44,2,76,2,'a'))}`,
fly:()=>`${dH(60,16)}${dL(60,24,60,62)}${dL(46,68,74,68)}${dL(60,62,60,86)}${dS(50,34,1,1,.2,1,dL(50,34,18,34,'a'))}${dS(70,34,1,1,.2,1,dL(70,34,102,34,'a'))}`,
lat:()=>`${dH(60,14)}${dL(60,22,60,56)}${dL(52,28,68,28)}${dL(60,56,54,86)}${dL(60,56,66,86)}${dR(52,28,0,80,dL(52,28,52,52)+dB(52,55,3.5))}${dR(68,28,0,-80,dL(68,28,68,52)+dB(68,55,3.5))}`,
pd:()=>`${dH(50,16)}${dL(50,24,50,56)}${dL(50,56,45,86)}${dL(50,56,56,86)}${dL(50,30,52,54)}${dR(52,54,-90,0,dL(52,54,52,76)+dB(52,79,3.5))}<circle cx="70" cy="6" r="3"/>`,
pull:()=>`${dH(56,28)}${dL(56,36,56,66)}${dL(44,70,78,70)}${dL(56,66,80,66)}${dL(80,66,80,86)}${dS(56,4,1,.19,1,1,dL(56,4,56,36))}${dS(56,40,1,1,1,.13,dL(56,40,56,10))}${dT(0,0,0,26,dL(42,10,70,10,'a'))}`,
row:()=>`${dH(50,28)}${dL(50,36,50,66)}${dL(40,70,76,70)}${dL(50,66,80,66)}${dL(80,66,86,84)}${dS(50,42,1,1,.15,1,dL(50,42,76,42))}${dT(0,0,-22,0,dL(76,34,76,50,'a'))}${dS(112,48,1,1,1.6,1,dL(112,48,76,42,'a'))}`,
curl:()=>`${dH(56,16)}${dL(56,24,56,56)}${dL(56,56,50,86)}${dL(56,56,62,86)}${dL(56,30,58,54)}${dR(58,54,0,-130,dL(58,54,58,76)+dB(58,79))}`,
lp:()=>`<path d="M16 76L102 26"/>${dL(28,62,16,40)}${dH(12,33)}${dR(28,62,-35,0,dL(28,62,49,50)+dR(49,50,85,0,dL(49,50,70,38)))}${dT(-9.3,10.4,0,0,dL(66,31,74,45,'a')+'<rect class=p x="74" y="33" width="8" height="16"/>')}`,
squat:()=>dR(60,86,30,0,dL(60,86,60,64)+dR(60,64,-120,0,dL(60,64,60,40)+dR(60,40,120,0,dL(60,40,60,16)+dL(60,20,74,20,'a')+dH(60,8)))),
hinge:()=>`${dL(60,46,58,66)}${dL(58,66,58,86)}${dR(60,46,75,0,dL(60,46,60,20)+dH(60,12)+dR(60,20,-75,0,dL(60,20,60,46,'a')+dB(60,49)))}`,
calf:()=>dT(0,0,0,-7,`${dH(60,14)}${dL(60,22,60,50)}${dL(60,50,60,82)}${dL(60,82,68,86)}`),
plank:()=>`${dH(16,58)}${dL(28,64,28,86)}${dL(100,70,104,86)}${dT(0,0,0,-2,dL(24,62,100,70))}`,
walk:()=>`<path class=bl d="M12 88h96"/>${dH(60,12)}${dL(60,20,60,46)}${dR(60,46,-28,28,dL(60,46,60,82),'wk')}${dR(60,46,28,-28,dL(60,46,60,82),'wk')}${dR(60,26,28,-28,dL(60,26,60,46,'a'),'wk')}${dR(60,26,-28,28,dL(60,26,60,46,'a'),'wk')}`};
const PAT={dbbench:'bench',bbbench:'bench',pushup:'pushup',dbpress:'ohp',pecdeck:'fly',latraise:'lat',pushdown:'pd',latpd:'pull',pullup:'pull',dbrow:'row',bbrow:'row',cablerow:'row',superman:'row',dbcurl:'curl',legpress:'lp',bbsquat:'squat',smithsq:'squat',goblet:'squat',bwsquat:'squat',lunge:'squat',dbrdl:'hinge',calf:'calf',plank:'plank',deadbug:'plank',tread:'walk'};
const demoBlock=e=>`<div class=dm><svg class=demo viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 88h104" opacity=".35"/>${DM[PAT[e[0]]]()}</svg><div class=ind><span class=ex>EXHALE</span><span class=inh>INHALE (3s controlled)</span></div><div class=m>Loop: 1s effort (exhale) · 3s controlled return (inhale). Green = weight or handle.</div></div>`;
function sheetOpen(id){const e=EX.find(x=>x[0]==id),s=$('#sheet');s.hidden=false;s.innerHTML=`<div class=box><h2>${e[1]}</h2><div class=m>${e[3]}</div>${demoBlock(e)}${guide(e)}<button data-a=cs2>Close</button></div>`}
const CE=['Treadmill','Elliptical','Stationary Bike'],CI=['Light','Moderate','Hard'];
const cardioLoad=()=>(S.cardio||[]).filter(c=>c.date==td()).reduce((a,c)=>a+c.min*({Light:.7,Moderate:1,Hard:1.5}[c.int]||1),0);
const cardioCard=()=>{const t=(S.cardio||[]).map((c,i)=>[c,i]).filter(x=>x[0].date==td()),cd=S.cd||{};
 return`<div class=card><b>Cardio Log</b><div class=m>${weeks()==0?'Week 1: Light only, max 15 min. ':''}Heavy cardio trims today's lifting sets.</div><div class=grid style="margin-top:8px"><label class=f>Minutes<input id=cmin type=number inputmode=numeric placeholder="20"></label><label class=f>Equipment<select id=ceq>${CE.map(x=>`<option ${cd.eq==x?'selected':''}>${x}</option>`).join('')}</select></label></div><div class=m style="margin-top:8px">Intensity</div>${CI.map(x=>`<span class="chip ${(cd.int||'Light')==x?'on':''}" data-a=cint data-v=${x}>${x}</span>`).join('')}<button class=fin data-a=clog>Log cardio</button>${t.map(([c,i])=>`<div class=row><span>${c.eq} · ${c.min} min · ${c.int}</span><button class=ghost data-a=cdel data-i=${i}>✕</button></div>`).join('')}</div>`};
const cardioStats=()=>{const C=S.cardio||[],ce={};C.forEach(c=>ce[c.eq]=(ce[c.eq]||0)+c.min);const wk=C.filter(c=>Date.now()-new Date(c.date)<7*864e5).reduce((a,c)=>a+c.min,0);return`<h2>Cardio</h2><div class=card><div class=grid><div class=stat><b>${C.reduce((a,c)=>a+c.min,0)}</b><span>Total min</span></div><div class=stat><b>${wk}</b><span>Last 7 days (min)</span></div></div>${bch(Object.entries(ce))}</div>`};
const tgt=()=>{const n=nSets();return weeks()==0?`${n}×12 light (~50% effort) · technique, posture, 3s down`:found()?`${n}×12 · stop 3–4 reps short of failure`:`${n}×8–12`};
const cap=k=>k[0].toUpperCase()+k.slice(1);
const RNG={neck:[.215,.245],shoulders:[.62,.70],chest:[.53,.60],biceps:[.19,.23],forearms:[.15,.17],waist:[.40,.50],hips:[.52,.57],thighs:[.30,.36],calves:[.20,.23]};
const FEM={neck:.85,shoulders:.9,chest:.9,biceps:.85,forearms:.88,waist:.9,hips:1.05,thighs:1.05,calves:.95};
const TAG={shoulders:'shoulders',chest:'chest',biceps:'arms',forearms:'arms',thighs:'legs',calves:'calves',waist:'belly'};
function stat(k){const h=S.p.height,v=S.m[k];if(!h||!v)return null;const f=S.p.gender=='female'?FEM[k]:1,lo=RNG[k][0]*h*f,hi=RNG[k][1]*h*f;return{v,lo,hi,s:v<lo?-1:v>hi?1:0}}
const isBad=(k,s)=>k=='waist'?s.s>0:s.s<0;
function badge(k){const s=stat(k);if(!s)return'<span class=m>add height + value</span>';
 const bad=isBad(k,s),t=bad?(k=='waist'?'Priority: Reduce':'Priority Growth Area'):s.s?(s.s<0?'Lean':'Dominant'):'Optimal',c=bad?'bad':s.s?'up':'ok',a=s.lo*.85,R=s.hi*1.15-a,pc=x=>Math.max(0,Math.min(100,(x-a)/R*100));
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
const prog=di=>{const L=S.logs[td()+':'+di]||{},n=nSets();let t=0,c=0;S.plan[di].ex.forEach(id=>{const a=L[id]||[];t+=Math.max(n,a.length);a.forEach(s=>s&&s.d&&c++)});return[c,t]};
const bar=di=>{const[n,t]=prog(di),p=t?Math.round(n/t*100):0;return`<div class=pbw><div class=pbf style="width:${p}%"></div></div><div class=m>${n}/${t} sets done · ${p}%</div>`};
const g=p=>p.split('.').reduce((o,k)=>o&&o[k],S);
const fld=(p,l,t='number')=>`<label class="f">${l}<input data-p="${p}" type="${t}" step="any" inputmode="decimal" value="${g(p)??''}"></label>`;
const sw=(p,l)=>`<div class="card eq"><b>${l}</b><input class="sw" type="checkbox" data-p="${p}" ${g(p)?'checked':''}></div>`;
function anHTML(){const a=analyze();let h=(a.pri.length?'<h2>Priority areas</h2>'+a.pri.map(k=>`<span class="chip pri">${k}</span>`).join(''):'')+'<h2>Analysis</h2>';
 if(a.bmi)h+=`<div class="card grid"><div class="stat"><b>${a.bmi.toFixed(1)}</b><span>BMI</span></div><div class="stat"><b>${a.lo.toFixed(0)}–${a.hi.toFixed(0)}kg</b><span>Healthy weight range</span></div></div>`;
 h+=tw()+a.ratios.map(r=>`<div class="card row"><span>${r[0]}</span><b style="text-align:right">${r[1]} <span class=m>${r[2]}</span></b></div>`).join('');
 h+=a.flags.length?a.flags.map(f=>`<div class="warn">⚠ ${f[1]}</div>`).join(''):'<p class=m>Enter measurements to see lagging areas. Flags auto-prioritise exercises.</p>';return h}
const V={
dash(){const a=analyze(),n=Object.keys(S.logs).filter(k=>Object.values(S.logs[k]).some(s=>s.some(x=>x&&x.d))).length,w=weeks(),ti=todayIdx(),di=S.plan?(ti>=0?ti:nextIdx()):-1;
 const c=!S.plan?'<p>No routine yet.</p><button data-t=rout>Build routine</button>':`<b>${ti>=0?'Today':'Rest day · Next up'}: ${S.plan[di].name}</b><div class=m>${S.plan[di].ex.map(id=>EX.find(x=>x[0]==id)[1]).join(' · ')}</div><div id=pb class=pbx>${bar(di)}</div><button data-a=go data-d=${di}>${ti>=0?"Start Today's Workout":'Train Anyway'}</button>`;
 return`<h1>ForgeFit</h1><div class=card><b>Week ${w+1}</b> · ${w<2?'Foundation & Re-conditioning':'Main Phase'}</div><div class=card>${c}</div>
 <div class="card grid"><div class=stat><b>${n}</b><span>Sessions logged</span></div><div class=stat><b>${a.bmi?a.bmi.toFixed(1):'–'}</b><span>BMI</span></div></div>
 <h2>Focus areas</h2>${focus().map(f=>`<span class="chip on">${(GOALS.find(x=>x[0]==f)||[0,f])[1]}</span>`).join('')||'<p class=m>Set goals in Measurements.</p>'}`},
meas(){return`<h1>Measurements</h1><h2>Basics</h2><div class=grid>${fld('p.age','Age')}<label class=f>Gender<select data-p=p.gender><option value="">–</option>${['male','female'].map(x=>`<option ${S.p.gender==x?'selected':''}>${x}</option>`).join('')}</select></label>${fld('p.height','Height (cm)')}${fld('p.weight','Weight (kg)')}${fld('p.target','Target weight (kg)')}</div>
 <h2>Body (cm)</h2><div class=grid>${MEAS.map(mf).join('')}</div>
 <h2>Goals</h2>${GOALS.map(([k,l])=>`<span class="chip ${S.goals.includes(k)?'on':''}" data-a=goal data-k=${k}>${l}</span>`).join('')}<div id=an>${anHTML()}</div>`},
equip(){return`<h1>Equipment</h1><p class=m>Toggle what your gym has. Routine uses only available gear.</p>${EQ.map(([id,n,i])=>`<div class=card><div class=eq>${svg(id)}<div class=ed><b>${n}</b><span class=m>${DESC[id]}</span></div><input class=sw type=checkbox data-q=${id} ${S.eq[id]?'checked':''}></div><details><summary>Exercises using it</summary><p>${EX.filter(e=>e[4].includes(id)).map(e=>e[1]).join(', ')}</p></details></div>`).join('')}`},
rout(){let h='<h1>Routine</h1><div class=card><div class=row><label class=f>Days / week<select data-p=days data-n=1>'+[2,3,4,5,6].map(x=>`<option ${S.days==x?'selected':''}>${x}</option>`).join('')+`</select></label><button data-a=gen>${S.plan?'Rebuild':'Generate'}</button></div><p class=m>Weeks 1–2 = Foundation: 2 sets, light, stop 3–4 reps short of failure. Then 3 sets.</p></div>`;
 if(!S.plan)return h;const di=sel??(todayIdx()>=0?todayIdx():nextIdx()),key=td()+':'+di;
 h+=S.plan.map((d,i)=>`<span class="chip ${i==di?'on':''}" data-a=day data-d=${i}>${d.name}</span>`).join('');
 h+=`<div class=card><div class=m>⏱ <span id=el data-k="${key}">${S.ses&&S.ses.key==key?fmt(Date.now()-S.ses.start):'0:00'}</span> · tick a set to start rest timer</div><div id=pb>${bar(di)}</div></div>`;h+=soreCard()+cardioCard();const n=nSets();
 return h+(S.plan[di].ex.length?'':'<p class=m>No available exercises. Mark equipment.</p>')+S.plan[di].ex.map(id=>exCard(id,key,n)).join('')+`<button class=fin data-a=fin data-d=${di}>Finish Workout</button>`},
ana(){const H=S.hist||[],tv=H.reduce((a,x)=>a+x.vol,0),tt=H.reduce((a,x)=>a+x.dur,0),mm={},pr={},last=H.slice(-8);
 H.forEach(x=>Object.entries(x.m||{}).forEach(([k,v])=>mm[k]=(mm[k]||0)+v));
 Object.keys(S.logs).forEach(k=>Object.entries(S.logs[k]).forEach(([id,L])=>L.forEach(s=>{if(s&&s.d&&s.t!='W'&&+s.w>0&&(!pr[id]||+s.w>pr[id].w||(+s.w==pr[id].w&&+s.r>pr[id].r)))pr[id]={w:+s.w,r:+s.r||0}})));
 return`<h1>Analytics</h1>${tw()}<div class="card grid"><div class=stat><b>${H.length}</b><span>Workouts</span></div><div class=stat><b>${Math.round(tv).toLocaleString()}</b><span>Volume (${S.set.unit})</span></div><div class=stat><b>${fmt(tt)}</b><span>Total time</span></div><div class=stat><b>${H.length?fmt(tt/H.length):'–'}</b><span>Avg session</span></div></div>
 <h2>Volume · last ${last.length} sessions</h2><div class=card>${bch(last.map(x=>[x.date.slice(5),x.vol,Math.round(x.vol)]))}</div>
 <h2>Sets per muscle · all time</h2><div class=card>${bch(Object.entries(mm).sort((a,b)=>b[1]-a[1]))}</div>
 ${cardioStats()}<h2>Personal records</h2><div class=card>${Object.entries(pr).sort((a,b)=>b[1].w-a[1].w).slice(0,8).map(([id,p])=>`<div class=row><span>${EX.find(x=>x[0]==id)[1]}</span><b style="text-align:right">${p.w}${S.set.unit} × ${p.r}</b></div>`).join('')||'<p class=m>No records yet.</p>'}</div>`},
set(){return`<h1>Settings</h1>${sw('set.timer','Rest timer')}${sw('set.sound','Timer sound')}${sw('set.vibe','Timer vibration')}<div class="card row"><span>Weight unit</span><select data-p=set.unit><option ${S.set.unit=='kg'?'selected':''}>kg</option><option ${S.set.unit=='lbs'?'selected':''}>lbs</option></select></div>
 <div class=card><b>Daily 4:30 PM reminder</b><p class=m>Fires only while app is open or installed and running. Status: ${'Notification' in window?Notification.permission:'unsupported'}</p><button data-a=notif>Enable reminders</button></div>
 <h2>Backup</h2><div class=row><button data-a=exp>Export Backup JSON</button><button class=ghost data-a=imp>Import Backup JSON</button></div><h2>Danger</h2><button class=red data-a=reset>Erase all data</button>`}};
const TABS=[['dash','Home','📊'],['meas','Body','📏'],['equip','Gear','🏋️'],['rout','Routine','📅'],['ana','Stats','📈'],['set','Settings','⚙️']];
function render(){$('#app').innerHTML=V[tab]();$('#nav').innerHTML=TABS.map(([k,l,i])=>`<button data-t=${k} class="${k==tab?'on':''}"><i>${i}</i>${l}</button>`).join('');restUI()}
const fmt=ms=>{const s=Math.floor(ms/1e3),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}h ${m}m`:`${m}:${String(s%60).padStart(2,'0')}`};
const MG=[[/spinal|lower back/,'Lower Back'],[/chest/,'Chest'],[/delt/,'Shoulders'],[/tricep/,'Triceps'],[/bicep|brachialis/,'Biceps'],[/lat|trap|back/,'Back'],[/quad/,'Quads'],[/hamstring/,'Hamstrings'],[/glute/,'Glutes'],[/calf|calves|soleus/,'Calves'],[/abs|core|hip flexor/,'Core'],[/forearm/,'Forearms'],[/cardio/,'Cardio']];
const mg=s=>{s=s.toLowerCase();const r=MG.find(x=>x[0].test(s));return r&&r[1]};
function summ(key){const L=S.logs[key]||{};let vol=0,sets=0;const m={};Object.keys(L).forEach(id=>{const q=G[id]||['','','',''];L[id].forEach(s=>{if(!s||!s.d||s.t=='W')return;sets++;vol+=(+s.w||0)*(+s.r||0);new Set((q[2]+','+q[3]).split(',').map(mg).filter(Boolean)).forEach(x=>m[x]=(m[x]||0)+1)})});return{vol,sets,m}}
function prev(id,i,cur){const ks=Object.keys(S.logs).filter(k=>k!=cur).sort().reverse();for(const k of ks){const s=((S.logs[k]||{})[id]||[])[i];if(s&&s.d&&s.w!=null&&s.w!=='')return s}return null}
function exCard(id,key,n){const e=EX.find(x=>x[0]==id),L=(S.logs[key]||{})[id]||[],c=Math.max(n,L.length),u=S.set.unit;
 let r=`<div class=card><div class=exh data-ex=${id}><b class=lnk>${e[1]} ⓘ</b><div class=m>${e[3]} · ${tgt()}</div><button class="ghost gbtn" data-a=sheet data-id=${id}>⚡ Execution & setup guide</button></div><div class="set hd"><span>SET</span><span>TYPE</span><span>${u.toUpperCase()}</span><span>REPS</span><span>✓</span></div>`;
 for(let i=0;i<c;i++){const s=L[i]||{},t=s.t||'N',p=prev(id,i,key),b=`${key}|${id}|${i}|`;
  r+=`<div class="set ${s.d?'done':''}"><span class=sn>${i+1}</span><button class="ty ${t}" data-a=ty data-l="${b}t">${t}</button><input type=number inputmode=decimal data-l="${b}w" placeholder="${p?'Last '+p.w+u:u}" value="${s.w??''}"><input type=number inputmode=numeric data-l="${b}r" placeholder="${p?'× '+p.r:'reps'}" value="${s.r??''}"><input type=checkbox class=ck data-l="${b}d" ${s.d?'checked':''}></div><div class=stp>${[['w',-2.5,'−2.5'],['w',2.5,'+2.5'+u],['w',5,'+5'+u],['r',-1,'−1'],['r',1,'+1 rep']].map(x=>`<button class=ghost data-a=step data-l="${b}${x[0]}" data-v=${x[1]}>${x[2]}</button>`).join('')}</div>`}
 return r+`<button class=ghost data-a=addset data-k="${key}" data-id=${id}>+ Add Set</button></div>`}
const tw=()=>{const w=S.p.weight,t=S.p.target;if(!w||!t)return'';const d=w-t;return`<div class=card><b>Target weight</b><div class=m>${w} kg → ${t} kg · ${Math.abs(d).toFixed(1)} kg ${d>0?'to lose':d<0?'to gain':'· reached!'}</div></div>`};
const bch=rows=>{const mx=Math.max(1,...rows.map(r=>r[1]));return rows.map(([k,v,l])=>`<div class=mb><span>${k}</span><div class=mbt><i style="width:${v/mx*100}%"></i></div><b>${l??v}</b></div>`).join('')||'<p class=m>No data yet. Finish a workout.</p>'};
const nSets=()=>{let n=found()?2:(weeks()<4?3:4);const l=(S.sore||{})[td()];if(l>=4||cardioLoad()>=30)n=Math.max(weeks()==0?2:1,n-1);return n};
const soreCard=()=>{const l=(S.sore||{})[td()];return(weeks()==0?'<div class=card><b>Week 1 · Technique week</b><p class=m>2 light sets per exercise (~50% effort). Focus on posture, 3s lowering, 1s pause. No failure. Cardio today: easy, max 15 min.</p></div>':'')+(cardioLoad()>=30?'<div class=card><div class=m>⚠ Cardio fatigue today: 1 set trimmed per exercise.</div></div>':'')+`<div class=card><div class=m>Soreness today (1 fresh – 5 wrecked)</div>${[1,2,3,4,5].map(n=>`<span class="chip ${l==n?'on':''}" data-a=sore data-v=${n}>${n}</span>`).join('')}<div class=m>${l>=4?'⚠ Sore: 1 set removed per exercise. Keep loads light.':l==3?'Moderate: train as planned, warm up well.':l?'Fresh: full planned volume.':'Not set.'}</div></div>`};
const startW=di=>{tab='rout';sel=di;const k=td()+':'+di;if(!S.ses||S.ses.key!=k)S.ses={key:k,start:Date.now()};save();render()};
const FR=[['Shoulders',19,25,13,11],['Shoulders',48,25,13,11],['Chest',32,27,16,12],['Biceps',13,37,9,20],['Biceps',58,37,9,20],['Forearms',11,58,8,20],['Forearms',61,58,8,20],['Core',32,40,16,24],['Quads',29,68,10,34],['Quads',41,68,10,34],['Calves',30,106,8,30],['Calves',42,106,8,30]];
const BK=[['Shoulders',99,25,13,11],['Shoulders',128,25,13,11],['Back',112,27,16,24],['Triceps',93,37,9,20],['Triceps',138,37,9,20],['Forearms',91,58,8,20],['Forearms',141,58,8,20],['Lower Back',112,52,16,12],['Glutes',111,65,18,14],['Hamstrings',109,81,10,26],['Hamstrings',121,81,10,26],['Calves',110,110,8,26],['Calves',122,110,8,26]];
function mmap(e){const q=G[e[0]]||['','','',''],P=new Set(q[2].split(',').map(mg)),X=new Set(q[3].split(',').map(mg));
 const sh=([g,x,y,w,h])=>`<rect class="mu ${P.has(g)?'pm':X.has(g)?'sm':''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
 return`<svg class=mm viewBox="0 0 160 150"><circle class=mu cx="40" cy="13" r="9"/><circle class=mu cx="120" cy="13" r="9"/>${FR.concat(BK).map(sh).join('')}<text class=lb x="40" y="147">FRONT</text><text class=lb x="120" y="147">BACK</text></svg><p class=m><span class="bdg ok">Primary</span><span class="bdg up">Secondary</span></p>`}
let tEnd=0;
function ring(){if(S.set.sound)try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();o.stop(c.currentTime+.5)}catch(e){}if(S.set.vibe&&navigator.vibrate)navigator.vibrate([250,120,250])}
function restUI(){const r=$('#rest'),on=S.set.timer&&S.ses;r.hidden=!on;document.body.classList.toggle('resting',!!on);if(!on)return;r.innerHTML='<div class=rb><b id=rl>Rest</b><div class=rbtn><button class=ghost data-a=tm>−30s</button><button class=ghost data-a=tp>+30s</button><button data-a=t60>60s</button><button data-a=t90>90s</button><button class=red data-a=tx>Skip</button></div></div>'}
function timer(s){if(!S.set.timer)return;tEnd=Date.now()+s*1e3;restUI()}
setInterval(()=>{const l=Math.ceil((tEnd-Date.now())/1e3),e=$('#rl');if(e){if(l>0)e.textContent=l+'s';else{if(tEnd){tEnd=0;ring()}e.textContent='Rest'}}const t=$('#el');if(t&&S.ses&&t.dataset.k==S.ses.key)t.textContent=fmt(Date.now()-S.ses.start)},250);
document.addEventListener('click',e=>{const cx=e.target.closest('[data-ex]'),el=e.target.closest('[data-t],[data-a]');if(!el){if(cx)sheetOpen(cx.dataset.ex);return}const d=el.dataset;
 if(d.t){tab=d.t;return render()}
 const A={gt(){const c=el.closest('.guide');c.querySelectorAll('.tabs button,.gp').forEach(x=>x.classList.toggle('on',x.dataset.s==d.s))},go(){if(!S.sore||S.sore[td()]==null){const s=$('#sheet');s.hidden=false;s.innerHTML=`<div class=box><h2>Soreness check-in</h2><p class=m>How sore are you today? Today's sets adjust to match.</p>${[1,2,3,4,5].map(n=>`<button class="ghost sb" data-a=sore data-v=${n} data-go=${d.d}>${n} · ${['Fresh','Mild','Moderate','Very sore','Wrecked'][n-1]}</button>`).join('')}<button class=sb data-a=sore data-v=0 data-go=${d.d}>Skip</button></div>`;return}startW(+d.d)},
sore(){S.sore=S.sore||{};S.sore[td()]=+d.v;save();$('#sheet').hidden=true;d.go!=null?startW(+d.go):render()},
sheet(){sheetOpen(d.id)},
cint(){S.cd=S.cd||{};S.cd.int=d.v;save();el.parentNode.querySelectorAll('[data-a=cint]').forEach(x=>x.classList.toggle('on',x===el))},
clog(){const m=+$('#cmin').value;if(!m||m<1)return alert('Enter minutes');S.cd=S.cd||{};S.cd.eq=$('#ceq').value;S.cardio=S.cardio||[];S.cardio.push({date:td(),min:m,eq:S.cd.eq,int:S.cd.int||'Light'});save();const y=scrollY;render();scrollTo(0,y)},
cdel(){S.cardio.splice(+d.i,1);save();const y=scrollY;render();scrollTo(0,y)},
cs2(){$('#sheet').hidden=true},gen(){build();sel=null;render()},day(){sel=+d.d;render()},
 goal(){S.goals=S.goals.includes(d.k)?S.goals.filter(x=>x!=d.k):[...S.goals,d.k];save();el.classList.toggle('on');$('#an').innerHTML=anHTML()},
 t60(){S.set.rest=60;save();timer(60)},t90(){S.set.rest=90;save();timer(90)},tm(){if(tEnd>Date.now())tEnd=Math.max(Date.now()+1e3,tEnd-3e4)},tp(){tEnd=Math.max(Date.now(),tEnd)+3e4},tx(){tEnd=0;restUI()},
ty(){const[k,id,i]=d.l.split('|');S.logs[k]=S.logs[k]||{};const L=S.logs[k][id]=S.logs[k][id]||[];L[i]=L[i]||{};const t={W:'N',N:'F',F:'W'}[L[i].t||'N'];L[i].t=t;save();el.textContent=t;el.className='ty '+t},
step(){const inp=document.querySelector('input[data-l="'+d.l+'"]'),[k,id,i,f]=d.l.split('|'),p=prev(id,+i,k);let c=+inp.value;if(!inp.value&&p)c=+p[f];inp.value=Math.max(0,Math.round((c+ +d.v)*100)/100);inp.dispatchEvent(new Event('change',{bubbles:true}))},
addset(){S.logs[d.k]=S.logs[d.k]||{};const L=S.logs[d.k][d.id]=S.logs[d.k][d.id]||[];L[Math.max(nSets(),L.length)]={};save();const y=scrollY;render();scrollTo(0,y)},
fin(){const key=td()+':'+d.d,r=summ(key),dur=S.ses&&S.ses.key==key?Date.now()-S.ses.start:0,e=Object.entries(r.m).sort((a,b)=>b[1]-a[1]),mx=e.length?e[0][1]:1;S.hist=S.hist||[];S.hist.push({date:td(),vol:r.vol,sets:r.sets,dur,m:r.m});S.ses=null;save();tEnd=0;restUI();
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
