
(function(){
  var el=document.getElementById('typeWord'); if(!el) return;
  var words=['designs','brands','ads','websites','launches'];
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){ el.textContent=words[0]; return; }
  var wi=0,ci=words[0].length,del=true;
  function tick(){
    var w=words[wi];
    if(!del){ ci++; el.textContent=w.slice(0,ci);
      if(ci>=w.length){ del=true; return setTimeout(tick,1500); }
      return setTimeout(tick,78+Math.random()*55);
    }
    ci--; el.textContent=w.slice(0,ci);
    if(ci<=0){ del=false; wi=(wi+1)%words.length; return setTimeout(tick,260); }
    setTimeout(tick,42);
  }
  setTimeout(tick,1600);
})();
(function(){
  var base=document.getElementById('stretchWord'); if(!base) return;
  if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var L=[].slice.call(base.querySelectorAll('.rl'));
  var st=L.map(function(){return {s:1};}), C=[];
  function measure(){ C=L.map(function(el){var r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:el.offsetWidth};}); }
  measure(); addEventListener('resize',measure); addEventListener('scroll',measure,{passive:true});
  var mx=-9999,my=-9999,on=false,R=240, hero=document.querySelector('.hero'), chip=document.getElementById('stretchVal');
  if(!hero) return;
  hero.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;on=true;});
  hero.addEventListener('pointerleave',function(){on=false;});
  function frame(){
    var peak=1,i,extra=[],T=0;
    for(i=0;i<L.length;i++){
      var ts=1,c=C[i];
      if(on&&c){ var dx=mx-c.x,dy=my-c.y,d=Math.sqrt(dx*dx+dy*dy),inf=Math.max(0,1-d/R); inf*=inf; ts=1+inf*0.40; }
      var s=st[i]; s.s+=(ts-s.s)*0.16;
      if(s.s>peak)peak=s.s;
      var ex=(c?c.w:0)*(s.s-1); extra[i]=ex; T+=ex;
    }
    var run=0;
    for(i=0;i<L.length;i++){
      var tx=run+extra[i]/2-T/2;
      L[i].style.transform='translateX('+tx.toFixed(2)+'px) scaleX('+st[i].s.toFixed(3)+')';
      run+=extra[i];
    }
    if(chip) chip.textContent=Math.round(peak*100)+'%';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
