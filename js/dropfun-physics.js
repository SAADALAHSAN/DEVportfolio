
(function(){
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 var btn=document.getElementById('dropBtn'),stage=document.getElementById('dropStage');if(!btn||!stage)return;var btnT=btn.querySelector('.dbt'),labEl=document.querySelector('#dropfun .df-lab');
 var M=Matter,engine=null,render=null,runner=null,bodies=[],CAP=180,started=false,fadingAll=false,taps=0,gflip=false,walkers=[],rafId=null,last=0,actx=null;
 var COLORS=['#F0531C','#0D99FF','#FFFFFF','#14202B','#FFE0CC'];
 var HEARTS=[];
 var STARS=['#F0531C','#0D99FF','#FFD23F','#FFFFFF'];
 function tex(svg){return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);}
 
 function starSVG(c){return "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><path d='M50 6 L61 38 95 38 67 58 78 90 50 70 22 90 33 58 5 38 39 38 Z' fill='"+c+"'/></svg>";}
 function spriteBody(x,y,r,svg){var b=M.Bodies.circle(x,y,r,{restitution:0.5,friction:0.35,frictionAir:0.004});b.render.sprite.texture=tex(svg);var sc=(2*r)/100;b.render.sprite.xScale=sc;b.render.sprite.yScale=sc;return b;}
 var LIFE=6500;
 function fade(){if(!engine)return;var now=Date.now();for(var i=bodies.length-1;i>=0;i--){var bb=bodies[i];if(fadingAll||now-(bb._born||now)>LIFE){var dec=fadingAll?0.06:0.045;var o=(bb.render.opacity==null?1:bb.render.opacity)-dec;bb.render.opacity=o;if(o<=0.05){M.World.remove(engine.world,bb);bodies.splice(i,1);}}}}
 function W(){return window.innerWidth;}function H(){return window.innerHeight;}
 var walls=[];
 function buildWalls(){if(walls.length){M.World.remove(engine.world,walls);walls=[];}var t=140;walls=[M.Bodies.rectangle(W()/2,H()+t/2,W()+400,t,{isStatic:true}),M.Bodies.rectangle(-t/2,H()/2,t,H()*3,{isStatic:true}),M.Bodies.rectangle(W()+t/2,H()/2,t,H()*3,{isStatic:true})];M.World.add(engine.world,walls);}
 function opts(col){return {restitution:0.45,friction:0.4,frictionAir:0.004,render:{fillStyle:col,strokeStyle:'rgba(20,32,43,0.16)',lineWidth:1}};}
 var CHIPWORDS=['ship it','final_FINAL','final_v7','make it pop','logo bigger','more whitespace','LGTM','circle back','no further questions','unbothered','looks AI-generated','the AI did it','needs vibes','5 min fix','one more round','client loves it','just kerning','send it','approved','trust me','low-key slaps','v2 (final)','touch grass','per my last email'];
 var CHIPBG=['#F0531C','#0D99FF','#14202B','#FFFFFF'];
 function esc(t){return (''+t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
 function chipBody(x,y){var label=CHIPWORDS[Math.floor(Math.random()*CHIPWORDS.length)];var bg=CHIPBG[Math.floor(Math.random()*CHIPBG.length)];var fg=(bg==='#FFFFFF')?'#14202B':'#FFFFFF';var h=34,ch=8.6,pad=15;var w=Math.max(58,Math.round(label.length*ch+pad*2));var R=h/2;var stroke=(bg==='#FFFFFF')?'rgba(20,32,43,0.18)':'rgba(255,255,255,0.16)';var svg="<svg xmlns='http://www.w3.org/2000/svg' width='"+(w*2)+"' height='"+(h*2)+"' viewBox='0 0 "+w+" "+h+"'><rect x='0.75' y='0.75' width='"+(w-1.5)+"' height='"+(h-1.5)+"' rx='"+(R-0.75)+"' fill='"+bg+"' stroke='"+stroke+"'/><text x='"+(w/2)+"' y='"+(h/2+1)+"' font-family='Outfit,Arial,sans-serif' font-size='15' font-weight='700' fill='"+fg+"' text-anchor='middle' dominant-baseline='central'>"+esc(label)+"</text></svg>";var b=M.Bodies.rectangle(x,y,w,h,{restitution:0.5,friction:0.35,frictionAir:0.004,chamfer:{radius:R}});b.render.sprite.texture=tex(svg);b.render.sprite.xScale=0.5;b.render.sprite.yScale=0.5;return b;}
 function react(){var bl='Do not click';if(taps>=30)bl='Make it stop';else if(taps>=22)bl='Touch grass';else if(taps>=15)bl='Unbothered. Moisturized.';else if(taps>=10)bl='No further questions';else if(taps>=6)bl='This is your job now';else if(taps>=3)bl='Oh, you are committed';else if(taps>=1)bl='Again';if(btnT)btnT.textContent=bl;}
 function flipGravity(){if(!engine||gflip)return;gflip=true;engine.world.gravity.y=-1.1;for(var i=0;i<bodies.length;i++){M.Body.setVelocity(bodies[i],{x:(Math.random()-0.5)*6,y:-7-Math.random()*5});M.Body.setAngularVelocity(bodies[i],(Math.random()-0.5)*0.5);}setTimeout(function(){if(engine)engine.world.gravity.y=1;gflip=false;},900);}
 var EMO=['🦆','🐥','🐢','🦖','🐌','🐹','🐸','🦦','🦔','🐔','🦩','🐙','🦥','🐱','🐶','🦫','🐤','🦀','🍕','🍩','👻','🤖'];
 function pickEmo(){return EMO[Math.floor(Math.random()*EMO.length)];}
 function setFace(k){k.flip.style.transform=k.dir<0?'scaleX(-1)':'none';}
 function squash(k){k.body.classList.remove('bumped');void k.body.offsetWidth;k.body.classList.add('bumped');setTimeout(function(){k.body.classList.remove('bumped');},340);}
 function mark(k){var W=['hey!','rude!','stop that','do you mind?','quit it','excuse you','ow!','personal space!','not cool','HEY','knock it off','what?!','ugh','stop poking me','squawk!','oi!','beep!','eep!'];var m=document.createElement('span');m.className='bump-mk';m.textContent=W[Math.floor(Math.random()*W.length)];k.wrap.appendChild(m);setTimeout(function(){if(m.parentNode)m.parentNode.removeChild(m);},620);}
 function blip(){try{if(!actx){actx=new (window.AudioContext||window.webkitAudioContext)();}if(actx.state==='suspended'){actx.resume();}var t=actx.currentTime,o=actx.createOscillator(),gn=actx.createGain(),base=300+Math.random()*520;o.type=(Math.random()<0.5?'square':'triangle');o.frequency.setValueAtTime(base,t);o.frequency.exponentialRampToValueAtTime(base*(1.5+Math.random()*0.8),t+0.09);gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(0.07,t+0.012);gn.gain.exponentialRampToValueAtTime(0.0001,t+0.2);o.connect(gn);gn.connect(actx.destination);o.start(t);o.stop(t+0.22);}catch(e){}}
 function poke(k){if(k.dead)return;mark(k);squash(k);blip();k.bumpUntil=(window.performance&&performance.now?performance.now():Date.now())+170;}
 
 function fadeOut(k){if(k.leaving)return;k.leaving=true;k.wrap.style.transition='opacity .55s ease';k.wrap.style.opacity='0';setTimeout(function(){k.dead=true;},560);}
 function loop(ts){var vw=window.innerWidth,i,a,b;if(!last)last=ts;var dt=Math.min(50,ts-last)/1000;last=ts;
  for(i=0;i<walkers.length;i++){var k=walkers[i];if(ts>=k.bumpUntil){k.x+=k.dir*k.speed*dt;}k.phase+=dt*9;var bob=Math.sin(k.phase)*2.5;k.wrap.style.transform='translate('+k.x+'px,'+(k.y0+bob)+'px) rotate('+(Math.sin(k.phase)*6)+'deg)';if(!k.leaving&&ts-k.born>14000){fadeOut(k);}if((k.dir>0&&k.x>vw+k.w+90)||(k.dir<0&&k.x<-k.w-170)){k.dead=true;}}
  
  for(i=walkers.length-1;i>=0;i--){if(walkers[i].dead){if(walkers[i].wrap.parentNode)walkers[i].wrap.parentNode.removeChild(walkers[i].wrap);walkers.splice(i,1);}}
  if(walkers.length){rafId=requestAnimationFrame(loop);}else{rafId=null;last=0;}}
 function spawnCapy(){var vw=window.innerWidth,vh=window.innerHeight;var dir=Math.random()<0.5?1:-1;var wpx=52+Math.random()*40;var hpx=wpx;var y0=vh*(0.34+Math.random()*0.42);var g=Math.random()<0.32;var wrap=document.createElement('div');wrap.className='capy';wrap.style.width=wpx+'px';var flip=document.createElement('div');flip.className='cflip';var body=document.createElement('div');body.className='cbody';body.textContent=pickEmo();body.style.fontSize=wpx+'px';flip.appendChild(body);wrap.appendChild(flip);stage.appendChild(wrap);var x=dir>0?(-wpx-40):(vw+40);var k={wrap:wrap,flip:flip,body:body,x:x,y0:y0,w:wpx,h:hpx,dir:dir,speed:62+Math.random()*72,phase:Math.random()*6,bumpUntil:0,born:(window.performance&&performance.now?performance.now():Date.now()),dead:false,leaving:false};setFace(k);wrap.style.transform='translate('+x+'px,'+y0+'px)';wrap.addEventListener('click',function(){poke(k);});wrap.addEventListener('touchstart',function(){poke(k);},{passive:true});walkers.push(k);if(walkers.length>18){fadeOut(walkers[0]);}if(!rafId){last=0;rafId=requestAnimationFrame(loop);}}
 function start(){if(started)return;started=true;engine=M.Engine.create();engine.world.gravity.y=1;render=M.Render.create({element:stage,engine:engine,options:{width:W(),height:H(),background:'transparent',wireframes:false,pixelRatio:window.devicePixelRatio||1}});buildWalls();runner=M.Runner.create();M.Runner.run(runner,engine);M.Render.run(render);M.Events.on(engine,'afterUpdate',fade);window.addEventListener('resize',function(){render.options.width=W();render.options.height=H();render.canvas.width=W()*(window.devicePixelRatio||1);render.canvas.height=H()*(window.devicePixelRatio||1);M.Render.lookAt(render,{min:{x:0,y:0},max:{x:W(),y:H()}});buildWalls();});}
 function rain(){taps++;spawnCapy();if(Math.random()<0.4){setTimeout(spawnCapy,220+Math.random()*420);}react();}
 btn.addEventListener('click',rain);
 var sect=document.getElementById('dropfun');
 if(sect&&('IntersectionObserver' in window)){var io2=new IntersectionObserver(function(es){fadingAll=!es[0].isIntersecting;},{threshold:0});io2.observe(sect);}
})();
