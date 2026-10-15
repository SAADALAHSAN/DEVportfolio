
/* orange buttons: magnetic chip-morph */
(function(){
  if(!(window.matchMedia&&matchMedia('(pointer:fine)').matches))return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  function clamp(v,m){return Math.max(-m,Math.min(m,v));}
  [].slice.call(document.querySelectorAll('.btn:not(.ghost):not(.df-btn)')).forEach(function(b){
    var lx=0,ly=0,pressed=false;
    function render(){b.style.transform='translate('+lx.toFixed(1)+'px,'+ly.toFixed(1)+'px)'+(pressed?' scale(.96)':'');}
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();lx=clamp((e.clientX-r.left-r.width/2)*0.28,14);ly=clamp((e.clientY-r.top-r.height/2)*0.4,10);render();});
    b.addEventListener('pointerleave',function(){lx=0;ly=0;pressed=false;b.style.transform='';});
    b.addEventListener('pointerdown',function(){pressed=true;render();});
    window.addEventListener('pointerup',function(){if(pressed){pressed=false;render();}});
  });
})();
